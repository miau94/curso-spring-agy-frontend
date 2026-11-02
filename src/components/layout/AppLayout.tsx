import {
  ChevronLeft,
  ChevronRight,
  Database,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Moon,
  Shield,
  Sun,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { RoleBadge } from '../ui/RoleBadge';

export const AppLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info('Sesión cerrada', 'Se ha eliminado la cookie JWT de forma segura.');
    navigate('/login', { replace: true });
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
    }`;

  const renderNavigation = (isMobile = false) => (
    <nav className="flex-1 px-3 py-4 space-y-1.5">
      <NavLink
        to="/"
        end
        onClick={() => isMobile && setMobileOpen(false)}
        className={navLinkClasses}
        title="Dashboard"
      >
        <LayoutDashboard className="w-5 h-5 shrink-0" />
        {(!collapsed || isMobile) && <span>Dashboard</span>}
      </NavLink>

      <NavLink
        to="/customers"
        onClick={() => isMobile && setMobileOpen(false)}
        className={navLinkClasses}
        title="Clientes (/api/customers)"
      >
        <Users className="w-5 h-5 shrink-0" />
        {(!collapsed || isMobile) && (
          <div className="flex items-center justify-between flex-1">
            <span>Clientes</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-[.bg-indigo-600]:bg-white/20 group-[.bg-indigo-600]:text-white">
              CRM
            </span>
          </div>
        )}
      </NavLink>

      {/* Enlace a Usuarios (/users): Si es USER se muestra deshabilitado con candado tal como se eligió en el Wizard (Paso 3.3) */}
      {isAdmin ? (
        <NavLink
          to="/users"
          onClick={() => isMobile && setMobileOpen(false)}
          className={navLinkClasses}
          title="Usuarios (/api/users)"
        >
          <Shield className="w-5 h-5 shrink-0" />
          {(!collapsed || isMobile) && (
            <div className="flex items-center justify-between flex-1">
              <span>Usuarios</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 group-[.bg-indigo-600]:bg-white/20 group-[.bg-indigo-600]:text-white">
                ADMIN
              </span>
            </div>
          )}
        </NavLink>
      ) : (
        <div
          title="Requiere rol ADMIN para gestionar usuarios (/api/users)"
          onClick={() =>
            toast.warning(
              'Módulo exclusivo para Administradores',
              'Inicia sesión con una cuenta ADMIN para gestionar usuarios (/api/users).'
            )
          }
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 cursor-not-allowed select-none"
        >
          <Lock className="w-5 h-5 shrink-0 text-amber-500/80" />
          {(!collapsed || isMobile) && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="truncate">Usuarios</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                ADMIN
              </span>
            </div>
          )}
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-300 shrink-0 ${
          collapsed ? 'w-20' : 'w-68'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  Spring<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
                </span>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Spring Boot 4 + React 19
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {renderNavigation(false)}

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          {!collapsed ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sesión JWT Cookie
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Cookie <code className="text-indigo-600 dark:text-indigo-400">jwt_token</code> (HttpOnly)
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-2" title="Sesión JWT HttpOnly activa">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          )}
        </div>
      </aside>

      {/* Sidebar Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-10">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  Spring<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNavigation(true)}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                3-spring-api
              </span>
              <span>•</span>
              <span>Acceso basado en roles (RBAC)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Cambiar tema de color"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* User Profile Pill */}
            {user && (
              <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs uppercase">
                  {user.email.slice(0, 2)}
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 max-w-[160px] truncate">
                    {user.email}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">ID #{user.id}</p>
                </div>
                <RoleBadge role={user.role} />
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              title="Cerrar sesión (POST /api/auth/logout)"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
