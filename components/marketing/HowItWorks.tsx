'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Coins, MessageCircle, Send } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: 1,
    icon: Coins,
    title: "Pay & Ask",
    description: "Select a creator, tip them, and ask your question. Higher tips get faster responses."
  },
  {
    number: 2,
    icon: MessageCircle,
    title: "Get Answered",
    description: "Creator sees your question and crafts a personalized, detailed response just for you."
  },
  {
    number: 3,
    icon: Send,
    title: "Delivered on Telegram",
    description: "Receive the answer directly in your Telegram DMs. No spam, just valuable insights."
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get personalized answers from Solana's top creators in three simple steps
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting lines for desktop */}
        <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-px bg-gradient-to-r from-green-500/20 via-green-500/40 to-green-500/20 -translate-y-1/2 z-0" />
        
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <Card className="h-full border-green-500/20 bg-card/50 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10">
              <CardContent className="p-8 text-center space-y-6">
                {/* Step number and icon */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-green-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-green-500">{step.number}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Mobile connecting dots */}
            {index < steps.length - 1 && (
              <div className="md:hidden flex justify-center py-4">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500/40 to-green-500/20 rounded-full" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Additional context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-12 p-6 bg-green-500/5 rounded-2xl border border-green-500/20"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-green-400">Pro tip:</span> Higher tips often result in more detailed responses and faster reply times. 
          Most creators respond within their listed average time.
        </p>
      </motion.div>
    </section>
  )
}
