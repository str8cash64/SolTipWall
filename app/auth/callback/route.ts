// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    // Optional: log this to Sentry etc.
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?auth=error`)
  }

  if (code) {
    const supabase = createSupabaseServerClient()
    // This will set the "sb-..." cookies on your domain
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?auth=exchange_error`)
    }
    // If you have onboarding logic, send there when first login
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`)
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`)
}
