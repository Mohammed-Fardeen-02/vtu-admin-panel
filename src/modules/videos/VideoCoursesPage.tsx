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

export const VideoCoursesPage: React.FC = () => {
  const {
    courses,
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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<VTUCourse | null>(null);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importCourseTarget, setImportCourseTarget] = useState<VTUCourse | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCourseTarget, setPreviewCourseTarget] = useState<VTUCourse | null>(null);

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
                <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-border relative flex-shrink-0">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
                      <Play className="h-5 w-5 ml-0.5" />
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
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenImport(course)}
                    icon={<Youtube className="h-3.5 w-3.5 text-rose-500" />}
                  >
                    Import Playlist
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenPreview(course)}
                    icon={<Eye className="h-3.5 w-3.5" />}
                  >
                    Mobile App Preview
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

      <CourseMobilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        course={previewCourseTarget}
      />
    </div>
  );
};
