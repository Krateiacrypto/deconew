import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Leaf, 
  TrendingUp, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Globe,
  Zap,
  MessageCircle
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

export const UserDashboard: React.FC = () => {
  const { portfolio, investments, fetchPortfolio, fetchInvestments, isLoading } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchPortfolio(user.id);
      fetchInvestments(user.id);
    }
  }, [user?.id, fetchPortfolio, fetchInvestments]);

  const stats = [
    {
      title: 'Toplam Portföy Değeri',
      value: `₺${portfolio?.totalValue.toLocaleString() || '0'}`,
      change: `+${portfolio?.performance.daily || 0}%`,
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Karbon Kredisi Bakiyesi',
      value: `${portfolio?.totalCarbonCredits.toLocaleString() || '0'} tCO₂`,
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: Leaf,
      color: 'green'
    },
    {
      title: 'Toplam Getiri',
      value: `₺${portfolio?.totalReturns.toLocaleString() || '0'}`,
      change: `+${portfolio?.performance.monthly || 0}%`,
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Aktif Yatırımlar',
      value: investments?.length.toString() || '0',
      change: '+2',
      changeType: 'positive' as const,
      icon: Target,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      title: 'Karbon Kredisi Satın Al',
      description: 'Doğrulanmış karbon kredilerini satın alın',
      href: '/projects',
      icon: Wallet,
      color: 'emerald'
    },
    {
      title: 'Portföyü Görüntüle',
      description: 'Detaylı portföy analizinizi inceleyin',
      href: '/portfolio',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Danışmanla Görüş',
      description: 'Kişisel danışmanınızla iletişime geçin',
      href: '/advisor',
      icon: MessageCircle,
      color: 'purple'
    },
    {
      title: 'Proje Keşfet',
      description: 'Yeni karbon nötrleme projelerini keşfedin',
      href: '/projects',
      icon: Globe,
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Hoş geldiniz, {user?.name}
            </h1>
            <p className="text-gray-600">Karbon kredisi portföyünüzü ve yatırımlarınızı takip edin</p>
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
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
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

        {/* Recent Investments & Advisor */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Son Yatırımlarınız</h3>
            <div className="space-y-4">
              {investments?.slice(0, 4).map((investment, index) => (
                <div key={investment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Proje #{investment.projectId}</p>
                    <p className="text-sm text-gray-600">₺{investment.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-600">
                      +₺{investment.returns.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{investment.date}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-gray-500">Henüz yatırımınız bulunmuyor</p>
                  <a href="/projects" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Projeleri keşfedin
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Kişisel Danışmanınız</h3>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg"
                alt="Advisor"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-lg font-bold text-gray-900 mb-2">Dr. Sarah Johnson</h4>
              <p className="text-emerald-600 font-medium mb-2">Karbon Kredisi Uzmanı</p>
              <p className="text-gray-600 text-sm mb-4">
                15+ yıl deneyim, 4.9/5 değerlendirme
              </p>
              <div className="space-y-2">
                <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                  Mesaj Gönder
                </button>
                <button className="w-full border border-emerald-600 text-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors">
                  Video Görüşme
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};