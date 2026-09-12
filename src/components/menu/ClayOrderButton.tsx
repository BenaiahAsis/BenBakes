'use client';

import { useState } from 'react';
import { buildMessengerUrl, buildMenuOrderMessage } from '@/lib/messenger';
import type { MenuItem } from '@/lib/types';

interface ClayOrderButtonProps {
  item: Pick<MenuItem, 'name' | 'price'>;
  messengerUsername: string;
}

export default function ClayOrderButton({ item, messengerUsername }: ClayOrderButtonProps) {
  const message = buildMenuOrderMessage(item.name, item.price);
  const messengerUrl = buildMessengerUrl(messengerUsername, message);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {/* Primary: Messenger direct order */}
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="clay-btn flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white whitespace-nowrap"
        style={{
          background: 'var(--berry)',
          fontFamily: "'Work Sans', sans-serif",
          textDecoration: 'none',
        }}
        title="Open Facebook Messenger with pre-filled order"
      >
        <span>💬</span>
        <span>Order</span>
      </a>

      {/* Copy order button with instant feedback */}
      <button
        type="button"
        onClick={handleCopy}
        className={`clay-pill flex items-center gap-1 px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
          copied ? 'active' : ''
        }`}
        style={{
          background: copied ? 'var(--pistachio)' : '#FFF0D9',
          color: copied ? '#ffffff' : 'var(--ink-soft)',
          fontFamily: "'Work Sans', sans-serif",
          cursor: 'pointer',
        }}
        title="Copy pre-filled order text to clipboard"
        aria-label="Copy order text"
      >
        <span>{copied ? '✓' : '📋'}</span>
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  );
}
