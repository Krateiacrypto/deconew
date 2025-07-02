import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, Shield } from 'lucide-react';
import { StakingDashboard } from '../components/staking/StakingDashboard';

export const StakingPage: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Yüksek Getiri',
      description: 'DCB token\'larınızı stake ederek %12.5\'e varan yıllık getiri elde edin'
    },
    {
      icon: Shield,
      title: 'Güvenli Staking',
      description: 'Smart contract tabanlı güvenli staking protokolü'
    },
    {
      icon: TrendingUp,
      title: 'Compound Faiz',
      description: 'Ödülleriniz otomatik olarak yeniden stake edilir'
    },
    {
      icon: Zap,
      title: 'Esnek Süreler',
      description: '30, 90 ve 180 günlük farklı staking seçenekleri'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            DCB Token Staking
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Token'larınızı stake ederek pasif gelir elde edin ve 
            DECARBONIZE ekosisteminin büyümesine katkıda bulunun
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Staking Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StakingDashboard />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-gradient-to-br from-emerald-600 to-blue-700 rounded-2xl p-8 text-white"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Staking Nasıl Çalışır?</h3>
              <div className="space-y-3 text-emerald-100">
                <p>• DCB token'larınızı staking havuzuna kilitleyin</p>
                <p>• Belirlenen süre boyunca token'larınız kilitli kalır</p>
                <p>• Günlük olarak ödül kazanmaya başlarsınız</p>
                <p>• Süre sonunda token'larınızı ve ödüllerinizi çekebilirsiniz</p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="text-lg font-bold mb-4">Staking Avantajları</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Minimum Staking:</span>
                  <span className="font-medium">100 DCB</span>
                </div>
                <div className="flex justify-between">
                  <span>Maksimum APY:</span>
                  <span className="font-medium">%18.2</span>
                </div>
                <div className="flex justify-between">
                  <span>Ödül Dağıtımı:</span>
                  <span className="font-medium">Günlük</span>
                </div>
                <div className="flex justify-between">
                  <span>Erken Çekim:</span>
                  <span className="font-medium">%5 Ceza</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};