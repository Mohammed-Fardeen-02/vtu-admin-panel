import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  FileText,
  Send,
  CheckCircle2,
  Search,
  Download,
  Clock,
  AlertTriangle,
  History,
  Eye,
  Trash2,
  Edit2,
  XCircle,
  BarChart2,
  Users,
  Smartphone,
  Filter,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Badge } from '../../shared/components/ui/Badge';
import { useNotificationStore } from '../../store/useNotificationStore';
import { InAppNotification, NotificationType, NotificationStatus, AudienceType } from '../../shared/types/notification.types';
import { NotificationFormModal } from './components/NotificationFormModal';
import { NotificationPreviewModal } from './components/NotificationPreviewModal';
import { MassBroadcastConfirmationModal } from './components/MassBroadcastConfirmationModal';
import { MOCK_CIRCULARS } from '../../shared/constants/mockData';

export const CircularsPage: React.FC = () => {
  const {
    notifications,
    auditLogs,
    filterType,
    filterStatus,
    filterAudience,
    searchQuery,
    setFilterType,
    setFilterStatus,
    setFilterAudience,
    setSearchQuery,
    fetchNotifications,
    createNotification,
    updateNotification,
    sendImmediately,
    cancelScheduledNotification,
    deleteNotification,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const [activeTab, setActiveTab] = useState<'BROADCASTS' | 'CIRCULARS'>('BROADCASTS');
  const [circulars] = useState(MOCK_CIRCULARS);
  const [circularSearch, setCircularSearch] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<InAppNotification | null>(null);
  const [previewData, setPreviewData] = useState<Partial<InAppNotification> | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [massConfirmData, setMassConfirmData] = useState<Partial<InAppNotification> | null>(null);
  const [isMassConfirmOpen, setIsMassConfirmOpen] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [directSendId, setDirectSendId] = useState<string | null>(null);

  // Filtered Notifications
  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || n.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || n.status === filterStatus;
    const matchesAudience = filterAudience === 'ALL' || n.audience === filterAudience;

    return matchesSearch && matchesType && matchesStatus && matchesAudience;
  });

  const filteredCirculars = circulars.filter(
    (c) =>
      c.title.toLowerCase().includes(circularSearch.toLowerCase()) ||
      c.circularNo.toLowerCase().includes(circularSearch.toLowerCase())
  );

  const handleCreateNew = () => {
    setEditingNotif(null);
    setIsFormOpen(true);
  };

  const handleEdit = (n: InAppNotification) => {
    setEditingNotif(n);
    setIsFormOpen(true);
  };

  const handleOpenPreviewFromForm = (data: Partial<InAppNotification>) => {
    setPreviewData(data);
    setIsPreviewOpen(true);
  };

  const handleTriggerMassSendFromForm = (data: Partial<InAppNotification>) => {
    setMassConfirmData(data);
    setIsMassConfirmOpen(true);
  };

  const handleConfirmMassBroadcast = () => {
    if (massConfirmData) {
      if (editingNotif) {
        updateNotification(editingNotif.id, { ...massConfirmData, status: 'SENT' } as any);
        sendImmediately(editingNotif.id);
      } else {
        const newId = createNotification({ ...massConfirmData, status: 'SENT' } as any);
        sendImmediately(newId);
      }
    } else if (directSendId) {
      sendImmediately(directSendId);
      setDirectSendId(null);
    }
    setIsFormOpen(false);
  };

  const handleCardDirectSend = (n: InAppNotification) => {
    setDirectSendId(n.id);
    setMassConfirmData(n);
    setIsMassConfirmOpen(true);
  };

  const getTypeBadgeVariant = (type: NotificationType) => {
    switch (type) {
      case 'RESULT':
        return 'success';
      case 'CIRCULAR':
        return 'primary';
      case 'EXAM':
        return 'warning';
      case 'ACADEMIC':
        return 'info';
      case 'SYSTEM':
        return 'error';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Bell className="h-7 w-7 text-primary" />
            VTU Circulars & In-App Notification Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, target, schedule, and broadcast official university circulars, exam alerts, result announcements, and push notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAuditLogs(true)}
            icon={<History className="h-3.5 w-3.5" />}
          >
            Audit History ({auditLogs.length})
          </Button>

          <Button variant="primary" size="sm" onClick={handleCreateNew} icon={<Plus className="h-4 w-4" />}>
            New Push Notification
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('BROADCASTS')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 ${
            activeTab === 'BROADCASTS'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Push Notifications & Mass Broadcasts ({notifications.length})
        </button>

        <button
          onClick={() => setActiveTab('CIRCULARS')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 ${
            activeTab === 'CIRCULARS'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Official PDF Circular Library ({circulars.length})
        </button>
      </div>

      {activeTab === 'BROADCASTS' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search notifications by title, body keyword, or circular reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>

                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="RESULT">Result Alert</option>
                    <option value="CIRCULAR">Official Circular</option>
                    <option value="EXAM">Exam Timetable</option>
                    <option value="ACADEMIC">Academic Calendar Notice</option>
                    <option value="COMMUNITY">Community / Hackathon</option>
                    <option value="SYSTEM">System Maintenance</option>
                    <option value="PROMOTIONAL">Promotional / Resource</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ALL">All Delivery States</option>
                    <option value="SENT">Sent (Broadcasted)</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-muted-foreground flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" /> Audience Scope:
                  </span>
                  <select
                    value={filterAudience}
                    onChange={(e) => setFilterAudience(e.target.value as any)}
                    className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-semibold focus:outline-none"
                  >
                    <option value="ALL">All Scope Types</option>
                    <option value="ALL_STUDENTS">All Students</option>
                    <option value="BRANCH_SPECIFIC">Branch Specific</option>
                    <option value="SEMESTER_SPECIFIC">Semester Specific</option>
                    <option value="SCHEME_SPECIFIC">Scheme Specific</option>
                    <option value="COLLEGE_SPECIFIC">College Specific</option>
                  </select>
                </div>

                <div className="text-xs text-muted-foreground">
                  Showing <strong className="text-foreground">{filteredNotifications.length}</strong> items
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Feed */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="p-8 text-center">
                <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold text-foreground">No notifications found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust filters or create a new push notification alert.
                </p>
              </Card>
            ) : (
              filteredNotifications.map((notif) => (
                <Card key={notif.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={getTypeBadgeVariant(notif.type)} className="text-[10px]">
                          {notif.type}
                        </Badge>

                        <Badge
                          variant={
                            notif.status === 'SENT'
                              ? 'success'
                              : notif.status === 'SCHEDULED'
                              ? 'warning'
                              : notif.status === 'DRAFT'
                              ? 'neutral'
                              : 'error'
                          }
                          className="text-[10px]"
                        >
                          {notif.status}
                        </Badge>

                        <span className="text-[11px] font-bold text-muted-foreground bg-accent px-2 py-0.5 rounded border border-border">
                          Scope: {notif.audience}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-foreground">{notif.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{notif.body}</p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>Target Branch: <strong className="text-foreground">{notif.targetBranch}</strong></span>
                        <span>Target Semester: <strong className="text-foreground">{notif.targetSemester}</strong></span>
                        <span>Target Scheme: <strong className="text-foreground">{notif.targetScheme}</strong></span>
                        {notif.sentAt && <span>Sent At: <strong className="text-foreground">{notif.sentAt}</strong></span>}
                        {notif.scheduledFor && <span>Scheduled For: <strong className="text-amber-500 font-bold">{notif.scheduledFor}</strong></span>}
                      </div>
                    </div>

                    {/* Right Stats & Actions */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      {/* Delivery Stats Badge */}
                      <div className="p-3 rounded-xl bg-accent/40 border border-border text-right min-w-[190px] space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground font-bold">Target Reach:</span>
                          <span className="font-extrabold text-foreground">{notif.stats.recipientsCount.toLocaleString()}</span>
                        </div>
                        {notif.status === 'SENT' && (() => {
                          const deliveryPct = notif.stats.recipientsCount > 0 
                            ? Math.min(100, Math.round((notif.stats.deliveredCount / notif.stats.recipientsCount) * 100)) 
                            : 0;
                          const readPct = notif.stats.deliveredCount > 0 
                            ? Math.min(100, Math.round((notif.stats.openedCount / notif.stats.deliveredCount) * 100)) 
                            : 0;
                          return (
                            <>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground font-bold">Delivered:</span>
                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                  {notif.stats.deliveredCount.toLocaleString()} ({deliveryPct}%)
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground font-bold">Opened / Read:</span>
                                <span className="font-extrabold text-primary">
                                  {notif.stats.openedCount.toLocaleString()} ({readPct}%)
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPreviewData(notif);
                            setIsPreviewOpen(true);
                          }}
                          icon={<Eye className="h-3 w-3" />}
                          title="Preview Notification"
                        />

                        {notif.status !== 'SENT' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCardDirectSend(notif)}
                            icon={<Send className="h-3 w-3 text-emerald-500" />}
                            title="Send Immediately"
                          >
                            Send Now
                          </Button>
                        )}

                        {notif.status === 'SCHEDULED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelScheduledNotification(notif.id)}
                            icon={<XCircle className="h-3 w-3 text-amber-500" />}
                            title="Cancel Scheduled Delivery"
                          >
                            Cancel
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(notif)}
                          icon={<Edit2 className="h-3 w-3" />}
                          title="Edit Notification"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNotification(notif.id)}
                          icon={<Trash2 className="h-3 w-3 text-rose-500" />}
                          title="Delete Record"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'CIRCULARS' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <Input
                placeholder="Search PDF circulars by number (e.g. VTU/BGM/ACA/2026), or keyword..."
                value={circularSearch}
                onChange={(e) => setCircularSearch(e.target.value)}
                icon={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredCirculars.map((cir) => (
              <Card key={cir.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {cir.circularNo}
                      </span>
                      <Badge variant="success" className="text-[10px]">
                        {cir.status}
                      </Badge>
                    </div>

                    <h3 className="text-base font-extrabold text-foreground">{cir.title}</h3>

                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                      <span>Target Audience: <strong className="text-foreground">{cir.targetAudience}</strong></span>
                      <span>Published Date: <strong className="text-foreground">{cir.publishDate}</strong></span>
                      <span>PDF Size: <strong className="text-foreground">{cir.fileSize}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" icon={<Download className="h-3.5 w-3.5" />}>
                      Download PDF
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Send className="h-3.5 w-3.5" />}
                      onClick={() => {
                        setEditingNotif({
                          id: '',
                          title: `VTU Circular: ${cir.title}`,
                          body: `Official VTU Circular ${cir.circularNo} published on ${cir.publishDate}. Tap to download official notification document.`,
                          type: 'CIRCULAR',
                          audience: 'ALL_STUDENTS',
                          targetBranch: 'ALL',
                          targetSemester: 'ALL',
                          targetScheme: 'ALL',
                          targetCollege: 'ALL',
                          status: 'DRAFT',
                          attachmentUrl: 'https://vtu.ac.in/pdf/circular.pdf',
                          createdBy: 'VTU Admin',
                          createdAt: '',
                          stats: { recipientsCount: 1, deliveredCount: 0, openedCount: 0 },
                        });
                        setIsFormOpen(true);
                      }}
                    >
                      Push In-App Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      <NotificationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingNotif}
        onOpenPreview={handleOpenPreviewFromForm}
        onTriggerMassSend={handleTriggerMassSendFromForm}
      />

      {/* Mobile Preview Modal */}
      <NotificationPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={previewData}
      />

      {/* Mass Confirmation Modal */}
      <MassBroadcastConfirmationModal
        isOpen={isMassConfirmOpen}
        onClose={() => setIsMassConfirmOpen(false)}
        onConfirm={handleConfirmMassBroadcast}
        data={massConfirmData}
      />

      {/* Audit History Modal */}
      {showAuditLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-black text-foreground">Notification Audit & Delivery History</h2>
              </div>
              <button
                onClick={() => setShowAuditLogs(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No notification audit history recorded.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl border border-border bg-accent/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground">{log.notificationTitle}</span>
                      <Badge variant="primary" className="text-[10px]">{log.action}</Badge>
                    </div>
                    <p className="text-muted-foreground">{log.details}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                      <span>Triggered By: {log.triggeredBy} ({log.role})</span>
                      <span>Target Devices: {log.recipients.toLocaleString()}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="outline" onClick={() => setShowAuditLogs(false)}>Close Audit History</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
