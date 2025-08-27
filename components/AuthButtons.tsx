'use client';
import { sb } from '@/lib/supabase-browser';

export default function AuthButtons() {
  async function signInWithX() {
    await sb().auth.signInWithOAuth({
      provider: 'twitter',
      options: { redirectTo: `${location.origin}/auth/callback` }
    });
  }
  async function signOut() { await sb().auth.signOut(); }
  return (
    <div className="flex gap-2">
      <button onClick={signInWithX} className="px-3 py-2 rounded bg-green-600 text-white">Sign in with X</button>
      <button onClick={signOut} className="px-3 py-2 rounded bg-slate-700 text-white">Sign out</button>
    </div>
  );
}
