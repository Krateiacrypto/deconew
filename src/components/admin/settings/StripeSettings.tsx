import React, { useState } from 'react';
import { CreditCard, Key, TestTube, ExternalLink, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import toast from 'react-hot-toast';

export const StripeSettings: React.FC = () => {
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: import.meta.env.STRIPE_SECRET_KEY || '',
    webhookSecret: import.meta.env.STRIPE_WEBHOOK_SECRET || '',
    testMode: true
  });

  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  const testStripeConnection = async () => {
    // Mock Stripe connection test
    setConnectionStatus('checking');
    setTimeout(() => {
      if (stripeConfig.publishableKey && stripeConfig.secretKey) {
        setConnectionStatus('connected');
        toast.success('Stripe bağlantısı başarılı!');
      } else {
        setConnectionStatus('error');
        toast.error('Stripe API anahtarları eksik!');
      }
    }, 1000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopyalandı!`);
  };

  const maskKey = (key: string) => {
    if (!key) return 'Tanımlanmamış';
    return key.substring(0, 8) + '...' + key.substring(key.length - 8);
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Stripe Konfigürasyonu"
        description="ICO ve ödeme işlemleri için Stripe ayarları"
        icon={CreditCard}
      >
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {connectionStatus === 'connected' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {connectionStatus === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
              {connectionStatus === 'checking' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
              <span className="font-medium">
                {connectionStatus === 'connected' && 'Stripe Bağlantısı Aktif'}
                {connectionStatus === 'error' && 'Stripe Bağlantı Hatası'}
                {connectionStatus === 'checking' && 'Bağlantı Test Ediliyor...'}
              </span>
            </div>
            <button
              onClick={testStripeConnection}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Bağlantıyı Test Et
            </button>
          </div>

          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <h4 className="font-medium text-yellow-900">Test Modu</h4>
              <p className="text-sm text-yellow-700">
                {stripeConfig.testMode ? 'Test API anahtarları kullanılıyor' : 'Canlı API anahtarları kullanılıyor'}
              </p>
            </div>
            <button
              onClick={() => {
                setStripeConfig(prev => ({ ...prev, testMode: !prev.testMode }));
                toast.success(`Stripe ${!stripeConfig.testMode ? 'test' : 'canlı'} moduna geçildi!`);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                stripeConfig.testMode
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {stripeConfig.testMode ? 'Test Modu' : 'Canlı Mod'}
            </button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="API Anahtarları"
        description="Stripe API anahtarları ve webhook konfigürasyonu"
        icon={Key}
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-blue-900">Publishable Key</label>
              <button
                onClick={() => copyToClipboard(stripeConfig.publishableKey, 'Publishable Key')}
                className="text-blue-600 hover:text-blue-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-blue-800 font-mono text-sm">{stripeConfig.publishableKey || 'Tanımlanmamış'}</p>
            <p className="text-blue-700 text-xs mt-1">Frontend'de güvenle kullanılabilir</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-red-900">Secret Key</label>
              <button
                onClick={() => copyToClipboard(stripeConfig.secretKey, 'Secret Key')}
                className="text-red-600 hover:text-red-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-red-800 font-mono text-sm">{maskKey(stripeConfig.secretKey)}</p>
            <p className="text-red-700 text-xs mt-1">⚠️ GİZLİ: Sadece server-side kullanın!</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-purple-900">Webhook Secret</label>
              <button
                onClick={() => copyToClipboard(stripeConfig.webhookSecret, 'Webhook Secret')}
                className="text-purple-600 hover:text-purple-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-purple-800 font-mono text-sm">{maskKey(stripeConfig.webhookSecret)}</p>
            <p className="text-purple-700 text-xs mt-1">Webhook doğrulama için gerekli</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Hızlı Linkler"
        description="Stripe dashboard ve dokümantasyon"
      >
        <div className="grid grid-cols-2 gap-4">
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Stripe Dashboard</span>
          </a>
          <a
            href="https://stripe.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Stripe Docs</span>
          </a>
        </div>
      </SettingsCard>
    </div>
  );
};