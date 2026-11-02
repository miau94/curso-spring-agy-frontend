import { Search } from 'lucide-react';
import React from 'react';
import type { Role } from '../../types/api';

interface UserToolbarProps {
  searchEmail: string;
  onSearchEmailChange: (email: string) => void;
  roleFilter: 'ALL' | Role;
  onRoleFilterChange: (role: 'ALL' | Role) => void;
}

export const UserToolbar: React.FC<UserToolbarProps> = ({
  searchEmail,
  onSearchEmailChange,
  roleFilter,
  onRoleFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchEmail}
          onChange={(e) => onSearchEmailChange(e.target.value)}
          placeholder="Buscar usuario por correo electrónico..."
          className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto">
        {(['ALL', 'ADMIN', 'USER'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onRoleFilterChange(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === r
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {r === 'ALL' ? 'Todos' : r}
          </button>
        ))}
      </div>
    </div>
  );
};
