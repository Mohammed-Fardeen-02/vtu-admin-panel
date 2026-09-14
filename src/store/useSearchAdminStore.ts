import { create } from 'zustand';
import {
  SearchIndexProjection,
  FailedIndexingJob,
  SearchEntityType,
  IndexingStatus,
} from '../shared/types/searchAdmin.types';

interface SearchAdminStoreState {
  projections: SearchIndexProjection[];
  failedJobs: FailedIndexingJob[];
  searchQuery: string;
  filterEntityType: SearchEntityType | 'ALL';
  filterStatus: IndexingStatus | 'ALL';

  setSearchQuery: (query: string) => void;
  setFilterEntityType: (type: SearchEntityType | 'ALL') => void;
  setFilterStatus: (status: IndexingStatus | 'ALL') => void;

  reindexItem: (id: string) => void;
  reindexAll: () => void;
  removeFromSearch: (id: string) => void;
  restoreToSearch: (id: string) => void;
  updateMetadataAliases: (id: string, keywords: string[], aliases: string[]) => void;
  retryFailedJob: (jobId: string) => void;
}

const INITIAL_PROJECTIONS: SearchIndexProjection[] = [
  {
    id: 'idx-1',
    entityType: 'NOTES',
    canonicalId: 'note-101',
    subjectCode: '21CS53',
    subjectName: 'Database Management Systems',
    title: 'Database Management Systems - Modules 1 to 5 Comprehensive Notes',
    keywords: ['DBMS', 'SQL', 'Normalization', 'Relational Algebra', 'ER Diagrams'],
    aliases: ['Database Systems', 'DBMS Notes', '21CS53 Notes', 'SQL Queries'],
    status: 'INDEXED',
    lastIndexedAt: '2026-09-06 04:00',
    documentScore: 0.98,
  },
  {
    id: 'idx-2',
    entityType: 'PASSING_PACKAGE',
    canonicalId: 'pkg-101',
    subjectCode: '21MAT31',
    subjectName: 'Transform Calculus, Fourier Series & Numerical Techniques',
    title: '21MAT31 Engineering Mathematics III - Passing Package & High Yield Guide',
    keywords: ['Maths 3', '21MAT31', 'Fourier Series', 'Laplace', 'Runge Kutta'],
    aliases: ['Engineering Mathematics III', 'Maths 3 Passing Package', 'M3 VTU'],
    status: 'INDEXED',
    lastIndexedAt: '2026-09-06 04:00',
    documentScore: 0.95,
  },
  {
    id: 'idx-3',
    entityType: 'PYQ',
    canonicalId: 'paper-201',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks',
    title: 'Computer Networks 2024 July SEE Exam Question Paper',
    keywords: ['CN', 'Question Paper', 'VTU SEE 2024', 'Sockets'],
    aliases: ['21CS52 PYQ', 'CN Solved Papers'],
    status: 'OUT_OF_SYNC',
    lastIndexedAt: '2026-08-15 10:00',
    documentScore: 0.82,
  },
  {
    id: 'idx-4',
    entityType: 'VIDEO',
    canonicalId: 'vid-401',
    subjectCode: '21CS32',
    subjectName: 'Data Structures and Applications',
    title: 'VTU Data Structures Full Playlist - Stack, Queue & Linked List',
    keywords: ['DSA', 'Data Structures', 'C Programming', 'Trees'],
    aliases: ['Data Structures Video Course', '21CS32 Video Lectures'],
    status: 'INDEXING_FAILED',
    lastIndexedAt: '2026-09-05 18:30',
    documentScore: 0.0,
  },
];

const INITIAL_FAILED_JOBS: FailedIndexingJob[] = [
  {
    id: 'job-501',
    projectionId: 'idx-4',
    entityTitle: 'VTU Data Structures Full Playlist',
    entityType: 'VIDEO',
    errorMessage: 'Search Engine Elastic Indexer Timeout: Payload size exceeds single chunk threshold.',
    timestamp: '2026-09-05 18:30',
    retryCount: 2,
  },
];

export const useSearchAdminStore = create<SearchAdminStoreState>((set, get) => ({
  projections: INITIAL_PROJECTIONS,
  failedJobs: INITIAL_FAILED_JOBS,
  searchQuery: '',
  filterEntityType: 'ALL',
  filterStatus: 'ALL',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterEntityType: (type) => set({ filterEntityType: type }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  reindexItem: (id) => {
    const now = new Date().toLocaleString();
    set((state) => ({
      projections: state.projections.map((p) =>
        p.id === id ? { ...p, status: 'INDEXED', lastIndexedAt: now, documentScore: 0.99 } : p
      ),
      failedJobs: state.failedJobs.filter((j) => j.projectionId !== id),
    }));
  },

  reindexAll: () => {
    const now = new Date().toLocaleString();
    set((state) => ({
      projections: state.projections.map((p) =>
        p.status !== 'REMOVED_FROM_SEARCH' ? { ...p, status: 'INDEXED', lastIndexedAt: now } : p
      ),
      failedJobs: [],
    }));
  },

  removeFromSearch: (id) => {
    set((state) => ({
      projections: state.projections.map((p) =>
        p.id === id ? { ...p, status: 'REMOVED_FROM_SEARCH' } : p
      ),
    }));
  },

  restoreToSearch: (id) => {
    const now = new Date().toLocaleString();
    set((state) => ({
      projections: state.projections.map((p) =>
        p.id === id ? { ...p, status: 'INDEXED', lastIndexedAt: now } : p
      ),
    }));
  },

  updateMetadataAliases: (id, keywords, aliases) => {
    set((state) => ({
      projections: state.projections.map((p) =>
        p.id === id ? { ...p, keywords, aliases } : p
      ),
    }));
  },

  retryFailedJob: (jobId) => {
    const targetJob = get().failedJobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    get().reindexItem(targetJob.projectionId);
  },
}));
