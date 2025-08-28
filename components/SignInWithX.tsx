'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function SignInWithX() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      // Use production domain for production, current origin for development
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://soltipwall.com' 
        : location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: { 
          redirectTo: `${baseUrl}/auth/callback?next=/dashboard` 
        },
      });
      
      if (error) {
        console.error(error);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: "There was an error signing you in. Please try again."
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Sign in failed", 
        description: "There was an error signing you in. Please try again."
      });
    }
  };

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
  );
}
