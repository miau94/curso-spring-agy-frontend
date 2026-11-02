import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { customerSchema } from '../../schemas/customerSchema';
import { extractZodFieldErrors } from '../../schemas/zodUtils';
import { parseApiError } from '../../services/apiClient';
import { useCustomerStore } from '../../store/useCustomerStore';
import { useToastStore } from '../../store/useToastStore';
import type { CustomerDto, FieldErrors } from '../../types/api';
import { FormInput } from '../ui/FormInput';
import { Modal } from '../ui/Modal';

interface CustomerFormModalProps {
  isOpen: boolean;
  editingCustomer: CustomerDto | null;
  onClose: () => void;
}

interface CustomerFormContentProps {
  editingCustomer: CustomerDto | null;
  onClose: () => void;
}

const CustomerFormContent: React.FC<CustomerFormContentProps> = ({
  editingCustomer,
  onClose,
}) => {
  const createCustomer = useCustomerStore((s) => s.createCustomer);
  const updateCustomer = useCustomerStore((s) => s.updateCustomer);

  const [formData, setFormData] = useState<CustomerDto>(() =>
    editingCustomer
      ? {
          firstName: editingCustomer.firstName,
          lastName: editingCustomer.lastName,
          email: editingCustomer.email,
          phone: editingCustomer.phone ?? '',
          address: editingCustomer.address ?? '',
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
        }
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // 1. Validación Frontend con Zod (customerSchema)
    const validation = customerSchema.safeParse(formData);
    if (!validation.success) {
      setFieldErrors(extractZodFieldErrors(validation.error));
      return;
    }

    setSubmitting(true);
    try {
      const payload: CustomerDto = {
        firstName: validation.data.firstName,
        lastName: validation.data.lastName,
        email: validation.data.email,
        phone: validation.data.phone || '',
        address: validation.data.address || '',
      };

      // 2. Envío al Backend (también validado con @Valid en CustomerController)
      if (editingCustomer?.id) {
        const updated = await updateCustomer(editingCustomer.id, payload);
        useToastStore
          .getState()
          .success(
            'Cliente actualizado',
            `${updated.firstName} ${updated.lastName} se ha actualizado correctamente.`
          );
      } else {
        const created = await createCustomer(payload);
        useToastStore
          .getState()
          .success(
            'Cliente creado',
            `${created.firstName} ${created.lastName} fue añadido al directorio.`
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
      useToastStore.getState().error('Error al guardar el cliente', parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="cust-firstName"
          label="Nombre (firstName) *"
          type="text"
          value={formData.firstName}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, firstName: e.target.value }));
            if (fieldErrors.firstName) setFieldErrors((prev) => ({ ...prev, firstName: '' }));
          }}
          placeholder="Ej. Carlos"
          error={fieldErrors.firstName}
        />

        <FormInput
          id="cust-lastName"
          label="Apellido (lastName) *"
          type="text"
          value={formData.lastName}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, lastName: e.target.value }));
            if (fieldErrors.lastName) setFieldErrors((prev) => ({ ...prev, lastName: '' }));
          }}
          placeholder="Ej. Mendoza"
          error={fieldErrors.lastName}
        />
      </div>

      <FormInput
        id="cust-email"
        label="Correo electrónico (email) *"
        type="email"
        value={formData.email}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, email: e.target.value }));
          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
        }}
        placeholder="cliente@empresa.com"
        error={fieldErrors.email}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="cust-phone"
          label="Teléfono (phone)"
          type="text"
          value={formData.phone ?? ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          placeholder="+34 600 123 456"
          error={fieldErrors.phone}
        />

        <FormInput
          id="cust-address"
          label="Dirección (address)"
          type="text"
          value={formData.address ?? ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          placeholder="Calle Mayor 12, Madrid"
          error={fieldErrors.address}
        />
      </div>

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
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          <span>{editingCustomer ? 'Guardar Cambios' : 'Crear Cliente'}</span>
        </button>
      </div>
    </form>
  );
};

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  editingCustomer,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCustomer ? `Editar Cliente #${editingCustomer.id}` : 'Nuevo Cliente'}
      subtitle="Validado en Frontend con Zod y en Backend con @Valid CustomerDto"
    >
      <CustomerFormContent
        key={`${editingCustomer?.id ?? 'new'}-${isOpen ? 'open' : 'closed'}`}
        editingCustomer={editingCustomer}
        onClose={onClose}
      />
    </Modal>
  );
};
