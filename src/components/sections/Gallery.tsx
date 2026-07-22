// src/components/sections/Gallery.tsx
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import Stack from '../ui/Stack';
import { usePortfolioStore } from '../../store/portfolioStore';

export type GalleryItem = {
  id?: string | number;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  category?: string;
};

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext
}: {
  images: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const img = images[index];

  useEffect(() => {
    setLoaded(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, onClose, onPrev, onNext]);

  if (!img) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-h-[92vh] max-w-[92vw] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-50"
          aria-label="Previous image"
        >
          ‹
        </button>

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

          {/* Title & subtitle in lightbox */}
          {(img.title || img.subtitle) && (
            <div className="mt-4 text-center text-white max-w-[80vw]">
              {img.title && <div className="text-lg font-semibold">{img.title}</div>}
              {img.subtitle && <div className="text-sm text-white/80">{img.subtitle}</div>}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-50"
          aria-label="Next image"
        >
          ›
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white text-2xl z-50"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}

export function Gallery(): JSX.Element {
  const { data } = usePortfolioStore();
  const gallery: GalleryItem[] = data?.gallery ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    gallery.forEach((item) => set.add(item.category ?? 'General'));
    return Array.from(set);
  }, [gallery]);

  const [activeCategory, setActiveCategory] = useState<string>(categories[0] ?? 'General');

  useEffect(() => {
    if (categories.length && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const filteredImages = useMemo(
    () => gallery.filter((item) => (item.category ?? 'General') === activeCategory),
    [gallery, activeCategory]
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // lock body scroll while modal is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
    return;
  }, [lightboxIndex]);

  // open lightbox helper
  const openLightbox = (index: number) => {
    if (index < 0 || index >= filteredImages.length) return;
    setLightboxIndex(index);
  };

  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };

  // visual tuning: container size and hover scale
  const STACK_SIZE = 320; // increased from 260 to give more room for expansion
  const HOVER_SCALE = 1.3; // 30% expansion for more visible effect

  return (
    <section id="gallery" className="py-12 space-y-8">
      <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setLightboxIndex(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stack */}
      <div className="flex justify-center">
        {/* wrapper must allow overflow so hovered card can grow beyond the fixed box */}
        <div style={{ width: STACK_SIZE, height: STACK_SIZE, overflow: 'visible' }}>
          <Stack
            randomRotation
            sensitivity={180}
            sendToBackOnClick={false}
            cards={filteredImages.map((img, i) => (
              // group wrapper enables hover transform on inner element
              <div
                key={img.id ?? `${i}-${img.imageUrl}`}
                className="w-full h-full cursor-pointer group relative"
                onClick={(e) => {
                  // ensure Stack's drag/click logic doesn't intercept
                  e.stopPropagation();
                  openLightbox(i);
                }}
                // allow the hovered card to visually escape siblings
                style={{ overflow: 'visible' }}
              >
                <div
                  className="w-full h-full rounded-xl transition-transform duration-300 ease-out transform-gpu origin-center"
                  style={{
                    willChange: 'transform',
                    transformOrigin: 'center center',
                    // apply hover scale via inline style to use HOVER_SCALE constant
                  }}
                >
                  {/* inner wrapper that actually scales on hover and raises z-index */}
                  <div
                    className="w-full h-full overflow-visible rounded-xl"
                    style={{
                      transition: 'transform 300ms ease-out',
                    }}
                    // apply hover effect via onMouseEnter/onMouseLeave to ensure consistent behavior
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = `scale(${HOVER_SCALE})`;
                      el.style.zIndex = '60';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'scale(1)';
                      el.style.zIndex = '';
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.title ?? `image-${i}`}
                      className="w-full h-full object-cover rounded-xl select-none"
                      draggable={false}
                      style={{ display: 'block', pointerEvents: 'auto' }}
                    />

                    {/* Title & subtitle overlay (visible on hover) */}
                    {(img.title || img.subtitle) && (
                      <div className="pointer-events-none absolute left-1/2 bottom-3 -translate-x-1/2 w-[90%] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {img.title && (
                          <div className="bg-black/70 text-white text-sm font-semibold px-3 py-1 rounded-md inline-block">
                            {img.title}
                          </div>
                        )}
                        {img.subtitle && (
                          <div className="mt-1 text-xs text-white/80">
                            {img.subtitle}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          />
        </div>
      </div>

      {/* Lightbox (portal) */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <Lightbox
          images={filteredImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </section>
  );
}

export default Gallery;
