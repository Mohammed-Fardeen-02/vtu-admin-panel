export type QuestionPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PassingQuestion {
  id: string;
  questionText: string;
  answerSummary: string;
  unitNumber: number;
  unitName: string;
  category: 'IMPORTANT' | 'REPEATED' | 'MOST_EXPECTED' | 'LAST_MINUTE_REVISION' | 'ONE_NIGHT_BEFORE';
  weightageMarks: number;
  priority: QuestionPriority;
  frequencyText: string; // e.g. "Asked 4 times in VTU 2021-2024"
  order: number;
  diagramRequired: boolean;
}

export type PremiumTier = 'FREE' | 'SILVER' | 'GOLD_PASS';

export interface PassingPackage {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  schemeYear: string;
  branchCode: string;
  semester: number;
  unitsCount: number;
  questionsCount: number;
  lastMinuteRevisionSummary: string;
  oneNightBeforeNotes: string;
  questions: PassingQuestion[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  // Monetization fields
  isPremium: boolean;
  tier: PremiumTier;
  priceINR: number;
  // Stats
  views: number;
  downloads: number;
  bookmarks: number;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface PackageAuditLog {
  id: string;
  packageId: string;
  packageTitle: string;
  action: 'CREATED' | 'UPDATED' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED' | 'DELETED' | 'REORDERED';
  admin: string;
  timestamp: string;
  details: string;
}
