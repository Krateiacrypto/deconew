import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Database, 
  Shield, 
  Globe, 
  Mail,
  Bell,
  Palette,
  Code,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff,
  Copy,
  TestTube,
  Activity,
  BarChart3,
  Users,
  Server,
  Lock,
  Key,
  Zap,
  Cloud,
  HardDrive,
  Wifi,
  Monitor,
  CreditCard,
  Wrench,
  FileText,
  Upload,
  Download
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../utils/permissions';
import toast from 'react-hot-toast';

export const SystemSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error' | null>(null);

  // System settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'DECARBONIZE.world',
    siteDescription: 'Global CO₂ Token Platform',
    siteUrl: 'https://decarbonize.world',
    adminEmail: 'admin@decarbonize.world',
    supportEmail: 'support@decarbonize.world',
    defaultLanguage: 'tr',
    timezone: 'Europe/Istanbul',
    
    // Supabase Settings
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    supabaseServiceKey: '', // Service role key - gizli
    databaseUrl: '', // Database direct connection
    
    // Security Settings
    jwtExpiry: 3600,
    refreshTokenExpiry: 2592000,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireEmailVerification: false,
    enableTwoFactor: true,
    sessionTimeout: 1800,
    
    // API Settings
    maxRequestSize: 3,
    requestTimeout: 30,
    maxRows: 1000,
    enableCors: true,
    allowedOrigins: ['https://decarbonize.world', 'http://localhost:5173'],
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    emailFromName: 'DECARBONIZE',
    emailFromAddress: 'noreply@decarbonize.world',
    
    // Notification Settings
    enableEmailNotifications: true,
    enablePushNotifications: false,
    enableSmsNotifications: false,
    notificationRetentionDays: 30,
    
    // Performance Settings
    enableCaching: true,
    cacheExpiry: 3600,
    enableCompression: true,
    enableCdn: false,
    maxConcurrentConnections: 100,
    
    // Backup Settings
    enableAutoBackup: true,
    backupFrequency: 'daily',
    backupRetentionDays: 30,
    backupLocation: 'supabase',
    
    // Analytics Settings
    enableAnalytics: true,
    googleAnalyticsId: '',
    hotjarId: '',
    enableErrorTracking: true,
    
    // Blockchain Settings
    reefChainRpc: 'https://rpc.reefscan.com',
    reefChainExplorer: 'https://reefscan.com',
    walletConnectProjectId: '',
    enableWalletConnect: true,
    
    // ICO Settings
    icoStartDate: '2024-02-01',
    icoEndDate: '2024-06-30',
    tokenPrice: 0.12,
    minInvestment: 100,
    maxInvestment: 50000,
    enableIco: true,
    
    // Trading Settings
    enableTrading: true,
    tradingFee: 0.25,
    minTradeAmount: 10,
    maxTradeAmount: 100000,
    enableStaking: true,
    
    // Content Settings
    enableBlog: true,
    enableComments: true,
    moderateComments: true,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    
    // Maintenance Settings
    maintenanceMode: false,
    maintenanceMessage: 'Platform bakımda. Lütfen daha sonra tekrar deneyin.',
    enableDebugMode: false,
    logLevel: 'info',
    
    // Stripe Settings
    stripePublishableKey: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    enableStripe: false,
    stripeCurrency: 'USD',
    
    // Platform Settings
    platformFee: 2.5,
    enableKyc: true,
    enableWallet: true,
    enablePortfolio: true,
    enableAdvisor: true
  });

  const tabs = [
    { id: 'general', name: 'Genel', icon: Settings, color: 'blue' },
    { id: 'supabase', name: 'Supabase', icon: Database, color: 'emerald' },
    { id: 'security', name: 'Güvenlik', icon: Shield, color: 'red' },
    { id: 'api', name: 'API', icon: Globe, color: 'purple' },
    { id: 'email', name: 'E-posta', icon: Mail, color: 'blue' },
    { id: 'notifications', name: 'Bildirimler', icon: Bell, color: 'yellow' },
    { id: 'performance', name: 'Performans', icon: Activity, color: 'green' },
    { id: 'backup', name: 'Yedekleme', icon: HardDrive, color: 'gray' },
    { id: 'analytics', name: 'Analitik', icon: BarChart3, color: 'indigo' },
    { id: 'blockchain', name: 'Blockchain', icon: Zap, color: 'orange' },
    { id: 'ico', name: 'ICO', icon: Code, color: 'pink' },
    { id: 'stripe', name: 'Stripe', icon: CreditCard, color: 'blue' },
    { id: 'maintenance', name: 'Bakım', icon: Wrench, color: 'red' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const savedSettings = localStorage.getItem('system-settings');
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Settings load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('system-settings', JSON.stringify(settings));
      toast.success('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi!');
    } finally {
      setIsLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setConnectionStatus('testing');
    try {
      const response = await fetch(`${settings.supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': settings.supabaseAnonKey,
          'Authorization': `Bearer ${settings.supabaseAnonKey}`
        }
      });
      
      if (response.ok) {
        setConnectionStatus('success');
        toast.success('Supabase bağlantısı başarılı!');
      } else {
        setConnectionStatus('error');
        toast.error('Supabase bağlantısı başarısız!');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Bağlantı testi başarısız!');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Panoya kopyalandı!');
  };

  const resetToDefaults = () => {
    if (window.confirm('Tüm ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?')) {
      setSettings({
        ...settings,
        siteName: 'DECARBONIZE.world',
        siteDescription: 'Global CO₂ Token Platform',
        defaultLanguage: 'tr',
        timezone: 'Europe/Istanbul'
      });
      toast.success('Ayarlar varsayılan değerlere sıfırlandı!');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Ayarlar dışa aktarıldı!');
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedSettings = JSON.parse(event.target?.result as string);
          setSettings({ ...settings, ...importedSettings });
          toast.success('Ayarlar içe aktarıldı!');
        } catch (error) {
          toast.error('Geçersiz dosya formatı!');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!hasPermission(user, 'system.settings')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Site Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Lokalizasyon</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Varsayılan Dil</label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => setSettings({...settings, defaultLanguage: e.target.value})}
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
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
              <option value="UTC">UTC (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">İletişim Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin E-posta</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destek E-posta</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupabaseSettings = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Supabase Bağlantı Durumu</h3>
          <button
            onClick={testSupabaseConnection}
            disabled={connectionStatus === 'testing'}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {connectionStatus === 'testing' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4" />
            )}
            <span>{connectionStatus === 'testing' ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}</span>
          </button>
        </div>
        
        {connectionStatus && (
          <div className={`p-4 rounded-lg border ${
            connectionStatus === 'success' ? 'bg-emerald-50 border-emerald-200' :
            connectionStatus === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-2">
              {connectionStatus === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {connectionStatus === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
              {connectionStatus === 'testing' && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />}
              <span className={`font-medium ${
                connectionStatus === 'success' ? 'text-emerald-800' :
                connectionStatus === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {connectionStatus === 'success' && 'Supabase bağlantısı başarılı!'}
                {connectionStatus === 'error' && 'Supabase bağlantısı başarısız!'}
                {connectionStatus === 'testing' && 'Bağlantı test ediliyor...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Supabase Configuration */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Supabase Konfigürasyonu</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Supabase URL</label>
              <button
                onClick={() => copyToClipboard(settings.supabaseUrl)}
                className="text-emerald-600 hover:text-emerald-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <input
              type="url"
              value={settings.supabaseUrl}
              onChange={(e) => setSettings({...settings, supabaseUrl: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              placeholder="https://your-project-ref.supabase.co"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supabase Dashboard &gt; Settings &gt; API &gt; Project URL
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Anon Key (Public)</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(settings.supabaseAnonKey)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.supabaseAnonKey}
              onChange={(e) => setSettings({...settings, supabaseAnonKey: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
            <p className="text-xs text-emerald-600 mt-1">
              ✅ Bu anahtar frontend'de güvenle kullanılabilir (RLS ile korunur)
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Service Role Key (Gizli)</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(settings.supabaseServiceKey)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.supabaseServiceKey}
              onChange={(e) => setSettings({...settings, supabaseServiceKey: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">⚠️ Kritik Güvenlik Uyarısı</p>
                  <p className="text-xs text-red-700 mt-1">
                    Bu anahtar SADECE server-side işlemler için kullanılmalıdır. 
                    Frontend'de asla kullanmayın! Tüm veritabanı erişim yetkisi verir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Database URL (Migrations için)</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.databaseUrl}
              onChange={(e) => setSettings({...settings, databaseUrl: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              placeholder="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supabase Dashboard &gt; Settings &gt; Database &gt; Connection string
            </p>
          </div>
        </div>

        {/* Supabase Usage Stats */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">Kullanım İstatistikleri</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.4GB</div>
              <div className="text-sm text-blue-800">Database Boyutu</div>
              <div className="text-xs text-blue-600">8GB limitinden</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156GB</div>
              <div className="text-sm text-blue-800">Bandwidth</div>
              <div className="text-xs text-blue-600">250GB limitinden</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12.5K</div>
              <div className="text-sm text-blue-800">Aktif Kullanıcı</div>
              <div className="text-xs text-blue-600">100K limitinden</div>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Variables Guide */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Environment Variables Rehberi</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h4 className="font-medium text-emerald-800 mb-2">Frontend (Public) Variables</h4>
            <div className="space-y-2 text-sm">
              <div className="font-mono bg-white p-2 rounded border">
                <span className="text-emerald-600">VITE_SUPABASE_URL</span>=https://your-project-ref.supabase.co
              </div>
              <div className="font-mono bg-white p-2 rounded border">
                <span className="text-emerald-600">VITE_SUPABASE_ANON_KEY</span>=eyJhbGciOiJIUzI1NiIs...
              </div>
              <p className="text-emerald-700 text-xs">
                ✅ Bu değişkenler frontend'de güvenle kullanılabilir. RLS politikaları ile korunurlar.
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Backend (Private) Variables</h4>
            <div className="space-y-2 text-sm">
              <div className="font-mono bg-white p-2 rounded border">
                <span className="text-red-600">SUPABASE_SERVICE_ROLE_KEY</span>=eyJhbGciOiJIUzI1NiIs...
              </div>
              <div className="font-mono bg-white p-2 rounded border">
                <span className="text-red-600">DATABASE_URL</span>=postgresql://postgres:...
              </div>
              <p className="text-red-700 text-xs">
                ⚠️ Bu değişkenler GİZLİ tutulmalı! Sadece server-side işlemler için kullanın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Authentication Ayarları</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">JWT Token Süresi (saniye)</label>
            <input
              type="number"
              value={settings.jwtExpiry}
              onChange={(e) => setSettings({...settings, jwtExpiry: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">Önerilen: 3600 (1 saat)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Token Süresi (saniye)</label>
            <input
              type="number"
              value={settings.refreshTokenExpiry}
              onChange={(e) => setSettings({...settings, refreshTokenExpiry: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">Önerilen: 2592000 (30 gün)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Giriş Denemesi</label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Şifre Uzunluğu</label>
            <input
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">E-posta Doğrulama Zorunlu</h4>
              <p className="text-sm text-gray-600">Kullanıcılar kayıt olduktan sonra e-posta doğrulaması yapmalı mı?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({...settings, requireEmailVerification: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</h4>
              <p className="text-sm text-gray-600">2FA desteğini etkinleştir</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableTwoFactor}
                onChange={(e) => setSettings({...settings, enableTwoFactor: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* RLS Policies Status */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Row Level Security (RLS) Durumu</h3>
        
        <div className="space-y-3">
          {[
            { table: 'users', status: 'active', policies: 4 },
            { table: 'projects', status: 'active', policies: 5 },
            { table: 'blog_posts', status: 'active', policies: 3 },
            { table: 'blog_categories', status: 'active', policies: 2 },
            { table: 'kyc_applications', status: 'active', policies: 3 },
            { table: 'investments', status: 'active', policies: 3 },
            { table: 'staking_pools', status: 'active', policies: 2 },
            { table: 'staking_positions', status: 'active', policies: 3 }
          ].map((table, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  table.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium text-gray-900">{table.table}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{table.policies} politika</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  table.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {table.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStripeSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Stripe Konfigürasyonu</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableStripe}
              onChange={(e) => setSettings({...settings, enableStripe: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.stripePublishableKey}
              onChange={(e) => setSettings({...settings, stripePublishableKey: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="pk_test_..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.stripeSecretKey}
              onChange={(e) => setSettings({...settings, stripeSecretKey: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="sk_test_..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.stripeWebhookSecret}
              onChange={(e) => setSettings({...settings, stripeWebhookSecret: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="whsec_..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
            <select
              value={settings.stripeCurrency}
              onChange={(e) => setSettings({...settings, stripeCurrency: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="TRY">TRY - Turkish Lira</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Stripe Entegrasyonu</p>
              <p className="text-xs text-blue-700 mt-1">
                ICO token satışları ve ödeme işlemleri için Stripe kullanılır. 
                Test modunda çalışmak için test anahtarlarını kullanın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-6">
      {/* Maintenance Mode */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Bakım Modu</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <h4 className="font-medium text-yellow-900">Bakım Modu Aktif</h4>
              <p className="text-sm text-yellow-700">Site bakım modunda iken sadece adminler erişebilir</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bakım Mesajı</label>
            <textarea
              value={settings.maintenanceMessage}
              onChange={(e) => setSettings({...settings, maintenanceMessage: e.target.value})}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Platform şu anda bakımda. Lütfen daha sonra tekrar deneyin."
            />
            <p className="text-xs text-gray-500 mt-1">
              Bu mesaj bakım modu aktifken kullanıcılara gösterilir
            </p>
          </div>

          {/* Maintenance Schedule */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Planlı Bakım</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Başlangıç Tarihi</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Planlı Bakım Ayarla
              </button>
            </div>
          </div>

          {/* Emergency Maintenance */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-900 mb-3">Acil Bakım</h4>
            <p className="text-sm text-red-700 mb-3">
              Kritik sorunlar için anında bakım modu aktif edilebilir
            </p>
            <button 
              onClick={() => {
                if (window.confirm('Acil bakım modunu aktif etmek istediğinizden emin misiniz?')) {
                  setSettings({...settings, maintenanceMode: true});
                  toast.success('Acil bakım modu aktif edildi!');
                }
              }}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Acil Bakım Modu Aktif Et
            </button>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Sistem Sağlığı</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { service: 'Supabase Database', status: 'healthy', uptime: '99.9%', responseTime: '45ms', color: 'emerald' },
            { service: 'Authentication', status: 'healthy', uptime: '99.8%', responseTime: '120ms', color: 'emerald' },
            { service: 'Storage', status: 'healthy', uptime: '99.7%', responseTime: '89ms', color: 'emerald' },
            { service: 'Edge Functions', status: 'warning', uptime: '98.5%', responseTime: '234ms', color: 'yellow' }
          ].map((service, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{service.service}</span>
                <span className={`w-3 h-3 rounded-full ${
                  service.status === 'healthy' ? 'bg-emerald-500' :
                  service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Uptime: {service.uptime}</div>
                <div>Response: {service.responseTime}</div>
              </div>
            </div>
          ))}
        </div>

        {/* System Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center space-x-2 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Sistem Yenile</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Log İndir</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Activity className="w-4 h-4" />
            <span>Performans</span>
          </button>
        </div>
      </div>

      {/* Debug Settings */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Debug ve Geliştirici Ayarları</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Debug Modu</h4>
              <p className="text-sm text-gray-600">Geliştirici araçları ve detaylı loglar</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableDebugMode}
                onChange={(e) => setSettings({...settings, enableDebugMode: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Seviyesi</label>
            <select
              value={settings.logLevel}
              onChange={(e) => setSettings({...settings, logLevel: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (dakika)</label>
              <input
                type="number"
                value={settings.sessionTimeout / 60}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value) * 60})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Komisyonu (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.platformFee}
                onChange={(e) => setSettings({...settings, platformFee: parseFloat(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">API Konfigürasyonu</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Request Boyutu (MB)</label>
            <input
              type="number"
              value={settings.maxRequestSize}
              onChange={(e) => setSettings({...settings, maxRequestSize: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Timeout (saniye)</label>
            <input
              type="number"
              value={settings.requestTimeout}
              onChange={(e) => setSettings({...settings, requestTimeout: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Satır Sayısı</label>
            <input
              type="number"
              value={settings.maxRows}
              onChange={(e) => setSettings({...settings, maxRows: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Bağlantı</label>
            <input
              type="number"
              value={settings.maxConcurrentConnections}
              onChange={(e) => setSettings({...settings, maxConcurrentConnections: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">CORS Ayarları</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableCors}
                onChange={(e) => setSettings({...settings, enableCors: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          
          {settings.enableCors && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İzin Verilen Origin'ler</label>
              <textarea
                value={settings.allowedOrigins.join('\n')}
                onChange={(e) => setSettings({...settings, allowedOrigins: e.target.value.split('\n').filter(url => url.trim())})}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                placeholder="https://your-domain.com&#10;http://localhost:5173"
              />
              <p className="text-xs text-gray-500 mt-1">Her satıra bir URL yazın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">SMTP Konfigürasyonu</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
            <input
              type="text"
              value={settings.smtpHost}
              onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
            <input
              type="number"
              value={settings.smtpPort}
              onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Kullanıcı</label>
            <input
              type="text"
              value={settings.smtpUser}
              onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Şifre</label>
            <input
              type={showSecrets ? 'text' : 'password'}
              value={settings.smtpPassword}
              onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gönderen Adı</label>
            <input
              type="text"
              value={settings.emailFromName}
              onChange={(e) => setSettings({...settings, emailFromName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gönderen E-posta</label>
            <input
              type="email"
              value={settings.emailFromAddress}
              onChange={(e) => setSettings({...settings, emailFromAddress: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Test E-postası Gönder
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Bildirim Ayarları</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">E-posta Bildirimleri</h4>
              <p className="text-sm text-gray-600">Sistem e-posta bildirimlerini etkinleştir</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings({...settings, enableEmailNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Bildirimleri</h4>
              <p className="text-sm text-gray-600">Browser push bildirimlerini etkinleştir</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enablePushNotifications}
                onChange={(e) => setSettings({...settings, enablePushNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Bildirimleri</h4>
              <p className="text-sm text-gray-600">SMS bildirimlerini etkinleştir</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSmsNotifications}
                onChange={(e) => setSettings({...settings, enableSmsNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bildirim Saklama Süresi (gün)</label>
            <input
              type="number"
              value={settings.notificationRetentionDays}
              onChange={(e) => setSettings({...settings, notificationRetentionDays: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performans Optimizasyonu</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Cache Etkinleştir</h4>
              <p className="text-sm text-gray-600">Sayfa ve API yanıtlarını cache'le</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableCaching}
                onChange={(e) => setSettings({...settings, enableCaching: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Gzip Sıkıştırma</h4>
              <p className="text-sm text-gray-600">HTTP yanıtlarını sıkıştır</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableCompression}
                onChange={(e) => setSettings({...settings, enableCompression: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">CDN Kullan</h4>
              <p className="text-sm text-gray-600">Static dosyalar için CDN</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableCdn}
                onChange={(e) => setSettings({...settings, enableCdn: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cache Süresi (saniye)</label>
            <input
              type="number"
              value={settings.cacheExpiry}
              onChange={(e) => setSettings({...settings, cacheExpiry: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Yedekleme Ayarları</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Otomatik Yedekleme</h4>
              <p className="text-sm text-gray-600">Düzenli otomatik yedekleme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAutoBackup}
                onChange={(e) => setSettings({...settings, enableAutoBackup: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yedekleme Sıklığı</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="hourly">Saatlik</option>
                <option value="daily">Günlük</option>
                <option value="weekly">Haftalık</option>
                <option value="monthly">Aylık</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Saklama Süresi (gün)</label>
              <input
                type="number"
                value={settings.backupRetentionDays}
                onChange={(e) => setSettings({...settings, backupRetentionDays: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yedekleme Konumu</label>
            <select
              value={settings.backupLocation}
              onChange={(e) => setSettings({...settings, backupLocation: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="supabase">Supabase (Otomatik)</option>
              <option value="aws">AWS S3</option>
              <option value="google">Google Cloud Storage</option>
              <option value="local">Yerel Sunucu</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Manuel Yedek Al</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Yedek Geri Yükle</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Analitik Ayarları</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Analitik Etkinleştir</h4>
              <p className="text-sm text-gray-600">Kullanıcı davranışı ve site performansı takibi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAnalytics}
                onChange={(e) => setSettings({...settings, enableAnalytics: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({...settings, googleAnalyticsId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotjar ID</label>
              <input
                type="text"
                value={settings.hotjarId}
                onChange={(e) => setSettings({...settings, hotjarId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="1234567"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Hata Takibi</h4>
              <p className="text-sm text-gray-600">Otomatik hata raporlama ve takip</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableErrorTracking}
                onChange={(e) => setSettings({...settings, enableErrorTracking: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBlockchainSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ReefChain Ayarları</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ReefChain RPC URL</label>
            <input
              type="url"
              value={settings.reefChainRpc}
              onChange={(e) => setSettings({...settings, reefChainRpc: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Block Explorer URL</label>
            <input
              type="url"
              value={settings.reefChainExplorer}
              onChange={(e) => setSettings({...settings, reefChainExplorer: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WalletConnect Project ID</label>
            <input
              type="text"
              value={settings.walletConnectProjectId}
              onChange={(e) => setSettings({...settings, walletConnectProjectId: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">WalletConnect Etkinleştir</h4>
              <p className="text-sm text-gray-600">Mobil cüzdan bağlantıları için</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableWalletConnect}
                onChange={(e) => setSettings({...settings, enableWalletConnect: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderICOSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">ICO Konfigürasyonu</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableIco}
              onChange={(e) => setSettings({...settings, enableIco: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ICO Başlangıç Tarihi</label>
            <input
              type="date"
              value={settings.icoStartDate}
              onChange={(e) => setSettings({...settings, icoStartDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ICO Bitiş Tarihi</label>
            <input
              type="date"
              value={settings.icoEndDate}
              onChange={(e) => setSettings({...settings, icoEndDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Token Fiyatı ($)</label>
            <input
              type="number"
              step="0.01"
              value={settings.tokenPrice}
              onChange={(e) => setSettings({...settings, tokenPrice: parseFloat(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Komisyonu (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.platformFee}
              onChange={(e) => setSettings({...settings, platformFee: parseFloat(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Yatırım ($)</label>
            <input
              type="number"
              value={settings.minInvestment}
              onChange={(e) => setSettings({...settings, minInvestment: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Yatırım ($)</label>
            <input
              type="number"
              value={settings.maxInvestment}
              onChange={(e) => setSettings({...settings, maxInvestment: parseInt(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistem Ayarları</h1>
              <p className="text-gray-600">Platform konfigürasyonu ve Supabase entegrasyonu</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={resetToDefaults}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sıfırla</span>
              </button>
              
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>İçe Aktar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={exportSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Dışa Aktar</span>
              </button>
              
              <button
                onClick={saveSettings}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'supabase' && renderSupabaseSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'api' && renderAPISettings()}
          {activeTab === 'email' && renderEmailSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'performance' && renderPerformanceSettings()}
          {activeTab === 'backup' && renderBackupSettings()}
          {activeTab === 'analytics' && renderAnalyticsSettings()}
          {activeTab === 'blockchain' && renderBlockchainSettings()}
          {activeTab === 'ico' && renderICOSettings()}
          {activeTab === 'stripe' && renderStripeSettings()}
          {activeTab === 'maintenance' && renderMaintenanceSettings()}
        </motion.div>

        {/* Security Warning */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Önemli Güvenlik Uyarıları</h4>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• Service Role Key'i asla frontend kodunda kullanmayın</li>
                <li>• Environment variables'ları production'da güvenli şekilde saklayın</li>
                <li>• RLS politikalarının tüm tablolarda aktif olduğundan emin olun</li>
                <li>• Düzenli olarak güvenlik güncellemelerini takip edin</li>
                <li>• Database backup'larını düzenli olarak kontrol edin</li>
                <li>• API rate limiting'i production'da mutlaka aktif edin</li>
                <li>• HTTPS kullanımını zorunlu kılın</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};