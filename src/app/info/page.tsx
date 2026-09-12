import { createAdminClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Info' };
export const revalidate = 300;

interface InfoCardProps {
  title: string;
  emoji: string;
  content: string | null;
  fallback?: string;
  badgeBg?: string;
}

function InfoCard({ title, emoji, content, fallback, badgeBg = '#FFF0D9' }: InfoCardProps) {
  const text = content || fallback;
  if (!text) return null;
  return (
    <div
      className="clay-card p-6 sm:p-7 flex flex-col justify-between"
      style={{ background: '#FFF9EE' }}
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span
            className="clay-badge w-11 h-11 flex items-center justify-center text-xl shrink-0"
            style={{ background: badgeBg }}
          >
            {emoji}
          </span>
          <h2
            className="font-display text-xl font-bold"
            style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 90" }}
          >
            {title}
          </h2>
        </div>
        <p
          className="text-sm leading-relaxed whitespace-pre-line"
          style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export default async function InfoPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('lead_time_text, delivery_text, payment_text, storage_text, hours_text, messenger_username')
    .eq('id', 1)
    .single();

  const s = data as Pick<
    SiteSettings,
    'lead_time_text' | 'delivery_text' | 'payment_text' | 'storage_text' | 'hours_text' | 'messenger_username'
  > | null;

  return (
    <div
      style={{
        background:
          'radial-gradient(ellipse at 20% 10%, #FFF0CC 0%, #FBF1DE 40%, #F5E8CB 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="clay-pill px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3 inline-block"
            style={{ background: '#E7EBDA', color: 'var(--pistachio)' }}>
            Customer FAQ &amp; Guide
          </span>
          <h1
            className="font-display mb-3 font-extrabold"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
              color: 'var(--ganache)',
              fontVariationSettings: "'SOFT' 100, 'WONK' 1",
            }}
          >
            Good to Know 💡
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            Everything you need before ordering your freshly baked cookie batch.
          </p>
        </div>

        {/* Info Grid of Clay Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <InfoCard
            title="Lead Time &amp; Pre-orders"
            emoji="📅"
            content={s?.lead_time_text ?? null}
            fallback="All cookies are made to order. Please allow 2–3 days for your batch. Same-day orders are not available."
            badgeBg="#EEFAE8"
          />

          <InfoCard
            title="Delivery &amp; Pickup"
            emoji="🛵"
            content={s?.delivery_text ?? null}
            fallback="Pickup from our home kitchen in Bacolod City. Delivery available within Bacolod — message us to arrange."
            badgeBg="#FDE8E8"
          />

          <InfoCard
            title="Payment Methods"
            emoji="💳"
            content={s?.payment_text ?? null}
            fallback="GCash or cash on pickup. Full payment required before baking starts."
            badgeBg="#FFF0D9"
          />

          <InfoCard
            title="Storage &amp; Freshness"
            emoji="🍪"
            content={s?.storage_text ?? null}
            fallback="Best consumed within 5 days. Store in an airtight container at room temperature. Do not refrigerate — cookies dry out."
            badgeBg="#E0F2FE"
          />

          {s?.hours_text && (
            <InfoCard
              title="Baking Hours"
              emoji="🕐"
              content={s.hours_text}
              badgeBg="#FEF3C7"
            />
          )}
        </div>

        {/* Bottom CTA Card */}
        <div
          className="clay-card p-8 sm:p-10 text-center max-w-2xl mx-auto"
          style={{ background: '#FFF9EE' }}
        >
          <span className="text-4xl mb-3 block">💬</span>
          <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--ganache)' }}>
            Have a quick question?
          </h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--ink-soft)' }}>
            We are always happy to answer any questions about custom orders, bulk boxes, or delivery in Bacolod City.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://m.me/${s?.messenger_username || 'benbakesph'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn py-3 px-6 font-bold text-white flex items-center justify-center gap-2"
              style={{ background: 'var(--berry)', textDecoration: 'none' }}
            >
              <span>💬</span>
              <span>Chat on Messenger</span>
            </a>
            <Link
              href="/menu"
              className="clay-btn-secondary py-3 px-6 font-bold flex items-center justify-center gap-2"
              style={{ background: '#FFF3DD', color: 'var(--ganache)', textDecoration: 'none' }}
            >
              <span>🍪</span>
              <span>View Cookie Menu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
