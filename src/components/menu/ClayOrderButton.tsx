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
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {/* Primary: Messenger */}
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="clay-btn flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white"
        style={{
          background: 'var(--berry)',
          fontFamily: "'Work Sans', sans-serif",
          textDecoration: 'none',
        }}
      >
        <span>💬</span>
        Order
      </a>

      {/* Fallback: copy */}
      <button
        onClick={handleCopy}
        className="clay-pill flex items-center justify-center w-10 h-10 text-base"
        style={{
          background: '#FFF0D9',
          color: 'var(--ink-soft)',
          fontFamily: "'Work Sans', sans-serif",
          cursor: 'pointer',
        }}
        title="Copy order message to clipboard"
        aria-label="Copy order message"
      >
        {copied ? '✓' : '📋'}
      </button>
    </div>
  );
}
