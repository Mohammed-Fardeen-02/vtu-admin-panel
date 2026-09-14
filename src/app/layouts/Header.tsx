import React from 'react';
import { Search, Sun, Moon, Bell, Sparkles, UserCheck, LogOut } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

export const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AD';

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Search Input Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search USN, Subject Code (e.g. 21CS53), College or Circular..."
            className="w-full rounded-xl border border-input bg-background/60 pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* University Ticker & Quick Controls */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-700 dark:text-blue-400">
          <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-amber-500" />
          <span>NEP 2020 & 2022 Scheme Active</span>
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-border"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Icon */}
        <button className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-border">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card animate-pulse" />
        </button>

        {/* Admin Avatar Snippet & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-extrabold text-foreground leading-none">
              {user?.name || 'Governance Admin'}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> {user?.email || 'admin@vtuapp.in'}
            </span>
          </div>

          <button
            onClick={logout}
            className="ml-2 rounded-xl p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors border border-border"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

