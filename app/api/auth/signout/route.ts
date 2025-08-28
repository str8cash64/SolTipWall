import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options) {
          try {
            cookies().set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting errors
          }
        },
        remove(name: string, options) {
          try {
            cookies().set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie removal errors
          }
        },
      },
    }
  )
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', 'https://soltipwall.com'))
}
