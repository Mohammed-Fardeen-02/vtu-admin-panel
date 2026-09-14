import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Eye,
  Edit2,
  FileText,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Power,
} from 'lucide-react';
import { PaperStatus } from '../../types/papers.types';

export interface PaperActionDropdownProps {
  status?: PaperStatus | string;
  onView?: () => void;
  onPreview?: () => void;
  onEdit?: () => void;
  onReplaceFile?: () => void;
  onToggleStatus?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export const ActionDropdown: React.FC<PaperActionDropdownProps> = ({
  status = 'PUBLISHED',
  onView,
  onPreview,
  onEdit,
  onReplaceFile,
  onToggleStatus,
  onArchive,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewAction = onView || onPreview;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
        title="Actions Menu"
      >
        <span>Actions</span>
        <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-xl border border-border bg-card shadow-2xl p-1 animate-in fade-in duration-150 space-y-0.5">
          {handleViewAction && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleViewAction();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-purple-500/10 hover:text-purple-600 rounded-lg transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-purple-500" />
              <span>{onPreview ? 'Preview Paper' : 'View Details'}</span>
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-blue-500/10 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5 text-blue-500" />
              <span>Edit Details</span>
            </button>
          )}

          {onReplaceFile && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onReplaceFile();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-amber-500/10 hover:text-amber-600 rounded-lg transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-amber-500" />
              <span>Replace File</span>
            </button>
          )}

          {onToggleStatus && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onToggleStatus();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-emerald-500/10 hover:text-emerald-600 rounded-lg transition-colors"
            >
              {status === 'PUBLISHED' || status === 'ACTIVE' ? (
                <>
                  <XCircle className="h-3.5 w-3.5 text-amber-500" />
                  <span>Unpublish / Deactivate</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Publish / Activate</span>
                </>
              )}
            </button>
          )}

          {onArchive && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onArchive();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-slate-500/10 rounded-lg transition-colors"
            >
              <Archive className="h-3.5 w-3.5 text-slate-400" />
              <span>Archive</span>
            </button>
          )}

          {onDelete && (
            <>
              <div className="my-1 border-t border-border" />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDelete();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                <span>Delete Record</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
