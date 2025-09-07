import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Shield, 
  Activity, 
  Settings as SettingsIcon,
  CheckCircle,
  XCircle,
  Calendar,
  Zap
} from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import toast from 'react-hot-toast';

export const MaintenanceSettings: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [scheduledMaintenance, setScheduledMaintenance] = useState({
    enabled: false,
    startDate: '',
    endDate: '',
    message: 'Sistem bakımı nedeniyle geçici olarak hizmet dışıdır.'
  });
  const [debugMode, setDebugMode] = useState(false);
  const [logLevel, setLogLevel] = useState('info');

  const systemServices = [
    { name: 'Web Server', status: 'active', uptime: '99.9%', lastCheck: '2 dakika önce' },
    { name: 'Database', status: 'active', uptime: '99.8%', lastCheck: '1 dakika önce' },
    { name: 'API Gateway', status: 'active', uptime: '99.7%', lastCheck: '30 saniye önce' },
    { name: 'Cache Server', status: 'warning', uptime: '98.5%', lastCheck: '5 dakika önce' },
    { name: 'File Storage', status: 'active', uptime: '99.9%', lastCheck: '1 dakika önce' },
    { name: 'Email Service', status: 'active', uptime: '99.6%', lastCheck: '3 dakika önce' }
  ];

  const handleMaintenanceToggle = () => {
    setMaintenanceMode(!maintenanceMode);
    toast.success(`Bakım modu ${!maintenanceMode ? 'aktif' : 'pasif'} edildi!`);
  };

  const handleScheduledMaintenanceToggle = () => {
    setScheduledMaintenance(prev => ({ ...prev, enabled: !prev.enabled }));
    toast.success(`Planlı bakım ${!scheduledMaintenance.enabled ? 'aktif' : 'pasif'} edildi!`);
  };

  const handleEmergencyMaintenance = () => {
    if (window.confirm('Acil bakım modunu aktif etmek istediğinizden emin misiniz? Bu işlem tüm kullanıcıları sistemden çıkaracaktır.')) {
      setMaintenanceMode(true);
      toast.success('Acil bakım modu aktif edildi!');
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Mode */}
      <SettingsCard
        title="Bakım Modu"
        description="Sistem bakımı ve kullanıcı erişim kontrolü"
        icon={AlertTriangle}
      >
        <div className="space-y-6">
          {/* Current Status */}
          <div className={`p-4 rounded-lg border-2 ${
            maintenanceMode ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {maintenanceMode ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                )}
                <div>
                  <h4 className={`font-medium ${maintenanceMode ? 'text-red-900' : 'text-emerald-900'}`}>
                    {maintenanceMode ? 'Bakım Modu Aktif' : 'Sistem Normal Çalışıyor'}
                  </h4>
                  <p className={`text-sm ${maintenanceMode ? 'text-red-700' : 'text-emerald-700'}`}>
                    {maintenanceMode 
                      ? 'Kullanıcılar sisteme erişemiyor' 
                      : 'Tüm servisler normal çalışıyor'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleMaintenanceToggle}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  maintenanceMode
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {maintenanceMode ? 'Bakımı Bitir' : 'Bakım Moduna Al'}
              </button>
            </div>
          </div>

          {/* Emergency Maintenance */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-orange-900 mb-1">Acil Bakım</h4>
                <p className="text-sm text-orange-700">
                  Kritik sorunlar için anında bakım modu
                </p>
              </div>
              <button
                onClick={handleEmergencyMaintenance}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Acil Bakım
              </button>
            </div>
          </div>

          {/* Scheduled Maintenance */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Planlı Bakım</h4>
                <p className="text-sm text-blue-700">
                  Önceden planlanmış bakım penceresi
                </p>
              </div>
              <button
                onClick={handleScheduledMaintenanceToggle}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  scheduledMaintenance.enabled
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {scheduledMaintenance.enabled ? 'İptal Et' : 'Planla'}
              </button>
            </div>

            {scheduledMaintenance.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Başlangıç</label>
                  <input
                    type="datetime-local"
                    value={scheduledMaintenance.startDate}
                    onChange={(e) => setScheduledMaintenance(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Bitiş</label>
                  <input
                    type="datetime-local"
                    value={scheduledMaintenance.endDate}
                    onChange={(e) => setScheduledMaintenance(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-blue-700 mb-1">Bakım Mesajı</label>
                  <textarea
                    value={scheduledMaintenance.message}
                    onChange={(e) => setScheduledMaintenance(prev => ({ ...prev, message: e.target.value }))}
                    rows={2}
                    className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </SettingsCard>

      {/* System Health */}
      <SettingsCard
        title="Sistem Sağlığı"
        description="Servis durumları ve performans metrikleri"
        icon={Activity}
      >
        <div className="space-y-3">
          {systemServices.map((service, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getServiceStatusColor(service.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getServiceStatusIcon(service.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">Son kontrol: {service.lastCheck}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{service.uptime}</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Debug Settings */}
      <SettingsCard
        title="Debug Ayarları"
        description="Geliştirici araçları ve log seviyeleri"
        icon={SettingsIcon}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Debug Modu</h4>
              <p className="text-sm text-gray-600">Detaylı hata logları ve debug bilgileri</p>
            </div>
            <button
              onClick={() => {
                setDebugMode(!debugMode);
                toast.success(`Debug modu ${!debugMode ? 'aktif' : 'pasif'} edildi!`);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                debugMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {debugMode ? 'Kapat' : 'Aç'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Seviyesi</label>
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="error">Error - Sadece hatalar</option>
              <option value="warn">Warning - Hatalar ve uyarılar</option>
              <option value="info">Info - Genel bilgiler</option>
              <option value="debug">Debug - Tüm detaylar</option>
            </select>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};