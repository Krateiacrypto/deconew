import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Globe, 
  Target,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Leaf,
  BarChart3,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const WhitepaperPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const sections = [
    {
      id: 'executive-summary',
      title: 'Yönetici Özeti',
      icon: FileText,
      description: 'DECARBONIZE projesinin genel bakışı ve temel hedefleri'
    },
    {
      id: 'problem-solution',
      title: 'Problem ve Çözüm',
      icon: Target,
      description: 'Karbon kredisi piyasasındaki mevcut sorunlar ve çözüm önerimiz'
    },
    {
      id: 'technology',
      title: 'Teknoloji Altyapısı',
      icon: Zap,
      description: 'ReefChain blockchain teknolojisi ve smart contract yapısı'
    },
    {
      id: 'tokenomics',
      title: 'Token Ekonomisi',
      icon: BarChart3,
      description: 'DCB Token dağılımı, kullanım alanları ve ekonomik model'
    },
    {
      id: 'roadmap',
      title: 'Yol Haritası',
      icon: TrendingUp,
      description: 'Proje geliştirme aşamaları ve gelecek planları'
    },
    {
      id: 'team',
      title: 'Ekip ve Danışmanlar',
      icon: Users,
      description: 'Proje ekibi, danışmanlar ve ortaklar hakkında bilgiler'
    }
  ];

  const keyFeatures = [
    {
      icon: Leaf,
      title: 'Karbon Kredisi Tokenleştirme',
      description: 'Geleneksel karbon kredilerinin blockchain üzerinde tokenleştirilmesi'
    },
    {
      icon: Shield,
      title: 'Şeffaflık ve Güvenlik',
      description: 'Blockchain teknolojisi ile tam şeffaflık ve güvenli işlemler'
    },
    {
      icon: Globe,
      title: 'Global Erişilebilirlik',
      description: 'Dünya çapında herkesin karbon kredisi piyasasına erişimi'
    },
    {
      icon: TrendingUp,
      title: 'Likidite ve Verimlilik',
      description: 'Yüksek likidite ve verimli fiyat keşfi mekanizması'
    }
  ];

  const marketData = [
    { metric: 'Global Karbon Piyasası Büyüklüğü', value: '$851 Milyar', growth: '+84%' },
    { metric: 'Yıllık İşlem Hacmi', value: '11.2 GtCO2', growth: '+164%' },
    { metric: 'Beklenen Büyüme (2030)', value: '$2.68 Trilyon', growth: '+215%' },
    { metric: 'Aktif Proje Sayısı', value: '7,500+', growth: '+45%' }
  ];

  const downloadStats = [
    { label: 'Toplam İndirme', value: '15,847' },
    { label: 'Bu Ay', value: '2,341' },
    { label: 'Dil Seçeneği', value: '4' },
    { label: 'Sayfa Sayısı', value: '68' }
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
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            DECARBONIZE Whitepaper
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Karbon kredilerinin tokenleştirilmesi ve blockchain teknolojisi ile 
            sürdürülebilir gelecek için kapsamlı teknik dokümantasyon
          </p>
        </motion.div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Whitepaper'ı İndirin</h3>
              <p className="text-gray-600 mb-6">
                DECARBONIZE projesinin detaylı teknik dokümantasyonunu indirerek 
                karbon kredisi tokenleştirme teknolojimiz hakkında kapsamlı bilgi edinin.
              </p>
              
              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dil Seçin</label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                        selectedLanguage === lang.code
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Whitepaper İndir (PDF)</span>
              </button>
            </div>

            {/* Download Stats */}
            <div className="grid grid-cols-2 gap-4">
              {downloadStats.map((stat, index) => (
                <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Temel Özellikler</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Piyasa Analizi</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.map((data, index) => (
              <div key={data.metric} className="text-center">
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{data.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{data.metric}</div>
                  <div className="text-emerald-600 font-medium text-sm">{data.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">İçindekiler</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <div key={section.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h4>
                  <p className="text-gray-600 text-sm">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Blockchain Specs */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Blockchain Özellikleri</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Blockchain</span>
                <span className="font-medium">ReefChain</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Konsensüs</span>
                <span className="font-medium">Nominated Proof of Stake</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">İşlem Hızı</span>
                <span className="font-medium">1000+ TPS</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">İşlem Ücreti</span>
                <span className="font-medium">~$0.001</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Smart Contract</span>
                <span className="font-medium">EVM Uyumlu</span>
              </div>
            </div>
          </div>

          {/* Token Specs */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Token Özellikleri</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Token Adı</span>
                <span className="font-medium">DECARBONIZE</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Sembol</span>
                <span className="font-medium">DCB</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Toplam Arz</span>
                <span className="font-medium">1,000,000,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Decimal</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Token Türü</span>
                <span className="font-medium">Utility Token</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Ek Kaynaklar</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="#" className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
              <FileText className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="font-medium text-gray-900">Teknik Dokümantasyon</div>
                <div className="text-sm text-gray-600">API ve entegrasyon rehberi</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            
            <a href="#" className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
              <Shield className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="font-medium text-gray-900">Güvenlik Denetimi</div>
                <div className="text-sm text-gray-600">Smart contract denetim raporu</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            
            <a href="#" className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              <div>
                <div className="font-medium text-gray-900">Ekonomik Model</div>
                <div className="text-sm text-gray-600">Detaylı tokenomics analizi</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-br from-emerald-600 to-blue-700 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Sorularınız mı var?</h3>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            DECARBONIZE projesi hakkında daha fazla bilgi almak için 
            teknik ekibimizle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2">
              <span>Teknik Destek</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-emerald-600 transition-colors">
              Community'ye Katıl
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};