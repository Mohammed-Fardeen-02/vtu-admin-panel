import React, { useState } from 'react';
import {
  Video,
  Plus,
  Youtube,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Send,
  Archive,
  Download,
  Play,
  Layers,
  FileText,
  HelpCircle,
  BookOpen,
  Link2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { Input } from '../../shared/components/ui/Input';
import { useVideoStore } from '../../store/useVideoStore';
import { VTUCourse, VTUVideo } from '../../shared/types/video.types';
import { VideoCourseFormModal } from './components/VideoCourseFormModal';
import { PlaylistImportModal } from './components/PlaylistImportModal';
import { CourseMobilePreviewModal } from './components/CourseMobilePreviewModal';
import { AddVideoLessonModal } from './components/AddVideoLessonModal';
import { AdminVideoPlayerModal } from './components/AdminVideoPlayerModal';

export const VideoCoursesPage: React.FC = () => {
  const {
    courses,
    fetchCourses,
    isLoading,
    searchQuery,
    filterBranch,
    filterScheme,
    filterSemester,
    filterStatus,
    setSearchQuery,
    setFilterBranch,
    setFilterScheme,
    setFilterSemester,
    setFilterStatus,
    publishCourse,
    unpublishCourse,
    archiveCourse,
    deleteCourse,
    reorderCourseVideos,
    linkVideoRelationships,
  } = useVideoStore();

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<VTUCourse | null>(null);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importCourseTarget, setImportCourseTarget] = useState<VTUCourse | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCourseTarget, setPreviewCourseTarget] = useState<VTUCourse | null>(null);

  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [addVideoCourseTarget, setAddVideoCourseTarget] = useState<VTUCourse | null>(null);
  const [addVideoDefaultModule, setAddVideoDefaultModule] = useState<number>(1);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const [playingVideo, setPlayingVideo] = useState<{
    title: string;
    youtubeVideoId: string;
    youtubeUrl?: string;
    durationText?: string;
    unitName?: string;
    topicName?: string;
    moduleNumber?: number;
  } | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handlePlayVideo = (v: {
    title: string;
    youtubeVideoId: string;
    youtubeUrl?: string;
    durationText?: string;
    unitName?: string;
    topicName?: string;
    moduleNumber?: number;
  }) => {
    setPlayingVideo(v);
    setIsPlayerOpen(true);
  };

  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.subjectCode.toLowerCase().includes(q) ||
      c.subjectName.toLowerCase().includes(q) ||
      c.instructorName.toLowerCase().includes(q);

    const matchesBranch = filterBranch === 'ALL' || c.branchCode === filterBranch;
    const matchesScheme = filterScheme === 'ALL' || c.schemeYear === filterScheme;
    const matchesSem = filterSemester === 'ALL' || String(c.semester) === filterSemester;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;

    return matchesSearch && matchesBranch && matchesScheme && matchesSem && matchesStatus;
  });

  const handleEdit = (c: VTUCourse) => {
    setEditingCourse(c);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  const handleOpenImport = (c: VTUCourse) => {
    setImportCourseTarget(c);
    setIsImportOpen(true);
  };

  const handleOpenPreview = (c: VTUCourse) => {
    setPreviewCourseTarget(c);
    setIsPreviewOpen(true);
  };

  const handleOpenAddVideo = (c: VTUCourse, modNum = 1) => {
    setAddVideoCourseTarget(c);
    setAddVideoDefaultModule(modNum);
    setIsAddVideoOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Video className="h-7 w-7 text-primary" />
            VTU Educational Video Learning & Courses (ADMIN-FR-18)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize educational videos by Branch → Semester → Scheme → Subject → Module → Unit → Topic without uploading files locally.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenAddVideo(courses[0] || null, 1)}
            icon={<Video className="h-4 w-4 text-primary" />}
          >
            + Upload / Attach Video
          </Button>
          <Button variant="primary" size="sm" onClick={handleCreateNew} icon={<Plus className="h-4 w-4" />}>
            Create New Course
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Search courses by subject code (e.g. 21CS53), name, instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="UNPUBLISHED">Unpublished</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ISE">ISE</option>
                <option value="ME">ME</option>
                <option value="EEE">EEE</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Feed */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <Card className="p-8 text-center">
            <Video className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm font-bold text-foreground">No video courses found</p>
            <p className="text-xs text-muted-foreground mt-1">Adjust search filters or create a new course.</p>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-5">
                {/* Left Thumbnail */}
                <div
                  onClick={() => {
                    if (course.videos && course.videos.length > 0) {
                      handlePlayVideo(course.videos[0]);
                    }
                  }}
                  className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-border relative flex-shrink-0 cursor-pointer group hover:ring-2 hover:ring-rose-500/50 transition-all"
                  title={course.videos && course.videos.length > 0 ? "Click to play course preview" : "No videos uploaded yet"}
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-rose-600/90 group-hover:bg-rose-600 group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-all">
                      <Play className="h-5 w-5 ml-0.5 fill-white" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 text-white px-2 py-0.5 rounded font-extrabold">
                    {course.videos.length} Videos
                  </span>
                </div>

                {/* Center Content */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {course.subjectCode}
                    </span>
                    <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'neutral'} className="text-[10px]">
                      {course.status}
                    </Badge>
                    <span className="text-xs font-bold text-muted-foreground">
                      {course.branchCode} • Sem {course.semester} • {course.schemeYear} Scheme
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground">{course.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>Instructor: <strong className="text-foreground">{course.instructorName}</strong></span>
                    <span>Enrolled: <strong className="text-foreground">{course.enrolledStudentsCount.toLocaleString()} Students</strong></span>
                    <span>Modules: <strong className="text-foreground">{course.modules.length} Modules</strong></span>
                  </div>

                  {/* YouTube Playlist Indicator */}
                  {course.youtubePlaylistUrl && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-bold">
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4" />
                        <span>YouTube Playlist Synced ({course.youtubePlaylistId})</span>
                      </div>
                      <a href={course.youtubePlaylistUrl} target="_blank" rel="noreferrer" className="underline text-[11px]">
                        Open Playlist
                      </a>
                    </div>
                  )}
                </div>

                {/* Right Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenAddVideo(course, 1)}
                    className="bg-primary text-primary-foreground font-black"
                    icon={<Plus className="h-3.5 w-3.5" />}
                  >
                    + Add Video to Module
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                    icon={<Layers className="h-3.5 w-3.5" />}
                  >
                    {expandedCourseId === course.id ? 'Hide Modules' : `Manage Modules (${course.videos.length} videos)`}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenImport(course)}
                    icon={<Youtube className="h-3.5 w-3.5 text-rose-500" />}
                  >
                    Import Content
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenPreview(course)}
                    icon={<Eye className="h-3.5 w-3.5" />}
                  >
                    Mobile Preview
                  </Button>

                  <div className="flex items-center gap-1.5 pt-2">
                    {course.status === 'PUBLISHED' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unpublishCourse(course.id)}
                        icon={<Archive className="h-3 w-3 text-amber-500" />}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => publishCourse(course.id)}
                        icon={<Send className="h-3 w-3 text-emerald-500" />}
                      />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(course)}
                      icon={<Edit2 className="h-3 w-3" />}
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCourse(course.id)}
                      icon={<Trash2 className="h-3 w-3 text-rose-500" />}
                    />
                  </div>
                </div>
              </CardContent>

              {/* Expandable Module Breakdown (Modules 1 to 5) */}
              {expandedCourseId === course.id && (
                <div className="border-t border-border bg-accent/20 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        VTU Syllabus Modules Breakdown (Modules 1 to 5)
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Organized strictly by VTU engineering syllabus. Tap "+ To Module X" to attach a single YouTube video with instant thumbnail fetching.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenAddVideo(course, 1)}
                      icon={<Plus className="h-3.5 w-3.5" />}
                    >
                      + Add Video Lesson
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((modNum) => {
                      const modVideos = course.videos.filter(
                        (v: any) => v.moduleNumber === modNum || (v.moduleId && v.moduleId.includes(String(modNum)))
                      );
                      return (
                        <div
                          key={modNum}
                          className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between space-y-2 shadow-sm"
                        >
                          <div className="flex items-center justify-between border-b border-border/60 pb-2">
                            <span className="text-xs font-black text-primary">Module {modNum}</span>
                            <span className="text-[10px] bg-accent text-foreground px-1.5 py-0.5 rounded font-bold">
                              {modVideos.length} {modVideos.length === 1 ? 'Video' : 'Videos'}
                            </span>
                          </div>

                          <div className="space-y-2 flex-1 max-h-56 overflow-y-auto">
                            {modVideos.length === 0 ? (
                              <p className="text-[11px] text-muted-foreground italic py-4 text-center">
                                No videos added yet
                              </p>
                            ) : (
                              modVideos.map((v) => (
                                <div
                                  key={v.id}
                                  className="group rounded-lg border border-border/80 bg-background/80 p-2 space-y-1.5 text-xs hover:border-primary/50 transition-colors"
                                >
                                  <div
                                    onClick={() => handlePlayVideo(v)}
                                    className="relative aspect-video rounded overflow-hidden bg-black/60 cursor-pointer group/thumb"
                                    title="Click to stream video"
                                  >
                                    <img
                                      src={v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeVideoId}/hqdefault.jpg`}
                                      alt={v.title}
                                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                      <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                                        <Play className="h-3.5 w-3.5 ml-0.5 fill-white" />
                                      </div>
                                    </div>
                                    <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 text-white font-mono px-1 rounded">
                                      {v.durationText || '15:00'}
                                    </span>
                                  </div>
                                  <p className="font-extrabold text-[11px] text-foreground line-clamp-1" title={v.title}>
                                    {v.title}
                                  </p>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <button
                                      type="button"
                                      onClick={() => handlePlayVideo(v)}
                                      className="text-rose-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <Play className="h-2.5 w-2.5 fill-rose-500" /> Play Here
                                    </button>
                                    <a
                                      href={v.youtubeUrl || `https://www.youtube.com/watch?v=${v.youtubeVideoId}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-muted-foreground hover:text-foreground font-semibold flex items-center gap-0.5"
                                    >
                                      <Youtube className="h-2.5 w-2.5" /> YT
                                    </a>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => handleOpenAddVideo(course, modNum)}
                            icon={<Plus className="h-3 w-3" />}
                          >
                            + To Module {modNum}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <VideoCourseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingCourse}
      />

      {importCourseTarget && (
        <PlaylistImportModal
          isOpen={isImportOpen}
          onClose={() => {
            setIsImportOpen(false);
            setImportCourseTarget(null);
          }}
          courseId={importCourseTarget.id}
          courseTitle={importCourseTarget.title}
        />
      )}

      {addVideoCourseTarget && (
        <AddVideoLessonModal
          isOpen={isAddVideoOpen}
          onClose={() => {
            setIsAddVideoOpen(false);
            setAddVideoCourseTarget(null);
          }}
          course={addVideoCourseTarget}
          defaultModuleNumber={addVideoDefaultModule}
        />
      )}

      <CourseMobilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        course={previewCourseTarget}
      />

      <AdminVideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setPlayingVideo(null);
        }}
        video={playingVideo}
      />
    </div>
  );
};
