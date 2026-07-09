// src/components/admin/AdminGraduationManager.tsx
import React, { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { FiAward, FiEye, FiEyeOff, FiUpload } from 'react-icons/fi';
import { optimizeImage } from '../../utils/imageOptimizer'; // Imported utility

export function AdminGraduationManager() {
  const { draft, updateDraft } = usePortfolioStore();
  const [isUploading, setIsUploading] = useState(false); // Tracks cloud upload state

  if (!draft) return null;
  
  const defaultGraduation = {
    isEnabled: true,
    badgeText: "Class of 2026 Launch Pad",
    title: "Welcome to My Digital Portal! 👋",
    subtitle: "BS in Information Systems — Graduating Tomorrow!",
    message: '\\\"System Successfully Configured: Graduated.\\n\\nimport { Graduate } from \'University\';\\n\\n// Deploying Information Systems Degree...\\nconst future = new Promise((resolve) => {\\n    const status = \"Graduated\";\\n    if (status === \"Graduated\") {\\n        resolve(\"Bright\");\\n    }\\n});\\n\\nfuture.then(result => console.log(\`Future: ${result} ✨\`));\\n\\n\\\\https://laguereactportfolio-repo.vercel.app/',
    gcashUrl: "" // This will now hold your clean CDN link string!
  };

  const graduation = draft.graduation ?? defaultGraduation;

  const handleFieldUpdate = (name: string, value: string | boolean) => {
    updateDraft((currentDraft) => {
      currentDraft.graduation = {
        ...(currentDraft.graduation ?? defaultGraduation),
        [name]: value,
      };
    });
  };

  // REFACTORED: Heavy client-side processing replaced with lightweight serverless upload pipeline
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    try {
      setIsUploading(true);

      // 1. Optimize locally into standard modern WebP
      const optimizedBlob = await optimizeImage(file, 1000, 0.75);
      
      // 2. Clear out specialized filename markers
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
      const filename = `${Date.now()}-${cleanName}.webp`;

      // 3. Post binary data straight to Vercel Blob API route
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'x-filename': filename,
          'Content-Type': 'image/webp',
        },
        body: optimizedBlob,
      });

      if (!response.ok) throw new Error(`Upload failed (${response.status})`);
      
      const blobResult = await response.json();
      
      // 4. Save clean URL directly to Zustand draft
      handleFieldUpdate('gcashUrl', blobResult.url);
      
    } catch (err: any) {
      alert(`Cloud upload failed: ${err?.message ?? 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 text-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <FiAward className="text-xl text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase font-mono">Graduation Banner CMS</h3>
            <p className="text-xs text-zinc-500">Upload a celebration picture and change messages</p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => handleFieldUpdate('isEnabled', !graduation.isEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold uppercase ${
            graduation.isEnabled ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
          }`}
        >
          {graduation.isEnabled ? <FiEye /> : <FiEyeOff />}
          <span>{graduation.isEnabled ? 'Active Live' : 'Hidden'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-400">Badge/Pill Text</label>
          <input
            type="text"
            value={graduation.badgeText}
            onChange={(e) => handleFieldUpdate('badgeText', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* UPDATED IMAGE UPLOADER SLOT */}
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-400">Upload Celebration Picture</label>
          <div className="flex items-center gap-3">
            <label className={`flex-1 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors rounded p-2.5 cursor-pointer text-zinc-400 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <FiUpload className={`text-sm ${isUploading ? 'animate-spin text-zinc-400' : 'text-emerald-400'}`} />
              <span>{isUploading ? 'Optimizing & Uploading...' : graduation.gcashUrl ? 'Change Picture' : 'Choose Picture'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
            </label>
            {graduation.gcashUrl && !isUploading && (
              <div className="w-10 h-10 bg-zinc-950 border border-zinc-700 rounded overflow-hidden p-0.5">
                <img src={graduation.gcashUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-zinc-400">Main Header Title</label>
          <input
            type="text"
            value={graduation.title}
            onChange={(e) => handleFieldUpdate('title', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-zinc-400">Sub-headline</label>
          <input
            type="text"
            value={graduation.subtitle}
            onChange={(e) => handleFieldUpdate('subtitle', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-zinc-400">Inspirational Message</label>
          <textarea
            rows={3}
            value={graduation.message}
            onChange={(e) => handleFieldUpdate('message', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 outline-none resize-none focus:border-emerald-500/50"
          />
        </div>
      </div>
    </div>
  );
}
