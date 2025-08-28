'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User, LogOut, Loader2 } from 'lucide-react';

export default function AuthButtons() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.user?.id ?? null);
      setUserHandle(data.user?.user_metadata?.user_name || data.user?.user_metadata?.preferred_username || null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setUserId(sess?.user?.id ?? null);
      setUserHandle(sess?.user?.user_metadata?.user_name || sess?.user?.user_metadata?.preferred_username || null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signInWithX() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: { 
          redirectTo: `${location.origin}/auth/callback?next=/dashboard`,
          queryParams: {
            redirect_to: `${location.origin}/auth/callback?next=/dashboard`
          }
        }
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
  }

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
      location.href = '/';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was an error signing you out."
      });
    }
  }

  if (userId) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4 mr-2" />
            {userHandle || 'User'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      size="sm" 
      className="font-medium"
      disabled={loading}
      onClick={signInWithX}
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