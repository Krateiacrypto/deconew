import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Globe, 
  FileText,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  MessageCircle
} from 'lucide-react';
import { BlogPost, BlogStats, BlogFilters, PaginationInfo } from '../../types/blog';
import { useBlogStore } from '../../store/blogStore';
import { useAuthStore } from '../../store/authStore';
import { BlogPostForm } from '../../components/blog/BlogPostForm';
import { BlogPagination } from '../../components/blog/BlogPagination';
import toast from 'react-hot-toast';

export const BlogManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    posts, 
    stats, 
    categories,
    fetchPosts, 
    fetchStats, 
    fetchCategories,
    deletePost, 
    publishPost, 
    unpublishPost,
    isLoading 
  } = useBlogStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BlogFilters>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [filters, pagination.currentPage, searchTerm]);

  const loadData = async () => {
    await Promise.all([
      fetchStats(),
      fetchCategories()
    ]);
  };

  const loadPosts = async () => {
    const searchFilters = searchTerm ? { ...filters } : filters;
    const { posts: fetchedPosts, pagination: paginationInfo } = await fetchPosts(
      searchFilters, 
      pagination.currentPage, 
      pagination.itemsPerPage
    );
    
    // Apply search filter on frontend if needed
    let filteredPosts = fetchedPosts;
    if (searchTerm) {
      filteredPosts = fetchedPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setPagination(paginationInfo);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      try {
        await deletePost(postId);
        toast.success('Blog yazısı silindi!');
        loadPosts();
        fetchStats();
      } catch (error) {
        toast.error('Blog yazısı silinemedi!');
      }
    }
  };

  const handlePublishToggle = async (post: BlogPost) => {
    try {
      if (post.status === 'published') {
        await unpublishPost(post.id);
        toast.success('Blog yazısı yayından kaldırıldı!');
      } else {
        await publishPost(post.id);
        toast.success('Blog yazısı yayınlandı!');
      }
      loadPosts();
      fetchStats();
    } catch (error) {
      toast.error('İşlem başarısız!');
    }
  };

  const handleFormSave = (savedPost: BlogPost) => {
    setShowForm(false);
    setEditingPost(null);
    loadPosts();
    fetchStats();
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const statsCards = [
    {
      title: 'Toplam Yazı',
      value: stats.totalPosts,
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Toplam Görüntülenme',
      value: stats.totalViews,
      icon: Eye,
      color: 'emerald'
    },
    {
      title: 'Toplam Beğeni',
      value: stats.totalLikes,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Toplam Yorum',
      value: stats.totalComments,
      icon: MessageCircle,
      color: 'orange'
    }
  ];

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

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPostForm
            post={editingPost || undefined}
            onSave={handleFormSave}
            onCancel={() => {
              setShowForm(false);
              setEditingPost(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog Yönetimi</h1>
            <p className="text-gray-600">Blog yazılarını oluşturun, düzenleyin ve yönetin</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Blog Yazısı</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any || undefined })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Tüm Durumlar</option>
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Yazı</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Yazar</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Kategori</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">İstatistikler</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Tarih</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-start space-x-3">
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1 mt-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {post.authorAvatar && (
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-900">{post.author}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.category === 'Karbon Kredisi' ? 'bg-emerald-100 text-emerald-800' :
                        post.category === 'Sürdürülebilirlik' ? 'bg-blue-100 text-blue-800' :
                        post.category === 'Blockchain' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(post.updatedAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handlePublishToggle(post)}
                          className={`p-2 rounded-lg ${
                            post.status === 'published' 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={post.status === 'published' ? 'Yayından Kaldır' : 'Yayınla'}
                        >
                          <Globe className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Blog yazısı bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || Object.keys(filters).length > 0 
                  ? 'Arama kriterlerinize uygun blog yazısı bulunamadı.' 
                  : 'Henüz blog yazısı eklenmemiş.'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                İlk Blog Yazısını Ekle
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <BlogPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};