'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Coins, TrendingDown, ArrowRight, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { feeStructure } from '@/lib/mocks'

export function FeesAndPremium() {
  return (
    <section id="pricing" className="container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Simple, Fair Pricing</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The more you tip, the less we take. Premium creators get even better rates.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Fee Structure */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="h-full border-green-500/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-green-500" />
                <span>Fee Structure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {feeStructure.map((tier, index) => (
                  <motion.div
                    key={tier.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 rounded-lg border border-green-500/10 bg-green-500/5"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold">{tier.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {tier.feePercent === 7 ? "Small tips" : 
                         tier.feePercent === 3 ? "Medium tips" : "Large tips"}
                      </div>
                    </div>
                    <Badge 
                      className={`${tier.feePercent === 1 ? 'bg-green-500/20 text-green-400' : 
                                    tier.feePercent === 3 ? 'bg-yellow-500/20 text-yellow-400' : 
                                    'bg-red-500/20 text-red-400'} border-0`}
                    >
                      {tier.feePercent}% fee
                    </Badge>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  <strong className="text-green-400">The bigger the tip, the smaller the fee.</strong>
                  <br />
                  Encouraging meaningful interactions with fair pricing.
                </p>
              </div>

              {/* Example Calculations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Example Calculations:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                    <span>0.01 SOL tip:</span>
                    <span className="text-muted-foreground">Creator gets 0.0093 SOL</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                    <span>0.1 SOL tip:</span>
                    <span className="text-muted-foreground">Creator gets 0.097 SOL</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                    <span>1.0 SOL tip:</span>
                    <span className="text-green-400 font-medium">Creator gets 0.99 SOL</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Premium Creator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="h-full border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 backdrop-blur-sm relative overflow-hidden">
            {/* Premium glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 blur-xl" />
            
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span>Premium Creator</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                  Best Value
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold">
                  <span className="text-2xl text-muted-foreground">$</span>
                  <span>10-50</span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full">
                  <Coins className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-semibold">0% fees on all tips</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Premium Benefits:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>Zero platform fees on all tips</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>Premium badge on your profile</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold">
                Become Premium
                <Crown className="ml-2 h-4 w-4" />
              </Button>

              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-center text-muted-foreground">
                  <strong className="text-yellow-400">ROI Calculator:</strong> If you earn $500+ per month, 
                  Premium pays for itself. Save hundreds on fees.
                </p>
              </div>

              {/* Savings Example */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold">Monthly Savings Example:</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Earnings: $1000/month</span>
                    <span className="text-muted-foreground">Standard fees: ~$30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium cost: $25</span>
                    <span className="text-green-400 font-medium">You save: $5+</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
          <HelpCircle className="h-4 w-4" />
          <span>All fees are clearly shown before any transaction</span>
        </div>
      </motion.div>
    </section>
  )
}
