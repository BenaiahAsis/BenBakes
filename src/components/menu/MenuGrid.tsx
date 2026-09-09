'use client';

import { useState } from 'react';
import type { MenuItem, MenuCategory } from '@/lib/types';
import MenuCard from './MenuCard';

const CATEGORIES: MenuCategory[] = ['Cakes', 'Cupcakes', 'Pastries', 'Cookies'];
const ALL = 'All' as const;
type Filter = typeof ALL | MenuCategory;

interface MenuGridProps {
  items: MenuItem[];
  messengerUsername: string;
}

export default function MenuGrid({ items, messengerUsername }: MenuGridProps) {
  const [active, setActive] = useState<Filter>(ALL);

  // Only show categories that actually have items
  const availableCategories = CATEGORIES.filter((c) => items.some((i) => i.category === c));
  const filters: Filter[] = [ALL, ...availableCategories];

  const filtered = active === ALL ? items : items.filter((i) => i.category === active);

  return (
    <div>
      {/* ── Category filter bar ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-10">
        {filters.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`clay-pill px-5 py-2.5 text-sm font-bold cursor-pointer ${isActive ? 'active' : ''}`}
              style={{
                background: isActive ? 'var(--pistachio)' : '#FFF3DD',
                color: isActive ? '#fff' : 'var(--ink-soft)',
                fontFamily: "'Work Sans', sans-serif",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🍪</p>
          <p
            className="text-base font-medium"
            style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            Nothing here yet — check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} messengerUsername={messengerUsername} />
          ))}
        </div>
      )}
    </div>
  );
}
