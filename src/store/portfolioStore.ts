// src/store/portfolioStore.ts

import { create } from 'zustand';

// 🚀 SENIOR ALIGNMENT: Pulled both definitions from your unified source file
import type { PortfolioData, GraduationData } from '../types/portfolio';

/* ==========================================================================
   1. EXPORTABLE SECTOR-SPECIFIC CMS DATA SCHEMAS
   ========================================================================== */
// Re-exporting it here preserves your existing cross-file component imports cleanly!
export type { GraduationData };

/* ==========================================================================
   2. CORE APPLICATION STATE AND ACTION MANAGER INTERFACES
   ========================================================================== */
interface PortfolioState {
  data: PortfolioData | null;
  draft: PortfolioData | null; 
  isAuthenticated: boolean;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  
  // State Action Mutator Contracts
  setPortfolioData: (data: PortfolioData) => void;
  updateDraft: (updater: (draft: PortfolioData) => void) => void;
  setAuthenticated: (status: boolean) => void;
  setSaving: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  resetDraft: () => void;
}

/* ==========================================================================
   3. IMMUTABLE REACTIVE ZUSTAND STATE ENGINE IMPLEMENTATION
   ========================================================================== */
export const usePortfolioStore = create<PortfolioState>((set) => ({
  data: null,
  draft: null,
  isAuthenticated: false,
  isSaving: false,
  isLoading: true,
  error: null,

  // Commits newly fetched baseline data into both live memory views and staging environments
  setPortfolioData: (data) => set({ data, draft: structuredClone(data), isLoading: false }),
  updateDraft: (updater) => set((state) => {
    if (!state.draft) return {};
    const newDraft = structuredClone(state.draft);
    updater(newDraft);
    return { draft: newDraft };
  }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setSaving: (status) => set({ isSaving: status }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
  resetDraft: () => set((state) => ({ draft: state.data ? structuredClone(state.data) : null })),
}));
