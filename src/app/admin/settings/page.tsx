import { createAdminClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import SettingsForm from '@/components/admin/SettingsForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Settings | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  // Provide defaults if row doesn't exist yet
  const settings: SiteSettings = data ?? {
    id: 1,
    business_name: 'Sweet Crumbs',
    tagline: null,
    address: null,
    hours_text: null,
    lead_time_text: null,
    delivery_text: null,
    payment_text: null,
    storage_text: null,
    about_text: null,
    messenger_username: null,
    instagram_handle: null,
    viber_number: null,
    whatsapp_number: null,
    updated_at: new Date().toISOString(),
  };

  return <SettingsForm settings={settings} />;
}
