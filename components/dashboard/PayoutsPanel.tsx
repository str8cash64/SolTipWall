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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Wallet, 
  Download, 
  Copy, 
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  AlertCircle
} from 'lucide-react';
import { payouts } from '@/lib/dashboardMocks';
import { formatSol } from '@/lib/fees';
import { useToast } from '@/components/ui/use-toast';

export function PayoutsPanel() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [isConnectWalletOpen, setIsConnectWalletOpen] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const { toast } = useToast();

  // Mock wallet data
  const walletData = {
    currentBalance: 4.75,
    pendingBalance: 1.25,
    lifetimeEarnings: 127.83,
    lastPayoutDate: '2024-01-14',
    connectedWallet: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' // Mock address
  };

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0 || amount > walletData.currentBalance) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount within your available balance.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement payout request API call
    toast({
      title: "Payout requested",
      description: `Your payout request for ${formatSol(amount)} has been submitted.`,
    });
    
    setIsRequestDialogOpen(false);
    setPayoutAmount('');
  };

  const handleConnectWallet = () => {
    if (!newWalletAddress.trim()) {
      toast({
        title: "Wallet address required",
        description: "Please enter a valid Solana wallet address.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement wallet connection API call
    toast({
      title: "Wallet updated",
      description: "Your payout wallet has been updated successfully.",
    });
    
    setIsConnectWalletOpen(false);
    setNewWalletAddress('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Address has been copied to your clipboard.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
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
        {/* Wallet Summary */}
        <motion.div variants={item}>
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-500" />
                Wallet Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Balance Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatSol(walletData.currentBalance, 2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Available Balance</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatSol(walletData.pendingBalance, 2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending (T+0)</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatSol(walletData.lifetimeEarnings, 2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Lifetime Earned</div>
                </div>
              </div>

              {/* Connected Wallet */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Connected Wallet</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm">
                      {walletData.connectedWallet.slice(0, 8)}...{walletData.connectedWallet.slice(-8)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(walletData.connectedWallet)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsConnectWalletOpen(true)}
                >
                  Change Wallet
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsRequestDialogOpen(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2"
                  disabled={walletData.currentBalance <= 0}
                >
                  <Download className="h-4 w-4" />
                  Request Payout
                </Button>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Last payout: {new Date(walletData.lastPayoutDate).toLocaleDateString()} • 
                Payouts typically process within 24 hours
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payout History */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          {new Date(payout.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatSol(payout.amountSol, 2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">
                              {payout.tx.slice(0, 8)}...{payout.tx.slice(-8)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(payout.tx)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(payout.status)} className="gap-1">
                            {getStatusIcon(payout.status)}
                            {payout.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Request Payout Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Enter the amount you'd like to withdraw to your connected wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (SOL)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0"
                max={walletData.currentBalance}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="0.000"
              />
              <div className="text-xs text-muted-foreground">
                Available balance: {formatSol(walletData.currentBalance, 3)}
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{payoutAmount ? formatSol(parseFloat(payoutAmount)) : '0 SOL'}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Network fee:</span>
                <span>~0.001 SOL</span>
              </div>
              <div className="border-t border-border mt-2 pt-2 flex justify-between font-medium">
                <span>You'll receive:</span>
                <span>
                  {payoutAmount 
                    ? formatSol(Math.max(0, parseFloat(payoutAmount) - 0.001)) 
                    : '0 SOL'
                  }
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRequestPayout}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!payoutAmount || parseFloat(payoutAmount) <= 0}
            >
              Request Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connect Wallet Dialog */}
      <Dialog open={isConnectWalletOpen} onOpenChange={setIsConnectWalletOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Payout Wallet</DialogTitle>
            <DialogDescription>
              Enter a new Solana wallet address for receiving payouts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
                placeholder="Enter Solana wallet address..."
                className="font-mono"
              />
            </div>
            
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-200">
                    Important
                  </div>
                  <div className="text-yellow-700 dark:text-yellow-300">
                    Make sure you control this wallet address. Payouts sent to incorrect addresses cannot be recovered.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConnectWalletOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConnectWallet}
              disabled={!newWalletAddress.trim()}
            >
              Update Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
