import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--buttercream)' }}>
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 max-w-4xl">
        {children}
      </main>
    </div>
  );
}
