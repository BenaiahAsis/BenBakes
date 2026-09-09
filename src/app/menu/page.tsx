import { createAdminClient } from '@/lib/supabase/server';
import type { MenuItem, SiteSettings } from '@/lib/types';
import MenuGrid from '@/components/menu/MenuGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Menu' };
export const revalidate = 60;

export default async function MenuPage() {
  const supabase = await createAdminClient();
  const [itemsRes, settingsRes] = await Promise.all([
    supabase.from('menu_items').select('*').order('category').order('sort_order'),
    supabase
      .from('site_settings')
      .select('messenger_username, lead_time_text')
      .eq('id', 1)
      .single(),
  ]);

  const items = (itemsRes.data ?? []) as MenuItem[];
  const settings = settingsRes.data as Pick<
    SiteSettings,
    'messenger_username' | 'lead_time_text'
  > | null;
  const messengerUsername = settings?.messenger_username ?? '';

  return (
    /* ── Page background — slightly textured warm dough ───────────────── */
    <div
      style={{
        background:
          'radial-gradient(ellipse at 20% 10%, #FFF0CC 0%, #FBF1DE 40%, #F5E8CB 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* ── Clay page header ─────────────────────────────────────────── */}
        <div className="mb-10">
          <h1
            className="font-display mb-2"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.5rem)',
              fontWeight: 800,
              color: 'var(--ganache)',
              fontVariationSettings: "'SOFT' 100, 'WONK' 1",
              lineHeight: 1.1,
            }}
          >
            Our Menu 🍪
          </h1>
          <p
            className="text-base max-w-md"
            style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            Every batch is freshly baked to order. Pick your flavour and we'll get started.
          </p>
        </div>

        {/* ── Lead time notice as a clay pill banner ───────────────────── */}
        {settings?.lead_time_text && (
          <div
            className="clay-card flex items-start gap-3 px-6 py-4 mb-10"
            style={{ background: '#EEFAE8', maxWidth: '520px' }}
          >
            <span className="text-xl mt-0.5">📅</span>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--pistachio)', fontFamily: "'Work Sans', sans-serif", fontWeight: 600 }}
            >
              {settings.lead_time_text}
            </p>
          </div>
        )}

        {/* ── Menu grid ────────────────────────────────────────────────── */}
        {items.length === 0 ? (
          <div
            className="clay-card text-center py-20 px-6"
            style={{ background: '#FFF9EE' }}
          >
            <p className="text-5xl mb-4">🍪</p>
            <p
              className="text-lg font-semibold"
              style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
            >
              Menu coming soon — check back!
            </p>
          </div>
        ) : (
          <MenuGrid items={items} messengerUsername={messengerUsername} />
        )}
      </div>
    </div>
  );
}
