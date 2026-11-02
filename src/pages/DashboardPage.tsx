import {
  Activity,
  ArrowRight,
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
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-8 text-white shadow-lg shadow-indigo-600/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold mb-3">
              <span>Panel de Control Full-Stack</span>
              <span>•</span>
              <span>Spring Boot 4.1 + React 19 + Zustand + Zod</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ¡Hola, {user?.email.split('@')[0]}!
            </h1>
            <p className="text-sm text-indigo-100 mt-1 max-w-xl">
              Has iniciado sesión con rol <strong>{user?.role}</strong>.{' '}
              {isAdmin
                ? 'Tienes permisos de lectura y escritura completos sobre Clientes y Usuarios.'
                : 'Tienes acceso de lectura al directorio de Clientes (/api/customers).'}
            </p>
          </div>

          <button
            onClick={() => void handleManualRefresh()}
            disabled={refreshing}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Actualizar métricas</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clientes"
          icon={<Users className="w-5 h-5" />}
          iconContainerClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        >
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {loadingCustomers ? '...' : customers.length}
          </p>
          <Link
            to="/customers"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Ir a Clientes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </StatCard>

        <StatCard
          title="Usuarios del Sistema"
          icon={<Shield className="w-5 h-5" />}
          iconContainerClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        >
          {isAdmin ? (
            <>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                {refreshing ? '...' : users.length}
              </p>
              <Link
                to="/users"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Administrar Usuarios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-2.5 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                Solo Rol ADMIN
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Endpoint protegido <code className="text-[11px]">/api/users</code>
              </p>
            </>
          )}
        </StatCard>

        <StatCard
          title="Rol de Sesión Activa"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconContainerClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <div className="mt-2.5">{user && <RoleBadge role={user.role} size="md" />}</div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
            {user?.email}
          </p>
        </StatCard>

        <StatCard
          title="Estado Backend API"
          icon={<Activity className="w-5 h-5" />}
          iconContainerClass="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        >
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                healthStatus === 'UP'
                  ? 'bg-emerald-500 animate-pulse'
                  : healthStatus === 'LOADING'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
              }`}
            />
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {healthStatus === 'LOADING' ? 'Verificando...' : healthStatus}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            <code className="text-[11px]">GET /actuator/health</code>
          </p>
        </StatCard>
      </div>

      {/* Recent Customers & RBAC Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentCustomersList customers={customers} loading={loadingCustomers} />
        <RbacMatrixCard isAdmin={isAdmin} />
      </div>
    </div>
  );
};
