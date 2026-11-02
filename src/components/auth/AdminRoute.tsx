import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminRoute: React.FC = () => {
  const { isAdmin, user } = useAuth();

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Acceso restringido a Administradores
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Tu cuenta actual (<span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>) tiene el rol{' '}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {user?.role}
          </span>
          . El módulo de Gestión de Usuarios (<code className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">/api/users</code>) requiere rol{' '}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">ADMIN</span>.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            Ver Clientes
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
