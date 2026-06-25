import React from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { FiAward, FiEye, FiEyeOff, FiUpload } from 'react-icons/fi';

export function AdminGraduationManager() {
  const { draft, updateDraft } = usePortfolioStore();

  if (!draft) return null;
  
  const graduation = draft.graduation || {
    isEnabled: true,
    badgeText: "Class of 2026 Launch Pad",
    title: "Welcome to My Digital Portal! 👋",
    subtitle: "BS in Information Systems — Graduating Tomorrow!",
    message: '"Information Systems is about engineering solutions that connect human intent with computing potential."',
    gcashUrl: "" // This holds your base64 uploaded picture
  };

  const handleFieldUpdate = (name: string, value: string | boolean) => {
    updateDraft((currentDraft) => {
      currentDraft.graduation = {
        ...graduation,
        [name]: value
      };
    });
  };

    /* 
    SENIOR DEV HOOK: CELEBRATION PICTURE CANVAS ENGINE COMPRESSOR
    Downscales your graduation banner imagery dynamically inside the browser 
    before transmission to honor the 4.5MB Vercel serverless rule safely.
  */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1000;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.70);
        handleFieldUpdate('gcashUrl', compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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

        {/* PURE IMAGE UPLOADER SLOT */}
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-400">Upload Celebration Picture</label>
          <div className="flex items-center gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors rounded p-2.5 cursor-pointer text-zinc-400">
              <FiUpload className="text-sm text-emerald-400" />
              <span>{graduation.gcashUrl ? 'Change Picture' : 'Choose Picture'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {graduation.gcashUrl && (
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
