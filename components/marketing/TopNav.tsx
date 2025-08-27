'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { Zap, Menu, ArrowRight, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { sb } from '@/lib/supabase-browser'

const navLinks = [
  { href: '#creators', label: 'Browse Creators' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' }
]

export function TopNav() {
  const { toast } = useToast()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true;
    sb().auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setIsAuthenticated(!!data.user);
    });
    const { data: sub } = sb().auth.onAuthStateChange((_e, sess) => {
      setIsAuthenticated(!!sess?.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Connecting to X...",
        description: "Redirecting to Twitter for authentication."
      })
      const { error } = await sb().auth.signInWithOAuth({
        provider: 'twitter',
        options: { redirectTo: `${location.origin}/auth/callback` }
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "There was an error signing you in. Please try again."
      })
    }
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsSheetOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Zap className="h-7 w-7 text-green-500" />
            <div className="absolute inset-0 h-7 w-7 text-green-500 animate-pulse opacity-30">
              <Zap className="h-7 w-7" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight">TipWall</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToSection('#creators')}
            className="font-medium"
          >
            Browse Creators
          </Button>
          
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="sm" className="font-medium">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button 
              size="sm" 
              className="font-medium bg-green-600 hover:bg-green-700"
              disabled={isLoading}
              onClick={handleSignIn}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Sign in with X
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-6 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-lg font-medium hover:text-green-500 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                
                <div className="pt-6 border-t space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => scrollToSection('#creators')}
                  >
                    Browse Creators
                  </Button>
                  
                  {isAuthenticated ? (
                    <Link href="/dashboard" className="block">
                      <Button className="w-full justify-start">
                        Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className="w-full justify-start bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                      onClick={handleSignIn}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          Sign in with X
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
