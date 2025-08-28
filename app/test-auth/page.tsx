'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, User, LogOut } from 'lucide-react'

export default function TestAuthPage() {
  const { user, isAuthenticated, login, logout, isLoading, completeOnboarding } = useAuth()
  const { toast } = useToast()

  return (
    <div className="container py-16 max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Test the Twitter login flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Status: {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not authenticated'}
            </p>
            
            {user && (
              <div className="bg-muted p-3 rounded-lg mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.twitterHandle}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Onboarding: {user.hasCompletedOnboarding ? 'Complete' : 'Pending'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {!isAuthenticated ? (
              <Button
                onClick={async () => {
                  try {
                    toast({
                      title: "Connecting to X...",
                      description: "Simulating Twitter OAuth flow"
                    })
                    await login()
                    toast({
                      title: "Success!",
                      description: "You've been signed in successfully."
                    })
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to sign in"
                    })
                  }
                }}
                disabled={isLoading}
                className="w-full"
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
            ) : (
              <div className="space-y-2">
                {user && !user.hasCompletedOnboarding && (
                  <Button
                    onClick={() => {
                      completeOnboarding()
                      toast({
                        title: "Onboarding completed!",
                        description: "You can now access all features."
                      })
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Complete Onboarding
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    logout()
                    toast({
                      title: "Signed out",
                      description: "You have been signed out successfully."
                    })
                  }}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              This page tests the authentication flow. Try signing in and out to see the state changes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
