import { Database, Moon, Sun } from 'lucide-react';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export const LoginPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 relative">
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
        <div className="text-center mb-7">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mx-auto mb-3">
            <Database className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Spring<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión de Clientes y Usuarios • JWT HttpOnly + Zod + Zustand
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Iniciar Sesión</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Ingresa tus credenciales para obtener la cookie{' '}
            <code className="text-indigo-600 dark:text-indigo-400">jwt_token</code>
          </p>

          <LoginForm />

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
