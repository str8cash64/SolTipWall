// Mock data for marketing homepage - TODO: wire to backend

export interface MockCreator {
  id: string;
  handle: string;
  avatarUrl: string;
  categories: string[];
  tipFromSol: number;
  tips7d: number;
  totalSol: number;
  avgReplyHrs: number;
  verified: boolean;
  isNew?: boolean;
  responseRate: number;
}

export interface MockStats {
  creatorsThisWeek: number;
  tipsThisWeekSol: number;
  avgReplyHrs: number;
  answersCount: number;
}

export interface MockLeaderboardItem {
  rank: number;
  handle: string;
  tips: number;
  totalSol: number;
  avatarUrl: string;
}

export interface MockLeaderboard {
  period: 'week' | 'all';
  items: MockLeaderboardItem[];
}

// Featured creators data
export const mockCreators: MockCreator[] = [
  {
    id: '1',
    handle: '@SolDev',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolDev',
    categories: ['DeFi', 'Development'],
    tipFromSol: 0.05,
    tips7d: 24,
    totalSol: 3.2,
    avgReplyHrs: 4,
    verified: true,
    responseRate: 98
  },
  {
    id: '2',
    handle: '@CryptoQueen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoQueen',
    categories: ['Trading', 'Analysis'],
    tipFromSol: 0.08,
    tips7d: 31,
    totalSol: 5.1,
    avgReplyHrs: 6,
    verified: true,
    responseRate: 95
  },
  {
    id: '3',
    handle: '@NFTMaster',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NFTMaster',
    categories: ['NFTs', 'Artists'],
    tipFromSol: 0.03,
    tips7d: 18,
    totalSol: 2.8,
    avgReplyHrs: 8,
    verified: false,
    isNew: true,
    responseRate: 92
  },
  {
    id: '4',
    handle: '@DegenAlpha',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DegenAlpha',
    categories: ['Memes', 'Trading'],
    tipFromSol: 0.02,
    tips7d: 42,
    totalSol: 1.9,
    avgReplyHrs: 2,
    verified: true,
    responseRate: 89
  },
  {
    id: '5',
    handle: '@SolanaBuilder',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolanaBuilder',
    categories: ['Development', 'Founders'],
    tipFromSol: 0.12,
    tips7d: 15,
    totalSol: 4.7,
    avgReplyHrs: 12,
    verified: true,
    responseRate: 96
  },
  {
    id: '6',
    handle: '@DeFiGuru',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiGuru',
    categories: ['DeFi', 'Founders'],
    tipFromSol: 0.15,
    tips7d: 19,
    totalSol: 6.3,
    avgReplyHrs: 10,
    verified: true,
    responseRate: 97
  },
  {
    id: '7',
    handle: '@MemeCoin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MemeCoin',
    categories: ['Memes'],
    tipFromSol: 0.01,
    tips7d: 67,
    totalSol: 2.1,
    avgReplyHrs: 1,
    verified: false,
    responseRate: 85
  },
  {
    id: '8',
    handle: '@SolanaArt',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolanaArt',
    categories: ['Artists', 'NFTs'],
    tipFromSol: 0.06,
    tips7d: 28,
    totalSol: 3.9,
    avgReplyHrs: 7,
    verified: true,
    isNew: true,
    responseRate: 94
  }
];

// Platform stats
export const mockStats: MockStats = {
  creatorsThisWeek: 247,
  tipsThisWeekSol: 89.3,
  avgReplyHrs: 6,
  answersCount: 1420
};

// Leaderboard data
export const mockLeaderboardWeek: MockLeaderboard = {
  period: 'week',
  items: [
    {
      rank: 1,
      handle: '@MemeCoin',
      tips: 67,
      totalSol: 2.1,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MemeCoin'
    },
    {
      rank: 2,
      handle: '@DegenAlpha',
      tips: 42,
      totalSol: 1.9,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DegenAlpha'
    },
    {
      rank: 3,
      handle: '@CryptoQueen',
      tips: 31,
      totalSol: 5.1,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoQueen'
    },
    {
      rank: 4,
      handle: '@SolanaArt',
      tips: 28,
      totalSol: 3.9,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolanaArt'
    },
    {
      rank: 5,
      handle: '@SolDev',
      tips: 24,
      totalSol: 3.2,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolDev'
    }
  ]
};

export const mockLeaderboardAll: MockLeaderboard = {
  period: 'all',
  items: [
    {
      rank: 1,
      handle: '@DeFiGuru',
      tips: 156,
      totalSol: 18.7,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiGuru'
    },
    {
      rank: 2,
      handle: '@SolanaBuilder',
      tips: 134,
      totalSol: 22.1,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolanaBuilder'
    },
    {
      rank: 3,
      handle: '@CryptoQueen',
      tips: 128,
      totalSol: 16.3,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoQueen'
    },
    {
      rank: 4,
      handle: '@SolDev',
      tips: 98,
      totalSol: 12.8,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolDev'
    },
    {
      rank: 5,
      handle: '@NFTMaster',
      tips: 87,
      totalSol: 9.4,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NFTMaster'
    }
  ]
};

// Fee tiers
export interface FeeStructure {
  minSol: number;
  maxSol?: number;
  feePercent: number;
  label: string;
}

export const feeStructure: FeeStructure[] = [
  {
    minSol: 0,
    maxSol: 0.049,
    feePercent: 7,
    label: '< 0.05 SOL'
  },
  {
    minSol: 0.05,
    maxSol: 0.5,
    feePercent: 3,
    label: '0.05 – 0.5 SOL'
  },
  {
    minSol: 0.5,
    feePercent: 1,
    label: '> 0.5 SOL'
  }
];

// Helper function to calculate fees
export function calculateFee(tipAmount: number): { feePercent: number; feeAmount: number; netAmount: number } {
  let feePercent = 7; // default
  
  if (tipAmount >= 0.5) {
    feePercent = 1;
  } else if (tipAmount >= 0.05) {
    feePercent = 3;
  }
  
  const feeAmount = (tipAmount * feePercent) / 100;
  const netAmount = tipAmount - feeAmount;
  
  return { feePercent, feeAmount, netAmount };
}

// Categories for filtering
export const creatorCategories = [
  'All',
  'DeFi',
  'Trading',
  'Founders',
  'Artists',
  'Memes',
  'Development',
  'NFTs',
  'Analysis'
];
