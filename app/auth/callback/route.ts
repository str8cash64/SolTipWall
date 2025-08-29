// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  
  // Get the origin from the request if NEXT_PUBLIC_SITE_URL is not set
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || url.origin

  if (error) {
    // Optional: log this to Sentry etc.
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${siteUrl}/?auth=error`)
  }

  if (code) {
    const supabase = createSupabaseServerClient()
    // This will set the "sb-..." cookies on your domain
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      console.error('Auth exchange error:', exchangeError)
      return NextResponse.redirect(`${siteUrl}/?auth=exchange_error`)
    }
    // If you have onboarding logic, send there when first login
    return NextResponse.redirect(`${siteUrl}/dashboard`)
  }

  return NextResponse.redirect(`${siteUrl}/`)
}
