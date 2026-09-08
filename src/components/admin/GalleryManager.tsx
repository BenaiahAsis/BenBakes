'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { GalleryPhoto } from '@/lib/types';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Cakes', 'Cupcakes', 'Pastries', 'Cookies', 'Custom Orders'];

interface GalleryManagerProps {
  photos: GalleryPhoto[];
}

export default function GalleryManager({ photos: initialPhotos }: GalleryManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('Cakes');
  const [caption, setCaption] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('gallery-photos')
      .upload(path, file, { upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from('gallery-photos').getPublicUrl(path);
      await supabase.from('gallery_photos').insert({
        category,
        photo_url: data.publicUrl,
        caption: caption || null,
      });
      setCaption('');
      router.refresh();
    }
    setUploading(false);
    // reset file input
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleDelete(photo: GalleryPhoto) {
    if (!confirm('Delete this photo?')) return;
    setDeleting(photo.id);
    // Extract storage path from URL
    const urlParts = photo.photo_url.split('/gallery-photos/');
    if (urlParts[1]) {
      await supabase.storage.from('gallery-photos').remove([urlParts[1]]);
    }
    await supabase.from('gallery_photos').delete().eq('id', photo.id);
    router.refresh();
    setDeleting(null);
  }

  return (
    <div>
      <h1
        className="font-display text-3xl font-bold mb-6"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
      >
        Gallery
      </h1>

      {/* Upload panel */}
      <div className="card p-5 mb-8">
        <p className="font-semibold mb-3" style={{ color: 'var(--ganache)', fontFamily: "'Work Sans', sans-serif" }}>
          Upload a photo
        </p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="label">Category</label>
            <select className="input w-40" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-40">
            <label className="label">Caption (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Triple-tier birthday cake"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <button
            className="btn-berry"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : '📷 Choose photo'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* Photo grid */}
      {initialPhotos.length === 0 ? (
        <p className="text-center py-12" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
          No photos yet. Upload your first one above!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {initialPhotos.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square">
              <Image
                src={photo.photo_url}
                alt={photo.caption ?? photo.category}
                fill
                className="object-cover"
                sizes="(max-width:640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(to top, rgba(43,24,16,0.85), transparent)' }}>
                <p className="text-white text-xs font-medium" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                  {photo.category}
                </p>
                {photo.caption && (
                  <p className="text-white text-xs opacity-80 truncate">{photo.caption}</p>
                )}
                <button
                  onClick={() => handleDelete(photo)}
                  disabled={deleting === photo.id}
                  className="mt-2 text-xs px-2 py-0.5 rounded-full self-start"
                  style={{ background: 'var(--berry)', color: '#fff', fontFamily: "'Work Sans', sans-serif" }}
                >
                  {deleting === photo.id ? '…' : '✕ Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
