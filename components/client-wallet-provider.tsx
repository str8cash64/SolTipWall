'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

// Dynamically import the wallet provider to avoid SSR issues
const WalletConnectionProvider = dynamic(
  () => import('@/lib/wallet-context').then(mod => ({ default: mod.WalletConnectionProvider })),
  {
    ssr: false,
    loading: () => null // Don't show loading state for the provider itself
  }
)

interface ClientWalletProviderProps {
  children: ReactNode
}

export function ClientWalletProvider({ children }: ClientWalletProviderProps) {
  return <WalletConnectionProvider>{children}</WalletConnectionProvider>
}
