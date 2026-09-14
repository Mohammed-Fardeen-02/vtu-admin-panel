import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  Tag,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Send,
  Edit2,
  Archive,
  Trash2,
  RefreshCw,
  Smartphone,
  History,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { Input } from '../../shared/components/ui/Input';
import { useCalendarStore } from '../../store/useCalendarStore';
import { CalendarEventFormModal } from './components/CalendarEventFormModal';
import { CalendarEvent, CalendarEventCategory, CalendarEventStatus } from '../../shared/types/calendar.types';

export const AcademicCalendarPage: React.FC = () => {
  const {
    events,
    auditLogs,
    filterCategory,
    filterStatus,
    filterBranch,
    filterScheme,
    filterSemester,
    searchQuery,
    setFilterCategory,
    setFilterStatus,
    setFilterBranch,
    setFilterScheme,
    setFilterSemester,
    setSearchQuery,
    publishEvent,
    archiveEvent,
    deleteEvent,
    publishAllDrafts,
    syncMobileApp,
  } = useCalendarStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter logic
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || evt.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || evt.status === filterStatus;
    const matchesBranch = filterBranch === 'ALL' || evt.branchId === 'ALL' || evt.branchId === filterBranch;
    const matchesScheme = filterScheme === 'ALL' || evt.schemeId === 'ALL' || evt.schemeId === filterScheme;
    const matchesSem =
      filterSemester === 'ALL' || evt.semester === 'ALL' || String(evt.semester) === filterSemester;

    return matchesSearch && matchesCategory && matchesStatus && matchesBranch && matchesScheme && matchesSem;
  });

  const draftCount = events.filter((e) => e.status === 'DRAFT').length;
  const publishedCount = events.filter((e) => e.status === 'PUBLISHED').length;

  const handleEdit = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const getCategoryBadgeVariant = (cat: CalendarEventCategory) => {
    switch (cat) {
      case 'SEMESTER_START':
      case 'SEMESTER_END':
        return 'primary';
      case 'INTERNAL_EXAM':
        return 'warning';
      case 'LAB_EXAM':
        return 'info';
      case 'VTU_EXAM':
        return 'error';
      case 'RESULT_DATE':
        return 'success';
      case 'HOLIDAY':
        return 'outline';
      default:
        return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            VTU Academic Calendar & Event Scheduler
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Publish university term dates, internal assessments, SEE exam timetables, result release dates, and holidays to mobile application.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogsModal(true)}
            icon={<History className="h-3.5 w-3.5" />}
          >
            Audit Logs ({auditLogs.length})
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => syncMobileApp()}
            icon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Sync Mobile Feed
          </Button>

          {draftCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => publishAllDrafts()}
              icon={<Send className="h-3.5 w-3.5" />}
              className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
            >
              Publish All Drafts ({draftCount})
            </Button>
          )}

          <Button variant="primary" size="sm" onClick={handleCreateNew} icon={<Plus className="h-4 w-4" />}>
            Add Calendar Event
          </Button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Search events by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Categories</option>
                <option value="SEMESTER_START">Semester Start</option>
                <option value="SEMESTER_END">Semester End</option>
                <option value="INTERNAL_EXAM">Internal Exam (IA)</option>
                <option value="LAB_EXAM">Lab / Practical Exam</option>
                <option value="VTU_EXAM">VTU Exam (SEE Theory)</option>
                <option value="RESULT_DATE">Result Date</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="ACADEMIC_EVENT">Academic Event</option>
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Workflow States</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border/50 text-xs">
            <span className="font-extrabold text-muted-foreground flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Target Filters:
            </span>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="h-8 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
            >
              <option value="ALL">Branch: All</option>
              <option value="CSE">Branch: CSE</option>
              <option value="ECE">Branch: ECE</option>
              <option value="ISE">Branch: ISE</option>
              <option value="ME">Branch: ME</option>
              <option value="EEE">Branch: EEE</option>
              <option value="CIVIL">Branch: CIVIL</option>
            </select>

            <select
              value={filterScheme}
              onChange={(e) => setFilterScheme(e.target.value)}
              className="h-8 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
            >
              <option value="ALL">Scheme: All</option>
              <option value="2021">Scheme 2021</option>
              <option value="2022">Scheme 2022</option>
              <option value="2025">Scheme 2025</option>
            </select>

            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="h-8 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
            >
              <option value="ALL">Semester: All</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={String(s)}>
                  Sem {s}
                </option>
              ))}
            </select>

            <div className="ml-auto text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredEvents.length}</strong> events
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Timeline List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredEvents.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm font-bold text-foreground">No events found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search criteria or create a new event.
              </p>
            </Card>
          ) : (
            filteredEvents.map((evt) => (
              <Card key={evt.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getCategoryBadgeVariant(evt.category)} className="text-[10px]">
                        {evt.category.replace('_', ' ')}
                      </Badge>

                      <Badge
                        variant={
                          evt.status === 'PUBLISHED'
                            ? 'success'
                            : evt.status === 'DRAFT'
                            ? 'warning'
                            : 'neutral'
                        }
                        className="text-[10px]"
                      >
                        {evt.status}
                      </Badge>

                      {evt.isMobileSynced && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Smartphone className="h-3 w-3" /> Synced to App
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-foreground">{evt.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{evt.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <span>Target Branch: <strong className="text-foreground">{evt.branchId}</strong></span>
                      <span>Target Scheme: <strong className="text-foreground">{evt.schemeId}</strong></span>
                      <span>Target Sem: <strong className="text-foreground">{evt.semester}</strong></span>
                      <span>Created By: <strong className="text-foreground">{evt.createdBy}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="p-3 rounded-xl bg-accent/40 border border-border text-right min-w-[170px]">
                      <span className="text-[11px] font-bold text-muted-foreground block">Term Schedule</span>
                      <span className="text-xs font-black text-primary mt-0.5 block">
                        {evt.startDate} → {evt.endDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {evt.status === 'DRAFT' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => publishEvent(evt.id)}
                          icon={<Send className="h-3 w-3 text-emerald-500" />}
                          title="Publish to Mobile"
                        >
                          Publish
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(evt)}
                        icon={<Edit2 className="h-3 w-3" />}
                        title="Edit Event"
                      />

                      {evt.status !== 'ARCHIVED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => archiveEvent(evt.id)}
                          icon={<Archive className="h-3 w-3" />}
                          title="Archive Event"
                        />
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDeleteId(evt.id)}
                        icon={<Trash2 className="h-3 w-3 text-rose-500" />}
                        title="Delete Event"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Stats & Term Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Active Term Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-1.5">
                <span className="text-xs font-bold text-primary">VTU Academic Term</span>
                <p className="text-lg font-black text-foreground">2026 - 2027 Odd Semester</p>
                <p className="text-xs text-muted-foreground">NEP 2020 & 2022 Scheme Framework</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/40 border border-border">
                  <span className="font-semibold text-muted-foreground">Published Events</span>
                  <Badge variant="success" className="font-extrabold">{publishedCount} Events</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/40 border border-border">
                  <span className="font-semibold text-muted-foreground">Pending Draft Events</span>
                  <Badge variant="warning" className="font-extrabold">{draftCount} Drafts</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/40 border border-border">
                  <span className="font-semibold text-muted-foreground">Total Working Days</span>
                  <span className="font-extrabold text-foreground">90 Working Days</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/40 border border-border">
                  <span className="font-semibold text-muted-foreground">Practical SEE Start</span>
                  <span className="font-extrabold text-primary">Dec 01, 2026</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/40 border border-border">
                  <span className="font-semibold text-muted-foreground">Theory SEE Start</span>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400">Dec 15, 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-extrabold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Mobile Sync Rule
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Events marked as <strong className="text-foreground">PUBLISHED</strong> are automatically synced with student mobile apps via the VTU Calendar API endpoint.
              </p>
              <p>
                Draft items remain hidden from public mobile feeds until an authorized administrator clicks <strong className="text-foreground">Publish</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Form Modal */}
      <CalendarEventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingEvent}
      />

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-black text-foreground">Confirm Event Deletion</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to permanently delete this calendar event? This action will remove it from the admin console and student mobile app feeds.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={() => {
                  deleteEvent(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                Delete Event
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-black text-foreground">Academic Calendar Audit Logs</h2>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No audit logs recorded yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl border border-border bg-accent/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground">{log.eventTitle}</span>
                      <Badge variant="primary" className="text-[10px]">{log.action}</Badge>
                    </div>
                    <p className="text-muted-foreground">{log.details}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                      <span>Changed by: {log.changedBy} ({log.role})</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="outline" onClick={() => setShowLogsModal(false)}>Close Audit Log</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
