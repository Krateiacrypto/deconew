import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  MapPin, 
  Calendar, 
  Target, 
  TrendingUp,
  Users,
  Award,
  Globe,
  Wind,
  Sun,
  Trees,
  Droplets,
  Filter,
  Search
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Tümü', icon: Globe },
    { id: 'forest', name: 'Orman Koruma', icon: Trees },
    { id: 'renewable', name: 'Yenilenebilir Enerji', icon: Sun },
    { id: 'water', name: 'Su Koruma', icon: Droplets },
    { id: 'agriculture', name: 'Sürdürülebilir Tarım', icon: Leaf },
  ];

  const projects = [
    {
      id: 1,
      title: 'Amazon Yağmur Ormanları Koruma Projesi',
      description: 'Brezilya Amazon bölgesinde 50,000 hektar orman alanının korunması ve yeniden ağaçlandırılması projesi.',
      location: 'Brezilya, Amazon',
      category: 'forest',
      carbonCredits: 125000,
      price: 0.25,
      progress: 78,
      startDate: '2023-01-15',
      endDate: '2026-12-31',
      participants: 2847,
      verified: true,
      image: 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg',
      status: 'active',
      impact: {
        co2Reduced: 125000,
        treesPlanted: 45000,
        biodiversityProtected: 850
      }
    },
    {
      id: 2,
      title: 'Türkiye Rüzgar Enerjisi Projesi',
      description: 'Çanakkale bölgesinde 100 MW kapasiteli rüzgar enerjisi santrali kurulumu ve işletmesi.',
      location: 'Çanakkale, Türkiye',
      category: 'renewable',
      carbonCredits: 89000,
      price: 0.28,
      progress: 92,
      startDate: '2022-06-01',
      endDate: '2025-05-31',
      participants: 1923,
      verified: true,
      image: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg',
      status: 'active',
      impact: {
        co2Reduced: 89000,
        energyGenerated: 250000,
        householdsPowered: 75000
      }
    },
    {
      id: 3,
      title: 'Güneş Enerjisi Çiftlik Projesi',
      description: 'Konya bölgesinde 50 MW güneş enerjisi santrali kurulumu ve temiz enerji üretimi.',
      location: 'Konya, Türkiye',
      category: 'renewable',
      carbonCredits: 67000,
      price: 0.22,
      progress: 65,
      startDate: '2023-03-01',
      endDate: '2026-02-28',
      participants: 1456,
      verified: true,
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
      status: 'active',
      impact: {
        co2Reduced: 67000,
        energyGenerated: 180000,
        householdsPowered: 54000
      }
    },
    {
      id: 4,
      title: 'Mangrove Ormanları Restorasyon Projesi',
      description: 'Endonezya sahillerinde mangrove ormanlarının restorasyonu ve korunması projesi.',
      location: 'Endonezya',
      category: 'forest',
      carbonCredits: 95000,
      price: 0.30,
      progress: 45,
      startDate: '2023-08-01',
      endDate: '2027-07-31',
      participants: 3241,
      verified: true,
      image: 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg',
      status: 'active',
      impact: {
        co2Reduced: 95000,
        mangroveArea: 12000,
        marineLifeProtected: 1200
      }
    },
    {
      id: 5,
      title: 'Organik Tarım Geliştirme Projesi',
      description: 'Anadolu bölgesinde organik tarım tekniklerinin yaygınlaştırılması ve sürdürülebilir tarım projesi.',
      location: 'Anadolu, Türkiye',
      category: 'agriculture',
      carbonCredits: 34000,
      price: 0.18,
      progress: 88,
      startDate: '2022-04-01',
      endDate: '2025-03-31',
      participants: 892,
      verified: true,
      image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg',
      status: 'active',
      impact: {
        co2Reduced: 34000,
        farmersSupported: 450,
        organicLand: 8500
      }
    },
    {
      id: 6,
      title: 'Su Koruma ve Temizleme Projesi',
      description: 'Marmara bölgesinde su kaynaklarının korunması ve temizlenmesi projesi.',
      location: 'Marmara, Türkiye',
      category: 'water',
      carbonCredits: 42000,
      price: 0.26,
      progress: 72,
      startDate: '2023-02-01',
      endDate: '2026-01-31',
      participants: 1167,
      verified: true,
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
      status: 'active',
      impact: {
        co2Reduced: 42000,
        waterCleaned: 15000000,
        communitiesServed: 25000
      }
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getImpactIcon = (category: string) => {
    switch (category) {
      case 'forest': return Trees;
      case 'renewable': return Sun;
      case 'water': return Droplets;
      case 'agriculture': return Leaf;
      default: return Globe;
    }
  };

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Karbon Nötrleme Projeleri</h1>
            <p className="text-gray-600">Doğrulanmış karbon kredisi projelerine yatırım yapın ve çevreyi koruyun</p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const ImpactIcon = getImpactIcon(project.category);
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.verified ? 'Doğrulanmış' : 'Beklemede'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                      <ImpactIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                  {/* Location and Date */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.endDate).getFullYear()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">İlerleme</span>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{project.carbonCredits.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Karbon Kredisi (tCO2)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{project.participants.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Katılımcı</div>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">${project.price}</div>
                      <div className="text-xs text-gray-600">tCO2 başına</div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Yatırım Yap
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 hover:text-white transition-all duration-200">
            Daha Fazla Proje Yükle
          </button>
        </motion.div>
      </div>
    </div>
  );
};