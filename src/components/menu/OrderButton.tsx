'use client';

import { useState, useTransition } from 'react';
import { buildMessengerUrl, buildMenuOrderMessage } from '@/lib/messenger';
import type { MenuItem } from '@/lib/types';

interface OrderButtonProps {
  item: Pick<MenuItem, 'name' | 'price'>;
  messengerUsername: string;
}

export default function OrderButton({ item, messengerUsername }: OrderButtonProps) {
  const message = buildMenuOrderMessage(item.name, item.price);
  const messengerUrl = buildMessengerUrl(messengerUsername, message);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  function handleCopy() {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      startTransition(() => {
        setTimeout(() => setCopied(false), 2000);
      });
    });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-berry flex-1 justify-center text-sm py-2"
      >
        💬 Order this
      </a>
      <button
        onClick={handleCopy}
        className="btn-ghost text-sm py-2 px-3"
        title="Copy order text to clipboard"
        aria-label="Copy order message to clipboard"
      >
        {copied ? '✓ Copied!' : '📋'}
      </button>
    </div>
  );
}
