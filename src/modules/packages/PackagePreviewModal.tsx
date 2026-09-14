import React, { useState } from 'react';
import { X, Smartphone, BookOpen, Star, CheckCircle, FileText, Lock, Award, Flame } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { PassingPackage } from '../../shared/types/package.types';

interface PackagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: PassingPackage | null;
}

export const PackagePreviewModal: React.FC<PackagePreviewModalProps> = ({
  isOpen,
  onClose,
  packageData,
}) => {
  const [activeTab, setActiveTab] = useState<'QUESTIONS' | 'REVISION' | 'ONE_NIGHT'>('QUESTIONS');

  if (!isOpen || !packageData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="text-base font-black text-foreground">Mobile App View Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Device Simulation Container */}
        <div className="p-6 bg-slate-950 flex flex-col items-center max-h-[80vh] overflow-y-auto">
          <div className="w-full max-w-[340px] bg-slate-900 rounded-[28px] border-4 border-slate-800 p-4 shadow-2xl text-slate-100 space-y-3">
            {/* Status bar */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
              <span>09:41</span>
              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3 text-amber-500" />
                <span>5G</span>
              </div>
            </div>

            {/* Mobile Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-800/50 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-extrabold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {packageData.subjectCode}
                </span>
                {packageData.isPremium ? (
                  <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    <Lock className="h-3 w-3" /> Premium Pass
                  </span>
                ) : (
                  <span className="font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    Free Access
                  </span>
                )}
              </div>

              <h4 className="font-black text-sm text-slate-100 leading-snug">{packageData.title}</h4>
              <p className="text-[11px] text-slate-300">{packageData.subjectName}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-blue-800/40">
                <span>{packageData.questionsCount} Questions</span>
                <span>{packageData.unitsCount} Units</span>
                <span>Scheme {packageData.schemeYear}</span>
              </div>
            </div>

            {/* Navigation Tabs inside Mobile view */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800 rounded-xl text-[10px] font-bold text-center">
              <button
                onClick={() => setActiveTab('QUESTIONS')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'QUESTIONS' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Questions
              </button>
              <button
                onClick={() => setActiveTab('REVISION')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'REVISION' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Last-Minute
              </button>
              <button
                onClick={() => setActiveTab('ONE_NIGHT')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'ONE_NIGHT' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                1-Night Notes
              </button>
            </div>

            {/* Mobile Content Display */}
            {activeTab === 'QUESTIONS' && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {packageData.questions.map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {q.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{q.weightageMarks} Marks</span>
                    </div>
                    <p className="font-bold text-slate-100 text-xs">{idx + 1}. {q.questionText}</p>
                    <p className="text-[10px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      {q.answerSummary}
                    </p>
                    <div className="text-[9px] text-slate-400 flex justify-between pt-0.5">
                      <span>{q.frequencyText}</span>
                      <span>Priority: {q.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'REVISION' && (
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
                <span className="text-[10px] font-black text-emerald-400 block uppercase tracking-wider">
                  2-Hour Exam Warmup
                </span>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {packageData.lastMinuteRevisionSummary || 'High yield concepts to review before entry.'}
                </p>
              </div>
            )}

            {activeTab === 'ONE_NIGHT' && (
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
                <span className="text-[10px] font-black text-sky-400 block uppercase tracking-wider">
                  1-Night-Before Cheat-Sheet
                </span>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {packageData.oneNightBeforeNotes || 'Key formulas and proofs to memorize.'}
                </p>
              </div>
            )}
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
