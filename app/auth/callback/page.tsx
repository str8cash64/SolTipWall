'use client';
import { useEffect } from 'react';
import { sb } from '@/lib/supabase-browser';

export default function Callback() {
  useEffect(() => {
    (async () => {
      const { data: { user } } = await sb().auth.getUser();
      if (!user) return location.replace('/');
      await fetch('/api/auth/upsert', { method: 'POST' });
      location.replace('/dashboard');
    })();
  }, []);
  return <div className="p-10 text-white">Signing you in…</div>;
}
