import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatSol } from '@/lib/utils'
import { CreatorCard as CreatorCardType } from '@/lib/types'
import { User, Zap } from 'lucide-react'

interface CreatorCardProps {
  creator: CreatorCardType
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Link href={`/c/${creator.twitterHandle}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{creator.twitterHandle}</CardTitle>
              <CardDescription className="text-xs">
                {formatSol(creator.priceLamports)} SOL per question
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last 7 days</span>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-primary" />
                <span className="font-medium">{creator.last7dTips} tips</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Earned</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {formatSol(creator.last7dLamports)} SOL
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
