'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { MenuItem } from '@/lib/types';
import MenuItemForm from '@/components/admin/MenuItemForm';
import { useRouter } from 'next/navigation';

interface MenuManagerProps {
  items: MenuItem[];
}

export default function MenuManager({ items: initialItems }: MenuManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    setDeleting(id);
    await supabase.from('menu_items').delete().eq('id', id);
    router.refresh();
    setDeleting(null);
  }

  async function handleToggle(item: MenuItem) {
    await supabase.from('menu_items').update({ is_available: !item.is_available }).eq('id', item.id);
    router.refresh();
  }

  function openAdd() { setEditItem(undefined); setShowForm(true); }
  function openEdit(item: MenuItem) { setEditItem(item); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditItem(undefined); }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-display text-3xl font-bold"
          style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
        >
          Menu
        </h1>
        <button className="btn-berry" onClick={openAdd}>+ Add item</button>
      </div>

      {showForm && (
        <div className="card mb-6" style={{ borderColor: 'var(--berry)' }}>
          <MenuItemForm item={editItem} onClose={closeForm} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-center py-12" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
            No menu items yet. Add your first item above.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="card flex items-center gap-4 p-4">
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative"
              style={{ background: '#F0E8D8' }}>
              {item.photo_url
                ? <Image src={item.photo_url} alt={item.name} fill className="object-cover" />
                : <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-20">🎂</span>
              }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="pill text-xs">{item.category}</span>
                {!item.is_available && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                    Unavailable
                  </span>
                )}
              </div>
              <p className="font-semibold truncate mt-1" style={{ color: 'var(--ganache)', fontFamily: "'Work Sans', sans-serif" }}>
                {item.name}
              </p>
              <p className="text-sm" style={{ color: 'var(--caramel)', fontFamily: "'Work Sans', sans-serif" }}>
                ₱{Number(item.price).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggle(item)}
                className="btn-ghost text-xs py-1 px-3"
                title={item.is_available ? 'Mark unavailable' : 'Mark available'}
              >
                {item.is_available ? '👁 Hide' : '👁 Show'}
              </button>
              <button onClick={() => openEdit(item)} className="btn-ghost text-xs py-1 px-3">
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                className="btn-ghost text-xs py-1 px-3"
                style={{ color: 'var(--berry)', borderColor: 'var(--berry)' }}
              >
                {deleting === item.id ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
