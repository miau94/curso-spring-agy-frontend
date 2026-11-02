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
    <div className="rounded-2xl bg-white dark:bg-[#0F1623] border border-slate-200/85 dark:border-slate-800/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-5">Identificador</th>
              <th className="py-3.5 px-4">Correo electrónico</th>
              <th className="py-3.5 px-4">Nivel de acceso</th>
              <th className="py-3.5 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
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
