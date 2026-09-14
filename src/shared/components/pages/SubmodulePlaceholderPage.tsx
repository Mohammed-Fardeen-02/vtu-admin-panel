import React from 'react';
import { Construction, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface SubmodulePlaceholderPageProps {
  moduleName: string;
  submoduleName: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const SubmodulePlaceholderPage: React.FC<SubmodulePlaceholderPageProps> = ({
  moduleName,
  submoduleName,
  description,
  icon: Icon = Construction,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <span>{moduleName}</span>
            <span>/</span>
            <span>{submoduleName}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">{submoduleName}</h1>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* KPI Skeleton / Metrics Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: `Total ${submoduleName}`, value: '0', change: 'Configured' },
          { label: 'Active Items', value: '0', change: 'Ready' },
          { label: 'Pending Review', value: '0', change: 'System' },
          { label: 'Archived', value: '0', change: 'Storage' },
        ].map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">{kpi.label}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-foreground">{kpi.value}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Empty / Provisioning State */}
      <div className="flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed border-border bg-card/50 text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-bold text-foreground">
            {submoduleName} Submodule Ready for Data Pipeline
          </h3>
          <p className="text-xs text-muted-foreground">
            This submodule is structured under the <strong className="text-foreground">{moduleName}</strong> module. Backend API connections and specific management views will connect automatically upon feature release.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="outline" size="sm" icon={<Sparkles className="h-4 w-4 text-amber-500" />}>
            Module Architecture Standardized
          </Button>
        </div>
      </div>
    </div>
  );
};
