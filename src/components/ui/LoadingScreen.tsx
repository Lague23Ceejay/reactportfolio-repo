// src/components/ui/LoadingScreen.tsx
import React, { useEffect } from 'react';

export default function LoadingScreen(): JSX.Element {
  useEffect(() => {
    // prevent scroll while loading
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full neon-ring animate-spin-slow"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-cyan-400/95 shadow-neon" />
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-white">Loading portfolio</div>
          <div className="text-sm text-cyan-200/80 mt-1">Preparing neon experience…</div>
        </div>
      </div>
    </div>
  );
}
