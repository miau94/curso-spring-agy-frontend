import { Eye, Mail, MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import React, { memo } from 'react';
import type { CustomerDto } from '../../types/api';

interface CustomerCardProps {
  customer: CustomerDto;
  isAdmin: boolean;
  onViewDetail: (id?: number) => void;
  onEdit: (customer: CustomerDto) => void;
  onDelete: (customer: CustomerDto) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = memo(
  ({ customer, isAdmin, onViewDetail, onEdit, onDelete }) => {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center">
                {customer.firstName.charAt(0)}
                {customer.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {customer.firstName} {customer.lastName}
                </h3>
                <span className="text-[11px] font-medium text-slate-400">
                  Cliente #{customer.id}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{customer.phone || 'Sin teléfono'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{customer.address || 'Sin dirección'}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onViewDetail(customer.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver detalle</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!isAdmin}
              onClick={() => isAdmin && onEdit(customer)}
              title={isAdmin ? 'Editar cliente' : 'Requiere permisos de Administrador'}
              className={`p-1.5 rounded-lg ${
                isAdmin
                  ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-500/10 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!isAdmin}
              onClick={() => isAdmin && onDelete(customer)}
              title={isAdmin ? 'Eliminar cliente' : 'Requiere permisos de Administrador'}
              className={`p-1.5 rounded-lg ${
                isAdmin
                  ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
