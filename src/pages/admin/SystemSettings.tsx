import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  Globe, 
  Bell, 
  Database,
  Key,
  Mail,
  Server,
  Save,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const SystemSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      platformName: 'DECARBONIZE.world',
      platformDescription: 'Global CO₂ Token Platform',
      supportEmail: 'support@decarbonize.world',
      maintenanceMode: false,
      registrationEnabled: true,
      kycRequired: true
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      ipWhitelist: '',
      apiRateLimit: 1000
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      systemAlerts: true
    },
    trading: {
      tradingEnabled: true,
      minimumTradeAmount: 10,
      maximumTradeAmount: 100000,
      tradingFee: 0.25,
      stakingEnabled: true,
      minimumStakeAmount: 100
    },
    blockchain: {
      networkName: 'ReefChain',
      rpcUrl: 'https://rpc.reefscan.com',
      explorerUrl: 'https://reefscan.com',
      gasPrice: '0.8',
      confirmationBlocks: 3
    }
  });

  const handleSaveSettings = async (category: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${category} ayarları kaydedildi!`);
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi!');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'Genel', icon: Settings },
    ...(canAccessAdvancedSettings ? [{ id: 'security', name: 'Güvenlik', icon: Shield }] : []),
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'trading', name: 'Trading', icon: Globe },
    ...(canAccessAdvancedSettings ? [{ id: 'blockchain', name: 'Blockchain', icon: Server }] : [])
  ];

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  // Sadece süper admin tüm ayarlara erişebilir
  const canAccessAdvancedSettings = user?.role === 'superadmin';

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform Adı</label>
          <input
            type="text"
            value={settings.general.platformName}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, platformName: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destek E-postası</label>
          <input
            type="email"
            value={settings.general.supportEmail}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, supportEmail: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Açıklaması</label>
        <textarea
          value={settings.general.platformDescription}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, platformDescription: e.target.value }
          })}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Bakım Modu</h4>
            <p className="text-sm text-gray-600">Platform bakım modunda olduğunda kullanıcılar erişemez</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.maintenanceMode}
              onChange={(e) => setSettings({
                ...settings,
                general: { ...settings.general, maintenanceMode: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Kayıt Açık</h4>
            <p className="text-sm text-gray-600">Yeni kullanıcı kayıtlarına izin ver</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.registrationEnabled}
              onChange={(e) => setSettings({
                ...settings,
                general: { ...settings.general, registrationEnabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">KYC Zorunlu</h4>
            <p className="text-sm text-gray-600">Tüm kullanıcılar için KYC doğrulaması zorunlu</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.general.kycRequired}
              onChange={(e) => setSettings({
                ...settings,
                general: { ...settings.general, kycRequired: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Oturum Zaman Aşımı (dakika)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min. Şifre Uzunluğu</label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max. Giriş Denemesi</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit</label>
          <input
            type="number"
            value={settings.security.apiRateLimit}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, apiRateLimit: parseInt(e.target.value) }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist (virgülle ayırın)</label>
        <textarea
          value={settings.security.ipWhitelist}
          onChange={(e) => setSettings({
            ...settings,
            security: { ...settings.security, ipWhitelist: e.target.value }
          })}
          rows={3}
          placeholder="192.168.1.1, 10.0.0.1"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">2FA Zorunlu</h4>
          <p className="text-sm text-gray-600">Tüm kullanıcılar için iki faktörlü kimlik doğrulama zorunlu</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorRequired}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, twoFactorRequired: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>
    </div>
  );

  const renderBlockchainSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Network Adı</label>
          <input
            type="text"
            value={settings.blockchain.networkName}
            onChange={(e) => setSettings({
              ...settings,
              blockchain: { ...settings.blockchain, networkName: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gas Fiyatı (Gwei)</label>
          <input
            type="text"
            value={settings.blockchain.gasPrice}
            onChange={(e) => setSettings({
              ...settings,
              blockchain: { ...settings.blockchain, gasPrice: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">RPC URL</label>
        <input
          type="url"
          value={settings.blockchain.rpcUrl}
          onChange={(e) => setSettings({
            ...settings,
            blockchain: { ...settings.blockchain, rpcUrl: e.target.value }
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Explorer URL</label>
        <input
          type="url"
          value={settings.blockchain.explorerUrl}
          onChange={(e) => setSettings({
            ...settings,
            blockchain: { ...settings.blockchain, explorerUrl: e.target.value }
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Onay Blok Sayısı</label>
        <input
          type="number"
          value={settings.blockchain.confirmationBlocks}
          onChange={(e) => setSettings({
            ...settings,
            blockchain: { ...settings.blockchain, confirmationBlocks: parseInt(e.target.value) }
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistem Ayarları</h1>
          <p className="text-gray-600">Platform ayarlarını yönetin</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.name} Ayarları
                </h3>
                <button
                  onClick={() => handleSaveSettings(activeTab)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
                </button>
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'general' && renderGeneralSettings()}
                {activeTab === 'security' && renderSecuritySettings()}
                {activeTab === 'blockchain' && renderBlockchainSettings()}
                {activeTab === 'notifications' && (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim Ayarları</h3>
                    <p className="text-gray-600">Bu bölüm yakında eklenecek.</p>
                  </div>
                )}
                {activeTab === 'trading' && (
                  <div className="text-center py-12">
                    <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Trading Ayarları</h3>
                    <p className="text-gray-600">Bu bölüm yakında eklenecek.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};