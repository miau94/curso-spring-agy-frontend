import { AlertCircle, CheckCircle2, Info, ShieldAlert, X } from 'lucide-react';
import React from 'react';
import { useToastStore } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const accentBar = {
          success: 'bg-emerald-500',
          error: 'bg-rose-500',
          warning: 'bg-amber-500',
          info: 'bg-indigo-600',
        }[t.type];

        const IconComponent = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
          warning: <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />,
        }[t.type];

        return (
          <div
            key={t.id}
            className="animate-toast-in pointer-events-auto relative overflow-hidden flex items-start gap-3 pl-4 pr-3 py-3.5 rounded-xl bg-white dark:bg-[#0F1623] border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xl shadow-slate-950/15"
          >
            <span className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
            {IconComponent}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-snug">{t.title}</p>
              {t.description ? (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 break-words leading-relaxed">
                  {t.description}
                </p>
              ) : null}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg cursor-pointer"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
