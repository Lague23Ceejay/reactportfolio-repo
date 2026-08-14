import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react'; // Changed to matching template bundler plugin
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import type { IncomingMessage } from 'http';

const LOCAL_DATA_DIR = path.resolve(__dirname, '.local-data');
const LOCAL_DATA_PATH = path.join(LOCAL_DATA_DIR, 'portfolio-data.json');
const SEED_PATH = path.resolve(__dirname, 'public', 'data.json');

const DATA_URI_PATTERN = /^data:[a-z0-9.+-]+\/[a-z0-9.+-]+;base64,/i;
const LONG_STRING_THRESHOLD = 300_000;

function findEmbeddedMedia(value: unknown, trail = ''): string | null {
  if (typeof value === 'string') {
    if (DATA_URI_PATTERN.test(value) || value.length > LONG_STRING_THRESHOLD) return trail || '(root)';
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

function readLocalContent(): Record<string, unknown> {
  if (fs.existsSync(LOCAL_DATA_PATH)) {
    return JSON.parse(fs.readFileSync(LOCAL_DATA_PATH, 'utf-8'));
  }
  return JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
}

function writeLocalContent(content: Record<string, unknown>) {
  if (!fs.existsSync(LOCAL_DATA_DIR)) fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(content, null, 2));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

/**
 * Local-only stand-ins for /api/get-content and /api/save-content so the
 * admin panel and main page work end-to-end during plain `npm run dev`,
 * without needing `vercel dev` or a real Blob token. Content is persisted to
 * .local-data/portfolio-data.json (gitignored). This plugin only runs in the
 * dev server (`apply: 'serve'`) - production builds and the real deployed
 * site are untouched and keep using the actual /api/*.ts functions.
 */
function localApiPlugin(): Plugin {
  return {
    name: 'local-content-api',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();
        const [urlPath] = req.url.split('?');

        if (urlPath === '/api/get-content' && req.method === 'GET') {
          try {
            const content = readLocalContent();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store, must-revalidate');
            res.end(JSON.stringify(content));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Local dev content read failed.', details: err.message }));
          }
          return;
        }

        if (urlPath === '/api/save-content' && req.method === 'POST') {
          try {
            const raw = await readBody(req);
            const { sections } = JSON.parse(raw || '{}') as { sections?: Record<string, unknown> };
            if (!sections || typeof sections !== 'object' || Object.keys(sections).length === 0) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing "sections" payload.' }));
              return;
            }

            const embeddedHit = findEmbeddedMedia(sections);
            if (embeddedHit) {
              res.statusCode = 413;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'Embedded image/file data detected in a text field.',
                details: `Found unexpectedly large or base64-encoded content at "${embeddedHit}". Use the upload controls instead of pasting images/files directly into a text field.`
              }));
              return;
            }

            const current = readLocalContent();
            const merged = { ...current, ...sections };
            writeLocalContent(merged);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, content: merged }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Local dev content save failed.', details: err.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localApiPlugin(),
  ],
});