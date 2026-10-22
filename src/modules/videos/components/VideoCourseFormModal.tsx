import React, { useState, useEffect, useMemo } from 'react';
import { X, Video, Save, Youtube, Layers, BookOpen, Filter } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { VTUCourse, VideoStatus } from '../../../shared/types/video.types';
import { useVideoStore } from '../../../store/useVideoStore';
import { useAcademicStore } from '../../../store/useAcademicStore';

interface VideoCourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: VTUCourse | null;
}

export const VideoCourseFormModal: React.FC<VideoCourseFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { createCourse, updateCourse } = useVideoStore();
  const { branches, schemes, getSubjectsByBranchAndScheme } = useAcademicStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [branchCode, setBranchCode] = useState('CSE');
  const [schemeYear, setSchemeYear] = useState('2022');
  const [semester, setSemester] = useState(5);
  const [subjectCode, setSubjectCode] = useState('21CS53');
  const [subjectName, setSubjectName] = useState('Database Management Systems');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [instructorName, setInstructorName] = useState('Prof. Ramesh B.');
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<VideoStatus>('PUBLISHED');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get subjects matching chosen Scheme, Branch & Semester
  const availableSubjects = useMemo(() => {
    return getSubjectsByBranchAndScheme(branchCode, schemeYear, semester);
  }, [getSubjectsByBranchAndScheme, branchCode, schemeYear, semester]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setBranchCode(initialData.branchCode);
      setSchemeYear(initialData.schemeYear);
      setSemester(initialData.semester);
      setSubjectCode(initialData.subjectCode);
      setSubjectName(initialData.subjectName);
      setInstructorName(initialData.instructorName);
      setYoutubePlaylistUrl(initialData.youtubePlaylistUrl || '');
      setThumbnailUrl(initialData.thumbnailUrl || '');
      setStatus(initialData.status);
      setIsCustomSubject(false);
    } else {
      setTitle('Database Management Systems Full Video Course');
      setDescription('');
      setBranchCode('CSE');
      setSchemeYear('2022');
      setSemester(5);
      setSubjectCode('21CS53');
      setSubjectName('Database Management Systems');
      setInstructorName('Prof. Ramesh B.');
      setYoutubePlaylistUrl('');
      setThumbnailUrl('');
      setStatus('PUBLISHED');
      setIsCustomSubject(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // When branch/scheme/sem changes, auto-select first available subject if current is not in list
  useEffect(() => {
    if (!initialData && availableSubjects.length > 0 && !isCustomSubject) {
      const match = availableSubjects.find((s) => s.code === subjectCode);
      if (!match) {
        const first = availableSubjects[0];
        setSubjectCode(first.code);
        setSubjectName(first.name);
        setTitle(`${first.name} Full Video Course`);
      }
    }
  }, [availableSubjects, initialData, isCustomSubject, subjectCode]);

  if (!isOpen) return null;

  // Auto-detect YouTube video ID from either playlist or dedicated video link
  const detectedVideoId = (() => {
    if (!youtubePlaylistUrl) return '';
    const match = youtubePlaylistUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    return match ? match[1] : '';
  })();

  const activeThumbnail =
    thumbnailUrl ||
    (detectedVideoId
      ? `https://img.youtube.com/vi/${detectedVideoId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800');

  const handleSubjectSelect = (code: string) => {
    if (code === '__CUSTOM__') {
      setIsCustomSubject(true);
      return;
    }
    setIsCustomSubject(false);
    const chosen = availableSubjects.find((s) => s.code === code);
    if (chosen) {
      setSubjectCode(chosen.code);
      setSubjectName(chosen.name);
      setTitle(`${chosen.name} Full Video Course`);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Course title is required';
    if (!subjectCode.trim()) errs.subjectCode = 'Subject Code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title,
      description,
      branchCode,
      schemeYear,
      semester,
      subjectCode,
      subjectName,
      thumbnailUrl: activeThumbnail,
      instructorName,
      youtubePlaylistUrl,
      status,
    };

    if (initialData) {
      updateCourse(initialData.id, payload);
    } else {
      createCourse(payload as any);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">
                {initialData ? 'Edit Video Course' : 'Create VTU Educational Video Course'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Select Scheme, Branch, Semester, and Subject to organize your YouTube playlist.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Academic Hierarchy Dropdowns */}
          <div className="p-4 rounded-2xl bg-accent/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <Filter className="h-3.5 w-3.5 text-primary" /> 1. Scheme, Branch & Semester Selection
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Scheme Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Scheme</label>
                <select
                  value={schemeYear}
                  onChange={(e) => setSchemeYear(e.target.value)}
                  className="w-full h-9 px-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                >
                  {schemes.map((s) => (
                    <option key={s.id} value={s.year}>
                      {s.year} Scheme
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Branch</label>
                <select
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  className="w-full h-9 px-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.code} ({b.name.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                  className="w-full h-9 px-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject Selection Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">
                  2. Target Subject <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomSubject(!isCustomSubject)}
                  className="text-[11px] text-primary hover:underline font-bold"
                >
                  {isCustomSubject ? '← Pick from Central Subject List' : '+ Enter Custom Subject'}
                </button>
              </div>

              {!isCustomSubject ? (
                <select
                  value={subjectCode}
                  onChange={(e) => handleSubjectSelect(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                >
                  {availableSubjects.length === 0 ? (
                    <option value="">No subjects found for {branchCode} Sem {semester} ({schemeYear} Scheme)</option>
                  ) : (
                    availableSubjects.map((s) => (
                      <option key={s.id} value={s.code}>
                        [{s.code}] {s.name} ({s.credits} Credits)
                      </option>
                    ))
                  )}
                  <option value="__CUSTOM__">+ Other / Custom Subject Code...</option>
                </select>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="Subject Code (e.g. 21CS53)"
                    error={errors.subjectCode}
                  />
                  <Input
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="Subject Name (e.g. Database Systems)"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Course Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Database Management Systems Full Video Series"
              error={errors.title}
            />
          </div>

          {/* Instructor Name */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Instructor / YouTuber Name</label>
            <Input
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="e.g. Mohammed Fardeen (VTU EduLab)"
            />
          </div>

          {/* YouTube Playlist URL */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
              <Youtube className="h-3.5 w-3.5 text-rose-500" /> YouTube Playlist or Preview Video URL (Optional)
            </label>
            <Input
              value={youtubePlaylistUrl}
              onChange={(e) => setYoutubePlaylistUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=... or video URL"
            />
          </div>

          {/* Live Thumbnail Preview */}
          <div className="p-3 rounded-xl bg-accent/40 border border-border flex items-center gap-3">
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-black/60 border border-border flex-shrink-0">
              <img
                src={activeThumbnail}
                alt="Course Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 flex-1">
              <span className="text-xs font-bold text-foreground block">Course Thumbnail Preview</span>
              <p className="text-[11px] text-muted-foreground">
                {detectedVideoId
                  ? `Auto-fetched from YouTube Video ID (${detectedVideoId})`
                  : 'Auto-fetched when you link a YouTube video or default image'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Course Overview Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive syllabus overview covering Module 1 to 5..."
              className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
              {initialData ? 'Update Course' : 'Save Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
