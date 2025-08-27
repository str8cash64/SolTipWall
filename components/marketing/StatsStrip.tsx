'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, Coins, Clock, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { mockStats } from '@/lib/mocks'

interface AnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
}

function AnimatedNumber({ value, duration = 2000, decimals = 0 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = easeOutCubic * value
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])

  return (
    <span>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue).toLocaleString()}
    </span>
  )
}

const stats = [
  {
    icon: Users,
    label: "Active Creators",
    value: mockStats.creatorsThisWeek,
    suffix: "",
    color: "text-blue-500"
  },
  {
    icon: Coins,
    label: "Tips This Week",
    value: mockStats.tipsThisWeekSol,
    suffix: " SOL",
    decimals: 1,
    color: "text-green-500"
  },
  {
    icon: Clock,
    label: "Avg Response Time",
    value: mockStats.avgReplyHrs,
    suffix: " hours",
    color: "text-orange-500"
  },
  {
    icon: MessageSquare,
    label: "Questions Answered",
    value: mockStats.answersCount,
    suffix: "",
    color: "text-purple-500"
  }
]

export function StatsStrip() {
  return (
    <section className="container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl font-bold mb-4">Platform Stats</h2>
        <p className="text-muted-foreground">Live metrics from our growing community</p>
      </motion.div>

      <div className="relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-xl" />
        
        <Card className="relative bg-card/50 backdrop-blur-sm border-green-500/20 shadow-xl">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center space-y-3"
                >
                  <div className={`inline-flex p-3 rounded-full bg-muted/50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-bold">
                      <AnimatedNumber 
                        value={stat.value} 
                        decimals={stat.decimals || 0}
                      />
                      <span className="text-lg text-muted-foreground">{stat.suffix}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
