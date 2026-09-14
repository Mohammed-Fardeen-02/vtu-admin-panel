export type PaperContentType = 'DIGITAL_TYPED' | 'PDF_UPLOAD' | 'HYBRID';

export type PaperType =
  | 'SEE_THEORY'
  | 'IA_1'
  | 'IA_2'
  | 'IA_3'
  | 'LAB_EXAM'
  | 'SOLUTION_KEY';

export type ExamCategory = 'REGULAR' | 'MAKEUP' | 'MODEL';

export type PaperStatus = 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';

export type BloomLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export interface QuestionSubItem {
  subCode: string; // e.g. 'a', 'b', 'c'
  text: string;
  marks: number;
  bloomLevel?: BloomLevel;
  solution?: string;
}

export interface QuestionChoice {
  choiceId: string; // e.g. 'Q1a', 'Q1b'
  isOrOption?: boolean;
  subQuestions: QuestionSubItem[];
}

export interface MainQuestion {
  questionNumber: string; // e.g. 'Q1', 'Q2', 'Q3'
  choices: QuestionChoice[];
}

export interface PaperModule {
  moduleNumber: number; // 1 to 5
  title: string;
  mainQuestions: MainQuestion[];
}

export interface AdminQuestionPaper {
  id: string;
  title: string;
  description?: string;
  contentType: PaperContentType;
  paperType: PaperType;
  examCategory: ExamCategory;

  // Exam Meta & Dates
  year: number; // e.g. 2025
  month?: string; // e.g. "Jan/Feb"
  maxMarks?: number; // e.g. 100
  durationHours?: number; // e.g. 3.0

  // Structure
  branchCode: string;
  schemeYear: string;
  semester: number;
  subjectId?: string;
  subjectCode: string;
  subjectName: string;

  // Files
  fileUrl?: string;
  secureUrl?: string;
  pdfUrl?: string;
  solutionPdfUrl?: string;
  fileSize?: string;
  fileSizeBytes?: number;
  pageCount?: number;

  // Structured Content for Interactive Reader
  modulesData?: PaperModule[];

  // Meta & Status
  hasSolutionKey: boolean;
  status: PaperStatus;
  uploadedBy?: string;
  downloads?: number;
  viewsCount?: number;
  uploadDate?: string;
  lastModified?: string;
}

export interface PaperFilterState {
  searchQuery: string;
  branchCode: string;
  schemeYear: string;
  semester: number | 'ALL';
  subjectId: string;
  paperType: PaperType | 'ALL';
  examCategory: ExamCategory | 'ALL';
  contentType: PaperContentType | 'ALL';
  status: PaperStatus | 'ALL';
  hasSolutionKey: boolean | 'ALL';
}
