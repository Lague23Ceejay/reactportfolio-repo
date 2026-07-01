// src/hooks/useImageUpload.ts

import { useState } from 'react';
import { optimizeImage } from '../utils/imageOptimizer';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<string | null> => {
    // 🚀 FIXED ARCHITECTURE: Support both standard web graphics AND loopable background audio tracks
    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');

    if (!isImage && !isAudio) {
      setUploadError('Invalid File Protocol: Provide a supported image or audio asset track.');
      return null;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      let binaryPayload: Blob | File = file;
      let filename = '';

      // Clean the standard file properties to prevent CDN deployment naming errors
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");

      /* ==========================================================================
         A. CONDITIONAL ENGESTION ROUTING FOR GRAPHICS VS SOUND
         ========================================================================== */
      if (isImage) {
        // Run your lightweight browser canvas compression loop to protect your serverless limits
        binaryPayload = await optimizeImage(file, maxWidth, quality);
        filename = `${Date.now()}-${cleanName}.webp`;
      } else {
        // For audio (.mp3, .ogg), skip image optimization completely and use raw file body binaries
        binaryPayload = file;
        filename = `audio-${Date.now()}-${cleanName}.${file.name.split('.').pop() || 'mp3'}`;
      }

      /* ==========================================================================
         B. UNIFIED CDN STREAM INGESTION LIFECYCLE
         ========================================================================== */
      // Your backend proxy API route streams both image blobs and audio payloads effortlessly
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'x-filename': filename,
          'Content-Type': isImage ? 'image/webp' : file.type || 'audio/mpeg',
        },
        body: binaryPayload, // Streams the correct binary context straight up to Vercel Blob
      });

      if (!response.ok) {
        throw new Error(`Cloud storage proxy transmission failed: ${response.status}`);
      }

      const blobResult = await response.json();
      return blobResult.url; // Returns the public production-ready static cloud url string!

    } catch (error: any) {
      console.error("Unified cloud sync subsystem exception:", error);
      setUploadError(error.message || 'Media injection failure context.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, uploadError };
};
