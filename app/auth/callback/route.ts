import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  console.log('🔐 Auth callback triggered')
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('🔐 Code present:', !!code)
  console.log('🔐 Origin:', origin)

  if (code) {
    const supabase = createClient()
    
    try {
      // Exchange code for session
      console.log('🔐 Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('🔐 Error exchanging code:', error)
        return NextResponse.redirect(`${origin}/?error=auth_error`)
      }

      if (data.user) {
        console.log('🔐 User authenticated:', data.user.id)
        console.log('🔐 User email:', data.user.email)
        
        // Create user record if it doesn't exist
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            twitter_id: data.user.user_metadata?.sub,
            twitter_handle: data.user.user_metadata?.user_name || data.user.user_metadata?.preferred_username,
          }, { onConflict: 'id' })

        if (upsertError) {
          console.error('🔐 Error upserting user:', upsertError)
        } else {
          console.log('🔐 User upserted successfully')
        }

        // Create creator profile if it doesn't exist
        await supabase
          .from('creator_public')
          .upsert({ id: data.user.id }, { onConflict: 'id', ignoreDuplicates: true })

        console.log('🔐 Redirecting to dashboard')
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    } catch (error) {
      console.error('🔐 Unexpected error:', error)
      return NextResponse.redirect(`${origin}/?error=unexpected`)
    }
  }

  console.log('🔐 No code provided, redirecting to home')
  return NextResponse.redirect(`${origin}/?error=no_code`)
}
