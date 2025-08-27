import { NextResponse } from 'next/server';
import { sbAdmin } from '@/lib/supabase-server';

export async function POST(req: Request) {
  if (req.headers.get('x-helius-secret') !== process.env.HELIUS_WEBHOOK_SECRET)
    return NextResponse.json({ ok:false }, { status: 403 });

  const events = await req.json(); // array
  for (const evt of events) {
    try {
      const sig = evt.signature;
      const inbound = (evt.nativeTransfers ?? []).find((t:any) =>
        t.recipient === process.env.PLATFORM_VAULT_PUBLIC_KEY
      );
      if (!inbound) continue;

      const refs = new Set<string>();
      (evt.accountData ?? []).forEach((a:any)=> a?.account && refs.add(a.account));
      (evt.instructions ?? []).forEach((i:any)=> (i.accounts ?? []).forEach((a:string)=> a && refs.add(a)));

      for (const ref of Array.from(refs)) {
        const { data: tip } = await sbAdmin
          .from('tips').select('id,status').eq('reference_pubkey', ref).single();
        if (!tip || tip.status !== 'awaiting_payment') continue;

        await sbAdmin.from('tips').update({ status: 'funded', tx_fund_sig: sig }).eq('id', tip.id);
      }
    } catch {}
  }
  return NextResponse.json({ ok:true });
}
