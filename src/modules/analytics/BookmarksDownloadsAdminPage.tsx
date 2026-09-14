import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Bookmark,
  TrendingUp,
  HardDrive,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  Filter,
  Eye,
  RefreshCcw,
  Wifi,
  WifiOff,
  Clock,
  PieChart,
  Award,
  BookOpen,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { ConfirmationModal } from '../../shared/components/ui/ConfirmationModal';

import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { ResourceTelemetryItem, ResourceCategory } from '../../shared/types/analytics.types';

export const BookmarksDownloadsAdminPage: React.FC = () => {
  const {
    resources,
    typeDistributions,
    semesterDistributions,
    subjectTelemetries,
    trendPoints,
    recentDownloads,
    toggleResourceAccess,
    toggleOfflineCache,
  } = useAnalyticsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [accessFilter, setAccessFilter] = useState<string>('ALL');

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
  });

  // Filtered Resources
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          r.title.toLowerCase().includes(q) ||
          r.subjectCode.toLowerCase().includes(q) ||
          r.subjectName.toLowerCase().includes(q);
      }

      const matchesType = typeFilter === 'ALL' || r.resourceType === typeFilter;
      const matchesAccess =
        accessFilter === 'ALL'
          ? true
          : accessFilter === 'ENABLED'
          ? !r.isAccessDisabled
          : r.isAccessDisabled;

      return matchesSearch && matchesType && matchesAccess;
    });
  }, [resources, searchQuery, typeFilter, accessFilter]);

  // Aggregated Totals
  const totalDownloads = useMemo(() => typeDistributions.reduce((acc, t) => acc + t.downloadsCount, 0), [typeDistributions]);
  const totalBookmarks = useMemo(() => typeDistributions.reduce((acc, t) => acc + t.bookmarksCount, 0), [typeDistributions]);

  // Leaderboard Rankings
  const topDownloaded = useMemo(
    () => [...resources].sort((a, b) => b.downloadsCount - a.downloadsCount),
    [resources]
  );

  const topBookmarked = useMemo(
    () => [...resources].sort((a, b) => b.bookmarksCount - a.bookmarksCount),
    [resources]
  );

  const requestToggleAccess = (r: ResourceTelemetryItem) => {
    const actionText = r.isAccessDisabled ? 'Re-enable' : 'Disable';
    setConfirmModal({
      isOpen: true,
      title: `${actionText} Access for '${r.subjectCode}' Resource?`,
      message: r.isAccessDisabled
        ? `Re-enabling access will restore student mobile app downloads and offline cache syncing.`
        : `Disabling access will immediately block student mobile app downloads while preserving historical telemetry data.`,
      action: () => toggleResourceAccess(r.id),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Bookmarks & Downloads Administration (ADMIN-FR-05)"
        description="Aggregated operational telemetry, download consumption analytics, resource access controls, and mobile offline caching compatibility."
      />

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl border border-blue-800/40 bg-blue-950/40 text-blue-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-blue-400 flex-shrink-0" />
          <div className="space-y-0.5 text-xs">
            <span className="font-extrabold text-white block">
              Privacy-Compliant Governance Engine
            </span>
            <span>
              All student activity metrics are strictly aggregated at the university/regional level. Individual student private bookmarks and download histories are protected by default.
            </span>
          </div>
        </div>

        <Badge variant="primary" icon={<Lock className="h-3 w-3" />} className="text-[10px] flex-shrink-0">
          Privacy Shield Active
        </Badge>
      </div>

      {/* Summary Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Download className="h-4 w-4 text-blue-500" /> Cumulative Downloads
          </span>
          <p className="text-3xl font-black text-foreground">{totalDownloads.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +24.8% growth this month
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Bookmark className="h-4 w-4 text-purple-500" /> Total Active Bookmarks
          </span>
          <p className="text-3xl font-black text-foreground">{totalBookmarks.toLocaleString()}</p>
          <span className="text-[11px] text-purple-600/80 font-bold">Saved across mobile clients</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Wifi className="h-4 w-4 text-emerald-500" /> Mobile Offline Cached Bundles
          </span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">18,420</p>
          <span className="text-[11px] text-muted-foreground">ETag cache validation synced</span>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <HardDrive className="h-4 w-4 text-amber-500" /> Bandwidth Saved via Cache
          </span>
          <p className="text-3xl font-black text-foreground">1.4 TB</p>
          <span className="text-[11px] text-muted-foreground">Local storage caching active</span>
        </div>
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downloads by Resource Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-black flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span>Downloads & Bookmarks by Resource Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {typeDistributions.map((t) => (
              <div key={t.resourceType} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground">{t.label}</span>
                  <span className="text-muted-foreground">
                    {t.downloadsCount.toLocaleString()} Downloads ({t.percentage}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-accent/40 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${t.percentage}%` }}
                    className="h-full bg-primary rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Downloads by Semester Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-black flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              <span>Semester-Wise Consumption Traffic (Sem 1 - 8)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-8 gap-2 items-end h-44 pt-4 pb-2 border-b border-border">
              {semesterDistributions.map((s) => {
                const maxVal = 25000;
                const heightPct = Math.round((s.downloadsCount / maxVal) * 100);

                return (
                  <div key={s.semesterNumber} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-extrabold text-foreground">{Math.round(s.downloadsCount / 1000)}k</span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-emerald-500/80 hover:bg-emerald-500 rounded-t-lg transition-all"
                    />
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Sem {s.semesterNumber}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground text-center pt-1 font-semibold">
              Peak student downloads concentrated in 5th Semester (Professional Core) & 4th Semester.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Resource Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Downloaded Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Most Downloaded Resources Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDownloaded.slice(0, 5).map((res, idx) => (
              <div
                key={res.id}
                className="p-3 rounded-xl border border-border/80 bg-accent/10 hover:bg-accent/30 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary font-black flex items-center justify-center text-xs flex-shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-foreground truncate block">
                      {res.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {res.subjectCode} • Sem {res.semester} ({res.branchCode})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 font-extrabold text-blue-600 dark:text-blue-400">
                  <Download className="h-3.5 w-3.5" />
                  <span>{res.downloadsCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Most Bookmarked Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-black flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-purple-500" />
              <span>Most Bookmarked Resources Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topBookmarked.slice(0, 5).map((res, idx) => (
              <div
                key={res.id}
                className="p-3 rounded-xl border border-border/80 bg-accent/10 hover:bg-accent/30 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-500 font-black flex items-center justify-center text-xs flex-shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-foreground truncate block">
                      {res.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {res.subjectCode} • Sem {res.semester} ({res.branchCode})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 font-extrabold text-purple-600 dark:text-purple-400">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>{res.bookmarksCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Download Activity Feed (Privacy-Compliant Regional Log) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-black flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Recent Aggregated Mobile Download Stream (Real-Time Telemetry)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-table-header-bg text-table-header-text border-b border-table-header-border">
                  <th className="p-3 font-extrabold">Timestamp</th>
                  <th className="p-3 font-extrabold">Resource Title</th>
                  <th className="p-3 font-extrabold">Subject Code</th>
                  <th className="p-3 font-extrabold">Resource Type</th>
                  <th className="p-3 font-extrabold">Branch</th>
                  <th className="p-3 font-extrabold text-right">VTU Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentDownloads.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-3 font-mono text-muted-foreground">{log.timestamp}</td>
                    <td className="p-3 font-bold text-foreground">{log.resourceTitle}</td>
                    <td className="p-3 font-black text-primary">{log.subjectCode}</td>
                    <td className="p-3">
                      <Badge variant="primary" className="text-[9px]">
                        {log.resourceType}
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold">{log.branchCode}</td>
                    <td className="p-3 text-right font-extrabold text-muted-foreground">
                      {log.collegeRegion} REGION
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resource Access & Mobile Offline Cache Governance Table */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-foreground">
              Resource Access & Mobile Offline Cache Governance
            </h3>
            <p className="text-xs text-muted-foreground">
              Inspect usage metrics, manage mobile ETag caching, and disable resource access when required.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resource..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="NOTES">Notes</option>
              <option value="QUESTION_PAPER">PYQs</option>
              <option value="PASSING_PACKAGE">Passing Packages</option>
              <option value="FORMULA_SHEET">Formulas</option>
              <option value="VIDEO_LECTURE">Videos</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-table-header-bg text-table-header-text border-b border-table-header-border">
                <th className="p-3 font-extrabold">Resource Title</th>
                <th className="p-3 font-extrabold">Subject Code</th>
                <th className="p-3 font-extrabold">Type</th>
                <th className="p-3 font-extrabold text-center">Downloads</th>
                <th className="p-3 font-extrabold text-center">Bookmarks</th>
                <th className="p-3 font-extrabold text-center">Offline Cache</th>
                <th className="p-3 font-extrabold text-center">Status</th>
                <th className="p-3 font-extrabold text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredResources.map((res) => (
                <tr key={res.id} className="hover:bg-accent/40 transition-colors">
                  <td className="p-3 font-bold text-foreground max-w-xs truncate">
                    {res.title}
                  </td>
                  <td className="p-3 font-black text-primary">{res.subjectCode}</td>
                  <td className="p-3">
                    <Badge variant="neutral" className="text-[9px]">
                      {res.resourceType}
                    </Badge>
                  </td>
                  <td className="p-3 text-center font-extrabold text-blue-600 dark:text-blue-400">
                    {res.downloadsCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center font-extrabold text-purple-600 dark:text-purple-400">
                    {res.bookmarksCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleOfflineCache(res.id)}
                      className="cursor-pointer"
                    >
                      {res.offlineCacheEnabled ? (
                        <Badge variant="success" icon={<Wifi className="h-3 w-3" />} className="text-[9px]">
                          Cache Synced
                        </Badge>
                      ) : (
                        <Badge variant="warning" icon={<WifiOff className="h-3 w-3" />} className="text-[9px]">
                          Cache Paused
                        </Badge>
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    {res.isAccessDisabled ? (
                      <Badge variant="error" icon={<Ban className="h-3 w-3" />} className="text-[9px]">
                        Access Blocked
                      </Badge>
                    ) : (
                      <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />} className="text-[9px]">
                        Active
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant={res.isAccessDisabled ? 'primary' : 'destructive'}
                      size="sm"
                      onClick={() => requestToggleAccess(res)}
                      icon={res.isAccessDisabled ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                    >
                      {res.isAccessDisabled ? 'Enable Access' : 'Disable Access'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.action();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
