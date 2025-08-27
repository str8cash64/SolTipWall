'use client'

import React, { createContext, useContext, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'
import { clusterApiUrl } from '@solana/web3.js'

const WalletContext = createContext<{
  isConnecting: boolean
  connectWallet: (walletName: string) => Promise<void>
  disconnectWallet: () => Promise<void>
  walletAddress: string | null
  isConnected: boolean
}>({
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  walletAddress: null,
  isConnected: false
})

export function useWalletConnection() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWalletConnection must be used within WalletConnectionProvider')
  }
  return context
}

function WalletConnectionInner({ children }: { children: ReactNode }) {
  const { select, connect, disconnect, connecting, connected, publicKey, wallets } = useWallet()

  const connectWallet = async (walletName: string) => {
    try {
      const wallet = wallets.find(w => w.adapter.name === walletName)
      if (wallet) {
        select(wallet.adapter.name)
        await connect()
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const disconnectWallet = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      throw error
    }
  }

  const value = {
    isConnecting: connecting,
    connectWallet,
    disconnectWallet,
    walletAddress: publicKey?.toBase58() || null,
    isConnected: connected
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function WalletConnectionProvider({ children }: { children: ReactNode }) {
  // Use devnet for development, mainnet-beta for production
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletConnectionInner>
          {children}
        </WalletConnectionInner>
      </WalletProvider>
    </ConnectionProvider>
  )
}
