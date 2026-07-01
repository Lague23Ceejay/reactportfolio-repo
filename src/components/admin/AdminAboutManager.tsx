// src/components/admin/AdminAboutManager.tsx

import { usePortfolioStore } from '../../store/portfolioStore';
import { renderIconSVG } from '../ui/CardSwapDeck';

export function AdminAboutManager() {
  const { draft, updateDraft } = usePortfolioStore();

  if (!draft) return null;

  const triggerFormat = (command: string) => {
    document.execCommand(command, false, '');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        {/* Clean, Functional Rich Text Workspace */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400 block">Biographical Narrative Copy</label>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500/30">
            {/* Formatting Action Toolbar buttons */}
            <div className="flex items-center gap-1 bg-zinc-900/50 p-2 border-b border-zinc-800 text-xs font-mono text-zinc-400 select-none">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); triggerFormat('bold'); }} className="p-1 px-3 bg-zinc-900 border border-zinc-800 text-white rounded font-bold cursor-pointer hover:bg-zinc-800">B</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); triggerFormat('italic'); }} className="p-1 px-3 bg-zinc-900 border border-zinc-800 text-white rounded italic cursor-pointer hover:bg-zinc-800">I</button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); triggerFormat('underline'); }} className="p-1 px-3 bg-zinc-900 border border-zinc-800 text-white rounded underline cursor-pointer hover:bg-zinc-800">U</button>
            </div>
            
            {/* Core Contenteditable Node Sync Container */}
            <div 
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const htmlContent = e.currentTarget.innerHTML;
                updateDraft(d => { d.about.bio = htmlContent; });
              }}
              dangerouslySetInnerHTML={{ __html: draft.about.bio }}
              className="w-full min-h-[140px] p-4 text-sm outline-none text-zinc-300 leading-relaxed max-h-[250px] overflow-y-auto custom-scrollbar"
            />
          </div>
        </div>

        {/* Toolkit Admin Form Elements Grid */}
        <div className="space-y-3 bg-zinc-950/40 p-4 border border-zinc-800 rounded-xl">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60">
            <span className="text-xs font-mono font-medium text-zinc-400">Technical Skill Vector Deck</span>
            <button
              type="button"
              onClick={() => updateDraft(d => { d.about.skills.push({ name: "New Skill Title", iconCode: "react", description: "" }); })}
              className="text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded border border-zinc-700/60 transition-colors cursor-pointer"
            >
              + Add Tech Badge
            </button>
          </div>

          <div className="grid gap-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            {draft.about.skills.map((skill, sIdx) => (
              <div key={sIdx} className="flex flex-col bg-zinc-900/40 border border-zinc-800/80 p-3 rounded-xl group relative gap-3">
                
                {/* UPPER CONTROL PANEL ROW CONTAINER */}
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center shrink-0">
                    {renderIconSVG(skill.iconCode)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase">Public Display Name</label>
                      <input 
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateDraft(d => { d.about.skills[sIdx].name = e.target.value; })}
                        className="w-full bg-zinc-950 border border-zinc-800/50 p-2 rounded-lg text-xs font-mono text-zinc-200 outline-none"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-mono text-zinc-500 uppercase">Icon Code / Keyword</label>
                      <input 
                        type="text"
                        value={skill.iconCode}
                        onChange={(e) => updateDraft(d => { d.about.skills[sIdx].iconCode = e.target.value; })}
                        className="w-full bg-zinc-950 border border-zinc-800/50 p-2 rounded-lg text-xs font-mono text-emerald-400 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateDraft(d => { d.about.skills.splice(sIdx, 1); })}
                    className="text-zinc-600 hover:text-red-400 text-xs font-mono px-2 cursor-pointer shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* ==========================================================================
                   🚀 INTEGRATED: DYNAMIC DESCRIPTION PROFILE INPUT CARD
                   ========================================================================== */}
                <div className="space-y-0.5 w-full">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">
                    Technology Summary / Profile Documentation Description
                  </label>
                  <textarea 
                    rows={2}
                    value={skill.description || ''} 
                    placeholder="Provide context regarding your experience with this tech stack link loop..."
                    onChange={(e) => updateDraft(d => { d.about.skills[sIdx].description = e.target.value; })} 
                    className="w-full bg-zinc-950 p-2 border border-zinc-800/60 rounded-lg text-xs outline-none text-zinc-300 font-sans resize-none focus:border-emerald-500/20"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
