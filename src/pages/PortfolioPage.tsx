import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';

export const PortfolioPage: React.FC = () => {
  const { portfolio, investments, fetchPortfolio, fetchInvestments, isLoading } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchPortfolio(user.id);
      fetchInvestments(user.id);
    }
  }, [user?.id, fetchPortfolio, fetchInvestments]);

  const performanceData = [
    { name: 'Ocak', value: 4000, carbonCredits: 120 },
    { name: 'Şubat', value: 3000, carbonCredits: 98 },
    { name: 'Mart', value: 5000, carbonCredits: 156 },
    { name: 'Nisan', value: 4500, carbonCredits: 142 },
    { name: 'Mayıs', value: 6000, carbonCredits: 189 },
    { name: 'Haziran', value: 5500, carbonCredits: 167 },
  ];

  const allocationData = [
    { name: 'Orman Koruma', value: 35, color: '#10b981' },
    { name: 'Yenilenebilir Enerji', value: 28, color: '#3b82f6' },
    { name: 'Temiz Teknoloji', value: 22, color: '#8b5cf6' },
    { name: 'Sürdürülebilir Tarım', value: 15, color: '#f59e0b' },
  ];

  const stats = [
    {
      title: 'Toplam Portföy Değeri',
      value: `₺${portfolio?.totalValue.toLocaleString() || '0'}`,
      change: `+${portfolio?.performance.daily || 0}%`,
      changeType: 'positive' as const,
      icon: DollarSign,
      period: 'Günlük'
    },
    {
      title: 'Karbon Kredisi Bakiyesi',
      value: `${portfolio?.totalCarbonCredits.toLocaleString() || '0'} tCO₂`,
      change: `+${portfolio?.performance.weekly || 0}%`,
      changeType: 'positive' as const,
      icon: Leaf,
      period: 'Haftalık'
    },
    {
      title: 'Toplam Getiri',
      value: `₺${portfolio?.totalReturns.toLocaleString() || '0'}`,
      change: `+${portfolio?.performance.monthly || 0}%`,
      changeType: 'positive' as const,
      icon: TrendingUp,
      period: 'Aylık'
    },
    {
      title: 'Yıllık Performans',
      value: `+${portfolio?.performance.yearly || 0}%`,
      change: '+5.7%',
      changeType: 'positive' as const,
      icon: Target,
      period: 'Yıllık'
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Portföy Analizi</h1>
            <p className="text-gray-600">Karbon kredisi yatırımlarınızın detaylı analizi</p>
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
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-emerald-600" />
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
              <p className="text-gray-400 text-xs mt-1">{stat.period}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Portföy Performansı</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Allocation Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Yatırım Dağılımı</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Investments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Yatırım Detayları</h3>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">
              Tümünü Görüntüle
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Proje</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Yatırım</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Karbon Kredisi</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Getiri</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {investments?.map((investment) => (
                  <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">Proje #{investment.projectId}</div>
                    </td>
                    <td className="py-4 px-4 font-medium">₺{investment.amount.toLocaleString()}</td>
                    <td className="py-4 px-4">{investment.carbonCredits} tCO₂</td>
                    <td className="py-4 px-4">
                      <span className="text-emerald-600 font-medium">
                        +₺{investment.returns.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        investment.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        investment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {investment.status === 'active' ? 'Aktif' :
                         investment.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{investment.date}</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      Henüz yatırımınız bulunmuyor
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};