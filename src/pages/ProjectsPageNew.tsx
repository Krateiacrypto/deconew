import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  MapPin,
  Calendar,
  Globe,
  Sun,
  Trees,
  Droplets,
  Search,
  GitCompare,
  SlidersHorizontal,
  Loader,
  AlertCircle
} from 'lucide-react';
import AdvancedFilters from '../components/projects/AdvancedFilters';
import ProjectComparison from '../components/projects/ProjectComparison';
import {
  getPublicProjects,
  PublicProject,
  mapCategoryToBackend,
  calculateProgress,
  getDefaultProjectImage
} from '../services/api/projectsApi';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [projects, setProjects] = useState<PublicProject[]>([]);

  const categories = [
    { id: 'all', name: 'Tümü', icon: Globe },
    { id: 'forest', name: 'Orman Koruma', icon: Trees },
    { id: 'renewable', name: 'Yenilenebilir Enerji', icon: Sun },
    { id: 'water', name: 'Su Koruma', icon: Droplets },
    { id: 'agriculture', name: 'Sürdürülebilir Tarım', icon: Leaf },
  ];

  // Load projects from backend
  const { loading, error, execute } = useAsyncOperation({
    showErrorToast: true,
    errorMessage: 'Projeler yüklenirken bir hata oluştu'
  });

  useEffect(() => {
    const loadProjects = async () => {
      const backendCategory = mapCategoryToBackend(selectedCategory);
      const response = await execute(async () => {
        return getPublicProjects({
          category: backendCategory === 'all' ? undefined : backendCategory,
          search: searchTerm || undefined,
          limit: 50
        });
      });

      if (response && response.success && response.data) {
        setProjects(response.data.projects);
      }
    };

    loadProjects();
  }, [selectedCategory, searchTerm, execute]);

  const handleProjectSelection = (projectId: number) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, projectId];
      }
    });
  };

  const getImpactIcon = (category: string) => {
    switch (category) {
      case 'reforestation':
      case 'forest': return Trees;
      case 'renewable_energy':
      case 'renewable': return Sun;
      case 'clean_water':
      case 'water': return Droplets;
      case 'sustainable_agriculture':
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Karbon Nötrleme Projeleri</h1>
                <p className="text-gray-600">Doğrulanmış karbon kredisi projelerine yatırım yapın ve çevreyi koruyun</p>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                {/* Advanced Filters Button */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    showAdvancedFilters
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Gelişmiş Filtreler</span>
                </button>

                {/* Comparison Button */}
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  disabled={selectedProjects.length === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedProjects.length > 0
                      ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <GitCompare className="w-5 h-5" />
                  <span>Karşılaştır ({selectedProjects.length})</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <AdvancedFilters
              onFilterChange={(filters) => {
                console.log('Filters applied:', filters);
              }}
              onSortChange={(sort) => {
                console.log('Sort changed:', sort);
              }}
              initialFilters={{}}
            />
          </motion.div>
        )}

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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 animate-spin mx-auto text-emerald-600" />
            <p className="mt-4 text-gray-600">Projeler yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-600 mb-2">Projeler yüklenirken hata oluştu</p>
            <p className="text-gray-600 text-sm">{typeof error === 'string' ? error : error?.message || 'Bilinmeyen bir hata oluştu'}</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Şu an gösterilecek proje bulunmuyor</p>
            <p className="text-gray-500 text-sm mt-2">Farklı bir kategori seçmeyi deneyin</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const ImpactIcon = getImpactIcon(project.category);
              const progress = calculateProgress(project);
              const imageUrl = project.image_url || getDefaultProjectImage(project.category);
              const carbonCredits = parseFloat(project.co2_reduction_calculated);

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    selectedProjects.includes(project.id) ? 'ring-4 ring-blue-500' : ''
                  }`}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Selection Checkbox */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => handleProjectSelection(project.id)}
                          disabled={!selectedProjects.includes(project.id) && selectedProjects.length >= 3}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
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
                        <span>{new Date(project.end_date).getFullYear()}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">İlerleme</span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{carbonCredits.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Karbon Kredisi (tCO2)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{project.participants_count.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Katılımcı</div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">
                          ${(parseFloat(project.funding_goal) / carbonCredits).toFixed(2)}
                        </div>
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
        )}

        {/* Project Comparison Modal */}
        {showComparison && selectedProjects.length > 0 && (
          <ProjectComparison
            initialProjects={projects.filter(p => selectedProjects.includes(p.id)) as any}
            onClose={() => setShowComparison(false)}
          />
        )}
      </div>
    </div>
  );
};
