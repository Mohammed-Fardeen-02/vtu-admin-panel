import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { MOCK_NOTES } from '../../../shared/constants/mockData';
import { Note } from '../../../shared/types/vtu.types';

export const PendingApprovalsSection: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);

  const handleApprove = (id: string) => {
    setNotes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'APPROVED' } : item))
    );
  };

  const handleReject = (id: string) => {
    setNotes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'REJECTED' } : item))
    );
  };

  const pendingList = notes.filter((item) => item.status === 'PENDING');

  return (
    <Card className="h-full border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <span>Pending Community Approvals</span>
            <Badge variant="warning" className="text-[10px]">
              {pendingList.length} Pending
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Student note uploads requiring VTU faculty verification.
          </p>
        </div>
        <Link to="/notes">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
            View All Notes
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {pendingList.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-foreground">All Submissions Verified</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              There are no pending student notes in the moderation queue.
            </p>
          </div>
        ) : (
          pendingList.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-border bg-accent/20 hover:bg-accent/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="text-[10px]">
                    {item.subjectCode}
                  </Badge>
                  <span className="text-xs font-extrabold text-foreground truncate">
                    {item.title}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <span>Author: {item.authorName} ({item.authorUsn})</span>
                  <span>•</span>
                  <span>{item.fileSize}</span>
                  <span>•</span>
                  <span>Uploaded {item.uploadDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleReject(item.id)}
                  icon={<XCircle className="h-3.5 w-3.5" />}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
