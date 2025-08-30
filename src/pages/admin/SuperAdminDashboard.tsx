import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Database,
  Zap
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export const SuperAdminDashboard: React.FC = () => {
  const { adminStats, fetchAdminStats, isLoading } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  if (user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya sadece Süper Admin erişebilir.</p>
        </div>
      </div>
    );
  }

  const systemStats = [
    {
      title: 'Toplam Kullanıcı',
      value: adminStats?.totalUsers.toLocaleString() || '0',
      change: '+12.5%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Platform Geliri',
      value: `$${(adminStats?.platformRevenue || 0).toLocaleString()}`,
      change: '+18.3%',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Aktif Projeler',
      value: adminStats?.totalProjects.toString() || '0',
      change: '+8.7%',
      icon: BarChart3,
      color: 'purple'
    },
    {
      title: 'Sistem Sağlığı',
      value: '99.9%',
      change: 'Stabil',
      icon: Activity,
      color: 'green'
    }
  ];

  const criticalActions = [
    {
      title: 'Kullanıcı Yönetimi',
      description: 'Tüm kullanıcıları yönet, roller ata',
      href: '/admin/users',
      icon: Users,
      color: 'blue',
      urgent: adminStats?.pendingKyc || 0
    },
    {
      title: 'Sistem Ayarları',
      description: 'Platform konfigürasyonu ve güvenlik',
      href: '/admin/settings',
      icon: Settings,
      color: 'gray',
      urgent: 0
    },
    {
      title: 'Güvenlik Merkezi',
      description: 'Güvenlik logları ve tehdit analizi',
      href: '/admin/security',
      icon: Shield,
      color: 'red',
      urgent: 2
    },
    {
      title: 'Sistem Logları',
      description: 'Detaylı sistem aktivite logları',
      href: '/admin/logs',
      icon: Database,
      color: 'indigo',
      urgent: 0
    }
  ];

  const recentActivities = [
    { action: 'Yeni admin kullanıcı oluşturuldu', user: 'system', time: '5 dakika önce', type: 'info' },
    { action: 'Sistem ayarları güncellendi', user: 'superadmin', time: '1 saat önce', type: 'success' },
    { action: 'Güvenlik uyarısı: Şüpheli giriş denemesi', user: 'system', time: '2 saat önce', type: 'warning' },
    { action: 'Backup işlemi tamamlandı', user: 'system', time: '6 saat önce', type: 'success' }
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Süper Admin Dashboard</h1>
              <p className="text-gray-600">DECARBONIZE.world tam sistem kontrolü</p>
            </div>
          </div>
        </motion.div>

        {/* Critical Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Kritik Uyarılar</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-800">KYC Bekleyen</p>
              <p className="text-2xl font-bold text-red-600">{adminStats?.pendingKyc || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Sistem Uyarıları</p>
              <p className="text-2xl font-bold text-yellow-600">2</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Bekleyen Onaylar</p>
              <p className="text-2xl font-bold text-blue-600">7</p>
            </div>
          </div>
        </motion.div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
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

        {/* Critical Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Kritik İşlemler</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {criticalActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.href}
                className="group relative p-6 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
              >
                {action.urgent > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {action.urgent}
                  </div>
                )}
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* System Overview */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Son Sistem Aktiviteleri</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">Kullanıcı: {activity.user}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Sistem Sağlığı</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Database</span>
                </div>
                <span className="text-emerald-600 font-bold">Çevrimiçi</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">ReefChain Network</span>
                </div>
                <span className="text-emerald-600 font-bold">Aktif</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">API Services</span>
                </div>
                <span className="text-emerald-600 font-bold">Çalışıyor</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Backup System</span>
                </div>
                <span className="text-yellow-600 font-bold">Zamanlandı</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg text-white text-center">
              <h4 className="font-bold mb-2">Sistem Uptime</h4>
              <p className="text-2xl font-bold">99.98%</p>
              <p className="text-emerald-100 text-sm">Son 30 gün</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};