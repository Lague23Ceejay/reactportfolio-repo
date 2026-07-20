//src/components/ui/ResumeEnvelope.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';

interface ResumeEnvelopeProps {
  resumeUrl?: string;
  resumeLabel?: string;
}

export function ResumeEnvelope({ resumeUrl, resumeLabel = 'Resume' }: ResumeEnvelopeProps) {
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.body.style.height = isOpen ? '100dvh' : '';

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  const isImagePreview = Boolean(resumeUrl && /\.(png|jpe?g|webp|gif|svg)$/i.test(resumeUrl));
  const isPdfPreview = Boolean(resumeUrl && resumeUrl.toLowerCase().includes('.pdf'));

  const themeStyles = useMemo(() => {
    if (currentDimension === 'creamy') {
      return {
        shell: 'bg-[#FFF7C2] border-stone-300 text-stone-900 shadow-[0_20px_70px_rgba(244,114,182,0.16)]',
        accent: 'text-rose-600',
        soft: 'text-stone-700',
        chip: 'bg-white/80 border-stone-300 text-stone-800',
        panel: 'bg-white/90 border-stone-200',
      };
    }

    if (currentDimension === 'arctic') {
      return {
        shell: 'bg-[#160b2c] border-cyan-400/30 text-slate-100 shadow-[0_20px_70px_rgba(34,211,238,0.16)]',
        accent: 'text-cyan-300',
        soft: 'text-slate-300',
        chip: 'bg-[#22133f] border-cyan-400/20 text-cyan-200',
        panel: 'bg-[#21123c] border-cyan-400/20',
      };
    }

    return {
      shell: 'bg-zinc-900/95 border-emerald-500/20 text-zinc-100 shadow-[0_20px_70px_rgba(16,185,129,0.16)]',
      accent: 'text-emerald-400',
      soft: 'text-zinc-400',
      chip: 'bg-zinc-800/70 border-emerald-500/20 text-emerald-300',
      panel: 'bg-zinc-950/70 border-zinc-800',
    };
  }, [currentDimension]);

  return (
    <div className="relative">
      <motion.button
        type="button"
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen((value) => !value)}
        className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition-all ${pack.textPrimary} ${themeStyles.shell}`}
      >
        {resumeLabel}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          >
            <motion.button
              type="button"
              aria-label="Close resume preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.94, rotateX: 12 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ y: 40, opacity: 0, scale: 0.94, rotateX: 12 }}
              transition={{ type: 'spring', stiffness: 170, damping: 22 }}
              className={`relative z-10 w-full max-w-xl rounded-[2rem] border p-5 sm:p-7 ${themeStyles.shell}`}
            >
              <div className={`mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] ${themeStyles.soft}`}>
                <span>Resume preview</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${themeStyles.chip}`}
                >
                  Close
                </button>
              </div>

              <motion.div
                className={`relative overflow-hidden rounded-[1.5rem] border p-4 sm:p-6 ${themeStyles.panel}`}
                initial={{ y: 20, opacity: 0.7 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: 20, opacity: 0.7, rotateX: -6 }}
                transition={{ duration: 0.28 }}
              >
                <motion.div
                  className="absolute inset-x-0 top-0 h-20 rounded-t-[1.5rem] border-b border-white/10"
                  animate={{ y: isOpen ? 0 : -10, opacity: isOpen ? 1 : 0.7 }}
                  transition={{ duration: 0.25 }}
                />
                {resumeUrl ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${themeStyles.chip}`}>
                        Live document ready
                      </span>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${themeStyles.chip}`}>
                        Uploaded through admin
                      </span>
                    </div>

                    {isImagePreview ? (
                      <img src={resumeUrl} alt="Resume preview" className="w-full max-h-[60vh] rounded-[1.25rem] border border-white/10 object-contain" />
                    ) : isPdfPreview ? (
                      <iframe src={resumeUrl} title="Resume preview" className="min-h-[60vh] w-full rounded-[1.25rem] border border-white/10 bg-white" />
                    ) : (
                      <div className={`rounded-[1.25rem] border p-5 ${themeStyles.chip}`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${themeStyles.accent}`}>Resume asset</p>
                        <p className="mt-2 text-sm leading-6">This file can be opened directly from the uploaded asset link.</p>
                      </div>
                    )}

                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] ${themeStyles.chip}`}
                    >
                      Open asset ↗
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${themeStyles.chip}`}>
                          Available for new work
                        </span>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${themeStyles.chip}`}>
                          Frontend • UI • Motion
                        </span>
                      </div>

                      <h3 className={`text-2xl font-semibold ${themeStyles.accent}`}>Creative developer with a sharp eye for immersive experiences.</h3>
                      <p className={`text-sm leading-7 ${themeStyles.soft}`}>
                        This preview is intentionally lightweight so the interaction can feel like opening a paper envelope and revealing a composition of skills, focus areas, and availability.
                      </p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className={`rounded-2xl border p-4 ${themeStyles.chip}`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${themeStyles.accent}`}>Core focus</p>
                        <p className="mt-2 text-sm leading-6">React, TypeScript, motion systems, editorial interfaces, and polished product storytelling.</p>
                      </div>
                      <div className={`rounded-2xl border p-4 ${themeStyles.chip}`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${themeStyles.accent}`}>Selected strengths</p>
                        <p className="mt-2 text-sm leading-6">Fast iteration, clear visual systems, accessibility-minded UI, and seamless theme transitions.</p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
