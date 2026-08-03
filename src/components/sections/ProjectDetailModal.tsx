// src/components/sections/ProjectDetailModal.tsx
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../../types/portfolio';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps): JSX.Element {
  const [activeShot, setActiveShot] = useState(0);
  const screenshots = project.screenshots ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const repoUrl = project.sourceCodeUrl || project.githubUrl || '';
  const liveUrl = project.deploymentUrl || project.liveUrl || '';

  const modal = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl custom-scrollbar"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ✕
          </button>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2 pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-bold tracking-tight text-zinc-100">{project.title}</h3>
                {project.featured && (
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950">
                    Complete
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {project.longDescription || project.description || 'No further details have been added for this project yet.'}
              </p>
            </div>

            {project.videoUrl && (
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black">
                <video
                  src={project.videoUrl}
                  controls
                  playsInline
                  className="w-full max-h-[420px] bg-black"
                >
                  Your browser does not support embedded video playback.
                </video>
              </div>
            )}

            {screenshots.length > 0 && (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center h-64 sm:h-80">
                  <img
                    src={screenshots[activeShot]}
                    alt={`${project.title} screenshot ${activeShot + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                {screenshots.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {screenshots.map((shot, i) => (
                      <button
                        key={`${shot}-${i}`}
                        type="button"
                        onClick={() => setActiveShot(i)}
                        className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border transition-colors ${
                          i === activeShot ? 'border-emerald-500' : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                        aria-label={`View screenshot ${i + 1}`}
                      >
                        <img src={shot} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {project.stack && project.stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((item, i) => (
                  <span
                    key={`${item.name}-${i}`}
                    className="text-[10px] font-mono px-2 py-1 rounded border text-zinc-400 bg-zinc-950 border-zinc-900"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            )}

            {(liveUrl || repoUrl) && (
              <div className="flex flex-wrap gap-4 pt-2 border-t border-zinc-900/60 text-sm font-mono font-bold">
                {liveUrl && (
                  <a href={liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    Live Demo →
                  </a>
                )}
                {repoUrl && (
                  <a href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    Source →
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modal, document.body);
}

export default ProjectDetailModal;