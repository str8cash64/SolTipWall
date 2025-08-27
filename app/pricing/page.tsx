import { FeesAndPremium } from '@/components/marketing'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="container py-8 border-b">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Pricing & Fees</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. The more you tip, the less we take.
          </p>
        </div>
      </section>

      {/* Fees and Premium - Full Page Version */}
      <div className="flex-1">
        <FeesAndPremium />
      </div>
    </div>
  )
}
