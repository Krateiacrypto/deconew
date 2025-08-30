import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Eye, Upload, Calendar, Globe, Type, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { ContentItem } from '../../../types/content';
import { ContentEditor } from './ContentEditor';

interface ContentFormProps {
  item?: ContentItem;
  type: ContentItem['type'];
  onSave: (data: Partial<ContentItem>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ContentForm: React.FC<ContentFormProps> = ({
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
    status: item?.status || 'draft' as ContentItem['status'],
    publishedAt: item?.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
    metadata: item?.metadata || {}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreview, setIsPreview] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'İçerik gereklidir';
    }

    if (formData.title.length > 200) {
      newErrors.title = 'Başlık 200 karakterden uzun olamaz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData: Partial<ContentItem> = {
      ...formData,
      type,
      updatedBy: 'admin',
      publishedAt: formData.status === 'published' && formData.publishedAt 
        ? new Date(formData.publishedAt).toISOString() 
        : undefined
    };

    onSave(submitData);
  };

  const handlePublish = () => {
    if (!validateForm()) return;

    const submitData: Partial<ContentItem> = {
      ...formData,
      type,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedBy: 'admin'
    };

    onSave(submitData);
  };

  const getTypeTitle = (type: ContentItem['type']) => {
    switch (type) {
      case 'news': return 'Haber';
      case 'mission': return 'Misyon';
      case 'vision': return 'Vizyon';
      case 'values': return 'Değerler';
      case 'announcement': return 'Duyuru';
      default: return 'İçerik';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {item ? 'Düzenle' : 'Yeni'} {getTypeTitle(type)}
          </h2>
          <p className="text-gray-600 mt-1">
            {item ? 'Mevcut içeriği düzenleyin' : 'Yeni içerik oluşturun'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{isPreview ? 'Düzenle' : 'Önizle'}</span>
          </button>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        {isPreview ? (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title}</h1>
              {formData.image && (
                <img
                  src={formData.image}
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              {formData.excerpt && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">{formData.excerpt}</p>
              )}
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4" />
                <span>Başlık *</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="İçerik başlığını girin"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.title}</span>
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/200 karakter
              </p>
            </div>

            {/* Excerpt (for news and announcements) */}
            {(type === 'news' || type === 'announcement') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özet
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Kısa özet yazın (SEO ve sosyal medya paylaşımları için)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Sosyal medya paylaşımlarında ve arama sonuçlarında görünecek
                </p>
              </div>
            )}

            {/* Image URL */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4" />
                <span>Kapak Resmi</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Resim Yükle"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              {formData.image && (
                <div className="mt-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İçerik *
              </label>
              <ContentEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="İçeriğinizi buraya yazın..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.content}</span>
                </p>
              )}
            </div>

            {/* Status and Publish Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
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

              {formData.status === 'published' && (
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Yayın Tarihi</span>
                  </label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Actions */}
      {!isPreview && (
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>

          <div className="flex space-x-3">
            {formData.status !== 'published' && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Hemen Yayınla</span>
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};