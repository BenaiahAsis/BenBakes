import { createAdminClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About' };
export const revalidate = 300;

const DEFAULT_ABOUT = `Ben Bakes is a home-based cookie business in Bacolod City. We make freshly baked, affordable specialty cookies — no preservatives, no shortcuts.
Every batch is handcrafted in our home kitchen using real butter and premium ingredients. Whether you need a gift box for a friend or a warm batch for yourself, we bake it fresh with love.
To God be the glory! 🙏`;

export default async function AboutPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('business_name, about_text, address, hours_text, messenger_username')
    .eq('id', 1)
    .single();

  const settings = data as Pick<
    SiteSettings,
    'business_name' | 'about_text' | 'address' | 'hours_text' | 'messenger_username'
  > | null;

  const aboutText = settings?.about_text || DEFAULT_ABOUT;
  const businessName = settings?.business_name || 'Ben Bakes';
  const messengerUsername = settings?.messenger_username || 'benbakesph';

  return (
    <div
      style={{
        background:
          'radial-gradient(ellipse at 20% 10%, #FFF0CC 0%, #FBF1DE 40%, #F5E8CB 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="clay-pill px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3 inline-block"
            style={{ background: '#E7EBDA', color: 'var(--pistachio)' }}>
            The Baker's Story
          </span>
          <h1
            className="font-display mb-3 font-extrabold"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
              color: 'var(--ganache)',
              fontVariationSettings: "'SOFT' 100, 'WONK' 1",
            }}
          >
            About {businessName} 🍪
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            Baked with care and passion right here in Bacolod City.
          </p>
        </div>

        {/* Main Clay Card */}
        <div
          className="clay-card-flat p-8 sm:p-12 mb-10 max-w-3xl mx-auto relative overflow-hidden"
          style={{ background: '#FFF9EE' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="clay-badge w-12 h-12 flex items-center justify-center text-2xl bg-[#FFF0D9]">
              👩‍🍳
            </span>
            <div>
              <h2
                className="font-display text-2xl font-bold"
                style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
              >
                Freshly Baked from the Heart
              </h2>
              <p className="text-xs font-semibold" style={{ color: 'var(--caramel)' }}>
                Bacolod City, Negros Occidental
              </p>
            </div>
          </div>

          <div
            className="text-base sm:text-lg leading-relaxed whitespace-pre-line mb-8"
            style={{ color: 'var(--ink)', fontFamily: "'Work Sans', sans-serif" }}
          >
            {aboutText}
          </div>

          {/* Details mini cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t" style={{ borderColor: 'rgba(230,217,194,0.7)' }}>
            {settings?.address && (
              <div className="clay-card-flat p-4 flex items-center gap-3" style={{ background: '#FFFDF9' }}>
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--caramel)]">Location</p>
                  <p className="text-sm font-semibold text-[var(--ink)]">{settings.address}</p>
                </div>
              </div>
            )}

            {settings?.hours_text ? (
              <div className="clay-card-flat p-4 flex items-center gap-3" style={{ background: '#FFFDF9' }}>
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--caramel)]">Baking Hours</p>
                  <p className="text-sm font-semibold text-[var(--ink)]">{settings.hours_text}</p>
                </div>
              </div>
            ) : (
              <div className="clay-card-flat p-4 flex items-center gap-3" style={{ background: '#FFFDF9' }}>
                <span className="text-2xl">📦</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--caramel)]">Order Type</p>
                  <p className="text-sm font-semibold text-[var(--ink)]">Fresh batches made to order</p>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <a
              href={`https://m.me/${messengerUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn py-3.5 px-6 font-bold text-white text-center flex items-center justify-center gap-2"
              style={{ background: 'var(--berry)', textDecoration: 'none' }}
            >
              <span>💬</span>
              <span>Message Us on Facebook</span>
            </a>

            <Link
              href="/menu"
              className="clay-btn-secondary py-3.5 px-6 font-bold text-center flex items-center justify-center gap-2"
              style={{ background: '#FFF3DD', color: 'var(--ganache)', textDecoration: 'none' }}
            >
              <span>🍪</span>
              <span>View Our Cookie Lineup</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
