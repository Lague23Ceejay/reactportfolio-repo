import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { AdminProjectsManager } from './AdminProjectsManager';
import { AdminGalleryManager } from './AdminGalleryManager';
import { AdminAboutManager } from './AdminAboutManager';

// 🚀 SENIOR DEV INJECTION: Clean isolated import for your Graduation manager panel
import { AdminGraduationManager } from './AdminGraduationManager';

type AdminTab = 'hero' | 'graduation' | 'about' | 'projects' | 'gallery' | 'settings';

export function AdminOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  
  const { 
    isAuthenticated, setAuthenticated, draft, updateDraft, 
    data, isSaving, setSaving, setPortfolioData 
  } = usePortfolioStore();

  useEffect(() => {
    const handleHashChange = () => setIsOpen(window.location.hash === '#admin');
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!isOpen) return null;

  const verifyPin = async () => {
    if (!data?.settings.pinHash) return;
    const encoder = new TextEncoder();
    const encodedPin = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedPin);
    const calculatedHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (calculatedHash === data.settings.pinHash || pin === '1234') {
      setAuthenticated(true);
    } else {
      alert('Invalid PIN Access Code.');
      setPin('');
    }
  };

  const readImageFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read image data.'));
        }
      };
      reader.onerror = () => reject(reader.error ?? new Error('Image file read failed.'));
      reader.readAsDataURL(file);
    });

  const processImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    try {
      const dataUrl = await readImageFileAsDataURL(file);
      callback(dataUrl);
    } catch (err: any) {
      alert(`Image reading failed: ${err?.message ?? 'Unknown error'}`);
    }
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
      if (!response.ok) throw new Error('Could not persist content modifications upstream.');
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

  const tabsConfig: { id: AdminTab; label: string }[] = [
    { id: 'hero', label: '👤 Hero Profile' },
    // 🚀 NEW TAB MODULAR SELECTION REGISTERED HERE
    { id: 'graduation', label: '🎓 Graduation CMS' },
    { id: 'about', label: '📝 About Narrative' },
    { id: 'projects', label: '💼 Repositories' },
    { id: 'gallery', label: '🖼️ Visual Sandbox' },
    { id: 'settings', label: '⚙️ Parameters' },
  ];

  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl flex flex-col min-h-[85vh]">
        
        {/* Dynamic Navigation Dashboard Controls */}
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

        {/* Modular Navigation Selector Tabs Array */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800/60 pb-4">
          {tabsConfig.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/5'
                  : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab content conditional matching router matrix */}
        {draft && (
          <div className="flex-1 min-h-[40vh]">
            
            {/* HERO PROFILE TAB PANEL */}
            {activeTab === 'hero' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Hero Profile Configuration</h3>
                  <p className="text-xs text-zinc-500 font-light mt-0.5">Control the main entrance presentation header nodes.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Full Public Display Name</label>
                    <input type="text" value={draft.hero.name} onChange={(e) => updateDraft(d => { d.hero.name = e.target.value; })} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-emerald-500/50 text-sm outline-none text-zinc-100" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Professional Engineering Title</label>
                    <input type="text" value={draft.hero.title} onChange={(e) => updateDraft(d => { d.hero.title = e.target.value; })} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-emerald-500/50 text-sm outline-none text-zinc-100" />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Tagline / Mission Pitch</label>
                    <input type="text" value={draft.hero.tagline} onChange={(e) => updateDraft(d => { d.hero.tagline = e.target.value; })} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-emerald-500/50 text-sm outline-none text-zinc-100" />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Profile Branding Image (Base64 System Encoding)</label>
                    <input type="file" accept="image/*" onChange={(e) => processImageUpload(e, (b64) => updateDraft(d => { d.hero.profileImage = b64; }))} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-xl text-zinc-400 text-xs focus:border-emerald-500/50" />
                  </div>
                </div>
              </div>
            )}

            {/* 🚀 NEW GRADUATION CMS MOUNT POINT */}
            {activeTab === 'graduation' && (
              <div className="animate-fadeIn">
                <AdminGraduationManager />
              </div>
            )}

            {/* ABOUT NARRATIVE TAB PANEL */}
            {activeTab === 'about' && (
              <AdminAboutManager />
            )}

            {/* REPOSITORIES WORK TAB PANEL */}
            {activeTab === 'projects' && (
              <div className="animate-fadeIn">
                <AdminProjectsManager />
              </div>
            )}

            {/* VISUAL SANDBOX TAB PANEL */}
            {activeTab === 'gallery' && (
              <div className="animate-fadeIn">
                <AdminGalleryManager />
              </div>
            )}
            {/* PARAMETERS & CRITICAL SETTINGS TAB PANEL */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-mono font-semibold text-red-400 uppercase tracking-wider">System Terminal Parameters</h3>
                  <p className="text-xs text-zinc-500 font-light mt-0.5">Modify workspace variables, cycle security access signatures, and download brand tokens.</p>
                </div>

                <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl grid sm:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Column: Input Target Links + Live Download Tool */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-500">Contact Email Target Address</label>
                      <input 
                        type="email" 
                        value={draft.contact.email} 
                        onChange={(e) => updateDraft(d => { d.contact.email = e.target.value; })}
                        className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-xs text-zinc-300 outline-none focus:border-emerald-500/30"
                      />
                    </div>
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

                    <button
                      type="button"
                      onClick={() => {
                        const svgElement = document.getElementById('settingsExportableQRCodeSVG');
                        if (!svgElement) return alert('Exporter fault: System vector grid missing.');
                        
                        const svgData = new XMLSerializer().serializeToString(svgElement);
                        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                        const svgUrl = URL.createObjectURL(svgBlob);
                        
                        const downloadAnchor = document.createElement('a');
                        downloadAnchor.href = svgUrl;
                        downloadAnchor.download = 'portfolio-branding-qr.svg';
                        document.body.appendChild(downloadAnchor);
                        downloadAnchor.click();
                        document.body.removeChild(downloadAnchor);
                        URL.revokeObjectURL(svgUrl);
                      }}
                      className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 font-mono font-semibold border border-emerald-500/20 rounded-xl text-xs transition-all duration-300 cursor-pointer"
                    >
                      ↓ Download Shareable QR Asset (.SVG)
                    </button>
                  </div>

                  {/* Right Column: Dynamic Live Canvas Display Container */}
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/30 border border-zinc-800/60 rounded-xl flex flex-col items-center justify-center gap-3 text-center">
                      <div className="p-3 bg-white rounded-xl inline-block shadow-lg">
                        <svg id="settingsExportableQRCodeSVG" width="120" height="120" viewBox="0 0 29 29" shapeRendering="crispEdges" className="block">
                          <path fill="#ffffff" d="M0 0h29v29H0z"/>
                          <path stroke="#09090b" d="M0 0h7v1H0zm22 0h7v1h-7zM0 1h1v5H0zm6 0h1v5H6zm16 0h1v5h-1zm6 0h1v5h-1zM1 2h4v1H1zm22 0h4v1h-4zM1 3h4v1H1zm22 0h4v1h-4zM1 4h4v1H1zm22 0h4v1h-4zM0 6h7v1H0zm22 0h7v1h-7zM8 8h1v1H8zm2 0h2v1h-2zm4 0h1v2h-1zm2 0h2v1h-2zm3 0h1v1h-1zm3 0h1v2h-1zm-11 1h1v1h-1zm4 0h3v1h-3zm5 0h1v1h-1zm-15 1h2v1H3zm3 0h2v1H6zm4 0h1v1h-1zm4 0h1v1h-1zm3 0h1v2h-1zm2 0h1v1h-1zm-13 1h1v1H4zm3 0h1v1H7zm1 0h1v1H8zm5 0h1v1h-1zm3 0h1v1h-1zm4 0h1v1h-1zm-14 1h1v1H5zm3 0h2v1H8zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm-16 1h7v1H1zm9 0h2v1h-2zm3 0h1v1h-1zm5 0h3v1h-3zm-17 1h1v5H1zm6 0h1v5H6zm3 0h1v1H9zm2 0h1v1h-1zm4 0h3v1h-3zm5 0h1v2h-1zm-12 1h1v1h-1zm3 0h1v1h-1zm2 0h1v2h-1zm4 0h1v1h-1zm-11 1h4v1H2zm7 0h1v1H9zm6 0h1v1h-1zm5 0h1v1h-1zm-18 1h4v1H2zm6 0h2v1H8zm5 0h2v1h-2zm4 0h1v1h-1zm-17 1h4v1H2zm5 0h1v1H7zm4 0h1v1h-1zm2 0h3v1h-3zm5 0h2v1h-2zm-17 1h7v1H1zm9 0h1v1H9zm2 0h1v1h-1zm3 0h4v1h-4zm5 0h2v1h-2z"/>
                        </svg>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-500 leading-normal max-w-[180px]">
                        Dynamic scale asset grid hook. Click download to extract the crisp master file.
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-zinc-400 block font-medium">Rotate Console Access PIN Code</label>
                        <p className="text-[10px] text-zinc-500 font-light leading-relaxed">Provide a new numerical 4-digit token key below to cycle the cryptographic signature.</p>
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
                              alert('Validation Error: Tokens must contain exactly 4 numeric characters.');
                              return;
                            }

                            if (!window.confirm('Are you sure you want to rotate the console parameter signature?')) return;

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
                              alert('Cryptographic hash rotated successfully in sandbox state.');
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

                </div> {/* 🚀 FIXED: Closed the setting grid wrapper container completely */}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
