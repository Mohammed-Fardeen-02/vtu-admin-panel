import { create } from 'zustand';
import { VTUCourse, VTUVideo, VideoStatus } from '../shared/types/video.types';
import { apiClient } from '../shared/api/apiClient';

interface VideoStoreState {
  courses: VTUCourse[];
  searchQuery: string;
  filterBranch: string;
  filterScheme: string;
  filterSemester: string;
  filterStatus: string;
  isLoading: boolean;

  fetchCourses: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  setFilterBranch: (b: string) => void;
  setFilterScheme: (s: string) => void;
  setFilterSemester: (sem: string) => void;
  setFilterStatus: (st: string) => void;

  createCourse: (data: Omit<VTUCourse, 'id' | 'createdAt' | 'updatedAt' | 'enrolledStudentsCount' | 'videos' | 'modules'>) => Promise<string>;
  updateCourse: (id: string, updates: Partial<VTUCourse>) => Promise<void>;
  publishCourse: (id: string) => Promise<void>;
  unpublishCourse: (id: string) => Promise<void>;
  archiveCourse: (id: string) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;

  importYouTubePlaylist: (courseId: string, playlistUrlOrId: string, videos?: any[]) => Promise<void>;
  addVideoToModule: (courseId: string, video: { moduleNumber: number; unitName: string; topicName?: string; title: string; description?: string; youtubeUrl: string; durationText?: string }) => Promise<void>;
  assignVideoToUnitTopic: (courseId: string, videoId: string, moduleId: string, unitId: string, topicName: string) => void;
  reorderCourseVideos: (courseId: string, videos: VTUVideo[]) => void;
  linkVideoRelationships: (videoId: string, noteId?: string, pyqId?: string, packageId?: string) => void;
}

const INITIAL_COURSES: VTUCourse[] = [
  {
    id: 'course-101',
    title: 'Database Management Systems Full Video Course',
    description: 'Complete VTU 2022 scheme video series covering ER Modeling, Relational Algebra, SQL, Normalization, and Transaction Management.',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    subjectCode: '21CS53',
    subjectName: 'Database Management Systems',
    thumbnailUrl: 'https://img.youtube.com/vi/3EJOX2kGi9Q/hqdefault.jpg',
    youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_CUQ-FXxgzKQ1dwr_ZJWZ',
    youtubePlaylistId: 'PLBlnK6fEyqRi_CUQ-FXxgzKQ1dwr_ZJWZ',
    instructorName: 'Prof. Ramesh B.',
    status: 'PUBLISHED',
    enrolledStudentsCount: 4890,
    createdAt: '2026-08-01',
    updatedAt: '2026-08-20',
    modules: [
      {
        id: 'mod-1',
        moduleNumber: 1,
        title: 'Module 1: Introduction & ER Modeling',
        description: 'Database architecture, 3-schema architecture, entity types, relationship sets, and ER to relational mapping.',
        unitName: 'Unit 1: ER Diagrams',
        videosCount: 3,
      },
      {
        id: 'mod-2',
        moduleNumber: 2,
        title: 'Module 2: Relational Model & SQL',
        description: 'Relational algebra operators, DDL/DML statements, nested subqueries, and views.',
        unitName: 'Unit 2: SQL Mastery',
        videosCount: 2,
      },
    ],
    videos: [
      {
        id: 'vid-1',
        youtubeVideoId: '3EJOX2kGi9Q',
        youtubeUrl: 'https://www.youtube.com/watch?v=3EJOX2kGi9Q',
        title: 'Lecture 1: Introduction to Database Management Systems',
        description: 'Concept of data, DBMS architecture, DBMS vs File System.',
        thumbnailUrl: 'https://img.youtube.com/vi/3EJOX2kGi9Q/hqdefault.jpg',
        durationText: '18:45',
        durationSeconds: 1125,
        courseId: 'course-101',
        moduleId: 'mod-1',
        unitId: 'u-1',
        unitName: 'Unit 1: ER Diagrams',
        topicName: 'DBMS Architecture',
        displayOrder: 1,
        status: 'PUBLISHED',
        relatedNoteId: 'note-101',
        viewsCount: 12400,
      },
      {
        id: 'vid-2',
        youtubeVideoId: 'f0Xz-0X78h4',
        youtubeUrl: 'https://www.youtube.com/watch?v=f0Xz-0X78h4',
        title: 'Lecture 2: Entity Relationship (ER) Diagrams Complete Guide',
        description: 'Entities, attributes, keys, and strong vs weak entity sets.',
        thumbnailUrl: 'https://img.youtube.com/vi/f0Xz-0X78h4/hqdefault.jpg',
        durationText: '24:10',
        durationSeconds: 1450,
        courseId: 'course-101',
        moduleId: 'mod-1',
        unitId: 'u-1',
        unitName: 'Unit 1: ER Diagrams',
        topicName: 'ER Diagram Notation',
        displayOrder: 2,
        status: 'PUBLISHED',
        relatedPackageId: 'pkg-101',
        viewsCount: 8900,
      },
    ],
  },
];

export const useVideoStore = create<VideoStoreState>((set, get) => ({
  courses: INITIAL_COURSES,
  searchQuery: '',
  filterBranch: 'ALL',
  filterScheme: 'ALL',
  filterSemester: 'ALL',
  filterStatus: 'ALL',
  isLoading: false,

  fetchCourses: async () => {
    set({ isLoading: true });
    try {
      const res: any = await apiClient.get('/videos/courses');
      const body = res.data?.data || res.data || res;
      const rawList = Array.isArray(body) ? body : body.items || [];
      if (Array.isArray(rawList) && rawList.length > 0) {
        const detailedList: VTUCourse[] = await Promise.all(
          rawList.map(async (c: any) => {
            try {
              const detailRes: any = await apiClient.get(`/videos/courses/${c.id}`);
              const d = detailRes.data?.data || detailRes.data || detailRes;
              return {
                id: d.id,
                title: d.title,
                description: d.description || '',
                branchCode: d.branchCode,
                schemeYear: d.schemeYear,
                semester: d.semester,
                subjectCode: d.subjectCode,
                subjectName: d.subjectName,
                thumbnailUrl: d.thumbnailUrl,
                instructorName: d.instructorName,
                youtubePlaylistUrl: d.youtubePlaylistUrl,
                youtubePlaylistId: d.youtubePlaylistId,
                status: d.status as VideoStatus,
                enrolledStudentsCount: d.enrolledCount || 0,
                modules: d.modules || [],
                videos: d.allLessons || [],
                createdAt: d.createdAt ? d.createdAt.split('T')[0] : '2026-09-01',
                updatedAt: d.updatedAt ? d.updatedAt.split('T')[0] : '2026-09-01',
              };
            } catch {
              return {
                id: c.id,
                title: c.title,
                description: c.description || '',
                branchCode: c.branchCode,
                schemeYear: c.schemeYear,
                semester: c.semester,
                subjectCode: c.subjectCode,
                subjectName: c.subjectName,
                thumbnailUrl: c.thumbnailUrl,
                instructorName: c.instructorName,
                youtubePlaylistUrl: c.youtubePlaylistUrl,
                youtubePlaylistId: c.youtubePlaylistId,
                status: c.status as VideoStatus,
                enrolledStudentsCount: c.enrolledCount || 0,
                modules: [],
                videos: [],
                createdAt: c.createdAt ? c.createdAt.split('T')[0] : '2026-09-01',
                updatedAt: c.updatedAt ? c.updatedAt.split('T')[0] : '2026-09-01',
              };
            }
          })
        );
        set({ courses: detailedList });
      }
    } catch (e) {
      console.warn('Failed to fetch courses from backend API:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterBranch: (b) => set({ filterBranch: b }),
  setFilterScheme: (s) => set({ filterScheme: s }),
  setFilterSemester: (sem) => set({ filterSemester: sem }),
  setFilterStatus: (st) => set({ filterStatus: st }),

  createCourse: async (data) => {
    const id = `course-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newCourse: VTUCourse = {
      ...data,
      id,
      modules: [],
      videos: [],
      enrolledStudentsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ courses: [newCourse, ...state.courses] }));

    try {
      const res: any = await apiClient.post('/videos/courses', {
        title: data.title,
        description: data.description,
        subjectCode: data.subjectCode,
        subjectName: data.subjectName,
        branchCode: data.branchCode,
        schemeYear: data.schemeYear,
        semester: Number(data.semester),
        thumbnailUrl: data.thumbnailUrl,
        instructorName: data.instructorName,
        youtubePlaylistUrl: data.youtubePlaylistUrl,
        status: data.status,
      });
      const saved = res.data?.data || res.data;
      if (saved?.id) {
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? { ...c, id: saved.id } : c)),
        }));
        get().fetchCourses();
        return saved.id;
      }
    } catch (e) {
      console.error('Failed to post course to backend API:', e);
    }
    return id;
  },

  updateCourse: async (id, updates) => {
    const now = new Date().toISOString().split('T')[0];
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: now } : c)),
    }));
    try {
      await apiClient.patch(`/videos/courses/${id}`, updates);
    } catch (e) {
      console.error('Failed to update course in backend:', e);
    }
  },

  publishCourse: async (id) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, status: 'PUBLISHED' } : c)),
    }));
    try {
      await apiClient.patch(`/videos/courses/${id}`, { status: 'PUBLISHED' });
    } catch {}
  },

  unpublishCourse: async (id) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, status: 'UNPUBLISHED' } : c)),
    }));
    try {
      await apiClient.patch(`/videos/courses/${id}`, { status: 'UNPUBLISHED' });
    } catch {}
  },

  archiveCourse: async (id) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, status: 'ARCHIVED' } : c)),
    }));
    try {
      await apiClient.patch(`/videos/courses/${id}`, { status: 'ARCHIVED' });
    } catch {}
  },

  deleteCourse: async (id) => {
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    }));
    try {
      await apiClient.delete(`/videos/courses/${id}`);
    } catch {}
  },

  addVideoToModule: async (courseId, video) => {
    try {
      await apiClient.post(`/videos/courses/${courseId}/lessons`, video);
      get().fetchCourses();
    } catch (e) {
      console.error('Failed to add video lesson to module:', e);
    }
  },

  importYouTubePlaylist: async (courseId, playlistUrlOrId, videos) => {
    let playlistId = playlistUrlOrId;
    if (playlistUrlOrId.includes('list=')) {
      playlistId = playlistUrlOrId.split('list=')[1].split('&')[0];
    }
    try {
      await apiClient.post(`/videos/courses/${courseId}/import-playlist`, {
        playlistUrl: playlistUrlOrId,
        videos,
      });
      get().fetchCourses();
    } catch (e) {
      console.error('Failed to import playlist in backend:', e);
    }
  },

  assignVideoToUnitTopic: (courseId, videoId, moduleId, unitId, topicName) => {
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              videos: c.videos.map((v) =>
                v.id === videoId ? { ...v, moduleId, unitId, topicName } : v
              ),
            }
          : c
      ),
    }));
  },

  reorderCourseVideos: (courseId, videos) => {
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              videos: videos.map((v, idx) => ({ ...v, displayOrder: idx + 1 })),
            }
          : c
      ),
    }));
  },

  linkVideoRelationships: (videoId, noteId, pyqId, packageId) => {
    set((state) => ({
      courses: state.courses.map((c) => ({
        ...c,
        videos: c.videos.map((v) =>
          v.id === videoId
            ? {
                ...v,
                relatedNoteId: noteId || v.relatedNoteId,
                relatedPyqId: pyqId || v.relatedPyqId,
                relatedPackageId: packageId || v.relatedPackageId,
              }
            : v
        ),
      })),
    }));
  },
}));
