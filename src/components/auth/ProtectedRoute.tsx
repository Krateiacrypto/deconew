import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { hasPermission, hasAnyPermission } from '../../utils/permissions';
import { User } from '../../types';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: User['role'][];
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAnyPermission?: boolean; // If true, user needs ANY of the permissions, if false, ALL
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
  requiredPermissions,
  requireAnyPermission = false,
  fallbackPath = '/login'
}) => {
  const { user, isAuthenticated, checkSession } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !user) {
          await checkSession();
        }
      } catch (error) {
        console.error('Session validation error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    validateSession();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAnyPermission
      ? hasAnyPermission(user, requiredPermissions)
      : requiredPermissions.every(permission => hasPermission(user, permission));

    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};