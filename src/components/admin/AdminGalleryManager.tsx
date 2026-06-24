import { usePortfolioStore } from '../../store/portfolioStore';
import { QRCodeSVG } from 'qrcode.react';

export function AdminGalleryManager() {
  const { draft, updateDraft } = usePortfolioStore();

  if (!draft) return null;

  const processImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Gallery Masonry Sandbox Manager */}
      <div className="space-y-6 pt-8 border-t border-zinc-800/60">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Visual Assets Grid</h3>
            <p className="text-xs text-zinc-500 font-light mt-0.5">Inject Base64 binary imagery straight to your file store.</p>
          </div>
          <button 
            type="button"
            onClick={() => updateDraft(d => {
              d.gallery.push({
                id: crypto.randomUUID(),
                title: "New Visual Asset",
                category: "Design",
                imageUrl: ""
              });
            })}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-lg border border-zinc-700 transition-colors"
          >
            + Add Asset Card
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {draft.gallery.map((item, index) => (
            <div key={item.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex gap-4 items-start relative group">
              <button
                type="button"
                onClick={() => updateDraft(d => { d.gallery.splice(index, 1); })}
                className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 text-[10px] font-mono transition-colors"
              >
                Remove
              </button>

              <div className="w-20 h-20 bg-zinc-900 rounded-xl border border-zinc-800/80 shrink-0 overflow-hidden flex items-center justify-center relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-zinc-600 font-mono text-center px-1">No Frame</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-mono text-zinc-500">Asset Title</label>
                  <input 
                    type="text" 
                    value={item.title} 
                    onChange={(e) => updateDraft(d => { d.gallery[index].title = e.target.value; })}
                    className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg text-xs outline-none text-zinc-200 focus:border-emerald-500/20" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-mono text-zinc-500">Classification</label>
                    <input 
                      type="text" 
                      value={item.category} 
                      onChange={(e) => updateDraft(d => { d.gallery[index].category = e.target.value; })}
                      className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg text-xs outline-none text-zinc-300 focus:border-emerald-500/20" 
                    />
                  </div>
                  <div className="space-y-0.5 flex flex-col justify-end">
                    <label className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono py-2 rounded-lg text-center transition-colors">
                      Upload File
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

      {/* Critical Engine Settings & PIN Rotation Security Block */}
<div className="space-y-6 pt-8 pb-4 border-t border-zinc-800/60">
  <div>
    <h3 className="text-sm font-mono font-semibold text-red-400 uppercase tracking-wider">System Terminal Parameters</h3>
    <p className="text-xs text-zinc-500 font-light mt-0.5">Modify workspace environment parameters, rotate keys, and export brand tokens.</p>
  </div>

  <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl grid sm:grid-cols-2 gap-6 items-center">
    
    {/* Left Column: Input Target Links + Live Download Tool */}
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-zinc-500">Public Production Domain Target URL</label>
        <input 
          type="url" 
          value={draft.contact.websiteUrl} 
          onChange={(e) => updateDraft(d => { d.contact.websiteUrl = e.target.value; })}
          className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-xs font-mono text-zinc-300 outline-none focus:border-emerald-500/30"
          placeholder="https://vercel.app"
        />
      </div>

      {/* Dynamic Exporter Engine Integration Button Trigger */}
      <button
        type="button"
        onClick={() => {
          const svgElement = document.getElementById('adminExportableQRCodeSVG');
          if (!svgElement) return;
          
          // Parse raw XML stream fragments to data URI schemas
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);
          
          // Push automated anchor trigger to downstream download queues
          const downloadAnchor = document.createElement('a');
          downloadAnchor.href = svgUrl;
          downloadAnchor.download = 'portfolio-branding-qr.svg';
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          document.body.removeChild(downloadAnchor);
          URL.revokeObjectURL(svgUrl);
        }}
        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 font-mono font-semibold border border-emerald-500/20 rounded-xl text-xs transition-all duration-300"
      >
        ↓ Save Brand QR Asset (.SVG)
      </button>
    </div>

    {/* Right Column: Encapsulated Hidden Vector Canvas Generator Rendering Node */}
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/30 border border-zinc-800/60 rounded-xl gap-2 text-center">
      <div className="p-3 bg-white rounded-xl shadow-inner inline-block">
        <QRCodeSVG 
          id="adminExportableQRCodeSVG"
          value={draft.contact.websiteUrl || window.location.origin} 
          size={110} 
          bgColor="#ffffff" 
          fgColor="#09090b" 
          level="H" 
        />
      </div>
      <p className="text-[10px] font-mono text-zinc-500 leading-normal max-w-[180px]">
        Generates cleanly based on website settings variables. Vector-scaled for clean sharing grids.
      </p>
    </div>

  </div>
</div>
    </>
  );
}
