import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Send, 
  User,
  Calendar,
  ThumbsUp,
  AlertCircle,
  CheckCircle
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
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });
  const [showGuestForm, setShowGuestForm] = useState(false);
  const commentFormRef = useRef<HTMLTextAreaElement>(null);

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
    
    let authorName = user?.name || guestInfo.name;
    let authorEmail = user?.email || guestInfo.email;
    
    if (!user && (!guestInfo.name || !guestInfo.email)) {
      setShowGuestForm(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addComment({
        postId,
        author: authorName,
        authorEmail: authorEmail,
        authorAvatar: user?.avatar,
        content: newComment,
        parentId: undefined
      });
      
      setNewComment('');
      setGuestInfo({ name: '', email: '' });
      setShowGuestForm(false);
      await loadComments();
      toast.success('Yorumunuz eklendi!');
    } catch (error) {
      toast.error('Yorum eklenirken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    
    let authorName = user?.name || guestInfo.name;
    let authorEmail = user?.email || guestInfo.email;
    
    if (!user && (!guestInfo.name || !guestInfo.email)) {
      toast.error('Yanıt yapmak için ad ve e-posta gerekli');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addComment({
        postId,
        author: authorName,
        authorEmail: authorEmail,
        authorAvatar: user?.avatar,
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
            {/* Guest Info Form */}
            {!user && showGuestForm && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Yorum yapmak için bilgilerinizi girin</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Adınız"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    className="p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    className="p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  E-posta adresiniz sadece yorum sistemi için kullanılır ve paylaşılmaz.
                </p>
              </div>
            )}
            
            <textarea
              ref={commentFormRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorumunuzu yazın..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
            
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-gray-500">
                {user ? (
                  <span>{user.name} olarak yorum yapıyorsunuz</span>
                ) : (
                  <span>
                    {guestInfo.name ? `${guestInfo.name} olarak yorum yapıyorsunuz` : 'Misafir olarak yorum yapabilirsiniz'}
                  </span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting || (!user && showGuestForm && (!guestInfo.name || !guestInfo.email))}
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
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{comment.author}</h4>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                    {!comment.isApproved && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Onay Bekliyor
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors transform hover:scale-105"
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
                        onClick={() => {
                          if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
                            deleteComment(comment.id);
                            loadComments();
                            toast.success('Yorum silindi');
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                  
                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      {!user && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Adınız"
                              value={guestInfo.name}
                              onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                              className="p-2 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="email"
                              placeholder="E-posta"
                              value={guestInfo.email}
                              onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                              className="p-2 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                      
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
                              disabled={!replyContent.trim() || isSubmitting || (!user && (!guestInfo.name || !guestInfo.email))}
                              className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {isSubmitting ? 'Gönderiliyor...' : 'Yanıtla'}
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
                    <motion.div 
                      key={reply.id} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mt-4 ml-6 pl-4 border-l-2 border-emerald-200 bg-emerald-50/30 rounded-r-lg"
                    >
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
                            {!reply.isApproved && (
                              <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                                Bekliyor
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">{reply.content}</p>
                          
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleLikeComment(reply.id)}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors transform hover:scale-105"
                            >
                              <Heart className="w-3 h-3" />
                              <span className="text-xs">{reply.likes}</span>
                            </button>
                            
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Bu yanıtı silmek istediğinizden emin misiniz?')) {
                                    deleteComment(reply.id);
                                    loadComments();
                                    toast.success('Yanıt silindi');
                                  }
                                }}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
      
      {/* Comment Guidelines */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Yorum Kuralları</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Saygılı ve yapıcı yorumlar yazın</li>
          <li>• Kişisel saldırı ve hakaret içeren yorumlar silinir</li>
          <li>• Spam ve reklam içerikli yorumlar onaylanmaz</li>
          <li>• Konuyla ilgili yorumlar yapmaya özen gösterin</li>
        </ul>
      </div>
    </div>
  );
};