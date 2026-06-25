import { useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';

export function AdminGalleryManager() {
  const { draft, updateDraft } = usePortfolioStore();
  const [newCategoryName, setNewCategoryName] = useState('');

  if (!draft) return null;

  // Extract all unique active category tokens dynamically from your sandbox array
  const activeCategories = Array.from(
    new Set(draft.gallery.map(item => item.category).filter(Boolean))
  );

    /* 
    SENIOR DEV HOOK: ASYNCHRONOUS GRAPHICS COMPRESSOR ENGINE
    Intercepts large raw camera photos, clips maximum resolution dimension frames to 1000px, 
    and compresses JPEG quality vectors down to 0.7. This shrinks a 6MB raw upload down 
    to a featherweight ~150KB string, completely bypassing Vercel's 413 serverless limits!
  */
  const processImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1000; // Optimal web container bounding scale limit

        // Maintain aspect ratios cleanly during mathematical downsizing
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw downscaled frame vectors smoothly inside the canvas context
        ctx.drawImage(img, 0, 0, width, height);

        // Export highly compressed light web data layers directly to the callback pipeline
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.70);
        callback(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };


  return (
    <div className="space-y-6 pt-4 animate-fadeIn">
      
      {/* Category Management Controls Workbench Container */}
      <div className="bg-zinc-950/40 p-5 border border-zinc-800/80 rounded-2xl space-y-4">
        <div>
          <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Category Management Workbench</h3>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Inject fresh classifications or purge existing categories entirely.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input 
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. 3D Renders, Branding, UI"
            className="flex-1 bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-xs font-mono text-zinc-100 outline-none focus:border-emerald-500/30"
          />
          <button
            type="button"
            onClick={() => {
              const cleaned = newCategoryName.trim();
              if (!cleaned) return;
              // Push a placeholder asset to reserve the category token in the state tree
              updateDraft(d => {
                d.gallery.push({
                  id: crypto.randomUUID(),
                  title: `New ${cleaned} Asset`,
                  category: cleaned,
                  imageUrl: ""
                });
              });
              setNewCategoryName('');
              alert(`Category grouping grid "${cleaned}" initialized.`);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-xl transition-all cursor-pointer"
          >
            + Create Category
          </button>
        </div>

        {/* Live Category Purge Registry Strip */}
        {activeCategories.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Active Registries (Click to Purge Category Assets)</span>
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    if (!window.confirm(`Category Purge: Are you sure you want to delete ALL gallery assets assigned to "${cat}"?`)) return;
                    updateDraft(d => {
                      d.gallery = d.gallery.filter(item => item.category !== cat);
                    });
                    alert(`Purge complete. Grouping "${cat}" cleared from data arrays.`);
                  }}
                  className="px-2.5 py-1 bg-red-950/20 hover:bg-red-950/60 border border-red-900/30 hover:border-red-500/40 text-red-400 text-[10px] font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1.5 group"
                  title={`Purge all items under ${cat}`}
                >
                  <span>{cat}</span>
                  <span className="text-red-500/60 group-hover:text-red-400 text-xs font-sans">✕</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
              {/* Visual Sandbox Asset Grid Cards Layout */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-zinc-950/20 p-4 border border-zinc-800/60 rounded-xl">
          <div>
            <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Visual Assets Staging Index</h4>
            <p className="text-[11px] text-zinc-500 font-light">Map layout cards to active database category layers.</p>
          </div>
          <button 
            type="button"
            onClick={() => updateDraft(d => {
              d.gallery.push({
                id: crypto.randomUUID(),
                title: "Untitled Layout Asset",
                category: activeCategories[0] || "General Sandbox",
                imageUrl: ""
              });
            })}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-lg border border-zinc-700 transition-colors cursor-pointer"
          >
            + Add Asset Card
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {draft.gallery.map((item, index) => (
            <div key={item.id} className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex gap-4 items-start relative group">
              <button
                type="button"
                onClick={() => updateDraft(d => { d.gallery.splice(index, 1); })}
                className="absolute top-3 right-3 text-zinc-600 hover:text-red-400 text-[10px] font-mono transition-colors cursor-pointer"
              >
                Remove
              </button>

              {/* Hardware Base64 Upload Frame Visual Preview Module Container */}
              <div className="w-20 h-20 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-zinc-600 font-mono text-center px-1">No Media Loaded</span>
                )}
              </div>

              {/* Interactive Core Form Fields Wrapper */}
              <div className="flex-1 space-y-2.5">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-mono text-zinc-500">Asset Title / Caption Data</label>
                  <input 
                    type="text" 
                    value={item.title} 
                    onChange={(e) => updateDraft(d => { d.gallery[index].title = e.target.value; })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg text-xs outline-none text-zinc-200 focus:border-emerald-500/20" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-mono text-zinc-500">Align Category</label>
                    <select
                      value={item.category}
                      onChange={(e) => updateDraft(d => { d.gallery[index].category = e.target.value; })}
                      className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg text-xs outline-none text-zinc-300 focus:border-emerald-500/20"
                    >
                      {/* Ensures options array contains at least one target baseline option link block */}
                      {activeCategories.length === 0 && <option value="General Sandbox">General Sandbox</option>}
                      {activeCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-0.5 flex flex-col justify-end">
                    <label className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono py-1.5 rounded-lg text-center transition-colors">
                      Upload Frame
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => processImageUpload(e, (b64) => updateDraft(d => { d.gallery[index].imageUrl = b64; }))}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
