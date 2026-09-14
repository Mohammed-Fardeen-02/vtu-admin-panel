export type CalendarEventCategory =
  | 'SEMESTER_START'
  | 'SEMESTER_END'
  | 'INTERNAL_EXAM'
  | 'LAB_EXAM'
  | 'VTU_EXAM'
  | 'RESULT_DATE'
  | 'HOLIDAY'
  | 'ACADEMIC_EVENT';

export type CalendarEventStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  category: CalendarEventCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  branchId: string;  // 'ALL' or specific branch code (e.g., 'CSE')
  schemeId: string;  // 'ALL' or scheme (e.g., '2022')
  semester: number | 'ALL';
  status: CalendarEventStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isMobileSynced: boolean;
}

export interface CalendarAuditLog {
  id: string;
  eventId: string;
  eventTitle: string;
  action: 'CREATED' | 'UPDATED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED' | 'MOBILE_SYNC';
  changedBy: string;
  role: string;
  timestamp: string;
  details: string;
}
