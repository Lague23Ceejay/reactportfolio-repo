// api/save-content.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { PortfolioSchema } from '../src/types/portfolioSchema.js';

// Fixed pathname (no random suffix) so the same Blob URL is reused on every save —
// this is what makes updates instant/"real-time": no git commit, no rebuild.
const DATA_PATHNAME = 'cms/portfolio-data.json';

// Per-request cap. Real section payloads (a hero object, a contact object, etc.)
// are a few KB; anything past this is almost always a pasted image/file, not
// legitimate content, so we reject with a clear reason instead of a bare 413.
const MAX_SECTION_BYTES = 2 * 1024 * 1024; // 2MB

const DATA_URI_PATTERN = /^data:[a-z0-9.+-]+\/[a-z0-9.+-]+;base64,/i;
const LONG_STRING_THRESHOLD = 300_000; // ~300KB of text in a single field is never legitimate copy

function findEmbeddedMedia(value: unknown, trail = ''): string | null {
  if (typeof value === 'string') {
    if (DATA_URI_PATTERN.test(value) || value.length > LONG_STRING_THRESHOLD) {
      return trail || '(root)';
    }
    return null;
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const hit = findEmbeddedMedia(value[i], `${trail}[${i}]`);
      if (hit) return hit;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      const hit = findEmbeddedMedia(v, trail ? `${trail}.${key}` : key);
      if (hit) return hit;
    }
  }
  return null;
}

async function readCurrentContent(): Promise<Record<string, unknown>> {
  try {
    const { blobs } = await list({ prefix: DATA_PATHNAME, limit: 1 });
    const existing = blobs.find((b) => b.pathname === DATA_PATHNAME);
    if (existing) {
      const blobRes = await fetch(`${existing.url}?t=${Date.now()}`, { cache: 'no-store' });
      if (blobRes.ok) return await blobRes.json();
    }
  } catch {
    // fall through to the repo's seed file below
  }
  // First save ever (or Blob store empty): seed from the file committed in the repo.
  const seedPath = path.join(process.cwd(), 'public', 'data.json');
  return JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sections } = (req.body ?? {}) as { sections?: Record<string, unknown> };
  if (!sections || typeof sections !== 'object' || Array.isArray(sections) || Object.keys(sections).length === 0) {
    return res.status(400).json({ error: 'Missing "sections" payload — send only the top-level keys you changed.' });
  }

  const payloadBytes = Buffer.byteLength(JSON.stringify(sections));
  if (payloadBytes > MAX_SECTION_BYTES) {
    return res.status(413).json({
      error: 'This section is too large to save.',
      details: `Payload is ${(payloadBytes / 1024 / 1024).toFixed(2)}MB. This almost always means an image or file got pasted directly into a text field. Please remove it and use the upload control instead — uploads go to Blob storage and only a URL gets saved.`
    });
  }

  const embeddedHit = findEmbeddedMedia(sections);
  if (embeddedHit) {
    return res.status(413).json({
      error: 'Embedded image/file data detected in a text field.',
      details: `Found unexpectedly large or base64-encoded content at "${embeddedHit}". Please use the upload controls (they store the file in Blob storage and insert a URL) instead of pasting images or files directly into a text field.`
    });
  }

  // Validate each provided top-level key against its own schema shape.
  const shapes = PortfolioSchema.shape as Record<string, any>;
  for (const key of Object.keys(sections)) {
    const shape = shapes[key];
    if (!shape) {
      return res.status(400).json({ error: `Unknown section "${key}".` });
    }
    const parsed = shape.safeParse(sections[key]);
    if (!parsed.success) {
      return res.status(400).json({ error: `Invalid data for "${key}".`, details: parsed.error.format() });
    }
  }

  try {
    const current = await readCurrentContent();
    const merged = { ...current, ...sections };

    const fullParse = PortfolioSchema.safeParse(merged);
    if (!fullParse.success) {
      return res.status(400).json({ error: 'Merged content failed validation.', details: fullParse.error.format() });
    }

    await put(DATA_PATHNAME, JSON.stringify(fullParse.data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true
    });

    // Return the merged doc so the client can sync state without a second round trip.
    return res.status(200).json({ success: true, content: fullParse.data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to persist content.', details: error.message });
  }
}