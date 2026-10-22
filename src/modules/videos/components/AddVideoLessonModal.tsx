import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Video,
  Youtube,
  Plus,
  CheckCircle,
  ExternalLink,
  Clock,
  Layers,
  Filter,
  BookOpen,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { VTUCourse } from '../../../shared/types/video.types';
import { useVideoStore } from '../../../store/useVideoStore';
import { useAcademicStore } from '../../../store/useAcademicStore';

interface AddVideoLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: VTUCourse | null;
  defaultModuleNumber?: number;
}

export const extractYoutubeVideoId = (url: string): string => {
  if (!url) return '';
  const clean = url.trim();
  if (clean.length === 11 && !clean.includes('/') && !clean.includes('.') && !clean.includes('?')) {
    return clean;
  }
  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (match) return match[1];

  try {
    const parsed = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    const v = parsed.searchParams.get('v');
    if (v && v.length === 11) return v;
  } catch {}

  return '';
};

export const AddVideoLessonModal: React.FC<AddVideoLessonModalProps> = ({
  isOpen,
  onClose,
  course,
  defaultModuleNumber = 1,
}) => {
  const { courses, addVideoToModule } = useVideoStore();
  const { branches, schemes } = useAcademicStore();

  // Filter Dropdown States
  const [selectedScheme, setSelectedScheme] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Lesson Detail States
  const [moduleNumber, setModuleNumber] = useState<number>(defaultModuleNumber);
  const [unitName, setUnitName] = useState('');
  const [topicName, setTopicName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [durationText, setDurationText] = useState('18:30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (course) {
        setSelectedCourseId(course.id);
        setSelectedScheme(course.schemeYear || 'ALL');
        setSelectedBranch(course.branchCode || 'ALL');
        setSelectedSemester(String(course.semester) || 'ALL');
      } else if (courses.length > 0) {
        setSelectedCourseId(courses[0].id);
        setSelectedScheme('ALL');
        setSelectedBranch('ALL');
        setSelectedSemester('ALL');
      }
      setModuleNumber(defaultModuleNumber);
      setUnitName(`Unit ${defaultModuleNumber}: Syllabus Topics`);
      setTopicName('');
      setTitle('');
      setDescription('');
      setYoutubeUrl('');
      setDurationText('18:30');
      setErrors({});
    }
  }, [isOpen, course, defaultModuleNumber, courses]);

  // Dynamically filter courses based on Scheme -> Branch -> Semester
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchScheme = selectedScheme === 'ALL' || c.schemeYear === selectedScheme;
      const matchBranch =
        selectedBranch === 'ALL' || c.branchCode === selectedBranch || c.branchCode === 'ALL';
      const matchSem = selectedSemester === 'ALL' || String(c.semester) === selectedSemester;
      return matchScheme && matchBranch && matchSem;
    });
  }, [courses, selectedScheme, selectedBranch, selectedSemester]);

  // Determine active course
  const activeCourse = useMemo(() => {
    const found = courses.find((c) => c.id === selectedCourseId);
    if (found) return found;
    return filteredCourses[0] || course || courses[0] || null;
  }, [courses, selectedCourseId, filteredCourses, course]);

  // If filteredCourses changes and selectedCourseId is not in it, sync to first
  useEffect(() => {
    if (filteredCourses.length > 0) {
      const exists = filteredCourses.some((c) => c.id === selectedCourseId);
      if (!exists) {
        setSelectedCourseId(filteredCourses[0].id);
      }
    }
  }, [filteredCourses, selectedCourseId]);

  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [detectedDuration, setDetectedDuration] = useState<string | null>(null);

  const detectedVideoId = extractYoutubeVideoId(youtubeUrl);
  const thumbnailPreview = detectedVideoId
    ? `https://img.youtube.com/vi/${detectedVideoId}/hqdefault.jpg`
    : null;

  useEffect(() => {
    if (!detectedVideoId) {
      setDetectedDuration(null);
      return;
    }

    let isMounted = true;
    setIsFetchingInfo(true);

    fetch(`http://localhost:5000/api/v1/videos/youtube-info?videoId=${detectedVideoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.data?.durationText && data.data.durationText !== '15:00') {
          setDurationText(data.data.durationText);
          setDetectedDuration(data.data.durationText);
        }
        if (data.data?.title) {
          setTitle((prev) => (!prev || prev.trim() === '' ? data.data.title : prev));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsFetchingInfo(false);
      });

    return () => {
      isMounted = false;
    };
  }, [detectedVideoId]);

  if (!isOpen) return null;

  const handleModuleChange = (num: number) => {
    setModuleNumber(num);
    if (!unitName || unitName.startsWith('Unit ')) {
      setUnitName(`Unit ${num}: Syllabus Topics`);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!activeCourse) {
      errs.course = 'Please select a valid video course to attach this video to.';
    }

    if (!youtubeUrl.trim()) {
      errs.youtubeUrl = 'YouTube Video Link is required';
    } else if (!detectedVideoId) {
      errs.youtubeUrl = 'Please enter a valid YouTube video URL or 11-character video ID';
    }

    if (!title.trim()) {
      errs.title = 'Lecture Title is required';
    }
    if (!unitName.trim()) {
      errs.unitName = 'Unit Name is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !activeCourse) return;

    setIsSubmitting(true);
    try {
      await addVideoToModule(activeCourse.id, {
        moduleNumber,
        unitName: unitName.trim(),
        topicName: topicName.trim() || undefined,
        title: title.trim(),
        description: description.trim() || undefined,
        youtubeUrl: youtubeUrl.trim(),
        durationText: durationText.trim() || '15:00',
      });
      onClose();
    } catch (err) {
      console.error('Failed to add lesson:', err);
      setErrors({ form: 'Failed to add video lesson. Please check server connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Attach YouTube Video to Module</h3>
              <p className="text-xs text-muted-foreground">
                Filter by Scheme → Branch → Semester → Course & assign directly to Modules 1–5
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errors.form && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-500">
              {errors.form}
            </div>
          )}

          {/* ACADEMIC FILTER & COURSE SELECTION SECTION */}
          <div className="p-4 rounded-2xl bg-accent/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <Filter className="h-3.5 w-3.5 text-primary" /> Target Course & Subject Filter
              </span>
              <span className="text-[11px] text-muted-foreground">
                {filteredCourses.length} matching {filteredCourses.length === 1 ? 'course' : 'courses'}
              </span>
            </div>

            {/* Scheme, Branch, Semester 3-Column Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Scheme Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  1. Scheme
                </label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="w-full h-9 px-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                >
                  <option value="ALL">All Schemes</option>
                  {schemes.map((s) => (
                    <option key={s.id} value={s.year}>
                      {s.year} Scheme
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  2. Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full h-9 px-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                >
                  <option value="ALL">All Branches</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.code} ({b.name.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  3. Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full h-9 px-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                >
                  <option value="ALL">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={String(s)}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course / Subject Selection Dropdown */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                4. Select Video Course / Subject <span className="text-rose-500">*</span>
              </label>
              {filteredCourses.length === 0 ? (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 font-bold">
                  No courses found matching this Scheme / Branch / Semester. Change the filters above or create a new course first.
                </div>
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                >
                  {filteredCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.subjectCode}] {c.title} — Sem {c.semester} ({c.branchCode})
                    </option>
                  ))}
                </select>
              )}
              {errors.course && (
                <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.course}</p>
              )}
            </div>

            {/* Active Course Details Badge */}
            {activeCourse && (
              <div className="p-2.5 rounded-xl bg-background border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {activeCourse.subjectCode}
                  </span>
                  <span className="font-extrabold text-foreground">{activeCourse.subjectName}</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-bold">
                  Instructor: {activeCourse.instructorName}
                </span>
              </div>
            )}
          </div>

          {/* Module Selector (1 to 5) */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              VTU Syllabus Module <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleModuleChange(num)}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all ${
                    moduleNumber === num
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-accent/40 text-muted-foreground border border-border hover:bg-accent'
                  }`}
                >
                  Module {num}
                </button>
              ))}
            </div>
          </div>

          {/* YouTube Video Link Input */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              YouTube Video Link / URL <span className="text-rose-500">*</span>
            </label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=3EJOX2kGi9Q or https://youtu.be/..."
              icon={<Youtube className="h-4 w-4 text-rose-500" />}
              error={errors.youtubeUrl}
            />
          </div>

          {/* Real-time YouTube Thumbnail Live Preview */}
          {detectedVideoId ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  YouTube Video Detected (ID: {detectedVideoId})
                </span>
                <a
                  href={`https://www.youtube.com/watch?v=${detectedVideoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] underline hover:text-emerald-500"
                >
                  Watch Test <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Thumbnail Display */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 border border-emerald-500/30">
                <img
                  src={thumbnailPreview!}
                  alt="YouTube Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                  <span className="text-[10px] bg-black/85 text-white font-mono px-2 py-0.5 rounded font-bold shadow">
                    {detectedDuration ? `⏱ ${detectedDuration}` : isFetchingInfo ? 'Fetching length...' : `⏱ ${durationText}`}
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold shadow">
                    Auto-Fetched
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Lecture Title */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Lecture Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lecture 3: ER Diagrams & Attribute Relationships"
              error={errors.title}
            />
          </div>

          {/* Unit Name & Topic Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Unit Name <span className="text-rose-500">*</span>
              </label>
              <Input
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="e.g. Unit 1: ER Diagrams"
                error={errors.unitName}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Topic Name <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Input
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="e.g. Weak Entity Sets & Keys"
              />
            </div>
          </div>

          {/* Duration & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center justify-between">
                <span>Duration</span>
                <span className="text-[10px] text-emerald-500 font-bold">
                  {detectedDuration ? '✓ Auto-Detected' : isFetchingInfo ? 'Detecting...' : '(MM:SS)'}
                </span>
              </label>
              <Input
                value={durationText}
                onChange={(e) => setDurationText(e.target.value)}
                placeholder="MM:SS"
                icon={<Clock className="h-4 w-4 text-emerald-500" />}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-foreground mb-1">
                Lecture Notes / Summary <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of concepts taught in this lecture..."
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !detectedVideoId || !activeCourse}
              icon={<Plus className="h-4 w-4" />}
            >
              {isSubmitting ? 'Saving to Database...' : `Attach to Module ${moduleNumber}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
