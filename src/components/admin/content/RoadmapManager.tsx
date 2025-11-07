import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import { RoadmapItem } from '../../../types/content';
import { useContentStore } from '../../../store/contentStore';

export const RoadmapManager: React.FC = () => {
  const { roadmap, fetchRoadmap, createRoadmapItem, updateRoadmapItem, deleteRoadmapItem, reorderRoadmap, isLoading } = useContentStore();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const handleSave = async (data: Partial<RoadmapItem>) => {
    if (editingItem) {
      await updateRoadmapItem(editingItem.id, data);
    } else {
      await createRoadmapItem({
        ...data,
        order: roadmap.length + 1
      } as Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu roadmap öğesini silmek istediğinizden emin misiniz?')) {
      await deleteRoadmapItem(id);
    }
  };

  const getStatusIcon = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'active':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'upcoming':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: RoadmapItem['status']) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-200 bg-emerald-50';
      case 'active':
        return 'border-blue-200 bg-blue-50';
      case 'upcoming':
        return 'border-gray-200 bg-gray-50';
      case 'cancelled':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Roadmap Yönetimi</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Milestone</span>
        </button>
      </div>

      {/* Roadmap Items */}
      <div className="space-y-4">
        {roadmap.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-6 rounded-xl border-2 ${getStatusColor(item.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  {getStatusIcon(item.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
                      {item.phase}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="space-y-2">
                    {item.items.map((subItem, subIndex) => (
                      <div key={subIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span>{subItem}</span>
                      </div>
                    ))}
                  </div>
                  
                  {(item.startDate || item.endDate) && (
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      {item.startDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Başlangıç: {new Date(item.startDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                      {item.endDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Bitiş: {new Date(item.endDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setShowForm(true);
                  }}
                  className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <RoadmapForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface RoadmapFormProps {
  item?: RoadmapItem | null;
  onSave: (data: Partial<RoadmapItem>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RoadmapForm: React.FC<RoadmapFormProps> = ({ item, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    phase: item?.phase || '',
    title: item?.title || '',
    description: item?.description || '',
    status: item?.status || 'upcoming' as RoadmapItem['status'],
    startDate: item?.startDate || '',
    endDate: item?.endDate || '',
    items: item?.items || ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      items: formData.items.filter(item => item.trim() !== '')
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, '']
    });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = value;
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
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
            {item ? 'Milestone Düzenle' : 'Yeni Milestone'}
          </h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faz</label>
              <input
                type="text"
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Q1 2024"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as RoadmapItem['status'] })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="upcoming">Yakında</option>
                <option value="active">Aktif</option>
                <option value="completed">Tamamlandı</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Görevler</label>
              <button
                type="button"
                onClick={addItem}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                + Görev Ekle
              </button>
            </div>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Görev açıklaması"
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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