import React from 'react';
import type { CustomerDto } from '../../types/api';
import { CustomerTableRow } from './CustomerTableRow';

interface CustomerTableProps {
  customers: CustomerDto[];
  isAdmin: boolean;
  onViewDetail: (id?: number) => void;
  onEdit: (customer: CustomerDto) => void;
  onDelete: (customer: CustomerDto) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isAdmin,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-5">Cliente</th>
              <th className="py-3.5 px-4">Contacto</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Dirección</th>
              <th className="py-3.5 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {customers.map((customer) => (
              <CustomerTableRow
                key={customer.id}
                customer={customer}
                isAdmin={isAdmin}
                onViewDetail={onViewDetail}
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
