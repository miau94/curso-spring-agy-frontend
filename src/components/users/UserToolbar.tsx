import { Search, X } from 'lucide-react';
import React from 'react';
import type { Role } from '../../types/api';

interface UserToolbarProps {
  searchEmail: string;
  onSearchEmailChange: (email: string) => void;
  roleFilter: 'ALL' | Role;
  onRoleFilterChange: (role: 'ALL' | Role) => void;
}

const roleLabels: Record<'ALL' | Role, string> = {
  ALL: 'Todos los roles',
  ADMIN: 'Administradores',
  USER: 'Usuarios estándar',
};

export const UserToolbar: React.FC<UserToolbarProps> = ({
  searchEmail,
  onSearchEmailChange,
  roleFilter,
  onRoleFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0F1623] p-3.5 rounded-2xl border border-slate-200/85 dark:border-slate-800/90 shadow-xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchEmail}
          onChange={(e) => onSearchEmailChange(e.target.value)}
          placeholder="Filtrar cuentas por correo electrónico..."
          className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 transition-all"
        />
        {searchEmail ? (
          <button
            type="button"
            onClick={() => onSearchEmailChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Limpiar filtro de correo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-end sm:self-auto border border-slate-200/60 dark:border-slate-800">
        {(['ALL', 'ADMIN', 'USER'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onRoleFilterChange(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === r
                ? 'bg-white dark:bg-[#0F1623] text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {roleLabels[r]}
          </button>
        ))}
      </div>
    </div>
  );
};
