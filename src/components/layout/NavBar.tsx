'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
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
      style={{ background: 'var(--buttercream)', borderBottom: '1px solid var(--line)' }}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo / wordmark */}
        <Link
          href="/"
          className="font-display text-xl font-bold leading-none"
          style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
        >
          {businessName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{
                color: pathname === href ? 'var(--berry)' : 'var(--ink-soft)',
                background: pathname === href ? '#F9E6EB' : 'transparent',
                fontFamily: "'Work Sans', sans-serif",
              }}
            >
              {label}
            </Link>
          ))}
          <Link href="/custom-order" className="btn-berry ml-2 text-sm py-1.5 px-4">
            Order Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md"
          style={{ color: 'var(--ink)' }}
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
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{ borderColor: 'var(--line)', background: 'var(--buttercream)' }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{
                color: pathname === href ? 'var(--berry)' : 'var(--ink)',
                background: pathname === href ? '#F9E6EB' : 'transparent',
                fontFamily: "'Work Sans', sans-serif",
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/custom-order"
            onClick={() => setOpen(false)}
            className="btn-berry mt-2 justify-center"
          >
            Order Now
          </Link>
        </nav>
      )}
    </header>
  );
}
