import { create } from 'zustand';
import { AdminQuestionPaper, PaperType, ExamCategory, PaperStatus } from '../shared/types/papers.types';
import { useAcademicStore } from './useAcademicStore';
import { apiClient } from '../shared/api/apiClient';

export const generateSecurePaperUrl = (paperId: string, fileKey: string): string => {
  if (fileKey?.startsWith('http://') || fileKey?.startsWith('https://') || fileKey?.startsWith('data:')) {
    return fileKey;
  }
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiry = Math.floor(Date.now() / 1000) + 86400; // 24 hours validity
  return `https://storage.vtu.ac.in/sec/v1/papers/${paperId}?key=${encodeURIComponent(fileKey)}&exp=${expiry}&sig=${token}`;
};

const INITIAL_PAPERS: AdminQuestionPaper[] = [
  {
    id: 'paper-101',
    title: 'Software Engineering (21CS51) SEE Examination - Jan/Feb 2025',
    contentType: 'DIGITAL_TYPED',
    branchCode: 'CSE',
    schemeYear: '2021',
    semester: 5,
    subjectId: 'subj-101',
    subjectCode: '21CS51',
    subjectName: 'Software Engineering & Project Management',
    year: 2025,
    month: 'Jan/Feb',
    maxMarks: 100,
    durationHours: 3.0,
    paperType: 'SEE_THEORY',
    examCategory: 'REGULAR',
    hasSolutionKey: true,
    status: 'PUBLISHED',
    fileUrl: 's3://vtu-papers-prod/cse/2021/sem5/21CS51_SEE_2025.pdf',
    secureUrl: generateSecurePaperUrl('paper-101', '21CS51_SEE_2025.pdf'),
    fileSize: '3.6 MB',
    fileSizeBytes: 3774873,
    pageCount: 5,
    downloads: 3450,
    viewsCount: 14200,
    uploadedBy: 'VTU Controller of Examinations',
    uploadDate: '2025-03-01',
    lastModified: '2025-03-01',
    modulesData: [
      {
        moduleNumber: 1,
        title: 'Module 1: Introduction to Software Engineering & Requirements',
        mainQuestions: [
          {
            questionNumber: 'Q1',
            choices: [
              {
                choiceId: 'Q1a',
                subQuestions: [
                  {
                    subCode: 'a',
                    text: 'Explain professional responsibility and software engineering ethics with examples.',
                    marks: 6,
                    bloomLevel: 'L2',
                    solution: 'Software engineers have responsibilities to clients and society: Confidentiality, Competence, IP rights, Computer misuse.'
                  },
                  {
                    subCode: 'b',
                    text: 'Compare Waterfall model and Agile Software Development process models.',
                    marks: 7,
                    bloomLevel: 'L3',
                    solution: 'Waterfall is sequential & document-driven. Agile focuses on iterative sprints, working code & customer feedback.'
                  },
                  {
                    subCode: 'c',
                    text: 'Define Functional and Non-Functional requirements for a Banking Application.',
                    marks: 7,
                    bloomLevel: 'L1',
                    solution: 'Functional: Fund transfer, Account balance. Non-Functional: 99.9% uptime, API response < 200ms.'
                  }
                ]
              },
              {
                choiceId: 'Q1b',
                isOrOption: true,
                subQuestions: [
                  {
                    subCode: 'a',
                    text: 'Elaborate Requirement Engineering Process activities with a block diagram.',
                    marks: 10,
                    bloomLevel: 'L2',
                    solution: 'Activities: Inception, Elicitation, Analysis, SRS Specification, Validation, Management.'
                  },
                  {
                    subCode: 'b',
                    text: 'Discuss Scrum Agile framework including Roles, Artifacts, and Ceremonies.',
                    marks: 10,
                    bloomLevel: 'L4',
                    solution: 'Scrum Roles: Product Owner, Scrum Master, Team. Artifacts: Backlogs. Ceremonies: Daily Standup, Retrospective.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'paper-102',
    title: 'Computer Networks (21CS52) SEE Regular Examination - June/July 2025',
    contentType: 'PDF_UPLOAD',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    subjectId: 'subj-102',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks',
    year: 2025,
    paperType: 'SEE_THEORY',
    examCategory: 'REGULAR',
    hasSolutionKey: true,
    status: 'PUBLISHED',
    fileUrl: 's3://vtu-papers-prod/cse/2022/sem5/21CS52_SEE_2025.pdf',
    secureUrl: generateSecurePaperUrl('paper-102', '21CS52_SEE_2025.pdf'),
    fileSize: '4.1 MB',
    fileSizeBytes: 4299161,
    pageCount: 8,
    downloads: 2890,
    viewsCount: 9800,
    uploadedBy: 'VTU Controller of Examinations',
    uploadDate: '2025-08-10',
    lastModified: '2025-08-10',
  },
];

interface PaperStore {
  papers: AdminQuestionPaper[];
  isLoadingPapers: boolean;
  fetchPapers: () => Promise<void>;
  // CRUD
  addPaper: (paperData: any) => Promise<{ success: boolean; error?: string }>;
  updatePaper: (id: string, updates: Partial<AdminQuestionPaper>) => Promise<{ success: boolean; error?: string }>;
  replacePaperFile: (id: string, fileKey: string, fileSize: string, fileSizeBytes: number, pageCount?: number) => void;
  publishPaper: (id: string) => void;
  unpublishPaper: (id: string) => void;
  archivePaper: (id: string) => void;
  deletePaper: (id: string) => void;
  reorderPapers: (reordered: AdminQuestionPaper[]) => void;
  // Bulk operations
  bulkPublishPapers: (ids: string[]) => void;
  bulkUnpublishPapers: (ids: string[]) => void;
  bulkArchivePapers: (ids: string[]) => void;
  bulkDeletePapers: (ids: string[]) => void;
  bulkReassignSubject: (ids: string[], targetSubjectId: string, subjectCode: string, subjectName: string, branchCode: string, schemeYear: string, semester: number) => void;
}

export const usePaperStore = create<PaperStore>((set, get) => ({
  papers: INITIAL_PAPERS,
  isLoadingPapers: false,

  fetchPapers: async () => {
    set({ isLoadingPapers: true });
    try {
      const response = await apiClient.get('/question-papers?limit=100');
      const payload = response.data?.data || response.data;
      const rawItems = Array.isArray(payload) ? payload : (payload?.items || payload?.data || []);

      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const mappedPapers: AdminQuestionPaper[] = rawItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          contentType: item.contentType || 'DIGITAL_TYPED',
          paperType: item.paperType || 'SEE_THEORY',
          examCategory: item.examCategory || 'REGULAR',
          year: item.year || 2025,
          month: item.month || 'Jan/Feb',
          maxMarks: item.maxMarks || 100,
          durationHours: item.durationHours || 3.0,
          branchCode: item.branchCode || 'CSE',
          schemeYear: item.schemeYear || '2021',
          semester: item.semester || 1,
          subjectId: item.courseId || item.subjectId || 'subj-101',
          subjectCode: item.subjectCode,
          subjectName: item.subjectName,
          pdfUrl: item.pdfUrl,
          solutionPdfUrl: item.solutionPdfUrl,
          fileUrl: item.pdfUrl || item.fileUrl || 's3://vtu-papers-prod/official_paper.pdf',
          secureUrl: generateSecurePaperUrl(item.id, item.pdfUrl || 'official_paper.pdf'),
          fileSize: item.fileSize || '2.5 MB',
          fileSizeBytes: item.fileSizeBytes || 2621440,
          pageCount: item.pageCount || 4,
          modulesData: item.modulesData,
          hasSolutionKey: Boolean(item.hasSolutionKey) || Boolean(item.solutionPdfUrl),
          status: item.status || 'PUBLISHED',
          uploadedBy: item.uploadedBy || 'VTU Exam Cell',
          downloads: item.downloads || 0,
          viewsCount: item.viewsCount || 0,
          uploadDate: (item.createdAt || new Date().toISOString()).split('T')[0],
          lastModified: (item.updatedAt || new Date().toISOString()).split('T')[0],
        }));

        set({ papers: mappedPapers });
      }
    } catch (err: any) {
      console.warn('Failed to fetch live question papers from API:', err.message);
    } finally {
      set({ isLoadingPapers: false });
    }
  },

  addPaper: async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || '',
        contentType: data.contentType || 'DIGITAL_TYPED',
        paperType: data.paperType || 'SEE_THEORY',
        examCategory: data.examCategory || 'REGULAR',
        year: Number(data.year) || 2025,
        month: data.month || 'Jan/Feb',
        maxMarks: Number(data.maxMarks) || 100,
        durationHours: Number(data.durationHours) || 3.0,
        branchCode: data.branchCode,
        schemeYear: data.schemeYear,
        semester: Number(data.semester) || 1,
        courseId: data.subjectId || data.courseId,
        subjectCode: data.subjectCode,
        subjectName: data.subjectName,
        pdfUrl: data.fileUrl || data.pdfUrl,
        solutionPdfUrl: data.solutionPdfUrl,
        fileSize: data.fileSize,
        fileSizeBytes: data.fileSizeBytes,
        pageCount: data.pageCount,
        modulesData: data.modulesData,
        status: data.status || 'PUBLISHED',
        hasSolutionKey: Boolean(data.hasSolutionKey),
        uploadedBy: data.uploadedBy || 'VTU Exam Panel',
      };

      // Post to backend database API
      const response = await apiClient.post('/question-papers', payload);
      const createdItem = response.data?.data || response.data;

      const newPaper: AdminQuestionPaper = {
        ...data,
        id: createdItem?.id || `paper-${Date.now()}`,
        fileUrl: createdItem?.pdfUrl || data.fileUrl,
        secureUrl: generateSecurePaperUrl(createdItem?.id || `paper-${Date.now()}`, data.fileUrl || 'paper.pdf'),
        downloads: 0,
        viewsCount: 1,
        uploadDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
      };

      const { papers } = get();
      set({ papers: [newPaper, ...papers] });

      // Refresh list from backend
      get().fetchPapers();
      return { success: true };
    } catch (err: any) {
      const errorMsg = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(', ')
        : err.response?.data?.message || err.message || 'Failed to save question paper to database';
      console.error('[AddPaper Error]:', errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  updatePaper: async (id, updates) => {
    const { papers } = get();
    const target = papers.find((p) => p.id === id);
    if (!target) return { success: false, error: 'Question Paper not found.' };

    const payload: any = { ...updates };
    if (updates.fileUrl) payload.pdfUrl = updates.fileUrl;
    if (updates.subjectId) payload.courseId = updates.subjectId;

    try {
      await apiClient.patch(`/question-papers/${id}`, payload);
      set((state) => ({
        papers: state.papers.map((p) =>
          p.id === id
            ? {
                ...p,
                ...updates,
                lastModified: new Date().toISOString().split('T')[0],
              }
            : p
        ),
      }));
      return { success: true };
    } catch (err: any) {
      const errorMsg = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(', ')
        : err.response?.data?.message || err.message || 'Failed to update question paper in database';
      console.error('[UpdatePaper Error]:', errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  replacePaperFile: (id, fileKey, fileSize, fileSizeBytes, pageCount) => {
    apiClient.patch(`/question-papers/${id}`, { fileUrl: fileKey, fileSize, fileSizeBytes, pageCount }).catch(() => {});
    set((state) => ({
      papers: state.papers.map((p) => {
        if (p.id !== id) return p;
        const secureUrl = generateSecurePaperUrl(id, fileKey);
        return {
          ...p,
          fileUrl: fileKey,
          secureUrl,
          fileSize,
          fileSizeBytes,
          pageCount: pageCount || p.pageCount,
          lastModified: new Date().toISOString().split('T')[0],
        };
      }),
    }));
  },

  publishPaper: (id) => {
    apiClient.patch(`/question-papers/${id}`, { status: 'PUBLISHED' }).catch(() => {});
    set((state) => ({
      papers: state.papers.map((p) => (p.id === id ? { ...p, status: 'PUBLISHED' } : p)),
    }));
  },

  unpublishPaper: (id) => {
    apiClient.patch(`/question-papers/${id}`, { status: 'UNPUBLISHED' }).catch(() => {});
    set((state) => ({
      papers: state.papers.map((p) => (p.id === id ? { ...p, status: 'UNPUBLISHED' } : p)),
    }));
  },

  archivePaper: (id) => {
    apiClient.patch(`/question-papers/${id}`, { status: 'ARCHIVED' }).catch(() => {});
    set((state) => ({
      papers: state.papers.map((p) => (p.id === id ? { ...p, status: 'ARCHIVED' } : p)),
    }));
  },

  deletePaper: (id) => {
    apiClient.delete(`/question-papers/${id}`).catch(() => {});
    set((state) => ({
      papers: state.papers.filter((p) => p.id !== id),
    }));
  },

  reorderPapers: (reordered) => {
    set({ papers: reordered });
  },

  // Bulk Operations
  bulkPublishPapers: (ids) => {
    ids.forEach((id) => apiClient.patch(`/question-papers/${id}`, { status: 'PUBLISHED' }).catch(() => {}));
    set((state) => ({
      papers: state.papers.map((p) => (ids.includes(p.id) ? { ...p, status: 'PUBLISHED' } : p)),
    }));
  },

  bulkUnpublishPapers: (ids) => {
    ids.forEach((id) => apiClient.patch(`/question-papers/${id}`, { status: 'UNPUBLISHED' }).catch(() => {}));
    set((state) => ({
      papers: state.papers.map((p) => (ids.includes(p.id) ? { ...p, status: 'UNPUBLISHED' } : p)),
    }));
  },

  bulkArchivePapers: (ids) => {
    ids.forEach((id) => apiClient.patch(`/question-papers/${id}`, { status: 'ARCHIVED' }).catch(() => {}));
    set((state) => ({
      papers: state.papers.map((p) => (ids.includes(p.id) ? { ...p, status: 'ARCHIVED' } : p)),
    }));
  },

  bulkDeletePapers: (ids) => {
    ids.forEach((id) => apiClient.delete(`/question-papers/${id}`).catch(() => {}));
    set((state) => ({
      papers: state.papers.filter((p) => !ids.includes(p.id)),
    }));
  },

  bulkReassignSubject: (ids, targetSubjectId, subjectCode, subjectName, branchCode, schemeYear, semester) => {
    ids.forEach((id) =>
      apiClient
        .patch(`/question-papers/${id}`, {
          courseId: targetSubjectId,
          subjectCode,
          subjectName,
          branchCode,
          schemeYear,
          semester,
        })
        .catch(() => {})
    );
    set((state) => ({
      papers: state.papers.map((p) =>
        ids.includes(p.id)
          ? {
              ...p,
              subjectId: targetSubjectId,
              subjectCode,
              subjectName,
              branchCode,
              schemeYear,
              semester,
              lastModified: new Date().toISOString().split('T')[0],
            }
          : p
      ),
    }));
  },
}));
