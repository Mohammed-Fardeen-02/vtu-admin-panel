export type VideoStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';

export interface VTUVideo {
  id: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  durationText: string; // e.g. "14:20"
  durationSeconds: number;
  courseId: string;
  moduleId: string;
  unitId: string;
  unitName: string;
  topicName: string;
  displayOrder: number;
  status: VideoStatus;
  // Relationships to existing Academic Structure entities
  relatedNoteId?: string;
  relatedPyqId?: string;
  relatedPackageId?: string;
  relatedFormulaSheetId?: string;
  viewsCount: number;
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  unitName: string;
  videosCount: number;
}

export interface VTUCourse {
  id: string;
  title: string;
  description: string;
  branchCode: string;
  schemeYear: string;
  semester: number;
  subjectCode: string;
  subjectName: string;
  thumbnailUrl: string;
  youtubePlaylistUrl?: string;
  youtubePlaylistId?: string;
  instructorName: string;
  modules: CourseModule[];
  videos: VTUVideo[];
  status: VideoStatus;
  enrolledStudentsCount: number;
  createdAt: string;
  updatedAt: string;
}
