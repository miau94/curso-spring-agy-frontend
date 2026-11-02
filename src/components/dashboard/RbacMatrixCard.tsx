import { Check, Lock } from 'lucide-react';
import React from 'react';

interface RbacMatrixCardProps {
  isAdmin: boolean;
}

export const RbacMatrixCard: React.FC<RbacMatrixCardProps> = ({ isAdmin }) => {
  const rules = [
    {
      endpoint: 'GET /api/customers/**',
      description: 'Lectura del directorio y fichas de clientes',
      allowed: true,
    },
    {
      endpoint: 'POST · PUT · DELETE /api/customers',
      description: 'Alta, edición y baja de clientes',
      allowed: isAdmin,
    },
    {
      endpoint: 'ALL /api/users/**',
      description: 'Gestión de usuarios, roles y contraseñas BCrypt',
      allowed: isAdmin,
    },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0F1623] border border-slate-200/85 dark:border-slate-800/90 shadow-xs p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Permisos de tu sesión actual
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
          Políticas aplicadas por <code className="font-mono text-[11px]">SecurityConfig.java</code>
        </p>

        <div className="space-y-2.5 text-xs">
          {rules.map((r) => (
            <div
              key={r.endpoint}
              className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800"
            >
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  {r.endpoint}
                </code>
                {r.allowed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                    <Check className="w-3 h-3" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                    <Lock className="w-3 h-3" />
                    Solo Admin
                  </span>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
