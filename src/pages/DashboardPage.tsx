import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Shield,
  Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RoleBadge } from '../components/ui/RoleBadge';
import { useAuth } from '../context/AuthContext';
import { actuatorService } from '../services/actuatorService';
import { customerService } from '../services/customerService';
import { userService } from '../services/userService';
import type { CustomerDto } from '../types/api';

export const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<'UP' | 'DOWN' | 'LOADING'>('LOADING');
  const [loadingData, setLoadingData] = useState(true);

  const loadDashboardMetrics = useCallback(async () => {
    setLoadingData(true);
    try {
      const [custResult, healthResult] = await Promise.allSettled([
        customerService.getAll(),
        actuatorService.getHealth(),
      ]);

      if (custResult.status === 'fulfilled') {
        setCustomers(custResult.value);
      }

      if (healthResult.status === 'fulfilled' && healthResult.value.status === 'UP') {
        setHealthStatus('UP');
      } else {
        setHealthStatus('DOWN');
      }

      if (isAdmin) {
        try {
          const usersList = await userService.getAll();
          setTotalUsers(usersList.length);
        } catch {
          setTotalUsers(null);
        }
      }
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    void loadDashboardMetrics();
  }, [loadDashboardMetrics]);

  const recentCustomers = customers.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-8 text-white shadow-lg shadow-indigo-600/15">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold mb-3">
              <span>Panel de Control Full-Stack</span>
              <span>•</span>
              <span>Spring Boot 4.1 + React 19</span>
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
            onClick={() => void loadDashboardMetrics()}
            disabled={loadingData}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Actualizar métricas</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Customers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Clientes
            </p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {loadingData ? '...' : customers.length}
            </p>
            <Link
              to="/customers"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Ir a Clientes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Users (ADMIN vs USER) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Usuarios del Sistema
            </p>
            {isAdmin ? (
              <>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                  {loadingData ? '...' : (totalUsers ?? '—')}
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
          </div>
          <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Active Role */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Rol de Sesión Activa
            </p>
            <div className="mt-2.5">{user && <RoleBadge role={user.role} size="md" />}</div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
              {user?.email}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Spring Boot Actuator Health */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Estado Backend API
            </p>
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
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Customers & RBAC Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Customers */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Clientes Recientes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Últimos registros obtenidos de <code className="text-[11px]">/api/customers</code>
              </p>
            </div>
            <Link
              to="/customers"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Ver todos ({customers.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loadingData ? (
              <div className="p-8 text-center text-sm text-slate-400">Cargando clientes...</div>
            ) : recentCustomers.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No hay clientes registrados actualmente.
              </div>
            ) : (
              recentCustomers.map((c) => (
                <div
                  key={c.id}
                  className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {c.firstName.charAt(0)}
                      {c.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {c.firstName} {c.lastName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3" />
                          {c.email}
                        </span>
                        {c.phone && (
                          <span className="hidden sm:inline-flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {c.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {c.address && (
                    <span className="hidden md:inline-flex items-center gap-1 text-xs text-slate-400 max-w-[180px] truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{c.address}</span>
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Matriz de Permisos SecurityConfig */}
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
      </div>
    </div>
  );
};
