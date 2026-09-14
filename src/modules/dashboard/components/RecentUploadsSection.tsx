import React from 'react';
import { UploadCloud, FileText, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { MOCK_NOTES } from '../../../shared/constants/mockData';

export const RecentUploadsSection: React.FC = () => {
  return (
    <Card className="h-full border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-primary" />
            <span>Recent Content Uploads</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest study materials, module notes, and past papers added to the repository.
          </p>
        </div>
        <Link to="/notes">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {MOCK_NOTES.map((note) => (
          <div
            key={note.id}
            className="p-3 rounded-xl border border-border bg-card hover:bg-accent/40 transition-colors flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground truncate">
                    {note.title}
                  </span>
                  <Badge variant="neutral" className="text-[9px]">
                    {note.type}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {note.subjectCode} • Sem {note.semester} • By {note.authorName} ({note.uploadDate})
                </p>
              </div>
            </div>

            <Badge
              variant={
                note.status === 'APPROVED'
                  ? 'success'
                  : note.status === 'PENDING'
                  ? 'warning'
                  : 'error'
              }
              className="flex-shrink-0 text-[10px]"
            >
              {note.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
