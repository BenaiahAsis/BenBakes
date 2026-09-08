import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import './globals.css';

// Load Google Fonts via next/font for optimal loading
import { Fraunces, Work_Sans } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK'],
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('business_name, tagline')
    .eq('id', 1)
    .single();

  const name = data?.business_name ?? 'Sweet Crumbs';
  const tagline = data?.tagline ?? 'Home-baked cakes and pastries';

  return {
    title: { default: name, template: `%s | ${name}` },
    description: tagline,
    openGraph: {
      title: name,
      description: tagline ?? undefined,
      type: 'website',
    },
  };
}

// Fallback settings when DB is not yet configured
const fallbackSettings: SiteSettings = {
  id: 1,
  business_name: 'Sweet Crumbs',
  tagline: 'Home-baked cakes and pastries, made with love.',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings = fallbackSettings;

  try {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (data) settings = data as SiteSettings;
  } catch {
    // DB not yet set up — use fallback
  }

  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body>
        <NavBar businessName={settings.business_name} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
