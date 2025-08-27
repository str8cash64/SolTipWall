import { NextResponse } from 'next/server';
import { sbAdmin } from '@/lib/supabase-server';
import { splitLamports } from '@/lib/fees';
import { transferLamports } from '@/lib/solana';
import { z } from 'zod';

const schema = z.object({ content: z.string().min(2) });

export async function POST(req: Request, { params }: { params: { tipId: string } }) {
  const body = await req.json();
  const v = schema.safeParse(body);
  if (!v.success) return NextResponse.json({ error: v.error.flatten() }, { status: 400 });

  const { data: tip, error } = await sbAdmin
    .from('tips')
    .select('id,creator_id,tipper_wallet,amount_lamports,fee_bps,status,expires_at, users!tips_creator_id_fkey(wallet_address)')
    .eq('id', params.tipId)
    .single() as any;

  if (error || !tip) return NextResponse.json({ error:'Tip not found' }, { status:404 });
  if (tip.status !== 'funded') return NextResponse.json({ error:'Not funded' }, { status:400 });
  if (new Date(tip.expires_at) < new Date()) return NextResponse.json({ error:'Expired' }, { status:400 });

  await sbAdmin.from('answers').insert({ tip_id: tip.id, creator_id: tip.creator_id, answer_text: v.data.content });

  const amount = BigInt(tip.amount_lamports);
  const { fee, net } = splitLamports(amount, tip.fee_bps);

  const releaseSig = await transferLamports({ to: tip.users.wallet_address, lamports: net });
  if (Number(fee) > 0) await transferLamports({ to: process.env.PLATFORM_VAULT_PUBLIC_KEY!, lamports: fee });

  await sbAdmin.from('tips').update({ status: 'released', tx_release_sig: releaseSig }).eq('id', tip.id);
  return NextResponse.json({ ok:true, releaseSig });
}
