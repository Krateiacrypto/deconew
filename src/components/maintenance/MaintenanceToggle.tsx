import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import toast from 'react-hot-toast';

export const MaintenanceToggle: React.FC = () => {
  const { isMaintenanceMode, toggleMaintenanceMode } = useMaintenanceStore();

  const handleToggle = () => {
    const newState = !isMaintenanceMode;
    toggleMaintenanceMode();
    
    if (newState) {
      toast.success('Bakım modu aktif edildi! Site artık bakım sayfasını gösteriyor.');
    } else {
      toast.success('Bakım modu deaktif edildi! Site normal çalışmaya devam ediyor.');
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
      isMaintenanceMode 
        ? 'bg-red-50 border-red-200 shadow-lg' 
        : 'bg-emerald-50 border-emerald-200'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isMaintenanceMode ? 'bg-red-100' : 'bg-emerald-100'
        }`}>
          {isMaintenanceMode ? (
            <AlertTriangle className="w-6 h-6 text-red-600" />
          ) : (
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          )}
        </div>
        <div>
          <h4 className={`font-medium ${isMaintenanceMode ? 'text-red-900' : 'text-emerald-900'}`}>
            Bakım Modu
          </h4>
          <p className={`text-sm ${isMaintenanceMode ? 'text-red-700' : 'text-emerald-700'}`}>
            {isMaintenanceMode 
              ? 'Platform bakım modunda - Sadece adminler erişebilir' 
              : 'Platform normal çalışıyor - Tüm kullanıcılar erişebilir'
            }
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${
              isMaintenanceMode ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
            }`} />
            <span className={`text-xs font-medium ${
              isMaintenanceMode ? 'text-red-800' : 'text-emerald-800'
            }`}>
              {isMaintenanceMode ? 'BAKIM MODU AKTİF' : 'SİTE AKTİF'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {isMaintenanceMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => window.open('/', '_blank')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Bakım sayfasını önizle"
          >
            <Eye className="w-4 h-4" />
            <span>Önizle</span>
          </motion.button>
        )}
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isMaintenanceMode}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className={`w-14 h-8 rounded-full peer transition-all duration-300 ${
            isMaintenanceMode 
              ? 'bg-red-600 peer-focus:ring-4 peer-focus:ring-red-300' 
              : 'bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300'
          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all ${
            isMaintenanceMode ? 'peer-checked:bg-red-600' : 'peer-checked:bg-emerald-600'
          }`}>
          </div>
        </label>
      </div>
    </div>
  );
};