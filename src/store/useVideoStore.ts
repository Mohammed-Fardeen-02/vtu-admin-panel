import { create } from 'zustand';
import { VTUCourse, VTUVideo, VideoStatus } from '../shared/types/video.types';

interface VideoStoreState {
  courses: VTUCourse[];
  searchQuery: string;
  filterBranch: string;
  filterScheme: string;
  filterSemester: string;
  filterStatus: string;

  setSearchQuery: (q: string) => void;
  setFilterBranch: (b: string) => void;
  setFilterScheme: (s: string) => void;
  setFilterSemester: (sem: string) => void;
  setFilterStatus: (st: string) => void;

  createCourse: (data: Omit<VTUCourse, 'id' | 'createdAt' | 'updatedAt' | 'enrolledStudentsCount' | 'videos' | 'modules'>) => string;
  updateCourse: (id: string, updates: Partial<VTUCourse>) => void;
  publishCourse: (id: string) => void;
  unpublishCourse: (id: string) => void;
  archiveCourse: (id: string) => void;
  deleteCourse: (id: string) => void;

  // YouTube Playlist & Video Actions
  importYouTubePlaylist: (courseId: string, playlistUrlOrId: string) => void;
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

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterBranch: (b) => set({ filterBranch: b }),
  setFilterScheme: (s) => set({ filterScheme: s }),
  setFilterSemester: (sem) => set({ filterSemester: sem }),
  setFilterStatus: (st) => set({ filterStatus: st }),

  createCourse: (data) => {
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
    return id;
  },

  updateCourse: (id, updates) => {
    const now = new Date().toISOString().split('T')[0];
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: now } : c)),
    }));
  },

  publishCourse: (id) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, status: 'PUBLISHED' } : c)),
    }));
  },

  unpublishCourse: (id) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, status: 'UNPUBLISHED' } : c)),
    }));
  },

  archiveCourse: (id) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, status: 'ARCHIVED' } : c)),
    }));
  },

  deleteCourse: (id) => {
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    }));
  },

  importYouTubePlaylist: (courseId, playlistUrlOrId) => {
    // Extract playlist ID
    let playlistId = playlistUrlOrId;
    if (playlistUrlOrId.includes('list=')) {
      playlistId = playlistUrlOrId.split('list=')[1].split('&')[0];
    }

    // Mock YouTube imported videos
    const importedVideos: VTUVideo[] = [
      {
        id: `vid-${Date.now()}-1`,
        youtubeVideoId: 'dQw4w9WgXcQ',
        youtubeUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        title: 'Imported Playlist Video 1: Fundamental Concepts',
        description: 'Imported automatically via YouTube Playlist API Endpoint.',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        durationText: '15:00',
        durationSeconds: 900,
        courseId,
        moduleId: 'mod-1',
        unitId: 'u-1',
        unitName: 'Unit 1',
        topicName: 'Playlist Overview',
        displayOrder: 1,
        status: 'PUBLISHED',
        viewsCount: 0,
      },
      {
        id: `vid-${Date.now()}-2`,
        youtubeVideoId: 'kJQP7kiw5Fk',
        youtubeUrl: `https://www.youtube.com/watch?v=kJQP7kiw5Fk`,
        title: 'Imported Playlist Video 2: Solved Problems',
        description: 'Imported automatically via YouTube Playlist API Endpoint.',
        thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
        durationText: '22:30',
        durationSeconds: 1350,
        courseId,
        moduleId: 'mod-1',
        unitId: 'u-1',
        unitName: 'Unit 1',
        topicName: 'Numericals',
        displayOrder: 2,
        status: 'PUBLISHED',
        viewsCount: 0,
      },
    ];

    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              youtubePlaylistId: playlistId,
              youtubePlaylistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
              videos: [...c.videos, ...importedVideos],
            }
          : c
      ),
    }));
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
