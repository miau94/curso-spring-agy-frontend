import { ShieldCheck, User as UserIcon } from 'lucide-react';
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
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Cuentas de prueba precargadas
        </span>
        <code className="text-[11px] font-mono text-slate-400">import.sql</code>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemoUser('admin@example.com')}
          className="group flex flex-col items-start p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10 text-left transition-all cursor-pointer disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Entrar como Administrador
          </span>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate w-full mt-1">
            admin@example.com
          </span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectDemoUser('user@example.com')}
          className="group flex flex-col items-start p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-emerald-50/40 dark:hover:bg-emerald-500/10 text-left transition-all cursor-pointer disabled:opacity-50"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Entrar como Usuario
          </span>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate w-full mt-1">
            user@example.com
          </span>
        </button>
      </div>
    </div>
  );
};
