import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Palette
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useContentStore } from '../../store/contentStore';
import { ContentItem } from '../../types/content';
import { ContentList } from '../../components/admin/content/ContentList';
import { ContentForm } from '../../components/admin/content/ContentForm';
import { RoadmapManager } from '../../components/admin/content/RoadmapManager';
import { TeamManager } from '../../components/admin/content/TeamManager';
import { BannerManager } from '../../components/admin/content/BannerManager';
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

  useEffect(() => {
    fetchContent();
    fetchRoadmap();
    fetchTeam();
    fetchBanners();
    fetchAuditLogs();
  }, [fetchContent, fetchRoadmap, fetchTeam, fetchBanners, fetchAuditLogs]);

  const contentTypes = [
    { type: 'news' as const, label: 'Haberler', icon: FileText, color: 'blue', description: 'Platform haberleri ve güncellemeler' },
    { type: 'mission' as const, label: 'Misyon', icon: Star, color: 'emerald', description: 'Şirket misyonu ve hedefleri' },
    { type: 'vision' as const, label: 'Vizyon', icon: Eye, color: 'purple', description: 'Gelecek vizyonu ve stratejiler' },
    { type: 'values' as const, label: 'Değerler', icon: CheckCircle, color: 'orange', description: 'Kurumsal değerler ve prensipler' },
    { type: 'announcement' as const, label: 'Duyurular', icon: Megaphone, color: 'red', description: 'Önemli duyurular ve bildirimler' }
  ];

  const sections = [
    { id: 'content' as const, label: 'İçerik Yönetimi', icon: FileText, count: content.length, description: 'Blog, haberler ve sayfa içerikleri' },
    { id: 'roadmap' as const, label: 'Roadmap', icon: MapPin, count: roadmap.length, description: 'Proje yol haritası ve milestone\'lar' },
    { id: 'team' as const, label: 'Ekip', icon: Users, count: team.length, description: 'Ekip üyeleri ve organizasyon yapısı' },
    { id: 'banners' as const, label: 'Banner\'lar', icon: Megaphone, count: banners.length, description: 'Site banner\'ları ve duyuru çubukları' },
    { id: 'analytics' as const, label: 'Analitik', icon: BarChart3, count: 0, description: 'İçerik performans metrikleri' },
    { id: 'audit' as const, label: 'Değişiklik Geçmişi', icon: History, count: auditLogs.length, description: 'Tüm içerik değişiklik logları' }
  ];

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
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  const renderContentSection = () => (
    <div className="space-y-8">
      {/* Content Type Dashboard */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">İçerik Türleri</h3>
            <p className="text-gray-600">Yönetmek istediğiniz içerik türünü seçin</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni İçerik</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {contentTypes.map((type) => {
            const typeContent = content.filter(c => c.type === type.type);
            const publishedCount = typeContent.filter(c => c.status === 'published').length;
            
            return (
              <motion.button
                key={type.type}
                onClick={() => setSelectedContentType(type.type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedContentType === type.type
                    ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md'
                }`}
              >
                <div className={`w-16 h-16 bg-${type.color}-100 rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <type.icon className={`w-8 h-8 text-${type.color}-600`} />
                </div>
                <h4 className="font-bold text-gray-900 text-center mb-2">{type.label}</h4>
                <p className="text-sm text-gray-600 text-center mb-4">{type.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-white rounded-lg">
                    <div className="font-bold text-gray-900">{typeContent.length}</div>
                    <div className="text-gray-500">Toplam</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg">
                    <div className="font-bold text-emerald-600">{publishedCount}</div>
                    <div className="text-gray-500">Yayında</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content List */}
      <ContentList
        content={content}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
        title={contentTypes.find(t => t.type === selectedContentType)?.label || 'İçerik'}
        type={selectedContentType}
      />
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">İçerik Analitikleri</h3>
        <p className="text-gray-600 mb-6">İçerik performans metrikleri ve kullanıcı etkileşim verileri</p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {content.filter(c => c.status === 'published').length}
            </div>
            <div className="text-blue-800 font-medium">Yayında İçerik</div>
          </div>
          
          <div className="p-6 bg-emerald-50 rounded-xl">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {content.filter(c => c.status === 'draft').length}
            </div>
            <div className="text-emerald-800 font-medium">Taslak İçerik</div>
          </div>
          
          <div className="p-6 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.floor(Math.random() * 10000)}
            </div>
            <div className="text-purple-800 font-medium">Toplam Görüntülenme</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuditSection = () => (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Değişiklik Geçmişi</h3>
      
      {auditLogs.length > 0 ? (
        <div className="space-y-4">
          {auditLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.action === 'create' ? 'bg-emerald-100 text-emerald-700' :
                      log.action === 'update' ? 'bg-blue-100 text-blue-700' :
                      log.action === 'delete' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {log.action === 'create' ? 'Oluşturuldu' :
                       log.action === 'update' ? 'Güncellendi' :
                       log.action === 'delete' ? 'Silindi' :
                       log.action === 'publish' ? 'Yayınlandı' : 'Yayından Kaldırıldı'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{log.contentType}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>{log.userName}</strong> tarafından değiştirildi
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Henüz değişiklik kaydı bulunmuyor</p>
        </div>
      )}
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">İçerik & Tasarım Yönetimi</h1>
              <p className="text-gray-600">Website içeriklerini profesyonel şekilde yönetin</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Backup Al</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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
                  className={`flex items-center space-x-3 py-6 px-8 border-b-2 font-medium text-sm transition-colors whitespace-nowrap min-w-0 ${
                    activeSection === section.id
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{section.label}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                  {section.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
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
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'content' && renderContentSection()}
          {activeSection === 'roadmap' && <RoadmapManager />}
          {activeSection === 'team' && <TeamManager />}
          {activeSection === 'banners' && <BannerManager />}
          {activeSection === 'analytics' && renderAnalyticsSection()}
          {activeSection === 'audit' && renderAuditSection()}
        </motion.div>

        {/* Content Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <ContentForm
                item={editingItem}
                type={selectedContentType}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        <AnimatePresence>
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
        </AnimatePresence>
      </div>
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
        className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Oluşturan: {item.createdBy}</span>
              <span>Son güncelleme: {new Date(item.updatedAt).toLocaleString('tr-TR')}</span>
              <span>Versiyon: {item.version}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
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
              className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Düzenle</span>
            </button>
            <button
              onClick={onPublish}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                item.status === 'published'
                  ? 'border border-orange-300 text-orange-700 hover:bg-orange-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{item.status === 'published' ? 'Yayından Kaldır' : 'Yayınla'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};