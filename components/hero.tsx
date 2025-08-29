'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { Zap, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Hero() {
  const { toast } = useToast()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(({ data }: { data: any }) => {
      if (!mounted) return;
      setIsAuthenticated(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e: any, sess: any) => {
      setIsAuthenticated(!!sess?.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return (
    <section className="container flex flex-col items-center justify-center space-y-8 py-24 md:py-32">
      <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
        <div className="flex items-center space-x-2 rounded-full border px-4 py-1.5 text-sm">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Trusted by Solana creators</span>
        </div>
        
        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
          Get paid to answer.
          <br />
          <span className="text-primary">Get answers that matter.</span>
        </h1>
        
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          TipWall connects creators with their audience through paid Q&A. 
          Set your price, answer questions, and get paid in SOL. 
          Answers delivered instantly via Telegram.
        </p>
        
        <p className="max-w-[600px] text-base text-muted-foreground border-l-2 border-primary/30 pl-4">
          <strong className="text-foreground">Looking for answers?</strong> Browse top creators and get personalized responses to your questions.
        </p>
        
        <div className="flex flex-col gap-4 min-[400px]:flex-row">
          <Button 
            size="lg" 
            className="text-base"
            disabled={isLoading}
            onClick={async () => {
              if (isAuthenticated) {
                router.push('/dashboard')
              } else {
                setIsLoading(true);
                try {
                  toast({
                    title: "Connecting to X...",
                    description: "Redirecting to Twitter for authentication."
                  })
                          const supabase = getSupabaseBrowser();
        const redirectTo = `${window.location.origin}/auth/callback`
        
        console.log('🔐 Starting X auth with redirect:', redirectTo)
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: { redirectTo }
        });
                  if (error) throw error;
                } catch (error) {
                  setIsLoading(false);
                  toast({
                    variant: "destructive",
                    title: "Sign in failed",
                    description: "There was an error signing you in. Please try again."
                  })
                }
              }
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : isAuthenticated ? (
              <>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Sign in with X
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-base"
            onClick={() => {
              // Scroll to leaderboard section
              const leaderboardSection = document.querySelector('section:nth-child(2)')
              leaderboardSection?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Browse Creators
          </Button>
        </div>
      </div>

      {/* How it works section */}
      <div className="w-full max-w-4xl mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold">Pay & Ask</h3>
            <p className="text-sm text-muted-foreground">
              Find a creator, pay their tip amount, and ask your question
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold">Get Answered</h3>
            <p className="text-sm text-muted-foreground">
              Creator sees your question and crafts a personalized response
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold">Delivered on Telegram</h3>
            <p className="text-sm text-muted-foreground">
              Receive the answer directly in your Telegram DMs
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
