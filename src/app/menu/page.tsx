import { createAdminClient } from '@/lib/supabase/server';
import type { MenuItem, SiteSettings } from '@/lib/types';
import MenuGrid from '@/components/menu/MenuGrid';
import DotDivider from '@/components/layout/DotDivider';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Menu' };
export const revalidate = 60;

export default async function MenuPage() {
  const supabase = await createAdminClient();
  const [itemsRes, settingsRes] = await Promise.all([
    supabase.from('menu_items').select('*').order('category').order('sort_order'),
    supabase.from('site_settings').select('messenger_username, lead_time_text').eq('id', 1).single(),
  ]);

  const items = (itemsRes.data ?? []) as MenuItem[];
  const settings = settingsRes.data as Pick<SiteSettings, 'messenger_username' | 'lead_time_text'> | null;
  const messengerUsername = settings?.messenger_username ?? '';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1
        className="font-display text-4xl font-bold mb-1"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
      >
        Our Menu
      </h1>
      <DotDivider className="justify-start" />

      {settings?.lead_time_text && (
        <div
          className="text-sm rounded-xl px-4 py-3 mb-8 border"
          style={{
            background: 'var(--pistachio-bg)',
            borderColor: 'var(--pistachio)',
            color: 'var(--pistachio)',
            fontFamily: "'Work Sans', sans-serif",
          }}
        >
          📅 {settings.lead_time_text}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center py-20" style={{ color: 'var(--ink-soft)' }}>
          Menu coming soon — check back!
        </p>
      ) : (
        <MenuGrid items={items} messengerUsername={messengerUsername} />
      )}
    </div>
  );
}
