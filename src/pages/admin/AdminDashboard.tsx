import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Leaf,
  Activity,
  AlertCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

export const AdminDashboard: React.FC = () => {
  const { adminStats, fetchAdminStats, isLoading } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: adminStats?.totalUsers.toLocaleString() || '0',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Aktif Projeler',
      value: adminStats?.totalProjects.toString() || '0',
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: Leaf,
      color: 'green'
    },
    {
      title: 'Platform Geliri',
      value: `$${(adminStats?.platformRevenue || 0).toLocaleString()}`,
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Toplam Yatırım',
      value: adminStats?.totalInvestments.toLocaleString() || '0',
      change: '+5.7%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcıları görüntüle ve yönet',
      href: '/admin/users',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Proje Yönetimi',
      description: 'Projeleri ekle, düzenle ve yönet',
      href: '/admin/projects',
      icon: Leaf,
      color: 'green'
    },
    {
      title: 'Blog Yönetimi',
      description: 'Blog yazıları oluştur ve yayınla',
      href: '/admin/blog',
      icon: BarChart3,
      color: 'purple'
    },
    {
      title: 'Sistem Ayarları',
      description: 'Platform ayarlarını yapılandır',
      href: '/admin/settings',
      icon: Activity,
      color: 'orange'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">DECARBONIZE.world platform yönetimi</p>
          </motion.div>
        </div>

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
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
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
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={action.title}
                href={action.href}
                className="group p-6 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h3>
            <div className="space-y-4">
              {[
                { action: 'Yeni kullanıcı kaydı', user: 'john@example.com', time: '5 dakika önce' },
                { action: 'Proje onaylandı', user: 'Amazon Forest Project', time: '1 saat önce' },
                { action: 'KYC başvurusu', user: 'sarah@example.com', time: '2 saat önce' },
                { action: 'Yatırım yapıldı', user: 'Wind Energy Project', time: '3 saat önce' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Bekleyen İşlemler</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">KYC Onayı Bekleyen</p>
                  <p className="text-sm text-gray-600">{adminStats?.pendingKyc} kullanıcı</p>
                </div>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  İncele
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Proje Onayı Bekleyen</p>
                  <p className="text-sm text-gray-600">3 proje</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  İncele
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Blog Yazısı Taslağı</p>
                  <p className="text-sm text-gray-600">2 yazı</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  İncele
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};