import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Target, 
  Users, 
  Globe,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const NGODashboard: React.FC = () => {
  const { user } = useAuthStore();

  const ngoStats = {
    supportedProjects: 28,
    totalImpact: 125000, // tCO₂
    communityMembers: 4500,
    projectSuccessRate: 92,
    totalFunding: 2800000,
    activePartners: 15
  };

  const supportedProjects = [
    {
      id: '1',
      name: 'Amazon Forest Conservation',
      location: 'Brazil',
      carbonCredits: 45000,
      status: 'active',
      progress: 78,
      startDate: '2023-06-01',
      beneficiaries: 1200
    },
    {
      id: '2',
      name: 'Mangrove Restoration',
      location: 'Indonesia',
      carbonCredits: 32000,
      status: 'active',
      progress: 65,
      startDate: '2023-08-15',
      beneficiaries: 850
    },
    {
      id: '3',
      name: 'Community Solar Project',
      location: 'Kenya',
      carbonCredits: 18000,
      status: 'completed',
      progress: 100,
      startDate: '2022-12-01',
      beneficiaries: 2500
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Climate Action Workshop',
      date: '2024-02-15',
      time: '14:00',
      location: 'Istanbul',
      attendees: 150
    },
    {
      id: '2',
      title: 'Sustainability Conference',
      date: '2024-03-10',
      time: '09:00',
      location: 'Ankara',
      attendees: 300
    }
  ];

  const stats = [
    {
      title: 'Desteklenen Proje',
      value: ngoStats.supportedProjects,
      icon: Target,
      color: 'blue',
      change: '+3 bu ay'
    },
    {
      title: 'Toplam Etki',
      value: ngoStats.totalImpact.toLocaleString() + ' tCO₂',
      icon: Globe,
      color: 'emerald',
      change: '+12% bu ay'
    },
    {
      title: 'Topluluk Üyesi',
      value: ngoStats.communityMembers.toLocaleString(),
      icon: Users,
      color: 'purple',
      change: '+250 bu ay'
    },
    {
      title: 'Başarı Oranı',
      value: ngoStats.projectSuccessRate + '%',
      icon: TrendingUp,
      color: 'green',
      change: '+2% bu ay'
    }
  ];

  if (user?.role !== 'ngo') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya sadece STK'lar erişebilir.</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">STK Dashboard</h1>
              <p className="text-gray-600">Çevre projelerinizi yönetin ve topluluk etkisini takip edin</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">STK: {user.organizationName}</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
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

        {/* Impact Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Etki Özeti</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{ngoStats.totalFunding.toLocaleString()}</div>
              <div className="text-emerald-800 font-medium">Toplam Fon ($)</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{ngoStats.totalImpact.toLocaleString()}</div>
              <div className="text-blue-800 font-medium">Karbon Etkisi (tCO₂)</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">{ngoStats.activePartners}</div>
              <div className="text-purple-800 font-medium">Aktif Ortak</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">{ngoStats.projectSuccessRate}%</div>
              <div className="text-orange-800 font-medium">Başarı Oranı</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Supported Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Desteklenen Projeler</h3>
              <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
                <Plus className="w-4 h-4" />
                <span>Yeni Proje</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {supportedProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status === 'active' ? 'Aktif' :
                       project.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>Karbon Kredisi: {project.carbonCredits.toLocaleString()} tCO₂</div>
                    <div>Faydalanan: {project.beneficiaries.toLocaleString()} kişi</div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">İlerleme</span>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Yaklaşan Etkinlikler</h3>
              <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
                <Plus className="w-4 h-4" />
                <span>Etkinlik Ekle</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{event.date} - {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees} katılımcı</span>
                    </div>
                  </div>
                  
                  <button className="mt-3 w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                    Detayları Görüntüle
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Community Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 bg-gradient-to-br from-emerald-600 to-blue-700 rounded-2xl p-8 text-white"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Topluluk Etkimiz</h3>
              <div className="space-y-3 text-emerald-100">
                <p>• {ngoStats.communityMembers.toLocaleString()} aktif topluluk üyesi</p>
                <p>• {ngoStats.totalImpact.toLocaleString()} tCO₂ karbon etkisi</p>
                <p>• {ngoStats.supportedProjects} desteklenen proje</p>
                <p>• %{ngoStats.projectSuccessRate} proje başarı oranı</p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-lg font-bold mb-4">Bu Ay Hedeflerimiz</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Yeni Proje Başlatma</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-white/20 rounded-full">
                      <div className="w-12 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm">75%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Topluluk Büyütme</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-white/20 rounded-full">
                      <div className="w-10 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm">60%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fon Toplama</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-white/20 rounded-full">
                      <div className="w-14 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};