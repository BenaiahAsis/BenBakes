import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import ClayOrderButton from './ClayOrderButton';

interface MenuCardProps {
  item: MenuItem;
  messengerUsername: string;
}

export default function MenuCard({ item, messengerUsername }: MenuCardProps) {
  return (
    <article
      className="clay-card flex flex-col overflow-hidden"
      style={{ background: '#FFF9EE' }}
    >
      {/* ── Image well ────────────────────────────────────────────────── */}
      <div
        className="clay-image mx-4 mt-4 relative overflow-hidden"
        style={{
          height: '200px',
          background: 'linear-gradient(135deg, #F5E6C8 0%, #EDD9A3 100%)',
          flexShrink: 0,
        }}
      >
        {item.photo_url ? (
          <Image
            src={item.photo_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-25 select-none">🍪</span>
          </div>
        )}

        {/* Unavailable overlay */}
        {!item.is_available && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(43,24,16,0.5)', backdropFilter: 'blur(2px)' }}
          >
            <span
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-white"
              style={{ background: 'rgba(0,0,0,0.35)', fontFamily: "'Work Sans', sans-serif" }}
            >
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-6 pt-4 pb-6 gap-3">
        {/* Category pill */}
        <span
          className="self-start text-xs font-bold tracking-wide px-3 py-1 rounded-full"
          style={{
            background: 'var(--pistachio-bg)',
            color: 'var(--pistachio)',
            fontFamily: "'Work Sans', sans-serif",
          }}
        >
          {item.category}
        </span>

        {/* Name */}
        <h3
          className="font-display text-xl font-bold leading-snug"
          style={{
            color: 'var(--ganache)',
            fontVariationSettings: "'SOFT' 100, 'WONK' 1",
          }}
        >
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p
            className="text-sm leading-relaxed flex-1"
            style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
          >
            {item.description}
          </p>
        )}

        {/* Price + order row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <p
            className="text-2xl font-bold"
            style={{ color: 'var(--caramel)', fontFamily: "'Work Sans', sans-serif" }}
          >
            ₱{Number(item.price).toLocaleString()}
          </p>
          {item.is_available && (
            <ClayOrderButton item={item} messengerUsername={messengerUsername} />
          )}
        </div>
      </div>
    </article>
  );
}
