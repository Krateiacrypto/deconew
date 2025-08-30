import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  MapPin, 
  Megaphone,
  Eye,
  History,
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Globe,
  Calendar,
  User,
  Save,
  X,
  Upload,
  Download,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useContentStore } from '../../store/contentStore';
import { ContentItem } from '../../types/content';
import toast from 'react-hot-toast';

type ContentSection = 'content' | 'roadmap' | 'team' | 'banners' | 'audit' | 'analytics';

export const ContentManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    content, 
    roadmap,
    team,
    banners,
    auditLogs, 
    fetchContent, 
    fetchRoadmap,
    fetchTeam,
    fetchBanners,
    fetchAuditLogs, 
    createContent, 
    updateContent, 
    deleteContent,
    publishContent,
    unpublishContent,
    isLoading 
  } = useContentStore();
  
  const [activeSection, setActiveSection] = useState<ContentSection>('content');
  const [selectedContentType, setSelectedContentType] = useState<ContentItem['type']>('news');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContent();
    fetchRoadmap();
    fetchTeam();
    fetchBanners();
    fetchAuditLogs();
  }, [fetchContent, fetchRoadmap, fetchTeam, fetchBanners, fetchAuditLogs]);

  const contentTypes = [
    { type: 'news' as const, label: 'Haberler', icon: FileText, color: 'blue' },
    { type: 'mission' as const, label: 'Misyon', icon: FileText, color: 'emerald' },
    { type: 'vision' as const, label: 'Vizyon', icon: FileText, color: 'purple' },
    { type: 'values' as const, label: 'Değerler', icon: FileText, color: 'orange' },
    { type: 'announcement' as const, label: 'Duyurular', icon: Megaphone, color: 'red' }
  ];

  const sections = [
    { id: 'content' as const, label: 'İçerik Yönetimi', icon: FileText, count: content.length },
    { id: 'roadmap' as const, label: 'Roadmap', icon: MapPin, count: roadmap.length },
    { id: 'team' as const, label: 'Ekip', icon: Users, count: team.length },
    { id: 'banners' as const, label: 'Banner\'lar', icon: Megaphone, count: banners.length },
    { id: 'analytics' as const, label: 'Analitik', icon: BarChart3, count: 0 },
    { id: 'audit' as const, label: 'Değişiklik Geçmişi', icon: History, count: auditLogs.length }
  ];

  const filteredContent = content.filter(item => {
    const matchesType = item.type === selectedContentType;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesType && matchesSearch && matchesStatus;
  });

  const handleSave = async (data: Partial<ContentItem>) => {
    try {
      if (editingItem) {
        await updateContent(editingItem.id, data);
        toast.success('İçerik güncellendi!');
      } else {
        await createContent({
          ...data,
          type: selectedContentType,
          createdBy: user?.id || 'admin',
          updatedBy: user?.id || 'admin'
        } as Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>);
        toast.success('İçerik oluşturuldu!');
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('İşlem başarısız!');
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setSelectedContentType(item.type);
    setShowForm(true);
  };

  const handleView = (item: ContentItem) => {
    setViewingItem(item);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      try {
        await deleteContent(id);
        toast.success('İçerik silindi!');
      } catch (error) {
        toast.error('Silme işlemi başarısız!');
      }
    }
  };

  const handlePublish = async (item: ContentItem) => {
    try {
      if (item.status === 'published') {
        await unpublishContent(item.id);
        toast.success('İçerik yayından kaldırıldı!');
      } else {
        await publishContent(item.id);
        toast.success('İçerik yayınlandı!');
      }
    } catch (error) {
      toast.error('İşlem başarısız!');
    }
  };

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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">İçerik & Tasarım Yönetimi</h1>
              <p className="text-gray-600">Website içeriklerini profesyonel şekilde yönetin</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                <span>Backup Al</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                <span>İçe Aktar</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span>{section.label}</span>
                  {section.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeSection === section.id ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {section.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeSection === 'content' && (
            <div className="space-y-6">
              {/* Content Type Selector */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">İçerik Türü Seçin</h3>
                  <button
                    onClick={handleCreate}
                    className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni İçerik</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {contentTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => setSelectedContentType(type.type)}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedContentType === type.type
                          ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      <div className={`w-12 h-12 bg-${type.color}-100 rounded-xl flex items-center justify-center`}>
                        <type.icon className={`w-6 h-6 text-${type.color}-600`} />
                      </div>
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-gray-500">
                        {content.filter(c => c.type === type.type).length} içerik
                      </span>
                    </button>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="İçerik ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">Tüm Durumlar</option>
                    <option value="published">Yayında</option>
                    <option value="draft">Taslak</option>
                    <option value="archived">Arşivlendi</option>
                  </select>
                </div>
              </div>

              {/* Content List */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {filteredContent.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredContent.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                                item.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.status === 'published' ? 'Yayında' :
                                 item.status === 'draft' ? 'Taslak' : 'Arşivlendi'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                contentTypes.find(t => t.type === item.type)?.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                contentTypes.find(t => t.type === item.type)?.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                                contentTypes.find(t => t.type === item.type)?.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                contentTypes.find(t => t.type === item.type)?.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {contentTypes.find(t => t.type === item.type)?.label}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {item.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                            </p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{item.updatedBy}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(item.updatedAt).toLocaleDateString('tr-TR')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4" />
                                <span>v{item.version}</span>
                              </div>
                              {item.publishedAt && (
                                <div className="flex items-center space-x-1">
                                  <Globe className="w-4 h-4" />
                                  <span>Yayın: {new Date(item.publishedAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleView(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Görüntüle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePublish(item)}
                              className={`p-2 rounded-lg transition-colors ${
                                item.status === 'published' 
                                  ? 'text-orange-600 hover:bg-orange-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={item.status === 'published' ? 'Yayından Kaldır' : 'Yayınla'}
                            >
                              <Globe className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">İçerik bulunamadı</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Arama kriterlerinize uygun içerik bulunamadı.' 
                        : `Henüz ${contentTypes.find(t => t.type === selectedContentType)?.label.toLowerCase()} eklenmemiş.`}
                    </p>
                    <button
                      onClick={handleCreate}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      İlk İçeriği Ekle
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {activeSection !== 'content' && (
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {sections.find(s => s.id === activeSection)?.icon && (
                  React.createElement(sections.find(s => s.id === activeSection)!.icon, {
                    className: "w-8 h-8 text-gray-400"
                  })
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
              <p className="text-gray-600">Bu bölüm yakında eklenecek.</p>
            </div>
          )}
        </div>

        {/* Content Form Modal */}
        {showForm && (
          <ContentFormModal
            item={editingItem}
            type={selectedContentType}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            isLoading={isLoading}
          />
        )}

        {/* View Modal */}
        {viewingItem && (
          <ContentViewModal
            item={viewingItem}
            onClose={() => setViewingItem(null)}
            onEdit={() => {
              setViewingItem(null);
              handleEdit(viewingItem);
            }}
            onPublish={() => {
              handlePublish(viewingItem);
              setViewingItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Content Form Modal Component
interface ContentFormModalProps {
  item?: ContentItem | null;
  type: ContentItem['type'];
  onSave: (data: Partial<ContentItem>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ContentFormModal: React.FC<ContentFormModalProps> = ({
  item,
  type,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    content: item?.content || '',
    excerpt: item?.excerpt || '',
    image: item?.image || '',
    status: item?.status || 'draft' as ContentItem['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {item ? 'İçerik Düzenle' : 'Yeni İçerik Oluştur'}
          </h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {(type === 'news' || type === 'announcement') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Özet</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resim URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentItem['status'] })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
                <option value="archived">Arşivlendi</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
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
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Content View Modal Component
interface ContentViewModalProps {
  item: ContentItem;
  onClose: () => void;
  onEdit: () => void;
  onPublish: () => void;
}

const ContentViewModal: React.FC<ContentViewModalProps> = ({
  item,
  onClose,
  onEdit,
  onPublish
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Oluşturan: {item.createdBy}</span>
              <span>Son güncelleme: {new Date(item.updatedAt).toLocaleString('tr-TR')}</span>
              <span>Versiyon: {item.version}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {item.image && (
          <div className="mb-6">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="prose max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </div>
        
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
              item.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {item.status === 'published' ? 'Yayında' :
               item.status === 'draft' ? 'Taslak' : 'Arşivlendi'}
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Düzenle
            </button>
            <button
              onClick={onPublish}
              className={`px-4 py-2 rounded-lg transition-colors ${
                item.status === 'published'
                  ? 'border border-orange-300 text-orange-700 hover:bg-orange-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {item.status === 'published' ? 'Yayından Kaldır' : 'Yayınla'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};