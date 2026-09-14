import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Tag,
  Layers,
  Database,
  Filter,
  RotateCcw,
  Edit2,
  FileText,
  HelpCircle,
  BookOpen,
  Video,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { Input } from '../../shared/components/ui/Input';
import { useSearchAdminStore } from '../../store/useSearchAdminStore';
import { SearchIndexProjection, SearchEntityType, IndexingStatus } from '../../shared/types/searchAdmin.types';

export const SmartSearchAdminPage: React.FC = () => {
  const {
    projections,
    failedJobs,
    searchQuery,
    filterEntityType,
    filterStatus,
    setSearchQuery,
    setFilterEntityType,
    setFilterStatus,
    reindexItem,
    reindexAll,
    removeFromSearch,
    restoreToSearch,
    updateMetadataAliases,
    retryFailedJob,
  } = useSearchAdminStore();

  const [activeTab, setActiveTab] = useState<'PROJECTIONS' | 'FAILED_JOBS'>('PROJECTIONS');

  // Metadata Edit Modal State
  const [editingProjection, setEditingProjection] = useState<SearchIndexProjection | null>(null);
  const [editKeywords, setEditKeywords] = useState('');
  const [editAliases, setEditAliases] = useState('');

  const filteredProjections = projections.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.subjectCode.toLowerCase().includes(q) ||
      p.subjectName.toLowerCase().includes(q) ||
      p.keywords.some((k) => k.toLowerCase().includes(q)) ||
      p.aliases.some((a) => a.toLowerCase().includes(q));

    const matchesType = filterEntityType === 'ALL' || p.entityType === filterEntityType;
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenEditMetadata = (p: SearchIndexProjection) => {
    setEditingProjection(p);
    setEditKeywords(p.keywords.join(', '));
    setEditAliases(p.aliases.join(', '));
  };

  const handleSaveMetadata = () => {
    if (!editingProjection) return;
    const kw = editKeywords.split(',').map((s) => s.trim()).filter(Boolean);
    const al = editAliases.split(',').map((s) => s.trim()).filter(Boolean);
    updateMetadataAliases(editingProjection.id, kw, al);
    setEditingProjection(null);
  };

  const getEntityIcon = (type: SearchEntityType) => {
    switch (type) {
      case 'NOTES':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'PYQ':
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
      case 'PASSING_PACKAGE':
        return <BookOpen className="h-4 w-4 text-amber-500" />;
      case 'VIDEO':
        return <Video className="h-4 w-4 text-rose-500" />;
      default:
        return <Layers className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Search className="h-7 w-7 text-primary" />
            VTU Smart Search Administration (ADMIN-FR-14)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage search index projections, subject code mapping (e.g. 21MAT31 ↔ Engineering Mathematics), synonyms, and index sync jobs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => reindexAll()} icon={<RefreshCw className="h-3.5 w-3.5" />}>
            Reindex All Entities
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('PROJECTIONS')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 ${
            activeTab === 'PROJECTIONS'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Canonical Search Projections ({projections.length})
        </button>

        <button
          onClick={() => setActiveTab('FAILED_JOBS')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'FAILED_JOBS'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          Failed Indexing Jobs ({failedJobs.length})
        </button>
      </div>

      {activeTab === 'PROJECTIONS' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search by Subject Code (e.g. 21MAT31), Subject Name, or Synonym Alias..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>

                <div>
                  <select
                    value={filterEntityType}
                    onChange={(e) => setFilterEntityType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ALL">All Resource Types</option>
                    <option value="NOTES">Notes Library</option>
                    <option value="PYQ">Question Papers (PYQ)</option>
                    <option value="PASSING_PACKAGE">Passing Packages</option>
                    <option value="VIDEO">Video Courses</option>
                    <option value="FORMULA_SHEET">Formula Sheets</option>
                    <option value="COMMUNITY_RESOURCE">Community Resources</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ALL">All Index States</option>
                    <option value="INDEXED">Indexed & Live</option>
                    <option value="OUT_OF_SYNC">Out of Sync</option>
                    <option value="REMOVED_FROM_SEARCH">Removed from Search</option>
                    <option value="INDEXING_FAILED">Indexing Failed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table of Index Projections */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-table-header-bg text-table-header-text border-b border-table-header-border">
                    <th className="p-3.5 font-extrabold">Type</th>
                    <th className="p-3.5 font-extrabold">Subject Code & Canonical Title</th>
                    <th className="p-3.5 font-extrabold">Search Keywords & Aliases</th>
                    <th className="p-3.5 font-extrabold text-center">Status</th>
                    <th className="p-3.5 font-extrabold">Last Indexed</th>
                    <th className="p-3.5 font-extrabold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProjections.map((p) => (
                    <tr key={p.id} className="hover:bg-accent/40">
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          {getEntityIcon(p.entityType)}
                          <span className="font-extrabold text-foreground">{p.entityType}</span>
                        </div>
                      </td>
                      <td className="p-3.5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                            {p.subjectCode}
                          </span>
                          <span className="font-bold text-foreground text-xs">{p.subjectName}</span>
                        </div>
                        <p className="font-extrabold text-foreground">{p.title}</p>
                      </td>
                      <td className="p-3.5 space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {p.aliases.map((a) => (
                            <span key={a} className="text-[10px] font-bold bg-accent text-foreground px-1.5 py-0.5 rounded border border-border">
                              {a}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={
                            p.status === 'INDEXED'
                              ? 'success'
                              : p.status === 'OUT_OF_SYNC'
                              ? 'warning'
                              : p.status === 'INDEXING_FAILED'
                              ? 'error'
                              : 'neutral'
                          }
                          className="text-[10px]"
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-muted-foreground">{p.lastIndexedAt}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => reindexItem(p.id)}
                            icon={<RefreshCw className="h-3 w-3" />}
                            title="Reindex Entity"
                          />

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditMetadata(p)}
                            icon={<Edit2 className="h-3 w-3" />}
                            title="Edit Keywords & Aliases"
                          />

                          {p.status === 'REMOVED_FROM_SEARCH' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreToSearch(p.id)}
                              icon={<RotateCcw className="h-3 w-3 text-emerald-500" />}
                              title="Restore to Search"
                            />
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromSearch(p.id)}
                              icon={<Trash2 className="h-3 w-3 text-rose-500" />}
                              title="Remove from Search Index"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'FAILED_JOBS' && (
        <div className="space-y-4">
          {failedJobs.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">Zero Indexing Errors</p>
              <p className="text-xs text-muted-foreground mt-1">All search projections are synced cleanly.</p>
            </Card>
          ) : (
            failedJobs.map((job) => (
              <Card key={job.id} className="border-rose-500/40">
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1 text-xs flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="error" className="text-[10px]">
                        INDEXING ERROR
                      </Badge>
                      <span className="font-extrabold text-foreground">{job.entityTitle}</span>
                    </div>
                    <p className="text-rose-600 dark:text-rose-400 font-bold">{job.errorMessage}</p>
                    <p className="text-muted-foreground">{job.timestamp} • Retry count: {job.retryCount}</p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => retryFailedJob(job.id)}
                    icon={<RotateCcw className="h-3.5 w-3.5" />}
                  >
                    Retry Job Reindex
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit Metadata & Aliases Modal */}
      {editingProjection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-foreground">Edit Search Metadata & Synonyms</h3>
              <button onClick={() => setEditingProjection(null)} className="p-1 text-muted-foreground">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Subject Code & Title</label>
                <Input value={`${editingProjection.subjectCode} - ${editingProjection.subjectName}`} disabled />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Comma-Separated Keywords</label>
                <Input
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  placeholder="e.g. Maths 3, Fourier Series, Laplace"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Search Synonyms & Aliases</label>
                <Input
                  value={editAliases}
                  onChange={(e) => setEditAliases(e.target.value)}
                  placeholder="e.g. Engineering Mathematics III, M3 VTU"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setEditingProjection(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveMetadata}>
                Save Metadata
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
