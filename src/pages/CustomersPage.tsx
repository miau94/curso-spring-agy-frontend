import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LayoutGrid,
  List,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { parseApiError } from '../services/apiClient';
import { customerService } from '../services/customerService';
import type { CustomerDto, FieldErrors } from '../types/api';

const PAGE_SIZE = 6;

const emptyForm: CustomerDto = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
};

export const CustomersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const toast = useToast();

  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal Crear / Editar
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDto | null>(null);
  const [formData, setFormData] = useState<CustomerDto>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Modal Detalle (GET /api/customers/{id})
  const [detailCustomer, setDetailCustomer] = useState<CustomerDto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Confirmar eliminación
  const [customerToDelete, setCustomerToDelete] = useState<CustomerDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error('Error al cargar clientes', parsed.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

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
    setFormData(emptyForm);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer: CustomerDto) => {
    if (!isAdmin) return;
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone ?? '',
      address: customer.address ?? '',
    });
    setFieldErrors({});
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

  const validateClientSide = (): boolean => {
    const errs: FieldErrors = {};
    const fn = formData.firstName.trim();
    const ln = formData.lastName.trim();
    const em = formData.email.trim();

    if (!fn) {
      errs.firstName = 'First name is mandatory';
    } else if (fn.length < 2 || fn.length > 50) {
      errs.firstName = 'First name must be between 2 and 50 characters';
    }

    if (!ln) {
      errs.lastName = 'Last name is mandatory';
    } else if (ln.length < 2 || ln.length > 50) {
      errs.lastName = 'Last name must be between 2 and 50 characters';
    }

    if (!em) {
      errs.email = 'Email is mandatory';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      errs.email = 'Email should be valid';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClientSide()) return;

    setSubmitting(true);
    try {
      const payload: CustomerDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '',
        address: formData.address?.trim() || '',
      };

      if (editingCustomer?.id) {
        const updated = await customerService.update(editingCustomer.id, payload);
        setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success(
          'Cliente actualizado',
          `${updated.firstName} ${updated.lastName} se ha actualizado correctamente.`
        );
      } else {
        const created = await customerService.create(payload);
        setCustomers((prev) => [created, ...prev]);
        toast.success(
          'Cliente creado',
          `${created.firstName} ${created.lastName} fue añadido al directorio.`
        );
      }
      setIsFormOpen(false);
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors) {
        setFieldErrors(parsed.fieldErrors);
      } else if (parsed.message.toLowerCase().includes('email')) {
        setFieldErrors({ email: parsed.message });
      }
      toast.error('Error al guardar el cliente', parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete?.id) return;
    setDeleting(true);
    try {
      await customerService.remove(customerToDelete.id);
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
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
      {/* Page Header */}
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
              ? 'Modo Administrador (CRUD completo habilitado)'
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

          {/* Botón Nuevo Cliente: Si es USER se muestra deshabilitado con tooltip (Paso 5.3) */}
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

      {/* Toolbar: Search + View Mode Switcher (Paso 5.1) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar cliente por nombre, apellido, email, teléfono o dirección..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Tabla</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tarjetas</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {loading ? (
        <div className="p-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Cargando directorio de clientes...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="p-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No se encontraron clientes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {searchQuery
              ? `No hay coincidencias para "${searchQuery}".`
              : 'El directorio está vacío actualmente.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
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
                {paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {customer.firstName.charAt(0)}
                          {customer.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-xs text-slate-400">ID #{customer.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500 dark:text-slate-400">
                      {customer.address ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {customer.address}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* Ver detalle (GET /api/customers/{id}) permitido a USER y ADMIN */}
                        <button
                          type="button"
                          onClick={() => void handleOpenDetail(customer.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                          title="Ver ficha completa (GET /api/customers/{id})"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Editar: Deshabilitado con tooltip si es USER (Paso 5.3) */}
                        <button
                          type="button"
                          disabled={!isAdmin}
                          onClick={() => handleOpenEdit(customer)}
                          title={
                            isAdmin
                              ? 'Editar cliente (PUT /api/customers/{id})'
                              : 'Requiere permisos de Administrador'
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isAdmin
                              ? 'text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 cursor-pointer'
                              : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                          }`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Eliminar: Deshabilitado con tooltip si es USER (Paso 5.3) */}
                        <button
                          type="button"
                          disabled={!isAdmin}
                          onClick={() => isAdmin && setCustomerToDelete(customer)}
                          title={
                            isAdmin
                              ? 'Eliminar cliente (DELETE /api/customers/{id})'
                              : 'Requiere permisos de Administrador'
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            isAdmin
                              ? 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer'
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
      ) : (
        /* Vista en Tarjetas (Cards) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCustomers.map((customer) => (
            <div
              key={customer.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center">
                      {customer.firstName.charAt(0)}
                      {customer.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400">
                        Cliente #{customer.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{customer.phone || 'Sin teléfono'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{customer.address || 'Sin dirección'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => void handleOpenDetail(customer.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver detalle</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => handleOpenEdit(customer)}
                    title={
                      isAdmin ? 'Editar cliente' : 'Requiere permisos de Administrador'
                    }
                    className={`p-1.5 rounded-lg ${
                      isAdmin
                        ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-500/10 cursor-pointer'
                        : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={() => isAdmin && setCustomerToDelete(customer)}
                    title={
                      isAdmin ? 'Eliminar cliente' : 'Requiere permisos de Administrador'
                    }
                    className={`p-1.5 rounded-lg ${
                      isAdmin
                        ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer'
                        : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Página <strong>{safeCurrentPage}</strong> de <strong>{totalPages}</strong> (
            {filteredCustomers.length} clientes)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Cliente (Paso 5.2) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCustomer ? `Editar Cliente #${editingCustomer.id}` : 'Nuevo Cliente'}
        subtitle="Los campos con * son validados mediante @Valid en CustomerDto"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre (firstName) *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }));
                  if (fieldErrors.firstName)
                    setFieldErrors((prev) => ({ ...prev, firstName: '' }));
                }}
                placeholder="Ej. Carlos"
                className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border focus:outline-none focus:ring-2 ${
                  fieldErrors.firstName
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-xs font-medium text-rose-500">{fieldErrors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Apellido (lastName) *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }));
                  if (fieldErrors.lastName) setFieldErrors((prev) => ({ ...prev, lastName: '' }));
                }}
                placeholder="Ej. Mendoza"
                className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border focus:outline-none focus:ring-2 ${
                  fieldErrors.lastName
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-xs font-medium text-rose-500">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Correo electrónico (email) *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="cliente@empresa.com"
              className={`w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border focus:outline-none focus:ring-2 ${
                fieldErrors.email
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs font-medium text-rose-500">{fieldErrors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teléfono (phone)
              </label>
              <input
                type="text"
                value={formData.phone ?? ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+34 600 123 456"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dirección (address)
              </label>
              <input
                type="text"
                value={formData.address ?? ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Calle Mayor 12, Madrid"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{editingCustomer ? 'Guardar Cambios' : 'Crear Cliente'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detalle de Cliente (GET /api/customers/{id}) */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Ficha de Cliente"
        subtitle="Datos obtenidos en tiempo real desde GET /api/customers/{id}"
      >
        {loadingDetail || !detailCustomer ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="text-xs">Consultando cliente...</span>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                {detailCustomer.firstName.charAt(0)}
                {detailCustomer.lastName.charAt(0)}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Cliente ID #{detailCustomer.id}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {detailCustomer.firstName} {detailCustomer.lastName}
                </h4>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Email</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {detailCustomer.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Teléfono</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {detailCustomer.phone || 'No especificado'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-semibold text-slate-400">Dirección</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {detailCustomer.address || 'No especificada'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

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
