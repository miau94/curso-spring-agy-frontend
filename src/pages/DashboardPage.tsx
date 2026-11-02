import {
  Activity,
  CheckCircle2,
  Lock,
  RefreshCw,
  Shield,
  Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RbacMatrixCard } from '../components/dashboard/RbacMatrixCard';
import { RecentCustomersList } from '../components/dashboard/RecentCustomersList';
import { StatCard } from '../components/dashboard/StatCard';
import { RoleBadge } from '../components/ui/RoleBadge';
import { actuatorService } from '../services/actuatorService';
import { useAuthStore } from '../store/useAuthStore';
import { useCustomerStore } from '../store/useCustomerStore';
import { useUserStore } from '../store/useUserStore';

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';

  const customers = useCustomerStore((s) => s.customers);
  const loadingCustomers = useCustomerStore((s) => s.loading);
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);

  const users = useUserStore((s) => s.users);
  const fetchUsers = useUserStore((s) => s.fetchUsers);

  const [healthStatus, setHealthStatus] = useState<'UP' | 'DOWN' | 'LOADING'>('LOADING');
  const [refreshing, setRefreshing] = useState(true);

  const runFetchMetrics = useCallback(async () => {
    const promises: Promise<unknown>[] = [
      fetchCustomers(),
      actuatorService
        .getHealth()
        .then((res) => setHealthStatus(res.status === 'UP' ? 'UP' : 'DOWN'))
        .catch(() => setHealthStatus('DOWN')),
    ];

    if (isAdmin) {
      promises.push(fetchUsers());
    }

    await Promise.allSettled(promises);
  }, [fetchCustomers, fetchUsers, isAdmin]);

  useEffect(() => {
    let active = true;
    void runFetchMetrics().finally(() => {
      if (active) setRefreshing(false);
    });
    return () => {
      active = false;
    };
  }, [runFetchMetrics]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await runFetchMetrics();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera Operativa */}
      <div className="rounded-2xl bg-white dark:bg-[#0F1623] border border-slate-200/85 dark:border-slate-800/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Sesión iniciada como {user?.email}
            </span>
            {user ? <RoleBadge role={user.role} /> : null}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Panel de operaciones
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {isAdmin
              ? 'Tienes control total para registrar, editar y eliminar clientes o administrar las cuentas de usuario del sistema.'
              : 'Estás en modo de consulta. Puedes explorar el directorio completo de clientes y ver sus fichas detalladas.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/customers"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-colors"
          >
            Abrir directorio de clientes
          </Link>
          <button
            onClick={() => void handleManualRefresh()}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sincronizar datos</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de métricas con números tabulares */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Clientes en el directorio"
          icon={<Users className="w-4 h-4" />}
          iconContainerClass="bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
        >
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {loadingCustomers ? '—' : customers.length}
          </p>
          <Link
            to="/customers"
            className="mt-2 inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Gestionar clientes
          </Link>
        </StatCard>

        <StatCard
          title="Cuentas de usuario"
          icon={<Shield className="w-4 h-4" />}
          iconContainerClass="bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400"
        >
          {isAdmin ? (
            <>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {refreshing ? '—' : users.length}
              </p>
              <Link
                to="/users"
                className="mt-2 inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Administrar accesos
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Restringido a Admin
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Requiere rol Administrador
              </p>
            </>
          )}
        </StatCard>

        <StatCard
          title="Nivel de autorización"
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconContainerClass="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        >
          <div className="mt-1">{user ? <RoleBadge role={user.role} size="md" /> : null}</div>
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            {isAdmin ? 'Lectura y escritura habilitadas' : 'Acceso en modo lectura'}
          </p>
        </StatCard>

        <StatCard
          title="Salud del servicio Spring"
          icon={<Activity className="w-4 h-4" />}
          iconContainerClass="bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400"
        >
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                healthStatus === 'UP'
                  ? 'bg-emerald-500'
                  : healthStatus === 'LOADING'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
              }`}
            />
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {healthStatus === 'LOADING' ? '...' : healthStatus}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            GET /actuator/health
          </p>
        </StatCard>
      </div>

      {/* Directorio Reciente y Matriz RBAC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentCustomersList customers={customers} loading={loadingCustomers} />
        <RbacMatrixCard isAdmin={isAdmin} />
      </div>
    </div>
  );
};
