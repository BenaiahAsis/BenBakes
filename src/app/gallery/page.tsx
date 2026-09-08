import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase/server';
import type { GalleryPhoto } from '@/lib/types';
import DotDivider from '@/components/layout/DotDivider';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gallery' };
export const revalidate = 60;

function EmptyCategory({ category }: { category: string }) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-14 rounded-2xl border-2 border-dashed"
      style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
    >
      <span className="text-4xl mb-3 opacity-40">📷</span>
      <p className="text-sm font-medium" style={{ fontFamily: "'Work Sans', sans-serif" }}>
        Photos of {category} coming soon
      </p>
    </div>
  );
}

export default async function GalleryPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false });

  const photos = (data ?? []) as GalleryPhoto[];

  // Group by category, maintaining insertion order of first appearance
  const categoryOrder: string[] = [];
  const grouped: Record<string, GalleryPhoto[]> = {};
  for (const photo of photos) {
    if (!grouped[photo.category]) {
      grouped[photo.category] = [];
      categoryOrder.push(photo.category);
    }
    grouped[photo.category].push(photo);
  }

  // Show default categories even if empty
  const DEFAULT_CATEGORIES = ['Cakes', 'Cupcakes', 'Pastries', 'Cookies', 'Custom Orders'];
  const allCategories = [...new Set([...categoryOrder, ...DEFAULT_CATEGORIES])];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1
        className="font-display text-4xl font-bold mb-1"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
      >
        Gallery
      </h1>
      <DotDivider className="justify-start" />

      {allCategories.map((category) => {
        const categoryPhotos = grouped[category] ?? [];
        return (
          <section key={category} className="mb-12">
            <h2
              className="font-display text-2xl font-semibold mb-4"
              style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 80" }}
            >
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categoryPhotos.length === 0 ? (
                <EmptyCategory category={category} />
              ) : (
                categoryPhotos.map((photo) => (
                  <figure key={photo.id} className="overflow-hidden rounded-xl aspect-square relative group">
                    <Image
                      src={photo.photo_url}
                      alt={photo.caption ?? `${category} photo`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    />
                    {photo.caption && (
                      <figcaption
                        className="absolute inset-x-0 bottom-0 px-2 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'linear-gradient(to top, rgba(43,24,16,0.8), transparent)', fontFamily: "'Work Sans', sans-serif" }}
                      >
                        {photo.caption}
                      </figcaption>
                    )}
                  </figure>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
