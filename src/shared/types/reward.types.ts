export type RewardCategory =
  | 'NOTES_UPLOAD'
  | 'PYQ_UPLOAD'
  | 'COMMUNITY_HELP'
  | 'CORRECTION_REPORT'
  | 'REFERRAL'
  | 'DAILY_STREAK'
  | 'MILESTONE_BADGE'
  | 'MANUAL_ADJUSTMENT';

export interface RewardRule {
  id: string;
  ruleName: string;
  description: string;
  category: RewardCategory;
  coinsAwarded: number;
  xpAwarded: number;
  isEnabled: boolean;
  dailyCapLimit: number;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  userName: string;
  userUsn: string;
  type: 'EARNED' | 'REDEEMED' | 'MANUAL_ADD' | 'MANUAL_DEDUCT' | 'PENALTY';
  coins: number;
  xp: number;
  description: string;
  timestamp: string;
  adminIdentity?: string;
  adjustmentReason?: string;
  isSuspicious: boolean;
  flagReason?: string;
}

export interface ContributorProfile {
  id: string;
  name: string;
  usn: string;
  email: string;
  branch: string;
  semester: number;
  college: string;
  uploadCount: number;
  publishedCount: number;
  rejectedCount: number;
  downloadsCount: number;
  usefulVotes: number;
  reputationScore: number;
  coinsBalance: number;
  totalXp: number;
  badges: string[];
  isContributionSuspended: boolean;
  suspensionReason?: string;
  reportsReceived: number;
  joinedDate: string;
}

export interface ContributorAuditLog {
  id: string;
  contributorId: string;
  contributorName: string;
  action: 'REPUTATION_ADJUSTED' | 'PRIVILEGES_SUSPENDED' | 'PRIVILEGES_RESTORED' | 'MANUAL_REWARD';
  adminIdentity: string;
  reason: string;
  timestamp: string;
  details: string;
}
