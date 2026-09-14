import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export type InfoCardVariant =
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'purple'
  | 'rose'
  | 'cyan'
  | 'indigo'
  | 'slate';

export interface InfoCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  variant?: InfoCardVariant;
  linkTo?: string;
  className?: string;
  loading?: boolean;
  badge?: string;
}

const COLOR_MAP: Record<
  InfoCardVariant,
  { borderTop: string; iconBg: string; iconColor: string; bgGradient: string }
> = {
  blue: {
    borderTop: 'border-t-primary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    bgGradient: 'bg-card hover:bg-primary/[0.02]',
  },
  emerald: {
    borderTop: 'border-t-emerald-500',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgGradient: 'bg-card hover:bg-emerald-500/[0.02]',
  },
  amber: {
    borderTop: 'border-t-amber-500',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
    bgGradient: 'bg-card hover:bg-amber-500/[0.02]',
  },
  purple: {
    borderTop: 'border-t-purple-500',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgGradient: 'bg-card hover:bg-purple-500/[0.02]',
  },
  rose: {
    borderTop: 'border-t-rose-500',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600 dark:text-rose-400',
    bgGradient: 'bg-card hover:bg-rose-500/[0.02]',
  },
  cyan: {
    borderTop: 'border-t-cyan-500',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    bgGradient: 'bg-card hover:bg-cyan-500/[0.02]',
  },
  indigo: {
    borderTop: 'border-t-indigo-600',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    bgGradient: 'bg-card hover:bg-indigo-500/[0.02]',
  },
  slate: {
    borderTop: 'border-t-slate-400',
    iconBg: 'bg-slate-500/10',
    iconColor: 'text-slate-600 dark:text-slate-400',
    bgGradient: 'bg-card hover:bg-slate-500/[0.02]',
  },
};

export const InfoCard: React.FC<InfoCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendDirection = 'up',
  subtitle,
  variant = 'blue',
  linkTo,
  className = '',
  loading = false,
  badge,
}) => {
  const navigate = useNavigate();
  const c = COLOR_MAP[variant] || COLOR_MAP.blue;

  const handleClick = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-xl border border-border border-t-4 ${c.borderTop} ${c.bgGradient} p-4 transition-all duration-200 shadow-sm ${
        linkTo ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted-foreground truncate uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
          {icon && (
            <div className={`p-2 rounded-lg ${c.iconBg} ${c.iconColor} flex-shrink-0`}>
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="mt-2 flex items-baseline justify-between gap-2">
        {loading ? (
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        ) : (
          <span className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {value}
          </span>
        )}

        {linkTo && !loading && (
          <span className="text-muted-foreground group-hover:text-primary transition-colors">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>

      {/* Subtitle / Trend */}
      <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
        {loading ? (
          <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        ) : (
          <>
            <span className="truncate">{subtitle || 'Updated real-time'}</span>
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  trendDirection === 'up'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : trendDirection === 'down'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'bg-slate-500/10 text-slate-600'
                }`}
              >
                {trendDirection === 'up' ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : trendDirection === 'down' ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {trend}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
