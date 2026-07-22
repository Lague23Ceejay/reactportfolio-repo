// src/components/ui/Lightbox.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type LightboxImage = {
  imageUrl: string;
  title?: string;
  subtitle?: string;
};

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const [loaded, setLoaded] = useState(false);
  const img = images[index];
  const prevActiveRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // reset loaded state when index changes
    setLoaded(false);

    // lock body scroll while lightbox is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // keyboard handlers
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handler);

    // focus management: save previously focused element and focus close button
    prevActiveRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = prevOverflow || '';
      clearTimeout(focusTimer);
      // restore previous focus
      prevActiveRef.current?.focus();
    };
  }, [index, onClose, onPrev, onNext]);

  if (!img) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      <div
        className="relative max-h-[92vh] max-w-[92vw] flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev && onPrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-50"
          aria-label="Previous image"
        >
          ‹
        </button>

        {/* Image + loader */}
        <div className="flex flex-col items-center justify-center">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          <img
            src={img.imageUrl}
            alt={img.title ?? `image-${index}`}
            className="rounded-lg max-h-[80vh] max-w-[80vw] object-contain shadow-lg z-50"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(true);
              // eslint-disable-next-line no-console
              console.error('Lightbox image failed to load', img.imageUrl);
            }}
            draggable={false}
          />

          {/* Title & subtitle */}
          {(img.title || img.subtitle) && (
            <div className="mt-4 text-center text-white max-w-[80vw]">
              {img.title && (
                <div id="lightbox-title" className="text-lg font-semibold">
                  {img.title}
                </div>
              )}
              {img.subtitle && <div className="text-sm text-white/80 mt-1">{img.subtitle}</div>}
            </div>
          )}
        </div>

        {/* Next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext && onNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-50"
          aria-label="Next image"
        >
          ›
        </button>

        {/* Close */}
        <button
          ref={closeBtnRef}
          data-lightbox-close
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white text-2xl z-50 bg-transparent p-1"
          aria-label="Close lightbox"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
