'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const LINKS = [
  { href: '/admin/orders',   label: 'Orders',   emoji: '📬' },
  { href: '/admin/menu',     label: 'Menu',     emoji: '🎂' },
  { href: '/admin/gallery',  label: 'Gallery',  emoji: '📷' },
  { href: '/admin/settings', label: 'Settings', emoji: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside
      className="w-52 shrink-0 min-h-screen flex flex-col border-r px-3 py-6"
      style={{ borderColor: 'var(--line)', background: 'var(--cream-card)' }}
    >
      <p
        className="font-display text-base font-bold px-2 mb-6"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 80" }}
      >
        Admin
      </p>
      <nav className="flex flex-col gap-1 flex-1">
        {LINKS.map(({ href, label, emoji }) => (
          <Link
            key={href}
            href={href}
            className={`admin-nav-link ${pathname.startsWith(href) ? 'active' : ''}`}
          >
            <span>{emoji}</span>
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleSignOut}
        className="admin-nav-link mt-4 border-t pt-4 w-full text-left"
        style={{ borderColor: 'var(--line)' }}
      >
        <span>🚪</span> Sign out
      </button>
    </aside>
  );
}
