import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  DollarSign,
  Activity,
  Award,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Leaf
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const ProviderDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const providerStats = {
    totalCreditsGenerated: 245000,
    activeProjects: 18,
    monthlyRevenue: 125000,
    qualityScore: 4.7,
    totalRevenue: 2800000,
    verificationRate: 96.5
  };

  const carbonProjects = [
    {
      id: '1',
      name: 'Amazon Forest Conservation',
      location: 'Brazil',
      carbonCredits: 85000,
      status: 'active',
      progress: 78,
      startDate: '2023-06-01',
      revenue: 425000,
      verificationStatus: 'verified'
    },
    {
      id: '2',
      name: 'Mangrove Restoration',
      location: 'Indonesia',
      carbonCredits: 62000,
      status: 'active',
      progress: 65,
      startDate: '2023-08-15',
      revenue: 310000,
      verificationStatus: 'pending'
    },
    {
      id: '3',
      name: 'Renewable Energy Farm',
      location: 'Turkey',
      carbonCredits: 98000,
      status: 'completed',
      progress: 100,
      startDate: '2022-12-01',
      revenue: 490000,
      verificationStatus: 'verified'
    }
  ];

  const monthlyData = [
    { month: 'Ocak', credits: 18000, revenue: 90000 },
    { month: 'Şubat', credits: 22000, revenue: 110000 },
    { month: 'Mart', credits: 25000, revenue: 125000 },
    { month: 'Nisan', credits: 28000, revenue: 140000 },
    { month: 'Mayıs', credits: 32000, revenue: 160000 },
    { month: 'Haziran', credits: 35000, revenue: 175000 }
  ];

  const stats = [
    {
      title: 'Üretilen Karbon Kredisi',
      value: providerStats.totalCreditsGenerated.toLocaleString() + ' tCO₂',
      icon: Leaf,
      color: 'emerald',
      change: '+15% bu ay'
    },
    {
      title: 'Aktif Projeler',
      value: providerStats.activeProjects,
      icon: Activity,
      color: 'blue',
      change: '+3 bu ay'
    },
    {
      title: 'Aylık Gelir',
      value: '$' + providerStats.monthlyRevenue.toLocaleString(),
      icon: DollarSign,
      color: 'green',
      change: '+12% bu ay'
    },
    {
      title: 'Kalite Skoru',
      value: providerStats.qualityScore + '/5',
      icon: Award,
      color: 'purple',
      change: '+0.2 bu ay'
    }
  ];

  if (user?.role !== 'carbon_provider') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya sadece Karbon Sağlayıcıları erişebilir.</p>
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
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Karbon Sağlayıcı Dashboard</h1>
              <p className="text-gray-600">Karbon kredisi projelerinizi yönetin ve performansınızı takip edin</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Sağlayıcı: {user.organizationName}</span>
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

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Performans Özeti</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{providerStats.totalRevenue.toLocaleString()}</div>
              <div className="text-emerald-800 font-medium">Toplam Gelir ($)</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{providerStats.totalCreditsGenerated.toLocaleString()}</div>
              <div className="text-blue-800 font-medium">Toplam Kredi (tCO₂)</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">{providerStats.verificationRate}%</div>
              <div className="text-purple-800 font-medium">Doğrulama Oranı</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">{providerStats.qualityScore}/5</div>
              <div className="text-orange-800 font-medium">Kalite Skoru</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Carbon Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Karbon Kredisi Projelerim</h3>
              <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700">
                <Plus className="w-4 h-4" />
                <span>Yeni Proje</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {carbonProjects.map((project) => (
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
                    <div>Gelir: ${project.revenue.toLocaleString()}</div>
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
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                      project.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {project.verificationStatus === 'verified' ? 'Doğrulanmış' :
                       project.verificationStatus === 'pending' ? 'Doğrulama Bekliyor' : 'Reddedildi'}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Revenue Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Gelir Analizi</h3>
            
            <div className="space-y-4 mb-6">
              {monthlyData.slice(-3).map((data, index) => (
                <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{data.month}</p>
                    <p className="text-sm text-gray-600">{data.credits.toLocaleString()} tCO₂</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">${data.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Gelir</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Metrics */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Kalite Metrikleri</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Doğrulama Oranı</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-19 h-2 bg-emerald-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">{providerStats.verificationRate}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Müşteri Memnuniyeti</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-18 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">{providerStats.qualityScore}/5</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Proje Başarı Oranı</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-17 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Market Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 bg-gradient-to-br from-emerald-600 to-blue-700 rounded-2xl p-8 text-white"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Piyasa Fırsatları</h3>
              <div className="space-y-3 text-emerald-100">
                <p>• Karbon kredisi talebi %84 artış gösteriyor</p>
                <p>• Yeni doğrulama standartları geliyor</p>
                <p>• Kurumsal ESG yatırımları artıyor</p>
                <p>• Blockchain entegrasyonu hızlanıyor</p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-lg font-bold mb-4">Bu Çeyrek Hedeflerimiz</h4>
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
                  <span className="text-sm">Karbon Kredisi Üretimi</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-white/20 rounded-full">
                      <div className="w-13 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm">80%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gelir Hedefi</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-white/20 rounded-full">
                      <div className="w-11 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm">68%</span>
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