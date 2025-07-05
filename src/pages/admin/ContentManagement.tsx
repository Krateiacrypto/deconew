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
  Filter
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useContentStore } from '../../store/contentStore';
import { ContentList } from '../../components/admin/content/ContentList';
import { ContentForm } from '../../components/admin/content/ContentForm';
import { RoadmapManager } from '../../components/admin/content/RoadmapManager';
import { TeamManager } from '../../components/admin/content/TeamManager';
import { BannerManager } from '../../components/admin/content/BannerManager';
import { ContentItem } from '../../types/content';

type ContentSection = 'content' | 'roadmap' | 'team' | 'banners' | 'audit';

export const ContentManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    content, 
    auditLogs, 
    fetchContent, 
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
    fetchAuditLogs();
  }, [fetchContent, fetchAuditLogs]);

  const contentTypes = [
    { type: 'news' as const, label: 'Haberler', icon: FileText },
    { type: 'mission' as const, label: 'Misyon', icon: FileText },
    { type: 'vision' as const, label: 'Vizyon', icon: FileText },
    { type: 'values' as const, label: 'Değerler', icon: FileText },
    { type: 'announcement' as const, label: 'Duyurular', icon: Megaphone }
  ];

  const sections = [
    { id: 'content' as const, label: 'İçerik Yönetimi', icon: FileText },
    { id: 'roadmap' as const, label: 'Roadmap', icon: MapPin },
    { id: 'team' as const, label: 'Ekip', icon: Users },
    { id: 'banners' as const, label: 'Banner\'lar', icon: Megaphone },
    { id: 'audit' as const, label: 'Değişiklik Geçmişi', icon: History }
  ];

  const handleSave = async (data: Partial<ContentItem>) => {
    if (editingItem) {
      await updateContent(editingItem.id, data);
    } else {
      await createContent({
        ...data,
        type: selectedContentType,
        createdBy: user?.id || 'admin'
      } as Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>);
    }
    setShowForm(false);
    setEditingItem(null);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">İçerik & Tasarım Yönetimi</h1>
          <p className="text-gray-600">Website içeriklerini yönetin ve düzenleyin</p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeSection === section.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span>{section.label}</span>
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
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">İçerik Türü Seçin</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {contentTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => setSelectedContentType(type.type)}
                      className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-colors ${
                        selectedContentType === type.type
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <type.icon className="w-5 h-5" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content List or Form */}
              {showForm ? (
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
              ) : (
                <ContentList
                  content={content}
                  type={selectedContentType}
                  title={contentTypes.find(t => t.type === selectedContentType)?.label || 'İçerik'}
                  onEdit={handleEdit}
                  onDelete={deleteContent}
                  onView={handleView}
                  onCreate={handleCreate}
                />
              )}
            </div>
          )}

          {activeSection === 'roadmap' && <RoadmapManager />}
          {activeSection === 'team' && <TeamManager />}
          {activeSection === 'banners' && <BannerManager />}

          {activeSection === 'audit' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Değişiklik Geçmişi</h3>
                <p className="text-gray-600 mt-1">Tüm içerik değişikliklerinin detaylı kaydı</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.action === 'create' ? 'bg-emerald-100 text-emerald-700' :
                            log.action === 'update' ? 'bg-blue-100 text-blue-700' :
                            log.action === 'delete' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {log.action === 'create' ? 'Oluşturuldu' :
                             log.action === 'update' ? 'Güncellendi' :
                             log.action === 'delete' ? 'Silindi' :
                             log.action === 'publish' ? 'Yayınlandı' : 'Yayından Kaldırıldı'}
                          </span>
                          <span className="text-sm text-gray-600">{log.contentType}</span>
                        </div>
                        
                        <p className="text-gray-900 font-medium mb-1">
                          {log.userName} tarafından değiştirildi
                        </p>
                        
                        <p className="text-sm text-gray-600">
                          {new Date(log.timestamp).toLocaleString('tr-TR')}
                        </p>
                        
                        {Object.keys(log.changes).length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Değişiklikler:</p>
                            {Object.entries(log.changes).map(([field, change]) => (
                              <div key={field} className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">{field}:</span>
                                <span className="text-red-600 line-through ml-1">{String(change.old).substring(0, 50)}</span>
                                <span className="text-emerald-600 ml-1">{String(change.new).substring(0, 50)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {auditLogs.length === 0 && (
                  <div className="p-12 text-center">
                    <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz değişiklik yok</h3>
                    <p className="text-gray-600">İçerik değişiklikleri burada görünecek</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{viewingItem.title}</h3>
                <button
                  onClick={() => setViewingItem(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: viewingItem.content }} />
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>Oluşturan: {viewingItem.createdBy}</p>
                  <p>Son güncelleme: {new Date(viewingItem.updatedAt).toLocaleString('tr-TR')}</p>
                  <p>Versiyon: {viewingItem.version}</p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setViewingItem(null);
                      handleEdit(viewingItem);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Düzenle
                  </button>
                  {viewingItem.status === 'published' ? (
                    <button
                      onClick={() => {
                        unpublishContent(viewingItem.id);
                        setViewingItem(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Yayından Kaldır
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        publishContent(viewingItem.id);
                        setViewingItem(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Yayınla
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};