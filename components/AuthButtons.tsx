'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function AuthButtons() {
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUserId(data.user?.id || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUserId(session?.user?.id || null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signInWithX() {
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

  async function signOut() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      })
    } catch (error) {
      console.error('🔐 Signout error:', error)
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was an error signing you out."
      })
    }
  }

  if (userId) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <a href="/dashboard">Dashboard</a>
        </Button>
        <Button variant="ghost" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <Button 
      size="sm" 
      className="font-medium"
      disabled={loading}
      onClick={signInWithX}
    >
      {loading ? 'Connecting...' : 'Sign in with X'}
    </Button>
  )
}