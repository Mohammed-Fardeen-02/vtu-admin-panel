import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { MOCK_REPORTS } from '../../../shared/constants/mockData';
import { ModerationReport } from '../../../shared/types/vtu.types';

export const RecentReportsSection: React.FC = () => {
  const [reports, setReports] = useState<ModerationReport[]>(MOCK_REPORTS);

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, status: 'RESOLVED' } : rep))
    );
  };

  const pendingReports = reports.filter((r) => r.status === 'PENDING');

  return (
    <Card className="h-full border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-500" />
            <span>Recent Reports Awaiting Moderation</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Content flagged by students for incorrect syllabus or quality concerns.
          </p>
        </div>
        <Link to="/reports">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
            View All Reports
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {pendingReports.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-border rounded-xl">
            <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-foreground">Zero Unresolved Reports</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              All reported items have been reviewed by the governance team.
            </p>
          </div>
        ) : (
          pendingReports.map((report) => (
            <div
              key={report.id}
              className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="error" className="text-[9px]">
                    {report.reason.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs font-extrabold text-foreground truncate">
                    {report.resourceTitle}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Reported by: <span className="font-semibold text-foreground">{report.reportedBy}</span> on {report.reportDate}
                </p>
                <p className="text-xs italic text-rose-700 dark:text-rose-300 bg-rose-500/10 p-2 rounded-lg mt-1">
                  "{report.details}"
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                  onClick={() => handleResolve(report.id)}
                  icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                >
                  Resolve
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
