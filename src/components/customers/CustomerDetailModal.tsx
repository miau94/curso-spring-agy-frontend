import {
  ArrowRight,
  Copy,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Receipt,
  UserCheck,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../../services/invoiceService';
import { useToastStore } from '../../store/useToastStore';
import type { CustomerDto, InvoiceDto } from '../../types/api';
import { InvoiceStatusBadge } from '../invoices/InvoiceStatusBadge';
import { Modal } from '../ui/Modal';

interface CustomerDetailModalProps {
  isOpen: boolean;
  loading: boolean;
  customer: CustomerDto | null;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value ?? 0));

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  loading,
  customer,
  onClose,
}) => {
  const navigate = useNavigate();
  const [customerInvoices, setCustomerInvoices] = useState<InvoiceDto[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    if (!isOpen || !customer?.id) {
      setCustomerInvoices([]);
      return;
    }
    let active = true;
    setLoadingInvoices(true);
    invoiceService
      .getByCustomerId(customer.id)
      .then((data) => {
        if (active) setCustomerInvoices(data);
      })
      .catch(() => {
        if (active) setCustomerInvoices([]);
      })
      .finally(() => {
        if (active) setLoadingInvoices(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, customer?.id]);

  const handleCopy = (label: string, value: string) => {
    void navigator.clipboard.writeText(value);
    useToastStore.getState().info(`${label} copiado`, value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha de cliente"
      subtitle="Registro consultado desde GET /api/customers/{id} y sus facturas asociadas"
      maxWidthClass="max-w-xl"
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

          {/* Facturas asociadas al cliente */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Receipt className="w-3.5 h-3.5 text-indigo-500" />
                Facturas del cliente ({customerInvoices.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/invoices?customerId=${customer.id}`);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <span>Ver en Facturación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loadingInvoices ? (
              <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span>Cargando facturas...</span>
              </div>
            ) : customerInvoices.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
                Este cliente aún no tiene facturas emitidas.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          INV-#{inv.id}
                        </span>
                        <InvoiceStatusBadge status={inv.status} />
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                        {inv.description}
                      </p>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-900 dark:text-white shrink-0">
                      {formatCurrency(inv.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
