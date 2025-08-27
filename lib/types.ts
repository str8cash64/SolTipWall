// Data contract types matching the backend specification

export type CreatorCard = {
  creatorId: string;
  twitterHandle: string;     // '@IvySolana'
  walletAddress: string;     // 'CREATOR_WALLET_ADDR'
  priceLamports: number;     // e.g., 100_000_000
  last7dLamports: number;
  last7dTips: number;
}

export type TipInitResponse = {
  actionUrl: string; // mocked Phantom/Dialect link
  nonce: string;     // client nonce to show on success
  tipId: string;     // optimistic tip id (uuid)
}

export type TipRow = {
  id: string;
  createdAt: string;
  tipperTg: string;
  amountLamports: number;
  questionText: string;
  status: 'pending' | 'answered';
  answerText?: string;
  sentAt?: string;
}

export type TipsResponse = { 
  pending: TipRow[]; 
  answered: TipRow[] 
}

export type AnswerResponse = { 
  ok: true 
}

export type LeaderboardItem = {
  creatorId: string;
  twitterHandle: string;
  totalLamports7d: number;
  tipCount7d: number;
}

export type LeaderboardResponse = { 
  topCreators: LeaderboardItem[] 
}

// Form validation schemas
export type TipFormData = {
  telegramHandle: string;
  questionText: string;
  agreeToTerms: boolean;
}

export type SettingsFormData = {
  walletAddress: string;
  priceSol: number;
  telegramHandle: string;
}
