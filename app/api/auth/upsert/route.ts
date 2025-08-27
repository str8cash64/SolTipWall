import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { sbAdmin } from '@/lib/supabase-server';

export async function POST() {
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
  if (!user) return NextResponse.json({ error: 'No user' }, { status: 401 });

  const twitter_id = user.user_metadata?.sub || null;
  const twitter_handle = user.user_metadata?.user_name || user.user_metadata?.preferred_username || null;
  
  try {
    // Basic user row
    const { error } = await sbAdmin.from('users').upsert({
      id: user.id,
      twitter_id,
      twitter_handle
    }, { onConflict: 'id' });
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Ensure a creator_public profile exists (so onboarding can fill it)
    await sbAdmin.from('creator_public').upsert({ id: user.id }, { onConflict: 'id', ignoreDuplicates: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Upsert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}