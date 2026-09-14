import React, { useState } from 'react';
import {
  Award,
  Coins,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  ShieldAlert,
  Search,
  Plus,
  Edit2,
  Users,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { Input } from '../../shared/components/ui/Input';
import { useRewardStore } from '../../store/useRewardStore';
import { ManualRewardAdjustmentModal } from './components/ManualRewardAdjustmentModal';

export const RewardRulesPage: React.FC = () => {
  const {
    rules,
    transactions,
    auditLogs,
    toggleRule,
    updateRulePayout,
    manualRewardAdjustment,
  } = useRewardStore();

  const [activeTab, setActiveTab] = useState<'RULES' | 'TRANSACTIONS' | 'SUSPICIOUS'>('RULES');
  const [txSearch, setTxSearch] = useState('');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editCoins, setEditCoins] = useState(0);
  const [editXp, setEditXp] = useState(0);

  // Manual Adjustment Modal state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ id: 'usr-101', name: 'Fardeen Khan', coins: 650, xp: 1420 });

  const filteredTx = transactions.filter(
    (t) =>
      t.userName.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.userUsn.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(txSearch.toLowerCase())
  );

  const suspiciousTx = transactions.filter((t) => t.isSuspicious);

  const handleStartEditRule = (r: any) => {
    setEditingRuleId(r.id);
    setEditCoins(r.coinsAwarded);
    setEditXp(r.xpAwarded);
  };

  const handleSaveRuleEdit = (id: string) => {
    updateRulePayout(id, editCoins, editXp);
    setEditingRuleId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Award className="h-7 w-7 text-primary" />
            VTU Reward System Administration (ADMIN-FR-12)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure Coins, XP, Badges, Milestone rewards, detect suspicious activity, and manage audited manual adjustments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSelectedUser({ id: 'usr-101', name: 'Fardeen Khan', coins: 650, xp: 1420 });
            setIsManualModalOpen(true);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Manual Reward Adjustment
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('RULES')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 ${
            activeTab === 'RULES'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Reward Configuration Rules ({rules.length})
        </button>

        <button
          onClick={() => setActiveTab('TRANSACTIONS')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 ${
            activeTab === 'TRANSACTIONS'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Reward Transactions History ({transactions.length})
        </button>

        <button
          onClick={() => setActiveTab('SUSPICIOUS')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'SUSPICIOUS'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
          Suspicious Activity Anomaly Flags ({suspiciousTx.length})
        </button>
      </div>

      {activeTab === 'RULES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="relative overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {rule.category}
                    </span>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        rule.isEnabled
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}
                    >
                      {rule.isEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground leading-snug">{rule.ruleName}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>

                  {editingRuleId === rule.id ? (
                    <div className="p-3 rounded-xl bg-accent/40 border border-border space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground">Coins</label>
                          <Input
                            type="number"
                            value={editCoins}
                            onChange={(e) => setEditCoins(parseInt(e.target.value, 10))}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted-foreground">XP</label>
                          <Input
                            type="number"
                            value={editXp}
                            onChange={(e) => setEditXp(parseInt(e.target.value, 10))}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <Button variant="outline" size="sm" onClick={() => setEditingRuleId(null)}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handleSaveRuleEdit(rule.id)}>
                          Save Payout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-amber-500 flex items-center gap-1">
                          <Coins className="h-3.5 w-3.5" /> {rule.coinsAwarded} Coins
                        </span>
                        <span className="font-extrabold text-primary flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5" /> {rule.xpAwarded} XP
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEditRule(rule)}
                        icon={<Edit2 className="h-3 w-3" />}
                        title="Edit Payout"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'TRANSACTIONS' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <Input
                placeholder="Search transactions by student name, USN, or keyword..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                icon={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-table-header-bg text-table-header-text border-b border-table-header-border">
                    <th className="p-3.5 font-extrabold">Student Name & USN</th>
                    <th className="p-3.5 font-extrabold">Transaction Type</th>
                    <th className="p-3.5 font-extrabold">Coins & XP</th>
                    <th className="p-3.5 font-extrabold">Description</th>
                    <th className="p-3.5 font-extrabold">Timestamp</th>
                    <th className="p-3.5 font-extrabold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTx.map((t) => (
                    <tr key={t.id} className="hover:bg-accent/40">
                      <td className="p-3.5 font-extrabold text-foreground">
                        {t.userName} ({t.userUsn})
                      </td>
                      <td className="p-3.5">
                        <Badge variant={t.type === 'EARNED' ? 'success' : 'warning'} className="text-[10px]">
                          {t.type}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-extrabold text-amber-500">
                        +{t.coins} Coins / +{t.xp} XP
                      </td>
                      <td className="p-3.5 text-muted-foreground">{t.description}</td>
                      <td className="p-3.5 text-muted-foreground">{t.timestamp}</td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser({ id: t.userId, name: t.userName, coins: 650, xp: 1420 });
                            setIsManualModalOpen(true);
                          }}
                        >
                          Adjust User
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'SUSPICIOUS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-rose-500 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-rose-600 dark:text-rose-400 block">Reward Farming Anomaly Detection Active</span>
              <p className="text-muted-foreground">
                Automated monitoring flags rapid submissions, bot activity, and duplicate reward requests for admin audit.
              </p>
            </div>
          </div>

          {suspiciousTx.map((t) => (
            <Card key={t.id} className="border-rose-500/40">
              <CardContent className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1 text-xs flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="error" className="text-[10px]">
                      FLAGGED ANOMALY
                    </Badge>
                    <span className="font-extrabold text-foreground">{t.userName} ({t.userUsn})</span>
                  </div>
                  <p className="font-extrabold text-rose-600 dark:text-rose-400">{t.flagReason}</p>
                  <p className="text-muted-foreground">{t.description} • {t.timestamp}</p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={() => {
                    setSelectedUser({ id: t.userId, name: t.userName, coins: 450, xp: 900 });
                    setIsManualModalOpen(true);
                  }}
                >
                  Inspect & Adjust
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Manual Reward Adjustment Modal */}
      <ManualRewardAdjustmentModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        userId={selectedUser.id}
        userName={selectedUser.name}
        currentCoins={selectedUser.coins}
        currentXp={selectedUser.xp}
      />
    </div>
  );
};
