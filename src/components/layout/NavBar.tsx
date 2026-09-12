'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/menu',         label: 'Menu' },
  { href: '/custom-order', label: 'Custom Orders' },
  { href: '/gallery',      label: 'Gallery' },
  { href: '/about',        label: 'About' },
  { href: '/info',         label: 'Info' },
];

export default function NavBar({ businessName }: { businessName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(251, 241, 222, 0.94)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(230, 217, 194, 0.8)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo / wordmark with cute cookie icon */}
        <Link
          href="/"
          className="font-display text-2xl font-bold flex items-center gap-2 group"
          style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
        >
          <span className="clay-badge w-9 h-9 flex items-center justify-center text-xl bg-[#FFF6E5] group-hover:rotate-12 transition-transform">
            🍪
          </span>
          <span>{businessName}</span>
        </Link>

        {/* Desktop nav with clay pills */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`clay-pill px-4 py-1.5 text-sm font-semibold transition-all ${
                  isActive ? 'active' : ''
                }`}
                style={{
                  background: isActive ? 'var(--pistachio)' : '#FFF6E5',
                  color: isActive ? '#ffffff' : 'var(--ink)',
                  fontFamily: "'Work Sans', sans-serif",
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/custom-order"
            className="clay-btn ml-2 text-sm py-2 px-5 font-bold text-white flex items-center gap-1.5"
            style={{ background: 'var(--berry)', textDecoration: 'none' }}
          >
            <span>💬</span> Order
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden clay-pill w-10 h-10 flex items-center justify-center"
          style={{ background: '#FFF6E5', color: 'var(--ink)' }}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          className="md:hidden border-t px-4 py-4 flex flex-col gap-2"
          style={{ borderColor: 'var(--line)', background: 'var(--buttercream)' }}
        >
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`clay-pill px-4 py-2.5 text-sm font-semibold flex items-center justify-between ${
                  isActive ? 'active' : ''
                }`}
                style={{
                  background: isActive ? 'var(--pistachio)' : '#FFF6E5',
                  color: isActive ? '#ffffff' : 'var(--ink)',
                  fontFamily: "'Work Sans', sans-serif",
                }}
              >
                <span>{label}</span>
                {isActive && <span className="text-xs">●</span>}
              </Link>
            );
          })}
          <Link
            href="/custom-order"
            onClick={() => setOpen(false)}
            className="clay-btn mt-2 py-3 justify-center text-center font-bold text-white flex items-center gap-2"
            style={{ background: 'var(--berry)' }}
          >
            <span>💬</span> Order Now
          </Link>
        </nav>
      )}
    </header>
  );
}
