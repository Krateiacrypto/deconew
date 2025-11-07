import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
}

interface AdvisorChatProps {
  advisorId: string;
  advisorName: string;
  advisorAvatar: string;
  isOpen: boolean;
  onClose: () => void;
  onVideoCall: () => void;
  onVoiceCall: () => void;
}

export const AdvisorChat: React.FC<AdvisorChatProps> = ({
  advisorId,
  advisorName,
  advisorAvatar,
  isOpen,
  onClose,
  onVideoCall,
  onVoiceCall
}) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: advisorId,
      senderName: advisorName,
      content: 'Merhaba! Size nasıl yardımcı olabilirim?',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate advisor typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const advisorResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: advisorId,
        senderName: advisorName,
        content: 'Mesajınızı aldım. Size en kısa sürede detaylı bir yanıt vereceğim.',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, advisorResponse]);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content: `Dosya gönderildi: ${file.name}`,
      timestamp: new Date().toISOString(),
      type: 'file',
      fileUrl: URL.createObjectURL(file),
      fileName: file.name
    };

    setMessages(prev => [...prev, message]);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-50 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={advisorAvatar}
              alt={advisorName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{advisorName}</h3>
            <p className="text-sm text-emerald-600">Çevrimiçi</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onVoiceCall}
            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Sesli Arama"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={onVideoCall}
            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Video Arama"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.senderId === user?.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.type === 'file' ? (
                      <div className="space-y-2">
                        <p className="text-sm">{message.content}</p>
                        {message.fileUrl && (
                          <a
                            href={message.fileUrl}
                            download={message.fileName}
                            className="text-xs underline opacity-80 hover:opacity-100"
                          >
                            İndir
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.id ? 'text-emerald-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Mesajınızı yazın..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};