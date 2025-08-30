import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../utils/permissions';
import { AlertTriangle, Lock } from 'lucide-react';

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback,
  showMessage = false
}) => {
  const { user } = useAuthStore();

  if (!user || !hasPermission(user, permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showMessage) {
      return (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erişim Kısıtlı</h3>
            <p className="text-gray-600">Bu işlem için yetkiniz bulunmamaktadır.</p>
          </div>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
};