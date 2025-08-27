import { NextResponse } from 'next/server';
import { sbAdmin } from '@/lib/supabase-server';
import { transferLamports } from '@/lib/solana';

export async function POST(req: Request) {
  if (req.headers.get('x-cron-secret') !== process.env.CRON_SECRET)
    return NextResponse.json({ ok:false }, { status: 403 });

  const { data: rows, error } = await sbAdmin
    .from('tips')
    .select('id,tipper_wallet,amount_lamports')
    .eq('status','funded')
    .lte('expires_at', new Date().toISOString());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  for (const t of rows ?? []) {
    try {
      const sig = await transferLamports({ to: t.tipper_wallet, lamports: BigInt(t.amount_lamports) });
      await sbAdmin.from('tips').update({ status:'refunded', tx_refund_sig: sig }).eq('id', t.id);
    } catch {}
  }
  return NextResponse.json({ ok:true });
}
