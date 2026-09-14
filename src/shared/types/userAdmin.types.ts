export type UserAccountStatus =
  | 'ACTIVE'
  | 'VERIFIED'
  | 'SUSPENDED'
  | 'PROVISIONAL'
  | 'DEACTIVATED';

export type AdminRole = 'SUPER_ADMIN' | 'CONTENT_MODERATOR' | 'EXAM_CONTROLLER' | 'AUDITOR';

export type SubscriptionPlan = 'FREE_STUDENT' | 'PREMIUM_PRO' | 'PASSING_PASS' | 'NOTES_PLUS';

export interface UserContributionStats {
  notesUploaded: number;
  pyqsShared: number;
  forumAnswersCount: number;
  verifiedContributions: number;
  totalUpvotes: number;
}

export interface UserReportItem {
  id: string;
  reportDate: string;
  reason: string;
  resourceTitle: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

export interface UserReputation {
  karmaPoints: number;
  reputationLevel: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'LEGEND';
  badgesCount: number;
  rankTitle: string;
}

export interface DetailedUserProfile {
  id: string;
  usn: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  collegeCity: string;
  region: 'BENGALURU' | 'MYSORE' | 'BELAGAVI' | 'KALABURAGI';
  branch: string;
  semester: number;
  scheme: string;
  cgpa: number;
  status: UserAccountStatus;
  joinedYear: number;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiry?: string;
  contributions: UserContributionStats;
  reputation: UserReputation;
  reports: UserReportItem[];
  suspensionReason?: string;
  suspendedAt?: string;
  lastLoginDate: string;
  // Note: Passwords and Auth Tokens are redacted for privacy and security!
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  actionType: 'USER_STATUS_CHANGE' | 'USER_SUSPENDED' | 'USER_RESTORED' | 'CALCULATOR_RULE_CHANGE' | 'CALENDAR_PUBLISHED' | 'NOTIFICATION_SENT';
  targetEntityId: string;
  targetEntityName: string;
  details: string;
  ipAddress: string;
}
