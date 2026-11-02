import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const ProtectedRoute: React.FC = () => {
  // rerender-derived-state: Suscribirse a un booleano primitivo derivado
  const isAuthenticated = useAuthStore((s) => Boolean(s.user));
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
