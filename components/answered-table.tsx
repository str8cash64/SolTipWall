'use client'

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TipRow } from '@/lib/types'
import { formatSol } from '@/lib/utils'
import { CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { EmptyState } from './empty-state'

dayjs.extend(relativeTime)

interface AnsweredTableProps {
  tips: TipRow[]
  isLoading: boolean
}

export function AnsweredTable({ tips, isLoading }: AnsweredTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Answered Questions</CardTitle>
          <CardDescription>Questions you've already answered</CardDescription>
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
          <CardTitle>Answered Questions</CardTitle>
          <CardDescription>Questions you've already answered</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={CheckCircle}
            title="No answered questions yet"
            description="Answer questions from your inbox to see them here."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Answered Questions</CardTitle>
        <CardDescription>Questions you've already answered</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tips.map((tip) => (
              <TableRow key={tip.id}>
                <TableCell className="max-w-xs">
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate" title={tip.questionText}>
                      {tip.questionText}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>from {tip.tipperTg}</span>
                      <span>•</span>
                      <span>{dayjs(tip.createdAt).format('MMM D')}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="text-sm truncate" title={tip.answerText}>
                    {tip.answerText}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Sent
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{tip.sentAt ? dayjs(tip.sentAt).fromNow() : 'Just now'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {formatSol(tip.amountLamports)} SOL
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
