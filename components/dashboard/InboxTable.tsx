'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  MoreVertical, 
  Eye, 
  Clock, 
  Ban, 
  RefreshCw,
  Verified,
  AlertTriangle,
  Crown
} from 'lucide-react';
import { questions, type Question } from '@/lib/dashboardMocks';
import { formatSol, getFeeTier } from '@/lib/fees';
import { BulkActionsBar } from './BulkActionsBar';

interface InboxTableProps {
  onAnswerClick: (question: Question) => void;
  searchQuery: string;
  selectedStatus: string;
  selectedCategories: string[];
  showPremiumOnly: boolean;
}

export function InboxTable({ 
  onAnswerClick, 
  searchQuery, 
  selectedStatus, 
  selectedCategories,
  showPremiumOnly 
}: InboxTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!question.from.handle.toLowerCase().includes(query) && 
            !question.text.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'All' && question.status !== selectedStatus.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(question.category)) {
        return false;
      }

      // Premium filter
      if (showPremiumOnly && !question.isPremiumAsker) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedStatus, selectedCategories, showPremiumOnly]);

  const toggleRowSelection = (questionId: string) => {
    setSelectedRows(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev => 
      prev.length === filteredQuestions.length ? [] : filteredQuestions.map(q => q.id)
    );
  };

  const getTimeLeft = (hoursLeft: number) => {
    if (hoursLeft < 0) {
      return { text: `${Math.abs(hoursLeft)}h overdue`, color: 'destructive' as const };
    } else if (hoursLeft < 4) {
      return { text: `${hoursLeft}h left`, color: 'destructive' as const };
    } else if (hoursLeft < 12) {
      return { text: `${hoursLeft}h left`, color: 'secondary' as const };
    } else {
      return { text: `${hoursLeft}h left`, color: 'outline' as const };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'snoozed': return 'secondary';
      case 'flagged': return 'destructive';
      default: return 'outline';
    }
  };

  // Mobile Card Component
  const MobileQuestionCard = ({ question }: { question: Question }) => {
    const timeLeft = getTimeLeft(question.slaHoursLeft);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg border p-4 space-y-3"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={question.from.avatarUrl} />
              <AvatarFallback>{question.from.handle[1]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">{question.from.handle}</span>
                {question.from.verified && <Verified className="h-3 w-3 text-blue-500" />}
                {question.isPremiumAsker && <Crown className="h-3 w-3 text-yellow-500" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant={getStatusColor(question.status)} className="text-xs">
                  {question.status}
                </Badge>
                <span>{question.category}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-medium text-sm">{formatSol(question.tipSol)}</div>
            <Badge variant="outline" className="text-xs">
              {getFeeTier(question.tipSol)} fee
            </Badge>
          </div>
        </div>

        {/* Question */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {question.text}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={timeLeft.color} className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {timeLeft.text}
            </Badge>
            {question.isFirstMessage && (
              <Badge variant="outline" className="text-xs">First message</Badge>
            )}
          </div>
          
          <Button 
            size="sm" 
            onClick={() => onAnswerClick(question)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Answer
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <BulkActionsBar 
            selectedCount={selectedRows.length}
            onClearSelection={() => setSelectedRows([])}
          />
        )}
      </AnimatePresence>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === filteredQuestions.length && filteredQuestions.length > 0}
                    onCheckedChange={toggleAllRows}
                  />
                </TableHead>
                <TableHead>From</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredQuestions.map((question) => {
                  const timeLeft = getTimeLeft(question.slaHoursLeft);
                  
                  return (
                    <motion.tr
                      key={question.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleRowSelection(question.id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(question.id)}
                          onCheckedChange={() => toggleRowSelection(question.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={question.from.avatarUrl} />
                            <AvatarFallback>{question.from.handle[1]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{question.from.handle}</span>
                              {question.from.verified && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Verified className="h-4 w-4 text-blue-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Verified account</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {question.isPremiumAsker && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Crown className="h-4 w-4 text-yellow-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Premium member</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            {question.isFirstMessage && (
                              <Badge variant="outline" className="text-xs mt-1">
                                First message
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="truncate">{question.text}</p>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md">
                              <p className="whitespace-pre-wrap">{question.text}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatSol(question.tipSol)}</div>
                          <Badge variant="outline" className="text-xs">
                            {getFeeTier(question.tipSol)} fee
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={timeLeft.color} className="gap-1">
                          <Clock className="h-3 w-3" />
                          {timeLeft.text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(question.status)}>
                          {question.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            onClick={() => onAnswerClick(question)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Answer
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Snooze 12h
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Refund
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Ban className="h-4 w-4 mr-2" />
                                Block User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {filteredQuestions.map((question) => (
            <MobileQuestionCard key={question.id} question={question} />
          ))}
        </AnimatePresence>
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No questions match your current filters.
          </div>
        </div>
      )}
    </div>
  );
}
