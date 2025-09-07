import React, { useState } from 'react';
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  Upload,
  Download,
  Settings as SettingsIcon,
  Palette,
  Type,
  Image as ImageIcon
} from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import toast from 'react-hot-toast';

export const GeneralSettings: React.FC = () => {
  const [generalConfig, setGeneralConfig] = useState({
    siteName: 'DECARBONIZE.world',
    siteDescription: 'Global CO₂ Token Platform',
    contactEmail: 'info@decarbonize.world',
    contactPhone: '+90 555 123 45 67',
    address: 'İstanbul, Türkiye',
    logo: '/logo.png',
    favicon: '/co2-icon.svg',
    primaryColor: '#10b981',
    secondaryColor: '#3b82f6',
    language: 'tr',
    timezone: 'Europe/Istanbul',
    currency: 'USD',
    dateFormat: 'DD/MM/YYYY',
    enableRegistration: true,
    enableEmailVerification: false,
    enableTwoFactor: true,
    maxFileSize: 10, // MB
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
  });

  const handleSave = () => {
    // Save to localStorage for demo
    localStorage.setItem('general-settings', JSON.stringify(generalConfig));
    toast.success('Genel ayarlar kaydedildi!');
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(generalConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'general-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Ayarlar dışa aktarıldı!');
  };

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const settings = JSON.parse(event.target?.result as string);
          setGeneralConfig(settings);
          toast.success('Ayarlar içe aktarıldı!');
        } catch (error) {
          toast.error('Geçersiz dosya formatı!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Site Bilgileri"
        description="Temel site konfigürasyonu"
        icon={Globe}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
            <input
              type="text"
              value={generalConfig.siteName}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
            <select
              value={generalConfig.language}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, language: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
            <textarea
              value={generalConfig.siteDescription}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="İletişim Bilgileri"
        description="Şirket iletişim bilgileri"
        icon={Mail}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <input
              type="email"
              value={generalConfig.contactEmail}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <input
              type="tel"
              value={generalConfig.contactPhone}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
            <input
              type="text"
              value={generalConfig.address}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Görsel Ayarları"
        description="Logo, favicon ve renk ayarları"
        icon={Palette}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ana Renk</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={generalConfig.primaryColor}
                onChange={(e) => setGeneralConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-12 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={generalConfig.primaryColor}
                onChange={(e) => setGeneralConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İkincil Renk</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={generalConfig.secondaryColor}
                onChange={(e) => setGeneralConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="w-12 h-12 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={generalConfig.secondaryColor}
                onChange={(e) => setGeneralConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              type="url"
              value={generalConfig.logo}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, logo: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
            <input
              type="url"
              value={generalConfig.favicon}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, favicon: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Güvenlik Ayarları"
        description="Kullanıcı kayıt ve güvenlik konfigürasyonu"
        icon={SettingsIcon}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Kullanıcı Kaydı</h4>
                <p className="text-sm text-gray-600">Yeni kullanıcı kayıtlarına izin ver</p>
              </div>
              <button
                onClick={() => setGeneralConfig(prev => ({ ...prev, enableRegistration: !prev.enableRegistration }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  generalConfig.enableRegistration
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {generalConfig.enableRegistration ? 'Aktif' : 'Pasif'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">E-posta Doğrulama</h4>
                <p className="text-sm text-gray-600">Kayıt sonrası e-posta doğrulama zorunlu</p>
              </div>
              <button
                onClick={() => setGeneralConfig(prev => ({ ...prev, enableEmailVerification: !prev.enableEmailVerification }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  generalConfig.enableEmailVerification
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {generalConfig.enableEmailVerification ? 'Aktif' : 'Pasif'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Dosya Boyutu (MB)</label>
            <input
              type="number"
              value={generalConfig.maxFileSize}
              onChange={(e) => setGeneralConfig(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              min="1"
              max="100"
            />
          </div>
        </div>
      </SettingsCard>

      {/* Save Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <button
            onClick={handleExportSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Download className="w-4 h-4" />
            <span>Ayarları Dışa Aktar</span>
          </button>
          
          <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Ayarları İçe Aktar</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Save className="w-5 h-5" />
          <span>Ayarları Kaydet</span>
        </button>
      </div>
    </div>
  );
};