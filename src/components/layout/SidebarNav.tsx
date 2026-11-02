import { LayoutDashboard, Lock, Shield, Users } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

interface SidebarNavProps {
  collapsed: boolean;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  collapsed,
  isMobile = false,
  onItemClick,
}) => {
  // rerender-derived-state: Suscripción exclusiva al booleano derivado
  const isAdmin = useAuthStore((s) => s.user?.role === 'ADMIN');

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
    }`;

  const showLabels = !collapsed || isMobile;

  return (
    <nav className="flex-1 px-3 py-4 space-y-1.5">
      <NavLink
        to="/"
        end
        onClick={onItemClick}
        className={navLinkClasses}
        title="Dashboard"
      >
        <LayoutDashboard className="w-5 h-5 shrink-0" />
        {showLabels ? <span>Dashboard</span> : null}
      </NavLink>

      <NavLink
        to="/customers"
        onClick={onItemClick}
        className={navLinkClasses}
        title="Clientes (/api/customers)"
      >
        <Users className="w-5 h-5 shrink-0" />
        {showLabels ? (
          <div className="flex items-center justify-between flex-1">
            <span>Clientes</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-[.bg-indigo-600]:bg-white/20 group-[.bg-indigo-600]:text-white">
              CRM
            </span>
          </div>
        ) : null}
      </NavLink>

      {isAdmin ? (
        <NavLink
          to="/users"
          onClick={onItemClick}
          className={navLinkClasses}
          title="Usuarios (/api/users)"
        >
          <Shield className="w-5 h-5 shrink-0" />
          {showLabels ? (
            <div className="flex items-center justify-between flex-1">
              <span>Usuarios</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 group-[.bg-indigo-600]:bg-white/20 group-[.bg-indigo-600]:text-white">
                ADMIN
              </span>
            </div>
          ) : null}
        </NavLink>
      ) : (
        <div
          title="Requiere rol ADMIN para gestionar usuarios (/api/users)"
          onClick={() =>
            // rerender-defer-reads: Leer acciones del store bajo demanda en el callback
            useToastStore
              .getState()
              .warning(
                'Módulo exclusivo para Administradores',
                'Inicia sesión con una cuenta ADMIN para gestionar usuarios (/api/users).'
              )
          }
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 cursor-not-allowed select-none"
        >
          <Lock className="w-5 h-5 shrink-0 text-amber-500/80" />
          {showLabels ? (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="truncate">Usuarios</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                ADMIN
              </span>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  );
};
