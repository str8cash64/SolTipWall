// Tiered fee calculation utilities

export function getFeePercent(tipSol: number): number {
  if (tipSol < 0.05) return 0.07; // 7% for tips under 0.05 SOL
  if (tipSol < 0.5) return 0.03;  // 3% for tips 0.05-0.5 SOL
  return 0.01;                    // 1% for tips over 0.5 SOL
}

export function netToCreator(tipSol: number, isPremium: boolean = false): number {
  if (isPremium) return tipSol; // Premium creators get 0% fees
  
  const feePercent = getFeePercent(tipSol);
  return tipSol * (1 - feePercent);
}

export function getFeeAmount(tipSol: number, isPremium: boolean = false): number {
  if (isPremium) return 0;
  
  const feePercent = getFeePercent(tipSol);
  return tipSol * feePercent;
}

export function getFeeTier(tipSol: number): '7%' | '3%' | '1%' {
  const feePercent = getFeePercent(tipSol);
  if (feePercent === 0.07) return '7%';
  if (feePercent === 0.03) return '3%';
  return '1%';
}

export function formatSol(amount: number, decimals: number = 3): string {
  return `${amount.toFixed(decimals)} SOL`;
}

export function formatFeeTier(tipSol: number): string {
  const tier = getFeeTier(tipSol);
  return `${tier} fee`;
}
