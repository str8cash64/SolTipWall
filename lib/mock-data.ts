import { CreatorCard, TipRow, LeaderboardItem } from './types'
import { generateTipId, generateNonce } from './utils'

// Mock creators data
export const mockCreators: Record<string, CreatorCard> = {
  '@IvySolana': {
    creatorId: 'creator-1',
    twitterHandle: '@IvySolana',
    walletAddress: 'FvyAGeYrfChRp4XGX2FhHoax8J4TqBr4WB8ZmMhDDnGP',
    priceLamports: 100_000_000, // 0.1 SOL
    last7dLamports: 2_500_000_000, // 2.5 SOL
    last7dTips: 25
  },
  '@SolDev': {
    creatorId: 'creator-2',
    twitterHandle: '@SolDev',
    walletAddress: 'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
    priceLamports: 200_000_000, // 0.2 SOL
    last7dLamports: 4_000_000_000, // 4.0 SOL
    last7dTips: 20
  },
  '@CryptoQueen': {
    creatorId: 'creator-3',
    twitterHandle: '@CryptoQueen',
    walletAddress: 'DjVE6JNiYqPL2QXyCUUh8rNjHRbn9MXqCLQ1dXQ8LqjG',
    priceLamports: 150_000_000, // 0.15 SOL
    last7dLamports: 3_200_000_000, // 3.2 SOL
    last7dTips: 22
  },
  '@SolanaGuru': {
    creatorId: 'creator-4',
    twitterHandle: '@SolanaGuru',
    walletAddress: 'Hp5ynQddUb2hPEjQn5A5V4vJJQqkF4qQhQw7h6HFwGQP',
    priceLamports: 300_000_000, // 0.3 SOL
    last7dLamports: 1_800_000_000, // 1.8 SOL
    last7dTips: 6
  },
  '@DeFiExpert': {
    creatorId: 'creator-5',
    twitterHandle: '@DeFiExpert',
    walletAddress: 'BqZxVJvQ8K4tRXqGpHNQvUgqMvZrLhNkWjZwJzXnwGPq',
    priceLamports: 250_000_000, // 0.25 SOL
    last7dLamports: 2_750_000_000, // 2.75 SOL
    last7dTips: 11
  },
  '@NFTCollector': {
    creatorId: 'creator-6',
    twitterHandle: '@NFTCollector',
    walletAddress: 'CvBZ1GQKqPqPLbGJwQrHKjGhQwHKqPqPLbGJwQrHKjGh',
    priceLamports: 180_000_000, // 0.18 SOL
    last7dLamports: 1_440_000_000, // 1.44 SOL
    last7dTips: 8
  }
}

// Mock tips data - will be modified by API calls
export let mockTips: TipRow[] = [
  {
    id: generateTipId(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    tipperTg: '@crypto_enthusiast',
    amountLamports: 100_000_000,
    questionText: 'What are your thoughts on the latest Solana runtime updates? How will they impact DeFi protocols?',
    status: 'pending'
  },
  {
    id: generateTipId(),
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    tipperTg: '@defi_trader',
    amountLamports: 100_000_000,
    questionText: 'Can you explain the difference between Jupiter and Orca for swapping tokens?',
    status: 'pending'
  },
  {
    id: generateTipId(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    tipperTg: '@solana_newbie',
    amountLamports: 100_000_000,
    questionText: 'What are the best practices for securing a Solana wallet?',
    status: 'answered',
    answerText: 'Always use a hardware wallet like Ledger, never share your seed phrase, and be cautious of phishing sites. Use official wallet extensions only.',
    sentAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
  },
  {
    id: generateTipId(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    tipperTg: '@nft_lover',
    amountLamports: 100_000_000,
    questionText: 'Which Solana NFT marketplaces do you recommend for beginners?',
    status: 'answered',
    answerText: 'Magic Eden is the most user-friendly for beginners. Tensor is great for advanced trading. Always check floor prices and rarity before buying.',
    sentAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString()
  }
]

// Generate leaderboard from creators
export const generateLeaderboard = (): LeaderboardItem[] => {
  return Object.values(mockCreators)
    .map(creator => ({
      creatorId: creator.creatorId,
      twitterHandle: creator.twitterHandle,
      totalLamports7d: creator.last7dLamports,
      tipCount7d: creator.last7dTips
    }))
    .sort((a, b) => b.totalLamports7d - a.totalLamports7d)
}

// Helper functions to modify mock data
export const addTip = (tip: TipRow) => {
  mockTips.unshift(tip)
}

export const answerTip = (tipId: string, answerText: string) => {
  const tip = mockTips.find(t => t.id === tipId)
  if (tip) {
    tip.status = 'answered'
    tip.answerText = answerText
    tip.sentAt = new Date().toISOString()
  }
}

export const getTipsByStatus = () => {
  const pending = mockTips.filter(t => t.status === 'pending')
  const answered = mockTips.filter(t => t.status === 'answered')
  return { pending, answered }
}
