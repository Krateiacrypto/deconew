import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { hasPermission, hasAnyPermission } from '../../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
  allowedRoles?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  allowedRoles = [],
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, user } = useAuthStore();

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Rol kontrolü
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Tek izin kontrolü
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Çoklu izin kontrolü
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll 
      ? requiredPermissions.every(permission => hasPermission(user, permission))
      : hasAnyPermission(user, requiredPermissions);
    
    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};