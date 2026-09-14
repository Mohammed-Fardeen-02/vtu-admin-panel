import { create } from 'zustand';
import {
  ResourceTelemetryItem,
  TypeDistribution,
  SemesterDistribution,
  SubjectTelemetry,
  DownloadTrendPoint,
  RecentDownloadLog,
} from '../shared/types/analytics.types';

const INITIAL_RESOURCE_ITEMS: ResourceTelemetryItem[] = [
  {
    id: 'res-1',
    title: 'Database Management Systems (21CS53) Complete Notes Modules 1-5',
    resourceType: 'NOTES',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    subjectCode: '21CS53',
    subjectName: 'Database Management Systems',
    downloadsCount: 3420,
    bookmarksCount: 890,
    viewsCount: 12400,
    fileSize: '8.4 MB',
    isAccessDisabled: false,
    offlineCacheEnabled: true,
    eTag: 'W/"dbms-2022-v5-8808038"',
    lastDownloadedDate: '2026-09-06 14:12',
  },
  {
    id: 'res-2',
    title: 'DBMS (21CS53) SEE Exam Question Paper - Jan/Feb 2025 with Solution Key',
    resourceType: 'QUESTION_PAPER',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    subjectCode: '21CS53',
    subjectName: 'Database Management Systems',
    downloadsCount: 3450,
    bookmarksCount: 620,
    viewsCount: 14200,
    fileSize: '3.6 MB',
    isAccessDisabled: false,
    offlineCacheEnabled: true,
    eTag: 'W/"dbms-pyq-2025-3774873"',
    lastDownloadedDate: '2026-09-06 13:45',
  },
  {
    id: 'res-3',
    title: 'DSP (21EC42) VTU Model Question Paper & 100% Solved Formula Key',
    resourceType: 'QUESTION_PAPER',
    branchCode: 'ECE',
    schemeYear: '2022',
    semester: 4,
    subjectCode: '21EC42',
    subjectName: 'Digital Signal Processing',
    downloadsCount: 4120,
    bookmarksCount: 940,
    viewsCount: 15600,
    fileSize: '3.2 MB',
    isAccessDisabled: false,
    offlineCacheEnabled: true,
    eTag: 'W/"dsp-pyq-2025-3355443"',
    lastDownloadedDate: '2026-09-06 14:02',
  },
  {
    id: 'res-4',
    title: 'Computer Networks (21CS52) 1-Night Exam Passing Package & Repeated Questions',
    resourceType: 'PASSING_PACKAGE',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    subjectCode: '21CS52',
    subjectName: 'Computer Networks',
    downloadsCount: 2890,
    bookmarksCount: 780,
    viewsCount: 9800,
    fileSize: '5.1 MB',
    isAccessDisabled: false,
    offlineCacheEnabled: true,
    eTag: 'W/"cn-passpkg-2022-5347737"',
    lastDownloadedDate: '2026-09-06 12:30',
  },
  {
    id: 'res-5',
    title: 'Theory of Computation (21CS54) Pushdown Automata Quick Formula Cheat Sheet',
    resourceType: 'FORMULA_SHEET',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    subjectCode: '21CS54',
    subjectName: 'Theory of Computation',
    downloadsCount: 2150,
    bookmarksCount: 510,
    viewsCount: 6800,
    fileSize: '1.2 MB',
    isAccessDisabled: false,
    offlineCacheEnabled: true,
    eTag: 'W/"toc-formula-2022-1258291"',
    lastDownloadedDate: '2026-09-06 11:15',
  },
  {
    id: 'res-6',
    title: 'Digital Signal Processing (21EC42) Fast Fourier Transform Video Series',
    resourceType: 'VIDEO_LECTURE',
    branchCode: 'ECE',
    schemeYear: '2022',
    semester: 4,
    subjectCode: '21EC42',
    subjectName: 'Digital Signal Processing',
    downloadsCount: 1850,
    bookmarksCount: 420,
    viewsCount: 5400,
    fileSize: '45.0 MB',
    isAccessDisabled: false,
    offlineCacheEnabled: true,
    eTag: 'W/"dsp-vid-2022-47185920"',
    lastDownloadedDate: '2026-09-06 10:50',
  },
];

const TYPE_DISTRIBUTIONS: TypeDistribution[] = [
  { resourceType: 'NOTES', label: 'Study & Lecture Notes', downloadsCount: 48900, bookmarksCount: 14200, percentage: 42 },
  { resourceType: 'QUESTION_PAPER', label: 'Previous Year Papers (PYQ)', downloadsCount: 38400, bookmarksCount: 11500, percentage: 33 },
  { resourceType: 'PASSING_PACKAGE', label: '1-Night Passing Packages', downloadsCount: 18200, bookmarksCount: 5400, percentage: 16 },
  { resourceType: 'FORMULA_SHEET', label: 'Formula & Revision Sheets', downloadsCount: 7100, bookmarksCount: 2800, percentage: 6 },
  { resourceType: 'VIDEO_LECTURE', label: 'Video Lecture Series', downloadsCount: 3400, bookmarksCount: 1200, percentage: 3 },
];

const SEMESTER_DISTRIBUTIONS: SemesterDistribution[] = [
  { semesterNumber: 1, downloadsCount: 12400, bookmarksCount: 3100 },
  { semesterNumber: 2, downloadsCount: 11800, bookmarksCount: 2950 },
  { semesterNumber: 3, downloadsCount: 14200, bookmarksCount: 4100 },
  { semesterNumber: 4, downloadsCount: 16800, bookmarksCount: 4800 },
  { semesterNumber: 5, downloadsCount: 24500, bookmarksCount: 7600 },
  { semesterNumber: 6, downloadsCount: 18200, bookmarksCount: 5200 },
  { semesterNumber: 7, downloadsCount: 12100, bookmarksCount: 3800 },
  { semesterNumber: 8, downloadsCount: 6000, bookmarksCount: 1800 },
];

const SUBJECT_TELEMETRIES: SubjectTelemetry[] = [
  { subjectCode: '21CS53', subjectName: 'Database Management Systems', branchCode: 'CSE', downloadsCount: 18450, bookmarksCount: 5200 },
  { subjectCode: '21CS52', subjectName: 'Computer Networks', branchCode: 'CSE', downloadsCount: 15200, bookmarksCount: 4300 },
  { subjectCode: '21EC42', subjectName: 'Digital Signal Processing', branchCode: 'ECE', downloadsCount: 14800, bookmarksCount: 4100 },
  { subjectCode: '21CS54', subjectName: 'Theory of Computation', branchCode: 'CSE', downloadsCount: 11200, bookmarksCount: 3400 },
  { subjectCode: '18CS71', subjectName: 'Artificial Intelligence & ML', branchCode: 'CSE', downloadsCount: 9800, bookmarksCount: 2900 },
];

const TREND_POINTS: DownloadTrendPoint[] = [
  { date: 'Aug 10', notesDownloads: 1200, pyqDownloads: 950, packageDownloads: 450, totalDownloads: 2600 },
  { date: 'Aug 17', notesDownloads: 1450, pyqDownloads: 1100, packageDownloads: 520, totalDownloads: 3070 },
  { date: 'Aug 24', notesDownloads: 1800, pyqDownloads: 1500, packageDownloads: 890, totalDownloads: 4190 },
  { date: 'Aug 31', notesDownloads: 2400, pyqDownloads: 2100, packageDownloads: 1400, totalDownloads: 5900 },
  { date: 'Sep 06', notesDownloads: 3100, pyqDownloads: 2800, packageDownloads: 1950, totalDownloads: 7850 },
];

const RECENT_DOWNLOADS: RecentDownloadLog[] = [
  { id: 'dl-1', timestamp: '2026-09-07 04:42', resourceTitle: 'DBMS Module 1-5 Notes', resourceType: 'NOTES', subjectCode: '21CS53', branchCode: 'CSE', collegeRegion: 'BENGALURU' },
  { id: 'dl-2', timestamp: '2026-09-07 04:38', resourceTitle: 'DSP SEE 2025 Question Paper', resourceType: 'QUESTION_PAPER', subjectCode: '21EC42', branchCode: 'ECE', collegeRegion: 'MYSORE' },
  { id: 'dl-3', timestamp: '2026-09-07 04:31', resourceTitle: 'CN Passing Package', resourceType: 'PASSING_PACKAGE', subjectCode: '21CS52', branchCode: 'CSE', collegeRegion: 'BENGALURU' },
  { id: 'dl-4', timestamp: '2026-09-07 04:20', resourceTitle: 'TOC Formula Cheat Sheet', resourceType: 'FORMULA_SHEET', subjectCode: '21CS54', branchCode: 'CSE', collegeRegion: 'BELAGAVI' },
  { id: 'dl-5', timestamp: '2026-09-07 04:15', resourceTitle: 'DBMS Triggers Lecture Notes', resourceType: 'NOTES', subjectCode: '21CS53', branchCode: 'CSE', collegeRegion: 'KALABURAGI' },
];

interface AnalyticsStore {
  resources: ResourceTelemetryItem[];
  typeDistributions: TypeDistribution[];
  semesterDistributions: SemesterDistribution[];
  subjectTelemetries: SubjectTelemetry[];
  trendPoints: DownloadTrendPoint[];
  recentDownloads: RecentDownloadLog[];

  // Admin access control actions
  toggleResourceAccess: (id: string) => void;
  toggleOfflineCache: (id: string) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  resources: INITIAL_RESOURCE_ITEMS,
  typeDistributions: TYPE_DISTRIBUTIONS,
  semesterDistributions: SEMESTER_DISTRIBUTIONS,
  subjectTelemetries: SUBJECT_TELEMETRIES,
  trendPoints: TREND_POINTS,
  recentDownloads: RECENT_DOWNLOADS,

  toggleResourceAccess: (id) => {
    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === id ? { ...r, isAccessDisabled: !r.isAccessDisabled } : r
      ),
    }));
  },

  toggleOfflineCache: (id) => {
    set((state) => ({
      resources: state.resources.map((r) =>
        r.id === id ? { ...r, offlineCacheEnabled: !r.offlineCacheEnabled } : r
      ),
    }));
  },
}));
