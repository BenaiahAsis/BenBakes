import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase/server';
import type { GalleryPhoto } from '@/lib/types';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gallery' };
export const revalidate = 60;

export default async function GalleryPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false });

  const photos = (data ?? []) as GalleryPhoto[];

  // Group by category, maintaining order
  const categoriesMap: Record<string, GalleryPhoto[]> = {};
  for (const photo of photos) {
    const cat = photo.category || 'Cookies';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(photo);
  }

  const categoryNames = Object.keys(categoriesMap);

  return (
    <div
      style={{
        background:
          'radial-gradient(ellipse at 20% 10%, #FFF0CC 0%, #FBF1DE 40%, #F5E8CB 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="clay-pill px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3 inline-block"
            style={{ background: '#FCE7D2', color: 'var(--caramel)' }}>
            Fresh Baked Showcase
          </span>
          <h1
            className="font-display mb-3 font-extrabold"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
              color: 'var(--ganache)',
              fontVariationSettings: "'SOFT' 100, 'WONK' 1",
            }}
          >
            Gallery &amp; Creations 📸
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            A peek at our freshly baked batches in Bacolod City. See something you love? You can order or copy its name directly into your chat!
          </p>
        </div>

        {photos.length === 0 ? (
          <div
            className="clay-card p-12 text-center max-w-md mx-auto"
            style={{ background: '#FFF9EE' }}
          >
            <span className="text-5xl mb-4 block">🍪</span>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--ganache)' }}>
              Photos Coming Soon
            </h3>
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              We are baking our next batch. Check back shortly!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {categoryNames.map((category) => {
              const categoryPhotos = categoriesMap[category];
              return (
                <section key={category}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="clay-pill px-5 py-2 text-sm font-extrabold uppercase tracking-wide"
                      style={{ background: '#FFF3DD', color: 'var(--ganache)' }}>
                      {category}
                    </span>
                    <div className="h-0.5 flex-1 bg-[rgba(230,217,194,0.7)] rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {categoryPhotos.map((photo) => (
                      <article
                        key={photo.id}
                        className="clay-card overflow-hidden flex flex-col group"
                        style={{ background: '#FFF9EE' }}
                      >
                        {/* Tactile recessed photo frame */}
                        <div
                          className="clay-image mx-4 mt-4 relative overflow-hidden aspect-square"
                          style={{ background: '#F0E8D8' }}
                        >
                          <Image
                            src={photo.photo_url}
                            alt={photo.caption ?? `${category} photo`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                          />
                        </div>

                        {/* Caption and info */}
                        <div className="p-5 flex flex-col flex-1 justify-between">
                          {photo.caption ? (
                            <p
                              className="font-display text-lg font-bold leading-snug mb-3"
                              style={{ color: 'var(--ganache)' }}
                            >
                              {photo.caption}
                            </p>
                          ) : (
                            <p
                              className="font-display text-lg font-bold leading-snug mb-3"
                              style={{ color: 'var(--ganache)' }}
                            >
                              Fresh {category} Batch
                            </p>
                          )}

                          <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'rgba(230,217,194,0.6)' }}>
                            <span className="text-xs font-semibold" style={{ color: 'var(--caramel)' }}>
                              Ben Bakes Bacolod
                            </span>
                            <Link
                              href="/menu"
                              className="clay-pill px-3 py-1.5 text-xs font-bold text-[var(--berry)] flex items-center gap-1"
                              style={{ background: '#FFF0D9', textDecoration: 'none' }}
                            >
                              <span>Order similar</span>
                              <span>→</span>
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Footer showcase note */}
        <div className="text-center mt-16">
          <Link
            href="/menu"
            className="clay-btn inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white"
            style={{ background: 'var(--berry)', textDecoration: 'none' }}
          >
            <span>🍪</span>
            <span>Check Out Our Cookie Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
