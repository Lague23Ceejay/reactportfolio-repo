// api/upload-token.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

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
      },
      onUploadCompleted: async () => {
        // No server-side bookkeeping needed — the client receives the blob
        // URL directly from `upload()` and stores it in the draft itself.
      }
    });

    return res.status(200).json(jsonResponse);
  } catch (error: any) {
    console.error('Blob client-upload token error:', error);
    return res.status(400).json({ error: error?.message || 'Could not generate upload token.' });
  }
}