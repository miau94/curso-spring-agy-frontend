import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useToastStore } from '../../store/useToastStore';
import { RoleBadge } from '../ui/RoleBadge';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

const routeTitles: Record<string, { section: string; endpoint: string }> = {
  '/': { section: 'Consola de operaciones', endpoint: '/actuator/health' },
  '/customers': { section: 'Directorio de clientes', endpoint: '/api/customers' },
  '/invoices': { section: 'Gestión de facturación', endpoint: '/api/invoices' },
  '/users': { section: 'Control de accesos y usuarios', endpoint: '/api/users' },
};

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const navigate = useNavigate();
  const location = useLocation();

  const currentMeta = routeTitles[location.pathname] ?? routeTitles['/'];

  const handleLogout = async () => {
    await logout();
    useToastStore
      .getState()
      .info('Sesión finalizada', 'La cookie de sesión se ha limpiado del navegador.');
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/85 dark:bg-[#0F1623]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Abrir navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {currentMeta.section}
          </span>
          <code className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
            {currentMeta.endpoint}
          </code>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          aria-label="Cambiar tema visual"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {user.email.slice(0, 2)}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 max-w-[160px] truncate">
                {user.email}
              </p>
              <p className="font-mono text-[10px] text-slate-400 tabular-nums">ID #{user.id}</p>
            </div>
            <RoleBadge role={user.role} />
          </div>
        ) : null}

        <button
          onClick={() => void handleLogout()}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-200/90 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-500/30 transition-all cursor-pointer"
          title="Cerrar sesión activa (POST /api/auth/logout)"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};
