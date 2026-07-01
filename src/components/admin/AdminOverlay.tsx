// src/components/admin/AdminOverlay.tsx

import { useState, useEffect } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { AdminProjectsManager } from './AdminProjectsManager';
import { AdminGalleryManager } from './AdminGalleryManager';
import { AdminAboutManager } from './AdminAboutManager';
import { AdminGraduationManager } from './AdminGraduationManager';
import { optimizeImage } from '../../utils/imageOptimizer'; // 🚀 LIGHTWEIGHT UTILITY: Client-side compression script

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
     6. LOCKED GATEKEEPER UI ACCESS SHIELD
     ========================================================================== */
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight">Admin System Terminal</h3>
            <p className="text-xs font-mono text-zinc-500">Provide authorization PIN key to continue</p>
          </div>
          <input 
            type="password" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            maxLength={4} 
            className="w-full text-center text-2xl tracking-widest bg-zinc-950 border border-zinc-800 py-3 rounded-xl focus:border-emerald-500 font-mono text-emerald-400 outline-none" 
            placeholder="••••" 
          />
          <button onClick={verifyPin} className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-3 rounded-xl transition-colors text-sm">
            Authenticate Session
          </button>
          <button onClick={() => { window.location.hash = ''; }} className="text-xs font-mono text-zinc-500 hover:text-zinc-400">
            Exit Workspace
          </button>
        </div>
      </div>
    );
  }

  // Structural mapping dictionary mapping options configured on control row tabs
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
                  
                  {/* MODIFIED: LIGHTWEIGHT AVATAR FILE UPLOADER PIPELINE (NO BASE64 INJECTION) */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-mono text-zinc-400">Profile Branding Image (Vercel Cloud Blob Delivery)</label>
                    <div className="flex items-center gap-4">
                      <label className={`flex-1 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors p-3 rounded-xl cursor-pointer text-zinc-400 text-xs ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <span>{isUploading ? 'Compressing & Syncing Cloud CDN...' : draft.hero.profileImage ? 'Replace Active Avatar' : 'Select Display File'}</span>
                        <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" disabled={isUploading} />
                      </label>
                      {draft.hero.profileImage && !isUploading && (
                        <div className="w-11 h-11 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden p-0.5 flex-shrink-0">
                          <img src={draft.hero.profileImage} alt="Avatar Staging Preview" className="w-full h-full object-cover rounded-lg" />
                        </div>
                      )}
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

                    {/* INTERACTIVE VECTOR GENERATOR AND FORCE ANCHOR TRIGGER MODULE */}
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
                                      {/* COLUMN 2: HARDWARE PREVIEW VISUALIZER & DYNAMIC TRACK RECORDS */}
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/30 border border-zinc-800/60 rounded-xl flex flex-col items-center justify-center gap-3 text-center">
                      <div className="p-3 bg-white rounded-xl inline-block shadow-lg">
                        {/* High-density pixel-aligned SVG vector matrix map schema layout */}
                        <svg id="settingsExportableQRCodeSVG" width="120" height="120" viewBox="0 0 29 29" shapeRendering="crispEdges" className="block">
                          <path fill="#ffffff" d="M0 0h29v29H0z"/>
                          <path stroke="#09090b" d="M0 0h7v1H0zm22 0h7v1h-7zM0 1h1v5H0zm6 0h1v5H6zm16 0h1v5h-1zm6 0h1v5h-1zM1 2h4v1H1zm22 0h4v1h-4zM1 3h4v1H1zm22 0h4v1h-4zM1 4h4v1H1zm22 0h4v1h-4zM0 6h7v1H0zm22 0h7v1h-7zM8 8h1v1H8zm2 0h2v1h-2zm4 0h1v2h-1zm2 0h2v1h-2zm3 0h1v1h-1zm3 0h1v2h-1zm-11 1h1v1h-1zm4 0h3v1h-3zm5 0h1v1h-1zm-15 1h2v1H3zm3 0h2v1H6zm4 0h1v1h-1zm4 0h1v1h-1zm3 0h1v2h-1zm2 0h1v1h-1zm-13 1h1v1H4zm3 0h1v1H7zm1 0h1v1H8zm5 0h1v1h-1zm3 0h1v1h-1zm4 0h1v1h-1zm-14 1h1v1H5zm3 0h2v1H8zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm-16 1h7v1H1zm9 0h2v1h-2zm3 0h1v1h-1zm5 0h3v1h-3zm-17 1h1v5H1zm6 0h1v5H6zm3 0h1v1H9zm2 0h1v1h-1zm4 0h3v1h-3zm5 0h1v2h-1zm-12 1h1v1h-1zm3 0h1v1h-1zm2 0h1v2h-1zm4 0h1v1h-1zm-11 1h4v1H2zm7 0h1v1H9zm6 0h1v1h-1zm5 0h1v1h-1zm-18 1h4v1H2zm6 0h2v1H8zm5 0h2v1h-2zm4 0h1v1h-1zm-17 1h4v1H2zm5 0h1v1H7zm4 0h1v1h-1zm2 0h3v1h-3zm5 0h2v1h-2zm-17 1h7v1H1zm9 0h1v1H9zm2 0h1v1h-1zm3 0h4v1h-4zm5 0h2v1h-2z"/>
                        </svg>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-500 leading-normal max-w-[180px]">
                        Dynamic scale asset grid hook. Click download to extract the crisp master file.
                      </p>
                    </div>
                  </div>

                  {/* DYNAMIC INTEGRATED AUDIO AMBIENT CMS ROW CONTROLLER */}
                  <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-4 sm:col-span-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 block font-bold uppercase tracking-wider text-emerald-400">
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
                              <p className="text-[9px] text-zinc-500 font-mono truncate max-w-[200px]" title={currentTrackUrl}>
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
