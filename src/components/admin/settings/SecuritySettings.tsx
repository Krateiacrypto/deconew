import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity
} from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import toast from 'react-hot-toast';

export const SecuritySettings: React.FC = () => {
  const [securityConfig, setSecurityConfig] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    sessionTimeout: 3600, // seconds
    maxLoginAttempts: 5,
    lockoutDuration: 900, // seconds
    enableRateLimiting: true,
    rateLimitRequests: 100,
    rateLimitWindow: 900, // seconds
    enableAuditLog: true,
    enableSecurityHeaders: true,
    enableCORS: true,
    allowedOrigins: ['https://decarbonize.world', 'http://localhost:5173']
  });

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'User Login', user: 'admin@decarbonize.world', ip: '192.168.1.1', timestamp: '2024-01-20 14:30:00', status: 'success' },
    { id: 2, action: 'Failed Login', user: 'unknown@example.com', ip: '192.168.1.100', timestamp: '2024-01-20 14:25:00', status: 'failed' },
    { id: 3, action: 'Password Change', user: 'user@decarbonize.world', ip: '192.168.1.50', timestamp: '2024-01-20 13:15:00', status: 'success' },
    { id: 4, action: 'Admin Access', user: 'admin@decarbonize.world', ip: '192.168.1.1', timestamp: '2024-01-20 12:00:00', status: 'success' }
  ]);

  const handleSave = () => {
    localStorage.setItem('security-settings', JSON.stringify(securityConfig));
    toast.success('Güvenlik ayarları kaydedildi!');
  };

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Şifre Politikaları"
        description="Kullanıcı şifre gereksinimleri"
        icon={Lock}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Şifre Uzunluğu: {securityConfig.passwordMinLength}
            </label>
            <input
              type="range"
              min="6"
              max="20"
              value={securityConfig.passwordMinLength}
              onChange={(e) => setSecurityConfig(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Büyük harf zorunlu</span>
              <button
                onClick={() => setSecurityConfig(prev => ({ ...prev, passwordRequireUppercase: !prev.passwordRequireUppercase }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  securityConfig.passwordRequireUppercase ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  securityConfig.passwordRequireUppercase ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Küçük harf zorunlu</span>
              <button
                onClick={() => setSecurityConfig(prev => ({ ...prev, passwordRequireLowercase: !prev.passwordRequireLowercase }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  securityConfig.passwordRequireLowercase ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  securityConfig.passwordRequireLowercase ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Rakam zorunlu</span>
              <button
                onClick={() => setSecurityConfig(prev => ({ ...prev, passwordRequireNumbers: !prev.passwordRequireNumbers }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  securityConfig.passwordRequireNumbers ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  securityConfig.passwordRequireNumbers ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Özel karakter zorunlu</span>
              <button
                onClick={() => setSecurityConfig(prev => ({ ...prev, passwordRequireSymbols: !prev.passwordRequireSymbols }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  securityConfig.passwordRequireSymbols ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  securityConfig.passwordRequireSymbols ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Oturum Güvenliği"
        description="Oturum yönetimi ve erişim kontrolü"
        icon={Key}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oturum Süresi (dakika): {Math.floor(securityConfig.sessionTimeout / 60)}
            </label>
            <input
              type="range"
              min="15"
              max="480"
              step="15"
              value={securityConfig.sessionTimeout / 60}
              onChange={(e) => setSecurityConfig(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) * 60 }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Giriş Denemesi: {securityConfig.maxLoginAttempts}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={securityConfig.maxLoginAttempts}
              onChange={(e) => setSecurityConfig(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Güvenlik Logları"
        description="Son güvenlik olayları"
        icon={Activity}
      >
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getLogStatusIcon(log.status)}
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-600">{log.user} - {log.ip}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Shield className="w-5 h-5" />
          <span>Güvenlik Ayarlarını Kaydet</span>
        </button>
      </div>
    </div>
  );
};