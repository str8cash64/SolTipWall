import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { sbAdmin } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const cookieStore = cookies();
  
  const supa = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authed' }, { status: 401 });

  const { wallet } = await req.json();
  const { error } = await sbAdmin.from('users').update({ wallet_address: wallet }).eq('id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
