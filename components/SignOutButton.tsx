'use client'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const onClick = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }
  return <button onClick={onClick}>Sign out</button>
}
