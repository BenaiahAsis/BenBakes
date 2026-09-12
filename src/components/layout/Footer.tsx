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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="clay-badge w-8 h-8 flex items-center justify-center text-lg bg-[#3F251A]">
              🍪
            </span>
            <p
              className="font-display text-2xl font-bold"
              style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
            >
              {business_name}
            </p>
          </div>
          <p className="text-sm opacity-75 leading-relaxed" style={{ fontFamily: "'Work Sans', sans-serif" }}>
            Freshly baked specialty cookies, handcrafted to order in Bacolod City, Philippines.
          </p>
          <p className="text-xs opacity-50 mt-3 italic" style={{ fontFamily: "'Work Sans', sans-serif" }}>
            To God be the Glory! 🙏
          </p>
        </div>

        {/* Location & Hours */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4 text-[var(--caramel)]"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            Location &amp; Pickup
          </p>
          {address && (
            <p className="text-sm opacity-85 mb-2 flex items-center gap-2" style={{ fontFamily: "'Work Sans', sans-serif" }}>
              <span>📍</span> {address}
            </p>
          )}
          {hours_text ? (
            <p className="text-sm opacity-75 flex items-center gap-2" style={{ fontFamily: "'Work Sans', sans-serif" }}>
              <span>🕐</span> {hours_text}
            </p>
          ) : (
            <p className="text-sm opacity-75 flex items-center gap-2" style={{ fontFamily: "'Work Sans', sans-serif" }}>
              <span>🕐</span> Made fresh to order (2–3 days lead time)
            </p>
          )}
        </div>

        {/* Socials / Direct Messaging */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4 text-[var(--caramel)]"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            Connect With Us
          </p>
          <div className="flex flex-wrap gap-2">
            {messenger_username && (
              <a
                href={`https://m.me/${messenger_username}`}
                className="clay-pill px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5"
                style={{
                  background: '#3B2016',
                  color: '#FFE2B8',
                  textDecoration: 'none',
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>💬</span> Messenger
              </a>
            )}

            {instagram_handle && (
              <a
                href={`https://instagram.com/${instagram_handle.replace('@', '')}`}
                className="clay-pill px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5"
                style={{
                  background: '#3B2016',
                  color: '#FFE2B8',
                  textDecoration: 'none',
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>📷</span> Instagram
              </a>
            )}

            {viber_number && (
              <a
                href={`viber://chat?number=${viber_number.replace(/\D/g, '')}`}
                className="clay-pill px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5"
                style={{
                  background: '#3B2016',
                  color: '#FFE2B8',
                  textDecoration: 'none',
                }}
              >
                <span>📲</span> Viber
              </a>
            )}

            {whatsapp_number && (
              <a
                href={`https://wa.me/${whatsapp_number.replace(/\D/g, '')}`}
                className="clay-pill px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5"
                style={{
                  background: '#3B2016',
                  color: '#FFE2B8',
                  textDecoration: 'none',
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>📱</span> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <div
        className="border-t max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between text-xs opacity-50"
        style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: "'Work Sans', sans-serif" }}
      >
        <span>© {new Date().getFullYear()} {business_name} · All rights reserved.</span>
        <Link href="/admin/login" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit' }}>
          Admin Login
        </Link>
      </div>
    </footer>
  );
}
