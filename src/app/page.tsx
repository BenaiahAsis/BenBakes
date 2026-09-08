import Link from 'next/link';
import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase/server';
import type { MenuItem, SiteSettings } from '@/lib/types';
import ScallopedEdge from '@/components/layout/ScallopedEdge';
import DotDivider from '@/components/layout/DotDivider';

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getData() {
  const supabase = await createAdminClient();
  const [settingsRes, itemsRes] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).single(),
    supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);
  return {
    settings: settingsRes.data as SiteSettings | null,
    featured: (itemsRes.data ?? []) as MenuItem[],
  };
}

const HOW_TO_ORDER = [
  {
    step: 1,
    title: 'Browse the menu',
    desc: 'Pick any item from our menu or describe a custom cake you have in mind.',
  },
  {
    step: 2,
    title: 'Send a message',
    desc: 'Hit "Order this" — it opens Messenger with your order pre-filled so we can confirm details fast.',
  },
  {
    step: 3,
    title: 'Pay & pick up',
    desc: "We'll confirm availability, agree on a pickup date, and collect a down payment via GCash or Maya.",
  },
];

export default async function HomePage() {
  const { settings, featured } = await getData();
  const businessName = settings?.business_name ?? 'Sweet Crumbs';
  const tagline = settings?.tagline ?? 'Home-baked cakes and pastries, made with love in the Philippines.';

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="px-4 pt-16 pb-0 text-center"
        style={{ background: 'var(--ganache)', color: 'var(--buttercream)' }}
      >
        <p className="text-sm font-semibold tracking-widest opacity-60 mb-3"
          style={{ fontFamily: "'Work Sans', sans-serif", color: 'var(--caramel)' }}>
          ✦ Home-baked in the Philippines ✦
        </p>
        <h1
          className="font-display text-5xl md:text-7xl font-bold leading-tight mb-4"
          style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
        >
          {businessName}
        </h1>
        <p
          className="text-lg md:text-xl opacity-80 max-w-lg mx-auto mb-8"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pb-16">
          <Link href="/menu" className="btn-berry text-base px-6 py-3">
            See the menu
          </Link>
          <Link href="/custom-order" className="btn-ghost text-base px-6 py-3"
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--buttercream)' }}>
            Request a custom cake
          </Link>
        </div>
      </section>

      <ScallopedEdge color="var(--ganache)" bgColor="var(--buttercream)" />

      {/* ─── Featured items ───────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2
            className="font-display text-3xl font-bold text-center mb-1"
            style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
          >
            Fresh from the kitchen
          </h2>
          <DotDivider />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
            {featured.map((item) => (
              <div key={item.id} className="card overflow-hidden flex flex-col">
                <div
                  className="w-full aspect-square relative bg-[#F0E8D8] flex items-center justify-center"
                >
                  {item.photo_url ? (
                    <Image
                      src={item.photo_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 100vw, 33vw"
                    />
                  ) : (
                    <span className="text-5xl opacity-30">🎂</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="pill mb-2">{item.category}</span>
                  <h3
                    className="font-display text-lg font-semibold mb-1"
                    style={{ color: 'var(--ganache)' }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm flex-1 mb-3" style={{ color: 'var(--ink-soft)' }}>
                    {item.description}
                  </p>
                  <p className="font-bold text-base" style={{ color: 'var(--caramel)' }}>
                    ₱{Number(item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/menu" className="btn-ghost">
              View full menu →
            </Link>
          </div>
        </section>
      )}

      <DotDivider />

      {/* ─── How to order ─────────────────────────────────────────────────────── */}
      <section
        className="py-12 px-4"
        style={{ background: 'var(--pistachio-bg)' }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-display text-3xl font-bold text-center mb-1"
            style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
          >
            How to order
          </h2>
          <DotDivider />
          <ol className="mt-6 flex flex-col gap-6">
            {HOW_TO_ORDER.map(({ step, title, desc }) => (
              <li key={step} className="flex gap-4 items-start">
                <span
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'var(--pistachio)', color: '#fff', fontFamily: "'Work Sans', sans-serif" }}
                >
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-base mb-0.5" style={{ color: 'var(--ganache)', fontFamily: "'Work Sans', sans-serif" }}>
                    {title}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="text-center mt-8">
            <Link href="/custom-order" className="btn-berry">
              Request a custom cake
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
