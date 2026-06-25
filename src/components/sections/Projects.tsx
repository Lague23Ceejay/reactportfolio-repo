import { usePortfolioStore } from '../../store/portfolioStore';
import { SpotlightCard } from '../ui/SpotlightCard';

export function Projects() {
  const projects = usePortfolioStore((state) => state.data?.projects || []);

  return (
    <section className="space-y-8 py-10" id="work">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Selected Work</h2>
        <div className="h-px bg-zinc-800 flex-1" />
      </div>
      
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project) => {
          const stackItems = (project.stack || []).map(s => {
            const [name, val] = s.split(':');
            return { name: name || 'Tech', value: parseInt(val || '0', 10) };
          });

          const totalPercentage = stackItems.length > 0 
            ? Math.round(stackItems.reduce((acc, item) => acc + item.value, 0) / stackItems.length) 
            : 0;

          return (
            // WRAPPER: Replaced the standard div card shell with an interactive Spotlight Card
            <SpotlightCard 
              key={project.id} 
              className="group transition-colors duration-300 p-6 flex flex-col justify-between space-y-6 shadow-lg hover:border-emerald-500/30"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        [{project.githubUrl || 'Personal'}]
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                        {project.liveUrl || 'Development'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-emerald-400 transition-colors pt-1">
                      {project.title}
                    </h3>
                  </div>
                  {project.featured && (
                    <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-zinc-950 bg-emerald-500 px-2 py-0.5 rounded-full shadow-sm">
                      Complete
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm sm:text-base line-clamp-3 font-light leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {stackItems.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-1.5">
                      {stackItems.map((item, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-900">
                          {item.name} ({item.value}%)
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden flex border border-zinc-900">
                        {stackItems.map((item, barIdx) => {
                          const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500'];
                          const currentColor = colors[barIdx % colors.length];
                          const barWidth = `${item.value / stackItems.length}%`;
                          
                          return (
                            <div 
                              key={barIdx} 
                              style={{ width: barWidth }} 
                              className={`${currentColor} h-full transition-all duration-300`}
                              title={`${item.name}: ${item.value}%`}
                            />
                          );
                        })}
                      </div>
                      <div className="text-[9px] font-mono text-zinc-500 text-right">
                        Overall Progress Index: {totalPercentage}%
                      </div>
                    </div>
                  </>
                )}

                {(project.deploymentUrl || project.sourceCodeUrl) && (
                  <div className="flex gap-4 pt-3 border-t border-zinc-900/60 text-xs font-mono font-medium">
                    {project.deploymentUrl && (
                      <a 
                        href={project.deploymentUrl.startsWith('http') ? project.deploymentUrl : `https://${project.deploymentUrl}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-emerald-400 hover:underline cursor-pointer"
                      >
                        Live Demo →
                      </a>
                    )}
                    {project.sourceCodeUrl && (
                      <a 
                        href={project.sourceCodeUrl.startsWith('http') ? project.sourceCodeUrl : `https://${project.sourceCodeUrl}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        Source Git
                      </a>
                    )}
                  </div>
                )}
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
