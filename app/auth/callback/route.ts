import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  console.log('🔐 Auth callback route called!');
  console.log('🔐 Request URL:', req.url);
  
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/dashboard';

  console.log('🔐 Code present:', !!code);
  console.log('🔐 Next redirect:', next);

  if (!code) {
    console.error('❌ No code provided in callback');
    return NextResponse.redirect(new URL('/?error=no_code', url.origin));
  }

  const supabase = createClient();

  try {
    // Exchange the code for a session and set the cookie on your domain
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/?error=auth_failed', url.origin));
    }

    if (!data.user) {
      console.error('No user data after session exchange');
      return NextResponse.redirect(new URL('/?error=no_user', url.origin));
    }

    console.log('Successfully authenticated user:', data.user.id);
    console.log('User email:', data.user.email);
    console.log('User metadata:', data.user.user_metadata);

    // Upsert user data after successful authentication
    try {
      // Use the same supabase client to upsert user data directly
      const twitter_id = data.user.user_metadata?.sub || null;
      const twitter_handle = data.user.user_metadata?.user_name || data.user.user_metadata?.preferred_username || null;
      const email = data.user.email || null;
      
      console.log('Extracted user data:', { twitter_id, twitter_handle, email });
      
      // Import sbAdmin here to avoid circular imports
      const { sbAdmin } = await import('@/lib/supabase-server');
      
      // Basic user row - email is optional
      const { error: userError } = await sbAdmin.from('users').upsert({
        id: data.user.id,
        twitter_id,
        twitter_handle
      }, { onConflict: 'id' });
      
      if (userError) {
        console.error('Failed to upsert user:', userError);
      } else {
        console.log('User upserted successfully');
      }

      // Ensure a creator_public profile exists (so onboarding can fill it)
      await sbAdmin.from('creator_public').upsert({ id: data.user.id }, { onConflict: 'id', ignoreDuplicates: true });
      
    } catch (error) {
      console.error('Failed to upsert user:', error);
      // Don't fail the whole flow if upsert fails
    }

    // Successful authentication - redirect to next page
    return NextResponse.redirect(new URL(next, url.origin));
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(new URL('/?error=unexpected', url.origin));
  }
}
