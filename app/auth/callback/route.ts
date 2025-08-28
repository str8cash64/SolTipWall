import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Exchanges the code for a session and sets the cookie on your domain
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Upsert user data after successful authentication
      try {
        await fetch(`${url.origin}/api/auth/upsert`, { 
          method: 'POST',
          headers: {
            'Cookie': req.headers.get('Cookie') || '',
          },
        });
      } catch (error) {
        console.error('Failed to upsert user:', error);
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
