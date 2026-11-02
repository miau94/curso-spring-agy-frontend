import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH_UNAUTHORIZED_EVENT } from '../services/apiClient';
import { authService } from '../services/authService';
import type { AuthRequestDto, UserDto } from '../types/api';
import { useToastStore } from './useToastStore';

interface AuthState {
  user: UserDto | null;
  login: (credentials: AuthRequestDto) => Promise<UserDto>;
  register: (credentials: AuthRequestDto) => Promise<UserDto>;
  logout: () => Promise<void>;
  clearSession: () => void;
  updateCurrentUserIfMatches: (updatedUser: UserDto) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login: async (credentials) => {
        const loggedUser = await authService.login(credentials);
        set({ user: loggedUser });
        return loggedUser;
      },

      register: async (credentials) => {
        const createdUser = await authService.register(credentials);
        set({ user: createdUser });
        return createdUser;
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Incluso si falla la red, limpiamos el estado local
        } finally {
          set({ user: null });
        }
      },

      clearSession: () => {
        set({ user: null });
      },

      updateCurrentUserIfMatches: (updatedUser) => {
        const current = get().user;
        if (current && current.id === updatedUser.id) {
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'springcrm_user',
    }
  )
);

// Escucha global del evento 401 emitido por el interceptor de Axios
if (typeof window !== 'undefined') {
  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, () => {
    const { user, clearSession } = useAuthStore.getState();
    if (user) {
      clearSession();
      useToastStore
        .getState()
        .warning(
          'Sesión expirada o no autorizada',
          'Tu cookie JWT ha expirado o no es válida. Inicia sesión nuevamente.'
        );
    }
  });
}
