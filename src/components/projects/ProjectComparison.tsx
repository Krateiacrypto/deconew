/**
 * Project Comparison Tool
 * Compare up to 3 projects side-by-side
 * Admin-configurable comparison fields
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  TrendingUp,
  Shield,
  Leaf,
  DollarSign,
  Users,
  Clock,
  Award,
  ChevronDown,
  Download,
  Share2,
} from 'lucide-react';
import { EnhancedProject } from '../../types/project-enhanced';
import { useDataStore } from '../../store/dataStore';
import ProjectBadges from './ProjectBadges';

interface ComparisonField {
  id: string;
  label: string;
  category: 'basic' | 'financial' | 'impact' | 'risk' | 'verification';
  getValue: (project: EnhancedProject) => string | number | React.ReactNode;
  format?: 'number' | 'currency' | 'percentage' | 'date' | 'rating' | 'custom';
  adminEnabled?: boolean; // Admin can enable/disable fields
}

interface ProjectComparisonProps {
  initialProjects?: EnhancedProject[];
  maxProjects?: number;
  onClose?: () => void;
}

export default function ProjectComparison({
  initialProjects = [],
  maxProjects = 3,
  onClose,
}: ProjectComparisonProps) {
  const { projects } = useProjectStore();
  const [selectedProjects, setSelectedProjects] = useState<EnhancedProject[]>(initialProjects);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basic', 'financial', 'impact'])
  );

  // Admin-configurable comparison fields
  // In production, fetch from: GET /api/admin/comparison-settings
  const comparisonFields: ComparisonField[] = [
    // Basic Info
    {
      id: 'title',
      label: 'Proje Adı',
      category: 'basic',
      getValue: (p) => p.title,
      adminEnabled: true,
    },
    {
      id: 'category',
      label: 'Kategori',
      category: 'basic',
      getValue: (p) => p.category || 'N/A',
      adminEnabled: true,
    },
    {
      id: 'location',
      label: 'Lokasyon',
      category: 'basic',
      getValue: (p) => p.location || 'N/A',
      adminEnabled: true,
    },
    {
      id: 'badges',
      label: 'Rozetler',
      category: 'basic',
      getValue: (p) => <ProjectBadges badges={p.badges} size="sm" />,
      format: 'custom',
      adminEnabled: true,
    },
    {
      id: 'status',
      label: 'Durum',
      category: 'basic',
      getValue: (p) => p.status || 'active',
      adminEnabled: true,
    },

    // Financial
    {
      id: 'fundingGoal',
      label: 'Hedef Fonlama',
      category: 'financial',
      getValue: (p) => p.fundingGoal,
      format: 'currency',
      adminEnabled: true,
    },
    {
      id: 'currentFunding',
      label: 'Mevcut Fonlama',
      category: 'financial',
      getValue: (p) => p.currentFunding || 0,
      format: 'currency',
      adminEnabled: true,
    },
    {
      id: 'fundingProgress',
      label: 'İlerleme',
      category: 'financial',
      getValue: (p) => p.fundingProgress || 0,
      format: 'percentage',
      adminEnabled: true,
    },
    {
      id: 'minInvestment',
      label: 'Min. Yatırım',
      category: 'financial',
      getValue: (p) => p.investmentRange?.min || 0,
      format: 'currency',
      adminEnabled: true,
    },
    {
      id: 'expectedReturn',
      label: 'Beklenen Getiri (Yıllık)',
      category: 'financial',
      getValue: (p) => p.historicalReturns?.roi?.find((r) => r.period === '1Y')?.percentage || 0,
      format: 'percentage',
      adminEnabled: true,
    },
    {
      id: 'tokenPrice',
      label: 'Token Fiyatı',
      category: 'financial',
      getValue: (p) => p.tokenEconomics?.currentPrice || 0,
      format: 'currency',
      adminEnabled: true,
    },

    // Impact
    {
      id: 'co2Reduction',
      label: 'CO₂ Azaltımı (ton/yıl)',
      category: 'impact',
      getValue: (p) => p.carbonImpact?.totalCO2Reduction || 0,
      format: 'number',
      adminEnabled: true,
    },
    {
      id: 'treesEquivalent',
      label: 'Ağaç Eşdeğeri',
      category: 'impact',
      getValue: (p) => p.carbonImpact?.equivalentTrees || 0,
      format: 'number',
      adminEnabled: true,
    },
    {
      id: 'biodiversityScore',
      label: 'Biyoçeşitlilik Skoru',
      category: 'impact',
      getValue: (p) => p.carbonImpact?.biodiversityScore || 0,
      format: 'rating',
      adminEnabled: true,
    },
    {
      id: 'energyGenerated',
      label: 'Enerji Üretimi (MWh)',
      category: 'impact',
      getValue: (p) => p.carbonImpact?.energyGenerated || 0,
      format: 'number',
      adminEnabled: true,
    },

    // Risk
    {
      id: 'riskLevel',
      label: 'Risk Seviyesi',
      category: 'risk',
      getValue: (p) => {
        const level = p.riskAssessment?.overall || 'medium';
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              level === 'low'
                ? 'bg-green-100 text-green-700'
                : level === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {level === 'low' ? 'Düşük' : level === 'medium' ? 'Orta' : 'Yüksek'}
          </span>
        );
      },
      format: 'custom',
      adminEnabled: true,
    },
    {
      id: 'auditScore',
      label: 'Denetim Skoru',
      category: 'risk',
      getValue: (p) => p.riskAssessment?.auditScore || 0,
      format: 'rating',
      adminEnabled: true,
    },
    {
      id: 'insuranceCoverage',
      label: 'Sigorta Kapsamı',
      category: 'risk',
      getValue: (p) => p.riskAssessment?.insuranceCoverage?.amount || 0,
      format: 'currency',
      adminEnabled: true,
    },

    // Verification
    {
      id: 'certifications',
      label: 'Sertifikalar',
      category: 'verification',
      getValue: (p) => p.verification?.certifications?.length || 0,
      format: 'number',
      adminEnabled: true,
    },
    {
      id: 'auditReports',
      label: 'Denetim Raporları',
      category: 'verification',
      getValue: (p) => p.verification?.auditReports?.length || 0,
      format: 'number',
      adminEnabled: true,
    },
    {
      id: 'blockchainTxs',
      label: 'Blockchain İşlemleri',
      category: 'verification',
      getValue: (p) => p.verification?.blockchainTransactions?.length || 0,
      format: 'number',
      adminEnabled: true,
    },
    {
      id: 'verifiedTxs',
      label: 'Doğrulanmış İşlemler',
      category: 'verification',
      getValue: (p) =>
        p.verification?.blockchainTransactions?.filter((tx) => tx.verified).length || 0,
      format: 'number',
      adminEnabled: true,
    },
  ];

  const formatValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return 'N/A';

    switch (format) {
      case 'currency':
        return `$${Number(value).toLocaleString()}`;
      case 'percentage':
        return `${Number(value).toFixed(1)}%`;
      case 'number':
        return Number(value).toLocaleString();
      case 'rating':
        return `${Number(value).toFixed(1)}/100`;
      case 'date':
        return new Date(value).toLocaleDateString('tr-TR');
      case 'custom':
        return value;
      default:
        return String(value);
    }
  };

  const addProject = (project: EnhancedProject) => {
    if (selectedProjects.length < maxProjects) {
      setSelectedProjects([...selectedProjects, project]);
      setShowProjectSelector(false);
    }
  };

  const removeProject = (index: number) => {
    setSelectedProjects(selectedProjects.filter((_, i) => i !== index));
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const exportComparison = () => {
    // TODO: Implement CSV/PDF export
    alert('Export özelliği yakında eklenecek (CSV/PDF)');
  };

  const shareComparison = () => {
    const projectIds = selectedProjects.map((p) => p.id).join(',');
    const url = `${window.location.origin}/projects/compare?ids=${projectIds}`;
    navigator.clipboard.writeText(url);
    alert('Karşılaştırma linki panoya kopyalandı!');
  };

  // Group fields by category
  const fieldsByCategory = comparisonFields
    .filter((f) => f.adminEnabled !== false) // Only show admin-enabled fields
    .reduce((acc, field) => {
      if (!acc[field.category]) acc[field.category] = [];
      acc[field.category].push(field);
      return acc;
    }, {} as Record<string, ComparisonField[]>);

  const categoryLabels = {
    basic: 'Temel Bilgiler',
    financial: 'Finansal',
    impact: 'Çevresel Etki',
    risk: 'Risk Değerlendirmesi',
    verification: 'Doğrulama',
  };

  const categoryIcons = {
    basic: Award,
    financial: DollarSign,
    impact: Leaf,
    risk: Shield,
    verification: Users,
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Proje Karşılaştırma</h2>
              <p className="text-green-100">
                En fazla {maxProjects} proje karşılaştırabilirsiniz
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportComparison}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Dışa Aktar"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={shareComparison}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Paylaş"
              >
                <Share2 className="h-5 w-5" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Project Selection Row */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${maxProjects}, 1fr)` }}>
            {Array.from({ length: maxProjects }).map((_, index) => (
              <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {selectedProjects[index] ? (
                  <div className="relative">
                    <button
                      onClick={() => removeProject(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <img
                      src={selectedProjects[index].images?.[0] || '/placeholder-project.jpg'}
                      alt={selectedProjects[index].title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {selectedProjects[index].title}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedProjects[index].location}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowProjectSelector(true)}
                    className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-600 transition-colors"
                  >
                    <Plus className="h-12 w-12 mb-2" />
                    <span className="text-sm font-medium">Proje Ekle</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {selectedProjects.length >= 2 && (
            <div className="space-y-4">
              {Object.entries(fieldsByCategory).map(([category, fields]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                const isExpanded = expandedCategories.has(category);

                return (
                  <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full bg-gray-50 px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-gray-900">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-600 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <table className="w-full">
                            <tbody>
                              {fields.map((field) => (
                                <tr key={field.id} className="border-t border-gray-200">
                                  <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700 w-1/4">
                                    {field.label}
                                  </td>
                                  {selectedProjects.map((project, index) => (
                                    <td
                                      key={index}
                                      className="px-4 py-3 text-gray-900 border-l border-gray-200"
                                    >
                                      {field.format === 'custom'
                                        ? field.getValue(project)
                                        : formatValue(field.getValue(project), field.format)}
                                    </td>
                                  ))}
                                  {/* Empty cells for slots without projects */}
                                  {Array.from({
                                    length: maxProjects - selectedProjects.length,
                                  }).map((_, i) => (
                                    <td
                                      key={`empty-${i}`}
                                      className="px-4 py-3 bg-gray-50 border-l border-gray-200"
                                    >
                                      -
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {selectedProjects.length < 2 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">
                Karşılaştırma için en az 2 proje seçmelisiniz
              </p>
            </div>
          )}
        </div>

        {/* Project Selector Modal */}
        <AnimatePresence>
          {showProjectSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center p-6 z-10"
            >
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Proje Seç</h3>
                  <button
                    onClick={() => setShowProjectSelector(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {projects
                    .filter((p) => !selectedProjects.find((sp) => sp.id === p.id))
                    .map((project) => (
                      <button
                        key={project.id}
                        onClick={() => addProject(project as any)}
                        className="text-left border border-gray-200 rounded-lg p-3 hover:border-green-600 hover:shadow-md transition-all"
                      >
                        <img
                          src={project.images?.[0] || '/placeholder-project.jpg'}
                          alt={project.title}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {project.title}
                        </h4>
                        <p className="text-xs text-gray-600">{project.location}</p>
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
