export type ResourceCategory =
  | 'NOTES'
  | 'QUESTION_PAPER'
  | 'PASSING_PACKAGE'
  | 'FORMULA_SHEET'
  | 'VIDEO_LECTURE';

export interface ResourceTelemetryItem {
  id: string;
  title: string;
  resourceType: ResourceCategory;
  branchCode: string;
  schemeYear: string;
  semester: number;
  subjectCode: string;
  subjectName: string;
  downloadsCount: number;
  bookmarksCount: number;
  viewsCount: number;
  fileSize: string;
  isAccessDisabled: boolean;
  offlineCacheEnabled: boolean;
  eTag: string;
  lastDownloadedDate: string;
}

export interface TypeDistribution {
  resourceType: ResourceCategory;
  label: string;
  downloadsCount: number;
  bookmarksCount: number;
  percentage: number;
}

export interface SemesterDistribution {
  semesterNumber: number;
  downloadsCount: number;
  bookmarksCount: number;
}

export interface SubjectTelemetry {
  subjectCode: string;
  subjectName: string;
  branchCode: string;
  downloadsCount: number;
  bookmarksCount: number;
}

export interface DownloadTrendPoint {
  date: string;
  notesDownloads: number;
  pyqDownloads: number;
  packageDownloads: number;
  totalDownloads: number;
}

export interface RecentDownloadLog {
  id: string;
  timestamp: string;
  resourceTitle: string;
  resourceType: ResourceCategory;
  subjectCode: string;
  branchCode: string;
  collegeRegion: string; // Aggregated Region (e.g. BENGALURU, MYSORE, BELAGAVI) - Privacy Compliant
}
