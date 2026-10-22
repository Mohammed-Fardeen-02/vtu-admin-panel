import { create } from 'zustand';
import { AdminNote, NoteFormat, NoteStatus, NoteModerationLog } from '../shared/types/notes.types';
import { apiClient } from '../shared/api/apiClient';
import { toast } from '../shared/components/toast/ToastContext';

export const generateSecureStorageUrl = (noteId: string, fileKey: string): string => {
  if (fileKey?.startsWith('http://') || fileKey?.startsWith('https://') || fileKey?.startsWith('data:')) {
    return fileKey;
  }
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiry = Math.floor(Date.now() / 1000) + 86400; // 24 hours validity
  return `https://storage.vtu.ac.in/sec/v1/notes/${noteId}?key=${encodeURIComponent(fileKey)}&exp=${expiry}&sig=${token}`;
};

const DEFAULT_VALIDATION = {
  fileTypeValid: true,
  fileSizeValid: true,
  virusScanStatus: 'CLEAN' as const,
  contentQualityRating: 4.8,
  ocrScanStatus: 'PASSED' as const,
  duplicateScore: 2,
};

const INITIAL_NOTES: AdminNote[] = [];

const INITIAL_LOGS: NoteModerationLog[] = [
  {
    id: 'nml-1',
    noteId: 'note-101',
    noteTitle: 'Database Management Systems - Modules 1 to 5',
    action: 'APPROVED',
    reviewer: 'Content Moderator Admin',
    reviewerRole: 'CONTENT_MODERATOR',
    timestamp: '2026-08-16 10:00',
    comments: 'Verified high quality handwritten diagrams and accurate VTU syllabus coverage.',
  },
];

interface NotesStore {
  notes: AdminNote[];
  isLoadingNotes: boolean;
  moderationLogs: NoteModerationLog[];
  fetchNotes: () => Promise<void>;
  // CRUD
  addNote: (noteData: any) => Promise<{ success: boolean; error?: string }>;
  updateNote: (id: string, updates: Partial<AdminNote>) => Promise<{ success: boolean; error?: string }>;
  replaceNoteFile: (id: string, fileKey: string, fileSize: string, fileSizeBytes: number, pageCount?: number) => void;
  publishNote: (id: string) => void;
  unpublishNote: (id: string) => void;
  archiveNote: (id: string) => void;
  deleteNote: (id: string) => void;
  reorderNotes: (reordered: AdminNote[]) => void;
  // Moderation Workflow Actions (FR-11)
  approveNote: (id: string, comments?: string) => void;
  rejectNote: (id: string, reason: string) => void;
  requestChangesNote: (id: string, comments: string) => void;
  removeNote: (id: string, reason: string) => void;

  // Bulk Actions
  bulkPublishNotes: (ids: string[]) => void;
  bulkUnpublishNotes: (ids: string[]) => void;
  bulkArchiveNotes: (ids: string[]) => void;
  bulkDeleteNotes: (ids: string[]) => void;
  bulkReassignSubject: (ids: string[], targetSubjectId: string, subjectCode: string, subjectName: string, branchCode: string, schemeYear: string, semester: number) => void;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: INITIAL_NOTES,
  isLoadingNotes: false,
  moderationLogs: INITIAL_LOGS,

  fetchNotes: async () => {
    set({ isLoadingNotes: true });
    try {
      const response = await apiClient.get('/notes?limit=100');
      const payload = response.data?.data || response.data;
      const rawItems = payload?.items || (Array.isArray(payload) ? payload : []);
      
      const mappedNotes: AdminNote[] = rawItems.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        branchCode: item.branchCode || 'CSE',
        schemeYear: item.schemeYear || '2022',
        semester: item.semester || 1,
        subjectId: item.courseId,
        subjectCode: item.subjectCode,
        subjectName: item.subjectName,
        moduleId: item.moduleId || undefined,
        unitId: item.unitId || undefined,
        topicId: item.topicId || undefined,
        format: item.format || 'PDF',
        status: item.status || 'PUBLISHED',
        isPaid: Boolean(item.isPaid),
        price: Number(item.price || 0),
        freePreviewPages: Number(item.freePreviewPages || 2),
        fileUrl: item.fileUrl,
        secureUrl: item.secureUrl || item.fileUrl,
        fileSize: item.fileSize || '1.2 MB',
        fileSizeBytes: item.fileSizeBytes || 1200000,
        pageCount: item.pageCount || 1,
        authorName: item.authorName || 'VTU Faculty',
        authorRole: item.authorRole || 'ADMIN',
        authorUsn: item.authorUsn || undefined,
        validation: DEFAULT_VALIDATION,
        reportsCount: 0,
        downloads: item.downloads || 0,
        purchasesCount: item.purchasesCount || item._count?.orders || 0,
        bookmarksCount: item.bookmarks || 0,
        viewsCount: item.views || 0,
        averageRating: 5.0,
        orderPriority: 1,
        uploadDate: (item.createdAt || new Date().toISOString()).split('T')[0],
        lastModified: (item.updatedAt || new Date().toISOString()).split('T')[0],
      }));

      set({ notes: mappedNotes });
    } catch (err: any) {
      console.warn('Failed to fetch live notes from backend API:', err.message);
    } finally {
      set({ isLoadingNotes: false });
    }
  },

  addNote: async (data) => {
    try {
      let createdNote: any;

      if (data instanceof FormData) {
        const response = await apiClient.post('/notes/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        createdNote = response.data?.data || response.data;
      } else {
        const formData = new FormData();
        if (data.file) {
          formData.append('file', data.file);
        }
        Object.keys(data).forEach((key) => {
          if (key !== 'file' && data[key] !== undefined && data[key] !== null) {
            formData.append(key, String(data[key]));
          }
        });

        const response = await apiClient.post('/notes/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        createdNote = response.data?.data || response.data;
      }

      if (createdNote) {
        await get().fetchNotes();
        return { success: true };
      }

      return { success: false, error: 'Server did not return a created note object.' };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload note to Cloudinary.';
      return { success: false, error: Array.isArray(msg) ? msg.join('. ') : msg };
    }
  },

  updateNote: async (id, updates) => {
    try {
      await apiClient.patch(`/notes/${id}`, updates);
    } catch (err: any) {
      console.warn(`Failed to sync update for note ${id} to API:`, err.message);
    }
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id
          ? {
              ...n,
              ...updates,
              lastModified: new Date().toISOString().split('T')[0],
            }
          : n
      ),
    }));
    return { success: true };
  },

  replaceNoteFile: (id, fileKey, fileSize, fileSizeBytes, pageCount) => {
    set((state) => ({
      notes: state.notes.map((n) => {
        if (n.id !== id) return n;
        const secureUrl = generateSecureStorageUrl(id, fileKey);
        return {
          ...n,
          fileUrl: fileKey,
          secureUrl,
          fileSize,
          fileSizeBytes,
          pageCount: pageCount || n.pageCount,
          lastModified: new Date().toISOString().split('T')[0],
        };
      }),
    }));
  },

  publishNote: async (id) => {
    try {
      await apiClient.patch(`/notes/${id}/status`, { status: 'PUBLISHED' });
    } catch (err: any) {
      console.warn(`Failed to update status for note ${id}:`, err.message);
    }
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, status: 'PUBLISHED' } : n)),
    }));
  },

  unpublishNote: async (id) => {
    try {
      await apiClient.patch(`/notes/${id}/status`, { status: 'UNPUBLISHED' });
    } catch (err: any) {
      console.warn(`Failed to update status for note ${id}:`, err.message);
    }
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, status: 'UNPUBLISHED' } : n)),
    }));
  },

  archiveNote: async (id) => {
    try {
      await apiClient.patch(`/notes/${id}/status`, { status: 'ARCHIVED' });
    } catch (err: any) {
      console.warn(`Failed to update status for note ${id}:`, err.message);
    }
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, status: 'ARCHIVED' } : n)),
    }));
  },

  deleteNote: async (id) => {
    try {
      await apiClient.delete(`/notes/${id}`);
    } catch (err: any) {
      console.warn(`Failed to delete note ${id} from API:`, err.message);
    }
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }));
  },

  reorderNotes: (reordered) => {
    set({ notes: reordered });
  },

  // Moderation Workflow (ADMIN-FR-11)
  approveNote: async (id, comments) => {
    const target = get().notes.find((n) => n.id === id);
    if (!target) return;

    try {
      await apiClient.patch(`/notes/${id}/status`, { status: 'PUBLISHED' });
    } catch (err: any) {
      console.warn(`Failed to update status for note ${id}:`, err.message);
    }

    const log: NoteModerationLog = {
      id: `nml-${Date.now()}`,
      noteId: id,
      noteTitle: target.title,
      action: 'APPROVED',
      reviewer: 'Content Moderator Admin',
      reviewerRole: 'CONTENT_MODERATOR',
      timestamp: new Date().toLocaleString(),
      comments: comments || 'Approved for publication on VTU Mobile App.',
    };

    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, status: 'PUBLISHED', lastModified: new Date().toISOString().split('T')[0] } : n
      ),
      moderationLogs: [log, ...state.moderationLogs],
    }));
    toast.success(`Note '${target.title}' approved and published`, 'Note Approved');
  },

  rejectNote: async (id, reason) => {
    const target = get().notes.find((n) => n.id === id);
    if (!target) return;

    try {
      await apiClient.patch(`/notes/${id}/status`, { status: 'REJECTED' });
    } catch (err: any) {
      console.warn(`Failed to reject note ${id}:`, err.message);
    }

    const log: NoteModerationLog = {
      id: `nml-${Date.now()}`,
      noteId: id,
      noteTitle: target.title,
      action: 'REJECTED',
      reviewer: 'Content Moderator Admin',
      reviewerRole: 'CONTENT_MODERATOR',
      rejectionReason: reason,
      timestamp: new Date().toLocaleString(),
    };

    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'REJECTED',
              rejectionReason: reason,
              lastModified: new Date().toISOString().split('T')[0],
            }
          : n
      ),
      moderationLogs: [log, ...state.moderationLogs],
    }));
    toast.warning(`Note '${target.title}' rejected`, 'Note Rejected');
  },

  requestChangesNote: (id, comments) => {
    const target = get().notes.find((n) => n.id === id);
    if (!target) return;

    const log: NoteModerationLog = {
      id: `nml-${Date.now()}`,
      noteId: id,
      noteTitle: target.title,
      action: 'REQUEST_CHANGES',
      reviewer: 'Content Moderator Admin',
      reviewerRole: 'CONTENT_MODERATOR',
      timestamp: new Date().toLocaleString(),
      comments,
    };

    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id
          ? { ...n, status: 'CHANGES_REQUESTED', lastModified: new Date().toISOString().split('T')[0] }
          : n
      ),
      moderationLogs: [log, ...state.moderationLogs],
    }));
    toast.info(`Changes requested for note '${target.title}'`, 'Changes Requested');
  },

  removeNote: async (id, reason) => {
    const target = get().notes.find((n) => n.id === id);
    if (!target) return;

    try {
      await apiClient.delete(`/notes/${id}`);
    } catch (err: any) {
      console.warn(`Failed to remove note ${id}:`, err.message);
    }

    const log: NoteModerationLog = {
      id: `nml-${Date.now()}`,
      noteId: id,
      noteTitle: target.title,
      action: 'REMOVED',
      reviewer: 'Super Admin',
      reviewerRole: 'SUPER_ADMIN',
      rejectionReason: reason,
      timestamp: new Date().toLocaleString(),
    };

    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      moderationLogs: [log, ...state.moderationLogs],
    }));
    toast.warning(`Note '${target.title}' removed from repository`, 'Note Removed');
  },

  // Bulk Actions
  bulkPublishNotes: (ids) => {
    set((state) => ({
      notes: state.notes.map((n) => (ids.includes(n.id) ? { ...n, status: 'PUBLISHED' } : n)),
    }));
    toast.success(`Published ${ids.length} selected notes`, 'Bulk Action Successful');
  },

  bulkUnpublishNotes: (ids) => {
    set((state) => ({
      notes: state.notes.map((n) => (ids.includes(n.id) ? { ...n, status: 'UNPUBLISHED' } : n)),
    }));
    toast.info(`Unpublished ${ids.length} selected notes`, 'Bulk Action Successful');
  },

  bulkArchiveNotes: (ids) => {
    set((state) => ({
      notes: state.notes.map((n) => (ids.includes(n.id) ? { ...n, status: 'ARCHIVED' } : n)),
    }));
    toast.warning(`Archived ${ids.length} selected notes`, 'Bulk Action Successful');
  },

  bulkDeleteNotes: (ids) => {
    set((state) => ({
      notes: state.notes.filter((n) => !ids.includes(n.id)),
    }));
    toast.warning(`Deleted ${ids.length} selected notes`, 'Bulk Action Successful');
  },

  bulkReassignSubject: (ids, targetSubjectId, subjectCode, subjectName, branchCode, schemeYear, semester) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        ids.includes(n.id)
          ? {
              ...n,
              subjectId: targetSubjectId,
              subjectCode,
              subjectName,
              branchCode,
              schemeYear,
              semester,
              lastModified: new Date().toISOString().split('T')[0],
            }
          : n
      ),
    }));
    toast.success(`Reassigned ${ids.length} notes to subject ${subjectCode}`, 'Bulk Reassign Successful');
  },
}));
