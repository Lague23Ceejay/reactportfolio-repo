import { create } from 'zustand';
import type { DimensionType, ThemePack } from '../types/theme';

export const dimensionPacks: Record<DimensionType, ThemePack> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Drop',
    tagline: 'Dev/Night Coder',
    bgClass: 'bg-zinc-950 font-mono text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-400',
    textClass: 'text-zinc 400',
    accentClass: 'border-emerald-500/40 text-emerald-400 shadow-emerald-900/20',
    cardClass: 'bg-zinc-900/90 border-zinc-800/80 shadow-[0_0_20px_rgba(16,185,129,0.05)]',
    fontClass: 'font-mono tracking-tight',
    cursor: { type: 'line', color: '#10b981', glow: '0 0 14px #10b981', trail: true },
    motionSpeed: 0.6,
    ease: 'power3.out',
    // CONTRAST OVERRIDES:
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400'
  },
  /// Inside src/store/themeStore.ts
  creamy: {
    id: 'creamy',
    name: 'Creamy Studio',
    tagline: 'Creative/Soft Aesthetic',
    // Root background canvas layout configured to your precise soft blue style palette
    bgClass: 'bg-[#8FD9FB] font-sans text-stone-900 selection:bg-[#FFEE8C] selection:text-stone-900',
    
    /* ==========================================================================
       🚀 FIXED: GENERAL TEXT VALUE CONTRAST RE-CALIBRATION
       ========================================================================== */
    // Swapped from text-stone-600 to text-stone-800/90. This ensures that even if 
    // a component reads from 'textClass' directly, it renders in highly legible charcoal.
    textClass: 'text-stone-800/90', 
    
    accentClass: 'border-[#FFEE8C] text-stone-900 shadow-[0_4px_20px_rgba(255,238,140,0.45)]',
    cardClass: 'bg-white border-stone-200/80 shadow-[0_12px_40px_rgba(120,110,100,0.06)] backdrop-blur-sm',
    fontClass: 'font-sans tracking-normal',
    cursor: { type: 'dot', color: '#e11d48', glow: '0 4px 14px rgba(225,29,72,0.2)', trail: false },
    motionSpeed: 1.2,
    ease: 'elastic.out(1, 0.75)',
    
    // Unified high-contrast color mappings for headers and paragraphs
    textPrimary: 'text-stone-900 font-extrabold', // Deep dark slate tone for headers ("About Me")
    textSecondary: 'text-stone-800 font-medium',  // Crisp dark charcoal for paragraphs ("Passionate developer...")
  },

  arctic: {
    id: 'arctic',
    name: 'Neon Arctic',
    tagline: 'Corporate/Minimal',
    bgClass: 'bg-[#030006] font-sans text-slate-100 selection:bg-[#B069DB]/30 selection:text-[#e9d5ff]',
    textClass: 'text-slate-400',
    accentClass: 'border-[#B069DB]/50 text-cyan-400 shadow-[0_0_25px_rgba(176,105,219,0.3)]',
    cardClass: 'bg-[#08040f]/80 border-[#B069DB]/20 shadow-[0_0_30px_rgba(176,105,219,0.06)] backdrop-blur-md',
    fontClass: 'font-sans tracking-wide',
    cursor: { type: 'target', color: '#22d3ee', glow: '0 0 15px #22d3ee', trail: false },
    motionSpeed: 0.4,
    ease: 'power4.inOut',
    // CONTRAST OVERRIDES:
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400'
  }
};


interface ThemeState {
  currentDimension: 'cosmic' | 'arctic' | 'creamy';
  isTransitioning: boolean;
  isAudioMuted: boolean; // 🚀 FIXED: Explicitly type parameter visibility hook flags
  setDimension: (dim: 'cosmic' | 'arctic' | 'creamy') => void;
  toggleAudioMute: () => void; // 🚀 FIXED: Explicitly type state action mutator contract
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentDimension: 'cosmic',
  isTransitioning: false,
  isAudioMuted: true, // Audio starts safely muted by default

  toggleAudioMute: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setDimension: (dim) => set({ currentDimension: dim }),
}));