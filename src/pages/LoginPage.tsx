import { CheckCircle2, Database, Lock, Moon, Shield, Sun } from 'lucide-react';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export const LoginPage: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => Boolean(s.user));
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC] dark:bg-[#090D16]">
      {/* Columna izquierda: Panel de contexto arquitectónico */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 xl:p-12 bg-[#0B1120] text-white border-r border-slate-800/80 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Database className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight">SpringCRM</span>
          </div>

          <h1 className="mt-12 text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Consola de clientes y control de accesos.
          </h1>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-md">
            Interfaz operativa conectada a Spring Boot 4.1 mediante tokens JWT almacenados en cookies
            HttpOnly y validación sincronizada en cliente y servidor.
          </p>
        </div>

        <div className="space-y-3 my-8">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Sesión Stateless con Cookie HttpOnly</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              El backend emite <code className="text-indigo-300">jwt_token</code> al autenticar,
              protegiendo la credencial frente a lecturas por JavaScript.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Autorización por Roles (RBAC)</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              El rol <strong>USER</strong> consulta el directorio de clientes; el rol{' '}
              <strong>ADMIN</strong> gestiona clientes, usuarios y credenciales BCrypt.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>Validación Doble (Zod + Jakarta @Valid)</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Los esquemas de cliente previenen envíos incompletos y mapean cualquier rechazo del
              servidor directamente en cada campo.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80">
          <span>3-spring-api + 4-react-app</span>
          <span className="font-mono">Puerto 8080 / 5173</span>
        </div>
      </div>

      {/* Columna derecha: Formulario de acceso */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-10 relative">
        <div className="absolute top-5 right-5 flex items-center gap-2">
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
                Iniciar sesión
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Introduce tu correo y contraseña o selecciona una cuenta de prueba.
              </p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              ¿Necesitas una cuenta nueva?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Crear cuenta estándar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
