'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const faqs = [
  {
    question: "How do payouts work?",
    answer: "Creators receive SOL directly to their connected wallet immediately after answering. There's no minimum payout threshold, and all transactions are processed on Solana for fast, low-cost transfers."
  },
  {
    question: "How are answers delivered?",
    answer: "All answers are delivered directly to your Telegram DMs. This ensures a private, spam-free experience and allows for rich formatting, images, and links in responses."
  },
  {
    question: "What if I don't get a response?",
    answer: "While tips are non-refundable, creators build their reputation on response rates. We recommend choosing creators with high response rates and good track records. Most creators respond within their listed timeframe."
  },
  {
    question: "How do you prevent spam?",
    answer: "Our pay-to-ask model naturally filters out spam and low-quality questions. Additionally, creators can set their own tip minimums and have full control over which questions they choose to answer."
  },
  {
    question: "How do I get verified?",
    answer: "Verification is available for established creators with consistent activity and good response rates. Verified creators get a badge, higher visibility, and access to premium features. Apply through your dashboard."
  },
  {
    question: "Are there any tax implications?",
    answer: "Tips received are generally considered taxable income. We provide transaction history for tax reporting, but recommend consulting with a tax professional for specific guidance based on your jurisdiction."
  }
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="border-green-500/20 bg-card/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-200">
        <CardContent className="p-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-green-500/5 transition-colors"
          >
            <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              {isOpen ? (
                <Minus className="h-5 w-5 text-green-500" />
              ) : (
                <Plus className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.div>
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <section id="faq" className="container py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about using TipWall
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={faq.question} faq={faq} index={index} />
        ))}
      </div>

      {/* Link to full FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Button variant="outline" size="lg" className="border-green-500/20 hover:bg-green-500/5">
          View Full FAQ
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </section>
  )
}
