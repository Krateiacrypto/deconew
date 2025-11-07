import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Tag, ArrowRight } from 'lucide-react';
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
    fetchPosts, 
    fetchCategories, 
    isLoading 
  } = useBlogStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BlogFiltersType>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9
  });
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [filters, pagination.currentPage, searchTerm]);

  const loadData = async () => {
    await fetchCategories();
    loadPosts();
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
    
    // Set featured posts (first 2 published posts)
    const published = fetchedPosts.filter(p => p.status === 'published');
    setFeaturedPosts(published.slice(0, 2));
  };

  const handleReadMore = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPagination({ ...pagination, currentPage: 1 });
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
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
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <BlogFilters
              categories={categories}
              filters={filters}
              searchTerm={searchTerm}
              onFiltersChange={setFilters}
              onSearchChange={setSearchTerm}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
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
          </div>
        </div>

        {/* All Blog Posts */}
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
          ) : posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Yazı bulunamadı</h3>
              <p className="text-gray-600">
                {searchTerm || Object.keys(filters).length > 0 
                  ? 'Arama kriterlerinize uygun blog yazısı bulunamadı.' 
                  : 'Henüz blog yazısı eklenmemiş.'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <BlogPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}

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