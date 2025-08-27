'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useWalletConnection } from '@/lib/wallet-context'
import { Loader2, Wallet, CheckCircle } from 'lucide-react'

interface WalletConnectProps {
  onWalletConnected: (address: string) => void
  currentAddress?: string
}

export function WalletConnect({ onWalletConnected, currentAddress }: WalletConnectProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Safely access wallet context only on client
  let connectWallet, disconnectWallet, isConnecting, isConnected, walletAddress
  try {
    const walletContext = useWalletConnection()
    connectWallet = walletContext.connectWallet
    disconnectWallet = walletContext.disconnectWallet
    isConnecting = walletContext.isConnecting
    isConnected = walletContext.isConnected
    walletAddress = walletContext.walletAddress
  } catch (error) {
    // Wallet context not available - provide fallbacks
    connectWallet = async () => {
      toast({
        variant: "destructive",
        title: "Wallet not available",
        description: "Please refresh the page and try again."
      })
    }
    disconnectWallet = async () => {}
    isConnecting = false
    isConnected = false
    walletAddress = null
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Wallet className="w-8 h-8 mx-auto text-primary" />
          <h3 className="font-semibold">Connect Your Wallet</h3>
          <p className="text-sm text-muted-foreground">Loading wallet options...</p>
        </div>
      </div>
    )
  }

  const walletOptions = [
    {
      name: 'Phantom',
      icon: '👻',
      description: 'Most popular Solana wallet',
      adapterName: 'Phantom'
    },
    {
      name: 'Backpack',
      icon: '🎒', 
      description: 'Multi-chain wallet by Mad Lads',
      adapterName: 'Backpack'
    }
  ]

  const handleConnect = async (walletName: string) => {
    setSelectedWallet(walletName)
    try {
      await connectWallet(walletName)
      if (walletAddress) {
        onWalletConnected(walletAddress)
        toast({
          title: "Wallet connected!",
          description: `Successfully connected ${walletName} wallet.`
        })
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: `Failed to connect ${walletName}. Please try again.`
      })
    } finally {
      setSelectedWallet(null)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected."
      })
    } catch (error) {
      console.error('Wallet disconnection failed:', error)
    }
  }

  if (isConnected && walletAddress) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Wallet Connected</p>
                <p className="text-sm text-green-700 font-mono">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisconnect}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <Wallet className="w-8 h-8 mx-auto text-primary" />
        <h3 className="font-semibold">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Choose a wallet to connect and receive payments
        </p>
      </div>
      
      <div className="grid gap-3">
        {walletOptions.map((wallet) => (
          <Button
            key={wallet.name}
            variant="outline"
            className="h-auto p-4 justify-start"
            onClick={() => handleConnect(wallet.adapterName)}
            disabled={isConnecting}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{wallet.icon}</span>
              <div className="text-left">
                <p className="font-medium">{wallet.name}</p>
                <p className="text-xs text-muted-foreground">{wallet.description}</p>
              </div>
              {isConnecting && selectedWallet === wallet.adapterName && (
                <Loader2 className="w-4 h-4 animate-spin ml-auto" />
              )}
            </div>
          </Button>
        ))}
      </div>

      {currentAddress && (
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Or continue with manual entry: {currentAddress.slice(0, 8)}...{currentAddress.slice(-8)}
          </p>
        </div>
      )}
    </div>
  )
}
