import { create } from 'zustand';
import {
  RewardRule,
  RewardTransaction,
  ContributorProfile,
  ContributorAuditLog,
} from '../shared/types/reward.types';

interface RewardStoreState {
  rules: RewardRule[];
  transactions: RewardTransaction[];
  contributors: ContributorProfile[];
  auditLogs: ContributorAuditLog[];

  // Rule actions
  toggleRule: (id: string) => void;
  updateRulePayout: (id: string, coins: number, xp: number) => void;

  // Manual Adjustment Actions (FR-12)
  manualRewardAdjustment: (
    userId: string,
    coinsDelta: number,
    xpDelta: number,
    reason: string,
    adminIdentity: string
  ) => void;

  // Contributor Governance Actions (FR-13)
  adjustContributorReputation: (
    contributorId: string,
    newReputation: number,
    reason: string,
    adminIdentity: string
  ) => void;
  suspendContributionPrivileges: (
    contributorId: string,
    reason: string,
    adminIdentity: string
  ) => void;
  restoreContributionPrivileges: (
    contributorId: string,
    adminIdentity: string
  ) => void;
}

const INITIAL_RULES: RewardRule[] = [
  {
    id: 'rule-1',
    ruleName: 'Approved Handwritten Note Upload',
    description: 'Awarded when a student handwritten note is reviewed and published.',
    category: 'NOTES_UPLOAD',
    coinsAwarded: 50,
    xpAwarded: 100,
    isEnabled: true,
    dailyCapLimit: 250,
  },
  {
    id: 'rule-2',
    ruleName: 'Verified Question Paper (PYQ) Upload',
    description: 'Awarded for uploading model or official VTU semester question papers.',
    category: 'PYQ_UPLOAD',
    coinsAwarded: 40,
    xpAwarded: 80,
    isEnabled: true,
    dailyCapLimit: 200,
  },
  {
    id: 'rule-3',
    ruleName: 'Community Solution / Answer Verification',
    description: 'Awarded when community members upvote a student answer.',
    category: 'COMMUNITY_HELP',
    coinsAwarded: 15,
    xpAwarded: 30,
    isEnabled: true,
    dailyCapLimit: 150,
  },
  {
    id: 'rule-4',
    ruleName: 'Referral Sign-Up Bonus',
    description: 'Awarded when a peer registers via custom student referral code.',
    category: 'REFERRAL',
    coinsAwarded: 30,
    xpAwarded: 50,
    isEnabled: true,
    dailyCapLimit: 300,
  },
  {
    id: 'rule-5',
    ruleName: 'Daily Study Streak Milestone (7 Days)',
    description: 'Awarded for 7 consecutive days of active application usage.',
    category: 'DAILY_STREAK',
    coinsAwarded: 25,
    xpAwarded: 60,
    isEnabled: true,
    dailyCapLimit: 25,
  },
];

const INITIAL_TRANSACTIONS: RewardTransaction[] = [
  {
    id: 'tx-101',
    userId: 'usr-101',
    userName: 'Fardeen Khan',
    userUsn: '1VA21CS042',
    type: 'EARNED',
    coins: 50,
    xp: 100,
    description: 'Approved Note Upload: Database Management Systems',
    timestamp: '2026-09-01 14:00',
    isSuspicious: false,
  },
  {
    id: 'tx-102',
    userId: 'usr-102',
    userName: 'Ananya Sharma',
    userUsn: '1BM22EC018',
    type: 'EARNED',
    coins: 40,
    xp: 80,
    description: 'Verified PYQ Upload: 21EC42 Digital Signal Processing',
    timestamp: '2026-09-03 11:30',
    isSuspicious: false,
  },
  {
    id: 'tx-103',
    userId: 'usr-105',
    userName: 'Spam Bot Simulation',
    userUsn: '1PE23CS999',
    type: 'EARNED',
    coins: 450,
    xp: 900,
    description: 'Rapid 9x Upload Submission within 2 Minutes',
    timestamp: '2026-09-06 03:15',
    isSuspicious: true,
    flagReason: 'Rapid reward farming anomaly detected (9 uploads in 120 sec).',
  },
];

const INITIAL_CONTRIBUTORS: ContributorProfile[] = [
  {
    id: 'usr-101',
    name: 'Fardeen Khan',
    usn: '1VA21CS042',
    email: 'fardeen.k@vtu.ac.in',
    branch: 'CSE',
    semester: 5,
    college: 'Visvesvaraya Academy (1VA)',
    uploadCount: 14,
    publishedCount: 12,
    rejectedCount: 1,
    downloadsCount: 3420,
    usefulVotes: 890,
    reputationScore: 480,
    coinsBalance: 650,
    totalXp: 1420,
    badges: ['Top Contributor 2026', 'DBMS Master', 'Verified Scholar'],
    isContributionSuspended: false,
    reportsReceived: 0,
    joinedDate: '2025-09-10',
  },
  {
    id: 'usr-102',
    name: 'Ananya Sharma',
    usn: '1BM22EC018',
    email: 'ananya.s@bmsce.ac.in',
    branch: 'ECE',
    semester: 5,
    college: 'BMS College of Engineering (1BM)',
    uploadCount: 8,
    publishedCount: 6,
    rejectedCount: 2,
    downloadsCount: 1850,
    usefulVotes: 410,
    reputationScore: 280,
    coinsBalance: 320,
    totalXp: 860,
    badges: ['ECE Star', 'PYQ Hunter'],
    isContributionSuspended: false,
    reportsReceived: 1,
    joinedDate: '2025-11-15',
  },
  {
    id: 'usr-105',
    name: 'Suspicious Account 999',
    usn: '1PE23CS999',
    email: 'testbot@domain.com',
    branch: 'CSE',
    semester: 3,
    college: 'PESIT Bangalore (1PE)',
    uploadCount: 9,
    publishedCount: 0,
    rejectedCount: 9,
    downloadsCount: 0,
    usefulVotes: 0,
    reputationScore: 10,
    coinsBalance: 450,
    totalXp: 900,
    badges: [],
    isContributionSuspended: true,
    suspensionReason: 'Coin farming anomaly detected. Upload privilege suspended.',
    reportsReceived: 5,
    joinedDate: '2026-09-05',
  },
];

export const useRewardStore = create<RewardStoreState>((set, get) => ({
  rules: INITIAL_RULES,
  transactions: INITIAL_TRANSACTIONS,
  contributors: INITIAL_CONTRIBUTORS,
  auditLogs: [],

  toggleRule: (id) => {
    set((state) => ({
      rules: state.rules.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r)),
    }));
  },

  updateRulePayout: (id, coins, xp) => {
    set((state) => ({
      rules: state.rules.map((r) => (r.id === id ? { ...r, coinsAwarded: coins, xpAwarded: xp } : r)),
    }));
  },

  manualRewardAdjustment: (userId, coinsDelta, xpDelta, reason, adminIdentity) => {
    const contributor = get().contributors.find((c) => c.id === userId);
    const now = new Date().toLocaleString();

    const tx: RewardTransaction = {
      id: `tx-${Date.now()}`,
      userId,
      userName: contributor ? contributor.name : 'Student User',
      userUsn: contributor ? contributor.usn : 'N/A',
      type: coinsDelta >= 0 ? 'MANUAL_ADD' : 'MANUAL_DEDUCT',
      coins: coinsDelta,
      xp: xpDelta,
      description: `Manual Adjustment by ${adminIdentity}: ${reason}`,
      timestamp: now,
      adminIdentity,
      adjustmentReason: reason,
      isSuspicious: false,
    };

    const log: ContributorAuditLog = {
      id: `cal-${Date.now()}`,
      contributorId: userId,
      contributorName: contributor ? contributor.name : 'Student User',
      action: 'MANUAL_REWARD',
      adminIdentity,
      reason,
      timestamp: now,
      details: `Manual adjustment of ${coinsDelta} Coins and ${xpDelta} XP.`,
    };

    set((state) => ({
      transactions: [tx, ...state.transactions],
      auditLogs: [log, ...state.auditLogs],
      contributors: state.contributors.map((c) =>
        c.id === userId
          ? {
              ...c,
              coinsBalance: Math.max(0, c.coinsBalance + coinsDelta),
              totalXp: Math.max(0, c.totalXp + xpDelta),
            }
          : c
      ),
    }));
  },

  adjustContributorReputation: (contributorId, newReputation, reason, adminIdentity) => {
    const contributor = get().contributors.find((c) => c.id === contributorId);
    if (!contributor) return;
    const now = new Date().toLocaleString();

    const log: ContributorAuditLog = {
      id: `cal-${Date.now()}`,
      contributorId,
      contributorName: contributor.name,
      action: 'REPUTATION_ADJUSTED',
      adminIdentity,
      reason,
      timestamp: now,
      details: `Reputation score adjusted from ${contributor.reputationScore} to ${newReputation}.`,
    };

    set((state) => ({
      contributors: state.contributors.map((c) =>
        c.id === contributorId ? { ...c, reputationScore: newReputation } : c
      ),
      auditLogs: [log, ...state.auditLogs],
    }));
  },

  suspendContributionPrivileges: (contributorId, reason, adminIdentity) => {
    const contributor = get().contributors.find((c) => c.id === contributorId);
    if (!contributor) return;
    const now = new Date().toLocaleString();

    const log: ContributorAuditLog = {
      id: `cal-${Date.now()}`,
      contributorId,
      contributorName: contributor.name,
      action: 'PRIVILEGES_SUSPENDED',
      adminIdentity,
      reason,
      timestamp: now,
      details: `Contribution upload privileges suspended: ${reason}`,
    };

    set((state) => ({
      contributors: state.contributors.map((c) =>
        c.id === contributorId
          ? { ...c, isContributionSuspended: true, suspensionReason: reason }
          : c
      ),
      auditLogs: [log, ...state.auditLogs],
    }));
  },

  restoreContributionPrivileges: (contributorId, adminIdentity) => {
    const contributor = get().contributors.find((c) => c.id === contributorId);
    if (!contributor) return;
    const now = new Date().toLocaleString();

    const log: ContributorAuditLog = {
      id: `cal-${Date.now()}`,
      contributorId,
      contributorName: contributor.name,
      action: 'PRIVILEGES_RESTORED',
      adminIdentity,
      reason: 'Admin restored upload privileges.',
      timestamp: now,
      details: `Contribution upload privileges restored.`,
    };

    set((state) => ({
      contributors: state.contributors.map((c) =>
        c.id === contributorId
          ? { ...c, isContributionSuspended: false, suspensionReason: undefined }
          : c
      ),
      auditLogs: [log, ...state.auditLogs],
    }));
  },
}));
