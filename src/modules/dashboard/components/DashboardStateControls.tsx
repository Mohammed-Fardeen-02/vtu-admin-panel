import React from 'react';
import { Sliders, RefreshCw, AlertCircle, Inbox, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';

export type DashboardViewState = 'NORMAL' | 'LOADING' | 'EMPTY' | 'ERROR' | 'PERMISSION_DENIED';

export interface DashboardStateControlsProps {
  currentMode: DashboardViewState;
  onModeChange: (mode: DashboardViewState) => void;
}

export const DashboardStateControls: React.FC<DashboardStateControlsProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="p-3 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <Sliders className="h-4 w-4 text-primary" />
        <span>Dashboard State Simulation Controls:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onModeChange('NORMAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            currentMode === 'NORMAL'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-accent/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Operational</span>
        </button>

        <button
          onClick={() => onModeChange('LOADING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            currentMode === 'LOADING'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-accent/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          <span>Loading</span>
        </button>

        <button
          onClick={() => onModeChange('EMPTY')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            currentMode === 'EMPTY'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-accent/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          <Inbox className="h-3.5 w-3.5" />
          <span>Empty</span>
        </button>

        <button
          onClick={() => onModeChange('ERROR')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            currentMode === 'ERROR'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-accent/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Error</span>
        </button>

        <button
          onClick={() => onModeChange('PERMISSION_DENIED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            currentMode === 'PERMISSION_DENIED'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-accent/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Denied</span>
        </button>
      </div>
    </div>
  );
};
