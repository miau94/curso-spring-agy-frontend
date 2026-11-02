import { Copy, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useToastStore } from '../../store/useToastStore';
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

  const handleCopyEmail = (email: string) => {
    void navigator.clipboard.writeText(email);
    useToastStore.getState().info('Correo copiado', email);
  };

  return (
    <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#0F1623] border border-slate-200/85 dark:border-slate-800/90 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Últimos clientes registrados
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Vista rápida de las cuentas activas en el directorio
          </p>
        </div>
        <Link
          to="/customers"
          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors tabular-nums"
        >
          Ver los {customers.length} clientes
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Cargando clientes...</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Todavía no hay clientes en el directorio.
          </div>
        ) : (
          recent.map((c) => (
            <div
              key={c.id}
              className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/35 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {c.firstName.charAt(0)}
                  {c.lastName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {c.firstName} {c.lastName}
                    </p>
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      #{c.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(c.email)}
                      title="Copiar correo electrónico"
                      className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate cursor-pointer"
                    >
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{c.email}</span>
                      <Copy className="w-2.5 h-2.5 opacity-60 shrink-0" />
                    </button>
                    {c.phone ? (
                      <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
                        <Phone className="w-3 h-3 shrink-0" />
                        {c.phone}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              {c.address ? (
                <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 max-w-[200px] truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{c.address}</span>
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
