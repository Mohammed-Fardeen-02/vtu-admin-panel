import React, { useState } from 'react';
import { X, Youtube, Download, Link2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { useVideoStore } from '../../../store/useVideoStore';

interface PlaylistImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export const PlaylistImportModal: React.FC<PlaylistImportModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}) => {
  const { importYouTubePlaylist } = useVideoStore();
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) {
      setError('YouTube Playlist URL or ID is required');
      return;
    }

    importYouTubePlaylist(courseId, playlistUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-rose-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
              <Youtube className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Import YouTube Playlist</h3>
              <p className="text-xs text-muted-foreground truncate max-w-[280px]">{courseTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Paste a public YouTube Playlist URL or Playlist ID. The admin engine will fetch video metadata, thumbnails, durations, and map them to this course structure without hosting video files locally.
          </p>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              YouTube Playlist Link / ID <span className="text-rose-500">*</span>
            </label>
            <Input
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_..."
              error={error}
            />
          </div>

          <div className="p-3 rounded-xl bg-accent/30 border border-border text-[11px] text-muted-foreground space-y-1">
            <span className="font-bold text-foreground block">Supported Formats:</span>
            <p>• Full URL: https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_...</p>
            <p>• Raw ID: PLBlnK6fEyqRi_CUQ-FXxgzKQ1dwr_ZJWZ</p>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              icon={<Download className="h-4 w-4" />}
            >
              Fetch & Import Videos
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
