import { Loader2, UserCheck } from 'lucide-react';
import React from 'react';
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha de Cliente"
      subtitle="Datos obtenidos en tiempo real desde GET /api/customers/{id}"
    >
      {loading || !customer ? (
        <div className="py-10 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-xs">Consultando cliente...</span>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
              {customer.firstName.charAt(0)}
              {customer.lastName.charAt(0)}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Cliente ID #{customer.id}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {customer.firstName} {customer.lastName}
              </h4>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Email</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {customer.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Teléfono</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {customer.phone || 'No especificado'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-semibold text-slate-400">Dirección</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {customer.address || 'No especificada'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
