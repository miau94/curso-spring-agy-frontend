/**
 * Configuración centralizada de las rutas base del backend obtenidas desde variables de entorno (.env).
 * Se proveen valores por defecto en caso de no estar definidas en el entorno.
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
  AUTH: import.meta.env.VITE_AUTH_BASE_URL ?? '/api/auth',
  CUSTOMERS: import.meta.env.VITE_CUSTOMERS_BASE_URL ?? '/api/customers',
  INVOICES: import.meta.env.VITE_INVOICES_BASE_URL ?? '/api/invoices',
  USERS: import.meta.env.VITE_USERS_BASE_URL ?? '/api/users',
  ACTUATOR: import.meta.env.VITE_ACTUATOR_BASE_URL ?? '/actuator',
} as const;
