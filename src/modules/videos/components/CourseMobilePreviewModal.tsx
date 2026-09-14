import React, { useState } from 'react';
import { X, Smartphone, Play, Youtube, Layers, FileText, HelpCircle, BookOpen, Link2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { VTUCourse } from '../../../shared/types/video.types';

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
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-1');

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="text-base font-black text-foreground">Mobile App Video Hierarchy Preview</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Smartphone Simulator */}
        <div className="p-6 bg-slate-950 flex flex-col items-center max-h-[80vh] overflow-y-auto">
          <div className="w-full max-w-[340px] bg-slate-900 rounded-[28px] border-4 border-slate-800 p-4 shadow-2xl text-slate-100 space-y-3">
            {/* Status bar */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
              <span>09:41</span>
              <span>5G 100%</span>
            </div>

            {/* Mobile Academic Navigation Breadcrumb */}
            <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-[10px] text-slate-300 font-bold space-y-1">
              <div className="text-primary font-black uppercase tracking-wider">Mobile Academic Hierarchy</div>
              <div className="text-slate-200">
                {course.branchCode} → Sem {course.semester} → Scheme {course.schemeYear}
              </div>
              <div className="text-slate-400 font-normal">
                Subject: {course.subjectCode} ({course.subjectName})
              </div>
            </div>

            {/* Main Video Hero Card */}
            {course.videos.length > 0 ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 space-y-2">
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  <img
                    src={course.videos[0].thumbnailUrl}
                    alt={course.videos[0].title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
                    <Play className="h-5 w-5 ml-0.5" />
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    {course.videos[0].durationText}
                  </span>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="font-extrabold text-xs text-slate-100">{course.videos[0].title}</h4>
                  <p className="text-[10px] text-slate-400">{course.videos[0].topicName}</p>

                  {/* Cross-Feature Linked Resources */}
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Linked Academic Entities:</span>
                    <div className="flex flex-wrap gap-1 text-[9px]">
                      {course.videos[0].relatedNoteId && (
                        <span className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold">
                          <FileText className="h-2.5 w-2.5" /> Module Notes
                        </span>
                      )}
                      {course.videos[0].relatedPackageId && (
                        <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold">
                          <BookOpen className="h-2.5 w-2.5" /> Passing Package
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-800 rounded-2xl">
                No videos imported yet.
              </div>
            )}

            {/* Modules List Accordion Mockup */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Course Modules & Units</span>
              {course.modules.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModuleId(m.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedModuleId === m.id
                      ? 'bg-slate-800 border-blue-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-extrabold text-slate-200 text-[11px]">{m.title}</div>
                  <div className="text-[10px] text-slate-400">{m.unitName} • {m.videosCount} Videos</div>
                </div>
              ))}
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
