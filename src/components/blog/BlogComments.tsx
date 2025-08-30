import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Send, 
  User,
  Calendar,
  ThumbsUp
} from 'lucide-react';
import { BlogComment } from '../../types/blog';
import { useBlogStore } from '../../store/blogStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface BlogCommentsProps {
  postId: string;
}

export const BlogComments: React.FC<BlogCommentsProps> = ({ postId }) => {
  const { user } = useAuthStore();
  const { fetchComments, addComment, likeComment, deleteComment } = useBlogStore();
  
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    const postComments = await fetchComments(postId);
    setComments(postComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!user) {
      toast.error('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addComment({
        postId,
        author: user.name,
        authorEmail: user.email,
        authorAvatar: user.avatar,
        content: newComment,
        parentId: undefined
      });
      
      setNewComment('');
      await loadComments();
      toast.success('Yorumunuz eklendi!');
    } catch (error) {
      toast.error('Yorum eklenirken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await addComment({
        postId,
        author: user.name,
        authorEmail: user.email,
        authorAvatar: user.avatar,
        content: replyContent,
        parentId
      });
      
      setReplyContent('');
      setReplyingTo(null);
      await loadComments();
      toast.success('Yanıtınız eklendi!');
    } catch (error) {
      toast.error('Yanıt eklenirken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    await likeComment(commentId);
    await loadComments();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parentComments = comments.filter(comment => !comment.parentId);
  const getReplies = (parentId: string) => comments.filter(comment => comment.parentId === parentId);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-emerald-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Yorumlar ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Yorumunuzu yazın..." : "Yorum yapmak için giriş yapın"}
              rows={3}
              disabled={!user}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
            
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-gray-500">
                {user ? (
                  <span>{user.name} olarak yorum yapıyorsunuz</span>
                ) : (
                  <span>Yorum yapmak için <a href="/login" className="text-emerald-600 hover:text-emerald-700">giriş yapın</a></span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!user || !newComment.trim() || isSubmitting}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Gönderiliyor...' : 'Gönder'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {parentComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border-b border-gray-100 pb-6 last:border-b-0"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {comment.authorAvatar ? (
                    <img
                      src={comment.authorAvatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{comment.author}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      <span className="text-sm">Yanıtla</span>
                    </button>
                    
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                  
                  {/* Reply Form */}
                  {replyingTo === comment.id && user && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Yanıtınızı yazın..."
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm"
                          />
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleSubmitReply(comment.id)}
                              disabled={!replyContent.trim() || isSubmitting}
                              className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Yanıtla
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                              className="text-gray-600 px-3 py-1 rounded text-sm hover:text-gray-800"
                            >
                              İptal
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Replies */}
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="mt-4 ml-6 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {reply.authorAvatar ? (
                            <img
                              src={reply.authorAvatar}
                              alt={reply.author}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-gray-900 text-sm">{reply.author}</h5>
                            <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.content}</p>
                          
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleLikeComment(reply.id)}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Heart className="w-3 h-3" />
                              <span className="text-xs">{reply.likes}</span>
                            </button>
                            
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => deleteComment(reply.id)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz yorum yok</h4>
            <p className="text-gray-600">İlk yorumu siz yapın!</p>
          </div>
        )}
      </div>
    </div>
  );
};