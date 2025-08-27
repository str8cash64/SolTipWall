import { NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';
import { z } from 'zod';
import { sbAdmin } from '@/lib/supabase-server';
import { feeBpsForTip } from '@/lib/fees';
import { buildSolanaPayUrl } from '@/lib/solana';

const schema = z.object({
  creatorId: z.string().uuid(),
  tipSol: z.number().positive(),
  questionText: z.string().min(2),
  tipperWallet: z.string(),
  askerId: z.string().uuid().optional()
});

export async function POST(req: Request) {
  const body = await req.json();
  const v = schema.safeParse(body);
  if (!v.success) return NextResponse.json({ error: v.error.flatten() }, { status: 400 });

  const { creatorId, tipSol, questionText, tipperWallet, askerId } = v.data;

  const { data: creator, error: cErr } = await sbAdmin
    .from('users').select('id,wallet_address,pro_creator').eq('id', creatorId).single();
  if (cErr || !creator?.wallet_address) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

  const reference = Keypair.generate().publicKey.toBase58();
  const premium = !!creator.pro_creator;
  const fee_bps = feeBpsForTip(tipSol, premium);
  const expires_at = new Date(Date.now() + (Number(process.env.ANSWER_TIMEOUT_HOURS ?? 48) * 3600_000)).toISOString();

  const { data: tipRow, error: tErr } = await sbAdmin.from('tips').insert({
    creator_id: creatorId,
    asker_id: askerId ?? null,
    tipper_wallet: tipperWallet,
    amount_lamports: Math.round(tipSol * 1_000_000_000),
    question_text: questionText,
    status: 'awaiting_payment',
    fee_bps,
    premium_creator: premium,
    reference_pubkey: reference,
    escrow_type: 'custodial',
    expires_at
  }).select('id').single();
  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });

  const solPayUrl = buildSolanaPayUrl({
    recipient: process.env.PLATFORM_VAULT_PUBLIC_KEY!,
    amountSol: tipSol,
    reference,
    memo: `tipwall:${tipRow.id}`
  });

  return NextResponse.json({ tipId: tipRow.id, solanaPayUrl: solPayUrl, reference });
}
