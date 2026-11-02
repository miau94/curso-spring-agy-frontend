import {
  Database,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { parseApiError } from '../services/apiClient';
import type { FieldErrors } from '../types/api';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const executeLogin = async (targetEmail: string, targetPassword: string) => {
    setFieldErrors({});
    setGeneralError(null);
    setLoading(true);

    try {
      const loggedUser = await login({
        email: targetEmail.trim(),
        password: targetPassword,
      });
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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 relative">
      {/* Top right theme switcher */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Cambiar tema claro/oscuro"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mx-auto mb-3">
            <Database className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Spring<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión de Clientes y Usuarios • Autenticación JWT HttpOnly
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Ingresa tus credenciales para obtener la cookie <code className="text-indigo-600 dark:text-indigo-400">jwt_token</code>
          </p>

          {generalError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs font-medium text-rose-600 dark:text-rose-400">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="admin@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border transition-colors focus:outline-none focus:ring-2 ${
                    fieldErrors.email
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs font-medium text-rose-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border transition-colors focus:outline-none focus:ring-2 ${
                    fieldErrors.password
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs font-medium text-rose-500">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Entrar al Panel</span>
            </button>
          </form>

          {/* Demo Quick Access Buttons (Paso 3.2) */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Acceso Rápido Demo (import.sql)</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin('admin@example.com')}
                className="flex flex-col items-start p-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/10 text-left transition-colors cursor-pointer disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Demo ADMIN
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate w-full mt-0.5">
                  admin@example.com
                </span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin('user@example.com')}
                className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-colors cursor-pointer disabled:opacity-50"
              >
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <UserIcon className="w-3.5 h-3.5" />
                  Demo USER
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate w-full mt-0.5">
                  user@example.com
                </span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Regístrate gratis (Rol USER)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
