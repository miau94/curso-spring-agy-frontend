import { LayoutDashboard, Lock, Receipt, Shield, Users } from 'lucide-react';
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
  const isAdmin = useAuthStore((s) => s.user?.role === 'ADMIN');

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
    }`;

  const showLabels = !collapsed || isMobile;

  return (
    <nav className="flex-1 px-3 py-5 space-y-1.5">
      <NavLink to="/" end onClick={onItemClick} className={navLinkClasses} title="Resumen general">
        <LayoutDashboard className="w-4 h-4 shrink-0" />
        {showLabels ? <span>Resumen general</span> : null}
      </NavLink>

      <NavLink
        to="/customers"
        onClick={onItemClick}
        className={navLinkClasses}
        title="Directorio de clientes"
      >
        <Users className="w-4 h-4 shrink-0" />
        {showLabels ? (
          <div className="flex items-center justify-between flex-1">
            <span>Clientes</span>
            <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.bg-indigo-600]:bg-white/20 group-[.bg-indigo-600]:text-white">
              CRM
            </span>
          </div>
        ) : null}
      </NavLink>

      <NavLink
        to="/invoices"
        onClick={onItemClick}
        className={navLinkClasses}
        title="Gestión de facturación"
      >
        <Receipt className="w-4 h-4 shrink-0" />
        {showLabels ? (
          <div className="flex items-center justify-between flex-1">
            <span>Facturas</span>
            <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.bg-indigo-600]:bg-white/20 group-[.bg-indigo-600]:text-white">
              ERP
            </span>
          </div>
        ) : null}
      </NavLink>

      {isAdmin ? (
        <NavLink
          to="/users"
          onClick={onItemClick}
          className={navLinkClasses}
          title="Control de usuarios"
        >
          <Shield className="w-4 h-4 shrink-0" />
          {showLabels ? (
            <div className="flex items-center justify-between flex-1">
              <span>Usuarios y roles</span>
              <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 group-[.bg-indigo-600]:bg-white/20 group-[.bg-indigo-600]:text-white">
                ADMIN
              </span>
            </div>
          ) : null}
        </NavLink>
      ) : (
        <div
          title="Requiere permisos de Administrador para gestionar usuarios (/api/users)"
          onClick={() =>
            useToastStore
              .getState()
              .warning(
                'Acceso exclusivo para Administradores',
                'Cambia a una cuenta con rol Administrador para gestionar usuarios.'
              )
          }
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 cursor-not-allowed select-none"
        >
          <Lock className="w-4 h-4 shrink-0 text-amber-500/80" />
          {showLabels ? (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="truncate">Usuarios y roles</span>
              <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                ADMIN
              </span>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  );
};
