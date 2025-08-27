'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TipRow } from '@/lib/types'
import { formatSol } from '@/lib/utils'
import { MessageSquare, Clock, DollarSign } from 'lucide-react'
import { AnswerDialog } from './answer-dialog'
import { EmptyState } from './empty-state'

dayjs.extend(relativeTime)

interface InboxTableProps {
  tips: TipRow[]
  isLoading: boolean
  onAnswerSubmit: () => void
}

export function InboxTable({ tips, isLoading, onAnswerSubmit }: InboxTableProps) {
  const [selectedTip, setSelectedTip] = useState<TipRow | null>(null)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Pending questions from your followers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                  <div className="h-8 w-20 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tips.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Pending questions from your followers</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={MessageSquare}
            title="No paid questions yet"
            description="Share your link to get started."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Pending questions from your followers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tips.map((tip) => (
                <TableRow key={tip.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{dayjs(tip.createdAt).fromNow()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{tip.tipperTg}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-primary" />
                      <span className="font-mono text-sm">
                        {formatSol(tip.amountLamports)} SOL
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm truncate" title={tip.questionText}>
                      {tip.questionText}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => setSelectedTip(tip)}
                    >
                      Answer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AnswerDialog
        tip={selectedTip}
        open={!!selectedTip}
        onOpenChange={(open) => !open && setSelectedTip(null)}
        onSubmit={onAnswerSubmit}
      />
    </>
  )
}
