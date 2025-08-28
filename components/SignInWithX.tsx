'use client'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function SignInWithXButton() {
  const signIn = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        // IMPORTANT: send them to your own Next.js handler
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Button onClick={signIn} className="font-medium" size="sm">
      Sign in with X
    </Button>
  )
}