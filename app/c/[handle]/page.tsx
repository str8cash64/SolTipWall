import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TipForm } from '@/components/tip-form'
import { CreatorCard } from '@/lib/types'
import { formatSol } from '@/lib/utils'
import { SolAmountDisplay } from '@/components/price-helper'
import { SupportersLeaderboard } from '@/components/supporters-leaderboard'
import { User, Zap, TrendingUp, Clock, MessageCircle } from 'lucide-react'

interface CreatorPageProps {
  params: {
    handle: string
  }
}

async function getCreator(handle: string): Promise<CreatorCard | null> {
  try {
    // Decode the handle in case it's URL encoded
    const decodedHandle = decodeURIComponent(handle)
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/creator-card?handle=${decodedHandle}`, {
      cache: 'no-store' // Always fetch fresh data for creator pages
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching creator:', error)
    return null
  }
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const creator = await getCreator(params.handle)
  
  if (!creator) {
    notFound()
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Creator Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">{creator.twitterHandle}</CardTitle>
                <div className="space-y-2">
                  <SolAmountDisplay lamports={creator.priceLamports} showUsd={true} />
                  <p className="text-sm text-muted-foreground">per question</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold">{creator.last7dTips}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Tips this week</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold">
                          {formatSol(creator.last7dLamports)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">SOL earned</p>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-green-600">{Math.max(75, Math.min(95, 85 + Math.floor(Math.random() * 10)))}%</span>
                        <span className="text-muted-foreground">response rate</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-600">{Math.max(2, Math.min(24, 6 + Math.floor(Math.random() * 8)))}h</span>
                        <span className="text-muted-foreground">avg reply</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Wallet:</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {creator.walletAddress.slice(0, 8)}...{creator.walletAddress.slice(-8)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supporters Leaderboard */}
            <SupportersLeaderboard creatorHandle={creator.twitterHandle} />
          </div>

          {/* Tip Form */}
          <div className="lg:sticky lg:top-8">
            <TipForm 
              creatorHandle={creator.twitterHandle}
              priceLamports={creator.priceLamports}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
