import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/dashboard'

  if (!code) {
    console.error('❌ No code provided in callback')
    return NextResponse.redirect(new URL('/?error=no_code', url.origin))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  try {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/?error=auth_failed', url.origin))
    }

    if (!data.user) {
      console.error('No user data after session exchange')
      return NextResponse.redirect(new URL('/?error=no_user', url.origin))
    }

    console.log('Successfully authenticated user:', data.user.id)
    console.log('User email:', data.user.email)
    console.log('User metadata:', data.user.user_metadata)

    // Upsert user data after successful authentication
    try {
      const twitter_id = data.user.user_metadata?.sub || null
      const twitter_handle = data.user.user_metadata?.user_name || data.user.user_metadata?.preferred_username || null
      const email = data.user.email || null
      
      console.log('Extracted user data:', { twitter_id, twitter_handle, email })
      
      // Use the same supabase client to upsert user data directly
      const { error: userError } = await supabase.from('users').upsert({
        id: data.user.id,
        twitter_id,
        twitter_handle
      }, { onConflict: 'id' })
      
      if (userError) {
        console.error('Failed to upsert user:', userError)
      } else {
        console.log('User upserted successfully')
      }

      // Ensure a creator_public profile exists (so onboarding can fill it)
      await supabase.from('creator_public').upsert({ id: data.user.id }, { onConflict: 'id', ignoreDuplicates: true })
      
    } catch (error) {
      console.error('Failed to upsert user:', error)
      // Don't fail the whole flow if upsert fails
    }

    // Successful authentication - redirect to next page
    return NextResponse.redirect(new URL(next, url.origin))
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(new URL('/?error=unexpected', url.origin))
  }
}
