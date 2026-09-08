import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import OrderButton from './OrderButton';

interface MenuCardProps {
  item: MenuItem;
  messengerUsername: string;
}

export default function MenuCard({ item, messengerUsername }: MenuCardProps) {
  return (
    <article className="card overflow-hidden flex flex-col">
      {/* Photo */}
      <div className="w-full aspect-square relative flex items-center justify-center"
        style={{ background: '#F0E8D8' }}>
        {item.photo_url ? (
          <Image
            src={item.photo_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        ) : (
          <span className="text-6xl opacity-20">🎂</span>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(43,24,16,0.55)' }}>
            <span className="text-white text-sm font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.4)', fontFamily: "'Work Sans', sans-serif" }}>
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <span className="pill mb-2">{item.category}</span>
        <h3
          className="font-display text-lg font-semibold leading-snug mb-1"
          style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
        >
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm flex-1 mb-3" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
            {item.description}
          </p>
        )}
        <p
          className="font-bold text-base mb-3"
          style={{ color: 'var(--caramel)', fontFamily: "'Work Sans', sans-serif" }}
        >
          ₱{Number(item.price).toLocaleString()}
        </p>
        {item.is_available && (
          <OrderButton item={item} messengerUsername={messengerUsername} />
        )}
      </div>
    </article>
  );
}
