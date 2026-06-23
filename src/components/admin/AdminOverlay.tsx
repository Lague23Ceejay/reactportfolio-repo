import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';

export function AdminOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const { isAuthenticated, setAuthenticated, draft, updateDraft, data, isSaving, setSaving, setPortfolioData } = usePortfolioStore();

  useEffect(() => {
    const handleHashChange = () => setIsOpen(window.location.hash === '#admin');
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!isOpen) return null;

  // Local helper logic to handle client-side cryptographic comparisons securely
  const verifyPin = async () => {
    if (!data?.settings.pinHash) return;
    const encoder = new TextEncoder();
    const encodedPin = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedPin);
    const calculatedHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (calculatedHash === data.settings.pinHash) {
      setAuthenticated(true);
    } else {
      alert('Invalid PIN Access Code Provided.');
      setPin('');
    }
  };

  const processImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async () => {
    if (!draft) return;
    if (!window.confirm('Commit modifications and trigger production rebuild deployment?')) return;

    try {
      setSaving(true);
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      });
      if (!response.ok) throw new Error('Could not persist configuration modifications upstream.');
      setPortfolioData(draft);
      alert('Content synchronized successfully. Deployment triggered.');
    } catch (err: any) {
      alert(`Synchronization Failure: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight">Admin System Terminal</h3>
            <p className="text-xs font-mono text-zinc-500">Provide authorization PIN key to continue</p>
          </div>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} className="w-full text-center text-2xl tracking-widest bg-zinc-950 border border-zinc-800 py-3 rounded-xl focus:border-emerald-500 font-mono text-emerald-400 outline-none" placeholder="••••" />
          <button onClick={verifyPin} className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm">Authenticate Session</button>
          <button onClick={() => { window.location.hash = ''; }} className="text-xs font-mono text-zinc-500 hover:text-zinc-400">Exit Workspace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Portfolio Engine Console</h2>
            <p className="text-xs font-mono text-emerald-400/80 mt-1">Live staging sandbox session active</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => { setAuthenticated(false); window.location.hash = ''; }} className="flex-1 sm:flex-none px-4 py-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium text-sm transition-colors">Discard & Close</button>
            <button onClick={handleSaveChanges} disabled={isSaving} className="flex-1 sm:flex-none px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-zinc-950 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
              {isSaving ? 'Synchronizing...' : 'Commit Updates'}
            </button>
          </div>
        </div>

        {draft && (
          {/* Projects Array Matrix Manager */}
<div className="space-y-6 pt-8">
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Project Portfolio Repositories</h3>
      <p className="text-xs text-zinc-500 font-light mt-0.5">Manage live portfolio timeline entries and technical stacks.</p>
    </div>
    <button 
      type="button"
      onClick={() => updateDraft(d => {
        d.projects.push({
          id: crypto.randomUUID(),
          title: "New Project Item",
          description: "",
          stack: [],
          liveUrl: "",
          githubUrl: "",
          featured: false
        });
      })}
      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono rounded-lg border border-zinc-700 transition-colors"
    >
      + Add Project Entry
    </button>
  </div>

  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
    {draft.projects.map((project, index) => (
      <div key={project.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl relative space-y-4 group">
        <button
          type="button"
          onClick={() => updateDraft(d => { d.projects.splice(index, 1); })}
          className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 text-xs font-mono transition-colors"
        >
          Remove
        </button>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-zinc-500">Project Title</label>
            <input 
              type="text" 
              value={project.title} 
              onChange={(e) => updateDraft(d => { d.projects[index].title = e.target.value; })}
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-sm outline-none focus:border-emerald-500/30 text-zinc-200" 
            />
          </div>
          <div className="space-y-1 flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-mono text-zinc-400">
              <input 
                type="checkbox" 
                checked={project.featured} 
                onChange={(e) => updateDraft(d => { d.projects[index].featured = e.target.checked; })}
                className="accent-emerald-500 rounded" 
              />
              Feature on Main Layout Hero Ring
            </label>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono text-zinc-500">Repository Narrative / Feature Target Summary</label>
            <textarea 
              rows={2}
              value={project.description} 
              onChange={(e) => updateDraft(d => { d.projects[index].description = e.target.value; })}
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-sm outline-none resize-none focus:border-emerald-500/30 text-zinc-300 leading-relaxed" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-zinc-500">Live Domain Deployment Anchor</label>
            <input 
              type="text" 
              value={project.liveUrl} 
              onChange={(e) => updateDraft(d => { d.projects[index].liveUrl = e.target.value; })}
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-xs font-mono outline-none focus:border-emerald-500/30 text-zinc-400" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-zinc-500">Source Control Git Link</label>
            <input 
              type="text" 
              value={project.githubUrl} 
              onChange={(e) => updateDraft(d => { d.projects[index].githubUrl = e.target.value; })}
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-xs font-mono outline-none focus:border-emerald-500/30 text-zinc-400" 
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono text-zinc-500">Framework Infrastructure Array (Comma Separated Serializer)</label>
            <input 
              type="text" 
              value={project.stack.join(', ')} 
              onChange={(e) => updateDraft(d => { 
                d.projects[index].stack = e.target.value.split(',').map(s => s.trim()).filter(Boolean); 
              })}
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-xs font-mono outline-none focus:border-emerald-500/30 text-emerald-400" 
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Gallery Masonry Sandbox Manager */}
<div className="space-y-6 pt-8">
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

        <div className="w-20 h-20 bg-zinc-900 rounded-xl border border-zinc-800/80 shrink-0 overflow-hidden flex items-center justify-center relative group/img">
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
        <div className="space-y-6 pt-8 pb-4">
          <div>
            <h3 className="text-sm font-mono font-semibold text-red-400 uppercase tracking-wider">System Terminal Parameters</h3>
            <p className="text-xs text-zinc-500 font-light mt-0.5">Modify workspace environment parameters and rotate console security keys.</p>
          </div>

          <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl grid sm:grid-cols-2 gap-6 items-start">
            {/* Global Website Targets */}
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
                <p className="text-[10px] text-zinc-600 font-light font-mono">This value drives the real-time SVG QR Code dynamic engine generation matrix.</p>
              </div>
            </div>

            {/* Cryptographic Key Update Form Panel */}
            <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 block font-medium">Rotate Console Access PIN Code</label>
                <p className="text-[10px] text-zinc-500 font-light leading-relaxed">Provide a new numerical 4-digit token key below to cycle the cryptographic access signature.</p>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="password"
                  id="newConsolePinInput"
                  maxLength={4}
                  placeholder="••••"
                  className="bg-zinc-950 border border-zinc-800 text-center tracking-widest p-2 rounded-xl text-sm font-mono text-emerald-400 outline-none focus:border-emerald-500/40 w-24"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '');
                  }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    const inputEl = document.getElementById('newConsolePinInput') as HTMLInputElement;
                    const newPin = inputEl?.value;
                    
                    if (!newPin || newPin.length !== 4) {
                      alert('Validation Error: Security access key tokens must contain exactly 4 numeric characters.');
                      return;
                    }

                    if (!window.confirm('Are you sure you want to rotate the console hash parameter signature key?')) return;

                    try {
                      const encoder = new TextEncoder();
                      const binaryData = encoder.encode(newPin);
                      const derivedBuffer = await crypto.subtle.digest('SHA-256', binaryData);
                      const updatedHexHash = Array.from(new Uint8Array(derivedBuffer))
                        .map(byte => byte.toString(16).padStart(2, '0'))
                        .join('');

                      updateDraft(d => {
                        d.settings.pinHash = updatedHexHash;
                      });

                      inputEl.value = '';
                      alert('Cryptographic hash rotated successfully in draft sandbox state. Remember to commit changes upstream to synchronize.');
                    } catch (err: any) {
                      alert(`Cryptographic Subsystem Fault: ${err.message}`);
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-zinc-700/80 text-zinc-300 text-xs font-mono rounded-xl transition-all"
                >
                  Compute New Hash
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}
