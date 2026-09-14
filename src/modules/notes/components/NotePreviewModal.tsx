import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Eye,
  Bookmark,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCcw,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { AdminNote } from '../../../shared/types/notes.types';

export interface NotePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: AdminNote;
}

export const NotePreviewModal: React.FC<NotePreviewModalProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [viewerMode, setViewerMode] = useState<'GOOGLE_DOCS' | 'NATIVE'>('GOOGLE_DOCS');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  let rawUrl = note.secureUrl || note.fileUrl || '';
  const targetUrl =
    rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('blob:')
      ? rawUrl
      : 'https://res.cloudinary.com/demo/image/upload/sample.pdf';

  const isImage = targetUrl?.match(/\.(jpeg|jpg|png|gif|webp)$/i);

  const handleCopySecureUrl = () => {
    navigator.clipboard.writeText(rawUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(targetUrl)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-2xl space-y-3 flex flex-col transition-all ${
          isFullscreen ? 'max-w-[98vw] h-[96vh]' : 'max-w-5xl max-h-[95vh] h-[85vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary font-black">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-primary text-xs">{note.subjectCode}</span>
                <span className="text-xs font-bold text-foreground">{note.subjectName}</span>
                <Badge variant={note.status === 'PUBLISHED' ? 'success' : 'neutral'} className="text-[9px]">
                  {note.status}
                </Badge>
              </div>
              <h3 className="text-base font-black text-foreground truncate max-w-xl">{note.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewer'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Academic Hierarchy & Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-accent/20 border border-border text-xs flex-shrink-0">
          <div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Academic Path</span>
            <span className="font-bold text-foreground">
              {note.branchCode} • Sem {note.semester} ({note.schemeYear} Scheme)
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Author</span>
            <span className="font-bold text-foreground">
              {note.authorName} ({note.authorRole})
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Format & Size</span>
            <span className="font-bold text-foreground">
              {note.format} • {note.fileSize} ({note.pageCount} Pages)
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">Telemetry</span>
            <span className="font-bold text-foreground flex items-center gap-2">
              <span className="flex items-center gap-1"><Download className="h-3 w-3 text-blue-500" /> {note.downloads}</span>
              <span className="flex items-center gap-1"><Bookmark className="h-3 w-3 text-amber-500" /> {note.bookmarksCount}</span>
            </span>
          </div>
        </div>

        {/* Reader Engine Switcher Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-primary" /> Viewer Mode:
            </span>
            <button
              onClick={() => setViewerMode('NATIVE')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewerMode === 'NATIVE'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Embedded PDF Reader
            </button>
            <button
              onClick={() => setViewerMode('GOOGLE_DOCS')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewerMode === 'GOOGLE_DOCS'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Google Cloud Reader
            </button>
          </div>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
            Open Full Window
          </a>
        </div>

        {/* Document Interactive PDF & Document Frame */}
        <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex flex-col">
          {isImage ? (
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
              <img src={targetUrl} alt={note.title} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
            </div>
          ) : viewerMode === 'NATIVE' ? (
            <iframe
              src={`${targetUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              title={note.title}
              className="w-full h-full border-0 bg-slate-900"
            />
          ) : (
            <iframe
              src={googleDocsViewerUrl}
              title={note.title}
              className="w-full h-full border-0 bg-slate-900"
            />
          )}
        </div>

        {/* Secure Link & Direct Download Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-border flex-shrink-0 text-xs">
          <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
            <Lock className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">{targetUrl}</span>
            <button
              onClick={handleCopySecureUrl}
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground flex-shrink-0"
              title="Copy Signed Storage URL"
            >
              {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href={targetUrl}
              download={note.title}
              className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary font-extrabold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download Document File
            </a>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Reader
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
