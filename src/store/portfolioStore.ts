// src/store/portfolioStore.ts
import { create } from 'zustand';
import type { PortfolioData, GraduationData, GalleryItem } from '../types/portfolio';

export type { GraduationData };

interface PortfolioState {
  data: PortfolioData | null;
  draft: PortfolioData | null;
  isAuthenticated: boolean;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;

  setPortfolioData: (data: PortfolioData) => void;
  updateDraft: (updater: (draft: PortfolioData) => void) => void;
  setAuthenticated: (status: boolean) => void;
  setSaving: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  resetDraft: () => void;

  updateGalleryItem: (item: Partial<GalleryItem> & { id?: string | number }) => void;
  addGalleryItem: (item: GalleryItem) => void;
  removeGalleryItem: (id: string | number) => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => {
  const ensureData = (data: PortfolioData | null): PortfolioData => {
    if (data) return data;
    return {
      hero: { name: '', title: '', tagline: '', profileImage: '' },
      about: { bio: '', skills: [] },
      projects: [],
      gallery: [],
      contact: { email: '', github: '', linkedin: '', upwork: '', websiteUrl: '' },
      settings: { theme: 'cosmic', pinHash: '' }
    } as PortfolioData;
  };

  return {
    data: null,
    draft: null,
    isAuthenticated: false,
    isSaving: false,
    isLoading: true,
    error: null,

    setPortfolioData: (data) =>
      set({
        data,
        draft: structuredClone(data),
        isLoading: false
      }),

    updateDraft: (updater) =>
      set((state) => {
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

    updateGalleryItem: (item) => {
      set((state) => {
        const base = ensureData(state.data);
        const prevGallery = Array.isArray(base.gallery) ? base.gallery : [];
        // if id is missing, do nothing (caller should ensure id), but handle gracefully
        if (item.id === undefined || item.id === null) {
          // no-op: return same state
          return { data: base };
        }
        const updatedGallery = prevGallery.map((g: GalleryItem) =>
          g.id === item.id ? ({ ...g, ...item } as GalleryItem) : g
        );
        const newData: PortfolioData = { ...base, gallery: updatedGallery };
        return { data: newData };
      });
    },

    addGalleryItem: (item) => {
      set((state) => {
        const base = ensureData(state.data);
        const prevGallery = Array.isArray(base.gallery) ? base.gallery : [];
        const updatedGallery = [item, ...prevGallery];
        const newData: PortfolioData = { ...base, gallery: updatedGallery };
        return { data: newData };
      });
    },

    removeGalleryItem: (id) => {
      set((state) => {
        const base = ensureData(state.data);
        const prevGallery = Array.isArray(base.gallery) ? base.gallery : [];
        const updatedGallery = prevGallery.filter((g: GalleryItem) => g.id !== id);
        const newData: PortfolioData = { ...base, gallery: updatedGallery };
        return { data: newData };
      });
    }
  };
});
