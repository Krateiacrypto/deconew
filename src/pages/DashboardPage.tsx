import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Globe,
  Zap
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('7d');

  const portfolioData = [
    { name: 'Ocak', value: 4000, carbonCredits: 120 },
    { name: 'Şubat', value: 3000, carbonCredits: 98 },
    { name: 'Mart', value: 5000, carbonCredits: 156 },
    { name: 'Nisan', value: 4500, carbonCredits: 142 },
    { name: 'Mayıs', value: 6000, carbonCredits: 189 },
    { name: 'Haziran', value: 5500, carbonCredits: 167 },
  ];

  const carbonCreditData = [
    { name: 'Orman Koruma', value: 35, color: '#10b981' },
    { name: 'Yenilenebilir Enerji', value: 28, color: '#3b82f6' },
    { name: 'Temiz Teknoloji', value: 22, color: '#8b5cf6' },
    { name: 'Sürdürülebilir Tarım', value: 15, color: '#f59e0b' },
  ];

  const recentTransactions = [
    { id: 1, type: 'buy', amount: 1500, credits: 45, date: '2024-01-15', project: 'Amazon Orman Koruma' },
    { id: 2, type: 'sell', amount: 800, credits: 25, date: '2024-01-14', project: 'Rüzgar Enerjisi TR' },
    { id: 3, type: 'buy', amount: 2200, credits: 67, date: '2024-01-13', project: 'Solar Panel Projesi' },
    { id: 4, type: 'stake', amount: 1000, credits: 30, date: '2024-01-12', project: 'DCB Staking Pool' },
  ];

  const stats = [
    {
      title: 'Toplam Portföy Değeri',
      value: '₺125,450',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Karbon Kredisi Bakiyesi',
      value: '1,247 tCO2',
      change: '+8.3%',
      changeType: 'positive',
      icon: Leaf,
      color: 'green'
    },
    {
      title: 'DCB Token Bakiyesi',
      value: '45,678 DCB',
      change: '+15.2%',
      changeType: 'positive',
      icon: Zap,
      color: 'blue'
    },
    {
      title: 'Staking Getirileri',
      value: '₺8,945',
      change: '+5.7%',
      changeType: 'positive',
      icon: Target,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
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

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Portföy Performansı</h3>
              <div className="flex space-x-2">
                {['7d', '30d', '90d', '1y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeframe === period
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolioData}>
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

          {/* Carbon Credits Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Karbon Kredisi Dağılımı</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={carbonCreditData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {carbonCreditData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {carbonCreditData.map((item, index) => (
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

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Son İşlemler</h3>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">
              Tümünü Görüntüle
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">İşlem Türü</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Proje</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Miktar</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Karbon Kredisi</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'buy' ? 'bg-emerald-100' :
                          transaction.type === 'sell' ? 'bg-red-100' :
                          'bg-blue-100'
                        }`}>
                          {transaction.type === 'buy' ? (
                            <ArrowUpRight className={`w-4 h-4 ${
                              transaction.type === 'buy' ? 'text-emerald-600' : 'text-red-600'
                            }`} />
                          ) : transaction.type === 'sell' ? (
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          ) : (
                            <Target className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <span className="font-medium capitalize">
                          {transaction.type === 'buy' ? 'Alım' :
                           transaction.type === 'sell' ? 'Satım' : 'Staking'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900">{transaction.project}</td>
                    <td className="py-4 px-4 font-medium">₺{transaction.amount.toLocaleString()}</td>
                    <td className="py-4 px-4">{transaction.credits} tCO2</td>
                    <td className="py-4 px-4 text-gray-600">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
            <Wallet className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Karbon Kredisi Satın Al</h3>
            <p className="text-emerald-100 mb-4">Doğrulanmış karbon kredilerini satın alın</p>
            <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
              Satın Al
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <Activity className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">DCB Token Stake Et</h3>
            <p className="text-blue-100 mb-4">Token'larınızı stake ederek getiri elde edin</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Stake Et
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <Globe className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Proje Keşfet</h3>
            <p className="text-purple-100 mb-4">Yeni karbon nötrleme projelerini keşfedin</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Keşfet
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};