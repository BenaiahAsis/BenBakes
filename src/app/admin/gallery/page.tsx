import { createAdminClient } from '@/lib/supabase/server';
import type { GalleryPhoto } from '@/lib/types';
import GalleryManager from '@/components/admin/GalleryManager';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gallery | Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false });

  return <GalleryManager photos={(data ?? []) as GalleryPhoto[]} />;
}
