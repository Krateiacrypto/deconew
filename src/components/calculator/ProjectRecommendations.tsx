import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  category: string;
  location: string;
  co2PerUnit: number; // kg CO2 per TRY
  minInvestment: number;
  image: string;
  description: string;
  verified: boolean;
}

interface ProjectRecommendationsProps {
  totalEmissions: number; // kg CO2
}

const ProjectRecommendations: React.FC<ProjectRecommendationsProps> = ({
  totalEmissions,
}) => {
  const navigate = useNavigate();

  // Mock projects - In real app, this would come from API
  const projects: Project[] = [
    {
      id: 1,
      name: 'Amazon Ağaçlandırma Projesi',
      category: 'Ağaçlandırma',
      location: 'Brezilya',
      co2PerUnit: 2.5, // 2.5 kg CO2 offset per TRY invested
      minInvestment: 100,
      image: '🌳',
      description: 'Amazon yağmur ormanlarında yeni ağaç dikimi ve koruma',
      verified: true,
    },
    {
      id: 2,
      name: 'Güneş Enerjisi Tesisi',
      category: 'Yenilenebilir Enerji',
      location: 'Türkiye',
      co2PerUnit: 3.2,
      minInvestment: 500,
      image: '☀️',
      description: 'Anadolu bölgesinde güneş enerjisi santrali kurulumu',
      verified: true,
    },
    {
      id: 3,
      name: 'Okyanus Temizleme',
      category: 'Deniz Koruma',
      location: 'Akdeniz',
      co2PerUnit: 1.8,
      minInvestment: 250,
      image: '🌊',
      description: 'Akdeniz\'de plastik atık toplama ve geri dönüşüm',
      verified: true,
    },
    {
      id: 4,
      name: 'Rüzgar Türbini Projesi',
      category: 'Yenilenebilir Enerji',
      location: 'İzmir',
      co2PerUnit: 2.9,
      minInvestment: 1000,
      image: '💨',
      description: 'Ege bölgesinde rüzgar enerjisi santrali',
      verified: true,
    },
  ];

  // Calculate recommended investment for each project to offset total emissions
  const getRecommendedInvestment = (project: Project) => {
    const requiredOffset = totalEmissions; // kg CO2
    const investmentNeeded = Math.ceil(requiredOffset / project.co2PerUnit);
    return Math.max(investmentNeeded, project.minInvestment);
  };

  const handleProjectClick = (projectId: number) => {
    // Navigate to project detail page
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offset Proje Önerileri</h2>
          <p className="text-gray-600">
            {(totalEmissions / 1000).toFixed(2)} ton CO₂'nizi dengelemek için uygun projeler
          </p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Tüm Projeler
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => {
          const recommendedInvestment = getRecommendedInvestment(project);
          const offsetAmount = (recommendedInvestment * project.co2PerUnit) / 1000; // Convert to tons

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              {/* Image/Icon Section */}
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8 text-center">
                <span className="text-6xl">{project.image}</span>
                {project.verified && (
                  <div className="mt-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Doğrulanmış
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {project.category}
                    </span>
                    <span className="flex items-center gap-1">
                      📍 {project.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{project.description}</p>

                {/* Investment Recommendation */}
                <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Önerilen Yatırım
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ₺{recommendedInvestment.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Offset Miktarı</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {offsetAmount.toFixed(2)} ton CO₂
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectClick(project.id);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
                >
                  Projeye Git →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Karbon Offseti Nasıl Çalışır?
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Karbon offseti, atmosfere salınan sera gazlarını dengelemek için başka bir yerde
              karbon emisyonlarını azaltma veya önleme sürecidir. Yeşil projelere yatırım
              yaparak karbon ayak izinizi sıfırlayabilirsiniz.
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Doğrulanmış projelere güvenli yatırım</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Gerçek zamanlı karbon kredisi takibi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Sertifikalı CO₂ azaltımı garantisi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRecommendations;
