// api/upload-token.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

// This route only ever exchanges small JSON (a pathname + content type) for a
// short-lived upload token — the actual file bytes go straight from the
// browser to Blob storage and never pass through this function. Default
// bodyParser (JSON) is correct here; do NOT disable it.
export const config = {
  api: {
    bodyParser: true
  }
};

// Overall ceiling for any single upload going through this route (images,
// audio, video, and documents alike). Well above what any of our client-side
// per-type checks allow, this is just a hard backstop.
const MAX_UPLOAD_BYTES = 30 * 1024 * 1024; // 30MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `HTTP Method ${req.method} not allowed.` });
  }

  const body = req.body as HandleUploadBody;

  // Diagnostic: if this route ever gets flagged for a large payload again,
  // this log line (visible in Vercel's function logs) will show exactly how
  // large the actual incoming request was — this route should only ever see
  // a few hundred bytes of JSON.
  const contentLength = req.headers['content-length'];
  console.log('upload-token: incoming request size (bytes):', contentLength ?? 'unknown');

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            'image/*',
            'audio/*',
            'video/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream'
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_UPLOAD_BYTES
        };
      }
      // No onUploadCompleted — we don't need server-side bookkeeping per
      // upload, and omitting it avoids Vercel Blob's callback-URL resolution
      // step entirely (one less moving part, and one less thing that can
      // behave differently between local/preview/production environments).
    });

    return res.status(200).json(jsonResponse);
  } catch (error: any) {
    console.error('Blob client-upload token error:', error);
    return res.status(400).json({ error: error?.message || 'Could not generate upload token.' });
  }
}