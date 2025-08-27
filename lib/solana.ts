import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';

export const conn = new Connection(process.env.SOLANA_CLUSTER!, 'confirmed');

export function toLamports(sol: number) {
  return BigInt(Math.round(sol * LAMPORTS_PER_SOL));
}

export function getVaultKeypair() {
  const arr = JSON.parse(process.env.PLATFORM_VAULT_PRIVATE_KEY!);
  return Keypair.fromSecretKey(Uint8Array.from(arr));
}

export function buildSolanaPayUrl({ recipient, amountSol, reference, memo }:{
  recipient: string; amountSol: number; reference: string; memo?: string;
}) {
  const p = new URLSearchParams({ amount: String(amountSol), reference, ...(memo?{memo}:{}) });
  return `solana:${recipient}?${p.toString()}`;
}

export async function transferLamports({ to, lamports }:{ to: string; lamports: bigint }) {
  const vault = getVaultKeypair();
  const tx = new Transaction().add(SystemProgram.transfer({
    fromPubkey: vault.publicKey,
    toPubkey: new PublicKey(to),
    lamports: Number(lamports),
  }));
  return await sendAndConfirmTransaction(conn, tx, [vault], { commitment: 'confirmed' });
}
