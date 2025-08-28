'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase-browser'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function MobileStickyCTA() {
  const { toast } = useToast()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

  // Hide when dialogs are open (you can expand this logic as needed)
  useEffect(() => {
    const checkDialogs = () => {
      const dialogs = document.querySelectorAll('[role="dialog"]')
      setIsDialogOpen(dialogs.length > 0)
    }

    // Check initially
    checkDialogs()

    // Set up observer for dialog changes
    const observer = new MutationObserver(checkDialogs)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['role']
    })

    return () => observer.disconnect()
  }, [])

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      
      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false
        return
      }
      
      setIsVisible(scrollY < lastScrollY || scrollY < 100)
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
          options: { 
            redirectTo: `${location.origin}/auth/callback?next=/dashboard`
          }
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

  return (
    <AnimatePresence>
      {isVisible && !isDialogOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-green-500/20 p-4 shadow-2xl"
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
          
          <div className="relative flex items-center space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-green-500/20 hover:bg-green-500/5"
              onClick={scrollToCreators}
            >
              Browse Creators
            </Button>
            
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 font-medium shadow-lg shadow-green-600/25"
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
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Sign in with X
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          
          {/* Safe area for devices with home indicators */}
          <div className="h-safe-area-inset-bottom" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
