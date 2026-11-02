import { ShieldCheck, User as UserIcon } from 'lucide-react';
import React from 'react';
import type { Role } from '../../types/api';

interface RoleSelectorCardsProps {
  selectedRole: Role;
  onSelectRole: (role: Role) => void;
}

export const RoleSelectorCards: React.FC<RoleSelectorCardsProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Rol del Usuario (Role) *
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectRole('USER')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedRole === 'USER'
              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs text-emerald-600 dark:text-emerald-400">
            <UserIcon className="w-4 h-4" />
            <span>ROL USER</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Lectura de clientes (<code className="text-[10px]">GET /api/customers</code>).
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('ADMIN')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedRole === 'ADMIN'
              ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
            <span>ROL ADMIN</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Control total de clientes y usuarios.
          </p>
        </button>
      </div>
    </div>
  );
};
