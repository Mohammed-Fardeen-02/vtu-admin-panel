import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Users,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { Button } from '../../shared/components/ui/Button';
import { UniversityGlobe3D } from '../../shared/components/graphics/UniversityGlobe3D';
import {
  DashboardSkeleton,
  EmptyStateView,
  ErrorStateView,
  PermissionDeniedView,
} from '../../shared/components/ui/StateViews';
import {
  DashboardStateControls,
  DashboardViewState,
} from './components/DashboardStateControls';
import { OperationalOverviewGrid } from './components/OperationalOverviewGrid';
import { PendingApprovalsSection } from './components/PendingApprovalsSection';
import { RecentUploadsSection } from './components/RecentUploadsSection';
import { RecentReportsSection } from './components/RecentReportsSection';
import { RecentUsersSection } from './components/RecentUsersSection';
import { RecentPaymentsSection } from './components/RecentPaymentsSection';
import { AttentionRequiredSection } from './components/AttentionRequiredSection';

export const DashboardPage: React.FC = () => {
  const [viewState, setViewState] = useState<DashboardViewState>('NORMAL');

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="VTU Super App Operational Dashboard"
        description="Comprehensive real-time administrative telemetry, student repository uploads, moderation queue, and revenue control center."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/circulars">
              <Button variant="outline" size="sm" icon={<Bell className="h-4 w-4" />}>
                Circulars
              </Button>
            </Link>
            <Link to="/notes">
              <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
                Moderate Notes
              </Button>
            </Link>
          </div>
        }
      />

      {/* State Controls Bar for Testing */}
      <DashboardStateControls currentMode={viewState} onModeChange={setViewState} />

      {/* Conditional UI State Renderings */}
      {viewState === 'LOADING' && <DashboardSkeleton />}

      {viewState === 'EMPTY' && (
        <EmptyStateView
          title="Operational Telemetry Quiet"
          description="There are currently no pending student notes, unverified packages, or active moderation reports needing review."
          actionLabel="Refresh Data"
          onAction={() => setViewState('NORMAL')}
        />
      )}

      {viewState === 'ERROR' && (
        <ErrorStateView
          title="Telemetry Connection Timeout"
          message="Could not establish a secure handshake with the VTU central metrics service. Please check your network or try again."
          onRetry={() => setViewState('NORMAL')}
        />
      )}

      {viewState === 'PERMISSION_DENIED' && (
        <PermissionDeniedView
          requiredRole="VTU Central Controller / Executive Admin"
          onContactAdmin={() => alert('Access permission request sent to VTU IT Department.')}
        />
      )}

      {viewState === 'NORMAL' && (
        <>
          {/* Executive Welcome Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-primary to-indigo-900 p-6 md:p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                  <span>Visvesvaraya Technological University Belagavi</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  VTU Governance & Administrative Operations
                </h1>
                <p className="text-xs md:text-sm text-blue-100/80 leading-relaxed">
                  Real-time operational control center monitoring 148,000+ student profiles, peer notes verification, exam paper archives, passing packages, and payment gateway revenue logs.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Link to="/circulars">
                  <Button variant="secondary" icon={<Plus className="h-4 w-4" />}>
                    Broadcast Circular
                  </Button>
                </Link>
                <Link to="/students">
                  <Button
                    variant="primary"
                    className="bg-white text-primary hover:bg-slate-100"
                    icon={<Users className="h-4 w-4" />}
                  >
                    Search USN
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Operational Metrics KPI Grid (12 InfoCards) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                Operational Telemetry & Content System Statistics
              </h3>
              <span className="text-[11px] text-muted-foreground font-medium">
                Click any card to open management page
              </span>
            </div>
            <OperationalOverviewGrid loading={false} />
          </div>

          {/* 3D Network Visualization */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  VTU Academic Constellation & Live Network Nodes
                </h3>
                <p className="text-xs text-muted-foreground">
                  3D Node map representing affiliated engineering colleges across Bengaluru, Mysuru, Belagavi, and Kalaburagi regions.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live Telemetry Active
              </span>
            </div>

            <UniversityGlobe3D />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60 text-center">
              <div className="p-3 rounded-xl bg-accent/30 border border-border/60">
                <span className="text-xs font-bold text-muted-foreground">Active VTU Scheme</span>
                <p className="text-sm font-black text-primary mt-0.5">2022 NEP Scheme</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/30 border border-border/60">
                <span className="text-xs font-bold text-muted-foreground">Passing Grade Rule</span>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  40.00% (P Grade)
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent/30 border border-border/60">
                <span className="text-xs font-bold text-muted-foreground">Min Attendance Requirement</span>
                <p className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">
                  75.00% Eligibility
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Sections Grid */}
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
              Actionable Moderation & Activity Feeds
            </h3>

            {/* Row 1: Pending Approvals & Content Requiring Attention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PendingApprovalsSection />
              <AttentionRequiredSection />
            </div>

            {/* Row 2: Recent Uploads & Recent Moderation Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentUploadsSection />
              <RecentReportsSection />
            </div>

            {/* Row 3: Recent Registered Users & Order Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentUsersSection />
              <RecentPaymentsSection />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
