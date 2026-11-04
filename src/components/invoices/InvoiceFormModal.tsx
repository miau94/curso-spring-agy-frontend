import { Loader2, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { invoiceSchema } from '../../schemas/invoiceSchema';
import { extractZodFieldErrors } from '../../schemas/zodUtils';
import { parseApiError } from '../../services/apiClient';
import { useCustomerStore } from '../../store/useCustomerStore';
import { useInvoiceStore } from '../../store/useInvoiceStore';
import { useToastStore } from '../../store/useToastStore';
import type {
  FieldErrors,
  InvoiceDto,
  InvoiceItemDto,
  InvoiceStatus,
} from '../../types/api';
import { FormInput } from '../ui/FormInput';
import { Modal } from '../ui/Modal';

interface InvoiceFormModalProps {
  isOpen: boolean;
  editingInvoice: InvoiceDto | null;
  defaultCustomerId?: number;
  onClose: () => void;
}

interface InvoiceFormContentProps {
  editingInvoice: InvoiceDto | null;
  defaultCustomerId?: number;
  onClose: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pendiente (PENDING)' },
  { value: 'PAID', label: 'Pagada (PAID)' },
  { value: 'OVERDUE', label: 'Vencida (OVERDUE)' },
  { value: 'CANCELLED', label: 'Cancelada (CANCELLED)' },
];

const InvoiceFormContent: React.FC<InvoiceFormContentProps> = ({
  editingInvoice,
  defaultCustomerId,
  onClose,
}) => {
  const customers = useCustomerStore((s) => s.customers);
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);
  const createInvoice = useInvoiceStore((s) => s.createInvoice);
  const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

  useEffect(() => {
    if (customers.length === 0) {
      void fetchCustomers();
    }
  }, [customers.length, fetchCustomers]);

  const [customerId, setCustomerId] = useState<number>(() => {
    if (editingInvoice?.customerId) return editingInvoice.customerId;
    if (defaultCustomerId) return defaultCustomerId;
    return customers[0]?.id ?? 0;
  });

  const [description, setDescription] = useState<string>(
    () => editingInvoice?.description ?? ''
  );

  const [status, setStatus] = useState<InvoiceStatus>(
    () => editingInvoice?.status ?? 'PENDING'
  );

  const [items, setItems] = useState<InvoiceItemDto[]>(() =>
    editingInvoice?.items && editingInvoice.items.length > 0
      ? editingInvoice.items.map((i) => ({
          id: i.id,
          description: i.description,
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice),
        }))
      : [{ description: '', quantity: 1, unitPrice: 0 }]
  );

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const calculatedTotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const q = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 0;
      const p = Number.isFinite(Number(item.unitPrice)) ? Number(item.unitPrice) : 0;
      return acc + q * p;
    }, 0);
  }, [items]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItemDto,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const rawData = {
      customerId: Number(customerId),
      description,
      status,
      items: items.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };

    const validation = invoiceSchema.safeParse(rawData);
    if (!validation.success) {
      setFieldErrors(extractZodFieldErrors(validation.error));
      return;
    }

    setSubmitting(true);
    try {
      const payload: InvoiceDto = {
        customerId: validation.data.customerId,
        description: validation.data.description,
        status: validation.data.status,
        items: validation.data.items,
      };

      if (editingInvoice?.id) {
        const updated = await updateInvoice(editingInvoice.id, payload);
        useToastStore
          .getState()
          .success(
            'Factura actualizada',
            `La factura #${updated.id} (${updated.description}) se ha actualizado.`
          );
      } else {
        const created = await createInvoice(payload);
        useToastStore
          .getState()
          .success(
            'Factura creada',
            `Se emitió la factura #${created.id} para ${created.customerName ?? 'el cliente'}.`
          );
      }
      onClose();
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors) {
        setFieldErrors(parsed.fieldErrors);
      }
      useToastStore.getState().error('Error al guardar la factura', parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selector de Cliente */}
        <div className="space-y-1.5">
          <label
            htmlFor="inv-customerId"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Cliente (customerId) *
          </label>
          <select
            id="inv-customerId"
            value={customerId || ''}
            onChange={(e) => {
              setCustomerId(Number(e.target.value));
              if (fieldErrors.customerId) {
                setFieldErrors((prev) => ({ ...prev, customerId: '' }));
              }
            }}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
              fieldErrors.customerId
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
            }`}
          >
            <option value="">Selecciona un cliente...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.id} - {c.firstName} {c.lastName} ({c.email})
              </option>
            ))}
          </select>
          {fieldErrors.customerId ? (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {fieldErrors.customerId}
            </p>
          ) : null}
        </div>

        {/* Estado de la factura */}
        <div className="space-y-1.5">
          <label
            htmlFor="inv-status"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Estado (status) *
          </label>
          <select
            id="inv-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FormInput
        id="inv-description"
        label="Concepto general / Descripción (description) *"
        type="text"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (fieldErrors.description) {
            setFieldErrors((prev) => ({ ...prev, description: '' }));
          }
        }}
        placeholder="Ej. Desarrollo de plataforma e-commerce y pasarela de pagos"
        error={fieldErrors.description}
      />

      {/* Editor dinámico de líneas de factura */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Líneas de detalle ({items.length}) *
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir línea</span>
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const descErr = fieldErrors[`items.${idx}.description`];
            const qtyErr = fieldErrors[`items.${idx}.quantity`];
            const priceErr = fieldErrors[`items.${idx}.unitPrice`];
            const rowSubtotal =
              (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Descripción del ítem
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(idx, 'description', e.target.value)
                      }
                      placeholder="Ej. Licencia anual / Horas de consultoría"
                      className={`w-full px-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none ${
                        descErr
                          ? 'border-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                    {descErr ? (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                        {descErr}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Cant.
                    </label>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, 'quantity', Number(e.target.value))
                      }
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none ${
                        qtyErr
                          ? 'border-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                    {qtyErr ? (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                        {qtyErr}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Precio Unit. (€)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(idx, 'unitPrice', Number(e.target.value))
                      }
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none ${
                        priceErr
                          ? 'border-rose-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                      }`}
                    />
                    {priceErr ? (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                        {priceErr}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-1 flex sm:flex-col items-center sm:items-end justify-between pt-1 sm:pt-5">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      title="Eliminar línea"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Subtotal línea:{' '}
                  <strong className="ml-1 text-slate-800 dark:text-slate-200">
                    {formatCurrency(rowSubtotal)}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>

        {fieldErrors.items ? (
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
            {fieldErrors.items}
          </p>
        ) : null}
      </div>

      {/* Resumen Total Calculado */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
          Importe Total Calculado
        </span>
        <span className="text-lg font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
          {formatCurrency(calculatedTotal)}
        </span>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60 cursor-pointer"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          <span>{editingInvoice ? 'Guardar Cambios' : 'Emitir Factura'}</span>
        </button>
      </div>
    </form>
  );
};

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  isOpen,
  editingInvoice,
  defaultCustomerId,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingInvoice ? `Editar Factura #${editingInvoice.id}` : 'Nueva Factura'}
      subtitle="Validado en Frontend con Zod y en Backend con @Valid InvoiceDto"
      maxWidthClass="max-w-2xl"
    >
      <InvoiceFormContent
        key={`${editingInvoice?.id ?? 'new'}-${defaultCustomerId ?? 'all'}-${isOpen ? 'open' : 'closed'}`}
        editingInvoice={editingInvoice}
        defaultCustomerId={defaultCustomerId}
        onClose={onClose}
      />
    </Modal>
  );
};
