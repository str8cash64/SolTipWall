'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InboxTable } from './inbox-table'
import { AnsweredTable } from './answered-table'
import { EnhancedSettingsForm } from './enhanced-settings-form'
import { DashboardHeader } from './dashboard-header'
import { QuestionsTable } from './questions-table'
import { Badge } from '@/components/ui/badge'
import { TipsResponse, TipRow } from '@/lib/types'

export function DashboardTabs() {
  const [tips, setTips] = useState<TipsResponse>({ pending: [], answered: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'answered'>('all')

  const fetchTips = async () => {
    try {
      const response = await fetch('/api/creator/tips')
      const data = await response.json()
      setTips(data)
    } catch (error) {
      console.error('Error fetching tips:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTips()
  }, [])

  const handleAnswerSubmit = () => {
    // Refresh tips after answering
    fetchTips()
  }

  const exportToCSV = () => {
    const allTips = [...tips.pending, ...tips.answered]
    const csvContent = [
      ['Date', 'From', 'Amount (SOL)', 'Question', 'Answer', 'Status'],
      ...allTips.map(tip => [
        new Date(tip.createdAt).toLocaleDateString(),
        tip.tipperTg,
        (tip.amountLamports / 1_000_000_000).toFixed(3),
        tip.questionText,
        tip.answerText || '',
        tip.status
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `tipwall-questions-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const allTips = [...tips.pending, ...tips.answered]

  return (
    <div className="space-y-6">
      <DashboardHeader
        tips={tips}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExportCSV={exportToCSV}
      />

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inbox" className="relative">
            Inbox
            {tips.pending.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {tips.pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="answered">
            Answered
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {tips.answered.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="questions">All</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <QuestionsTable
            tips={tips.pending}
            isLoading={isLoading}
            onAnswerSubmit={handleAnswerSubmit}
            searchQuery={searchQuery}
            statusFilter="pending"
            title="Pending Questions"
            description="Questions waiting for your response"
            emptyTitle="No pending questions"
            emptyDescription="All caught up! New questions will appear here."
          />
        </TabsContent>

        <TabsContent value="answered">
          <QuestionsTable
            tips={tips.answered}
            isLoading={isLoading}
            onAnswerSubmit={handleAnswerSubmit}
            searchQuery={searchQuery}
            statusFilter="answered"
            title="Answered Questions"
            description="Archive of your responses with timestamps"
            emptyTitle="No answered questions yet"
            emptyDescription="Questions you answer will appear here for reference."
          />
        </TabsContent>

        <TabsContent value="questions">
          <QuestionsTable
            tips={allTips}
            isLoading={isLoading}
            onAnswerSubmit={handleAnswerSubmit}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            title="All Questions"
            description="Complete overview of all your questions"
            emptyTitle="No questions yet"
            emptyDescription="Share your link to start receiving paid questions."
          />
        </TabsContent>

        <TabsContent value="settings">
          <EnhancedSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
