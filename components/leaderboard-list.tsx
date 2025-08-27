'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LeaderboardItem } from '@/lib/types'
import { formatSol } from '@/lib/utils'
import { Trophy, TrendingUp, User } from 'lucide-react'
import Link from 'next/link'

export function LeaderboardList() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'week' | 'alltime'>('week')

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(`/api/leaderboard?period=${timeFilter}`)
        const data = await response.json()
        setLeaderboard(data.topCreators)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [timeFilter])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">
            Top Creators {timeFilter === 'week' ? 'This Week' : 'All Time'}
          </h2>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={timeFilter === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('week')}
          >
            This Week
          </Button>
          <Button
            variant={timeFilter === 'alltime' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('alltime')}
          >
            All Time
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {leaderboard.map((creator, index) => (
          <Link key={creator.creatorId} href={`/c/${creator.twitterHandle}`}>
            <Card className="transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${index === 0 ? 'bg-yellow-500 text-yellow-50' : 
                        index === 1 ? 'bg-gray-400 text-gray-50' :
                        index === 2 ? 'bg-amber-600 text-amber-50' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      {index < 3 ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{creator.twitterHandle}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1" />
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>{creator.tipCount7d} tips</span>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {formatSol(creator.totalLamports7d)} SOL
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
