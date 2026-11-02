import { Database, Moon, Sun, UserCheck } from 'lucide-react';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export const RegisterPage: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => Boolean(s.user));
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC] dark:bg-[#090D16]">
      {/* Columna izquierda */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 xl:p-12 bg-[#0B1120] text-white border-r border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight">SpringCRM</span>
          </div>

          <h1 className="mt-12 text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Alta inmediata con acceso de lectura.
          </h1>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-md">
            Al registrarte mediante <code className="text-indigo-300">POST /api/auth/register</code>
            , el servidor crea tu cuenta con contraseña encriptada en BCrypt, te asigna el rol
            estándar <strong>USER</strong> e inicia tu sesión automáticamente.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 my-8">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Permisos incluidos en tu cuenta USER</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>• Acceso al panel de métricas y estado del servidor en tiempo real.</li>
            <li>• Consulta y búsqueda en el directorio completo de clientes.</li>
            <li>• Visualización de fichas detalladas por cliente.</li>
          </ul>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80">
          <span>Registro público habilitado</span>
          <span className="font-mono">BCrypt + JWT</span>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-10 relative">
        <div className="absolute top-5 right-5">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cambiar tema claro u oscuro"
            aria-label="Cambiar tema visual"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">
              SpringCRM
            </span>
          </div>

          <div className="bg-white dark:bg-[#0F1623] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-slate-950/5 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Crear cuenta
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Completa tus datos para obtener acceso inmediato al directorio.
              </p>
            </div>

            <RegisterForm />

            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              ¿Ya tienes una cuenta registrada?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
