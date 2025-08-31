import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  FileText, 
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Award,
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';

export const AdvisorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);

  const stats = [
    {
      title: 'Atanan Kullanıcılar',
      value: user?.assignedUsers?.length || 0,
      icon: Users,
      color: 'blue',
      change: '+3 bu ay'
    },
    {
      title: 'Aktif Danışmanlık',
      value: 12,
      icon: MessageCircle,
      color: 'emerald',
      change: '+2 bu hafta'
    },
    {
      title: 'Hazırlanan Rapor',
      value: 8,
      icon: FileText,
      color: 'purple',
      change: '+1 bu hafta'
    },
    {
      title: 'Müşteri Memnuniyeti',
      value: '4.9/5',
      icon: Award,
      color: 'yellow',
      change: '+0.1 bu ay'
    }
  ];

  const upcomingMeetings = [
    {
      id: '1',
      clientName: 'John Doe',
      type: 'video',
      date: '2024-01-25',
      time: '14:00',
      topic: 'Portföy Değerlendirmesi',
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'Jane Smith',
      type: 'call',
      date: '2024-01-25',
      time: '16:30',
      topic: 'Yatırım Stratejisi',
      status: 'pending'
    }
  ];

  const recentReports = [
    {
      id: '1',
      title: 'Amazon Orman Projesi Risk Analizi',
      client: 'John Doe',
      date: '2024-01-20',
      status: 'completed',
      type: 'risk_analysis'
    },
    {
      id: '2',
      title: 'Portföy Çeşitlendirme Önerisi',
      client: 'Jane Smith',
      date: '2024-01-18',
      status: 'draft',
      type: 'portfolio_advice'
    }
  ];

  const quickActions = [
    {
      title: 'Yeni Rapor Oluştur',
      description: 'Müşteri için danışmanlık raporu hazırla',
      icon: FileText,
      color: 'emerald',
      action: () => console.log('Create report')
    },
    {
      title: 'Müşteri Mesajları',
      description: 'Bekleyen müşteri mesajlarını görüntüle',
      icon: MessageCircle,
      color: 'blue',
      action: () => console.log('View messages')
    },
    {
      title: 'Randevu Planla',
      description: 'Yeni müşteri randevusu oluştur',
      icon: Calendar,
      color: 'purple',
      action: () => console.log('Schedule meeting')
    },
    {
      title: 'Blog Yazısı Yaz',
      description: 'Uzmanlık alanında blog yazısı oluştur',
      icon: BarChart3,
      color: 'orange',
      action: () => console.log('Write blog')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Danışman Dashboard
          </h1>
          <p className="text-gray-600">
            Hoş geldiniz, {user?.name} - Müşterilerinizi yönetin ve danışmanlık hizmetlerinizi takip edin
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={action.title}
                onClick={action.action}
                className="group p-6 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 text-left"
              >
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Meetings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Yaklaşan Randevular</h3>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      meeting.type === 'video' ? 'bg-blue-100' : 'bg-emerald-100'
                    }`}>
                      {meeting.type === 'video' ? '📹' : '📞'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{meeting.clientName}</p>
                      <p className="text-sm text-gray-600">{meeting.topic}</p>
                      <p className="text-xs text-gray-500">{meeting.date} - {meeting.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      meeting.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {meeting.status === 'confirmed' ? 'Onaylandı' : 'Bekliyor'}
                    </span>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                      Katıl
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Reports */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Son Raporlarım</h3>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{report.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status === 'completed' ? 'Tamamlandı' : 'Taslak'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Müşteri: {report.client}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{report.date}</span>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                      Görüntüle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};