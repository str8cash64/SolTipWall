'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, Download, Users } from 'lucide-react'
import { TipsResponse } from '@/lib/types'

interface DashboardHeaderProps {
  tips: TipsResponse
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: 'all' | 'pending' | 'answered'
  onStatusFilterChange: (filter: 'all' | 'pending' | 'answered') => void
  onExportCSV: () => void
}

export function DashboardHeader({ 
  tips, 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  onExportCSV 
}: DashboardHeaderProps) {
  const totalTips = tips.pending.length + tips.answered.length
  const responseRate = totalTips > 0 
    ? Math.round((tips.answered.length / totalTips) * 100)
    : 0

  const avgResponseTime = tips.answered.length > 0
    ? "6h" // Mock average - in real app this would be calculated
    : "N/A"

  return (
    <div className="space-y-6">
      {/* Header with KPIs */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">Manage your paid questions and settings</p>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:w-auto">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{responseRate}%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{avgResponseTime}</div>
              <div className="text-sm text-muted-foreground">Avg Reply Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalTips}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex space-x-1">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusFilterChange('all')}
                  >
                    All ({totalTips})
                  </Button>
                  <Button
                    variant={statusFilter === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusFilterChange('pending')}
                  >
                    Pending ({tips.pending.length})
                  </Button>
                  <Button
                    variant={statusFilter === 'answered' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusFilterChange('answered')}
                  >
                    Answered ({tips.answered.length})
                  </Button>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCSV}
              disabled={totalTips === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
