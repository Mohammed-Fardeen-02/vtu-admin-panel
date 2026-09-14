export type StudentStatus = 'ACTIVE' | 'VERIFIED' | 'SUSPENDED' | 'PROVISIONAL';

export interface Student {
  id: string;
  usn: string;
  name: string;
  email: string;
  college: string;
  collegeCity: string;
  branch: string;
  semester: number;
  scheme: string;
  cgpa: number;
  status: StudentStatus;
  joinedYear: number;
}

export interface College {
  id: string;
  code: string;
  name: string;
  city: string;
  region: 'BENGALURU' | 'MYSORE' | 'BELAGAVI' | 'KALABURAGI';
  principalName: string;
  email: string;
  totalStudents: number;
  branches: string[];
}

export type NoteType = 'HANDWRITTEN' | 'DIGITAL';
export type ModerationStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface Note {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  branch: string;
  semester: number;
  scheme: string;
  type: NoteType;
  authorName: string;
  authorUsn: string;
  status: ModerationStatus;
  downloads: number;
  fileSize: string;
  uploadDate: string;
}

export type ExamTerm = 'SEE_JAN_FEB' | 'SEE_JUNE_JULY' | 'IA_1' | 'IA_2' | 'IA_3';

export interface QuestionPaper {
  id: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  scheme: string;
  examTerm: ExamTerm;
  year: number;
  downloads: number;
  hasSolutionKey: boolean;
  uploadedBy: string;
}

export type EventCategory = 'SEE_EXAM' | 'IA_TEST' | 'LAB_EXAM' | 'RESULTS' | 'HOLIDAY' | 'ACADEMIC_BODY';

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  scheme: string;
  description: string;
  isImportant: boolean;
}

export interface Circular {
  id: string;
  circularNo: string;
  title: string;
  category: 'EXAMS' | 'SCHEME_UPDATE' | 'FEES' | 'TIMETABLE' | 'GENERAL';
  targetAudience: string;
  publishDate: string;
  fileSize: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}

export interface AdminUser {
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
}

export interface PassingPackageAdminItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  branch: string;
  semester: number;
  scheme: string;
  importantQuestionsCount: number;
  expectedQuestionsCount: number;
  revisionPdfCount: number;
  status: 'PUBLISHED' | 'DRAFT' | 'NEEDS_UPDATE';
  lastUpdated: string;
}

export interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  subjectCode: string;
  branch: string;
  videoCount: number;
  durationMinutes: number;
  enrolledStudents: number;
  rating: number;
}

export interface ModerationReport {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceType: 'NOTE' | 'QUESTION_PAPER' | 'COMMUNITY_FILE' | 'PASSING_PACKAGE';
  reportedBy: string;
  reason: 'INCORRECT_SYLLABUS' | 'COPYRIGHT' | 'POOR_QUALITY' | 'SPAM' | 'OTHER';
  details: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  reportDate: string;
}

export interface AdminPaymentItem {
  id: string;
  orderId: string;
  studentName: string;
  studentUsn: string;
  planName: 'PREMIUM_PRO' | 'PASSING_PACKAGE_PASS' | 'NOTES_PLUS';
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentDate: string;
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING';
}

export interface AttentionContentItem {
  id: string;
  title: string;
  type: 'OUTDATED_SYLLABUS' | 'HIGH_REPORTS' | 'MISSING_KEY' | 'UNVERIFIED_PACKAGE';
  subjectCode: string;
  branch: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  actionRequired: string;
}

