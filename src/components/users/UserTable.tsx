import React from 'react';
import type { UserDto } from '../../types/api';
import { UserTableRow } from './UserTableRow';

interface UserTableProps {
  users: UserDto[];
  currentUserId?: number;
  onEdit: (user: UserDto) => void;
  onDelete: (user: UserDto) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-5">ID</th>
              <th className="py-3.5 px-4">Correo Electrónico</th>
              <th className="py-3.5 px-4">Rol Asignado</th>
              <th className="py-3.5 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {users.map((u) => (
              <UserTableRow
                key={u.id}
                user={u}
                isSelf={currentUserId === u.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
