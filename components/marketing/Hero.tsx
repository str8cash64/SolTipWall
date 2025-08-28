'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { ArrowRight, Loader2, MessageCircle, Wallet, Zap, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { calculateFee } from '@/lib/mocks'

export function Hero() {
  const { toast } = useToast()
  const router = useRouter()
  const [tipAmount, setTipAmount] = useState(0.05)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setIsAuthenticated(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setIsAuthenticated(!!sess?.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      setIsLoading(true);
      try {
        toast({
          title: "Connecting to X...",
          description: "Redirecting to Twitter for authentication."
        })
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` }
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
  }

  const scrollToCreators = () => {
    const element = document.querySelector('#creators')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const { feePercent, netAmount } = calculateFee(tipAmount)

  return (
    <section className="container relative overflow-hidden py-24 md:py-32">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/3 rounded-full blur-3xl" />
      
      <div className="relative grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col space-y-8"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center space-x-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2 w-fit"
          >
            <Zap className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-400">Trusted by Solana creators</span>
          </motion.div>
          
          {/* Headlines */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]"
            >
              Get paid to answer.
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1] bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
            >
              Get answers that matter.
            </motion.h1>
          </div>
          
          {/* Subcopy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-[600px] text-lg text-muted-foreground sm:text-xl"
          >
            Connect with Solana's top creators through paid Q&A. Get personalized insights, 
            expert advice, and exclusive access to the minds shaping Web3.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col gap-4 min-[400px]:flex-row"
          >
            <Button 
              size="lg" 
              className="text-base bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25"
              disabled={isLoading}
              onClick={handleSignIn}
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
              className="text-base border-green-500/20 hover:bg-green-500/5"
              onClick={scrollToCreators}
            >
              Browse Creators
            </Button>
          </motion.div>
          
          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span>Answers delivered via Telegram</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-green-500" />
              <span>Instant payouts in SOL</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Preview Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl blur-2xl scale-110" />
          
          <Card className="relative bg-card/50 backdrop-blur-sm border-green-500/20 shadow-2xl">
            <CardContent className="p-6 space-y-6">
              {/* Creator Profile */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">@SolDev</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">DeFi Expert • 4hr avg response</p>
                </div>
              </div>
              
              {/* Tip Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Tip Amount</label>
                  <span className="text-sm text-muted-foreground">{tipAmount.toFixed(3)} SOL</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.005"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.01 SOL</span>
                  <span>0.5 SOL</span>
                </div>
              </div>
              
              {/* Fee Breakdown */}
              <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>You pay:</span>
                  <span className="font-medium">{tipAmount.toFixed(3)} SOL</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Platform fee ({feePercent}%):</span>
                  <span>-{(tipAmount - netAmount).toFixed(3)} SOL</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-green-400 border-t border-border pt-2">
                  <span>Creator receives:</span>
                  <span>{netAmount.toFixed(3)} SOL</span>
                </div>
              </div>
              
              {/* CTA Button */}
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Ask & Tip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Demo preview • Connect wallet to tip creators
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </section>
  )
}
