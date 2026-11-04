import { FileText, Loader2, Receipt, User } from 'lucide-react';
import React from 'react';
import type { InvoiceDto } from '../../types/api';
import { Modal } from '../ui/Modal';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  loading: boolean;
  invoice: InvoiceDto | null;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value ?? 0));

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  loading,
  invoice,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={invoice ? `Factura #${invoice.id}` : 'Detalle de factura'}
      subtitle="Registro consultado desde GET /api/invoices/{id}"
      maxWidthClass="max-w-2xl"
    >
      {loading || !invoice ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-xs">Consultando factura y líneas de detalle...</span>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Cabecera resumen */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    INV-#{invoice.id}
                  </span>
                  <InvoiceStatusBadge status={invoice.status} />
                </div>
                <h4 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                  {invoice.description}
                </h4>
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Cliente:{' '}
                    <strong className="font-semibold text-slate-700 dark:text-slate-200">
                      {invoice.customerName || `Cliente #${invoice.customerId}`}
                    </strong>{' '}
                    (ID #{invoice.customerId})
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Importe Total
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {formatCurrency(invoice.amount)}
              </p>
            </div>
          </div>

          {/* Tabla de ítems */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5" />
                Líneas de facturación ({invoice.items?.length ?? 0})
              </span>
            </div>

            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3.5">Concepto / Descripción</th>
                    <th className="py-2.5 px-3 text-right">Cant.</th>
                    <th className="py-2.5 px-3 text-right">Precio Unit.</th>
                    <th className="py-2.5 px-3.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {(invoice.items ?? []).map((item, idx) => {
                    const subtotal =
                      item.subtotal ?? Number(item.quantity) * Number(item.unitPrice);
                    return (
                      <tr
                        key={item.id ?? idx}
                        className="text-slate-700 dark:text-slate-200 hover:bg-slate-50/60 dark:hover:bg-slate-900/40"
                      >
                        <td className="py-2.5 px-3.5 font-medium">{item.description}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800">
                    <td
                      colSpan={3}
                      className="py-3 px-3.5 text-right font-bold text-slate-700 dark:text-slate-300"
                    >
                      Total Factura
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {formatCurrency(invoice.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
