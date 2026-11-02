import { ShieldCheck, Sparkles, User as UserIcon } from 'lucide-react';
import React from 'react';

interface DemoAccessButtonsProps {
  disabled: boolean;
  onSelectDemoUser: (email: string) => void;
}

export const DemoAccessButtons: React.FC<DemoAccessButtonsProps> = ({
  disabled,
  onSelectDemoUser,
}) => {
  return (
    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Acceso Rápido Demo (import.sql)</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemoUser('admin@example.com')}
          className="flex flex-col items-start p-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/10 text-left transition-colors cursor-pointer disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Demo ADMIN
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate w-full mt-0.5">
            admin@example.com
          </span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemoUser('user@example.com')}
          className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-colors cursor-pointer disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <UserIcon className="w-3.5 h-3.5" />
            Demo USER
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate w-full mt-0.5">
            user@example.com
          </span>
        </button>
      </div>
    </div>
  );
};
