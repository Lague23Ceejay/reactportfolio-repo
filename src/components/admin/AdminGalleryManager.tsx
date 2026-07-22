// src/components/sections/AdminGalleryManager.tsx
import { useEffect, useMemo, useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';

type GalleryItem = {
  id?: string | number;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  category?: string;
};

export function AdminGalleryManager(): JSX.Element {
  const { data, updateGalleryItem, removeGalleryItem } = usePortfolioStore();
  const gallery: GalleryItem[] = data?.gallery ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    gallery.forEach(item => set.add(item.category ?? 'General'));
    return Array.from(set);
  }, [gallery]);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [localItems, setLocalItems] = useState<GalleryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');

  // keep a local copy for editing so changes are staged before saving
  useEffect(() => {
    setLocalItems(gallery.map(i => ({ ...i })));
  }, [gallery]);

  // helpers
  const startEdit = (id: string | number) => {
    setEditingId(id);
  };

  const cancelEdit = (id: string | number) => {
    // revert local item to store value
    const original = gallery.find(g => g.id === id);
    setLocalItems(prev => prev.map(p => (p.id === id ? { ...(original ?? p) } : p)));
    setEditingId(null);
  };

  const onChangeField = (id: string | number, field: keyof GalleryItem, value: string) => {
    setLocalItems(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const onAddNew = () => {
    const newId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : `tmp-${Date.now()}`;
    const newItem: GalleryItem = {
      id: newId,
      imageUrl: '',
      title: '',
      subtitle: '',
      category: 'General'
    };
    setLocalItems(prev => [newItem, ...prev]);
    // optimistic add to store if you want; otherwise call add on save
    setEditingId(newId);
  };
// continuation of src/components/sections/AdminGalleryManager.tsx

  const saveItem = async (id: string | number) => {
    const item = localItems.find(i => i.id === id);
    if (!item) return;
    // basic validation
    if (!item.imageUrl?.trim()) {
      alert('Image URL is required.');
      return;
    }

    setIsSaving(true);
    try {
      // If you have an API, call it here and await the saved result.
      // Example (pseudo):
      // const saved = await api.saveGalleryItem(item);
      // updateGalleryItem(saved);

      // If no backend, call store update directly (must replace by id)
      await Promise.resolve(); // placeholder for async operations
      updateGalleryItem(item); // store method must replace by id and trigger re-render
      setEditingId(null);
    } catch (err) {
      // handle error (rollback if optimistic)
      // eslint-disable-next-line no-console
      console.error('Failed to save gallery item', err);
      alert('Failed to save. See console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (id: string | number) => {
    if (!confirm('Delete this gallery item?')) return;
    setIsSaving(true);
    try {
      // call backend if needed, then update store
      await Promise.resolve();
      removeGalleryItem(id);
      setLocalItems(prev => prev.filter(p => p.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete gallery item', err);
      alert('Failed to delete. See console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const visibleItems = filterCategory === 'All' ? localItems : localItems.filter(i => (i.category ?? 'General') === filterCategory);

  return (
    <section id="admin-gallery" className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gallery Manager</h2>
        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as any)}
            className="bg-zinc-900 text-sm px-3 py-2 rounded"
          >
            <option value="All">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={onAddNew}
            className="bg-emerald-500 text-white px-3 py-2 rounded text-sm"
          >
            + Add image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleItems.map(item => {
          const isEditing = editingId === item.id;
          return (
            <div key={item.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
              <div className="flex gap-4">
                <div className="w-28 h-20 bg-zinc-800 rounded overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={item.imageUrl} alt={item.title ?? 'gallery image'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">No image</div>
                  )}
                </div>

                <div className="flex-1">
                  {!isEditing ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">{item.title || <span className="text-zinc-500">Untitled</span>}</div>
                          <div className="text-xs text-zinc-400">{item.subtitle}</div>
                          <div className="text-xs text-zinc-500 mt-1">{item.category ?? 'General'}</div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button onClick={() => startEdit(item.id!)} className="text-sm text-emerald-400">Edit</button>
                          <button onClick={() => deleteItem(item.id!)} className="text-sm text-red-400">Delete</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400">Image URL</label>
                        <input
                          value={item.imageUrl}
                          onChange={e => onChangeField(item.id!, 'imageUrl', e.target.value)}
                          className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        />

                        <label className="text-xs text-zinc-400">Title</label>
                        <input
                          value={item.title ?? ''}
                          onChange={e => onChangeField(item.id!, 'title', e.target.value)}
                          className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                          maxLength={80}
                        />

                        <label className="text-xs text-zinc-400">Subtitle</label>
                        <input
                          value={item.subtitle ?? ''}
                          onChange={e => onChangeField(item.id!, 'subtitle', e.target.value)}
                          className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                          maxLength={140}
                        />

                        <label className="text-xs text-zinc-400">Category</label>
                        <input
                          value={item.category ?? 'General'}
                          onChange={e => onChangeField(item.id!, 'category', e.target.value)}
                          className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        />

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveItem(item.id!)}
                            disabled={isSaving}
                            className="bg-emerald-500 text-white px-3 py-1 rounded text-sm disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => cancelEdit(item.id!)}
                            disabled={isSaving}
                            className="bg-zinc-700 text-zinc-200 px-3 py-1 rounded text-sm disabled:opacity-60"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => deleteItem(item.id!)}
                            disabled={isSaving}
                            className="ml-auto text-sm text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AdminGalleryManager;
