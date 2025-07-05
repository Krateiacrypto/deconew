import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Calendar,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X
} from 'lucide-react';
import { Banner } from '../../../types/content';
import { useContentStore } from '../../../store/contentStore';

export const BannerManager: React.FC = () => {
  const { banners, fetchBanners, createBanner, updateBanner, deleteBanner, isLoading } = useContentStore();
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleSave = async (data: Partial<Banner>) => {
    if (editingBanner) {
      await updateBanner(editingBanner.id, data);
    } else {
      await createBanner(data as Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setShowForm(false);
    setEditingBanner(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu banner\'ı silmek istediğinizden emin misiniz?')) {
      await deleteBanner(id);
    }
  };

  const toggleBannerStatus = async (banner: Banner) => {
    await updateBanner(banner.id, { isActive: !banner.isActive });
  };

  const getBannerIcon = (type: Banner['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'announcement':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBannerColor = (type: Banner['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'announcement':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const isActiveBanner = (banner: Banner) => {
    if (!banner.isActive) return false;
    
    const now = new Date();
    const startDate = banner.startDate ? new Date(banner.startDate) : null;
    const endDate = banner.endDate ? new Date(banner.endDate) : null;
    
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Banner Yönetimi</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Banner</span>
        </button>
      </div>

      {/* Active Banners Preview */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Aktif Banner Önizlemesi</h3>
        <div className="space-y-3">
          {banners.filter(isActiveBanner).map((banner) => (
            <div
              key={banner.id}
              className={`p-4 rounded-lg border-2 ${getBannerColor(banner.type)}`}
            >
              <div className="flex items-start space-x-3">
                {getBannerIcon(banner.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{banner.title}</h4>
                  <p className="text-gray-700 mt-1">{banner.message}</p>
                  {banner.actionText && banner.actionUrl && (
                    <a
                      href={banner.actionUrl}
                      className="inline-flex items-center space-x-1 mt-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <span>{banner.actionText}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {banners.filter(isActiveBanner).length === 0 && (
            <p className="text-gray-500 text-center py-4">Aktif banner bulunmuyor</p>
          )}
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-6 ${!banner.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {getBannerIcon(banner.type)}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{banner.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isActiveBanner(banner) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {isActiveBanner(banner) ? 'Aktif' : 'Pasif'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        banner.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                        banner.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        banner.type === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {banner.type === 'success' ? 'Başarı' :
                         banner.type === 'warning' ? 'Uyarı' :
                         banner.type === 'error' ? 'Hata' :
                         banner.type === 'announcement' ? 'Duyuru' : 'Bilgi'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{banner.message}</p>
                    
                    {banner.actionText && banner.actionUrl && (
                      <div className="flex items-center space-x-1 text-blue-600 text-sm mb-3">
                        <span>Aksiyon: {banner.actionText}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {banner.startDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Başlangıç: {new Date(banner.startDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                      {banner.endDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Bitiş: {new Date(banner.endDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBannerStatus(banner)}
                    className={`p-2 rounded-lg ${
                      banner.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={banner.isActive ? 'Deaktif Et' : 'Aktif Et'}
                  >
                    {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingBanner(banner);
                      setShowForm(true);
                    }}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Banner bulunamadı</h3>
            <p className="text-gray-600 mb-4">İlk banner'ınızı oluşturun</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              İlk Banner'ı Oluştur
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <BannerForm
            banner={editingBanner}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingBanner(null);
            }}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface BannerFormProps {
  banner?: Banner | null;
  onSave: (data: Partial<Banner>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BannerForm: React.FC<BannerFormProps> = ({ banner, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    message: banner?.message || '',
    type: banner?.type || 'info' as Banner['type'],
    isActive: banner?.isActive ?? true,
    startDate: banner?.startDate || '',
    endDate: banner?.endDate || '',
    actionText: banner?.actionText || '',
    actionUrl: banner?.actionUrl || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {banner ? 'Banner Düzenle' : 'Yeni Banner'}
          </h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tür</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Banner['type'] })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="info">Bilgi</option>
                <option value="success">Başarı</option>
                <option value="warning">Uyarı</option>
                <option value="error">Hata</option>
                <option value="announcement">Duyuru</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aksiyon Metni</label>
              <input
                type="text"
                value={formData.actionText}
                onChange={(e) => setFormData({ ...formData, actionText: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Daha Fazla Bilgi"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aksiyon URL</label>
              <input
                type="url"
                value={formData.actionUrl}
                onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Banner aktif
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};