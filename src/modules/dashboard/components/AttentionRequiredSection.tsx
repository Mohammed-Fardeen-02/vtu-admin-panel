import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowUpRight, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { MOCK_ATTENTION_ITEMS } from '../../../shared/constants/mockData';

export const AttentionRequiredSection: React.FC = () => {
  return (
    <Card className="h-full border-border border-l-4 border-l-amber-500">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <span>Content Requiring Attention</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational bottlenecks, missing syllabus files, and high-report flagged resources.
          </p>
        </div>
        <Badge variant="warning" className="text-[10px]">
          {MOCK_ATTENTION_ITEMS.length} Alerts
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {MOCK_ATTENTION_ITEMS.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={item.severity === 'HIGH' ? 'error' : 'warning'} className="text-[9px]">
                  {item.severity} SEVERITY
                </Badge>
                <span className="text-xs font-extrabold text-foreground">{item.subjectCode} ({item.branch})</span>
              </div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {item.type.replace('_', ' ')}
              </span>
            </div>

            <h4 className="text-xs font-bold text-foreground leading-snug">{item.title}</h4>
            <p className="text-[11px] text-muted-foreground bg-card p-2 rounded-lg border border-border">
              <span className="font-semibold text-foreground">Required Action:</span> {item.actionRequired}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
