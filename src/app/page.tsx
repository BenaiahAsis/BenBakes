import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import type { MenuItem, SiteSettings } from '@/lib/types';
import MenuCard from '@/components/menu/MenuCard';
import type { Metadata } from 'next';

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getData() {
  const supabase = await createAdminClient();
  const [settingsRes, itemsRes] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 1).single(),
    supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
      .limit(3),
  ]);
  return {
    settings: settingsRes.data as SiteSettings | null,
    featured: (itemsRes.data ?? []) as MenuItem[],
  };
}

const HOW_TO_ORDER = [
  {
    step: '1',
    emoji: '🍪',
    title: 'Browse the Cookie Showcase',
    desc: 'Explore our freshly baked flavors, box samplers, and pricing all in one place.',
  },
  {
    step: '2',
    emoji: '📋',
    title: 'Order or Copy in 1-Click',
    desc: 'Hit "Order" to chat on Messenger with your pre-filled cart, or tap "Copy" to paste your order anywhere.',
  },
  {
    step: '3',
    emoji: '🛵',
    title: 'Baked Fresh for Pickup',
    desc: 'We confirm details, bake your batch fresh in Bacolod City, and prepare it for pickup or delivery.',
  },
];

export default async function HomePage() {
  const { settings, featured } = await getData();
  const businessName = settings?.business_name ?? 'Ben Bakes';
  const tagline = settings?.tagline ?? 'Affordable Freshly Made Cookies — baked fresh in Bacolod City.';
  const messengerUsername = settings?.messenger_username ?? 'benbakesph';

  return (
    <div
      style={{
        background:
          'radial-gradient(ellipse at 20% 10%, #FFF0CC 0%, #FBF1DE 40%, #F5E8CB 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* ─── Hero Clay Card ─────────────────────────────────────────────────── */}
        <section
          className="clay-card-flat px-6 py-12 md:py-16 text-center max-w-4xl mx-auto mb-16 relative overflow-hidden"
          style={{ background: '#FFF9EE' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold clay-pill mb-6"
            style={{ background: '#E7EBDA', color: 'var(--pistachio)' }}>
            <span>✦</span>
            <span>Handcrafted in Bacolod City</span>
            <span>✦</span>
          </div>

          <h1
            className="font-display font-extrabold leading-tight mb-4"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 4.8rem)',
              color: 'var(--ganache)',
              fontVariationSettings: "'SOFT' 100, 'WONK' 1",
            }}
          >
            {businessName} 🍪
          </h1>

          <p
            className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            {tagline}
          </p>

          {/* Call to action clay buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/menu"
              className="clay-btn px-8 py-3.5 text-base font-bold text-white flex items-center gap-2"
              style={{ background: 'var(--berry)', textDecoration: 'none' }}
            >
              <span>🍪</span>
              <span>View Cookie Showcase</span>
            </Link>

            <Link
              href="/custom-order"
              className="clay-btn-secondary px-7 py-3.5 text-base font-bold flex items-center gap-2"
              style={{
                background: '#FFF3DD',
                color: 'var(--ganache)',
                textDecoration: 'none',
              }}
            >
              <span>📋</span>
              <span>Custom Batch &amp; Gift Boxes</span>
            </Link>
          </div>
        </section>

        {/* ─── Featured Cookies Showcase ───────────────────────────────────────── */}
        {featured.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-10">
              <span className="clay-pill px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3 inline-block"
                style={{ background: '#FCE7D2', color: 'var(--caramel)' }}>
                Fresh Out of the Oven
              </span>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold"
                style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
              >
                Featured Cookies
              </h2>
              <p
                className="text-sm sm:text-base mt-2 max-w-md mx-auto"
                style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
              >
                Tap <strong>Order</strong> to chat on Messenger, or <strong>Copy</strong> to copy your order instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {featured.map((item) => (
                <MenuCard key={item.id} item={item} messengerUsername={messengerUsername} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/menu"
                className="clay-btn-secondary inline-flex items-center gap-2 px-8 py-3.5 text-sm sm:text-base font-bold"
                style={{
                  background: '#FFF3DD',
                  color: 'var(--ganache)',
                  textDecoration: 'none',
                }}
              >
                <span>Browse Full Menu &amp; Prices</span>
                <span>→</span>
              </Link>
            </div>
          </section>
        )}

        {/* ─── How to Order (Showcase & Copy Pattern) ─────────────────────────── */}
        <section
          className="clay-card px-6 py-12 md:py-14"
          style={{ background: '#FFF9EE' }}
        >
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="clay-pill px-4 py-1 text-xs font-bold uppercase tracking-wider mb-2 inline-block"
              style={{ background: '#E7EBDA', color: 'var(--pistachio)' }}>
              Simple &amp; Hassle-Free
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold mb-2"
              style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
            >
              How to Order &amp; Copy
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
              No accounts or signups required. Just pick what you like and connect directly with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_TO_ORDER.map(({ step, emoji, title, desc }) => (
              <div
                key={step}
                className="clay-card-flat p-6 flex flex-col items-start"
                style={{ background: '#FFFDF9' }}
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="clay-badge w-11 h-11 flex items-center justify-center text-base font-extrabold text-white"
                    style={{ background: 'var(--pistachio)' }}>
                    {step}
                  </span>
                  <span className="text-2xl">{emoji}</span>
                </div>
                <h3
                  className="font-display text-xl font-bold mb-2"
                  style={{ color: 'var(--ganache)' }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="clay-btn inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white"
              style={{ background: 'var(--berry)', textDecoration: 'none' }}
            >
              <span>💬</span>
              <span>Start Your Order</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
