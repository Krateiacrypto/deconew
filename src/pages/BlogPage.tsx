import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Tag, ArrowRight, TrendingUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';
import { BlogPostCard } from '../components/blog/BlogPostCard';
import { BlogFilters } from '../components/blog/BlogFilters';
import { BlogPagination } from '../components/blog/BlogPagination';
import { BlogFilters as BlogFiltersType, PaginationInfo } from '../types/blog';

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    posts, 
    categories, 
    stats,
    fetchPosts, 
    fetchCategories, 
    fetchStats,
    searchPosts,
    isLoading 
  } = useBlogStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BlogFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9
  });
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm]);

  const loadInitialData = async () => {
    await Promise.all([
      fetchCategories(),
      fetchStats()
    ]);
    
    // Load featured posts (first 2 published posts)
    const { posts: allPosts } = await fetchPosts({ status: 'published' }, 1, 2);
    setFeaturedPosts(allPosts);
    
    loadPosts();
  };

  const loadPosts = async () => {
    const { posts: fetchedPosts, pagination: paginationInfo } = await fetchPosts(
      filters, 
      pagination.currentPage, 
      pagination.itemsPerPage
    );
    setPagination(paginationInfo);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const searchResults = await searchPosts(searchTerm);
      // Update pagination for search results
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(searchResults.length / pagination.itemsPerPage),
        totalItems: searchResults.length,
        itemsPerPage: pagination.itemsPerPage
      });
    } else {
      loadPosts();
    }
  };

  const handleFiltersChange = (newFilters: BlogFiltersType) => {
    setFilters(newFilters);
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadMore = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              DECARBONIZE Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Karbon kredisi, sürdürülebilirlik ve blockchain teknolojileri hakkında 
              uzman görüşleri ve güncel gelişmeler
            </p>
            
            {/* Blog Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">{stats.totalPosts}</div>
                <div className="text-sm text-gray-600">Toplam Yazı</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Görüntülenme</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{stats.totalLikes}</div>
                <div className="text-sm text-gray-600">Beğeni</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{stats.totalComments}</div>
                <div className="text-sm text-gray-600">Yorum</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Öne Çıkan Yazılar</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onReadMore={handleReadMore}
                  variant="featured"
                />
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Blog yazılarında ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    showFilters ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtreler</span>
                </button>
              </div>
            </motion.div>

            {/* Blog Posts Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-300"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded mb-3"></div>
                        <div className="h-4 bg-gray-300 rounded mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                        onReadMore={handleReadMore}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-12">
                      <BlogPagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Blog yazısı bulunamadı</h3>
                  <p className="text-gray-600">Arama kriterlerinize uygun blog yazısı bulunamadı.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BlogFilters
                  categories={categories}
                  filters={filters}
                  searchTerm={searchTerm}
                  onFiltersChange={handleFiltersChange}
                  onSearchChange={setSearchTerm}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>
            )}

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kategoriler</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleFiltersChange({ ...filters, category: undefined })}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !filters.category ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Tümü ({stats.publishedPosts})
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleFiltersChange({ 
                      ...filters, 
                      category: filters.category === category.name ? undefined : category.name 
                    })}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      filters.category === category.name ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500">({category.postCount})</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-emerald-600 to-blue-700 rounded-2xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-3">Blog Güncellemeleri</h3>
              <p className="text-emerald-100 mb-4">
                Yeni blog yazılarımızdan haberdar olmak için e-posta listemize katılın.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-emerald-600 py-2 px-4 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                  Abone Ol
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Öne Çıkan Yazılar</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-medium">
                      Öne Çıkan
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.publishedAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium">
                      <span>Devamını Oku</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Tüm Yazılar</h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-400 to-blue-500">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Tag className="w-12 h-12 text-white opacity-80" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.publishedAt}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-medium">
                        <span>Oku</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Yazı bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinize uygun blog yazısı bulunamadı.</p>
            </div>
          )}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-emerald-600 to-blue-700 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Blog Güncellemelerini Kaçırmayın</h3>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Karbon kredisi ve sürdürülebilirlik konularındaki en güncel yazılarımızı 
            e-posta ile alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
              Abone Ol
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};