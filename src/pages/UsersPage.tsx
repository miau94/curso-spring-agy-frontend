import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal } from '../components/ui/Modal';
import { RoleBadge } from '../components/ui/RoleBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { parseApiError } from '../services/apiClient';
import { userService } from '../services/userService';
import type { FieldErrors, Role, UserDto, UserRequestDto } from '../types/api';

const emptyUserForm: UserRequestDto = {
  email: '',
  password: '',
  role: 'USER',
};

export const UsersPage: React.FC = () => {
  const { user: currentUser, updateCurrentUserIfMatches } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL');

  // Modal Crear / Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState<UserRequestDto>(emptyUserForm);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Confirmar eliminación
  const [userToDelete, setUserToDelete] = useState<UserDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error('Error al cargar usuarios', parsed.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesEmail = u.email.toLowerCase().includes(searchEmail.trim().toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesEmail && matchesRole;
    });
  }, [users, searchEmail, roleFilter]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData(emptyUserForm);
    setShowPassword(false);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (targetUser: UserDto) => {
    setEditingUser(targetUser);
    setFormData({
      email: targetUser.email,
      password: '',
      role: targetUser.role,
    });
    setShowPassword(false);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const validateClientSide = (): boolean => {
    const errs: FieldErrors = {};
    const em = formData.email.trim();

    if (!em) {
      errs.email = 'Email is mandatory';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      errs.email = 'Email should be valid';
    }

    if (!formData.password) {
      errs.password = 'Password is mandatory';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateClientSide()) return;

    setSubmitting(true);
    try {
      const payload: UserRequestDto = {
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      if (editingUser) {
        const updated = await userService.update(editingUser.id, payload);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        updateCurrentUserIfMatches(updated);
        toast.success('Usuario actualizado', `Se actualizaron los datos de ${updated.email}.`);
      } else {
        const created = await userService.create(payload);
        setUsers((prev) => [...prev, created]);
        toast.success(
          'Usuario creado',
          `Se registró a ${created.email} con rol ${created.role} (BCrypt).`
        );
      }
      setIsModalOpen(false);
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors) {
        setFieldErrors(parsed.fieldErrors);
      } else if (parsed.message.toLowerCase().includes('email')) {
        setFieldErrors({ email: parsed.message });
      }
      toast.error('No se pudo guardar el usuario', parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userService.remove(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success('Usuario eliminado', `El usuario ${userToDelete.email} ha sido eliminado.`);
      setUserToDelete(null);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error('Error al eliminar usuario', parsed.message);
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
              Administración de Usuarios
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {filteredUsers.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Módulo exclusivo <code className="text-xs">ROLE_ADMIN</code> conectado a{' '}
            <code className="text-xs">/api/users</code> con encriptación BCrypt
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => void fetchUsers()}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refrescar usuarios"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar (Paso 6.2) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Buscar usuario por correo electrónico..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto">
          {(['ALL', 'ADMIN', 'USER'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {r === 'ALL' ? 'Todos' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Cargando usuarios registrados...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <Shield className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No se encontraron usuarios
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prueba ajustando los filtros de búsqueda o rol.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-5">ID</th>
                  <th className="py-3.5 px-4">Correo Electrónico</th>
                  <th className="py-3.5 px-4">Rol Asignado</th>
                  <th className="py-3.5 px-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredUsers.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-400">#{u.id}</td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center uppercase">
                            {u.email.slice(0, 2)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {u.email}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                                Tú (Sesión actual)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <RoleBadge role={u.role} />
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="p-2 rounded-lg text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                            title="Editar usuario y contraseña (PUT /api/users/{id})"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Protección para no auto-eliminar la cuenta ADMIN en sesión (Paso 6.1) */}
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => !isSelf && setUserToDelete(u)}
                            title={
                              isSelf
                                ? 'Protección activa: No puedes eliminar tu propia cuenta en sesión'
                                : 'Eliminar usuario (DELETE /api/users/{id})'
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              isSelf
                                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Usuario con Selector Visual de Rol (Paso 6.2) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Editar Usuario #${editingUser.id}` : 'Nuevo Usuario'}
        subtitle="Envía UserRequestDto (email, password en BCrypt, role)"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Correo electrónico (email) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="usuario@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border focus:outline-none focus:ring-2 ${
                  fieldErrors.email
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs font-medium text-rose-500">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {editingUser ? 'Nueva Contraseña *' : 'Contraseña *'}{' '}
              <span className="font-normal text-slate-400">(mínimo 6 caracteres)</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, password: e.target.value }));
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="Mínimo 6 caracteres"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border focus:outline-none focus:ring-2 ${
                  fieldErrors.password
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs font-medium text-rose-500">{fieldErrors.password}</p>
            )}
          </div>

          {/* Visual Role Selector Cards (Paso 6.2) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Rol del Usuario (Role) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'USER' }))}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.role === 'USER'
                    ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  <UserIcon className="w-4 h-4" />
                  <span>ROL USER</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Lectura de clientes (<code className="text-[10px]">GET /api/customers</code>).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'ADMIN' }))}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.role === 'ADMIN'
                    ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ROL ADMIN</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Control total de clientes y usuarios.
                </p>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
              <span>{editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
        isLoading={deleting}
        title="Eliminar Usuario"
        description={
          userToDelete
            ? `¿Estás seguro de que deseas eliminar permanentemente al usuario "${userToDelete.email}" (Rol ${userToDelete.role})?`
            : ''
        }
      />
    </div>
  );
};
