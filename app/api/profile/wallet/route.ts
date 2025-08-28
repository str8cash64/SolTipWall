import { NextResponse } from 'next/server';
import { createClient, sbAdmin } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const supa = createClient();
  
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authed' }, { status: 401 });

  const { wallet } = await req.json();
  const { error } = await sbAdmin.from('users').update({ wallet_address: wallet }).eq('id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
