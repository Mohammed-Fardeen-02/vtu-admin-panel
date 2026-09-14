import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Standalone toast listener system to allow toast.success() calls from outside React tree (e.g. axios interceptors)
type ToastListener = (item: Omit<ToastItem, 'id'>) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  success: (message: string, title?: string, duration = 4000) => {
    listeners.forEach((fn) => fn({ type: 'success', message, title, duration }));
  },
  error: (message: string, title?: string, duration = 5000) => {
    listeners.forEach((fn) => fn({ type: 'error', message, title, duration }));
  },
  info: (message: string, title?: string, duration = 4000) => {
    listeners.forEach((fn) => fn({ type: 'info', message, title, duration }));
  },
  warning: (message: string, title?: string, duration = 4500) => {
    listeners.forEach((fn) => fn({ type: 'warning', message, title, duration }));
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 active toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  useEffect(() => {
    const handleEmit = (item: Omit<ToastItem, 'id'>) => {
      addToast(item.message, item.type, item.title, item.duration);
    };

    listeners.add(handleEmit);
    return () => {
      listeners.delete(handleEmit);
    };
  }, [addToast]);

  const success = useCallback(
    (message: string, title?: string, duration?: number) => addToast(message, 'success', title, duration),
    [addToast]
  );
  const error = useCallback(
    (message: string, title?: string, duration?: number) => addToast(message, 'error', title, duration),
    [addToast]
  );
  const info = useCallback(
    (message: string, title?: string, duration?: number) => addToast(message, 'info', title, duration),
    [addToast]
  );
  const warning = useCallback(
    (message: string, title?: string, duration?: number) => addToast(message, 'warning', title, duration),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning,
      }}
    >
      {children}
      {/* Global Toast Overlay */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-x-0 animate-in fade-in slide-in-from-top-4 ${
              t.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10'
                : t.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/40 text-rose-300 shadow-rose-500/10'
                : t.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/40 text-amber-300 shadow-amber-500/10'
                : 'bg-slate-900/95 border-sky-500/40 text-sky-300 shadow-sky-500/10'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
            </div>

            <div className="flex-1 min-w-0">
              {t.title && <h5 className="font-semibold text-sm leading-tight text-white mb-0.5">{t.title}</h5>}
              <p className="text-xs text-slate-200 leading-relaxed break-words">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
