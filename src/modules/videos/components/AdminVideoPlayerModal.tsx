import React from 'react';
import { X, Youtube, ExternalLink } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';

interface AdminVideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    title: string;
    youtubeVideoId: string;
    youtubeUrl?: string;
    durationText?: string;
    unitName?: string;
    topicName?: string;
    moduleNumber?: number;
  } | null;
}

export const AdminVideoPlayerModal: React.FC<AdminVideoPlayerModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  if (!isOpen || !video || !video.youtubeVideoId) return null;

  const ytUrl =
    video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-black text-white">
          <div className="flex items-center gap-2.5 truncate mr-4">
            <Youtube className="h-5 w-5 text-rose-500 flex-shrink-0" />
            <div className="truncate">
              <h3 className="text-sm font-black truncate">{video.title}</h3>
              <p className="text-[11px] text-zinc-400">
                {video.moduleNumber ? `Module ${video.moduleNumber} • ` : ''}
                {video.unitName || 'Video Lecture'}
                {video.durationText ? ` (${video.durationText})` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 16:9 Video Player Viewport */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
            title={video.title}
            className="w-full h-full border-0"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-card text-xs">
          <div className="text-muted-foreground">
            Playing directly via YouTube Embed API (ID: <span className="font-mono text-foreground font-bold">{video.youtubeVideoId}</span>)
          </div>
          <div className="flex items-center gap-2">
            <a
              href={ytUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-accent text-foreground font-bold"
            >
              <Youtube className="h-3.5 w-3.5 text-rose-500" /> Watch on YouTube <ExternalLink className="h-3 w-3" />
            </a>
            <Button variant="primary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
