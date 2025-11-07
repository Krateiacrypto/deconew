import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  TrendingUp, 
  Shield, 
  Globe, 
  ArrowRight, 
  Play,
  CheckCircle,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const stats = [
    { label: 'Toplam Token Arzı', value: '1,000,000,000', suffix: 'DCB' },
    { label: 'Karbon Kredisi Değeri', value: '50,000,000', suffix: 'tCO2' },
    { label: 'Aktif Projeler', value: '150+', suffix: '' },
    { label: 'Toplam Yatırımcı', value: '25,000+', suffix: '' },
  ];

  const features = [
    {
      icon: Leaf,
      title: 'Karbon Nötrleme',
      description: 'Uluslararası standartlarda karbon kredilerini tokenleştirerek çevre dostu yatırımları destekliyoruz.'
    },
    {
      icon: Shield,
      title: 'ReefChain Güvenliği',
      description: 'ReefChain altyapısı ile güvenli, şeffaf ve hızlı işlemler gerçekleştirin.'
    },
    {
      icon: TrendingUp,
      title: 'Yüksek Getiri',
      description: 'Karbon kredisi piyasasının büyümesinden faydalanarak sürdürülebilir getiri elde edin.'
    },
    {
      icon: Globe,
      title: 'Global Entegrasyon',
      description: 'Dünya çapında karbon kredi sağlayıcıları ile entegre çalışan platform.'
    }
  ];

  const roadmapItems = [
    { phase: 'Q1 2024', title: 'Platform Lansmanı', status: 'completed' },
    { phase: 'Q2 2024', title: 'ICO ve Token Satışı', status: 'active' },
    { phase: 'Q3 2024', title: 'Exchange Listelemeleri', status: 'upcoming' },
    { phase: 'Q4 2024', title: 'Global Ortaklıklar', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2310b981%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  <Leaf className="w-4 h-4 mr-2" />
                  Karbon Nötrleme Devrimi
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Geleceği
                  <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {' '}Tokenleştir
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  DECARBONIZE Token ile karbon kredilerini blockchain teknolojisi üzerinde 
                  tokenleştirerek sürdürülebilir bir gelecek inşa ediyoruz. ReefChain altyapısı 
                  ile güvenli ve şeffaf işlemler.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/ico"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ICO'ya Katıl
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200">
                  <Play className="mr-2 w-5 h-5" />
                  Demo İzle
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                      <span className="text-emerald-600 ml-1">{stat.suffix}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Leaf className="w-24 h-24 mx-auto mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-2">Karbon Kredisi</h3>
                    <p className="text-lg opacity-90">Tokenleştirme Platformu</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 rounded-full animate-pulse delay-1000"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                  <span className="text-emerald-600 ml-1">{stat.suffix}</span>
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden DECARBONIZE?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Karbon kredilerini blockchain teknolojisi ile tokenleştirerek 
              sürdürülebilir yatırım fırsatları sunuyoruz.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Yol Haritası
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DECARBONIZE Token'ın gelişim sürecini takip edin.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  item.status === 'completed'
                    ? 'border-emerald-200 bg-emerald-50'
                    : item.status === 'active'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  item.status === 'completed'
                    ? 'bg-emerald-500'
                    : item.status === 'active'
                    ? 'bg-blue-500'
                    : 'bg-gray-400'
                }`}>
                  {item.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <div className={`text-sm font-semibold mb-2 ${
                  item.status === 'completed'
                    ? 'text-emerald-600'
                    : item.status === 'active'
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}>
                  {item.phase}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <div className={`text-xs px-3 py-1 rounded-full inline-block ${
                  item.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'active'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status === 'completed' ? 'Tamamlandı' : 
                   item.status === 'active' ? 'Aktif' : 'Yakında'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Sürdürülebilir Geleceğe Yatırım Yapın
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              DECARBONIZE Token ile karbon nötrleme projelerine yatırım yaparak 
              hem çevreyi koruyun hem de getiri elde edin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/ico"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ICO'ya Katıl
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/whitepaper"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-200"
              >
                Whitepaper İncele
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};