// Comprehensive mock data for the Creator Dashboard

export interface Question {
  id: string;
  from: {
    handle: string;
    avatarUrl: string;
    verified: boolean;
  };
  text: string;
  tipSol: number;
  createdAt: string;
  status: 'pending' | 'snoozed' | 'flagged';
  category: 'DeFi' | 'Trading' | 'Artists' | 'Memes' | 'Founders' | 'NFTs' | 'Gaming';
  slaHoursLeft: number;
  isFirstMessage?: boolean;
  isPremiumAsker?: boolean;
}

export interface AnsweredQuestion {
  id: string;
  from: {
    handle: string;
    avatarUrl: string;
    verified: boolean;
  };
  text: string;
  tipSol: number;
  answeredAt: string;
  rating?: number; // 1-5 stars
  answerText: string;
  category: 'DeFi' | 'Trading' | 'Artists' | 'Memes' | 'Founders' | 'NFTs' | 'Gaming';
}

export interface Dispute {
  id: string;
  from: {
    handle: string;
    avatarUrl: string;
  };
  tipSol: number;
  reason: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface Payout {
  id: string;
  date: string;
  amountSol: number;
  tx: string;
  status: 'sent' | 'pending' | 'failed';
}

export interface DashboardStats {
  responseRatePct: number;
  avgReplyHrs: number;
  pendingCount: number;
  earnings7dSol: number;
}

export interface TipTimeseries {
  date: string;
  sol: number;
}

export interface TipTierBreakdown {
  smallPct: number; // <0.05 SOL (7% fee)
  mediumPct: number; // 0.05-0.5 SOL (3% fee) 
  largePct: number; // >0.5 SOL (1% fee)
}

export interface TopTipper {
  handle: string;
  count: number;
  totalSol: number;
  lastAt: string;
}

// Mock data
export const questions: Question[] = [
  {
    id: 'q1',
    from: {
      handle: '@crypto_enthusiast',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      verified: true
    },
    text: 'What do you think about the new Solana upgrade and its impact on DeFi protocols? I\'ve been hearing mixed opinions.',
    tipSol: 0.1,
    createdAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    category: 'DeFi',
    slaHoursLeft: 18,
    isFirstMessage: true,
    isPremiumAsker: false
  },
  {
    id: 'q2',
    from: {
      handle: '@defi_trader',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      verified: false
    },
    text: 'Best strategy for yield farming on Jupiter right now? Looking for something with moderate risk.',
    tipSol: 0.25,
    createdAt: '2024-01-15T08:15:00Z',
    status: 'pending',
    category: 'DeFi',
    slaHoursLeft: 8,
    isFirstMessage: false,
    isPremiumAsker: true
  },
  {
    id: 'q3',
    from: {
      handle: '@nft_collector',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      verified: true
    },
    text: 'Thoughts on the current NFT market? Are we in for another bull run or is this just a dead cat bounce?',
    tipSol: 0.05,
    createdAt: '2024-01-15T06:45:00Z',
    status: 'snoozed',
    category: 'NFTs',
    slaHoursLeft: 2,
    isFirstMessage: true,
    isPremiumAsker: false
  },
  {
    id: 'q4',
    from: {
      handle: '@meme_lord',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face',
      verified: false
    },
    text: 'Which meme coins have the best fundamentals right now? I know that sounds like an oxymoron lol',
    tipSol: 0.02,
    createdAt: '2024-01-15T04:20:00Z',
    status: 'flagged',
    category: 'Memes',
    slaHoursLeft: -2, // Overdue
    isFirstMessage: false,
    isPremiumAsker: false
  },
  {
    id: 'q5',
    from: {
      handle: '@startup_founder',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face',
      verified: true
    },
    text: 'How do you see Web3 gaming evolving in 2024? Any specific projects you\'re bullish on?',
    tipSol: 0.8,
    createdAt: '2024-01-15T02:10:00Z',
    status: 'pending',
    category: 'Gaming',
    slaHoursLeft: 12,
    isFirstMessage: true,
    isPremiumAsker: true
  }
];

export const answered: AnsweredQuestion[] = [
  {
    id: 'a1',
    from: {
      handle: '@whale_watcher',
      avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=32&h=32&fit=crop&crop=face',
      verified: true
    },
    text: 'What\'s your take on the recent whale movements in SOL? Seeing some unusual patterns.',
    tipSol: 0.15,
    answeredAt: '2024-01-14T16:30:00Z',
    rating: 5,
    answerText: 'Great question! The whale movements you\'re seeing are likely related to the upcoming governance vote...',
    category: 'Trading'
  },
  {
    id: 'a2',
    from: {
      handle: '@artist_collective',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      verified: false
    },
    text: 'Best platforms for launching an NFT collection on Solana? Magic Eden vs others?',
    tipSol: 0.3,
    answeredAt: '2024-01-14T14:15:00Z',
    rating: 4,
    answerText: 'For launching NFT collections, I\'d recommend starting with Magic Eden for their reach...',
    category: 'Artists'
  },
  {
    id: 'a3',
    from: {
      handle: '@protocol_dev',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      verified: true
    },
    text: 'Security considerations when building on Solana? Any common pitfalls?',
    tipSol: 0.6,
    answeredAt: '2024-01-14T11:45:00Z',
    rating: 5,
    answerText: 'Security is paramount when building on Solana. Here are the key considerations...',
    category: 'Founders'
  }
];

export const disputes: Dispute[] = [
  {
    id: 'd1',
    from: {
      handle: '@unhappy_user',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    tipSol: 0.1,
    reason: 'Answer was too generic and didn\'t address my specific question',
    status: 'open',
    createdAt: '2024-01-14T09:30:00Z'
  },
  {
    id: 'd2',
    from: {
      handle: '@confused_trader',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    tipSol: 0.05,
    reason: 'Answer contained outdated information',
    status: 'resolved',
    createdAt: '2024-01-13T15:20:00Z'
  }
];

export const payouts: Payout[] = [
  {
    id: 'p1',
    date: '2024-01-14',
    amountSol: 2.45,
    tx: '5KJp7KqprzM8eJvqKQN7Rj9xVw2BcTq1nP8mF3sD9aL4',
    status: 'sent'
  },
  {
    id: 'p2',
    date: '2024-01-13',
    amountSol: 1.8,
    tx: '3Hp9KmR8xQw7NvPqS2cF6jT1bL9eM5nD4aK8sW7rG2pY',
    status: 'sent'
  },
  {
    id: 'p3',
    date: '2024-01-12',
    amountSol: 3.2,
    tx: '7Nq2BvL9mT8rP6sK3jF5cW1xD4aH9eG8nM7pY2sR5tL6',
    status: 'pending'
  }
];

export const stats: DashboardStats = {
  responseRatePct: 94.2,
  avgReplyHrs: 3.8,
  pendingCount: 5,
  earnings7dSol: 8.75
};

export const tipsTimeseries: TipTimeseries[] = [
  { date: '2024-01-01', sol: 1.2 },
  { date: '2024-01-02', sol: 0.8 },
  { date: '2024-01-03', sol: 2.1 },
  { date: '2024-01-04', sol: 1.5 },
  { date: '2024-01-05', sol: 3.2 },
  { date: '2024-01-06', sol: 2.8 },
  { date: '2024-01-07', sol: 1.9 },
  { date: '2024-01-08', sol: 2.4 },
  { date: '2024-01-09', sol: 3.6 },
  { date: '2024-01-10', sol: 2.2 },
  { date: '2024-01-11', sol: 4.1 },
  { date: '2024-01-12', sol: 3.8 },
  { date: '2024-01-13', sol: 2.9 },
  { date: '2024-01-14', sol: 5.2 },
  { date: '2024-01-15', sol: 1.8 }
];

export const tipTierBreakdown: TipTierBreakdown = {
  smallPct: 45, // <0.05 SOL (7% fee)
  mediumPct: 35, // 0.05-0.5 SOL (3% fee)
  largePct: 20  // >0.5 SOL (1% fee)
};

export const topTippers: TopTipper[] = [
  {
    handle: '@whale_watcher',
    count: 12,
    totalSol: 4.8,
    lastAt: '2024-01-14T16:30:00Z'
  },
  {
    handle: '@protocol_dev',
    count: 8,
    totalSol: 3.2,
    lastAt: '2024-01-14T11:45:00Z'
  },
  {
    handle: '@crypto_enthusiast',
    count: 15,
    totalSol: 2.9,
    lastAt: '2024-01-15T10:30:00Z'
  },
  {
    handle: '@startup_founder',
    count: 6,
    totalSol: 2.4,
    lastAt: '2024-01-15T02:10:00Z'
  },
  {
    handle: '@defi_trader',
    count: 9,
    totalSol: 2.1,
    lastAt: '2024-01-15T08:15:00Z'
  }
];

// Hourly tip distribution (24 hours)
export const tipsByHour = [
  { hour: '00', tips: 2 },
  { hour: '01', tips: 1 },
  { hour: '02', tips: 3 },
  { hour: '03', tips: 1 },
  { hour: '04', tips: 2 },
  { hour: '05', tips: 4 },
  { hour: '06', tips: 6 },
  { hour: '07', tips: 8 },
  { hour: '08', tips: 12 },
  { hour: '09', tips: 15 },
  { hour: '10', tips: 18 },
  { hour: '11', tips: 16 },
  { hour: '12', tips: 14 },
  { hour: '13', tips: 13 },
  { hour: '14', tips: 11 },
  { hour: '15', tips: 9 },
  { hour: '16', tips: 7 },
  { hour: '17', tips: 8 },
  { hour: '18', tips: 10 },
  { hour: '19', tips: 12 },
  { hour: '20', tips: 9 },
  { hour: '21', tips: 6 },
  { hour: '22', tips: 4 },
  { hour: '23', tips: 3 }
];

// Category distribution
export const tipsByCategory = [
  { name: 'DeFi', value: 35, color: '#10b981' },
  { name: 'Trading', value: 28, color: '#3b82f6' },
  { name: 'NFTs', value: 15, color: '#8b5cf6' },
  { name: 'Gaming', value: 10, color: '#f59e0b' },
  { name: 'Founders', value: 8, color: '#ef4444' },
  { name: 'Memes', value: 4, color: '#ec4899' }
];

// Canned replies
export const cannedReplies = [
  {
    id: 'thanks',
    title: 'Thanks + Detailed Answer',
    content: 'Thanks for the great question! Here\'s my take:\n\n[Your detailed response here]\n\nHope this helps! Feel free to follow up if you need clarification.'
  },
  {
    id: 'short',
    title: 'Short Answer + Link',
    content: 'Quick answer: [Brief response]\n\nFor more details, check out: [link]\n\nLet me know if you need more info!'
  },
  {
    id: 'decline',
    title: 'Polite Decline + Refund',
    content: 'Thanks for your question! Unfortunately, this falls outside my area of expertise. I\'m processing a full refund for you.\n\nYou might want to try asking [suggest alternative creator/resource].'
  },
  {
    id: 'clarify',
    title: 'Need Clarification',
    content: 'Great question! To give you the most helpful answer, could you clarify:\n\n- [specific detail needed]\n- [another detail]\n\nOnce I understand better, I\'ll provide a comprehensive response!'
  }
];
