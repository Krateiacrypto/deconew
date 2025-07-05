import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Globe,
  FileText
} from 'lucide-react';
import { ContentItem } from '../../../types/content';

interface ContentListProps {
  content: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onView: (item: ContentItem) => void;
  onCreate: () => void;
  title: string;
  type: ContentItem['type'];
}

export const ContentList: React.FC<ContentListProps> = ({
  content,
  onEdit,
  onDelete,
  onView,
  onCreate,
  title,
  type
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContent = content.filter(item => {
    const matchesType = item.type === type;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesType && matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: ContentItem['status']) => {
    switch (status) {
      case 'published':
        return 'Yayında';
      case 'draft':
        return 'Taslak';
      case 'archived':
        return 'Arşivlendi';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onCreate}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ekle</span>
        </button>
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

      {/* Content List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredContent.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onView(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
                          onDelete(item.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                : 'Henüz içerik eklenmemiş.'}
            </p>
            <button
              onClick={onCreate}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              İlk İçeriği Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};