import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: Pick<
    SiteSettings,
    'business_name' | 'address' | 'hours_text' | 'messenger_username' | 'instagram_handle' | 'viber_number' | 'whatsapp_number'
  >;
}

export default function Footer({ settings }: FooterProps) {
  const {
    business_name,
    address,
    hours_text,
    messenger_username,
    instagram_handle,
    viber_number,
    whatsapp_number,
  } = settings;

  return (
    <footer style={{ background: 'var(--ganache)', color: 'var(--buttercream)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <p
            className="font-display text-2xl font-bold mb-2"
            style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
          >
            {business_name}
          </p>
          <p className="text-sm opacity-70" style={{ fontFamily: "'Work Sans', sans-serif" }}>
            Home-baked cakes &amp; pastries<br />made with love in the Philippines.
          </p>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-3"
            style={{ fontFamily: "'Work Sans', sans-serif" }}>
            Find us
          </p>
          {address && (
            <p className="text-sm opacity-80 mb-1" style={{ fontFamily: "'Work Sans', sans-serif" }}>{address}</p>
          )}
          {hours_text && (
            <p className="text-sm opacity-70" style={{ fontFamily: "'Work Sans', sans-serif" }}>{hours_text}</p>
          )}
        </div>

        {/* Socials */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-3"
            style={{ fontFamily: "'Work Sans', sans-serif" }}>
            Get in touch
          </p>
          <ul className="flex flex-col gap-2">
            {messenger_username && (
              <li>
                <a
                  href={`https://m.me/${messenger_username}`}
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  style={{ fontFamily: "'Work Sans', sans-serif", color: 'inherit' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 Messenger
                </a>
              </li>
            )}
            {instagram_handle && (
              <li>
                <a
                  href={`https://instagram.com/${instagram_handle.replace('@', '')}`}
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  style={{ fontFamily: "'Work Sans', sans-serif", color: 'inherit' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📷 {instagram_handle}
                </a>
              </li>
            )}
            {viber_number && (
              <li>
                <a
                  href={`viber://chat?number=${viber_number.replace(/\D/g, '')}`}
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  style={{ fontFamily: "'Work Sans', sans-serif", color: 'inherit' }}
                >
                  📲 Viber {viber_number}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div
        className="border-t max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs opacity-40"
        style={{ borderColor: 'rgba(255,255,255,0.1)', fontFamily: "'Work Sans', sans-serif" }}
      >
        <span>© {new Date().getFullYear()} {business_name}</span>
        <Link href="/admin/login" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
