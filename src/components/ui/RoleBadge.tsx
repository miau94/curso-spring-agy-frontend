import { ShieldCheck, User as UserIcon } from 'lucide-react';
import React from 'react';
import type { Role } from '../../types/api';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'sm' }) => {
  const isAdmin = role === 'ADMIN';
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs gap-1' : 'px-3 py-1 text-xs gap-1.5';

  if (isAdmin) {
    return (
      <span
        className={`inline-flex items-center font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-500/20 ${sizeClasses}`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        ADMIN
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/20 ${sizeClasses}`}
    >
      <UserIcon className="w-3.5 h-3.5" />
      USER
    </span>
  );
};
