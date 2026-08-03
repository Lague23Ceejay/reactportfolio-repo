// src/components/sections/Projects.tsx

import { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ProjectDetailModal } from './ProjectDetailModal';
import type { Project } from '../../types/portfolio';

export function Projects() {
  const projects = usePortfolioStore((state) => state.data?.projects || []);
  const { currentDimension } = useThemeStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const pack = dimensionPacks[currentDimension];

  return (
    <section
      className={`space-y-8 py-10 rounded-3xl px-4 sm:px-6 transition-colors duration-500 ${
        currentDimension === 'creamy'
          ? 'bg-[#FFF7C2]/40'
          : currentDimension === 'arctic'
          ? 'bg-[#20133A]/50'
          : 'bg-zinc-900/20'
      }`}
      id="work"
    >
      <div className="flex items-center gap-4">
        <h2
          className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-500 ${pack.textPrimary}`}
        >
          Selected Work
        </h2>
        <div
          className={`h-px flex-1 transition-colors duration-500 ${
            currentDimension === 'creamy' ? 'bg-stone-400/40' : 'bg-zinc-800'
          }`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project) => {
          const stackItems = (project.stack || []).map((s: any) => {
            if (typeof s === 'string') {
              const [name = 'Tech', val = '0'] = s.split(':');
              const level = Number.parseInt(val.trim() || '0', 10) || 0;
              return { name: name.trim(), level };
            }
            return {
              name: (s.name as string) || 'Tech',
              level: typeof s.level === 'number' ? s.level : Number(s.level) || 0
            };
          });

          const totalPercentage =
            stackItems.length > 0
              ? Math.round(stackItems.reduce((acc, item) => acc + item.level, 0) / stackItems.length)
              : 0;

          const repoUrl = project.sourceCodeUrl || project.githubUrl || '';

          const cardLayoutClass =
            currentDimension === 'creamy'
              ? 'bg-white border-stone-200/80 text-stone-900 shadow-md hover:border-rose-400/40'
              : 'bg-zinc-950 border-zinc-900 text-zinc-100 shadow-lg hover:border-emerald-500/30';

          return (
            <SpotlightCard
              key={project.id}
              className={`group transition-all duration-300 p-6 flex flex-col justify-between space-y-6 rounded-2xl border ${cardLayoutClass}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${pack.textSecondary}`}>
                        [{project.githubUrl || 'Repository'}]
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          currentDimension === 'creamy'
                            ? 'text-rose-600 bg-rose-50 border-rose-200/40'
                            : 'text-emerald-400/80 bg-emerald-500/5 border-emerald-500/10'
                        }`}
                      >
                        {project.liveUrl || 'Production'}
                      </span>
                    </div>

                    <h3
                      className={`text-xl font-bold tracking-tight transition-colors pt-1 ${pack.textPrimary} ${
                        currentDimension === 'creamy' ? 'group-hover:text-rose-600' : 'group-hover:text-emerald-400'
                      }`}
                    >
                      {project.title}
                    </h3>
                  </div>

                  {project.featured && (
                    <span
                      className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full shadow-xs ${
                        currentDimension === 'creamy' ? 'text-white bg-stone-900' : 'text-zinc-950 bg-emerald-500'
                      }`}
                    >
                      Complete
                    </span>
                  )}
                </div>

                <p className={`text-sm sm:text-base line-clamp-3 font-normal leading-relaxed whitespace-pre-wrap transition-colors ${pack.textSecondary}`}>
                  {project.description}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {stackItems.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {stackItems.map((item, idx) => (
                        <span
                          key={`${item.name}-${idx}`}
                          className={`text-[10px] font-mono px-2 py-1 rounded border ${
                            currentDimension === 'creamy'
                              ? 'text-stone-700 bg-stone-50 border-stone-200'
                              : 'text-zinc-400 bg-zinc-950 border-zinc-900'
                          }`}
                        >
                          {item.name} ({item.level}%)
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <div
                        className={`h-1.5 w-full rounded-full overflow-hidden flex border ${
                          currentDimension === 'creamy' ? 'bg-stone-100 border-stone-200' : 'bg-zinc-950 border-zinc-900'
                        }`}
                      >
                        {stackItems.map((item, barIdx) => {
                          const darkColors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500'];
                          const creamyColors = ['bg-rose-500', 'bg-sky-400', 'bg-violet-400', 'bg-amber-400', 'bg-teal-400', 'bg-coral-400'];

                          const activeColors = currentDimension === 'creamy' ? creamyColors : darkColors;
                          const currentColor = activeColors[barIdx % activeColors.length];

                          const barWidth = `${Math.max(0, Math.min(100, item.level))}%`;

                          return (
                            <div
                              key={barIdx}
                              style={{ width: barWidth }}
                              className={`${currentColor} h-full transition-all duration-300`}
                              title={`${item.name}: ${item.level}%`}
                            />
                          );
                        })}
                      </div>
                      <div className={`text-[9px] font-mono text-right ${pack.textSecondary}`}>
                        Overall Progress Index: {totalPercentage}%
                      </div>
                    </div>
                  </>
                )}

                <div
                  className={`flex gap-4 pt-3 border-t text-xs font-mono font-bold transition-colors ${
                    currentDimension === 'creamy' ? 'border-stone-200' : 'border-zinc-900/60'
                  }`}
                >
                  {project.deploymentUrl && (
                    <a href={project.deploymentUrl.startsWith('http') ? project.deploymentUrl : `https://${project.deploymentUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`cursor-pointer transition-colors cursor-target ${
                        currentDimension === 'creamy' ? 'text-rose-600 hover:text-rose-700 underline' : 'text-emerald-400 hover:underline'
                      }`}
                    >
                      Live Demo →
                    </a>
                  )}
                  {repoUrl && (
                    <a href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`cursor-pointer transition-colors ${
                        currentDimension === 'creamy' ? 'text-stone-500 hover:text-stone-900' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Source →
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className={`cursor-pointer cursor-target transition-colors ml-auto ${
                      currentDimension === 'creamy' ? 'text-stone-700 hover:text-stone-900' : 'text-zinc-300 hover:text-zinc-100'
                    }`}
                  >
                    Details →
                  </button>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {selectedProject && (
        <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}