import { create } from 'zustand';
import type { DimensionType, ThemePack } from '../types/theme';

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
    ease: 'power3.out'
  },
  creamy: {
    id: 'creamy',
    name: 'Creamy Studio',
    tagline: 'Creative/Soft Aesthetic',
    bgClass: 'bg-[#faf6f0] font-sans text-stone-800 selection:bg-rose-200/50 selection:text-rose-700',
    textClass: 'text-stone-600',
    accentClass: 'border-rose-300/60 text-rose-500 shadow-rose-200/30',
    cardClass: 'bg-white/80 border-stone-200/60 backdrop-blur-md shadow-[0_10px_30px_rgba(120,110,100,0.08)]',
    fontClass: 'font-sans tracking-normal',
    cursor: { type: 'dot', color: '#e11d48', glow: '0 4px 14px rgba(225,29,72,0.2)', trail: false },
    motionSpeed: 1.2,
    ease: 'elastic.out(1, 0.75)'
  },
  arctic: {
    id: 'arctic',
    name: 'Neon Arctic',
    tagline: 'Corporate/Minimal',
    bgClass: 'bg-slate-900 font-serif text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-300',
    textClass: 'text-slate-400',
    accentClass: 'border-cyan-500/30 text-cyan-400 shadow-cyan-950/40',
    cardClass: 'bg-slate-950/70 border-slate-800 shadow-none',
    fontClass: 'font-serif tracking-wide',
    // FIX: Using your core type-token "target" to clear type checking errors
    cursor: { type: 'target', color: '#22d3ee', glow: 'none', trail: false },
    motionSpeed: 0.4,
    ease: 'power4.inOut'
  }
};

interface ThemeState {
  currentDimension: DimensionType;
  hoveredDimension: DimensionType | null;
  isTransitioning: boolean;
  setDimension: (dim: DimensionType) => void;
  setHoveredDimension: (dim: DimensionType | null) => void;
  triggerHop: (dim: DimensionType) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentDimension: 'cosmic',
  hoveredDimension: null,
  isTransitioning: false,
  setDimension: (currentDimension) => set({ currentDimension }),
  setHoveredDimension: (hoveredDimension) => set({ hoveredDimension }),
  triggerHop: (dim) => {
    set({ isTransitioning: true });
    setTimeout(() => {
      set({ currentDimension: dim, isTransitioning: false });
    }, 400); 
  }
}));
