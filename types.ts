export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isBot: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface GroupStats {
  id: string;
  name: string;
  memberCount: number;
  onlineCount: number;
  activityScore: number; // 0-100
  sentimentScore: number; // 0-100
  status: 'active' | 'muted' | 'maintenance';
}

export interface TwitterMetric {
  date: string;
  impressions: number;
  engagement: number;
  followers: number;
}

export interface BotPersona {
  id: string;
  name: string;
  role: string; // e.g., "Hype Man", "FUD Fighter", "Tech Support"
  tone: string;
  isActive: boolean;
}

export interface Milestone {
  level: number;
  targetVolume: number; // e.g., 200,000
  rewardAmount: number; // e.g., 5,000
  status: 'locked' | 'unlocked' | 'claimed';
}

export interface TeamReward {
  id: string;
  lineName: string; // Line A, B, C, D
  leaderName: string;
  
  // Advisor / Consultant Fields (Changed from Mentor)
  advisorName: string; 
  advisorAvatar?: string;
  advisorRole: string; // e.g. "Commercial Strategy", "Community Growth"
  
  // Financials
  totalPool: number; // Total potential allocation
  unlockedAmount: number; // Cumulative unlocked
  currentKpi: number; // Current Volume
  
  // Multi-stage release milestones
  milestones: Milestone[];
  
  // Status including penalty
  status: 'active' | 'risk' | 'slashed';
  penaltyAmount?: number; // Amount slashed if penalized
}

export interface WhaleTransaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer_in' | 'transfer_out';
  amount: number;
  valueUsd: number;
  walletLabel: string; // e.g., "Top Holder #3", "Binance Hot Wallet"
  timestamp: string;
  hash: string;
  riskLevel: 'low' | 'medium' | 'high'; // High risk = large transfer to CEX
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  TELEGRAM = 'TELEGRAM',
  TWITTER = 'TWITTER',
  INCENTIVES = 'INCENTIVES',
  SETTINGS = 'SETTINGS'
}