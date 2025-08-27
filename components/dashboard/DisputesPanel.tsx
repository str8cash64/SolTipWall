'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  RefreshCw,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { disputes, type Dispute } from '@/lib/dashboardMocks';
import { formatSol } from '@/lib/fees';
import { useToast } from '@/components/ui/use-toast';

interface DisputeDetails extends Dispute {
  originalQuestion: string;
  originalAnswer: string;
  disputeThread: Array<{
    id: string;
    author: 'user' | 'creator' | 'support';
    message: string;
    timestamp: string;
  }>;
}

export function DisputesPanel() {
  const [selectedDispute, setSelectedDispute] = useState<DisputeDetails | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const { toast } = useToast();

  // Mock detailed dispute data
  const getDisputeDetails = (dispute: Dispute): DisputeDetails => {
    return {
      ...dispute,
      originalQuestion: "What do you think about the new Solana upgrade and its impact on DeFi protocols? I've been hearing mixed opinions and would love your expert take.",
      originalAnswer: "The Solana upgrade brings several improvements to transaction processing and network stability. For DeFi protocols, this means better throughput and reduced congestion during high-volume periods.",
      disputeThread: [
        {
          id: '1',
          author: 'user',
          message: dispute.reason,
          timestamp: dispute.createdAt
        },
        {
          id: '2',
          author: 'support',
          message: "Thank you for bringing this to our attention. We're reviewing the interaction between you and the creator. We'll get back to you within 24 hours with a resolution.",
          timestamp: '2024-01-14T10:30:00Z'
        }
      ]
    };
  };

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(getDisputeDetails(dispute));
    setIsViewDialogOpen(true);
  };

  const handleResolveWithRefund = () => {
    if (!selectedDispute) return;

    // TODO: Implement resolve with refund API call
    toast({
      title: "Dispute resolved",
      description: `Refund processed for ${selectedDispute.from.handle}. The tip has been returned.`,
    });
    
    setIsViewDialogOpen(false);
    setSelectedDispute(null);
    setResolutionNote('');
  };

  const handleKeepAnswer = () => {
    if (!selectedDispute) return;

    // TODO: Implement keep answer API call
    toast({
      title: "Dispute resolved",
      description: "The original answer has been maintained. The dispute has been closed.",
    });
    
    setIsViewDialogOpen(false);
    setSelectedDispute(null);
    setResolutionNote('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'resolved': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Open Disputes
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {disputes.filter(d => d.status === 'open').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Resolved This Month
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {disputes.filter(d => d.status === 'resolved').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Amount in Dispute
                </CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatSol(disputes.filter(d => d.status === 'open').reduce((sum, d) => sum + d.tipSol, 0))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Disputes Table */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              {disputes.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Tip Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell className="font-mono text-sm">
                            #{dispute.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={dispute.from.avatarUrl} />
                                <AvatarFallback>{dispute.from.handle[1]?.toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{dispute.from.handle}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatSol(dispute.tipSol)}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={dispute.reason}>
                              {dispute.reason}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(dispute.status)} className="gap-1">
                              {getStatusIcon(dispute.status)}
                              {dispute.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDispute(dispute)}
                                className="gap-1"
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                              {dispute.status === 'open' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDispute(dispute)}
                                  className="gap-1"
                                >
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No disputes</h3>
                  <p className="text-muted-foreground">
                    You don't have any active disputes. Keep up the great work!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* View/Resolve Dispute Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDispute && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Dispute #{selectedDispute.id}
                </DialogTitle>
                <DialogDescription>
                  Review the dispute details and choose how to resolve it.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Dispute Info */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedDispute.from.avatarUrl} />
                      <AvatarFallback>{selectedDispute.from.handle[1]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{selectedDispute.from.handle}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(selectedDispute.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatSol(selectedDispute.tipSol)}</div>
                    <Badge variant={getStatusColor(selectedDispute.status)}>
                      {selectedDispute.status}
                    </Badge>
                  </div>
                </div>

                {/* Original Question */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Original Question
                  </h4>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded border-l-4 border-blue-500">
                    <p className="text-sm">{selectedDispute.originalQuestion}</p>
                  </div>
                </div>

                {/* Your Answer */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Your Answer</h4>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded border-l-4 border-emerald-500">
                    <p className="text-sm">{selectedDispute.originalAnswer}</p>
                  </div>
                </div>

                <Separator />

                {/* Dispute Thread */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Dispute Conversation</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedDispute.disputeThread.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.author === 'user'
                            ? 'bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500'
                            : message.author === 'creator'
                            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500'
                            : 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-xs">
                            {message.author === 'user' ? 'Asker' : message.author === 'creator' ? 'You' : 'Support'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resolution Note */}
                {selectedDispute.status === 'open' && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Resolution Note (Optional)</h4>
                    <Textarea
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="Add a note about your resolution decision..."
                      className="min-h-[80px]"
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                {selectedDispute.status === 'open' && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={handleResolveWithRefund}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Resolve with Refund
                    </Button>
                    <Button
                      onClick={handleKeepAnswer}
                      className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Keep Answer
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
