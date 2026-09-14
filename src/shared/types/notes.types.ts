export type NoteFormat =
  | 'PDF'
  | 'PPT'
  | 'HANDWRITTEN'
  | 'TYPED'
  | 'SHORT_NOTES'
  | 'REVISION_NOTES'
  | 'DOCX'
  | 'ZIP'
  | 'URL_LINK';

export type NoteStatus =
  | 'STUDENT_UPLOAD'
  | 'PROCESSING'
  | 'PENDING_REVIEW'
  | 'ADMIN_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'UNPUBLISHED'
  | 'ARCHIVED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED';

export type AuthorRole = 'STUDENT' | 'FACULTY' | 'ADMIN' | 'VTU_OFFICIAL';

export interface AutomatedValidation {
  fileTypeValid: boolean;
  fileSizeValid: boolean;
  virusScanStatus: 'CLEAN' | 'SCANNING' | 'THREAT_FLAGGED';
  contentQualityRating: number; // 1 - 5
  ocrScanStatus: 'PASSED' | 'WARNING' | 'FAILED';
  duplicateScore: number; // 0% - 100%
}

export interface NoteModerationLog {
  id: string;
  noteId: string;
  noteTitle: string;
  action: 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES' | 'REMOVED' | 'REPORTED';
  reviewer: string;
  reviewerRole: string;
  rejectionReason?: string;
  timestamp: string;
  comments?: string;
}

export interface AdminNote {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  // Associated Academic Hierarchy
  branchCode: string;
  schemeYear: string;
  semester: number;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  moduleId?: string;
  unitId?: string;
  unitName?: string;
  topicId?: string;
  topicTitle?: string;
  // File & Content details
  format: NoteFormat;
  status: NoteStatus;
  isPaid?: boolean;
  price?: number;
  freePreviewPages?: number;
  fileUrl: string;
  secureUrl: string;
  fileSize: string;
  fileSizeBytes: number;
  pageCount: number;
  authorName: string;
  authorRole: AuthorRole;
  authorUsn?: string;
  contributorId?: string;
  contributorReputation?: number;
  // Automated Validation Indicators
  validation: AutomatedValidation;
  // Telemetry & Reports
  reportsCount: number;
  reportReasons?: string[];
  downloads: number;
  bookmarksCount: number;
  viewsCount: number;
  averageRating: number;
  orderPriority: number;
  uploadDate: string;
  lastModified: string;
  rejectionReason?: string;
}

export interface NoteFilterState {
  searchQuery: string;
  branchCode: string;
  schemeYear: string;
  semester: number | 'ALL';
  subjectId: string;
  format: NoteFormat | 'ALL';
  status: NoteStatus | 'ALL';
}
