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
  Shield,
  Database,
  Settings,
  UserCheck,
  FileText,
  Globe,
  Lock,
  Server,
  Zap
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

export const SuperAdminDashboard: React.FC = () => {
  const { adminStats, fetchAdminStats, isLoading } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  if (!user || user.role !== 'superadmin') {
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

  const superAdminStats = [
    {
      title: 'Toplam Kullanıcı',
      value: adminStats?.totalUsers.toLocaleString() || '0',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Sistem Durumu',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive' as const,
      icon: Activity,
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
      title: 'Güvenlik Skorları',
      value: '98.5%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: Shield,
      color: 'purple'
    }
  ];

  const systemActions = [
    {
      title: 'Kullanıcı Profilleri',
      description: 'Tüm kullanıcı profillerini görüntüle ve yönet',
      href: '/admin/profiles',
      icon: UserCheck,
      color: 'blue'
    },
    {
      title: 'Sistem Ayarları',
      description: 'Platform konfigürasyonu ve ayarları',
      href: '/admin/settings',
      icon: Settings,
      color: 'gray'
    },
    {
      title: 'İçerik Yönetimi',
      description: 'Blog, sayfa içerikleri ve medya yönetimi',
      href: '/admin/content',
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Güvenlik Merkezi',
      description: 'Güvenlik logları ve tehdit analizi',
      href: '/admin/security',
      icon: Lock,
      color: 'red'
    },
    {
      title: 'Veritabanı Yönetimi',
      description: 'Veritabanı performansı ve backup yönetimi',
      href: '/admin/database',
      icon: Database,
      color: 'indigo'
    },
    {
      title: 'API Yönetimi',
      description: 'API endpoint\'leri ve rate limiting',
      href: '/admin/api',
      icon: Server,
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
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Sistem geneli yönetim ve kontrol merkezi</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Süper Admin Yetkisi Aktif</span>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {superAdminStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500"
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

        {/* System Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Sistem Yönetimi</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemActions.map((action, index) => (
              <a
                key={action.title}
                href={action.href}
                className="group p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
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

        {/* System Health */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Sistem Sağlığı</h3>
            <div className="space-y-4">
              {[
                { service: 'Web Server', status: 'Aktif', uptime: '99.9%', color: 'green' },
                { service: 'Veritabanı', status: 'Aktif', uptime: '99.8%', color: 'green' },
                { service: 'API Gateway', status: 'Aktif', uptime: '99.7%', color: 'green' },
                { service: 'Cache Server', status: 'Uyarı', uptime: '98.5%', color: 'yellow' }
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 bg-${service.color}-500 rounded-full`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.service}</p>
                      <p className="text-xs text-gray-500">{service.status}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{service.uptime}</span>
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
            <h3 className="text-xl font-bold text-gray-900 mb-6">Kritik Uyarılar</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Güvenlik Güncellemesi</p>
                  <p className="text-sm text-red-700">Sistem güvenlik yaması mevcut</p>
                  <button className="mt-2 text-xs text-red-600 hover:text-red-800 underline">
                    Detayları Görüntüle
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Disk Kullanımı</p>
                  <p className="text-sm text-yellow-700">Disk kullanımı %85'e ulaştı</p>
                  <button className="mt-2 text-xs text-yellow-600 hover:text-yellow-800 underline">
                    Temizlik Yap
                  </button>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Backup Durumu</p>
                  <p className="text-sm text-blue-700">Son backup: 2 saat önce</p>
                  <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline">
                    Manuel Backup
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};