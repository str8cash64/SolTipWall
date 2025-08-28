import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  console.log('🔐 Signout triggered')
  
  const supabase = createClient()
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  try {
    await supabase.auth.signOut()
    console.log('🔐 User signed out successfully')
    return NextResponse.redirect(`${origin}/`)
  } catch (error) {
    console.error('🔐 Error signing out:', error)
    return NextResponse.redirect(`${origin}/`)
  }
}
