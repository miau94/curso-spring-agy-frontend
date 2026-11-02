import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import type { CustomerDto } from '../../types/api';

interface RecentCustomersListProps {
  customers: CustomerDto[];
  loading: boolean;
}

export const RecentCustomersList: React.FC<RecentCustomersListProps> = ({
  customers,
  loading,
}) => {
  const recent = customers.slice(0, 5);

  return (
    <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Clientes Recientes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Últimos registros obtenidos de <code className="text-[11px]">/api/customers</code>
          </p>
        </div>
        <Link
          to="/customers"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          <span>Ver todos ({customers.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Cargando clientes...</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No hay clientes registrados actualmente.
          </div>
        ) : (
          recent.map((c) => (
            <div
              key={c.id}
              className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {c.firstName.charAt(0)}
                  {c.lastName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {c.firstName} {c.lastName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3" />
                      {c.email}
                    </span>
                    {c.phone && (
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {c.address && (
                <span className="hidden md:inline-flex items-center gap-1 text-xs text-slate-400 max-w-[180px] truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{c.address}</span>
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
