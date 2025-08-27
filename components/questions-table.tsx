'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empty-state'
import { AnswerDialog } from '@/components/answer-dialog'
import { SolAmountDisplay } from '@/components/price-helper'
import { TipRow } from '@/lib/types'
import { formatSol } from '@/lib/utils'
import { MessageSquare, Clock, CheckCircle, User, DollarSign } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface QuestionsTableProps {
  tips: TipRow[]
  isLoading: boolean
  onAnswerSubmit: () => void
  searchQuery: string
  statusFilter: 'all' | 'pending' | 'answered'
  title: string
  description: string
  emptyTitle: string
  emptyDescription: string
}

export function QuestionsTable({ 
  tips, 
  isLoading, 
  onAnswerSubmit, 
  searchQuery,
  statusFilter,
  title,
  description,
  emptyTitle,
  emptyDescription
}: QuestionsTableProps) {
  const [selectedTip, setSelectedTip] = useState<TipRow | null>(null)

  // Filter and search tips
  const filteredTips = useMemo(() => {
    let filtered = tips

    // Apply status filter
    if (statusFilter === 'pending') {
      filtered = filtered.filter(tip => tip.status === 'pending')
    } else if (statusFilter === 'answered') {
      filtered = filtered.filter(tip => tip.status === 'answered')
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tip => 
        tip.questionText.toLowerCase().includes(query) ||
        tip.tipperTg.toLowerCase().includes(query) ||
        (tip.answerText && tip.answerText.toLowerCase().includes(query))
      )
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [tips, searchQuery, statusFilter])

  // Generate avatar from handle
  const getAvatarUrl = (handle: string) => {
    // Using a simple identicon service - in production you might want to use DiceBear or similar
    const seed = handle.replace('@', '')
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=random`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-full" />
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

  if (filteredTips.length === 0) {
    const icon = statusFilter === 'answered' ? CheckCircle : MessageSquare
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={icon}
            title={searchQuery ? "No questions found" : emptyTitle}
            description={searchQuery ? `No questions match "${searchQuery}"` : emptyDescription}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTips.map((tip) => (
                <TableRow key={tip.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={getAvatarUrl(tip.tipperTg)}
                        alt={tip.tipperTg}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-sm">{tip.tipperTg}</p>
                        <Badge variant="outline" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="space-y-1">
                      <p className="text-sm truncate" title={tip.questionText}>
                        {tip.questionText}
                      </p>
                      {tip.answerText && tip.status === 'answered' && (
                        <p className="text-xs text-muted-foreground truncate" title={tip.answerText}>
                          Answer: {tip.answerText}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <SolAmountDisplay lamports={tip.amountLamports} showUsd={false} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{dayjs(tip.createdAt).fromNow()}</span>
                    </div>
                    {tip.sentAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Answered {dayjs(tip.sentAt).fromNow()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={tip.status === 'answered' ? 'default' : 'destructive'}
                      className="capitalize"
                    >
                      {tip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {tip.status === 'pending' ? (
                      <Button
                        size="sm"
                        onClick={() => setSelectedTip(tip)}
                      >
                        Answer
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        ✓ Sent
                      </Badge>
                    )}
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
