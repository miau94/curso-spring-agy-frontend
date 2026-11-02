import { AlertCircle, CheckCircle2, Info, ShieldAlert, X } from 'lucide-react';
import React from 'react';
import { useToastStore } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const styles = {
          success:
            'border-emerald-500/30 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-emerald-500/10',
          error:
            'border-rose-500/40 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-rose-500/10',
          warning:
            'border-amber-500/40 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-amber-500/10',
          info: 'border-indigo-500/30 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-indigo-500/10',
        }[t.type];

        const IconComponent = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
          warning: <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />,
        }[t.type];

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 ${styles}`}
          >
            {IconComponent}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{t.title}</p>
              {t.description && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 break-words">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
