import { Eye, EyeOff, KeyRound, Loader2, Mail, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSchema } from '../../schemas/authSchema';
import { extractZodFieldErrors } from '../../schemas/zodUtils';
import { parseApiError } from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import type { FieldErrors } from '../../types/api';
import { FormInput } from '../ui/FormInput';

export const RegisterForm: React.FC = () => {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    // 1. Validación en Frontend con Zod (incluye refine de confirmPassword)
    const validation = registerSchema.safeParse({ email, password, confirmPassword });
    if (!validation.success) {
      setFieldErrors(extractZodFieldErrors(validation.error));
      return;
    }

    setLoading(true);
    try {
      // 2. Petición al Backend (también validada con @Valid en AuthController)
      const createdUser = await register({
        email: validation.data.email,
        password: validation.data.password,
      });
      useToastStore
        .getState()
        .success(
          '¡Cuenta creada con éxito!',
          `Registrado como ${createdUser.email} con rol ${createdUser.role}.`
        );
      navigate('/', { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors) {
        setFieldErrors(parsed.fieldErrors);
      } else {
        setGeneralError(parsed.message);
      }
      useToastStore.getState().error('No se pudo completar el registro', parsed.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {generalError ? (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs font-medium text-rose-600 dark:text-rose-400">
          {generalError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="reg-email"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
          }}
          placeholder="nuevo.usuario@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={fieldErrors.email}
        />

        <FormInput
          id="reg-password"
          label="Contraseña"
          hint="mínimo 6 caracteres"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
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

        <FormInput
          id="reg-confirm"
          label="Confirmar contraseña"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword)
              setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
          }}
          placeholder="Repite tu contraseña"
          leftIcon={<KeyRound className="w-4 h-4" />}
          error={fieldErrors.confirmPassword}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          <span>Registrarme y Entrar</span>
        </button>
      </form>
    </>
  );
};
