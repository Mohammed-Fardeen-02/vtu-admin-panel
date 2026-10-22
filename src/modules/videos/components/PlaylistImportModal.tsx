import React, { useState } from 'react';
import { X, Youtube, Download, Link2, CheckCircle2, ListPlus } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { useVideoStore } from '../../../store/useVideoStore';
import { extractYoutubeVideoId } from './AddVideoLessonModal';

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
  const [tab, setTab] = useState<'PLAYLIST' | 'BULK_VIDEOS'>('PLAYLIST');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [bulkUrlsText, setBulkUrlsText] = useState('');
  const [targetModule, setTargetModule] = useState<'AUTO' | '1' | '2' | '3' | '4' | '5'>('AUTO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Parse bulk URLs into structured video objects
  const parsedBulkVideos = bulkUrlsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, idx) => {
      const vId = extractYoutubeVideoId(line);
      const modNum = targetModule === 'AUTO' ? Math.min(Math.floor(idx / 2) + 1, 5) : Number(targetModule);
      return {
        youtubeUrl: line,
        videoId: vId,
        moduleNumber: modNum,
        title: `Lecture ${idx + 1}: Module ${modNum} Topic`,
        durationText: '18:00',
      };
    })
    .filter((v) => !!v.videoId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'PLAYLIST') {
      if (!playlistUrl.trim()) {
        setError('YouTube Playlist URL or ID is required');
        return;
      }
      setIsSubmitting(true);
      try {
        await importYouTubePlaylist(courseId, playlistUrl.trim());
        onClose();
      } catch (err) {
        setError('Failed to import playlist. Check server.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (parsedBulkVideos.length === 0) {
        setError('Please paste at least one valid YouTube video URL or ID (one per line)');
        return;
      }

      setIsSubmitting(true);
      try {
        await importYouTubePlaylist(
          courseId,
          playlistUrl.trim() || `https://www.youtube.com/watch?v=${parsedBulkVideos[0].videoId}`,
          parsedBulkVideos.map((v) => ({
            moduleNumber: v.moduleNumber,
            title: v.title,
            youtubeUrl: v.youtubeUrl,
            durationText: v.durationText,
          }))
        );
        onClose();
      } catch (err) {
        setError('Failed to import video batch.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-rose-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
              <Youtube className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Import YouTube Content</h3>
              <p className="text-xs text-muted-foreground truncate max-w-[320px]">{courseTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-accent/20 px-6 pt-3 gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('PLAYLIST')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              tab === 'PLAYLIST'
                ? 'border-rose-500 text-rose-500 font-black'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" /> Link YouTube Playlist URL
          </button>
          <button
            type="button"
            onClick={() => setTab('BULK_VIDEOS')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              tab === 'BULK_VIDEOS'
                ? 'border-rose-500 text-rose-500 font-black'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListPlus className="h-3.5 w-3.5" /> Bulk Add Video Links (Line-by-Line)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-500">
              {error}
            </div>
          )}

          {tab === 'PLAYLIST' ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste a public YouTube Playlist URL or Playlist ID. The app links the playlist and syncs it with the mobile player without hosting video files locally.
              </p>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  YouTube Playlist Link / ID <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  placeholder="https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_..."
                />
              </div>

              <div className="p-3 rounded-xl bg-accent/30 border border-border text-[11px] text-muted-foreground space-y-1">
                <span className="font-bold text-foreground block">Supported Formats:</span>
                <p>• Full URL: https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_...</p>
                <p>• Raw ID: PLBlnK6fEyqRi_CUQ-FXxgzKQ1dwr_ZJWZ</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste YouTube video links (one URL per line). The engine will automatically extract the video ID and fetch real YouTube thumbnails for each lecture.
              </p>

              {/* Target Module Allocation */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Module Distribution
                </label>
                <select
                  value={targetModule}
                  onChange={(e) => setTargetModule(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground"
                >
                  <option value="AUTO">Auto-distribute evenly across Modules 1 to 5</option>
                  <option value="1">Assign all to Module 1</option>
                  <option value="2">Assign all to Module 2</option>
                  <option value="3">Assign all to Module 3</option>
                  <option value="4">Assign all to Module 4</option>
                  <option value="5">Assign all to Module 5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Paste YouTube URLs (1 per line) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={bulkUrlsText}
                  onChange={(e) => setBulkUrlsText(e.target.value)}
                  placeholder={`https://www.youtube.com/watch?v=3EJOX2kGi9Q\nhttps://youtu.be/f0Xz-0X78h4\nhttps://www.youtube.com/watch?v=UrYLYV7WSHM`}
                  className="w-full p-3 rounded-xl border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Live Preview of detected videos */}
              {parsedBulkVideos.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{parsedBulkVideos.length} YouTube Video Links Detected:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 max-h-36 overflow-y-auto">
                    {parsedBulkVideos.map((v, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden aspect-video bg-black/60 border border-emerald-500/30">
                        <img
                          src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                          alt={`Video ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 text-[9px] bg-black/80 text-white font-mono px-1 rounded">
                          M{v.moduleNumber} • #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
              icon={<Download className="h-4 w-4" />}
            >
              {isSubmitting
                ? 'Processing...'
                : tab === 'PLAYLIST'
                ? 'Link Playlist'
                : `Import ${parsedBulkVideos.length} Video Lessons`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
