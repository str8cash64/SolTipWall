import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const cookieStore = cookies();
  
  const supa = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const { data: { user } } = await supa.auth.getUser();
  
  if (!user) {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in with Twitter to access your creator dashboard.
          </p>
          <Button asChild className="w-full">
            <a href="/">Go back to sign in</a>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch profile to decide if onboarding is needed
  const { data: profile } = await supa.from('creator_public')
    .select('display_name,bio,categories,min_tip_sol,quick_amounts,avg_reply_hours,telegram_handle,email_new_tips,email_answer_conf,email_weekly,autoblock_min_tip_sol')
    .eq('id', user.id)
    .maybeSingle();

  const needsOnboarding = !profile?.display_name || !profile?.bio || !profile?.min_tip_sol;

  return <DashboardClient profile={profile ?? null} needsOnboarding={needsOnboarding} />;
}