'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Crown, 
  Verified, 
  Copy, 
  Eye, 
  EyeOff, 
  Paperclip,
  ChevronDown,
  Send,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { type Question, cannedReplies } from '@/lib/dashboardMocks';
import { formatSol, netToCreator, getFeeAmount, getFeeTier } from '@/lib/fees';
import { useToast } from '@/components/ui/use-toast';

interface AnswerDrawerProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
}

export function AnswerDrawer({ question, isOpen, onClose, isPremium = false }: AnswerDrawerProps) {
  const [answerText, setAnswerText] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const { toast } = useToast();

  // Reset state when question changes
  useEffect(() => {
    if (question) {
      setAnswerText('');
      setPrivateNote('');
      setIsPreview(false);
    }
  }, [question]);

  if (!question) return null;

  const timeLeft = question.slaHoursLeft;
  const netAmount = netToCreator(question.tipSol, isPremium);
  const feeAmount = getFeeAmount(question.tipSol, isPremium);

  const handleSendAnswer = () => {
    if (!answerText.trim()) {
      toast({
        title: "Answer required",
        description: "Please write an answer before sending.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement send answer API call
    toast({
      title: "Answer sent!",
      description: `Your answer has been sent to ${question.from.handle}.`,
    });
    
    onClose();
  };

  const handleDeclineAndRefund = () => {
    if (!declineReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for declining.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement decline and refund API call
    toast({
      title: "Question declined",
      description: `Refund has been processed for ${question.from.handle}.`,
    });
    
    setIsDeclineDialogOpen(false);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  const insertCannedReply = (content: string) => {
    setAnswerText(content);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-none overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Answer Question</SheetTitle>
              <div className="flex items-center gap-2">
                <Badge variant={timeLeft < 4 ? "destructive" : timeLeft < 12 ? "secondary" : "outline"}>
                  <Clock className="h-3 w-3 mr-1" />
                  {timeLeft > 0 ? `${timeLeft}h left` : `${Math.abs(timeLeft)}h overdue`}
                </Badge>
              </div>
            </div>
            
            {/* Asker Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={question.from.avatarUrl} />
                <AvatarFallback>{question.from.handle[1]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{question.from.handle}</span>
                  {question.from.verified && <Verified className="h-4 w-4 text-blue-500" />}
                  {question.isPremiumAsker && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">{question.category}</Badge>
                  {question.isFirstMessage && (
                    <Badge variant="secondary" className="text-xs">First message</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{formatSol(question.tipSol)}</div>
                <Badge variant="outline" className="text-xs">
                  {getFeeTier(question.tipSol)} fee
                </Badge>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Original Question */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Question
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(question.text)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm whitespace-pre-wrap">{question.text}</p>
              </CardContent>
            </Card>

            {/* Answer Composition */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Your Answer
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          Canned Replies
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        {cannedReplies.map((reply) => (
                          <DropdownMenuItem
                            key={reply.id}
                            onClick={() => insertCannedReply(reply.content)}
                            className="flex-col items-start p-3"
                          >
                            <div className="font-medium text-sm">{reply.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {reply.content}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPreview(!isPreview)}
                      className="gap-2"
                    >
                      {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isPreview ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <AnimatePresence mode="wait">
                  {isPreview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="min-h-[200px] p-3 bg-muted/30 rounded-md border-2 border-dashed"
                    >
                      {answerText ? (
                        <div className="whitespace-pre-wrap text-sm">{answerText}</div>
                      ) : (
                        <div className="text-muted-foreground text-sm">
                          Preview will appear here...
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="editor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Textarea
                        placeholder="Write your answer here... You can use markdown formatting."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="min-h-[200px] resize-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attach File
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    {answerText.length}/2000 characters
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Preview */}
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Fee Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tip amount:</span>
                    <span>{formatSol(question.tipSol)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform fee ({isPremium ? '0%' : getFeeTier(question.tipSol)}):</span>
                    <span>-{formatSol(feeAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>You receive:</span>
                    <span>{formatSol(netAmount)}</span>
                  </div>
                  {isPremium && (
                    <div className="text-xs text-emerald-600 flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Premium: 0% fees applied
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Private Note */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Private Note (not sent to asker)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Textarea
                  placeholder="Add a private note for your records..."
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSendAnswer}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                disabled={!answerText.trim()}
              >
                <Send className="h-4 w-4" />
                Send Answer
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeclineDialogOpen(true)}
                className="gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Decline & Refund
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Decline Dialog */}
      <Dialog open={isDeclineDialogOpen} onOpenChange={setIsDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Question & Process Refund</DialogTitle>
            <DialogDescription>
              This will refund the full tip amount to {question.from.handle} and close the question.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Please provide a brief reason for declining (this will be sent to the asker)..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeclineAndRefund}
              disabled={!declineReason.trim()}
            >
              Decline & Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
