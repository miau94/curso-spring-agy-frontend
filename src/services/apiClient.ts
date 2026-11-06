import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import type { ErrorResponse, FieldErrors, ParsedApiError } from '../types/api';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Extrae y normaliza los errores devueltos por GlobalExceptionHandler de Spring Boot:
 * - 400 @Valid (MethodArgumentNotValidException): Map<String, String> con errores por campo.
 * - 400/401/403/404/500 (ErrorResponse): { status, error, message, path, timestamp }.
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ErrorResponse | FieldErrors>;
    const status = axiosErr.response?.status ?? 500;
    const data = axiosErr.response?.data;

    if (data && typeof data === 'object') {
      // Caso 1: ErrorResponse estándar de GlobalExceptionHandler
      if ('message' in data && 'status' in data && typeof data.message === 'string') {
        return {
          status,
          message: data.message,
        };
      }

      // Caso 2: Mapa de errores de validación @Valid { campo: mensaje }
      const fieldErrors: FieldErrors = {};
      let hasFieldErrors = false;
      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string' && !['status', 'error', 'path', 'timestamp'].includes(key)) {
          fieldErrors[key] = val;
          hasFieldErrors = true;
        }
      }

      if (hasFieldErrors) {
        return {
          status,
          message: 'Por favor, revisa los campos marcados en el formulario.',
          fieldErrors,
        };
      }
    }

    if (status === 401) {
      return {
        status,
        message: 'Credenciales inválidas o sesión expirada.',
      };
    }

    if (status === 403) {
      return {
        status,
        message: 'Acceso denegado: Se requieren permisos de Administrador (ADMIN).',
      };
    }

    return {
      status,
      message: axiosErr.message || 'Error de conexión con el servidor Spring Boot.',
    };
  }

  return {
    status: 500,
    message: error instanceof Error ? error.message : 'Error inesperado.',
  };
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';

    // Si el backend responde 401 en una ruta protegida, limpiamos la sesión local
    const loginPath = `${API_CONFIG.AUTH}/login`;
    const registerPath = `${API_CONFIG.AUTH}/register`;
    if (status === 401 && !requestUrl.includes(loginPath) && !requestUrl.includes(registerPath)) {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  }
);
