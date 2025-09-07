import React, { useState } from 'react';
import { Database, CheckCircle, AlertTriangle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export const SupabaseSettings: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const supabaseConfig = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) throw error;
      setConnectionStatus('connected');
      toast.success('Supabase bağlantısı başarılı!');
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Supabase bağlantı hatası!');
    } finally {
      setIsTestingConnection(false);
    }
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
        title="Supabase Bağlantı Durumu"
        description="Veritabanı bağlantısını test edin"
        icon={Database}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {connectionStatus === 'connected' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {connectionStatus === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
              {connectionStatus === 'checking' && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />}
              <span className="font-medium">
                {connectionStatus === 'connected' && 'Bağlantı Başarılı'}
                {connectionStatus === 'error' && 'Bağlantı Hatası'}
                {connectionStatus === 'checking' && 'Kontrol Ediliyor...'}
              </span>
            </div>
            <button
              onClick={testConnection}
              disabled={isTestingConnection}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isTestingConnection ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
            </button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Environment Variables"
        description="Supabase konfigürasyon değişkenleri"
      >
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-blue-900">VITE_SUPABASE_URL</label>
                <button
                  onClick={() => copyToClipboard(supabaseConfig.url || '', 'Supabase URL')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-blue-800 font-mono text-sm">{supabaseConfig.url || 'Tanımlanmamış'}</p>
              <p className="text-blue-700 text-xs mt-1">Supabase projenizin ana URL'si</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-emerald-900">VITE_SUPABASE_ANON_KEY</label>
                <button
                  onClick={() => copyToClipboard(supabaseConfig.anonKey || '', 'Anon Key')}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-emerald-800 font-mono text-sm">{maskKey(supabaseConfig.anonKey || '')}</p>
              <p className="text-emerald-700 text-xs mt-1">Public API anahtarı (RLS ile korunur)</p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-red-900">SUPABASE_SERVICE_ROLE_KEY</label>
                <button
                  onClick={() => copyToClipboard(supabaseConfig.serviceRoleKey || '', 'Service Role Key')}
                  className="text-red-600 hover:text-red-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-red-800 font-mono text-sm">{maskKey(supabaseConfig.serviceRoleKey || '')}</p>
              <p className="text-red-700 text-xs mt-1">⚠️ GİZLİ: Sadece server-side kullanın!</p>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Hızlı Linkler"
        description="Supabase dashboard ve dokümantasyon"
      >
        <div className="grid grid-cols-2 gap-4">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Supabase Dashboard</span>
          </a>
          <a
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Dokümantasyon</span>
          </a>
        </div>
      </SettingsCard>
    </div>
  );
};