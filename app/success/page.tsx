'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, MessageCircle, ExternalLink, Copy, Clock } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Reference code copied to clipboard"
    })
  }

  if (!mounted) {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
                <div className="h-6 bg-muted rounded w-32 mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-48 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const ref = searchParams?.get('ref')
  const tipId = searchParams?.get('tipId')
  const creatorHandle = searchParams?.get('creator')

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-green-500">Payment Received!</CardTitle>
            <CardDescription>
              Your question has been sent to the creator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {ref && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reference</p>
                    <p className="font-mono text-sm">{ref}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(ref)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-medium">What happens next:</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Open @YourTipWallBot on Telegram and press Start</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <span>You'll receive the answer here soon</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => window.open('https://t.me/YourTipWallBot', '_blank')}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Open Telegram
              </Button>
              
              {creatorHandle && (
                <Link href={`/c/${creatorHandle}`} className="block">
                  <Button variant="outline" className="w-full">
                    While you wait, check out more tips for @{creatorHandle}
                  </Button>
                </Link>
              )}
              
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium text-blue-600">Estimated reply time: 12h</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Most questions answered within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
                <div className="h-6 bg-muted rounded w-32 mx-auto mb-2" />
                <div className="h-4 bg-muted rounded w-48 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
