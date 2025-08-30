import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Clock, 
  Heart, 
  Eye, 
  ArrowLeft,
  Share2,
  Tag,
  MessageCircle
} from 'lucide-react';
import { BlogPost } from '../types/blog';
import { useBlogStore } from '../store/blogStore';
import { BlogComments } from '../components/blog/BlogComments';
import { BlogSocialShare } from '../components/blog/BlogSocialShare';
import { BlogPostCard } from '../components/blog/BlogPostCard';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { fetchPost, likePost, incrementViews, fetchPosts } = useBlogStore();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;
    
    setIsLoading(true);
    
    try {
      const foundPost = await fetchPost(slug);
      
      if (!foundPost) {
        navigate('/blog');
        return;
      }
      
      setPost(foundPost);
      
      // Increment views
      await incrementViews(foundPost.id);
      
      // Load related posts
      const { posts } = await fetchPosts({ category: foundPost.category }, 1, 4);
      setRelatedPosts(posts.filter(p => p.id !== foundPost.id).slice(0, 3));
      
    } catch (error) {
      navigate('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || hasLiked) return;
    
    await likePost(post.id);
    setPost({ ...post, likes: post.likes + 1 });
    setHasLiked(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Karbon Kredisi': 'bg-emerald-100 text-emerald-800',
      'Sürdürülebilirlik': 'bg-blue-100 text-blue-800',
      'Blockchain': 'bg-purple-100 text-purple-800',
      'Yenilenebilir Enerji': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog yazısı bulunamadı</h2>
          <p className="text-gray-600 mb-4">Aradığınız blog yazısı mevcut değil.</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            Blog'a Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/blog')}
          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Blog'a Dön</span>
        </motion.button>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}

              <div className="p-8">
                {/* Post Meta */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} dakika okuma</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none prose-emerald prose-headings:text-gray-900 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Etiketler</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye className="w-5 h-5" />
                        <span>{post.views} görüntülenme</span>
                      </div>
                      
                      <button
                        onClick={handleLike}
                        disabled={hasLiked}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          hasLiked 
                            ? 'bg-red-100 text-red-700 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes} beğeni</span>
                      </button>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center space-x-3">
                      {post.authorAvatar && (
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{post.author}</p>
                        <p className="text-sm text-gray-600">Yazar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <BlogComments postId={post.id} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Share */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <BlogSocialShare post={post} />
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">İlgili Yazılar</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <BlogPostCard
                      key={relatedPost.id}
                      post={relatedPost}
                      onReadMore={(slug) => navigate(`/blog/${slug}`)}
                      variant="compact"
                      showActions={false}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-600 to-blue-700 rounded-xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-3">Blog Güncellemeleri</h3>
              <p className="text-emerald-100 text-sm mb-4">
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