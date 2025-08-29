// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  // Skip middleware for auth callback route to avoid interference
  if (req.nextUrl.pathname === '/auth/callback') {
    return NextResponse.next()
  }

  // Always create a response first
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  try {
    // Edge-safe: Use SSR approach in middleware  
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options) {
            req.cookies.set({
              name,
              value: '',
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Touch session so Supabase can refresh it if needed
    await supabase.auth.getSession()
  } catch (err) {
    // Never crash the request from middleware
    console.error('middleware error (ignored):', err)
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