import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/dashboard'

  if (!code) {
    console.error('❌ No code provided in callback')
    return NextResponse.redirect(new URL('/?error=no_code', url.origin))
  }

  const supabase = createRouteHandlerClient({ cookies })

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

    // Successful authentication - redirect to next page
    return NextResponse.redirect(new URL(next, url.origin))
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(new URL('/?error=unexpected', url.origin))
  }
}
