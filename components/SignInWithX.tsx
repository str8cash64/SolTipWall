'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export default function SignInWithX() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/callback`
      
      console.log('🔐 Starting X auth with redirect:', redirectTo)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: { redirectTo }
      })
      
      if (error) {
        console.error('🔐 Auth error:', error)
        setLoading(false)
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: "There was an error signing you in. Please try again."
        })
      }
    } catch (error) {
      console.error('🔐 Unexpected error:', error)
      setLoading(false)
      toast({
        variant: "destructive",
        title: "Sign in failed", 
        description: "There was an error signing you in. Please try again."
      })
    }
  }

  return (
    <Button 
      size="sm" 
      className="font-medium"
      disabled={loading}
      onClick={handleSignIn}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        'Sign in with X'
      )}
    </Button>
  )
}