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

  saveSection: (keys: (keyof PortfolioData)[]) => Promise<void>;
  discardSection: (keys: (keyof PortfolioData)[]) => void;
  isSectionDirty: (keys: (keyof PortfolioData)[]) => boolean;

  updateGalleryItem: (item: Partial<GalleryItem> & { id: string | number }) => void;
  addGalleryItem: (item: GalleryItem) => void;
  removeGalleryItem: (id: string | number) => void;

  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => {
  const normalizeContactData = (contact?: PortfolioData['contact']) => {
    const legacyContact = contact as (PortfolioData['contact'] & { Indeed?: string; Facebook?: string }) | undefined;

    return {
      ...contact,
      email: contact?.email ?? '',
      github: contact?.github ?? '',
      indeed: contact?.indeed ?? legacyContact?.Indeed ?? '',
      facebook: contact?.facebook ?? legacyContact?.Facebook ?? '',
      websiteUrl: contact?.websiteUrl ?? '',
      resumeUrl: contact?.resumeUrl ?? ''
    };
  };

  const normalizePortfolioData = (data: PortfolioData | null): PortfolioData | null => {
    if (!data) return null;

    return {
      ...data,
      contact: normalizeContactData(data.contact),
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      categories: Array.isArray(data.categories) && data.categories.length > 0 ? data.categories : ['General']
    } as PortfolioData;
  };

  const ensureData = (data: PortfolioData | null): PortfolioData => {
    const normalized = normalizePortfolioData(data);
    if (normalized) return normalized;
    return {
      hero: { name: '', title: '', tagline: '', profileImage: '' },
      about: { bio: '', skills: [] },
      projects: [],
      gallery: [],
      categories: ['General'], // initialize categories
      contact: { email: '', github: '', indeed: '', facebook: '', websiteUrl: '' },
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

    setPortfolioData: (data) => {
      const normalized = normalizePortfolioData(data);
      const safeData = normalized ?? ensureData(data);

      return set({
        data: safeData,
        draft: structuredClone(safeData),
        isLoading: false
      });
    },

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

    isSectionDirty: (keys) => {
      const { data, draft } = get();
      if (!data || !draft) return false;
      return keys.some((k) => JSON.stringify(draft[k]) !== JSON.stringify(data[k]));
    },

    discardSection: (keys) => {
      set((state) => {
        if (!state.data || !state.draft) return {};
        const newDraft = structuredClone(state.draft);
        keys.forEach((k) => {
          (newDraft as any)[k] = structuredClone((state.data as any)[k]);
        });
        return { draft: newDraft };
      });
    },

    saveSection: async (keys) => {
      const { draft } = get();
      if (!draft) return;

      const sections: Record<string, unknown> = {};
      keys.forEach((k) => {
        sections[k as string] = draft[k];
      });

      set({ isSaving: true, error: null });
      try {
        const response = await fetch('/api/save-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sections })
        });

        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body?.details || body?.error || `Save failed (${response.status})`);
        }

        const content = body.content as PortfolioData;
        set((state) => {
          if (!state.data || !state.draft) return {};
          const newData = structuredClone(state.data);
          const newDraft = structuredClone(state.draft);
          keys.forEach((k) => {
            (newData as any)[k] = (content as any)[k];
            (newDraft as any)[k] = (content as any)[k];
          });
          return { data: newData, draft: newDraft };
        });
      } catch (err: any) {
        set({ error: err?.message ?? 'Failed to save section.' });
        throw err;
      } finally {
        set({ isSaving: false });
      }
    },

    updateGalleryItem: (item) => {
      set((state) => {
        if (!state.draft) return {};
        const newDraft = structuredClone(state.draft);
        const base = ensureData(newDraft);
        const prevGallery = Array.isArray(base.gallery) ? base.gallery : [];
        // require id to be present for update
        if (item.id === undefined || item.id === null) {
          return { draft: base };
        }
        base.gallery = prevGallery.map((g: GalleryItem) =>
          g.id === item.id ? ({ ...g, ...item } as GalleryItem) : g
        );
        return { draft: base };
      });
    },

    addGalleryItem: (item) => {
      set((state) => {
        if (!state.draft) return {};
        const newDraft = structuredClone(state.draft);
        const base = ensureData(newDraft);
        const prevGallery = Array.isArray(base.gallery) ? base.gallery : [];
        base.gallery = [item, ...prevGallery];
        return { draft: base };
      });
    },

    removeGalleryItem: (id) => {
      set((state) => {
        if (!state.draft) return {};
        const newDraft = structuredClone(state.draft);
        const base = ensureData(newDraft);
        const prevGallery = Array.isArray(base.gallery) ? base.gallery : [];
        base.gallery = prevGallery.filter((g: GalleryItem) => g.id !== id);
        return { draft: base };
      });
    },

    addCategory: (name) => {
      set((state) => {
        if (!state.draft) return {};
        const newDraft = structuredClone(state.draft);
        const base = ensureData(newDraft);
        if (base.categories.includes(name)) return { draft: base };
        base.categories = [...base.categories, name];
        return { draft: base };
      });
    },

    removeCategory: (name) => {
      set((state) => {
        if (!state.draft) return {};
        const newDraft = structuredClone(state.draft);
        const base = ensureData(newDraft);
        base.categories = base.categories.filter((c) => c !== name);
        base.gallery = base.gallery.map((item) =>
          item.category === name ? { ...item, category: 'General' } : item
        );
        return { draft: base };
      });
    }
  };
});