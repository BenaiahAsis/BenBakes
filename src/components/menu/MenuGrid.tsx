'use client';

import { useState } from 'react';
import type { MenuItem, MenuCategory } from '@/lib/types';
import MenuCard from './MenuCard';

const CATEGORIES: MenuCategory[] = ['Cakes', 'Cupcakes', 'Pastries', 'Cookies'];

interface MenuGridProps {
  items: MenuItem[];
  messengerUsername: string;
}

export default function MenuGrid({ items, messengerUsername }: MenuGridProps) {
  const [active, setActive] = useState<MenuCategory | 'All'>('All');

  const filtered =
    active === 'All' ? items : items.filter((i) => i.category === active);

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(['All', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`pill cursor-pointer transition-colors ${active === cat ? 'pill-active' : ''}`}
            style={{ fontSize: '0.875rem', padding: '0.3rem 0.9rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} messengerUsername={messengerUsername} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p
          className="text-center py-16 text-base"
          style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
        >
          No items in this category yet — check back soon!
        </p>
      )}
    </div>
  );
}
