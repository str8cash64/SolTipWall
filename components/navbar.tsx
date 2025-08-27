'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Zap, User, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function Navbar() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  const { toast } = useToast()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">TipWall</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user?.twitterHandle}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      logout()
                      toast({
                        title: "Signed out",
                        description: "You have been signed out successfully."
                      })
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="font-medium"
                disabled={isLoading}
                onClick={async () => {
                  try {
                    toast({
                      title: "Connecting to X...",
                      description: "Redirecting to Twitter for authentication."
                    })
                    await login()
                    toast({
                      title: "Welcome to TipWall!",
                      description: "You've been signed in successfully. You can now access your dashboard."
                    })
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Sign in failed",
                      description: "There was an error signing you in. Please try again."
                    })
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Sign in with X'
                )}
              </Button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  )
}
