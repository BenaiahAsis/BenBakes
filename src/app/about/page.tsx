import { createAdminClient } from '@/lib/supabase/server';
import type { SiteSettings } from '@/lib/types';
import DotDivider from '@/components/layout/DotDivider';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About' };
export const revalidate = 300;

const DEFAULT_ABOUT = `Hi! I'm a home baker who started selling to friends and family and never stopped.
Every cake is made from scratch in my home kitchen using real ingredients — no mixes, no shortcuts.
Whether it's a birthday cake, a simple pastry box for a gathering, or a one-of-a-kind custom creation, I put the same care into everything I bake.`;

export default async function AboutPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('business_name, about_text, address, hours_text, messenger_username')
    .eq('id', 1)
    .single();

  const settings = data as Pick<SiteSettings, 'business_name' | 'about_text' | 'address' | 'hours_text' | 'messenger_username'> | null;
  const aboutText = settings?.about_text || DEFAULT_ABOUT;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1
        className="font-display text-4xl font-bold mb-1"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
      >
        About
      </h1>
      <DotDivider className="justify-start" />

      <div
        className="text-base leading-relaxed whitespace-pre-line mb-8"
        style={{ color: 'var(--ink)', fontFamily: "'Work Sans', sans-serif" }}
      >
        {aboutText}
      </div>

      {(settings?.address || settings?.hours_text) && (
        <div className="card p-6 flex flex-col gap-3">
          {settings.address && (
            <p className="text-sm" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
              📍 {settings.address}
            </p>
          )}
          {settings.hours_text && (
            <p className="text-sm" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
              🕐 {settings.hours_text}
            </p>
          )}
        </div>
      )}

      {settings?.messenger_username && (
        <div className="mt-8">
          <a
            href={`https://m.me/${settings.messenger_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-berry"
          >
            💬 Message me on Messenger
          </a>
        </div>
      )}
    </div>
  );
}
