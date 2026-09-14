import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, ShieldCheck, RefreshCw, Folder } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { AdminNote } from '../../../shared/types/notes.types';

export interface ReplaceFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: AdminNote;
  onReplaceFile: (id: string, fileKey: string, fileSize: string, fileSizeBytes: number, pageCount?: number) => void;
}

export const ReplaceFileModal: React.FC<ReplaceFileModalProps> = ({
  isOpen,
  onClose,
  note,
  onReplaceFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileKey, setFileKey] = useState(note.fileUrl);
  const [fileSize, setFileSize] = useState(note.fileSize);
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(note.fileSizeBytes || 5000000);
  const [pageCount, setPageCount] = useState<number>(note.pageCount);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSystemFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSimulatingUpload(true);
    setSelectedFileName(file.name);
    const bytes = file.size;
    setFileSizeBytes(bytes);
    const formattedSize =
      bytes > 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(bytes / 1024)} KB`;

    setTimeout(() => {
      setFileKey(`s3://vtu-notes-prod/revised/${file.name}`);
      setFileSize(formattedSize);
      setIsSimulatingUpload(false);
      setUploadSuccess(true);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReplaceFile(note.id, fileKey, fileSize, fileSizeBytes, pageCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-foreground">Replace Note Document File</h3>
            <p className="text-xs text-muted-foreground truncate max-w-xs">
              {note.subjectCode} - {note.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Existing File Card */}
        <div className="p-3.5 rounded-xl border border-border bg-accent/20 space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Current Attached File
          </span>
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 truncate">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-mono truncate">{note.fileUrl}</span>
            </div>
            <span className="font-bold text-foreground flex-shrink-0">{note.fileSize}</span>
          </div>
        </div>

        {/* System File Input (Hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleSystemFileChange}
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          className="hidden"
        />

        {/* Upload Action Zone */}
        <div className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 text-center space-y-3">
          <Upload className="h-8 w-8 text-primary mx-auto animate-bounce" />
          <div>
            <h4 className="text-xs font-black text-foreground">Upload Replacement File from Computer System</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Supports PDF, PPT, PPTX formats. Automatic virus scan & secure token URL generation enabled.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSimulatingUpload}
            icon={isSimulatingUpload ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Folder className="h-4 w-4" />}
          >
            {isSimulatingUpload ? 'Encrypting & Generating Tokens...' : 'Select File from System/Device'}
          </Button>

          {uploadSuccess && selectedFileName && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span className="truncate">New file: {selectedFileName} ({fileSize})</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-foreground mb-1">New File Storage Path / Key</label>
            <input
              type="text"
              value={fileKey}
              onChange={(e) => setFileKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono text-xs focus:ring-2 focus:ring-primary/40 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold focus:ring-2 focus:ring-primary/40 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Page Count</label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold focus:ring-2 focus:ring-primary/40 outline-none"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <span>Secure Signed Token URL will be automatically updated across all student mobile app clients.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Confirm & Update File
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
