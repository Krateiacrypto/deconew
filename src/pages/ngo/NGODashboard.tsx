import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Target, 
  Users, 
  TrendingUp,
  DollarSign,
  Globe,
  Calendar,
  Award,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const NGODashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Aktif Projeler',
      value: 8,
      icon: Target,
      color: 'emerald',
      change: '+2 bu ay'
    },
    {
      title: 'Toplanan Fon',
      value: '$245K',
      icon: DollarSign,
      color: 'blue',
      change: '+15% bu ay'
    },
    {
      title: 'Etkilenen Kişi',
      value: '12,500',
      icon: Users,
      color: 'purple',
      change: '+1,200 bu ay'
    },
    {
      title: 'Sosyal Etki Puanı',
      value: '94/100',
      icon: Award,
      color: 'yellow',
      change: '+3 bu ay'
    }
  ];

  const activeProjects = [
    {
      id: '1',
      title: 'Temiz Su Erişimi Projesi',
      location: 'Afrika',
      beneficiaries: 5000,
      funding: 85000,
      targetFunding: 100000,
      status: 'active',
      impact: 'Su erişimi'
    },
    {
      id: '2',
      title: 'Eğitim Merkezi Kurulumu',
      location: 'Güneydoğu Anadolu',
      beneficiaries: 2500,
      funding: 65000,
      targetFunding: 80000,
      status: 'funding',
      impact: 'Eğitim'
    }
  ];

  const impactMetrics = [
    { metric: 'Temiz Su Erişimi', value: '15,000 kişi', icon: '💧' },
    { metric: 'Eğitim Desteği', value: '3,200 çocuk', icon: '📚' },
    { metric: 'Sağlık Hizmeti', value: '8,500 kişi', icon: '🏥' },
    { metric: 'İstihdam Yaratma', value: '450 iş', icon: '💼' }
  ];

  const quickActions = [
    {
      title: 'Yeni Proje Oluştur',
      description: 'Sosyal etki projesi başlat',
      icon: Plus,
      color: 'emerald',
      action: () => console.log('Create project')
    },
    {
      title: 'Fonlama Kampanyası',
      description: 'Yeni fonlama kampanyası düzenle',
      icon: Target,
      color: 'blue',
      action: () => console.log('Create campaign')
    },
    {
      title: 'Etki Raporu',
      description: 'Sosyal etki raporu yayınla',
      icon: BarChart3,
      color: 'purple',
      action: () => console.log('Create impact report')
    },
    {
      title: 'Topluluk İletişimi',
      description: 'Topluluk ile etkileşime geç',
      icon: Users,
      color: 'orange',
      action: () => console.log('Community engagement')
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
            STK Dashboard
          </h1>
          <p className="text-gray-600">
            {user?.organizationName} - Sosyal etki projelerinizi yönetin ve toplulukla etkileşime geçin
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Aktif Projelerim</h3>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status === 'active' ? 'Aktif' : 'Fonlama'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">📍 {project.location}</p>
                  <p className="text-sm text-gray-600 mb-3">👥 {project.beneficiaries.toLocaleString()} kişi etkilenecek</p>
                  
                  {/* Funding Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Fonlama İlerlemesi</span>
                      <span className="font-medium">${project.funding.toLocaleString()} / ${project.targetFunding.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(project.funding / project.targetFunding) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700">
                      Yönet
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                      Rapor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Impact Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Sosyal Etki Metrikleri</h3>
            <div className="space-y-4">
              {impactMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{metric.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{metric.metric}</p>
                      <p className="text-sm text-gray-600">Toplam etki</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg text-white text-center">
              <h4 className="font-bold mb-2">Bu Ay Yaratılan Etki</h4>
              <p className="text-2xl font-bold">2,500+ Kişi</p>
              <p className="text-emerald-100 text-sm">Projelerimizle hayatına dokunduğumuz insan sayısı</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};