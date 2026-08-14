// api/get-content.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const DATA_PATHNAME = 'cms/portfolio-data.json';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');

  try {
    const { blobs } = await list({ prefix: DATA_PATHNAME, limit: 1 });
    const existing = blobs.find((b) => b.pathname === DATA_PATHNAME);
    if (existing) {
      const blobRes = await fetch(`${existing.url}?t=${Date.now()}`, { cache: 'no-store' });
      if (blobRes.ok) {
        return res.status(200).json(await blobRes.json());
      }
    }
  } catch (error) {
    console.error('get-content: Blob lookup failed, falling back to seed file', error);
  }

  // Nothing saved yet — serve the file committed in the repo as the initial state.
  try {
    const seedPath = path.join(process.cwd(), 'public', 'data.json');
    return res.status(200).json(JSON.parse(fs.readFileSync(seedPath, 'utf-8')));
  } catch (error: any) {
    return res.status(500).json({ error: 'No content available.', details: error.message });
  }
}