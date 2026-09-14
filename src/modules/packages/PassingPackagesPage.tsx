import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Send,
  Archive,
  Download,
  Bookmark,
  ShieldCheck,
  History,
  IndianRupee,
  Lock,
  Layers,
  FileText,
  AlertCircle,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Badge } from '../../shared/components/ui/Badge';
import { usePackageStore } from '../../store/usePackageStore';
import { PassingPackage } from '../../shared/types/package.types';
import { PassingPackageFormModal } from './PassingPackageFormModal';
import { PackagePreviewModal } from './PackagePreviewModal';

export const PassingPackagesPage: React.FC = () => {
  const {
    packages,
    auditLogs,
    searchQuery,
    filterBranch,
    filterScheme,
    filterSemester,
    filterStatus,
    filterPremium,
    setSearchQuery,
    setFilterBranch,
    setFilterScheme,
    setFilterSemester,
    setFilterStatus,
    setFilterPremium,
    publishPackage,
    unpublishPackage,
    archivePackage,
    deletePackage,
  } = usePackageStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PassingPackage | null>(null);
  const [previewPackage, setPreviewPackage] = useState<PassingPackage | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = filterBranch === 'ALL' || pkg.branchCode === filterBranch;
    const matchesScheme = filterScheme === 'ALL' || pkg.schemeYear === filterScheme;
    const matchesSem = filterSemester === 'ALL' || String(pkg.semester) === filterSemester;
    const matchesStatus = filterStatus === 'ALL' || pkg.status === filterStatus;
    const matchesPremium =
      filterPremium === 'ALL' ||
      (filterPremium === 'PREMIUM' && pkg.isPremium) ||
      (filterPremium === 'FREE' && !pkg.isPremium);

    return matchesSearch && matchesBranch && matchesScheme && matchesSem && matchesStatus && matchesPremium;
  });

  const handleEdit = (pkg: PassingPackage) => {
    setEditingPackage(pkg);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPackage(null);
    setIsFormOpen(true);
  };

  const handleOpenPreview = (pkg: PassingPackage) => {
    setPreviewPackage(pkg);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            VTU Passing Packages Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create high-yield revision units, repeated exam questions, 1-night-before cheat sheets, and premium access rules for VTU subjects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAuditLogs(true)}
            icon={<History className="h-3.5 w-3.5" />}
          >
            Audit Logs ({auditLogs.length})
          </Button>

          <Button variant="primary" size="sm" onClick={handleCreateNew} icon={<Plus className="h-4 w-4" />}>
            Create Passing Package
          </Button>
        </div>
      </div>

      {/* Filter and Search Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="Search packages by subject code (e.g. 21MAT31), name, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <select
                value={filterPremium}
                onChange={(e) => setFilterPremium(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Access Tiers</option>
                <option value="FREE">Free Packages</option>
                <option value="PREMIUM">Premium Pass Required</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/50 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-muted-foreground flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Target Filters:
              </span>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-semibold focus:outline-none"
              >
                <option value="ALL">Branch: All</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ISE">ISE</option>
                <option value="ME">ME</option>
                <option value="EEE">EEE</option>
              </select>

              <select
                value={filterScheme}
                onChange={(e) => setFilterScheme(e.target.value)}
                className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-semibold focus:outline-none"
              >
                <option value="ALL">Scheme: All</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2025">2025</option>
              </select>

              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-semibold focus:outline-none"
              >
                <option value="ALL">Semester: All</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={String(s)}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredPackages.length}</strong> passing packages
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPackages.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm font-bold text-foreground">No passing packages found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Adjust search filters or create a new passing package.
            </p>
          </Card>
        ) : (
          filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {pkg.subjectCode}
                    </span>

                    <Badge
                      variant={
                        pkg.status === 'PUBLISHED'
                          ? 'success'
                          : pkg.status === 'DRAFT'
                          ? 'warning'
                          : 'neutral'
                      }
                      className="text-[10px]"
                    >
                      {pkg.status}
                    </Badge>

                    {pkg.isPremium ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Lock className="h-3 w-3" /> Premium Pass (₹{pkg.priceINR})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Free Access
                      </span>
                    )}

                    <span className="text-[11px] font-bold text-muted-foreground bg-accent px-2 py-0.5 rounded border border-border">
                      {pkg.questionsCount} Questions • {pkg.unitsCount} Units
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground">{pkg.title}</h3>
                  <p className="text-xs text-muted-foreground">{pkg.subjectName}</p>

                  <div className="p-3 rounded-xl bg-accent/30 border border-border/60 text-xs space-y-1">
                    <span className="font-extrabold text-foreground block">Last-Minute Revision Summary</span>
                    <p className="text-muted-foreground line-clamp-2">{pkg.lastMinuteRevisionSummary}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>Target Branch: <strong className="text-foreground">{pkg.branchCode}</strong></span>
                    <span>Target Scheme: <strong className="text-foreground">Scheme {pkg.schemeYear}</strong></span>
                    <span>Semester: <strong className="text-foreground">Sem {pkg.semester}</strong></span>
                    <span>Author: <strong className="text-foreground">{pkg.author}</strong></span>
                  </div>
                </div>

                {/* Right Side Stats & Actions */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="p-3 rounded-xl bg-accent/40 border border-border text-right min-w-[170px] space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-bold flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Views:
                      </span>
                      <span className="font-extrabold text-foreground">{pkg.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-bold flex items-center gap-1">
                        <Download className="h-3 w-3" /> Downloads:
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {pkg.downloads.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-bold flex items-center gap-1">
                        <Bookmark className="h-3 w-3" /> Bookmarks:
                      </span>
                      <span className="font-extrabold text-primary">{pkg.bookmarks.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPreview(pkg)}
                      icon={<Eye className="h-3 w-3" />}
                      title="Mobile App Preview"
                    />

                    {pkg.status === 'DRAFT' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => publishPackage(pkg.id)}
                        icon={<Send className="h-3 w-3 text-emerald-500" />}
                        title="Publish Package"
                      >
                        Publish
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unpublishPackage(pkg.id)}
                        icon={<Archive className="h-3 w-3 text-amber-500" />}
                        title="Unpublish to Draft"
                      >
                        Unpublish
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                      icon={<Edit2 className="h-3 w-3" />}
                      title="Edit Package"
                    />

                    {pkg.status !== 'ARCHIVED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => archivePackage(pkg.id)}
                        icon={<Archive className="h-3 w-3" />}
                        title="Archive Package"
                      />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDeleteId(pkg.id)}
                      icon={<Trash2 className="h-3 w-3 text-rose-500" />}
                      title="Delete Package"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Package Form Modal */}
      <PassingPackageFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingPackage}
      />

      {/* Package Mobile Preview Modal */}
      <PackagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        packageData={previewPackage}
      />

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-black text-foreground">Delete Passing Package</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to permanently delete this passing package? This will remove all questions, 1-night revision notes, and statistics.
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
                  deletePackage(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                Delete Package
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Modal */}
      {showAuditLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-black text-foreground">Passing Package Audit History</h2>
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
                <p className="text-xs text-muted-foreground text-center py-4">No audit logs recorded yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl border border-border bg-accent/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground">{log.packageTitle}</span>
                      <Badge variant="primary" className="text-[10px]">{log.action}</Badge>
                    </div>
                    <p className="text-muted-foreground">{log.details}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                      <span>Admin: {log.admin}</span>
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
