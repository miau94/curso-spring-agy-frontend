import { Copy, Loader2, Mail, MapPin, Phone, UserCheck } from 'lucide-react';
import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import type { CustomerDto } from '../../types/api';
import { Modal } from '../ui/Modal';

interface CustomerDetailModalProps {
  isOpen: boolean;
  loading: boolean;
  customer: CustomerDto | null;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  loading,
  customer,
  onClose,
}) => {
  const handleCopy = (label: string, value: string) => {
    void navigator.clipboard.writeText(value);
    useToastStore.getState().info(`${label} copiado`, value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha de cliente"
      subtitle="Registro consultado desde GET /api/customers/{id}"
    >
      {loading || !customer ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-xs">Consultando datos del cliente...</span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0">
              {customer.firstName.charAt(0)}
              {customer.lastName.charAt(0)}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                <UserCheck className="w-3.5 h-3.5" />
                <span>ID #{customer.id}</span>
              </div>
              <h4 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                {customer.firstName} {customer.lastName}
              </h4>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
            <div className="flex items-center justify-between py-3 gap-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Correo electrónico
              </span>
              <button
                type="button"
                onClick={() => handleCopy('Correo', customer.email)}
                className="inline-flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title="Copiar correo"
              >
                <span>{customer.email}</span>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 gap-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Teléfono
              </span>
              {customer.phone ? (
                <button
                  type="button"
                  onClick={() => handleCopy('Teléfono', customer.phone!)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors tabular-nums cursor-pointer"
                  title="Copiar teléfono"
                >
                  <span>{customer.phone}</span>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <span className="text-xs text-slate-400">Sin especificar</span>
              )}
            </div>

            <div className="flex items-center justify-between py-3 gap-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Dirección postal
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100 text-right">
                {customer.address || 'Sin especificar'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
