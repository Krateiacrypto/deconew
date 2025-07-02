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
  FileText
} from 'lucide-react';
import { AdvisorChat } from '../components/advisor/AdvisorChat';
import { VideoCall } from '../components/advisor/VideoCall';
import toast from 'react-hot-toast';

export const AdvisorPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');

  const advisor = {
    id: '1',
    name: 'Dr. Sarah Johnson',
    expertise: ['Forest Conservation', 'Carbon Credits', 'Sustainability'],
    experience: 15,
    rating: 4.9,
    avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    bio: 'Environmental scientist with 15+ years in carbon credit projects. Specialized in forest conservation and sustainable development initiatives across Latin America and Southeast Asia.',
    languages: ['English', 'Spanish', 'Portuguese'],
    totalClients: 127,
    successRate: 94,
    responseTime: '< 2 hours'
  };

  const recentAdvice = [
    {
      date: '2024-01-20',
      title: 'Amazon Orman Projesi Analizi',
      summary: 'Projenin risk analizi ve getiri projeksiyonları hakkında detaylı değerlendirme',
      type: 'analysis'
    },
    {
      date: '2024-01-18',
      title: 'Portföy Çeşitlendirme Önerisi',
      summary: 'Yenilenebilir enerji projelerine yatırım önerisi ve risk dağılımı',
      type: 'recommendation'
    },
    {
      date: '2024-01-15',
      title: 'Piyasa Güncellemesi',
      summary: 'Karbon kredisi piyasasındaki son gelişmeler ve fırsatlar',
      type: 'market-update'
    }
  ];

  const upcomingMeetings = [
    {
      date: '2024-01-25',
      time: '14:00',
      type: 'video',
      topic: 'Aylık Portföy Değerlendirmesi'
    },
    {
      date: '2024-01-30',
      time: '10:30',
      type: 'call',
      topic: 'Yeni Yatırım Fırsatları'
    }
  ];

  const handleStartChat = () => {
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

  const handleScheduleMeeting = () => {
    toast.success('Randevu talebiniz gönderildi!');
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Kişisel Danışmanınız</h1>
            <p className="text-gray-600">Uzman rehberliğinde karbon kredisi yatırımları</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Advisor Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <div className="text-center mb-6">
                <img
                  src={advisor.avatar}
                  alt={advisor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{advisor.name}</h3>
                <p className="text-emerald-600 font-medium mb-2">Karbon Kredisi Uzmanı</p>
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900">{advisor.rating}</span>
                  <span className="text-gray-500">({advisor.totalClients} değerlendirme)</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{advisor.experience} Yıl Deneyim</p>
                    <p className="text-xs text-gray-500">Karbon kredisi uzmanı</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">%{advisor.successRate} Başarı Oranı</p>
                    <p className="text-xs text-gray-500">Müşteri memnuniyeti</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{advisor.responseTime}</p>
                    <p className="text-xs text-gray-500">Ortalama yanıt süresi</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleStartChat}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Mesaj Gönder</span>
                </button>
                <button 
                  onClick={handleVideoCall}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Video className="w-5 h-5" />
                  <span>Video Görüşme</span>
                </button>
                <button 
                  onClick={handleVoiceCall}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Telefon Görüşmesi</span>
                </button>
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Uzmanlık Alanları</h4>
              <div className="space-y-2">
                {advisor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <h5 className="text-md font-bold text-gray-900 mt-6 mb-3">Diller</h5>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{advisor.languages.join(', ')}</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hakkında</h3>
              <p className="text-gray-600 leading-relaxed">{advisor.bio}</p>
            </motion.div>

            {/* Recent Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Son Tavsiyeler</h3>
              <div className="space-y-4">
                {recentAdvice.map((advice, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{advice.title}</h4>
                      <span className="text-xs text-gray-500">{advice.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{advice.summary}</p>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        advice.type === 'analysis' ? 'bg-blue-100 text-blue-800' :
                        advice.type === 'recommendation' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {advice.type === 'analysis' ? 'Analiz' :
                         advice.type === 'recommendation' ? 'Öneri' : 'Piyasa Güncellemesi'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Meetings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Yaklaşan Görüşmeler</h3>
                <button 
                  onClick={handleScheduleMeeting}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Yeni Randevu Al
                </button>
              </div>
              
              <div className="space-y-4">
                {upcomingMeetings.map((meeting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        meeting.type === 'video' ? 'bg-blue-100' : 'bg-emerald-100'
                      }`}>
                        {meeting.type === 'video' ? (
                          <Video className={`w-5 h-5 ${meeting.type === 'video' ? 'text-blue-600' : 'text-emerald-600'}`} />
                        ) : (
                          <Phone className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{meeting.topic}</p>
                        <p className="text-sm text-gray-600">{meeting.date} - {meeting.time}</p>
                      </div>
                    </div>
                    <button 
                      onClick={meeting.type === 'video' ? handleVideoCall : handleVoiceCall}
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Katıl
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chat Component */}
        <AdvisorChat
          advisorId={advisor.id}
          advisorName={advisor.name}
          advisorAvatar={advisor.avatar}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onVideoCall={handleVideoCall}
          onVoiceCall={handleVoiceCall}
        />

        {/* Video Call Component */}
        <VideoCall
          advisorName={advisor.name}
          advisorAvatar={advisor.avatar}
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          callType={callType}
        />
      </div>
    </div>
  );
};