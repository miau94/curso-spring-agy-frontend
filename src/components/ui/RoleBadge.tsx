import { ShieldCheck, User as UserIcon } from 'lucide-react';
import React from 'react';
import type { Role } from '../../types/api';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'sm' }) => {
  const isAdmin = role === 'ADMIN';
  const sizeClasses =
    size === 'sm' ? 'px-2.5 py-0.5 text-[11px] gap-1' : 'px-3 py-1 text-xs gap-1.5';

  if (isAdmin) {
    return (
      <span
        className={`inline-flex items-center font-semibold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/30 ${sizeClasses}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Administrador</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 ${sizeClasses}`}
    >
      <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>Estándar</span>
    </span>
  );
};
