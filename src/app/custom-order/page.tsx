import { createAdminClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import CustomOrderForm from '@/components/custom-order/CustomOrderForm';
import DotDivider from '@/components/layout/DotDivider';
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1
        className="font-display text-4xl font-bold mb-1"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
      >
        Request a custom cake
      </h1>
      <p className="mb-2 text-base" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
        Fill in the details below and I'll get back to you to confirm everything.
      </p>
      <DotDivider className="justify-start" />

      {/* Info notices */}
      <div className="flex flex-col gap-3 mb-8">
        {settings?.lead_time_text && (
          <div
            className="text-sm rounded-xl px-4 py-3 border"
            style={{ background: 'var(--pistachio-bg)', borderColor: 'var(--pistachio)', color: 'var(--pistachio)', fontFamily: "'Work Sans', sans-serif" }}
          >
            📅 <strong>Lead time:</strong> {settings.lead_time_text}
          </div>
        )}
        {settings?.payment_text && (
          <div
            className="text-sm rounded-xl px-4 py-3 border"
            style={{ background: 'var(--cream-card)', borderColor: 'var(--line)', color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            💳 <strong>Payment:</strong> {settings.payment_text}
          </div>
        )}
      </div>

      <CustomOrderForm messengerUsername={settings?.messenger_username ?? ''} />
    </div>
  );
}
