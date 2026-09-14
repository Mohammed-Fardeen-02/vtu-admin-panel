import React from 'react';
import { ShieldAlert, AlertTriangle, Inbox, RefreshCw, Lock } from 'lucide-react';
import { Button } from './Button';

// 1. Loading Skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />

      {/* KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800 border border-border"
          />
        ))}
      </div>

      {/* Table Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};

// 2. Empty State View
export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyStateView: React.FC<EmptyStateProps> = ({
  title = 'No Operational Data Available',
  description = 'There are no active submissions, reports, or pending tasks requiring attention at this moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-border bg-card/60 space-y-4">
      <div className="p-4 rounded-full bg-primary/10 text-primary">
        <Inbox className="h-8 w-8" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-extrabold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// 3. Error State View
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorStateView: React.FC<ErrorStateProps> = ({
  title = 'Failed to Load Operational Overview',
  message = 'An unexpected network error occurred while fetching administrative telemetry metrics. Please verify server connectivity and retry.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-4">
      <div className="p-3.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-black text-rose-700 dark:text-rose-300">{title}</h3>
        <p className="text-xs text-rose-600/80 dark:text-rose-400/80 leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
};

// 4. Permission Denied State View
export interface PermissionDeniedProps {
  requiredRole?: string;
  onContactAdmin?: () => void;
}

export const PermissionDeniedView: React.FC<PermissionDeniedProps> = ({
  requiredRole = 'Super Administrator / Exam Controller',
  onContactAdmin,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
      <div className="p-4 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <Lock className="h-9 w-9" />
      </div>
      <div className="max-w-md space-y-1.5">
        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300">
          Access Restricted
        </span>
        <h3 className="text-xl font-black text-foreground">Permission Denied</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your account credentials do not have permission to access the operational dashboard. Required role level: <span className="font-extrabold text-foreground">{requiredRole}</span>.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go Back
        </Button>
        {onContactAdmin && (
          <Button variant="primary" size="sm" onClick={onContactAdmin}>
            Request Permission
          </Button>
        )}
      </div>
    </div>
  );
};
