import React, { useState, useEffect } from 'react';
import { X, Video, Save, Youtube, Layers } from 'lucide-react';
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
  const { branches, schemes } = useAcademicStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [branchCode, setBranchCode] = useState('CSE');
  const [schemeYear, setSchemeYear] = useState('2022');
  const [semester, setSemester] = useState(5);
  const [subjectCode, setSubjectCode] = useState('21CS53');
  const [subjectName, setSubjectName] = useState('Database Management Systems');
  const [instructorName, setInstructorName] = useState('Prof. Ramesh B.');
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [status, setStatus] = useState<VideoStatus>('PUBLISHED');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setBranchCode('CSE');
      setSchemeYear('2022');
      setSemester(5);
      setSubjectCode('21CS53');
      setSubjectName('Database Management Systems');
      setInstructorName('Prof. Ramesh B.');
      setYoutubePlaylistUrl('');
      setStatus('PUBLISHED');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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
      thumbnailUrl: 'https://img.youtube.com/vi/3EJOX2kGi9Q/hqdefault.jpg',
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
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
                Configure course details and map YouTube playlists to central academic structure.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Subject Code *</label>
              <Input
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="21CS53"
                error={errors.subjectCode}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Subject Full Name</label>
              <Input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Database Management Systems"
              />
            </div>
          </div>

          {/* Academic Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Branch</label>
              <select
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.code}>
                    {b.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Scheme</label>
              <select
                value={schemeYear}
                onChange={(e) => setSchemeYear(e.target.value)}
                className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs"
              >
                {schemes.map((s) => (
                  <option key={s.id} value={s.year}>
                    Scheme {s.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Instructor / Faculty Name</label>
            <Input
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="Prof. Ramesh B."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
              <Youtube className="h-3.5 w-3.5 text-rose-500" /> YouTube Playlist URL (Optional)
            </label>
            <Input
              value={youtubePlaylistUrl}
              onChange={(e) => setYoutubePlaylistUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Course Overview Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive syllabus overview..."
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
