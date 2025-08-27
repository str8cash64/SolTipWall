export function feeBpsForTip(tipSol: number, premium: boolean) {
  if (premium) return 0;
  if (tipSol < 0.05) return 700;
  if (tipSol < 0.5)  return 300;
  return 100;
}

export function splitLamports(tipLamports: bigint, feeBps: number) {
  const fee = (tipLamports * BigInt(feeBps)) / BigInt(10_000);
  return { fee, net: tipLamports - fee };
}