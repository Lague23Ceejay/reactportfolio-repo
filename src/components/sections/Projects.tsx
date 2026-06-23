import { usePortfolioStore } from '../../store/portfolioStore';

export function Projects() {
  const projects = usePortfolioStore((state) => state.data?.projects || []);

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Selected Work</h2>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/30 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                {project.featured && <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <p className="text-zinc-400 text-sm sm:text-base line-clamp-3 font-light leading-relaxed">{project.description}</p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech, idx) => (
                  <span key={idx} className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800/60">{tech}</span>
                ))}
              </div>
              <div className="flex gap-4 pt-2 border-t border-zinc-800/50 text-sm font-mono font-medium">
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-emerald-400 transition-colors">Live Demo →</a>}
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors">Source</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
