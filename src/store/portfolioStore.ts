import { create } from 'zustand';
import { PortfolioData } from '../types/portfolio';

interface PortfolioState {
  data: PortfolioData | null;
  draft: PortfolioData | null; // Keeps track of edits before final commit
  isAuthenticated: boolean;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPortfolioData: (data: PortfolioData) => void;
  updateDraft: (updater: (draft: PortfolioData) => void) => void;
  setAuthenticated: (status: boolean) => void;
  setSaving: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  resetDraft: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  data: null,
  draft: null,
  isAuthenticated: false,
  isSaving: false,
  isLoading: true,
  error: null,

  setPortfolioData: (data) => set({ data, draft: JSON.parse(JSON.stringify(data)), isLoading: false }),
  updateDraft: (updater) => set((state) => {
    if (!state.draft) return {};
    const newDraft = JSON.parse(JSON.stringify(state.draft));
    updater(newDraft);
    return { draft: newDraft };
  }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setSaving: (status) => set({ isSaving: status }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
  resetDraft: () => set((state) => ({ draft: JSON.parse(JSON.stringify(state.data)) })),
}));
