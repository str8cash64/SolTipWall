'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'

interface PriceHelperProps {
  solAmount: number
  className?: string
}

export function PriceHelper({ solAmount, className = "" }: PriceHelperProps) {
  const [usdPrice, setUsdPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        // Using Jupiter API for SOL price (free and reliable)
        const response = await fetch('https://price.jup.ag/v4/price?ids=So11111111111111111111111111111111111111112')
        const data = await response.json()
        
        if (data.data && data.data['So11111111111111111111111111111111111111112']) {
          const solPriceUsd = data.data['So11111111111111111111111111111111111111112'].price
          setUsdPrice(solAmount * solPriceUsd)
        }
      } catch (error) {
        console.error('Failed to fetch SOL price:', error)
        // Fallback to approximate price if API fails
        setUsdPrice(solAmount * 180) // Approximate fallback
      } finally {
        setIsLoading(false)
      }
    }

    fetchSolPrice()
  }, [solAmount])

  if (isLoading) {
    return (
      <span className={`text-muted-foreground text-sm ${className}`}>
        (~loading USD)
      </span>
    )
  }

  if (!usdPrice) {
    return null
  }

  return (
    <span className={`text-muted-foreground text-sm flex items-center ${className}`}>
      <DollarSign className="w-3 h-3 mr-1" />
      (~${usdPrice.toFixed(2)} USD)
    </span>
  )
}

interface SolAmountDisplayProps {
  lamports: number
  showUsd?: boolean
  className?: string
}

export function SolAmountDisplay({ lamports, showUsd = true, className = "" }: SolAmountDisplayProps) {
  const solAmount = lamports / 1_000_000_000 // Convert lamports to SOL

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <span className="text-2xl">◎</span> {/* SOL logo */}
        <span className="font-mono">{solAmount.toFixed(3)} SOL</span>
      </div>
      {showUsd && <PriceHelper solAmount={solAmount} />}
    </div>
  )
}
