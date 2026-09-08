'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';

const CATEGORIES: MenuCategory[] = ['Cakes', 'Cupcakes', 'Pastries', 'Cookies'];

interface MenuItemFormProps {
  item?: MenuItem;
  onClose: () => void;
}

export default function MenuItemForm({ item, onClose }: MenuItemFormProps) {
  const isEdit = Boolean(item);
  const [form, setForm] = useState({
    name: item?.name ?? '',
    category: item?.category ?? 'Cakes',
    description: item?.description ?? '',
    price: item?.price?.toString() ?? '',
    is_available: item?.is_available ?? true,
    sort_order: item?.sort_order?.toString() ?? '0',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(item?.photo_url ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function uploadPhoto(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('menu-photos')
      .upload(path, file, { upsert: true });
    if (uploadError) return null;
    const { data } = supabase.storage.from('menu-photos').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError('Name and price are required.');
      return;
    }
    setSaving(true);
    setError('');

    let photo_url = item?.photo_url ?? null;
    if (photoFile) {
      photo_url = await uploadPhoto(photoFile);
    }

    const payload = {
      name: form.name,
      category: form.category as MenuCategory,
      description: form.description || null,
      price: parseFloat(form.price),
      is_available: form.is_available,
      sort_order: parseInt(form.sort_order) || 0,
      photo_url,
    };

    let err;
    if (isEdit && item) {
      ({ error: err } = await supabase.from('menu_items').update(payload).eq('id', item.id));
    } else {
      ({ error: err } = await supabase.from('menu_items').insert(payload));
    }

    if (err) {
      setError('Failed to save. Please try again.');
      setSaving(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
      <h2
        className="font-display text-xl font-bold"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 80" }}
      >
        {isEdit ? 'Edit item' : 'Add menu item'}
      </h2>

      {/* Photo */}
      <div>
        <p className="label">Photo</p>
        <div className="flex items-start gap-4">
          {photoPreview ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
              <Image src={photoPreview} alt="preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center text-2xl opacity-30"
              style={{ borderColor: 'var(--line)' }}>🎂</div>
          )}
          <button type="button" className="btn-ghost text-sm" onClick={() => fileRef.current?.click()}>
            {photoPreview ? 'Change photo' : 'Upload photo'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label" htmlFor="name">Name *</label>
          <input id="name" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="price">Price (₱) *</label>
          <input id="price" type="number" min="0" step="0.01" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label" htmlFor="desc">Description</label>
          <textarea id="desc" className="input" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="sort">Display order</label>
          <input id="sort" type="number" className="input" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="avail"
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => set('is_available', e.target.checked)}
            className="w-4 h-4 accent-[#B23A55]"
          />
          <label htmlFor="avail" className="label mb-0 cursor-pointer">Available</label>
        </div>
      </div>

      {error && <p className="field-error">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" className="btn-berry" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add item'}
        </button>
        <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}
