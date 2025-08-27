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

// Additional utility functions for dashboard components
export function formatSol(amount: number, precision: number = 3): string {
  return `${amount.toFixed(precision)} SOL`;
}

export function getFeeAmount(tipSol: number, premium: boolean = false): number {
  const feeBps = feeBpsForTip(tipSol, premium);
  return (tipSol * feeBps) / 10_000;
}

export function netToCreator(tipSol: number, premium: boolean = false): number {
  const fee = getFeeAmount(tipSol, premium);
  return tipSol - fee;
}

export function getFeeTier(tipSol: number): string {
  if (tipSol < 0.05) return 'Standard (7% fee)';
  if (tipSol < 0.5) return 'Plus (3% fee)';
  return 'Premium (1% fee)';
}