import React from 'react';

interface RbacMatrixCardProps {
  isAdmin: boolean;
}

export const RbacMatrixCard: React.FC<RbacMatrixCardProps> = ({ isAdmin }) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6">
      <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        Matriz de Seguridad RBAC
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Reglas activas en <code className="text-[11px]">SecurityConfig.java</code>
      </p>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
            <span>GET /api/customers/**</span>
            <span className="text-emerald-600 dark:text-emerald-400">Permitido</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Accesible para roles <strong>USER</strong> y <strong>ADMIN</strong>.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
            <span>POST / PUT / DELETE /api/customers</span>
            <span
              className={
                isAdmin
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }
            >
              {isAdmin ? 'Permitido' : 'Solo ADMIN'}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Creación, edición y borrado de clientes restringido a <strong>ADMIN</strong>.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
            <span>ALL /api/users/**</span>
            <span
              className={
                isAdmin
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }
            >
              {isAdmin ? 'Permitido' : 'Solo ADMIN'}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Administración completa de usuarios y contraseñas BCrypt.
          </p>
        </div>
      </div>
    </div>
  );
};
