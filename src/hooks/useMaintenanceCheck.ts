import { useEffect } from 'react';
import { useMaintenanceStore } from '../store/maintenanceStore';
import { useAuthStore } from '../store/authStore';

export const useMaintenanceCheck = () => {
  const { isMaintenanceMode } = useMaintenanceStore();
  const { user, isAuthenticated } = useAuthStore();

  const canBypassMaintenance = () => {
    if (!isAuthenticated || !user) return false;
    return ['admin', 'superadmin'].includes(user.role);
  };

  const shouldShowMaintenance = isMaintenanceMode && !canBypassMaintenance();

  useEffect(() => {
    // Add maintenance mode indicator to document
    if (isMaintenanceMode) {
      document.body.classList.add('maintenance-mode');
      
      // Add visual indicator for admins
      if (canBypassMaintenance()) {
        const indicator = document.createElement('div');
        indicator.id = 'maintenance-indicator';
        indicator.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, #ef4444, #dc2626);
            color: white;
            padding: 8px 16px;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          ">
            🚧 BAKIM MODU AKTİF - Sadece adminler siteyi görebilir
          </div>
        `;
        document.body.appendChild(indicator);
        
        // Add top padding to body to account for indicator
        document.body.style.paddingTop = '40px';
      }
    } else {
      document.body.classList.remove('maintenance-mode');
      
      // Remove maintenance indicator
      const indicator = document.getElementById('maintenance-indicator');
      if (indicator) {
        indicator.remove();
        document.body.style.paddingTop = '';
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.classList.remove('maintenance-mode');
      const indicator = document.getElementById('maintenance-indicator');
      if (indicator) {
        indicator.remove();
        document.body.style.paddingTop = '';
      }
    };
  }, [isMaintenanceMode, canBypassMaintenance()]);

  return {
    isMaintenanceMode,
    shouldShowMaintenance,
    canBypassMaintenance: canBypassMaintenance()
  };
};