// src/store/themeStore.ts

import { create } from 'zustand';
import type { DimensionType, ThemePack } from '../types/theme';

/* ==========================================================================
   1. STATIC PORTAL DIMENSION STYLE PACKS MATRIX
   ========================================================================== */
export const dimensionPacks: Record<DimensionType, ThemePack> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Drop',
    tagline: 'Dev/Night Coder',
    bgClass: 'bg-zinc-950 font-mono text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-400',
    textClass: 'text-zinc-400',
    accentClass: 'border-emerald-500/40 text-emerald-400 shadow-emerald-900/20',
    cardClass: 'bg-zinc-900/90 border-zinc-800/80 shadow-[0_0_20px_rgba(16,185,129,0.05)]',
    fontClass: 'font-mono tracking-tight',
    cursor: { type: 'line', color: '#10b981', glow: '0 0 14px #10b981', trail: true },
    motionSpeed: 0.6,
    ease: 'power3.out',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400'
  },
  
  creamy: {
    id: 'creamy',
    name: 'Creamy Studio',
    tagline: 'Creative/Soft Aesthetic',
    bgClass: 'bg-[#8FD9FB] font-sans text-stone-900 selection:bg-[#FFEE8C] selection:text-stone-900',
    textClass: 'text-stone-800/90', 
    accentClass: 'border-[#5e79c4] text-stone-900 shadow-[0_4px_20px_rgba(255,238,140,0.45)]',
    cardClass: 'bg-white border-stone-200/80 shadow-[0_12px_40px_rgba(120,110,100,0.06)] backdrop-blur-sm',
    fontClass: 'font-sans tracking-normal',
    cursor: { type: 'snowflake', color: '#e11d48', glow: '0 4px 14px rgba(225,29,72,0.2)', trail: false },
    motionSpeed: 1.2,
    ease: 'elastic.out(1, 0.75)',
    textPrimary: 'text-stone-900 font-extrabold', 
    textSecondary: 'text-stone-800 font-medium',  
  },

  arctic: {
    id: 'arctic',
    name: 'Neon Arctic',
    tagline: 'Corporate/Minimal',
    bgClass: 'bg-[#3b274f] font-sans text-slate-100 selection:bg-[#B069DB]/30 selection:text-[#e9d5ff]',
    textClass: 'text-slate-400',
    accentClass: 'border-[#B069DB]/50 text-cyan-400 shadow-[0_0_25px_rgba(176,105,219,0.3)]',
    cardClass: 'bg-[#301959]/80 border-[#e9d5ff]/20 shadow-[0_0_30px_rgba(176,105,219,0.06)] backdrop-blur-md',
    fontClass: 'font-sans tracking-wide',
    cursor: { type: 'target', color: '#22d3ee', glow: '0 0 15px #22d3ee', trail: false },
    motionSpeed: 0.4,
    ease: 'power4.inOut',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400'
  }
};

/* ==========================================================================
   2. IMMUTABLE ZUSTAND STORE APPLICATION INTERFACE CONTRACT
   ========================================================================== */
interface ThemeState {
  currentDimension: 'cosmic' | 'arctic' | 'creamy';
  isTransitioning: boolean;
  isAudioMuted: boolean;
  
  // 🚀 FIXED INJECTION: Added state parameters to handle active HUD switcher previews [1, 2]
  hoveredDimension: 'cosmic' | 'arctic' | 'creamy' | null;

  // Global State Mutator Action Handlers
  setDimension: (dim: 'cosmic' | 'arctic' | 'creamy') => void;
  toggleAudioMute: () => void;
  
  // 🚀 FIXED INJECTION: Integrated missing handlers needed by CircularSwitcher.tsx [1, 2]
  setHoveredDimension: (dim: 'cosmic' | 'arctic' | 'creamy' | null) => void;
  triggerHop: (targetDim: 'cosmic' | 'arctic' | 'creamy') => void;
}

/* ==========================================================================
   3. REACTIVE STATE STORAGE SLICE HANDLERS
   ========================================================================== */
export const useThemeStore = create<ThemeState>((set) => ({
  // Core initial state defaults
  currentDimension: 'cosmic',
  isTransitioning: false,
  isAudioMuted: true, // Audio loops start safely muted by default
  hoveredDimension: null,

  // Simple state switches
  toggleAudioMute: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setDimension: (dim) => set({ currentDimension: dim }),
  
  // 🚀 FIXED: Mutates the visual switcher hover indicator variable context [1, 2]
  setHoveredDimension: (dim) => set({ hoveredDimension: dim }),

  // 🚀 FIXED: Triggers a dynamic dimensional transition warp timeline. [1, 2]
  // This turns on the app-wide blur filters, waits 400ms during the warp interval, 
  // swaps your theme properties background assets, and rolls out smooth page entry.
  triggerHop: (targetDim) => {
    set({ isTransitioning: true });
    
    setTimeout(() => {
      set({ 
        currentDimension: targetDim,
        isTransitioning: false 
      });
    }, 400); // 400ms matches the blurring timeline animations inside App.tsx
  }
}));
