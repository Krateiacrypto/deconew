import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Target, 
  Users, 
  DollarSign,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Calendar,
  Award
} from 'lucide-react';

export const ICOPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  const [currentPhase, setCurrentPhase] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const icoPhases = [
    {
      phase: 1,
      name: 'Seed Round',
      price: 0.08,
      discount: '60%',
      status: 'completed',
      raised: 2500000,
      target: 2500000
    },
    {
      phase: 2,
      name: 'Private Sale',
      price: 0.12,
      discount: '40%',
      status: 'active',
      raised: 3200000,
      target: 5000000
    },
    {
      phase: 3,
      name: 'Public Sale',
      price: 0.16,
      discount: '20%',
      status: 'upcoming',
      raised: 0,
      target: 7500000
    },
    {
      phase: 4,
      name: 'Final Round',
      price: 0.20,
      discount: '0%',
      status: 'upcoming',
      raised: 0,
      target: 10000000
    }
  ];

  const tokenomics = [
    { category: 'Public Sale', percentage: 40, amount: 400000000, color: '#10b981' },
    { category: 'Team & Advisors', percentage: 20, amount: 200000000, color: '#3b82f6' },
    { category: 'Development', percentage: 15, amount: 150000000, color: '#8b5cf6' },
    { category: 'Marketing', percentage: 10, amount: 100000000, color: '#f59e0b' },
    { category: 'Reserve', percentage: 10, amount: 100000000, color: '#ef4444' },
    { category: 'Partnerships', percentage: 5, amount: 50000000, color: '#06b6d4' }
  ];

  const roadmapItems = [
    {
      quarter: 'Q1 2024',
      title: 'Platform Lansmanı',
      items: ['ICO Başlangıcı', 'Smart Contract Denetimi', 'Community Building'],
      status: 'completed'
    },
    {
      quarter: 'Q2 2024',
      title: 'Token Satışı',
      items: ['Public Sale', 'Exchange Listelemeleri', 'Staking Protokolü'],
      status: 'active'
    },
    {
      quarter: 'Q3 2024',
      title: 'Ürün Geliştirme',
      items: ['Carbon Credit Marketplace', 'Mobile App', 'API Entegrasyonları'],
      status: 'upcoming'
    },
    {
      quarter: 'Q4 2024',
      title: 'Global Genişleme',
      items: ['Uluslararası Ortaklıklar', 'Governance Token', 'DAO Lansmanı'],
      status: 'upcoming'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Güvenli ve Şeffaf',
      description: 'Smart contract denetimi tamamlanmış, tamamen şeffaf token satışı'
    },
    {
      icon: Zap,
      title: 'ReefChain Altyapısı',
      description: 'Hızlı ve düşük maliyetli işlemler için ReefChain blockchain kullanımı'
    },
    {
      icon: Globe,
      title: 'Global Erişim',
      description: 'Dünya çapında karbon kredisi piyasasına erişim imkanı'
    },
    {
      icon: TrendingUp,
      title: 'Yüksek Potansiyel',
      description: 'Büyüyen karbon kredisi piyasasında erken yatırım fırsatı'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            DECARBONIZE Token ICO
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Karbon nötrleme projelerine yatırım yapın ve sürdürülebilir geleceğin bir parçası olun. 
            DCB Token ile çevre dostu yatırımların öncüsü olun.
          </p>
          
          {/* Countdown Timer */}
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Private Sale Bitiş Süresi</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white rounded-xl p-4">
                    <div className="text-3xl font-bold">{value}</div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 capitalize">
                    {unit === 'days' ? 'Gün' : 
                     unit === 'hours' ? 'Saat' : 
                     unit === 'minutes' ? 'Dakika' : 'Saniye'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ICO Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">ICO İlerlemesi</h3>
          
          {/* Current Phase Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">$3.2M</div>
              <div className="text-gray-600">Toplanan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$5M</div>
              <div className="text-gray-600">Hedef</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">26,667</div>
              <div className="text-gray-600">Satılan Token (M)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">$0.12</div>
              <div className="text-gray-600">Mevcut Fiyat</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Private Sale İlerlemesi</span>
              <span className="text-sm text-gray-600">64%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-4 rounded-full transition-all duration-300" style={{ width: '64%' }}></div>
            </div>
          </div>

          {/* Phase Timeline */}
          <div className="grid md:grid-cols-4 gap-4">
            {icoPhases.map((phase, index) => (
              <div
                key={phase.phase}
                className={`p-4 rounded-xl border-2 ${
                  phase.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                  phase.status === 'active' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">Faz {phase.phase}</span>
                  {phase.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {phase.status === 'active' && <Clock className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="text-sm text-gray-600 mb-2">{phase.name}</div>
                <div className="text-lg font-bold text-gray-900">${phase.price}</div>
                <div className="text-sm text-emerald-600">{phase.discount} İndirim</div>
                <div className="mt-2 text-xs text-gray-500">
                  ${phase.raised.toLocaleString()} / ${phase.target.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Purchase Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Token Purchase */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">DCB Token Satın Al</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemi</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>USDT (TRC20)</option>
                  <option>USDC (ERC20)</option>
                  <option>BTC</option>
                  <option>ETH</option>
                  <option>BNB</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Miktar (USD)</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Alacağınız DCB Token:</span>
                  <span className="font-bold">833.33 DCB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bonus (%40):</span>
                  <span className="font-bold text-emerald-600">+333.33 DCB</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Toplam:</span>
                  <span className="font-bold text-lg">1,166.66 DCB</span>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-200">
              Token Satın Al
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              Minimum yatırım: $100 | Maksimum yatırım: $50,000
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tokenomics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Token Dağılımı</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pie Chart Representation */}
            <div className="space-y-4">
              {tokenomics.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{item.percentage}%</div>
                    <div className="text-sm text-gray-600">{item.amount.toLocaleString()} DCB</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Token Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-6 rounded-xl">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Token Bilgileri</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Token Adı:</span>
                    <span className="font-medium">DECARBONIZE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sembol:</span>
                    <span className="font-medium">DCB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toplam Arz:</span>
                    <span className="font-medium">1,000,000,000 DCB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blockchain:</span>
                    <span className="font-medium">ReefChain</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Token Türü:</span>
                    <span className="font-medium">Utility Token</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Yol Haritası</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapItems.map((item, index) => (
              <div
                key={item.quarter}
                className={`p-6 rounded-xl border-2 ${
                  item.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                  item.status === 'active' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.quarter}
                  </span>
                  {item.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {item.status === 'active' && <Clock className="w-5 h-5 text-blue-600" />}
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h4>
                
                <ul className="space-y-2">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'completed' ? 'bg-emerald-500' :
                        item.status === 'active' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}></div>
                      <span>{subItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};