import { Eye, Mail, MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import React, { memo } from 'react';
import type { CustomerDto } from '../../types/api';

interface CustomerTableRowProps {
  customer: CustomerDto;
  isAdmin: boolean;
  onViewDetail: (id?: number) => void;
  onEdit: (customer: CustomerDto) => void;
  onDelete: (customer: CustomerDto) => void;
}

export const CustomerTableRow: React.FC<CustomerTableRowProps> = memo(
  ({ customer, isAdmin, onViewDetail, onEdit, onDelete }) => {
    return (
      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
        <td className="py-3.5 px-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
              {customer.firstName.charAt(0)}
              {customer.lastName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-xs text-slate-400">ID #{customer.id}</p>
            </div>
          </div>
        </td>

        <td className="py-3.5 px-4">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{customer.email}</span>
            </div>
            {customer.phone ? (
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{customer.phone}</span>
              </div>
            ) : null}
          </div>
        </td>

        <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500 dark:text-slate-400">
          {customer.address ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {customer.address}
            </span>
          ) : (
            <span className="text-slate-300 dark:text-slate-600">—</span>
          )}
        </td>

        <td className="py-3.5 px-5 text-right">
          <div className="inline-flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onViewDetail(customer.id)}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
              title="Ver ficha completa (GET /api/customers/{id})"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={!isAdmin}
              onClick={() => isAdmin && onEdit(customer)}
              title={
                isAdmin
                  ? 'Editar cliente (PUT /api/customers/{id})'
                  : 'Requiere permisos de Administrador'
              }
              className={`p-2 rounded-lg transition-colors ${
                isAdmin
                  ? 'text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={!isAdmin}
              onClick={() => isAdmin && onDelete(customer)}
              title={
                isAdmin
                  ? 'Eliminar cliente (DELETE /api/customers/{id})'
                  : 'Requiere permisos de Administrador'
              }
              className={`p-2 rounded-lg transition-colors ${
                isAdmin
                  ? 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);
