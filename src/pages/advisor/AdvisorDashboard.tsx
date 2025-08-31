import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Video, 
  Phone, 
  Star,
  Calendar,
  Clock,
  Award,
  Globe,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { AdvisorChat } from '../../components/advisor/AdvisorChat';
import { VideoCall } from '../../components/advisor/VideoCall';
import toast from 'react-hot-toast';

export const AdvisorDashboard: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');

  const advisorStats = {
    totalClients: 127,
    activeProjects: 23,
    monthlyEarnings: 15420,
    successRate: 94,
    avgRating: 4.9,
    responseTime: '< 2 hours'
  };

  const recentClients = [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      lastContact: '2024-01-20',
      status: 'active',
      project: 'Amazon Orman Projesi'
    },
    {
      id: '2',
      name: 'Elif Kaya',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      lastContact: '2024-01-19',
      status: 'pending',
      project: 'Rüzgar Enerjisi Yatırımı'
    },
    {
      id: '3',
      name: 'Mehmet Demir',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      lastContact: '2024-01-18',
      status: 'completed',
      project: 'Güneş Paneli Projesi'
    }
  ];

  const upcomingMeetings = [
    {
      id: '1',
      clientName: 'Ahmet Yılmaz',
      date: '2024-01-25',
      time: '14:00',
      type: 'video',
      topic: 'Aylık Portföy Değerlendirmesi'
    },
    {
      id: '2',
      clientName: 'Elif Kaya',
      date: '2024-01-30',
      time: '10:30',
      type: 'call',
      topic: 'Yeni Yatırım Fırsatları'
    }
  ];

  const handleStartChat = (clientId: string) => {
    setIsChatOpen(true);
    toast.success('Chat başlatıldı!');
  };

  const handleVideoCall = () => {
    setCallType('video');
    setIsVideoCallOpen(true);
    toast.success('Video görüşme başlatılıyor...');
  };

  const handleVoiceCall = () => {
    setCallType('audio');
    setIsVideoCallOpen(true);
    toast.success('Sesli arama başlatılıyor...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Danışman Dashboard</h1>
            <p className="text-gray-600">Müşterilerinizi yönetin ve performansınızı takip edin</p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{advisorStats.totalClients}</p>
              </div>
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Aktif Projeler</p>
                <p className="text-2xl font-bold text-gray-900">{advisorStats.activeProjects}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Aylık Kazanç</p>
                <p className="text-2xl font-bold text-gray-900">${advisorStats.monthlyEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Başarı Oranı</p>
                <p className="text-2xl font-bold text-gray-900">%{advisorStats.successRate}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Clients */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Son Müşteriler</h3>
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.project}</p>
                        <p className="text-xs text-gray-500">Son iletişim: {client.lastContact}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' ? 'bg-green-100 text-green-800' :
                        client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status === 'active' ? 'Aktif' :
                         client.status === 'pending' ? 'Beklemede' : 'Tamamlandı'}
                      </span>
                      <button 
                        onClick={() => handleStartChat(client.id)}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Meetings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Yaklaşan Görüşmeler</h3>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{meeting.clientName}</p>
                      {meeting.type === 'video' ? (
                        <Video className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Phone className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{meeting.topic}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{meeting.date}</span>
                      <Clock className="w-3 h-3" />
                      <span>{meeting.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Performans Özeti</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ortalama Puan</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{advisorStats.avgRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Yanıt Süresi</span>
                  <span className="font-medium text-emerald-600">{advisorStats.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Başarı Oranı</span>
                  <span className="font-medium text-emerald-600">%{advisorStats.successRate}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chat Component */}
        <AdvisorChat
          advisorId="current-advisor"
          advisorName="Danışman"
          advisorAvatar="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg"
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onVideoCall={handleVideoCall}
          onVoiceCall={handleVoiceCall}
        />

        {/* Video Call Component */}
        <VideoCall
          advisorName="Danışman"
          advisorAvatar="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg"
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          callType={callType}
        />
      </div>
    </div>
  );
};