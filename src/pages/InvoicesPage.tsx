import {
  Eye,
  Filter,
  Lock,
  Pencil,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InvoiceDetailModal } from '../components/invoices/InvoiceDetailModal';
import { InvoiceFormModal } from '../components/invoices/InvoiceFormModal';
import { InvoiceStatusBadge } from '../components/invoices/InvoiceStatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { PaginationBar } from '../components/ui/PaginationBar';
import { parseApiError } from '../services/apiClient';
import { invoiceService } from '../services/invoiceService';
import { useAuthStore } from '../store/useAuthStore';
import { useCustomerStore } from '../store/useCustomerStore';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { useToastStore } from '../store/useToastStore';
import type { InvoiceDto, InvoiceStatus } from '../types/api';

const PAGE_SIZE = 6;

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value ?? 0));

const STATUS_FILTERS: { value: InvoiceStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PAID', label: 'Pagadas' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'OVERDUE', label: 'Vencidas' },
  { value: 'CANCELLED', label: 'Canceladas' },
];

export const InvoicesPage: React.FC = () => {
  const isAdmin = useAuthStore((s) => s.user?.role === 'ADMIN');
  const [searchParams, setSearchParams] = useSearchParams();

  const invoices = useInvoiceStore((s) => s.invoices);
  const loading = useInvoiceStore((s) => s.loading);
  const searchQuery = useInvoiceStore((s) => s.searchQuery);
  const statusFilter = useInvoiceStore((s) => s.statusFilter);
  const customerFilter = useInvoiceStore((s) => s.customerFilter);
  const currentPage = useInvoiceStore((s) => s.currentPage);
  const setSearchQuery = useInvoiceStore((s) => s.setSearchQuery);
  const setStatusFilter = useInvoiceStore((s) => s.setStatusFilter);
  const setCustomerFilter = useInvoiceStore((s) => s.setCustomerFilter);
  const setCurrentPage = useInvoiceStore((s) => s.setCurrentPage);
  const fetchInvoices = useInvoiceStore((s) => s.fetchInvoices);
  const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice);

  const customers = useCustomerStore((s) => s.customers);
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Modales Crear/Editar, Detalle y Borrado
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceDto | null>(null);

  const [detailInvoice, setDetailInvoice] = useState<InvoiceDto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Sincronizar query param ?customerId= si viene desde la ficha de un cliente
  useEffect(() => {
    const paramCustomerId = searchParams.get('customerId');
    if (paramCustomerId) {
      const parsed = Number(paramCustomerId);
      if (Number.isFinite(parsed) && parsed > 0) {
        setCustomerFilter(parsed);
      }
    }
  }, [searchParams, setCustomerFilter]);

  useEffect(() => {
    fetchInvoices().catch((err) => {
      const parsed = parseApiError(err);
      useToastStore.getState().error('Error al cargar facturas', parsed.message);
    });
    if (customers.length === 0) {
      void fetchCustomers();
    }
  }, [fetchInvoices, fetchCustomers, customers.length]);

  const filteredInvoices = useMemo(() => {
    const q = deferredSearchQuery.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (statusFilter !== 'ALL' && inv.status !== statusFilter) {
        return false;
      }
      if (customerFilter !== 'ALL' && inv.customerId !== customerFilter) {
        return false;
      }
      if (!q) return true;
      const matchId = `#${inv.id}`.includes(q) || String(inv.id).includes(q);
      const matchDesc = inv.description.toLowerCase().includes(q);
      const matchCustomer = (inv.customerName ?? '').toLowerCase().includes(q);
      return matchId || matchDesc || matchCustomer;
    });
  }, [invoices, deferredSearchQuery, statusFilter, customerFilter]);

  const totalAmountFiltered = useMemo(
    () =>
      filteredInvoices.reduce((acc, inv) => acc + Number(inv.amount ?? 0), 0),
    [filteredInvoices]
  );

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedInvoices = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredInvoices.slice(start, start + PAGE_SIZE);
  }, [filteredInvoices, safeCurrentPage]);

  const handleOpenCreate = useCallback(() => {
    if (!isAdmin) return;
    setEditingInvoice(null);
    setIsFormOpen(true);
  }, [isAdmin]);

  const handleOpenEdit = useCallback(
    (invoice: InvoiceDto) => {
      if (!isAdmin) return;
      setEditingInvoice(invoice);
      setIsFormOpen(true);
    },
    [isAdmin]
  );

  const handleOpenDetail = useCallback(async (id?: number) => {
    if (!id) return;
    setIsDetailOpen(true);
    setLoadingDetail(true);
    try {
      const fresh = await invoiceService.getById(id);
      setDetailInvoice(fresh);
    } catch (err) {
      const parsed = parseApiError(err);
      useToastStore
        .getState()
        .error('No se pudo cargar el detalle de la factura', parsed.message);
      setIsDetailOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete?.id) return;
    setDeleting(true);
    try {
      await deleteInvoice(invoiceToDelete.id);
      useToastStore
        .getState()
        .success(
          'Factura eliminada',
          `Se eliminó la factura #${invoiceToDelete.id} (${invoiceToDelete.description}).`
        );
      setInvoiceToDelete(null);
    } catch (err) {
      const parsed = parseApiError(err);
      useToastStore.getState().error('Error al eliminar factura', parsed.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCustomerFilterChange = (val: string) => {
    if (val === 'ALL') {
      setCustomerFilter('ALL');
      searchParams.delete('customerId');
      setSearchParams(searchParams, { replace: true });
    } else {
      const id = Number(val);
      setCustomerFilter(id);
      searchParams.set('customerId', String(id));
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Gestión de Facturación
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {filteredInvoices.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Conectado a <code className="text-xs">/api/invoices</code> •{' '}
            {isAdmin
              ? 'Modo Administrador (Emisión, modificación y anulación de facturas)'
              : 'Modo Consulta (Puedes ver las facturas y desgloses de los clientes)'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => void fetchInvoices()}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refrescar facturas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            disabled={!isAdmin}
            title={
              isAdmin
                ? 'Emitir una nueva factura (POST /api/invoices)'
                : 'Requiere permisos de Administrador'
            }
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isAdmin
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
            }`}
          >
            {isAdmin ? (
              <Plus className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4 text-amber-500" />
            )}
            <span>Nueva Factura</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="rounded-2xl bg-white dark:bg-[#0F1623] border border-slate-200/85 dark:border-slate-800/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por concepto, nombre de cliente o #ID..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Filtro por Cliente */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={customerFilter}
              onChange={(e) => handleCustomerFilterChange(e.target.value)}
              aria-label="Filtrar por cliente"
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Todos los clientes</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} - {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Píldoras de estado y sumatorio */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_FILTERS.map((st) => {
              const active = statusFilter === st.value;
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setStatusFilter(st.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Volumen listado:{' '}
            <strong className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalAmountFiltered)}
            </strong>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      {loading ? (
        <LoadingState message="Cargando registro de facturas..." />
      ) : filteredInvoices.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-10 h-10" />}
          title="No se encontraron facturas"
          description={
            searchQuery || statusFilter !== 'ALL' || customerFilter !== 'ALL'
              ? 'No hay facturas que coincidan con los filtros seleccionados.'
              : 'Aún no se han registrado facturas en el sistema.'
          }
        />
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#0F1623] border border-slate-200/85 dark:border-slate-800/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Factura</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Concepto / Descripción</th>
                  <th className="py-3.5 px-4 text-center">Líneas</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Importe Total</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                {paginatedInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums whitespace-nowrap">
                      INV-#{inv.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {inv.customerName || `Cliente #${inv.customerId}`}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        ID #{inv.customerId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-700 dark:text-slate-200 font-medium truncate">
                        {inv.description}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {inv.items?.length ?? 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => void handleOpenDetail(inv.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
                          title="Ver desglose de factura (GET /api/invoices/{id})"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(inv)}
                          disabled={!isAdmin}
                          title={
                            isAdmin
                              ? 'Editar factura (PUT /api/invoices/{id})'
                              : 'Solo Administrador puede editar facturas'
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isAdmin
                              ? 'text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 cursor-pointer'
                              : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => isAdmin && setInvoiceToDelete(inv)}
                          disabled={!isAdmin}
                          title={
                            isAdmin
                              ? 'Eliminar factura (DELETE /api/invoices/{id})'
                              : 'Solo Administrador puede eliminar facturas'
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isAdmin
                              ? 'text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer'
                              : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paginación */}
      <PaginationBar
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={filteredInvoices.length}
        itemLabel="facturas"
        onPageChange={setCurrentPage}
      />

      {/* Modal Crear / Editar Factura */}
      <InvoiceFormModal
        isOpen={isFormOpen}
        editingInvoice={editingInvoice}
        defaultCustomerId={customerFilter !== 'ALL' ? customerFilter : undefined}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Modal Detalle de Factura */}
      <InvoiceDetailModal
        isOpen={isDetailOpen}
        loading={loadingDetail}
        invoice={detailInvoice}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Confirmación de Eliminación */}
      <ConfirmDialog
        isOpen={Boolean(invoiceToDelete)}
        onClose={() => setInvoiceToDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
        isLoading={deleting}
        title="Eliminar Factura"
        description={
          invoiceToDelete
            ? `¿Estás seguro de que deseas eliminar permanentemente la factura #${invoiceToDelete.id} ("${invoiceToDelete.description}") de ${invoiceToDelete.customerName}? Esta acción ejecutará DELETE /api/invoices/${invoiceToDelete.id}.`
            : ''
        }
      />
    </div>
  );
};
