// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  // Always create a response first
  const res = NextResponse.next()

  try {
    // Edge-safe: no direct env usage here
    const supabase = createMiddlewareClient({ req, res })
    // Touch session so Supabase can refresh it if needed
    await supabase.auth.getSession()
  } catch (err) {
    // Never crash the request from middleware
    console.error('middleware error (ignored):', err)
    return res
  }

  return res
}

// Limit where middleware runs (skip static assets & images)
export const config = {
  matcher: [
    // everything except _next/static, _next/image, assets and favicon
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}