import React, { useEffect } from 'react';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import { useAuthStore } from '../../store/authStore';
import { MaintenancePage } from './MaintenancePage';

interface MaintenanceProviderProps {
  children: React.ReactNode;
}

export const MaintenanceProvider: React.FC<MaintenanceProviderProps> = ({ children }) => {
  const { isMaintenanceMode } = useMaintenanceStore();
  const { user, isAuthenticated } = useAuthStore();

  // Check if user can bypass maintenance mode
  const canBypassMaintenance = () => {
    if (!isAuthenticated || !user) return false;
    return ['admin', 'superadmin'].includes(user.role);
  };

  // Show maintenance page if maintenance mode is active and user cannot bypass
  if (isMaintenanceMode && !canBypassMaintenance()) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
};