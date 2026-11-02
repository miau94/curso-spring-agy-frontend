import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import type { UserDto } from '../../types/api';
import { RoleBadge } from '../ui/RoleBadge';

interface UserTableRowProps {
  user: UserDto;
  isSelf: boolean;
  onEdit: (user: UserDto) => void;
  onDelete: (user: UserDto) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelf,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
      <td className="py-3.5 px-5 font-mono text-xs text-slate-400">#{user.id}</td>

      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center uppercase">
            {user.email.slice(0, 2)}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">{user.email}</span>
            {isSelf && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                Tú (Sesión actual)
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <RoleBadge role={user.role} />
      </td>

      <td className="py-3.5 px-5 text-right">
        <div className="inline-flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="p-2 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
            title="Editar usuario y contraseña (PUT /api/users/{id})"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={isSelf}
            onClick={() => !isSelf && onDelete(user)}
            title={
              isSelf
                ? 'Protección activa: No puedes eliminar tu propia cuenta en sesión'
                : 'Eliminar usuario (DELETE /api/users/{id})'
            }
            className={`p-2 rounded-lg transition-colors ${
              isSelf
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
