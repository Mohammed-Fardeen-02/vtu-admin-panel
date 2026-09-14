import React, { useState } from 'react';
import {
  Users,
  Award,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle2,
  ThumbsUp,
  Download,
  ShieldCheck,
  History,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { Input } from '../../shared/components/ui/Input';
import { useRewardStore } from '../../store/useRewardStore';
import { ContributorProfile } from '../../shared/types/reward.types';
import { ContributorDetailModal } from './components/ContributorDetailModal';

export const ContributorDirectoryPage: React.FC = () => {
  const { contributors, auditLogs } = useRewardStore();
  const [search, setSearch] = useState('');
  const [selectedContributor, setSelectedContributor] = useState<ContributorProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const filteredContributors = contributors.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.usn.toLowerCase().includes(search.toLowerCase()) ||
      c.branch.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDetail = (c: ContributorProfile) => {
    setSelectedContributor(c);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            VTU Contributor Management (ADMIN-FR-13)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Govern student contributors, inspect upload statistics, adjust reputation scores, and manage contribution privilege suspensions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLogsModal(true)}
          icon={<History className="h-3.5 w-3.5" />}
        >
          Governance Audit History ({auditLogs.length})
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search contributor by student name, USN (e.g. 1VA21CS042), or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      {/* Grid of Contributors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContributors.map((c) => (
          <Card key={c.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-foreground">{c.name}</h3>
                  <span className="text-xs font-bold text-muted-foreground">{c.usn} • {c.branch} Sem {c.semester}</span>
                </div>
                {c.isContributionSuspended ? (
                  <Badge variant="error" className="text-[10px]">
                    SUSPENDED
                  </Badge>
                ) : (
                  <Badge variant="success" className="text-[10px]">
                    ACTIVE
                  </Badge>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground font-semibold">{c.college}</p>

              <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-accent/40 border border-border text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">Uploads</span>
                  <span className="font-extrabold text-foreground">{c.publishedCount} / {c.uploadCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">Downloads</span>
                  <span className="font-extrabold text-primary">{c.downloadsCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">Reputation</span>
                  <span className="font-extrabold text-amber-500">{c.reputationScore} Pts</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[11px] font-bold text-muted-foreground">Joined: {c.joinedDate}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDetail(c)}
                  icon={<Eye className="h-3.5 w-3.5" />}
                >
                  Manage Contributor
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contributor Detail Modal */}
      <ContributorDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        contributor={selectedContributor}
      />

      {/* Audit History Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-black text-foreground">Contributor Governance Audit Logs</h2>
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
                <p className="text-xs text-muted-foreground text-center py-4">No contributor audit logs recorded yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl border border-border bg-accent/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground">{log.contributorName}</span>
                      <Badge variant="primary" className="text-[10px]">{log.action}</Badge>
                    </div>
                    <p className="text-muted-foreground">{log.details}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                      <span>Admin Identity: {log.adminIdentity}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="outline" onClick={() => setShowLogsModal(false)}>Close Audit History</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
