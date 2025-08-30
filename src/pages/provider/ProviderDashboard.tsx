import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  BarChart3, 
  DollarSign, 
  TrendingUp,
  Package,
  Users,
  Calendar,
  Settings,
  Plus,
  Eye,
  Edit,
  Upload
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const ProviderDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Aktif Projeler',
      value: 15,
      icon: Package,
      color: 'emerald',
      change: '+3 bu ay'
    },
    {
      title: 'Üretilen Karbon Kredisi',
      value: '125K tCO₂',
      icon: Leaf,
      color: 'green',
      change: '+25K bu ay'
    },
    {
      title: 'Toplam Satış',
      value: '$890K',
      icon: DollarSign,
      color: 'blue',
      change: '+12% bu ay'
    },
    {
      title: 'Müşteri Sayısı',
      value: 156,
      icon: Users,
      color: 'purple',
      change: '+8 bu ay'
    }
  ];

  const activeProjects = [
    {
      id: '1',
      title: 'Amazon Orman Koruma Projesi',
      type: 'Forest Conservation',
      carbonCredits: 45000,
      price: 0.25,
      status: 'producing',
      verificationStatus: 'verified',
      nextHarvest: '2024-02-15'
    },
    {
      id: '2',
      title: 'Rüzgar Enerjisi Santrali',
      type: 'Renewable Energy',
      carbonCredits: 32000,
      price: 0.28,
      status: 'producing',
      verificationStatus: 'pending',
      nextHarvest: '2024-02-01'
    }
  ];

  const salesData = [
    { month: 'Ocak', sales: 45000, credits: 180000 },
    { month: 'Şubat', sales: 52000, credits: 208000 },
    { month: 'Mart', sales: 48000, credits: 192000 },
    { month: 'Nisan', sales: 61000, credits: 244000 },
    { month: 'Mayıs', sales: 58000, credits: 232000 },
    { month: 'Haziran', sales: 67000, credits: 268000 }
  ];

  const quickActions = [
    {
      title: 'Yeni Proje Oluştur',
      description: 'Karbon kredisi projesi başlat',
      icon: Plus,
      color: 'emerald',
      action: () => console.log('Create project')
    },
    {
      title: 'Fiyat Güncelle',
      description: 'Karbon kredisi fiyatlarını ayarla',
      icon: DollarSign,
      color: 'blue',
      action: () => console.log('Update pricing')
    },
    {
      title: 'Portföy Yönetimi',
      description: 'Proje portföyünüzü yönetin',
      icon: BarChart3,
      color: 'purple',
      action: () => console.log('Manage portfolio')
    },
    {
      title: 'Müşteri İletişimi',
      description: 'Müşterilerle iletişime geçin',
      icon: Users,
      color: 'orange',
      action: () => console.log('Customer communication')
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
            Karbon Sağlayıcı Dashboard
          </h1>
          <p className="text-gray-600">
            {user?.organizationName} - Karbon kredisi projelerinizi yönetin ve satışlarınızı takip edin
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
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.verificationStatus === 'verified' ? 'Doğrulandı' : 'Bekliyor'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {project.status === 'producing' ? 'Üretimde' : 'Hazırlık'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.type}</p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Karbon Kredisi</p>
                      <p className="font-medium">{project.carbonCredits.toLocaleString()} tCO₂</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fiyat</p>
                      <p className="font-medium">${project.price}/tCO₂</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Sonraki Hasat: {project.nextHarvest}</span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700">
                        Yönet
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                        Rapor
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sales Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Satış Performansı</h3>
            <div className="space-y-4">
              {salesData.slice(-3).map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{data.month}</p>
                    <p className="text-sm text-gray-600">{data.credits.toLocaleString()} tCO₂</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">${data.sales.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Toplam satış</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg text-white text-center">
              <h4 className="font-bold mb-2">Bu Ay Hedef</h4>
              <p className="text-2xl font-bold">$75,000</p>
              <p className="text-emerald-100 text-sm">Kalan: $8,000 (89% tamamlandı)</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};