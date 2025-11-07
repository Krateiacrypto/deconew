import React, { useState, useEffect, useCallback } from 'react';
import { createSafeHTML } from '../../utils/sanitizer';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  Globe,
  X,
  Upload,
  Tag,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  EyeOff
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../../types/blog';
import { BlogEditor } from './BlogEditor';
import { useBlogStore } from '../../store/blogStore';
import { useAuthStore } from '../../store/authStore';
import { useAsyncMutation } from '../../hooks/useAsyncOperation';

interface BlogPostFormProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

export const BlogPostForm: React.FC<BlogPostFormProps> = ({
  post,
  onSave,
  onCancel
}) => {
  const { user } = useAuthStore();
  const { categories, fetchCategories, createPost, updatePost, publishPost } = useBlogStore();
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    author: post?.author || user?.name || 'Admin',
    category: post?.category || '',
    tags: post?.tags.join(', ') || '',
    coverImage: post?.coverImage || '',
    status: post?.status || 'draft' as const,
    language: post?.language || 'tr' as const,
    seoTitle: post?.seoTitle || '',
    seoDescription: post?.seoDescription || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Auto-save mutation using useAsyncMutation hook
   * Preserves auto-save UI state management
   */
  const { mutate: performAutoSave, loading: autoSaveLoading } = useAsyncMutation(
    async () => {
      if (!post) {
        throw new Error('Cannot auto-save new post');
      }

      await updatePost(post.id, {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: 'draft' // Auto-save as draft
      });

      return { success: true };
    },
    {
      showErrorToast: false, // Silent error to avoid spam
      autoLog: true,
      onSuccess: () => {
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(null), 2000);
      },
      onError: () => {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus(null), 3000);
      },
    }
  );

  // Auto-save functionality with debouncing
  useEffect(() => {
    if (!post) return; // Only auto-save for existing posts

    const autoSaveTimer = setTimeout(() => {
      if (formData.title && formData.content) {
        setAutoSaveStatus('saving');
        performAutoSave();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [formData, post, performAutoSave]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'İçerik gereklidir';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Özet gereklidir';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori seçmelisiniz';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Yazar adı gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Blog post submission mutation using useAsyncMutation hook
   * Handles both create and update operations
   * Returns savedPost to trigger onSave callback
   */
  const { mutate: submitPost, loading: isSubmitting } = useAsyncMutation(
    async (shouldPublish: boolean = false) => {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: shouldPublish ? 'published' as const : formData.status,
        publishedAt: shouldPublish ? new Date().toISOString() : (post?.publishedAt || new Date().toISOString())
      };

      let savedPost: BlogPost;

      if (post) {
        await updatePost(post.id, postData);
        savedPost = { ...post, ...postData };
      } else {
        savedPost = await createPost(postData);
      }

      // Publish if requested and post was draft
      if (shouldPublish && post && post.status === 'draft') {
        await publishPost(post.id);
      }

      return savedPost;
    },
    {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: (payload?: boolean) => payload ? 'Blog yazısı yayınlandı!' : 'Blog yazısı kaydedildi!',
      errorMessage: 'Blog yazısı kaydedilirken hata oluştu',
      autoLog: true,
      onSuccess: (savedPost) => {
        onSave(savedPost);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent, shouldPublish = false) => {
    e.preventDefault();

    if (!validateForm()) return;

    await submitPost(shouldPublish);
  };

  const generateExcerpt = () => {
    const plainText = formData.content.replace(/<[^>]*>/g, '');
    const excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
    setFormData({ ...formData, excerpt });
  };

  const generateSEO = () => {
    setFormData({
      ...formData,
      seoTitle: formData.title + ' | DECARBONIZE Blog',
      seoDescription: formData.excerpt || formData.content.replace(/<[^>]*>/g, '').substring(0, 160)
    });
    toast.success('SEO bilgileri oluşturuldu');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a service like Cloudinary
      // For demo, we'll use a placeholder
      const imageUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg`;
      setFormData({ ...formData, coverImage: imageUrl });
      toast.success('Kapak görseli eklendi');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {post ? 'Blog Yazısı Düzenle' : 'Yeni Blog Yazısı'}
              </h2>
              <p className="text-gray-600 mt-1">
                <span>
                  {post ? `Son güncelleme: ${new Date(post.updatedAt).toLocaleString('tr-TR')}` : 'Yeni blog yazısı oluşturun'}
                </span>
                {autoSaveStatus && (
                  <span className="ml-4 flex items-center space-x-1">
                    {autoSaveStatus === 'saving' && (
                      <>
                        <Clock className="w-3 h-3 text-blue-600 animate-spin" />
                        <span className="text-blue-600 text-sm">Kaydediliyor...</span>
                      </>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 text-sm">Otomatik kaydedildi</span>
                      </>
                    )}
                    {autoSaveStatus === 'error' && (
                      <>
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span className="text-red-600 text-sm">Kaydetme hatası</span>
                      </>
                    )}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Düzenle' : 'Önizle'}</span>
              </button>
              
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {showPreview ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
                  <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{formData.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date().toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.max(1, Math.ceil(formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} dk okuma</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      formData.category === 'Karbon Kredisi' ? 'bg-emerald-100 text-emerald-800' :
                      formData.category === 'Sürdürülebilirlik' ? 'bg-blue-100 text-blue-800' :
                      formData.category === 'Blockchain' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {formData.category}
                    </span>
                  </div>
                  
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt={formData.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={createSafeHTML(formData.content)} />
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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
                    placeholder="Blog yazısının başlığını girin"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Özet *
                    </label>
                    <button
                      type="button"
                      onClick={generateExcerpt}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Otomatik Oluştur
                    </button>
                  </div>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.excerpt ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Blog yazısının kısa özetini yazın"
                  />
                  {errors.excerpt && (
                    <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                  )}
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik *
                  </label>
                  <BlogEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    height="500px"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Actions */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-4">Yayın Ayarları</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayında</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Kaydet</span>
                  </button>
                  
                  <button
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 text-white py-2 px-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Yayınla</span>
                  </button>
                </div>
                
                {isSubmitting && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>İşleniyor...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Post Settings */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-4">Yazı Ayarları</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yazar</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={user?.name || 'Yazar adı'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="etiket1, etiket2, etiket3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <label
                      type="button"
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                      title="Resim Yükle"
                    >
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.coverImage && (
                    <div className="mt-2">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dil</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as 'tr' | 'en' })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">SEO Ayarları</h3>
                <button
                  type="button"
                  onClick={generateSEO}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Otomatik Oluştur
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Başlık</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Açıklama</label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-4">Hızlı İşlemler</h3>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={generateExcerpt}
                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  📝 Özet Oluştur
                </button>
                <button
                  type="button"
                  onClick={generateSEO}
                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  🔍 SEO Optimize Et
                </button>
                <button
                  type="button"
                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  📊 Kelime Sayısı: {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length}
                </button>
                <button
                  type="button"
                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  ⏱️ Okuma Süresi: {Math.max(1, Math.ceil(formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} dakika
                </button>
              </div>
            </div>
            
            {/* Content Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-medium text-blue-900 mb-3">İçerik Rehberi</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Başlık 60 karakterden kısa olsun</li>
                <li>• Özet 160 karakterden kısa olsun</li>
                <li>• Kapak görseli 1200x630 px ideal</li>
                <li>• İçerik en az 300 kelime olsun</li>
                <li>• Alakalı etiketler ekleyin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};