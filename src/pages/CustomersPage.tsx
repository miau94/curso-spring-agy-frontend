import { Lock, Plus, RefreshCw, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { CustomerCardGrid } from '../components/customers/CustomerCardGrid';
import { CustomerDetailModal } from '../components/customers/CustomerDetailModal';
import { CustomerFormModal } from '../components/customers/CustomerFormModal';
import { CustomerTable } from '../components/customers/CustomerTable';
import { CustomerToolbar } from '../components/customers/CustomerToolbar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { PaginationBar } from '../components/ui/PaginationBar';
import { parseApiError } from '../services/apiClient';
import { customerService } from '../services/customerService';
import { useAuthStore } from '../store/useAuthStore';
import { useCustomerStore } from '../store/useCustomerStore';
import { useToastStore } from '../store/useToastStore';
import type { CustomerDto } from '../types/api';

const PAGE_SIZE = 6;

export const CustomersPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';
  const toast = useToastStore();

  const {
    customers,
    loading,
    searchQuery,
    viewMode,
    currentPage,
    setSearchQuery,
    setViewMode,
    setCurrentPage,
    fetchCustomers,
    deleteCustomer,
  } = useCustomerStore();

  // Modal Crear / Editar
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDto | null>(null);

  // Modal Detalle (GET /api/customers/{id})
  const [detailCustomer, setDetailCustomer] = useState<CustomerDto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Confirmar eliminación
  const [customerToDelete, setCustomerToDelete] = useState<CustomerDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCustomers().catch((err) => {
      const parsed = parseApiError(err);
      toast.error('Error al cargar clientes', parsed.message);
    });
  }, [fetchCustomers, toast]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCustomers = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredCustomers.slice(start, start + PAGE_SIZE);
  }, [filteredCustomers, safeCurrentPage]);

  const handleOpenCreate = () => {
    if (!isAdmin) return;
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer: CustomerDto) => {
    if (!isAdmin) return;
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleOpenDetail = async (id?: number) => {
    if (!id) return;
    setIsDetailOpen(true);
    setLoadingDetail(true);
    try {
      const fresh = await customerService.getById(id);
      setDetailCustomer(fresh);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error('No se pudo cargar el detalle del cliente', parsed.message);
      setIsDetailOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete?.id) return;
    setDeleting(true);
    try {
      await deleteCustomer(customerToDelete.id);
      toast.success(
        'Cliente eliminado',
        `Se eliminó a ${customerToDelete.firstName} ${customerToDelete.lastName}.`
      );
      setCustomerToDelete(null);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error('Error al eliminar cliente', parsed.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Directorio de Clientes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {filteredCustomers.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Conectado a <code className="text-xs">/api/customers</code> •{' '}
            {isAdmin
              ? 'Modo Administrador (CRUD completo con Zod + Zustand)'
              : 'Modo Lectura (Acciones de escritura requieren permisos de Administrador)'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => void fetchCustomers()}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            disabled={!isAdmin}
            title={
              isAdmin
                ? 'Crear un nuevo cliente (POST /api/customers)'
                : 'Requiere permisos de Administrador'
            }
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isAdmin
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
            }`}
          >
            {isAdmin ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-500" />}
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Toolbar Component */}
      <CustomerToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content: Loading, Empty, Table, or Card Grid */}
      {loading ? (
        <LoadingState message="Cargando directorio de clientes..." />
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10" />}
          title="No se encontraron clientes"
          description={
            searchQuery
              ? `No hay coincidencias para "${searchQuery}".`
              : 'El directorio está vacío actualmente.'
          }
        />
      ) : viewMode === 'table' ? (
        <CustomerTable
          customers={paginatedCustomers}
          isAdmin={isAdmin}
          onViewDetail={(id) => void handleOpenDetail(id)}
          onEdit={handleOpenEdit}
          onDelete={setCustomerToDelete}
        />
      ) : (
        <CustomerCardGrid
          customers={paginatedCustomers}
          isAdmin={isAdmin}
          onViewDetail={(id) => void handleOpenDetail(id)}
          onEdit={handleOpenEdit}
          onDelete={setCustomerToDelete}
        />
      )}

      {/* Pagination Bar Component */}
      <PaginationBar
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={filteredCustomers.length}
        itemLabel="clientes"
        onPageChange={setCurrentPage}
      />

      {/* Modal Crear / Editar con Zod */}
      <CustomerFormModal
        isOpen={isFormOpen}
        editingCustomer={editingCustomer}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Modal Detalle */}
      <CustomerDetailModal
        isOpen={isDetailOpen}
        loading={loadingDetail}
        customer={detailCustomer}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Confirmación de Borrado */}
      <ConfirmDialog
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
        isLoading={deleting}
        title="Eliminar Cliente"
        description={
          customerToDelete
            ? `¿Estás seguro de que deseas eliminar permanentemente al cliente "${customerToDelete.firstName} ${customerToDelete.lastName}" (${customerToDelete.email})? Esta acción ejecutará DELETE /api/customers/${customerToDelete.id}.`
            : ''
        }
      />
    </div>
  );
};
