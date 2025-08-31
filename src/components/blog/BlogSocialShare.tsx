import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Facebook, Linkedin, Link, Copy, MessageCircle, Mail } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import toast from 'react-hot-toast';

interface BlogSocialShareProps {
  post: BlogPost;
  className?: string;
}

export const BlogSocialShare: React.FC<BlogSocialShareProps> = ({ post, className = '' }) => {
  const postUrl = `${window.location.origin}/blog/${post.slug}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const encodedExcerpt = encodeURIComponent(post.excerpt);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=karbon,sürdürülebilirlik,blockchain`,
      color: 'hover:bg-blue-50 hover:text-blue-600',
      bgColor: 'bg-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-50 hover:text-blue-700',
      bgColor: 'bg-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`,
      color: 'hover:bg-blue-50 hover:text-blue-800',
      bgColor: 'bg-blue-800'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-green-50 hover:text-green-600',
      bgColor: 'bg-green-600'
    },
    {
      name: 'E-posta',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedExcerpt}%0A%0A${encodedUrl}`,
      color: 'hover:bg-gray-50 hover:text-gray-600',
      bgColor: 'bg-gray-600'
    }
  ];

  const [shareCount, setShareCount] = useState(() => {
    const shares = localStorage.getItem(`blog-shares-${post.id}`);
    return shares ? parseInt(shares) : 0;
  });
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: postUrl
        });
        toast.success('Paylaşıldı!');
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success('Link kopyalandı!');
    } catch (error) {
      toast.error('Link kopyalanamadı');
    }
  };

  const handleSocialShare = (url: string, platform: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    
    // Increment share count
    const newCount = shareCount + 1;
    setShareCount(newCount);
    localStorage.setItem(`blog-shares-${post.id}`, newCount.toString());
    
    toast.success(`${platform}'da paylaşıldı!`);
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-lg ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Share2 className="w-5 h-5 text-emerald-600" />
        <h4 className="font-medium text-gray-900">Paylaş</h4>
        {shareCount > 0 && (
          <span className="text-sm text-gray-500">({shareCount} paylaşım)</span>
        )}
      </div>

      <div className="space-y-3">
        {/* Native Share (Mobile) */}
        <button
          onClick={handleNativeShare}
          className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors md:hidden"
        >
          <Share2 className="w-5 h-5" />
          <span>Paylaş</span>
        </button>

        {/* Social Media Links */}
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleSocialShare(link.url, link.name)}
            className={`w-full flex items-center space-x-3 p-3 text-gray-700 rounded-lg transition-all transform hover:scale-105 ${link.color}`}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </button>
        ))}

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all transform hover:scale-105"
        >
          <Copy className="w-5 h-5" />
          <span>Linki Kopyala</span>
        </button>
      </div>

      {/* Post Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{post.views}</div>
            <div className="text-xs text-gray-600">Görüntülenme</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{post.likes}</div>
            <div className="text-xs text-gray-600">Beğeni</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{shareCount}</div>
            <div className="text-xs text-gray-600">Paylaşım</div>
          </div>
        </div>
      </div>
    </div>
  );
};