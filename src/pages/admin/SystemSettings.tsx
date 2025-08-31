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
  RefreshCw,
  DollarSign,
  Zap,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { MaintenanceToggle } from '../../components/maintenance/MaintenanceToggle';
import { MaintenanceContentEditor } from '../../components/maintenance/MaintenanceContentEditor';
import toast from 'react-hot-toast';

export const SystemSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const [settings, setSettings] = useState({
    general: {
      platformName: 'DECARBONIZE.world',
      platformDescription: 'Global CO₂ Token Platform',
      supportEmail: 'support@decarbonize.world',
      maintenanceMode: false,
      registrationEnabled: true,
      kycRequired: true,
      defaultLanguage: 'tr',
      timezone: 'Europe/Istanbul',
      currency: 'USD'
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      ipWhitelist: '',
      apiRateLimit: 1000,
      encryptionEnabled: true,
      auditLogging: true,
      securityHeaders: true
    },
    blockchain: {
      networkName: 'ReefChain',
      rpcUrl: 'https://rpc.reefscan.com',
      explorerUrl: 'https://reefscan.com',
      gasPrice: '0.8',
      confirmationBlocks: 3,
      contractAddress: '0x1234567890123456789012345678901234567890',
      privateKey: '••••••••••••••••••••••••••••••••',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfbF31d2'
    },
    trading: {
      tradingEnabled: true,
      minimumTradeAmount: 10,
      maximumTradeAmount: 100000,
      tradingFee: 0.25,
      slippageTolerance: 0.5,
      priceUpdateInterval: 30,
      orderBookDepth: 50
    },
    staking: {
      stakingEnabled: true,
      minimumStakeAmount: 100,
      maximumStakeAmount: 1000000,
      defaultAPY: 12.5,
      lockPeriods: [30, 90, 180, 365],
      earlyWithdrawalPenalty: 5,
      rewardDistributionInterval: 24
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      systemAlerts: true,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@decarbonize.world',
      smtpPassword: '••••••••••••••••',
      twilioSid: '••••••••••••••••',
      twilioToken: '••••••••••••••••'
    },
    supabase: {
      projectUrl: 'https://your-project.supabase.co',
      anonKey: '••••••••••••••••••••••••••••••••',
      serviceRoleKey: '••••••••••••••••••••••••••••••••',
      databaseUrl: 'postgresql://••••••••••••••••',
      jwtSecret: '••••••••••••••••••••••••••••••••'
    },
    stripe: {
      publishableKey: 'pk_test_••••••••••••••••••••••••••••••••',
      secretKey: 'sk_test_••••••••••••••••••••••••••••••••',
      webhookSecret: 'whsec_••••••••••••••••••••••••••••••••',
      enabled: true,
      currency: 'USD',
      paymentMethods: ['card', 'bank_transfer', 'crypto']
    },
    api: {
      baseUrl: 'https://api.decarbonize.world',
      version: 'v1',
      timeout: 30000,
      retryAttempts: 3,
      corsEnabled: true,
      allowedOrigins: 'https://decarbonize.world, https://app.decarbonize.world'
    }
  });

  const handleSaveSettings = async (category: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${category} ayarları kaydedildi!`);
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi!');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tabs = [
    { id: 'general', name: 'Genel', icon: Settings },
    { id: 'maintenance', name: 'Bakım Modu', icon: AlertTriangle },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'blockchain', name: 'Blockchain', icon: Server },
    { id: 'trading', name: 'Trading', icon: Globe },
    { id: 'staking', name: 'Staking', icon: Zap },
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'supabase', name: 'Supabase', icon: Database },
    { id: 'stripe', name: 'Stripe', icon: CreditCard },
    { id: 'api', name: 'API', icon: Key }
  ];

  if (user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Sistem ayarlarına sadece Süper Admin erişebilir.</p>
        </div>
      </div>
    );
  }

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

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Varsayılan Dil</label>
          <select
            value={settings.general.defaultLanguage}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, defaultLanguage: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zaman Dilimi</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, timezone: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="Europe/Istanbul">İstanbul</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">New York</option>
            <option value="Europe/London">Londra</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
          <select
            value={settings.general.currency}
            onChange={(e) => setSettings({
              ...settings,
              general: { ...settings.general, currency: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="TRY">TRY</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div>
            <h4 className="font-medium text-emerald-900">Kayıt Açık</h4>
            <p className="text-sm text-emerald-700">Yeni kullanıcı kayıtlarına izin ver</p>
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

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <h4 className="font-medium text-blue-900">KYC Zorunlu</h4>
            <p className="text-sm text-blue-700">Tüm kullanıcılar için KYC doğrulaması zorunlu</p>
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
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-8">
      {/* Maintenance Toggle */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">Bakım Modu Kontrolü</h4>
        <MaintenanceToggle />
      </div>

      {/* Maintenance Content Editor */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">Bakım Sayfası İçerik Editörü</h4>
        <MaintenanceContentEditor />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit (req/min)</label>
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

      <div className="space-y-4">
        {[
          { key: 'twoFactorRequired', label: '2FA Zorunlu', desc: 'Tüm kullanıcılar için iki faktörlü kimlik doğrulama zorunlu' },
          { key: 'encryptionEnabled', label: 'Şifreleme Aktif', desc: 'Veri şifreleme ve güvenli iletişim' },
          { key: 'auditLogging', label: 'Denetim Logları', desc: 'Tüm kullanıcı aktivitelerini kaydet' },
          { key: 'securityHeaders', label: 'Güvenlik Headers', desc: 'HTTP güvenlik başlıklarını etkinleştir' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{setting.label}</h4>
              <p className="text-sm text-gray-600">{setting.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security[setting.key as keyof typeof settings.security] as boolean}
                onChange={(e) => setSettings({
                  ...settings,
                  security: { ...settings.security, [setting.key]: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        ))}
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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contract Address</label>
          <input
            type="text"
            value={settings.blockchain.contractAddress}
            onChange={(e) => setSettings({
              ...settings,
              blockchain: { ...settings.blockchain, contractAddress: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
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

      {/* Sensitive Fields */}
      <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-900">Hassas Bilgiler</h4>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Private Key</label>
          <div className="relative">
            <input
              type={showSecrets.privateKey ? 'text' : 'password'}
              value={settings.blockchain.privateKey}
              onChange={(e) => setSettings({
                ...settings,
                blockchain: { ...settings.blockchain, privateKey: e.target.value }
              })}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => toggleSecret('privateKey')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showSecrets.privateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
          <input
            type="text"
            value={settings.blockchain.walletAddress}
            onChange={(e) => setSettings({
              ...settings,
              blockchain: { ...settings.blockchain, walletAddress: e.target.value }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderStakingSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div>
          <h4 className="font-medium text-emerald-900">Staking Aktif</h4>
          <p className="text-sm text-emerald-700">Platform staking özelliğini etkinleştir</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.staking.stakingEnabled}
            onChange={(e) => setSettings({
              ...settings,
              staking: { ...settings.staking, stakingEnabled: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min. Stake Miktarı</label>
          <input
            type="number"
            value={settings.staking.minimumStakeAmount}
            onChange={(e) => setSettings({
              ...settings,
              staking: { ...settings.staking, minimumStakeAmount: parseInt(e.target.value) }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max. Stake Miktarı</label>
          <input
            type="number"
            value={settings.staking.maximumStakeAmount}
            onChange={(e) => setSettings({
              ...settings,
              staking: { ...settings.staking, maximumStakeAmount: parseInt(e.target.value) }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Varsayılan APY (%)</label>
          <input
            type="number"
            step="0.1"
            value={settings.staking.defaultAPY}
            onChange={(e) => setSettings({
              ...settings,
              staking: { ...settings.staking, defaultAPY: parseFloat(e.target.value) }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Erken Çekim Cezası (%)</label>
          <input
            type="number"
            step="0.1"
            value={settings.staking.earlyWithdrawalPenalty}
            onChange={(e) => setSettings({
              ...settings,
              staking: { ...settings.staking, earlyWithdrawalPenalty: parseFloat(e.target.value) }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Kilit Süreleri (gün, virgülle ayırın)</label>
        <input
          type="text"
          value={settings.staking.lockPeriods.join(', ')}
          onChange={(e) => setSettings({
            ...settings,
            staking: { 
              ...settings.staking, 
              lockPeriods: e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
            }
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="30, 90, 180, 365"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ödül Dağıtım Aralığı (saat)</label>
        <input
          type="number"
          value={settings.staking.rewardDistributionInterval}
          onChange={(e) => setSettings({
            ...settings,
            staking: { ...settings.staking, rewardDistributionInterval: parseInt(e.target.value) }
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>
    </div>
  );

  const renderSupabaseSettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Supabase Konfigürasyonu</h4>
        </div>
        <p className="text-sm text-blue-700">Veritabanı ve backend servis ayarları</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
        <input
          type="url"
          value={settings.supabase.projectUrl}
          onChange={(e) => setSettings({
            ...settings,
            supabase: { ...settings.supabase, projectUrl: e.target.value }
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Anon Key</label>
        <div className="relative">
          <input
            type={showSecrets.anonKey ? 'text' : 'password'}
            value={settings.supabase.anonKey}
            onChange={(e) => setSettings({
              ...settings,
              supabase: { ...settings.supabase, anonKey: e.target.value }
            })}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => toggleSecret('anonKey')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showSecrets.anonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Role Key</label>
        <div className="relative">
          <input
            type={showSecrets.serviceRoleKey ? 'text' : 'password'}
            value={settings.supabase.serviceRoleKey}
            onChange={(e) => setSettings({
              ...settings,
              supabase: { ...settings.supabase, serviceRoleKey: e.target.value }
            })}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => toggleSecret('serviceRoleKey')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showSecrets.serviceRoleKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Database URL</label>
        <div className="relative">
          <input
            type={showSecrets.databaseUrl ? 'text' : 'password'}
            value={settings.supabase.databaseUrl}
            onChange={(e) => setSettings({
              ...settings,
              supabase: { ...settings.supabase, databaseUrl: e.target.value }
            })}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => toggleSecret('databaseUrl')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showSecrets.databaseUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">JWT Secret</label>
        <div className="relative">
          <input
            type={showSecrets.jwtSecret ? 'text' : 'password'}
            value={settings.supabase.jwtSecret}
            onChange={(e) => setSettings({
              ...settings,
              supabase: { ...settings.supabase, jwtSecret: e.target.value }
            })}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => toggleSecret('jwtSecret')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showSecrets.jwtSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStripeSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div>
          <h4 className="font-medium text-emerald-900">Stripe Entegrasyonu</h4>
          <p className="text-sm text-emerald-700">Ödeme işlemleri için Stripe entegrasyonu</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.stripe.enabled}
            onChange={(e) => setSettings({
              ...settings,
              stripe: { ...settings.stripe, enabled: e.target.checked }
            })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
        <input
          type="text"
          value={settings.stripe.publishableKey}
          onChange={(e) => setSettings({
            ...settings,
            stripe: { ...settings.stripe, publishableKey: e.target.value }
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
        <div className="relative">
          <input
            type={showSecrets.stripeSecret ? 'text' : 'password'}
            value={settings.stripe.secretKey}
            onChange={(e) => setSettings({
              ...settings,
              stripe: { ...settings.stripe, secretKey: e.target.value }
            })}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => toggleSecret('stripeSecret')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showSecrets.stripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
        <div className="relative">
          <input
            type={showSecrets.webhookSecret ? 'text' : 'password'}
            value={settings.stripe.webhookSecret}
            onChange={(e) => setSettings({
              ...settings,
              stripe: { ...settings.stripe, webhookSecret: e.target.value }
            })}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => toggleSecret('webhookSecret')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showSecrets.webhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
        <select
          value={settings.stripe.currency}
          onChange={(e) => setSettings({
            ...settings,
            stripe: { ...settings.stripe, currency: e.target.value }
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="TRY">TRY</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemleri</label>
        <div className="space-y-2">
          {['card', 'bank_transfer', 'crypto'].map(method => (
            <div key={method} className="flex items-center">
              <input
                type="checkbox"
                id={method}
                checked={settings.stripe.paymentMethods.includes(method)}
                onChange={(e) => {
                  const methods = e.target.checked
                    ? [...settings.stripe.paymentMethods, method]
                    : settings.stripe.paymentMethods.filter(m => m !== method);
                  setSettings({
                    ...settings,
                    stripe: { ...settings.stripe, paymentMethods: methods }
                  });
                }}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor={method} className="ml-2 block text-sm text-gray-900">
                {method === 'card' ? 'Kredi Kartı' :
                 method === 'bank_transfer' ? 'Banka Transferi' : 'Kripto Para'}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Sistem Ayarları</h1>
              <p className="text-gray-600">Platform konfigürasyonu ve backend ayarları</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
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
                {activeTab !== 'maintenance' && (
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
                )}
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'general' && renderGeneralSettings()}
                {activeTab === 'maintenance' && renderMaintenanceSettings()}
                {activeTab === 'security' && renderSecuritySettings()}
                {activeTab === 'blockchain' && renderBlockchainSettings()}
                {activeTab === 'staking' && renderStakingSettings()}
                {activeTab === 'supabase' && renderSupabaseSettings()}
                {activeTab === 'stripe' && renderStripeSettings()}
                
                {/* Placeholder tabs */}
                {['trading', 'notifications', 'api'].includes(activeTab) && (
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {tabs.find(t => t.id === activeTab)?.name} Ayarları
                    </h3>
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