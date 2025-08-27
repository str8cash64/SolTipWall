import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { sbAdmin } from '@/lib/supabase-server';

export async function POST() {
  const supa = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No user' }, { status: 401 });

  const twitter_id = user.user_metadata?.sub || null;
  const twitter_handle = user.user_metadata?.user_name || user.user_metadata?.preferred_username || null;

  const { error } = await sbAdmin.from('users').upsert({
    id: user.id,
    twitter_id,
    twitter_handle
  }, { onConflict: 'id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
