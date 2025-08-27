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
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const body = await req.json();
    
    // Server-side validation and sanitization
    const payload = {
      id: user.id,
      display_name: String(body.display_name ?? '').slice(0, 80) || null,
      bio: String(body.bio ?? '').slice(0, 140) || null,
      categories: Array.isArray(body.categories) ? body.categories.slice(0, 5) : [],
      min_tip_sol: Math.max(0.01, Math.min(0.5, Number(body.min_tip_sol ?? 0.05))),
      quick_amounts: Array.isArray(body.quick_amounts) ? body.quick_amounts.slice(0, 6) : [0.1, 0.25, 0.5, 1],
      avg_reply_hours: Math.max(1, Math.min(168, Number(body.avg_reply_hours ?? 4))), // 1 hour to 1 week
      telegram_handle: body.telegram_handle ? String(body.telegram_handle).slice(0, 64) : null,
      email_new_tips: Boolean(body.email_new_tips),
      email_answer_conf: Boolean(body.email_answer_conf),
      email_weekly: Boolean(body.email_weekly),
      autoblock_min_tip_sol: Math.max(0.01, Math.min(0.5, Number(body.autoblock_min_tip_sol ?? 0.01))),
    };

    // Use service role to bypass RLS
    const { error } = await sbAdmin.from('creator_public').upsert(payload, { onConflict: 'id' });
    
    if (error) {
      console.error('Profile save error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Profile save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
