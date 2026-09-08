import { createAdminClient } from '@/lib/supabase/server';
import type { MenuItem } from '@/lib/types';
import MenuManager from '@/components/admin/MenuManager';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Menu | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('menu_items')
    .select('*')
    .order('category')
    .order('sort_order');

  return <MenuManager items={(data ?? []) as MenuItem[]} />;
}
