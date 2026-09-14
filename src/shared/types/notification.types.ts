export type NotificationType =
  | 'RESULT'
  | 'CIRCULAR'
  | 'EXAM'
  | 'ACADEMIC'
  | 'COMMUNITY'
  | 'SYSTEM'
  | 'PROMOTIONAL';

export type NotificationStatus = 'DRAFT' | 'SCHEDULED' | 'SENT' | 'CANCELLED';

export type AudienceType =
  | 'ALL_STUDENTS'
  | 'BRANCH_SPECIFIC'
  | 'SEMESTER_SPECIFIC'
  | 'SCHEME_SPECIFIC'
  | 'COLLEGE_SPECIFIC';

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  audience: AudienceType;
  targetBranch: string; // 'ALL' or code (e.g., 'CSE')
  targetSemester: number | 'ALL';
  targetScheme: string; // 'ALL' or year (e.g., '2022')
  targetCollege: string; // 'ALL' or college code (e.g., '1RV')
  status: NotificationStatus;
  scheduledFor?: string; // ISO date string or formatted date
  sentAt?: string;
  createdBy: string;
  createdAt: string;
  attachmentUrl?: string;
  actionUrl?: string;
  stats: {
    recipientsCount: number;
    deliveredCount: number;
    openedCount: number;
  };
}

export interface NotificationAuditLog {
  id: string;
  notificationId: string;
  notificationTitle: string;
  action: 'CREATED' | 'UPDATED' | 'SCHEDULED' | 'SENT' | 'CANCELLED' | 'DELETED';
  triggeredBy: string;
  role: string;
  timestamp: string;
  recipients: number;
  details: string;
}
