'use client'

import { Badge } from '@/components/ui/badge'
import { Zap, Shield, Clock, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const trustItems = [
  {
    icon: Shield,
    text: "Trusted by Solana creators"
  },
  {
    icon: Zap,
    text: "Instant payouts"
  },
  {
    icon: MessageCircle,
    text: "Spam-free DMs"
  },
  {
    icon: Clock,
    text: "24/7 support"
  }
]

export function TrustBar() {
  return (
    <section className="border-b bg-muted/30">
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2"
            >
              <Badge variant="outline" className="px-3 py-2 border-green-500/20 bg-green-500/5">
                <item.icon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">{item.text}</span>
              </Badge>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Optional: Placeholder for partner logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">Powering creators across the ecosystem</p>
          <div className="flex items-center justify-center space-x-8 opacity-50">
            {/* Placeholder for partner logos */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-8 bg-muted rounded animate-pulse"
                aria-label={`Partner ${i} logo placeholder`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
