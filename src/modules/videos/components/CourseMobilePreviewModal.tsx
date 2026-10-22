import React, { useState } from 'react';
import { X, Smartphone, Play, Youtube, Layers, FileText, HelpCircle, BookOpen, Link2, ExternalLink } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { VTUCourse, VTUVideo } from '../../../shared/types/video.types';

interface CourseMobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: VTUCourse | null;
}

export const CourseMobilePreviewModal: React.FC<CourseMobilePreviewModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VTUVideo | null>(
    course?.videos && course.videos.length > 0 ? course.videos[0] : null
  );

  React.useEffect(() => {
    if (course?.videos && course.videos.length > 0) {
      setSelectedVideo(course.videos[0]);
      setIsPlaying(false);
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const currentVideo = selectedVideo || course.videos[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="text-base font-black text-foreground">Mobile App Video Player Simulator</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Smartphone Simulator */}
        <div className="p-6 bg-slate-950 flex flex-col items-center max-h-[82vh] overflow-y-auto">
          <div className="w-full max-w-[340px] bg-slate-900 rounded-[28px] border-4 border-slate-800 p-4 shadow-2xl text-slate-100 space-y-3">
            {/* Status bar */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
              <span>09:41</span>
              <span>5G 100%</span>
            </div>

            {/* Mobile Academic Navigation Breadcrumb */}
            <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-[10px] text-slate-300 font-bold space-y-0.5">
              <div className="text-primary font-black uppercase tracking-wider">Mobile Academic Hierarchy</div>
              <div className="text-slate-200">
                {course.branchCode} → Sem {course.semester} → Scheme {course.schemeYear}
              </div>
              <div className="text-slate-400 font-normal">
                Subject: {course.subjectCode} ({course.subjectName})
              </div>
            </div>

            {/* Main Interactive Video Player Viewport */}
            {currentVideo ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 space-y-2">
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeVideoId}?autoplay=1&rel=0&enablejsapi=1`}
                      title={currentVideo.title}
                      className="w-full h-full border-0"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      onClick={() => setIsPlaying(true)}
                      className="w-full h-full relative cursor-pointer group flex items-center justify-center"
                    >
                      <img
                        src={currentVideo.thumbnailUrl || `https://img.youtube.com/vi/${currentVideo.youtubeVideoId}/hqdefault.jpg`}
                        alt={currentVideo.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity"
                      />
                      <div className="absolute w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 ml-1 fill-white" />
                      </div>
                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                        {currentVideo.durationText || '18:00'}
                      </span>
                      <span className="absolute top-2 left-2 text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold">
                        Click to Play
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-1.5">
                  <h4 className="font-extrabold text-xs text-slate-100">{currentVideo.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{currentVideo.unitName || `Module ${currentVideo.moduleId || 1}`}</span>
                    <a
                      href={currentVideo.youtubeUrl || `https://www.youtube.com/watch?v=${currentVideo.youtubeVideoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Youtube className="h-3 w-3" /> Open in YT App
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-800 rounded-2xl">
                No videos attached yet.
              </div>
            )}

            {/* Modules & Lessons List in Simulator */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                Syllabus Lessons ({course.videos.length} Lectures)
              </span>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {course.videos.map((v, i) => (
                  <div
                    key={v.id || i}
                    onClick={() => {
                      setSelectedVideo(v);
                      setIsPlaying(true);
                    }}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2.5 ${
                      currentVideo?.id === v.id
                        ? 'bg-slate-800 border-primary text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="w-10 h-7 rounded overflow-hidden bg-black flex-shrink-0 relative">
                      <img
                        src={v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeVideoId}/hqdefault.jpg`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-extrabold text-[11px] truncate text-slate-200">
                        {v.title}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {v.durationText || '15:00'} • Tap to stream
                      </div>
                    </div>
                    <Play className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-card">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
