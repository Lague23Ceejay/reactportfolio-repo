// src/components/sections/AdminGalleryManager.tsx
import { useEffect, useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { GalleryItem as StoreGalleryItem } from '../../types/portfolio';

type LocalGalleryItem = {
  id?: string | number;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  category?: string;
};

export function AdminGalleryManager(): JSX.Element {
  const {
    data,
    updateGalleryItem,
    removeGalleryItem,
    addGalleryItem,
    addCategory,
    removeCategory
  } = usePortfolioStore();

  const gallery: StoreGalleryItem[] = data?.gallery ?? [];
  const categories: string[] = data?.categories ?? ['General'];

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [localItems, setLocalItems] = useState<LocalGalleryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');
  const [newCategoryName, setNewCategoryName] = useState('');

  // keep a local editable copy
  useEffect(() => {
    setLocalItems(gallery.map(i => ({ ...i })));
  }, [gallery]);

  const startEdit = (id: string | number) => setEditingId(id);

  const cancelEdit = (id: string | number) => {
    const original = gallery.find(g => g.id === id);
    setLocalItems(prev => prev.map(p => (p.id === id ? { ...(original ?? p) } : p)));
    setEditingId(null);
  };

  const onChangeField = (id: string | number, field: keyof LocalGalleryItem, value: string) => {
    setLocalItems(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const onAddNew = () => {
    const newId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : `tmp-${Date.now()}`;
    const newItem: LocalGalleryItem = {
      id: newId,
      imageUrl: '',
      title: '',
      subtitle: '',
      category: 'General'
    };
    setLocalItems(prev => [newItem, ...prev]);
    // add to store (optimistic)
    addGalleryItem(newItem as StoreGalleryItem);
    setEditingId(newId);
  };

  const saveItem = async (id: string | number) => {
    const item = localItems.find(i => i.id === id);
    if (!item) return;
    if (!item.imageUrl?.trim()) {
      alert('Image URL is required.');
      return;
    }
    setIsSaving(true);
    try {
      // ensure id exists when calling updateGalleryItem
      if (item.id === undefined || item.id === null) {
        // if no id, create one and add
        const createdId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : `id-${Date.now()}`;
        const toAdd: StoreGalleryItem = { ...(item as StoreGalleryItem), id: createdId };
        addGalleryItem(toAdd);
      } else {
        updateGalleryItem(item as StoreGalleryItem & { id: string | number });
      }
      setEditingId(null);
    } catch (err) {
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

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.includes(name)) {
      alert('Category already exists.');
      return;
    }
    addCategory(name);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (name: string) => {
    if (name === 'General') {
      alert('Cannot remove the General category.');
      return;
    }
    if (!confirm(`Delete category "${name}"? Items in this category will be reset to General.`)) return;
    removeCategory(name);
    setLocalItems(prev => prev.map(i => (i.category === name ? { ...i, category: 'General' } : i)));
    if (filterCategory === name) setFilterCategory('All');
  };

  const visibleItems = filterCategory === 'All'
    ? localItems
    : localItems.filter(i => (i.category ?? 'General') === filterCategory);

  return (
    <section id="admin-gallery" className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gallery Manager</h2>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-zinc-900 text-sm px-3 py-2 rounded"
            aria-label="Filter gallery by category"
          >
            <option value="All">All categories</option>
            {categories.map((c: string) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="text"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="New category"
            className="bg-zinc-900 text-sm px-2 py-1 rounded"
            aria-label="New category name"
          />
          <button
            onClick={handleAddCategory}
            className="bg-emerald-500 text-white px-3 py-2 rounded text-sm"
            aria-label="Add category"
          >
            + Add category
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c: string) => (
          <div key={c} className="flex items-center gap-2">
            <button
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1 rounded text-sm ${filterCategory === c ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}
              aria-pressed={filterCategory === c}
            >
              {c}
            </button>

            {c !== 'General' && (
              <button
                onClick={() => handleRemoveCategory(c)}
                className="px-2 py-1 bg-red-900/30 text-red-400 rounded text-xs"
                aria-label={`Remove category ${c}`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleItems.map(item => {
          const isEditing = editingId === item.id;
          return (
            <div key={String(item.id)} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
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
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">
                          {item.title || <span className="text-zinc-500">Untitled</span>}
                        </div>
                        <div className="text-xs text-zinc-400">{item.subtitle}</div>
                        <div className="text-xs text-zinc-500 mt-1">{item.category ?? 'General'}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => startEdit(item.id!)} className="text-sm text-emerald-400">Edit</button>
                        <button onClick={() => deleteItem(item.id!)} className="text-sm text-red-400">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Image URL</label>
                      <input
                        value={item.imageUrl}
                        onChange={e => onChangeField(item.id!, 'imageUrl', e.target.value)}
                        className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        aria-label="Image URL"
                      />

                      <label className="text-xs text-zinc-400">Title</label>
                      <input
                        value={item.title ?? ''}
                        onChange={e => onChangeField(item.id!, 'title', e.target.value)}
                        className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        maxLength={80}
                        aria-label="Title"
                      />

                      <label className="text-xs text-zinc-400">Subtitle</label>
                      <input
                        value={item.subtitle ?? ''}
                        onChange={e => onChangeField(item.id!, 'subtitle', e.target.value)}
                        className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        maxLength={140}
                        aria-label="Subtitle"
                      />

                      <label className="text-xs text-zinc-400">Category</label>
                      <select
                        value={item.category ?? 'General'}
                        onChange={e => onChangeField(item.id!, 'category', e.target.value)}
                        className="w-full bg-zinc-800 px-2 py-1 rounded text-sm"
                        aria-label="Category"
                      >
                        {categories.map((c: string) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>

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
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleItems.length === 0 && (
        <div className="text-sm text-zinc-500 mt-4">
          No gallery items found for the selected category.
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onAddNew}
          className="bg-emerald-500 text-white px-4 py-2 rounded text-sm"
        >
          + Add new image
        </button>

        <button
          onClick={() => {
            setFilterCategory('All');
            const el = document.getElementById('admin-gallery');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="bg-zinc-700 text-zinc-200 px-4 py-2 rounded text-sm"
        >
          Reset filter
        </button>
      </div>
    </section>
  );
}

export default AdminGalleryManager;
