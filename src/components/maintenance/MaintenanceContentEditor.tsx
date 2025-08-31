import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  RefreshCw, 
  Eye, 
  Upload, 
  Palette,
  Type,
  Video,
  Globe,
  Target,
  Heart,
  Mail,
  Twitter,
  Linkedin,
  MessageCircle,
  RotateCcw
} from 'lucide-react';
import { useMaintenanceStore } from '../../store/maintenanceStore';
import { HexColorPicker } from 'react-colorful';
import toast from 'react-hot-toast';

export const MaintenanceContentEditor: React.FC = () => {
  const { content, updateContent, resetToDefaults, isLoading } = useMaintenanceStore();
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState(content);

  const handleSave = () => {
    updateContent(formData);
    toast.success('Bakım sayfası içeriği güncellendi!');
  };

  const handleReset = () => {
    if (window.confirm('Tüm değişiklikleri sıfırlamak istediğinizden emin misiniz?')) {
      resetToDefaults();
      setFormData(content);
      toast.success('İçerik varsayılan değerlere sıfırlandı!');
    }
  };

  const handlePreview = () => {
    updateContent(formData);
    window.open('/', '_blank');
  };

  const ColorPicker: React.FC<{
    label: string;
    value: string;
    onChange: (color: string) => void;
    property: string;
  }> = ({ label, value, onChange, property }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActiveColorPicker(activeColorPicker === property ? null : property)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm hover:border-emerald-400 transition-colors"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
          placeholder="#ffffff"
        />
      </div>
      
      {activeColorPicker === property && (
        <div className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
          <HexColorPicker
            color={value}
            onChange={onChange}
          />
          <button
            onClick={() => setActiveColorPicker(null)}
            className="mt-3 w-full px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Bakım Sayfası İçerik Editörü</h3>
          <p className="text-gray-600">Bakım sayfasının görünümünü ve içeriğini özelleştirin</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Önizle</span>
          </button>
          
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sıfırla</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Content Settings */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h4 className="flex items-center space-x-2 font-bold text-blue-900 mb-4">
              <Type className="w-5 h-5" />
              <span>Temel İçerik</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Ana Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="DECARBONIZE.world"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Alt Başlık</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Çok Yakında"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Ana Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Platform açıklaması..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Tahmini Lansman</label>
                <input
                  type="text"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mart 2024"
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
            <h4 className="flex items-center space-x-2 font-bold text-emerald-900 mb-4">
              <Target className="w-5 h-5" />
              <span>Misyon & Vizyon</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Misyon</label>
                <textarea
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Şirket misyonu..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Vizyon</label>
                <textarea
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Şirket vizyonu..."
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <h4 className="flex items-center space-x-2 font-bold text-purple-900 mb-4">
              <Video className="w-5 h-5" />
              <span>Video & Ek Bilgiler</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Video URL (YouTube/Vimeo)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Ek Açıklamalar</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ek bilgiler ve açıklamalar..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Design & Contact Settings */}
        <div className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
            <h4 className="flex items-center space-x-2 font-bold text-orange-900 mb-4">
              <Palette className="w-5 h-5" />
              <span>Tasarım Ayarları</span>
            </h4>
            
            <div className="space-y-4">
              <ColorPicker
                label="Arka Plan Rengi"
                value={formData.backgroundColor}
                onChange={(color) => setFormData({ ...formData, backgroundColor: color })}
                property="backgroundColor"
              />
              
              <ColorPicker
                label="Metin Rengi"
                value={formData.textColor}
                onChange={(color) => setFormData({ ...formData, textColor: color })}
                property="textColor"
              />
              
              <ColorPicker
                label="Vurgu Rengi"
                value={formData.accentColor}
                onChange={(color) => setFormData({ ...formData, accentColor: color })}
                property="accentColor"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="flex items-center space-x-2 font-bold text-gray-900 mb-4">
              <Mail className="w-5 h-5" />
              <span>İletişim Bilgileri</span>
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İletişim E-postası</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="info@decarbonize.world"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                    })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://twitter.com/decarbonize"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                    })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://linkedin.com/company/decarbonize"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telegram URL</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.socialLinks.telegram}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialLinks: { ...formData.socialLinks, telegram: e.target.value }
                    })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://t.me/decarbonize"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-6 rounded-xl border border-emerald-200">
            <h4 className="font-bold text-gray-900 mb-4">Önizleme</h4>
            <div 
              className="w-full h-32 rounded-lg flex items-center justify-center text-center p-4 relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${formData.backgroundColor}dd, ${formData.accentColor}22)`,
                color: formData.textColor
              }}
            >
              <div className="relative z-10">
                <h5 className="font-bold text-lg mb-1">{formData.title}</h5>
                <p className="text-sm opacity-90">{formData.subtitle}</p>
              </div>
              
              {/* Mini orbs */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">Hızlı İşlemler</h4>
            <div className="space-y-3">
              <button
                onClick={() => setFormData({
                  ...formData,
                  backgroundColor: '#0f172a',
                  textColor: '#ffffff',
                  accentColor: '#10b981'
                })}
                className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
              >
                🌙 Koyu Tema
              </button>
              
              <button
                onClick={() => setFormData({
                  ...formData,
                  backgroundColor: '#ffffff',
                  textColor: '#1f2937',
                  accentColor: '#10b981'
                })}
                className="w-full p-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                ☀️ Açık Tema
              </button>
              
              <button
                onClick={() => setFormData({
                  ...formData,
                  backgroundColor: '#065f46',
                  textColor: '#ffffff',
                  accentColor: '#34d399'
                })}
                className="w-full p-3 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors text-sm"
              >
                🌿 Yeşil Tema
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Overlay */}
      {activeColorPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveColorPicker(null)}
        />
      )}
    </div>
  );
};