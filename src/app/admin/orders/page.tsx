import { createAdminClient } from '@/lib/supabase/server';
import type { CustomOrder } from '@/lib/types';
import OrderRow from '@/components/admin/OrderRow';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Orders | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('custom_orders')
    .select('*')
    .order('date_needed', { ascending: true, nullsFirst: false });

  const orders = (data ?? []) as CustomOrder[];

  return (
    <div>
      <h1
        className="font-display text-3xl font-bold mb-6"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
      >
        Custom order requests
      </h1>

      {orders.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl border-2 border-dashed"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
        >
          <p className="text-4xl mb-3">📬</p>
          <p className="text-base font-medium" style={{ fontFamily: "'Work Sans', sans-serif" }}>
            No requests yet
          </p>
          <p className="text-sm mt-1" style={{ fontFamily: "'Work Sans', sans-serif" }}>
            New custom order submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-left" style={{ background: 'var(--cream-card)' }}>
            <thead>
              <tr
                className="border-b text-xs font-semibold uppercase tracking-wide"
                style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}
              >
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Occasion</th>
                <th className="px-3 py-3">Servings</th>
                <th className="px-3 py-3">Date needed</th>
                <th className="px-3 py-3">Notes</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
