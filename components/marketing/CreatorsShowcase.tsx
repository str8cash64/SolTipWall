'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, Clock, Coins, ArrowRight, Verified, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { mockCreators, creatorCategories, calculateFee, type MockCreator } from '@/lib/mocks'
import Image from 'next/image'

function CreatorCard({ creator }: { creator: MockCreator }) {
  const [tipAmount, setTipAmount] = useState(creator.tipFromSol)
  const { feePercent, netAmount } = calculateFee(tipAmount)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <Card className="h-full border-green-500/20 bg-card/50 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
        <CardContent className="p-6 space-y-4">
          {/* Creator Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={creator.avatarUrl}
                  alt={creator.handle}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                {creator.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Verified className="h-3 w-3 text-white" fill="currentColor" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{creator.handle}</h3>
                <div className="flex items-center space-x-2">
                  {creator.categories.slice(0, 2).map((category) => (
                    <Badge key={category} variant="outline" className="text-xs border-green-500/20 text-green-400">
                      {category}
                    </Badge>
                  ))}
                  {creator.isNew && (
                    <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/20">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Coins className="h-4 w-4 mr-1" />
                From {creator.tipFromSol.toFixed(3)} SOL
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {creator.avgReplyHrs}hr avg response
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Last 7d:</span>
                <div className="font-semibold text-green-400">{creator.tips7d} tips</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Response rate:</span>
                <div className="font-semibold">{creator.responseRate}%</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:shadow-lg transition-all duration-300">
                Ask & Tip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Image
                    src={creator.avatarUrl}
                    alt={creator.handle}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>Tip {creator.handle}</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Tip Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Tip Amount</label>
                    <span className="text-sm text-muted-foreground">{tipAmount.toFixed(3)} SOL</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.005"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.01 SOL</span>
                    <span>0.5 SOL</span>
                  </div>
                </div>
                
                {/* Fee Breakdown */}
                <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>You pay:</span>
                    <span className="font-medium">{tipAmount.toFixed(3)} SOL</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform fee ({feePercent}%):</span>
                    <span>-{(tipAmount - netAmount).toFixed(3)} SOL</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-green-400 border-t border-border pt-2">
                    <span>Creator receives:</span>
                    <span>{netAmount.toFixed(3)} SOL</span>
                  </div>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled>
                  Connect Wallet to Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Demo preview • Sign in to tip creators
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function CreatorsShowcase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredCreators = mockCreators.filter(creator => {
    const matchesSearch = creator.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || creator.categories.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  return (
    <section id="creators" className="container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Featured Creators</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with Solana's most knowledgeable creators and get expert insights
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="space-y-6 mb-12"
      >
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by @handle or niche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-green-500/20 focus:border-green-500/40"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {creatorCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-green-600 hover:bg-green-700" 
                : "border-green-500/20 hover:bg-green-500/5"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Creators Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCreators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>

      {/* View More */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Button variant="outline" size="lg" className="border-green-500/20 hover:bg-green-500/5">
          View All Creators
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </section>
  )
}
