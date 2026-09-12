import { createAdminClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import CustomOrderForm from '@/components/custom-order/CustomOrderForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Custom Orders' };
export const revalidate = 300;

export default async function CustomOrderPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('messenger_username, lead_time_text, payment_text')
    .eq('id', 1)
    .single();

  const settings = data as Pick<SiteSettings, 'messenger_username' | 'lead_time_text' | 'payment_text'> | null;

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
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="clay-pill px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3 inline-block"
            style={{ background: '#E7EBDA', color: 'var(--pistachio)' }}>
            Special Orders &amp; Gifting
          </span>
          <h1
            className="font-display mb-3 font-extrabold"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
              color: 'var(--ganache)',
              fontVariationSettings: "'SOFT' 100, 'WONK' 1",
            }}
          >
            Custom Orders 📋
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            Planning a celebration, gift box, or craving a custom batch? Fill out the details below and copy or send your order in seconds.
          </p>
        </div>

        {/* Info Notices in Clay Pill/Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
          {settings?.lead_time_text && (
            <div
              className="clay-card-flat p-5 flex items-start gap-3"
              style={{ background: '#EEFAE8' }}
            >
              <span className="text-2xl mt-0.5">📅</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--pistachio)' }}>
                  Lead Time Notice
                </p>
                <p className="text-xs sm:text-sm font-semibold leading-snug" style={{ color: 'var(--pistachio)' }}>
                  {settings.lead_time_text}
                </p>
              </div>
            </div>
          )}

          {settings?.payment_text && (
            <div
              className="clay-card-flat p-5 flex items-start gap-3"
              style={{ background: '#FFF9EE' }}
            >
              <span className="text-2xl mt-0.5">💳</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--caramel)' }}>
                  Payment Terms
                </p>
                <p className="text-xs sm:text-sm font-medium leading-snug" style={{ color: 'var(--ink-soft)' }}>
                  {settings.payment_text}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Custom Order Form Component */}
        <CustomOrderForm messengerUsername={settings?.messenger_username ?? 'benbakesph'} />
      </div>
    </div>
  );
}
