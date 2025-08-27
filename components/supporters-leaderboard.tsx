'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatSol } from '@/lib/utils'
import { Trophy, User, TrendingUp } from 'lucide-react'

interface SupporterData {
  telegramHandle: string
  totalLamports: number
  tipCount: number
}

interface SupportersLeaderboardProps {
  creatorHandle: string
}

export function SupportersLeaderboard({ creatorHandle }: SupportersLeaderboardProps) {
  const [supporters, setSupporters] = useState<SupporterData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSupporters() {
      try {
        // This would be a real API call to get top supporters for the creator
        // For now, using mock data
        const mockSupporters: SupporterData[] = [
          { telegramHandle: '@cryptofan123', totalLamports: 500_000_000, tipCount: 5 },
          { telegramHandle: '@solanadev', totalLamports: 300_000_000, tipCount: 3 },
          { telegramHandle: '@degenape', totalLamports: 200_000_000, tipCount: 2 }
        ]
        
        setSupporters(mockSupporters)
      } catch (error) {
        console.error('Error fetching supporters:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupporters()
  }, [creatorHandle])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Top Supporters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-24 mb-1" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (supporters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Top Supporters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No supporters yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-primary" />
          <span>Top Supporters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {supporters.map((supporter, index) => (
            <div key={supporter.telegramHandle} className="flex items-center space-x-3">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${index === 0 ? 'bg-yellow-500 text-yellow-50' : 
                  index === 1 ? 'bg-gray-400 text-gray-50' :
                  index === 2 ? 'bg-amber-600 text-amber-50' :
                  'bg-muted text-muted-foreground'}
              `}>
                {index < 3 ? (
                  <Trophy className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">{supporter.telegramHandle}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span>{supporter.tipCount} tips</span>
                </div>
              </div>
              
              <Badge variant="secondary" className="font-mono text-xs">
                {formatSol(supporter.totalLamports)} SOL
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}