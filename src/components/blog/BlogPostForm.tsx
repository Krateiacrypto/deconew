import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../../types/blog';
import { BlogEditor } from './BlogEditor';
import { useBlogStore } from '../../store/blogStore';
import toast from 'react-hot-toast';

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
  const { categories, fetchCategories, createPost, updatePost, publishPost } = useBlogStore();
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    author: post?.author || 'Admin',
    category: post?.category || '',
    tags: post?.tags.join(', ') || '',
    coverImage: post?.coverImage || '',
    status: post?.status || 'draft' as const,
    language: post?.language || 'tr' as const,
    seoTitle: post?.seoTitle || '',
    seoDescription: post?.seoDescription || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const handleSubmit = async (e: React.FormEvent, shouldPublish = false) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
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

      if (shouldPublish && post && post.status === 'draft') {
        await publishPost(post.id);
      }

      toast.success(shouldPublish ? 'Blog yazısı yayınlandı!' : 'Blog yazısı kaydedildi!');
      onSave(savedPost);
    } catch (error) {
      toast.error('Blog yazısı kaydedilirken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
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
                {post ? `Son güncelleme: ${new Date(post.updatedAt).toLocaleString('tr-TR')}` : 'Yeni blog yazısı oluşturun'}
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{formData.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date().toLocaleDateString('tr-TR')}</span>
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
                  
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
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
                    height="400px"
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
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Kaydet</span>
                  </button>
                  
                  <button
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 text-white py-2 px-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Yayınla</span>
                  </button>
                </div>
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
                    <button
                      type="button"
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      title="Resim Yükle"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.coverImage && (
                    <div className="mt-2">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-full h-32 object-cover rounded-lg"
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
                  📊 Kelime Sayısı: {formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};