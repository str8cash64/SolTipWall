'use client';
import { createClient } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const { toast } = useToast();

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
      window.location.href = '/';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was an error signing you out."
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={signOut}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
