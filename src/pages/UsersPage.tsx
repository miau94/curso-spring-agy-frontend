import { Plus, RefreshCw, Shield } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { UserFormModal } from '../components/users/UserFormModal';
import { UserTable } from '../components/users/UserTable';
import { UserToolbar } from '../components/users/UserToolbar';
import { parseApiError } from '../services/apiClient';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useUserStore } from '../store/useUserStore';
import type { UserDto } from '../types/api';

export const UsersPage: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const toast = useToastStore();

  const {
    users,
    loading,
    searchEmail,
    roleFilter,
    setSearchEmail,
    setRoleFilter,
    fetchUsers,
    deleteUser,
  } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers().catch((err) => {
      const parsed = parseApiError(err);
      toast.error('Error al cargar usuarios', parsed.message);
    });
  }, [fetchUsers, toast]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesEmail = u.email.toLowerCase().includes(searchEmail.trim().toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesEmail && matchesRole;
    });
  }, [users, searchEmail, roleFilter]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (targetUser: UserDto) => {
    setEditingUser(targetUser);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUser(userToDelete.id);
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
            <code className="text-xs">/api/users</code> (Zod + Zustand)
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

      {/* UserToolbar Component */}
      <UserToolbar
        searchEmail={searchEmail}
        onSearchEmailChange={setSearchEmail}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Users Table or Empty/Loading */}
      {loading ? (
        <LoadingState message="Cargando usuarios registrados..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<Shield className="w-10 h-10" />}
          title="No se encontraron usuarios"
          description="Prueba ajustando los filtros de búsqueda o rol."
        />
      ) : (
        <UserTable
          users={filteredUsers}
          currentUserId={currentUser?.id}
          onEdit={handleOpenEdit}
          onDelete={setUserToDelete}
        />
      )}

      {/* UserFormModal Component */}
      <UserFormModal
        isOpen={isModalOpen}
        editingUser={editingUser}
        onClose={() => setIsModalOpen(false)}
      />

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
