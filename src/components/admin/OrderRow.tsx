'use client';

import { useState } from 'react';
import type { CustomOrder, OrderStatus } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  confirmed: 'Confirmed',
  completed: 'Completed',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'status-new',
  contacted: 'status-contacted',
  confirmed: 'status-confirmed',
  completed: 'status-completed',
};

interface OrderRowProps {
  order: CustomOrder;
}

export default function OrderRow({ order }: OrderRowProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function handleStatusChange(newStatus: OrderStatus) {
    setSaving(true);
    const { error } = await supabase
      .from('custom_orders')
      .update({ status: newStatus })
      .eq('id', order.id);
    if (!error) setStatus(newStatus);
    setSaving(false);
  }

  const dateNeeded = order.date_needed
    ? new Date(order.date_needed).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
  const receivedAt = new Date(order.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });

  return (
    <tr
      className="border-b"
      style={{ borderColor: 'var(--line)', fontFamily: "'Work Sans', sans-serif" }}
    >
      <td className="px-3 py-4 text-sm" style={{ color: 'var(--ink)' }}>
        <p className="font-semibold">{order.customer_name}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>Received {receivedAt}</p>
      </td>
      <td className="px-3 py-4 text-sm" style={{ color: 'var(--ink-soft)' }}>
        {order.occasion || '—'}
      </td>
      <td className="px-3 py-4 text-sm" style={{ color: 'var(--ink-soft)' }}>
        {order.servings || '—'}
      </td>
      <td className="px-3 py-4 text-sm font-medium" style={{ color: 'var(--caramel)' }}>
        {dateNeeded}
      </td>
      <td className="px-3 py-4 text-sm max-w-xs">
        {order.design_notes && (
          <p className="truncate text-xs" style={{ color: 'var(--ink-soft)' }} title={order.design_notes}>
            {order.design_notes}
          </p>
        )}
        {order.flavor && (
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>Flavor: {order.flavor}</p>
        )}
      </td>
      <td className="px-3 py-4">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          disabled={saving}
          className={`status-badge ${STATUS_COLORS[status]} border-0 cursor-pointer`}
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}
