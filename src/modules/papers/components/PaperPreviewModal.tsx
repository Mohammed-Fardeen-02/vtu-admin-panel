import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Download,
  Eye,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  FileText,
  Clock,
  Award,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { AdminQuestionPaper, PaperModule } from '../../../shared/types/papers.types';

export interface PaperPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: AdminQuestionPaper;
}

export const PaperPreviewModal: React.FC<PaperPreviewModalProps> = ({
  isOpen,
  onClose,
  paper,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showSolutionMode, setShowSolutionMode] = useState<boolean>(paper.hasSolutionKey);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeModuleTab, setActiveModuleTab] = useState<number>(0);

  if (!isOpen) return null;

  const handleCopySecureUrl = () => {
    if (paper.secureUrl) {
      navigator.clipboard.writeText(paper.secureUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const isDigitalTyped = paper.contentType === 'DIGITAL_TYPED' || (paper.modulesData && paper.modulesData.length > 0);
  const modules: PaperModule[] = paper.modulesData || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 font-black">
              {isDigitalTyped ? <Sparkles className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-primary text-xs">{paper.subjectCode}</span>
                <span className="text-xs font-bold text-foreground">{paper.subjectName}</span>
                <Badge variant="primary" className="text-[9px]">
                  {paper.year} {paper.examCategory} Exam
                </Badge>
                {isDigitalTyped ? (
                  <Badge variant="success" className="text-[9px]">📝 Digital Interactive</Badge>
                ) : (
                  <Badge variant="warning" className="text-[9px]">📄 PDF Document</Badge>
                )}
              </div>
              <h3 className="text-base font-black text-foreground truncate max-w-xl">{paper.title}</h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Academic Hierarchy & Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-accent/20 border border-border text-xs flex-shrink-0">
          <div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Academic Hierarchy</span>
            <span className="font-bold text-foreground">
              {paper.branchCode} • Sem {paper.semester} ({paper.schemeYear} Scheme)
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Exam Duration & Marks</span>
            <span className="font-bold text-foreground">
              {paper.maxMarks || 100} Marks • {paper.durationHours || 3.0} Hours
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Solution Key Status</span>
            <span className="font-bold text-foreground">
              {paper.hasSolutionKey ? (
                <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>Solution Included</Badge>
              ) : (
                <Badge variant="warning">Paper Only</Badge>
              )}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Downloads & Views</span>
            <span className="font-bold text-foreground flex items-center gap-2">
              <span className="flex items-center gap-1"><Download className="h-3 w-3 text-blue-500" /> {paper.downloads || 0}</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-purple-500" /> {paper.viewsCount || 0}</span>
            </span>
          </div>
        </div>

        {/* Question Paper Preview Viewer Container */}
        <div className="flex-1 min-h-[360px] rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative text-slate-100">
          {/* Viewer Toolbar */}
          <div className="flex flex-wrap items-center justify-between bg-slate-900/90 px-4 py-2 rounded-lg border border-slate-800 text-xs gap-2">
            {isDigitalTyped ? (
              <div className="flex items-center gap-1 overflow-x-auto">
                <span className="text-[10px] font-extrabold text-slate-400 mr-1 uppercase">Modules:</span>
                {modules.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveModuleTab(idx)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      activeModuleTab === idx
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Module {m.moduleNumber}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-bold">Page {currentPage} of {paper.pageCount || 4}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(paper.pageCount || 4, p + 1))}
                  disabled={currentPage === (paper.pageCount || 4)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Answer Key Toggle */}
            {paper.hasSolutionKey && (
              <button
                onClick={() => setShowSolutionMode(!showSolutionMode)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 ${
                  showSolutionMode
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{showSolutionMode ? 'Viewing Verified Answer Key' : 'Switch to Answer Key'}</span>
              </button>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 25))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Paper Canvas Simulation */}
          <div className="flex-1 my-3 overflow-auto flex items-start justify-center p-2">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-2xl min-h-[300px] bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl flex flex-col justify-between text-slate-300 space-y-4"
            >
              {/* VTU Header */}
              <div className="border-b border-slate-800 pb-3 text-center space-y-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
                  <span className="font-bold text-purple-400">USN: [ _ _ _ _ _ _ _ _ _ _ ]</span>
                  <span className="font-extrabold text-white">{paper.subjectCode}</span>
                </div>
                <h4 className="font-black text-sm text-white tracking-wide">
                  VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI
                </h4>
                <p className="text-xs text-slate-300 font-semibold">
                  {paper.semester}th Semester B.E. / B.Tech Degree Examination, {paper.month || 'Jan/Feb'} {paper.year}
                </p>
                <p className="text-xs font-bold text-purple-300">
                  {paper.subjectName} ({paper.schemeYear} Scheme)
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>Time: {paper.durationHours || 3.0} Hours</span>
                  <span>Max. Marks: {paper.maxMarks || 100}</span>
                </div>
                <p className="text-[10px] text-slate-400 italic">Note: Answer any FIVE full questions, choosing ONE full question from each module.</p>
              </div>

              {/* Digital Typed Interactive Questions OR PDF View */}
              {isDigitalTyped && modules.length > 0 ? (
                <div className="space-y-4 text-xs">
                  {modules[activeModuleTab] && (
                    <div className="space-y-3">
                      <div className="p-2 rounded bg-purple-950/40 border border-purple-800/40 text-purple-300 font-bold text-center">
                        {modules[activeModuleTab].title}
                      </div>

                      {modules[activeModuleTab].mainQuestions.map((mq) => (
                        <div key={mq.questionNumber} className="space-y-3">
                          {mq.choices.map((choice, cIdx) => (
                            <div key={choice.choiceId} className="space-y-2">
                              {choice.isOrOption && (
                                <div className="text-center font-black text-slate-400 my-2 tracking-widest text-[11px]">
                                  — OR —
                                </div>
                              )}
                              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                                <div className="font-black text-purple-400 text-xs flex justify-between">
                                  <span>{choice.choiceId}</span>
                                </div>

                                {choice.subQuestions.map((sub) => (
                                  <div key={sub.subCode} className="space-y-1 pl-2 border-l-2 border-purple-500/30">
                                    <div className="flex justify-between items-start text-slate-200">
                                      <p className="flex-1 font-medium">
                                        <span className="font-black text-purple-300">({sub.subCode})</span> {sub.text}
                                      </p>
                                      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                                        {sub.bloomLevel && (
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-900/60 text-purple-300 border border-purple-700/50">
                                            {sub.bloomLevel}
                                          </span>
                                        )}
                                        <span className="font-bold text-white text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                                          {sub.marks}M
                                        </span>
                                      </div>
                                    </div>

                                    {/* Faculty Verified Solution */}
                                    {showSolutionMode && sub.solution && (
                                      <div className="mt-2 p-2.5 rounded bg-emerald-950/50 border border-emerald-800/60 text-[11px] text-emerald-300 font-mono space-y-1">
                                        <span className="font-bold text-emerald-400 block text-[10px] uppercase tracking-wider">
                                          ✓ Step-by-Step Verified Solution:
                                        </span>
                                        <p>{sub.solution}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-lg bg-slate-950/60 border border-slate-800 text-center space-y-2 py-12">
                  <FileText className="h-10 w-10 text-purple-400 mx-auto" />
                  <p className="font-bold text-white text-sm">Scanned PDF Document Page {currentPage}</p>
                  <p className="text-xs text-slate-400">{paper.fileUrl || 's3://vtu-papers-prod/official_paper.pdf'}</p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[10px] text-slate-500">
                <span>VTU Centralized Digital Question Paper Bank</span>
                <span>Page {isDigitalTyped ? activeModuleTab + 1 : currentPage} of {isDigitalTyped ? modules.length : paper.pageCount}</span>
              </div>
            </div>
          </div>

          {/* Secure Signed URL Display */}
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Lock className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
              <span className="text-[10px] text-slate-400 font-mono truncate">{paper.secureUrl || paper.fileUrl}</span>
            </div>
            <button
              onClick={handleCopySecureUrl}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-white flex items-center gap-1.5 flex-shrink-0"
            >
              {copiedUrl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedUrl ? 'Copied' : 'Copy Tokenized URL'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>VTU Question Paper Preview rendering active. Verified solution key integrated.</span>
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close Paper Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
