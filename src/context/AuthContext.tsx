import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AUTH_UNAUTHORIZED_EVENT } from '../services/apiClient';
import { authService } from '../services/authService';
import type { AuthRequestDto, UserDto } from '../types/api';
import { useToast } from './ToastContext';

interface AuthContextValue {
  user: UserDto | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: AuthRequestDto) => Promise<UserDto>;
  register: (credentials: AuthRequestDto) => Promise<UserDto>;
  logout: () => Promise<void>;
  updateCurrentUserIfMatches: (updatedUser: UserDto) => void;
}

const USER_STORAGE_KEY = 'springcrm_user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const [user, setUser] = useState<UserDto | null>(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserDto;
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });

  const saveUser = useCallback((nextUser: UserDto | null) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (user) {
        saveUser(null);
        toast.warning(
          'Sesión expirada o no autorizada',
          'Tu cookie JWT ha expirado o no es válida. Inicia sesión nuevamente.'
        );
      }
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [user, saveUser, toast]);

  const login = useCallback(
    async (credentials: AuthRequestDto): Promise<UserDto> => {
      const loggedUser = await authService.login(credentials);
      saveUser(loggedUser);
      return loggedUser;
    },
    [saveUser]
  );

  const register = useCallback(
    async (credentials: AuthRequestDto): Promise<UserDto> => {
      const createdUser = await authService.register(credentials);
      saveUser(createdUser);
      return createdUser;
    },
    [saveUser]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // Incluso si falla la red, limpiamos el estado local
    } finally {
      saveUser(null);
    }
  }, [saveUser]);

  const updateCurrentUserIfMatches = useCallback(
    (updatedUser: UserDto) => {
      if (user && user.id === updatedUser.id) {
        saveUser(updatedUser);
      }
    },
    [user, saveUser]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateCurrentUserIfMatches,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return ctx;
}
