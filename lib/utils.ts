import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSol(amount: number): string {
  return `${amount.toLocaleString()} SOL`
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function generateTipId(): string {
  return 'tip_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1000000000 // 1 SOL = 1 billion lamports
}

export function solToLamports(sol: number): number {
  return sol * 1000000000 // 1 SOL = 1 billion lamports
}
