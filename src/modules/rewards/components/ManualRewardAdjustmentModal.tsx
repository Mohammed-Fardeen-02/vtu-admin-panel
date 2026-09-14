import React, { useState } from 'react';
import { X, Award, ShieldAlert, CheckCircle, IndianRupee, Layers } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { useRewardStore } from '../../../store/useRewardStore';

interface ManualRewardAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  currentCoins: number;
  currentXp: number;
}

export const ManualRewardAdjustmentModal: React.FC<ManualRewardAdjustmentModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  currentCoins,
  currentXp,
}) => {
  const { manualRewardAdjustment } = useRewardStore();

  const [coinsDelta, setCoinsDelta] = useState<number>(0);
  const [xpDelta, setXpDelta] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [adminIdentity, setAdminIdentity] = useState('Dr. K. V. Suresh (SuperAdmin)');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coinsDelta === 0 && xpDelta === 0) {
      setError('Coins or XP adjustment amount must be non-zero');
      return;
    }
    if (!reason.trim()) {
      setError('A mandatory reason is required for administrative audit logs');
      return;
    }
    if (!adminIdentity.trim()) {
      setError('Admin identity credentials required');
      return;
    }

    manualRewardAdjustment(userId, coinsDelta, xpDelta, reason, adminIdentity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Manual Reward Adjustment</h3>
              <p className="text-xs text-muted-foreground">Adjust coins/XP with mandatory audit logging.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-accent/40 border border-border space-y-1 text-xs">
            <span className="font-extrabold text-foreground">{userName}</span>
            <div className="flex items-center justify-between text-muted-foreground font-semibold">
              <span>Current Balance: {currentCoins} Coins</span>
              <span>Total XP: {currentXp} XP</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Coins Delta (+ / -) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                value={coinsDelta}
                onChange={(e) => setCoinsDelta(parseInt(e.target.value, 10) || 0)}
                placeholder="+50 or -20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                XP Delta (+ / -) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                value={xpDelta}
                onChange={(e) => setXpDelta(parseInt(e.target.value, 10) || 0)}
                placeholder="+100 or -50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Admin Identity Signature <span className="text-rose-500">*</span>
            </label>
            <Input
              value={adminIdentity}
              onChange={(e) => setAdminIdentity(e.target.value)}
              placeholder="e.g. Dr. K. V. Suresh (SuperAdmin)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Adjustment Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detailed justification for manual coin/XP grant or deduction..."
              className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && <p className="text-[11px] font-bold text-rose-500">{error}</p>}

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Log & Save Adjustment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
