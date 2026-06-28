// api/upload-image.ts

import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: false, // Reads raw binary data chunk streams directly
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `HTTP Method ${req.method} not allowed.` });
  }

  try {
    const filename = (req.headers['x-filename'] as string) || `upload-${Date.now()}.webp`;
    const contentType = req.headers['content-type'] || 'image/webp';

    /* ==========================================================================
       🚀 MODIFIED: REMOVED MANUAL TOKEN BINDING KEY FOR OIDC COMPATIBILITY
       ========================================================================== */
    // The put utility automatically consumes the local Vercel OIDC Token variables
    // dropped by your env pull tool without needing manual environment token assignments.
    const blobResult = await put(filename, req, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: true,
    });

    return res.status(200).json(blobResult);

  } catch (error: any) {
    console.error("Vercel Blob serverless ingestion error:", error);
    return res.status(500).json({ 
      error: "Internal Media Storage Exception", 
      message: error?.message || "OIDC pipeline streaming fault." 
    });
  }
}
