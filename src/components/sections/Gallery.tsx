import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';

export function Gallery() {
  const gallery = usePortfolioStore((state) => state.data?.gallery || []);
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];
  const [activeImage, setActiveImage] = useState<null | {
    imageUrl: string;
    title: string;
    category: string;
  }>(null);

  useEffect(() => {
    document.body.style.overflow = activeImage ? 'hidden' : '';
    document.body.style.height = activeImage ? '100dvh' : '';

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [activeImage]);

  const overlayTheme = useMemo(() => {
    if (currentDimension === 'creamy') {
      return 'bg-[#fffef3]/95 text-stone-900 border-stone-200';
    }

    if (currentDimension === 'arctic') {
      return 'bg-[#130a23]/95 text-slate-100 border-cyan-400/20';
    }

    return 'bg-zinc-950/95 text-zinc-100 border-zinc-800';
  }, [currentDimension]);

  return (
    <section className={`space-y-8 rounded-3xl px-4 sm:px-6 py-8 transition-colors duration-500 ${currentDimension === 'creamy' ? 'bg-[#FFF7C2]/40' : currentDimension === 'arctic' ? 'bg-[#20133A]/50' : 'bg-zinc-900/20'}`} id="sandbox">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight target-cursor ${pack.textPrimary}`}>Memories & Milestones</h2>
          <div className={`h-px flex-1 ${currentDimension === 'creamy' ? 'bg-stone-400/40' : 'bg-zinc-800'}`} />
        </div>
        <p className={`text-sm font-light max-w-xl leading-relaxed ${pack.textSecondary}`}>
          A visual archive of the moments that shaped my college experience.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 pt-4">
        {gallery.map((item) => (
          item.imageUrl && (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveImage({ imageUrl: item.imageUrl!, title: item.title, category: item.category })}
              className="break-inside-avoid relative w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 text-left group"
            >
              <img src={item.imageUrl} alt={item.title} className="w-full h-auto max-h-[320px] object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/30 to-transparent p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase ${currentDimension === 'creamy' ? 'text-rose-500' : currentDimension === 'arctic' ? 'text-cyan-400' : 'text-emerald-400'}`}>{item.category}</span>
                <h4 className={`text-sm font-bold mt-1 ${pack.textPrimary}`}>{item.title}</h4>
              </div>
            </button>
          )
        ))}
      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.button
              type="button"
              aria-label="Close gallery detail"
              className="absolute inset-0"
              onClick={() => setActiveImage(null)}
            />
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              className={`relative z-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border ${overlayTheme}`}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
                <div>
                  <p className={`text-[10px] font-mono uppercase tracking-[0.3em] ${currentDimension === 'creamy' ? 'text-rose-500' : currentDimension === 'arctic' ? 'text-cyan-400' : 'text-emerald-400'}`}>{activeImage.category}</p>
                  <h3 className="text-lg font-semibold">{activeImage.title}</h3>
                </div>
                <button type="button" onClick={() => setActiveImage(null)} className="rounded-full border border-white/10 px-3 py-1 text-sm">✕</button>
              </div>
              <img src={activeImage.imageUrl} alt={activeImage.title} className="max-h-[70vh] w-full object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
