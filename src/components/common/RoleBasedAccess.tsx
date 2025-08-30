import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { hasPermission, hasAnyPermission, canAccessData } from '../../utils/permissions';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
  allowedRoles?: string[];
  dataOwnerId?: string;
  fallback?: React.ReactNode;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  allowedRoles = [],
  dataOwnerId,
  fallback = null
}) => {
  const { user } = useAuthStore();

  // Kullanıcı giriş yapmamışsa fallback göster
  if (!user) {
    return <>{fallback}</>;
  }

  // Rol kontrolü
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  // Tek izin kontrolü
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <>{fallback}</>;
  }

  // Çoklu izin kontrolü
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll 
      ? requiredPermissions.every(permission => hasPermission(user, permission))
      : hasAnyPermission(user, requiredPermissions);
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  // Veri erişim kontrolü
  if (dataOwnerId && !canAccessData(user, dataOwnerId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};