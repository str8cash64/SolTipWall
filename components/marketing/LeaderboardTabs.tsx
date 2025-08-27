'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, ArrowRight, Coins } from 'lucide-react'
import { motion } from 'framer-motion'
import { mockLeaderboardWeek, mockLeaderboardAll, type MockLeaderboardItem } from '@/lib/mocks'
import Image from 'next/image'

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }
}

function LeaderboardRow({ item, index }: { item: MockLeaderboardItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex items-center justify-between p-4 rounded-lg border border-green-500/10 bg-card/50 hover:border-green-500/20 hover:bg-green-500/5 transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        {/* Rank */}
        <div className="flex items-center justify-center w-10 h-10">
          {getRankIcon(item.rank)}
        </div>
        
        {/* Creator Info */}
        <div className="flex items-center space-x-3">
          <Image
            src={item.avatarUrl}
            alt={item.handle}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h4 className="font-semibold">{item.handle}</h4>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <span>{item.tips} tips</span>
              <div className="flex items-center">
                <Coins className="h-3 w-3 mr-1" />
                {item.totalSol.toFixed(1)} SOL
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action */}
      <Button variant="outline" size="sm" className="border-green-500/20 hover:bg-green-500/5">
        Ask
      </Button>
    </motion.div>
  )
}

export function LeaderboardTabs() {
  return (
    <section className="container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Creator Leaderboard</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See who's leading the pack in creator engagement and earnings
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-green-500/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockLeaderboardWeek.items.map((item, index) => (
                      <LeaderboardRow key={item.handle} item={item} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-green-500/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockLeaderboardAll.items.map((item, index) => (
                      <LeaderboardRow key={item.handle} item={item} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* View Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button variant="outline" size="lg" className="border-green-500/20 hover:bg-green-500/5">
            View Full Leaderboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
