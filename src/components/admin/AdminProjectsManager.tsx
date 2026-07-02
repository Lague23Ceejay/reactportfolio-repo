import { usePortfolioStore } from '../../store/portfolioStore';

export function AdminProjectsManager() {
  const { draft, updateDraft } = usePortfolioStore();

  if (!draft) return null;

  return (
    <div className="space-y-6 pt-4 animate-fadeIn">
      <div className="flex justify-between items-center bg-zinc-950/40 p-4 border border-zinc-800/60 rounded-2xl">
        <div>
          <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Project Portfolio Trackers</h3>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Control completion matrices, lifecycle states, and stack sliders.</p>
        </div>
        <button 
          type="button"
          onClick={() => updateDraft(d => {
            d.projects.push({
              id: crypto.randomUUID(),
              title: "New Development Build",
              description: "In-progress system architecture description summary.",
              stack: ["React:50", "TypeScript:30"], // Key:Value structure maps technology and percentage slider arrays
              liveUrl: "Development", // Stores your 'Status' data token dynamically 
              githubUrl: "Personal", // Stores your project 'Type' token parameter
              featured: false // Serves as your binary Completion Flag
            });
          })}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-lg border border-zinc-700 transition-colors cursor-pointer"
        >
          + Add Project Entry
        </button>
      </div>

      <div className="space-y-6 max-h-137.5 overflow-y-auto pr-2 custom-scrollbar">
        {draft.projects.map((project, index) => {
          
          // Real-time calculated overall percentage math wrapper loop
          const stackItems = project.stack.map(s => {
            const [name, val] = s.split(':');
            return { name: name || 'Tech', value: parseInt(val || '0', 10) };
          });
          
          const totalPercentage = stackItems.length > 0 
            ? Math.round(stackItems.reduce((acc, item) => acc + item.value, 0) / stackItems.length) 
            : 0;

          return (
            <div key={project.id} className="p-5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl relative space-y-6 group">
              <button
                type="button"
                onClick={() => updateDraft(d => { d.projects.splice(index, 1); })}
                className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 text-xs font-mono transition-colors cursor-pointer"
              >
                Remove
              </button>

              {/* Grid 1: Basic Identity Data Fields */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-500">Project Title</label>
                  <input 
                    type="text" 
                    value={project.title} 
                    onChange={(e) => updateDraft(d => { d.projects[index].title = e.target.value; })}
                    className="w-full bg-zinc-900 border border-zinc-800/80 p-2 rounded-xl text-sm outline-none text-zinc-200 focus:border-emerald-500/30" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-500">Project Type Classification</label>
                  <select 
                    value={project.githubUrl} 
                    onChange={(e) => updateDraft(d => { d.projects[index].githubUrl = e.target.value; })}
                    className="w-full bg-zinc-900 border border-zinc-800/80 p-2 rounded-xl text-sm outline-none text-zinc-300 focus:border-emerald-500/30"
                  >
                    <option value="Personal">Personal Initiative</option>
                    <option value="Client">Client Commission</option>
                    <option value="Enterprise">Enterprise Workspace</option>
                    <option value="Open Source">Open Source Contribution</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-500">Current Lifecycle Status</label>
                  <select 
                    value={project.liveUrl} 
                    onChange={(e) => updateDraft(d => { d.projects[index].liveUrl = e.target.value; })}
                    className="w-full bg-zinc-900 border border-zinc-800/80 p-2 rounded-xl text-sm outline-none text-zinc-300 focus:border-emerald-500/30"
                  >
                    <option value="Pre-Alpha">Pre-Alpha (Planning)</option>
                    <option value="Development">Active Development</option>
                    <option value="Testing">Staging / QA Testing</option>
                    <option value="Released">Production Released</option>
                  </select>
                </div>
              </div>

              {/* Grid 1.5: Dynamic Expansion Parameters (URLs & Frameworks) */}
              <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-900">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-500">Live Domain Deployment Anchor</label>
                  <input 
                    type="url" 
                    placeholder="https://vercel.app"
                    value={project.deploymentUrl || ''} 
                    onChange={(e) => updateDraft(d => { d.projects[index].deploymentUrl = e.target.value; })}
                    className="w-full bg-zinc-900 border border-zinc-800/80 p-2 rounded-xl text-xs font-mono outline-none text-zinc-300 focus:border-emerald-500/30" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-500">Source Control Git Link</label>
                  <input 
                    type="url" 
                    placeholder="https://github.com..."
                    value={project.sourceCodeUrl || ''} 
                    onChange={(e) => updateDraft(d => { d.projects[index].sourceCodeUrl = e.target.value; })}
                    className="w-full bg-zinc-900 border border-zinc-800/80 p-2 rounded-xl text-xs font-mono outline-none text-zinc-300 focus:border-emerald-500/30" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-500">Framework Infrastructure Array (Comma Separated)</label>
                  <input 
                    type="text" 
                    placeholder="Next.js, Prisma, PostgreSQL"
                    value={(project.frameworksArray || []).join(', ')} 
                    onChange={(e) => updateDraft(d => { 
                      d.projects[index].frameworksArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean); 
                    })}
                    className="w-full bg-zinc-900 border border-zinc-800/80 p-2 rounded-xl text-xs font-mono outline-none text-emerald-400 focus:border-emerald-500/30" 
                  />
                </div>
              </div>

              {/* Grid 2: Description and Completion Status Checkbox */}
              <div className="grid sm:grid-cols-4 gap-4 items-start">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] font-mono text-zinc-500">Repository Description Narrative Summary</label>
                  <textarea 
                    rows={2}
                    value={project.description} 
                    onChange={(e) => updateDraft(d => { d.projects[index].description = e.target.value; })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-sm outline-none resize-none focus:border-emerald-500/30 text-zinc-300 leading-relaxed" 
                  />
                </div>
                
                <div className="pt-6 flex h-full items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-mono text-zinc-400 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 w-full hover:border-zinc-700 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={project.featured} 
                      onChange={(e) => updateDraft(d => { d.projects[index].featured = e.target.checked; })}
                      className="accent-emerald-500 rounded" 
                    />
                    Build Complete
                  </label>
                </div>
              </div>

              {/* Dynamic Real-Time Sliders Stack Dashboard Area */}
              <div className="bg-zinc-900/40 p-4 border border-zinc-800/60 rounded-xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800/40">
                  <span className="text-xs font-mono font-medium text-zinc-400">Technical Skill Matrix Sliders</span>
                  <button
                    type="button"
                    onClick={() => updateDraft(d => {
                      d.projects[index].stack.push("NewTech:50");
                    })}
                    className="text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded border border-zinc-700/60 transition-colors cursor-pointer"
                  >
                    + Add Tech Item
                  </button>
                </div>

                {/* Interactive Sliders Matrix List Generator */}
                <div className="space-y-3">
                  {stackItems.map((item, tIdx) => (
                    <div key={tIdx} className="grid sm:grid-cols-3 gap-4 items-center">
                      <input 
                        type="text"
                        value={item.name}
                        onChange={(e) => updateDraft(d => {
                          const updatedName = e.target.value.replace(':', '');
                          d.projects[index].stack[tIdx] = `${updatedName}:${item.value}`;
                        })}
                        className="bg-zinc-950 border border-zinc-800/80 p-1.5 rounded-lg text-xs font-mono text-emerald-400 outline-none focus:border-emerald-500/20"
                        placeholder="e.g. React"
                      />
                      
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={item.value}
                          onChange={(e) => updateDraft(d => {
                            d.projects[index].stack[tIdx] = `${item.name}:${e.target.value}`;
                          })}
                          className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <span className="text-xs font-mono text-zinc-400 w-8 text-right">{item.value}%</span>
                        <button
                          type="button"
                          onClick={() => updateDraft(d => {
                            d.projects[index].stack.splice(tIdx, 1);
                          })}
                          className="text-zinc-600 hover:text-red-400 text-xs font-mono px-1 ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Real-time Multi-Color Bar Visual Calculations Output Container */}
                {stackItems.length > 0 && (
                  <div className="pt-4 border-t border-zinc-800/40 space-y-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-zinc-500">Live Component Microbar Mix</span>
                      <span className="text-emerald-400 font-semibold">Total Stability Index: {totalPercentage}%</span>
                    </div>
                    
                    {/* Nested Stacked Multi-Color Progress Indicator */}
                    <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden flex border border-zinc-900">
                      {stackItems.map((item, barIdx) => {
                        // Cycles through functional color maps based on grid items array position
                        const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500'];
                        const currentColor = colors[barIdx % colors.length];
                        
                        // Weighted allocation math logic maps individual percentages to the main bar grid
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
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
