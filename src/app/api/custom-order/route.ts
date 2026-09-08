import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerName, occasion, servings, flavor, designNotes, dateNeeded } = body;

  if (!customerName || !occasion || !servings || !dateNeeded) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.from('custom_orders').insert({
    customer_name: customerName,
    occasion,
    servings,
    flavor: flavor || null,
    design_notes: designNotes || null,
    date_needed: dateNeeded,
    status: 'new',
  });

  if (error) {
    console.error('custom_orders insert error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
