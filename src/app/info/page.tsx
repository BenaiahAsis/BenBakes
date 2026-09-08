import { createAdminClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import DotDivider from '@/components/layout/DotDivider';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Info' };
export const revalidate = 300;

interface InfoSectionProps {
  title: string;
  emoji: string;
  content: string | null;
  fallback?: string;
}

function InfoSection({ title, emoji, content, fallback }: InfoSectionProps) {
  const text = content || fallback;
  if (!text) return null;
  return (
    <section className="card p-6">
      <h2
        className="font-display text-xl font-semibold mb-2"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 80" }}
      >
        {emoji} {title}
      </h2>
      <p
        className="text-sm leading-relaxed whitespace-pre-line"
        style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
      >
        {text}
      </p>
    </section>
  );
}

export default async function InfoPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('lead_time_text, delivery_text, payment_text, storage_text, hours_text')
    .eq('id', 1)
    .single();

  const s = data as Pick<SiteSettings, 'lead_time_text' | 'delivery_text' | 'payment_text' | 'storage_text' | 'hours_text'> | null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1
        className="font-display text-4xl font-bold mb-1"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
      >
        Good to know
      </h1>
      <p className="mb-2 text-base" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
        Everything you need before placing an order.
      </p>
      <DotDivider className="justify-start" />

      <div className="flex flex-col gap-4 mt-6">
        <InfoSection
          title="Lead time"
          emoji="📅"
          content={s?.lead_time_text ?? null}
          fallback="Custom cakes need at least 5 days notice. Pastries and cupcakes need 2–3 days."
        />
        <InfoSection
          title="Delivery & pickup"
          emoji="🛵"
          content={s?.delivery_text ?? null}
          fallback="Pickup available from our home kitchen. Message us for delivery options."
        />
        <InfoSection
          title="Payment"
          emoji="💳"
          content={s?.payment_text ?? null}
          fallback="GCash, Maya, or cash on pickup. 50% down payment required for custom cakes."
        />
        <InfoSection
          title="Storage & shelf life"
          emoji="🧁"
          content={s?.storage_text ?? null}
          fallback="Cakes are best consumed within 3 days. Keep refrigerated and bring to room temperature 30 mins before serving."
        />
        {s?.hours_text && (
          <InfoSection
            title="Hours"
            emoji="🕐"
            content={s.hours_text}
          />
        )}
      </div>
    </div>
  );
}
