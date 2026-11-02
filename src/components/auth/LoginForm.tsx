import { Eye, EyeOff, KeyRound, Loader2, LogIn, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../schemas/authSchema';
import { extractZodFieldErrors } from '../../schemas/zodUtils';
import { parseApiError } from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import type { FieldErrors } from '../../types/api';
import { FormInput } from '../ui/FormInput';
import { DemoAccessButtons } from './DemoAccessButtons';

export const LoginForm: React.FC = () => {
  const login = useAuthStore((s) => s.login);
  const toast = useToastStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const executeLogin = async (rawEmail: string, rawPassword: string) => {
    setFieldErrors({});
    setGeneralError(null);

    // 1. Validación en Frontend con Zod
    const validation = loginSchema.safeParse({ email: rawEmail, password: rawPassword });
    if (!validation.success) {
      setFieldErrors(extractZodFieldErrors(validation.error));
      return;
    }

    setLoading(true);
    try {
      // 2. Petición al Backend (también validada con @Valid en AuthController)
      const loggedUser = await login(validation.data);
      toast.success(
        `¡Bienvenido, ${loggedUser.email}!`,
        `Has iniciado sesión con rol ${loggedUser.role} (Cookie jwt_token activa).`
      );
      navigate('/', { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      if (parsed.fieldErrors) {
        setFieldErrors(parsed.fieldErrors);
      } else {
        setGeneralError(parsed.message);
      }
      toast.error('Error al iniciar sesión', parsed.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleDemoLogin = async (demoEmail: string) => {
    const demoPass = 'password123';
    setEmail(demoEmail);
    setPassword(demoPass);
    await executeLogin(demoEmail, demoPass);
  };

  return (
    <>
      {generalError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs font-medium text-rose-600 dark:text-rose-400">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          id="login-email"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
          }}
          placeholder="admin@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={fieldErrors.email}
        />

        <FormInput
          id="login-password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
          }}
          placeholder="••••••••"
          leftIcon={<KeyRound className="w-4 h-4" />}
          error={fieldErrors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Mostrar u ocultar contraseña"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          <span>Entrar al Panel</span>
        </button>
      </form>

      <DemoAccessButtons disabled={loading} onSelectDemoUser={(em) => void handleDemoLogin(em)} />
    </>
  );
};
