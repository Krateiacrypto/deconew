import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Eye, Upload, Calendar, Globe } from 'lucide-react';
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'İçerik gereklidir';
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
      updatedBy: 'admin', // In real app, get from auth context
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {item ? 'Düzenle' : 'Yeni'} {getTypeTitle(type)}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="İçerik başlığını girin"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
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
                placeholder="Kısa özet yazın"
              />
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resim URL
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
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                title="Resim Yükle"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
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
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yayın Tarihi
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

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>

            <div className="flex space-x-3">
              {formData.status !== 'published' && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Globe className="w-4 h-4" />
                  <span>Yayınla</span>
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};