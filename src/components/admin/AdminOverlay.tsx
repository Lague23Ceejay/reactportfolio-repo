// src/components/admin/AdminOverlay.tsx

import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { AdminProjectsManager } from './AdminProjectsManager';
import { AdminGalleryManager } from './AdminGalleryManager';
import { AdminAboutManager } from './AdminAboutManager';
import { AdminGraduationManager } from './AdminGraduationManager';
import { optimizeImage } from '../../utils/imageOptimizer'; // 🚀 LIGHTWEIGHT UTILITY: Client-side compression script
import { useImageUpload } from '../../hooks/useImageUpload';

// Strict mapping type dictionary for application workspace tab-routing matrices
type AdminTab = 'hero' | 'graduation' | 'about' | 'projects' | 'gallery' | 'settings';

export function AdminOverlay() {
  /* ==========================================================================
     1. APPLICATION CORE RUNTIME VARIABLES & HOOK STATES
     ========================================================================== */
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  const [isUploading, setIsUploading] = useState(false); // Tracks current avatar media binary cloud upload streams

   const { uploadImage } = useImageUpload();

  // Destructure central reactive application Zustand state engines
  const { 
    isAuthenticated, setAuthenticated, draft, updateDraft, 
    data, isSaving, setSaving, setPortfolioData 
  } = usePortfolioStore();

  /* ==========================================================================
     2. AUTOMATED HASH-ROUTER SYNCHRONIZATION RUNTIME
     ========================================================================== */
  useEffect(() => {
    // Listens explicitly for URL hash mutations to conditionally toggle administration view frames
    const handleHashChange = () => setIsOpen(window.location.hash === '#admin');
    
    // Initial evaluation trigger on component initialization mount
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

   /* 🚀 SENIOR DEV INJECTION: ISOLATED BACKGROUND SCROLL LATCH 
     Whenever the overlay container window mounts or closes (`isOpen`), this effect 
     physically locks down the window viewport to block background scrolling leak bugs.
  */
  useEffect(() => {
    // Select the root document body layer element node
    const body = document.body;

    if (isOpen) {
      // 🔒 LOCK ACTION: Appends overflow tracking styles to freeze the viewport grid
      body.classList.add('overflow-hidden');
    } else {
      // 🔓 UNLOCK ACTION: Strips out hidden properties to restore default page interactions safely
      body.classList.remove('overflow-hidden');
    }

    // Clean up return hook safety trigger to restore default scroll behaviors if the component unmounts unexpectedly
    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ==========================================================================
     3. CRYPTOGRAPHIC ACCESS TOKEN CHECKSUM VERIFIER
     ========================================================================== */
  const verifyPin = async () => {
    if (!data?.settings.pinHash) return;
    
    // In-browser string hashing utilizing native Web Crypto API subtle digest engines (SHA-256)
    const encoder = new TextEncoder();
    const encodedPin = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedPin);
    const calculatedHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Evaluates dynamic hash parameters with hardcoded development bypass code strings
    if (calculatedHash === data.settings.pinHash || pin === '1234') {
      setAuthenticated(true);
    } else {
      alert('Invalid PIN Access Code.');
      setPin('');
    }
  };

  /* ==========================================================================
     4. HIGH PERFORMANCE BINARY IMAGE SYNC ROUTE
     ========================================================================== */
  const handleResumeAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `${Date.now()}-${cleanName}${file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''}`;

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'x-filename': filename,
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!response.ok) throw new Error(`Upload processing failed (${response.status})`);
      const blobResult = await response.json();

      updateDraft((draftState) => {
        draftState.contact.resumeUrl = blobResult.url;
      });
    } catch (err: any) {
      alert(`Resume Asset Upload Error: ${err?.message ?? 'Unknown context'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    try {
      setIsUploading(true);

      // Transforms image down into a optimized WebP blob context directly inside client browser runtime
      const optimizedBlob = await optimizeImage(file, 500, 0.8);
      
      // Clean target filenames of local file system special metadata signatures prior to deployment
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
      const filename = `${Date.now()}-${cleanName}.webp`;

      // Dispatch binary body payload directly onto local Vercel Serverless proxy API uploads endpoint
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'x-filename': filename,
          'Content-Type': 'image/webp',
        },
        body: optimizedBlob,
      });

      if (!response.ok) throw new Error(`Upload processing failed (${response.status})`);
      const blobResult = await response.json();

      // Mutate local state tree parameters mapping values safely to the hosted Vercel Blob public asset URL
      updateDraft(d => { 
        d.hero.profileImage = blobResult.url; 
      });

    } catch (err: any) {
      alert(`Cloud Upload Error: ${err?.message ?? 'Unknown context'}`);
    } finally {
      setIsUploading(false);
    }
  };

  /* ==========================================================================
     5. UPSTREAM PRODUCTION COMMIT GENERATION CONTROLLER
     ========================================================================== */
  const handleSaveChanges = async () => {
    if (!draft) return;
    if (!window.confirm('Commit modifications and trigger production rebuild deployment?')) return;

    try {
      setSaving(true);
      
      // Transmit sanitized text-only JSON structures via Git proxy serverless architectures
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft }),
      });
      if (!response.ok) throw new Error('Could not persist content modifications upstream.');
      
      // Merge active local production data view state layouts with validated changes immediately
      setPortfolioData(draft);
      alert('Content synchronized successfully. Deployment triggered.');
    } catch (err: any) {
      alert(`Synchronization Failure: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

    /* ==========================================================================
     6. LOCKED GATEKEEPER UI ACCESS SHIELD (PIN INPUT VIEW)
     ========================================================================== */
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none z-50 mix-blend-screen hidden md:block">
          <div className="absolute w-3 h-3 rounded-full bg-red-500 opacity-60 animate-ping" />
        </div>

        <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-zinc-100">Admin System Terminal</h3>
            <p className="text-xs font-mono text-zinc-500">Provide authorization PIN key to continue</p>
          </div>
          <input 
            type="password" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            maxLength={4} 
            className="w-full text-center text-2xl tracking-widest bg-zinc-950 border border-zinc-800 py-3 rounded-xl focus:border-emerald-500 font-mono text-emerald-400 outline-none transition-colors" 
            placeholder="••••" 
          />
          <button 
            type="button"
            onClick={verifyPin} 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            Authenticate Session
          </button>
          <button 
            type="button"
            onClick={() => { window.location.hash = ''; }} 
            className="text-xs font-mono text-zinc-500 hover:text-zinc-400 cursor-pointer block mx-auto underline decoration-dotted"
          >
            Exit Workspace
          </button>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     7. SECURE CONFIGURATION DESCRIPTOR MAP
     Moved outside the final return block to satisfy strict type compilers.
     ========================================================================== */
  const tabsConfig: { id: AdminTab; label: string }[] = [
    { id: 'hero', label: '👤 Hero Profile' },
    { id: 'graduation', label: '🎓 Graduation CMS' },
    { id: 'about', label: '📝 About Narrative' },
    { id: 'projects', label: '💼 Repositories' },
    { id: 'gallery', label: '🖼️ Visual Sandbox' },
    { id: 'settings', label: '⚙️ Parameters' },
  ];

  /* ==========================================================================
     7. MAIN ADMINISTRATIVE CONSOLE PRESENTATION ENGINE
     ========================================================================== */
  return (
    <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl flex flex-col min-h-[85vh]">
        
        {/* SECTION 7.1: SYSTEM TITLE & PERSISTENCE CONTROL TRACKERS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Portfolio Engine Console</h2>
            <p className="text-xs font-mono text-emerald-400/80 mt-1">Live staging sandbox session active</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => { setAuthenticated(false); window.location.hash = ''; }} className="flex-1 sm:flex-none px-4 py-2 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium text-sm transition-colors">
              Discard & Close
            </button>
            <button onClick={handleSaveChanges} disabled={isSaving} className="flex-1 sm:flex-none px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-zinc-950 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
              {isSaving ? 'Synchronizing...' : 'Commit Updates'}
            </button>
          </div>
        </div>

        {/* SECTION 7.2: DYNAMIC NAVIGATION ROUTER INTERACTIVE TABS */}
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

        {/* SECTION 7.3: CONDITIONAL SUB-MANAGER CONTENT CONTROLLERS */}
        {draft && (
          <div className="flex-1 min-h-[40vh]">
            
            {/* SUB-TAB A: HERO PROFILE DOM NODE WRAPPERS */}
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
                  
                  {/* ==========================================================================
                     🚀 INTEGRATED: DUAL-IMAGE MEDIA CMS LAYER WITH DETACH TRIGGERS
                     ========================================================================== */}
                  <div className="sm:col-span-2 space-y-4 border-t border-zinc-800/40 pt-4">
                    <span className="text-[11px] font-mono text-emerald-400 block font-bold uppercase tracking-wider">
                      📸 Profile Identity Media Nodes (Dual-Image Pixel Rotate System)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* SUB-TAB A: HERO PROFILE DOM NODE WRAPPERS */}
                      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/60 flex flex-col justify-between gap-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-zinc-400">Primary Avatar Asset</label>
                          {draft.hero.profileImage && (
                            <button 
                              type="button"
                              onClick={() => updateDraft(d => { d.hero.profileImage = ''; })}
                              className="text-[10px] font-mono text-red-400 hover:text-red-300 honesty-pointer underline cursor-pointer"
                            >
                              Delete Asset
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <label className={`flex-1 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-center text-zinc-400 p-2.5 rounded-lg border border-zinc-800 text-xs font-mono cursor-pointer ${isUploading ? 'opacity-40 pointer-events-none' : ''}`}>
                            <span>Change Photo A</span>
                            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleHeroImageUpload} />
                          </label>
                          {draft.hero.profileImage && (
                            <div className="w-10 h-10 border border-zinc-700 rounded-full overflow-hidden shrink-0">
                              <img src={draft.hero.profileImage} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CARD SLOT B: SECONDARY CYCLING ASSET */}
                      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/60 flex flex-col justify-between gap-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-mono text-zinc-400">Secondary Rotation Asset (Optional)</label>
                          {draft.hero.profileImageSecondary && (
                            <button 
                              type="button"
                              onClick={() => updateDraft(d => { d.hero.profileImageSecondary = ''; })}
                              className="text-[10px] font-mono text-red-400 hover:text-red-300 honesty-pointer underline cursor-pointer"
                            >
                              Delete Asset
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <label className={`flex-1 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-center text-zinc-400 p-2.5 rounded-lg border border-zinc-800 text-xs font-mono cursor-pointer ${isUploading ? 'opacity-40 pointer-events-none' : ''}`}>
                            <span>Upload Photo B</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              disabled={isUploading} 
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setIsUploading(true);
                                  // Reuses your unified custom hook module to optimize and stream to Vercel Blob
                                  const cdnUrl = await uploadImage(file, 500, 0.8);
                                  if (cdnUrl) {
                                    updateDraft(d => { d.hero.profileImageSecondary = cdnUrl; });
                                  }
                                } catch (err) {
                                  console.error(err);
                                } finally {
                                  setIsUploading(false);
                                }
                              }} 
                            />
                          </label>
                          {draft.hero.profileImageSecondary && (
                            <div className="w-10 h-10 border border-zinc-700 rounded-full overflow-hidden shrink-0">
                              <img src={draft.hero.profileImageSecondary} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SUB-TAB B: CELEBRATION GRADUATION MANAGER BLOCK ASSEMBLY */}
            {activeTab === 'graduation' && (
              <div className="animate-fadeIn">
                <AdminGraduationManager />
              </div>
            )}

            {/* SUB-TAB C: ABOUT NARRATIVE TEXT MANAGER ASSEMBLES */}
            {activeTab === 'about' && (
              <AdminAboutManager />
            )}

            {/* SUB-TAB D: WORK PROJECT METADATA MANAGEMENT BLOCKS */}
            {activeTab === 'projects' && (
              <div className="animate-fadeIn">
                <AdminProjectsManager />
              </div>
            )}

            {/* SUB-TAB E: MEDIA SANDBOX AND ASSET CONTROL GALLERIES */}
            {activeTab === 'gallery' && (
              <div className="animate-fadeIn">
                <AdminGalleryManager />
              </div>
            )}
                       { /* ==========================================================================
               SUB-TAB F: SYSTEM TERMINAL PARAMETERS MASTER CONFIGURATION
               ========================================================================== */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-mono font-semibold text-red-400 uppercase tracking-wider">System Terminal Parameters</h3>
                  <p className="text-xs text-zinc-500 font-light mt-0.5">Modify workspace variables, cycle security access signatures, and download brand tokens.</p>
                </div>

                {/* TWO-COLUMN CONFIGURATION GRID LAYOUT MATRIX */}
                <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl grid sm:grid-cols-2 gap-6 items-start">
                  
                  {/* COLUMN 1: TARGET DESTINATION INPUT LINKS + LIVE DOWNLOAD TOOL */}
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

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-500">Resume Asset (PDF, image, or file)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={handleResumeAssetUpload}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-zinc-300 file:mr-3 file:rounded-full file:border-0 file:bg-emerald-500/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-emerald-400"
                      />
                      {draft.contact.resumeUrl && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-2.5 text-[11px] text-zinc-400">
                          <p className="font-semibold text-zinc-300">Current asset</p>
                          <a href={draft.contact.resumeUrl} target="_blank" rel="noreferrer" className="mt-1 block break-all text-emerald-400 underline underline-offset-2">
                            {draft.contact.resumeUrl}
                          </a>
                        </div>
                      )}
                    </div>


                </div>

                  {/* DYNAMIC INTEGRATED AUDIO AMBIENT CMS ROW CONTROLLER */}
                  <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-4 sm:col-span-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-emerald-400 block font-bold uppercase tracking-wider">
                        🎵 Hot-Swappable Theme Ambient Jukebox
                      </label>
                      <p className="text-[10px] text-zinc-500 font-light leading-relaxed">
                        Upload lightweight audio files (.mp3, .ogg) straight to your Vercel Storage CDN bucket to change the soundtrack assigned to each portal.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {([
                        { key: 'cosmic', title: '👤 Cosmic Track', color: 'text-emerald-400 border-emerald-500/10 hover:border-emerald-500/30' },
                        { key: 'arctic', title: '❄️ Arctic Track', color: 'text-purple-400 border-purple-500/10 hover:border-purple-500/30' },
                        { key: 'creamy', title: '🧁 Creamy Track', color: 'text-rose-400 border-rose-500/10 hover:border-rose-500/30' }
                      ] as const).map((track) => {
                        const currentTrackUrl = draft.settings?.audioTracks?.[track.key] || '';

                        return (
                          <div key={track.key} className="p-3 bg-zinc-950/60 border border-zinc-800/60 rounded-xl flex flex-col justify-between gap-3">
                            <div className="space-y-1">
                              <span className={`text-[10px] font-mono font-bold block ${track.color.split(' ')[0]}`}>
                                {track.title}
                              </span>
                              <p className="text-[9px] text-zinc-500 font-mono truncate max-w-50" title={currentTrackUrl}>
                                Path: {currentTrackUrl ? currentTrackUrl.split('/').pop() : 'Default Asset Embedded'}
                              </p>
                            </div>

                            <label className={`w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 border text-center font-mono rounded-lg text-[10px] cursor-pointer transition-colors block ${track.color.split(' ').slice(1).join(' ')} ${isUploading ? 'opacity-40 pointer-events-none' : ''}`}>
                              <span>{isUploading ? 'Streaming...' : 'Upload Audio File'}</span>
                              <input
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                disabled={isUploading}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  if (file.size > 5 * 1024 * 1024) {
                                    alert("Warning: Large audio file detected. For faster user load times, compress your tracks below 3MB before uploading.");
                                  }

                                  try {
                                    setIsUploading(true);

                                    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
                                    const filename = `audio-${track.key}-${Date.now()}-${cleanName}`;

                                    const response = await fetch('/api/upload-image', {
                                      method: 'POST',
                                      headers: {
                                        'x-filename': filename,
                                        'Content-Type': file.type || 'audio/mpeg',
                                      },
                                      body: file,
                                    });

                                    if (!response.ok) throw new Error(`Media pipeline rejected file: ${response.status}`);
                                    const uploadResult = await response.json();

                                    updateDraft(d => {
                                      if (!d.settings.audioTracks) {
                                        d.settings.audioTracks = { cosmic: '', arctic: '', creamy: '' };
                                      }
                                      d.settings.audioTracks[track.key] = uploadResult.url;
                                    });

                                    alert('Audio track changed! Successfully deployed asset to server CDN.');

                                  } catch (err: any) {
                                    console.error("Audio CMS deployment runtime issue:", err);
                                    alert(`Audio Upload Failure: ${err?.message || "Storage pipeline communication error"}`);
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                                        {/* CENTRAL SECURITY CONTROLS: CONSOLE ACCESS SIGNATURE ROTATOR CARD */}
                  <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-3 sm:col-span-2">
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
                          // Hardware event level interception to filter out alphanumeric characters on key presses
                          e.target.value = e.target.value.replace(/\D/g, '');
                        }}
                      />
                      
                      <button
                        type="button"
                        onClick={async () => {
                          const inputEl = document.getElementById('newConsolePinInput') as HTMLInputElement;
                          const newPin = inputEl?.value;
                          
                          // Reject the submission loop if parameters don't match the strict 4-digit criterion bounds
                          if (!newPin || newPin.length !== 4) {
                            alert('Validation Error: Tokens must contain exactly 4 numeric characters.');
                            return;
                          }

                          if (!window.confirm('Are you sure you want to rotate the console parameter signature?')) return;

                          try {
                            const encoder = new TextEncoder();
                            const binaryData = encoder.encode(newPin);
                            
                            // Native browser runtime subtle digest hashing (SHA-256)
                            const derivedBuffer = await crypto.subtle.digest('SHA-256', binaryData);
                            const updatedHexHash = Array.from(new Uint8Array(derivedBuffer))
                              .map(byte => byte.toString(16).padStart(2, '0'))
                              .join('');

                            // Inject the validated checksum straight back into your Zustand store active draft
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

                </div> {/* CLOSED: Two-column grid container wrapper node matrix row */}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

