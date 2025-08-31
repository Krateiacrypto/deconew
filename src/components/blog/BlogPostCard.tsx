import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Heart, 
  MessageCircle, 
  Eye, 
  Clock,
  ArrowRight,
  Share2
} from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { useBlogStore } from '../../store/blogStore';
import toast from 'react-hot-toast';

interface BlogPostCardProps {
  post: BlogPost;
  onReadMore: (slug: string) => void;
  showActions?: boolean;
  variant?: 'default' | 'featured' | 'compact';
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  onReadMore,
  showActions = true,
  variant = 'default'
}) => {
  const { likePost } = useBlogStore();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await likePost(post.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: `${window.location.origin}/blog/${post.slug}`
        });
        toast.success('Paylaşıldı!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          await navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
          toast.success('Link kopyalandı!');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
        toast.success('Link kopyalandı!');
      } catch (error) {
        toast.error('Link kopyalanamadı');
      }
    }
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

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg"
        onClick={() => onReadMore(post.slug)}
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{post.title}</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                <span>{post.author}</span>
                <span>•</span>
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readTime} dk</span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{post.excerpt}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl"
        onClick={() => onReadMore(post.slug)}
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={post.coverImage || 'https://images.pexels.com/photos/9324302/pexels-photo-9324302.jpeg'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-medium">
              Öne Çıkan
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 mb-3">
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
              <span>{post.readTime} dk</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
            
            {showActions && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{post.views}</span>
                </div>
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors transform hover:scale-110"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors transform hover:scale-110"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-xl"
      onClick={() => onReadMore(post.slug)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage || 'https://images.pexels.com/photos/9324302/pexels-photo-9324302.jpeg'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Reading time badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
          {post.readTime} dk
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          
          {showActions && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{post.views}</span>
              </div>
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors transform hover:scale-110"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors transform hover:scale-110"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {post.authorAvatar && (
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-gray-600">{post.author}</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 group-hover:text-emerald-700">
              <span className="text-sm font-medium">Devamını Oku</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};