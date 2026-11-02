import { Eye, EyeOff, KeyRound, Loader2, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { userRequestSchema } from '../../schemas/userSchema';
import { extractZodFieldErrors } from '../../schemas/zodUtils';
import { parseApiError } from '../../services/apiClient';
import { useToastStore } from '../../store/useToastStore';
import { useUserStore } from '../../store/useUserStore';
import type { FieldErrors, UserDto, UserRequestDto } from '../../types/api';
import { FormInput } from '../ui/FormInput';
import { Modal } from '../ui/Modal';
import { RoleSelectorCards } from './RoleSelectorCards';

interface UserFormModalProps {
  isOpen: boolean;
  editingUser: UserDto | null;
  onClose: () => void;
}

interface UserFormContentProps {
  editingUser: UserDto | null;
  onClose: () => void;
}

const UserFormContent: React.FC<UserFormContentProps> = ({ editingUser, onClose }) => {
  const createUser = useUserStore((s) => s.createUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const toast = useToastStore();

  const [formData, setFormData] = useState<UserRequestDto>(() =>
    editingUser
      ? {
          email: editingUser.email,
          password: '',
          role: editingUser.role,
        }
      : {
          email: '',
          password: '',
          role: 'USER',
        }
  );
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // 1. Validación Frontend con Zod (userRequestSchema)
    const validation = userRequestSchema.safeParse(formData);
    if (!validation.success) {
      setFieldErrors(extractZodFieldErrors(validation.error));
      return;
    }

    setSubmitting(true);
    try {
      // 2. Envío al Backend (también validado con @Valid en UserController)
      if (editingUser) {
        const updated = await updateUser(editingUser.id, validation.data);
        toast.success('Usuario actualizado', `Se actualizaron los datos de ${updated.email}.`);
      } else {
        const created = await createUser(validation.data);
        toast.success(
          'Usuario creado',
          `Se registró a ${created.email} con rol ${created.role} (BCrypt).`
        );
      }
      onClose();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormInput
        id="user-email"
        label="Correo electrónico (email) *"
        type="email"
        value={formData.email}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, email: e.target.value }));
          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
        }}
        placeholder="usuario@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={fieldErrors.email}
      />

      <FormInput
        id="user-password"
        label={editingUser ? 'Nueva Contraseña *' : 'Contraseña *'}
        hint="mínimo 6 caracteres"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, password: e.target.value }));
          if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
        }}
        placeholder="Mínimo 6 caracteres"
        leftIcon={<KeyRound className="w-4 h-4" />}
        error={fieldErrors.password}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <RoleSelectorCards
        selectedRole={formData.role}
        onSelectRole={(role) => setFormData((prev) => ({ ...prev, role }))}
      />

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
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
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
        </button>
      </div>
    </form>
  );
};

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  editingUser,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? `Editar Usuario #${editingUser.id}` : 'Nuevo Usuario'}
      subtitle="Validado en Frontend con Zod y en Backend con @Valid UserRequestDto"
    >
      <UserFormContent
        key={`${editingUser?.id ?? 'new'}-${isOpen ? 'open' : 'closed'}`}
        editingUser={editingUser}
        onClose={onClose}
      />
    </Modal>
  );
};
