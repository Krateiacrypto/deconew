import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Target, 
  Users, 
  Globe,
  Award,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Karbon Kredisi İşlemi', value: '50M+', suffix: 'tCO2' },
    { label: 'Aktif Kullanıcı', value: '25K+', suffix: '' },
    { label: 'Desteklenen Proje', value: '150+', suffix: '' },
    { label: 'Ülke Kapsamı', value: '45+', suffix: '' },
  ];

  const values = [
    {
      icon: Leaf,
      title: 'Sürdürülebilirlik',
      description: 'Çevresel sürdürülebilirlik ve karbon nötrleme konularında öncü olmak'
    },
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description: 'Blockchain teknolojisi ile şeffaf ve güvenli işlemler sağlamak'
    },
    {
      icon: Globe,
      title: 'Global Etki',
      description: 'Dünya çapında karbon emisyonlarını azaltmaya katkıda bulunmak'
    },
    {
      icon: Users,
      title: 'Topluluk',
      description: 'Güçlü bir topluluk oluşturarak birlikte hareket etmek'
    }
  ];

  const team = [
    {
      name: 'Dr. Mehmet Yılmaz',
      role: 'CEO & Kurucu',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      bio: '15 yıllık çevre mühendisliği deneyimi ve blockchain teknolojileri uzmanı',
      linkedin: '#'
    },
    {
      name: 'Ayşe Demir',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
      bio: 'Blockchain geliştirme ve smart contract uzmanı, 10+ yıl teknoloji deneyimi',
      linkedin: '#'
    },
    {
      name: 'Can Özkan',
      role: 'CFO',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
      bio: 'Finans ve yatırım uzmanı, karbon piyasaları konusunda 12 yıl deneyim',
      linkedin: '#'
    },
    {
      name: 'Dr. Zeynep Kaya',
      role: 'Sürdürülebilirlik Direktörü',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg',
      bio: 'Çevre bilimi doktoru, uluslararası karbon kredisi projelerinde uzman',
      linkedin: '#'
    }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'Şirket Kuruluşu',
      description: 'DECARBONIZE projesi hayata geçirildi ve ilk ekip oluşturuldu'
    },
    {
      year: '2023',
      title: 'Platform Geliştirme',
      description: 'ReefChain altyapısı üzerinde platform geliştirilmeye başlandı'
    },
    {
      year: '2024',
      title: 'ICO Lansmanı',
      description: 'DCB Token ICO\'su başlatıldı ve ilk yatırımcılar katıldı'
    },
    {
      year: '2024',
      title: 'Global Genişleme',
      description: 'Uluslararası ortaklıklar kuruldu ve global pazara açıldı'
    }
  ];

  const partnerships = [
    {
      name: 'ReefChain',
      logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'Blockchain altyapı ortağımız'
    },
    {
      name: 'Carbon Trust',
      logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'Karbon kredisi doğrulama ortağı'
    },
    {
      name: 'Green Climate Fund',
      logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'Proje finansman ortağı'
    },
    {
      name: 'UN Climate Change',
      logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'Uluslararası standart ortağı'
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
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            DECARBONIZE, blockchain teknolojisi ile karbon kredilerini tokenleştirerek 
            sürdürülebilir bir gelecek inşa etmeyi hedefleyen öncü bir platformdur. 
            Misyonumuz, karbon nötrleme projelerine erişimi demokratikleştirmek ve 
            çevre dostu yatırımları teşvik etmektir.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                  <span className="text-2xl ml-1">{stat.suffix}</span>
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h3>
            <p className="text-gray-600 leading-relaxed">
              Blockchain teknolojisinin gücünü kullanarak karbon kredilerini tokenleştirmek, 
              şeffaf ve erişilebilir bir karbon piyasası oluşturmak. Böylece bireyler ve 
              kurumların çevre dostu projelere kolayca yatırım yapabilmesini sağlamak.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h3>
            <p className="text-gray-600 leading-relaxed">
              Küresel karbon nötrleme hedeflerine ulaşılmasında öncü rol oynamak ve 
              sürdürülebilir bir gelecek için teknoloji ile çevre koruma arasında 
              köprü kurmak. Dünya çapında karbon emisyonlarının azaltılmasına katkıda bulunmak.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Değerlerimiz</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Ekibimiz</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 text-center mb-1">{member.name}</h4>
                <p className="text-emerald-600 text-center font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm text-center leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Yolculuğumuz</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-emerald-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="text-emerald-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Partnerships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Ortaklarımız</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerships.map((partner, index) => (
              <div key={partner.name} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{partner.name}</h4>
                <p className="text-gray-600 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-emerald-600 to-blue-700 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Bizimle İletişime Geçin</h3>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            DECARBONIZE hakkında daha fazla bilgi almak veya ortaklık fırsatlarını 
            değerlendirmek için bizimle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
              İletişim
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-emerald-600 transition-colors">
              Whitepaper İndir
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};