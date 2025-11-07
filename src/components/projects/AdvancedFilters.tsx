/**
 * Advanced Filters Component
 * Admin-configurable filtering system with 15+ filter options
 * Supports filter backup/restore
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  ChevronDown,
  Save,
  RotateCcw,
  Download,
  Upload,
  Settings,
} from 'lucide-react';
import { ProjectFilters, ProjectSortOption } from '../../types/project-enhanced';

interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'checkbox' | 'search';
  category: 'general' | 'financial' | 'impact' | 'risk' | 'location';
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  adminEnabled?: boolean; // Admin can enable/disable filters
  adminRequired?: boolean; // Admin marked as required filter
}

interface SavedFilterPreset {
  id: string;
  name: string;
  filters: Partial<ProjectFilters>;
  createdAt: string;
  userId?: string;
  isPublic?: boolean;
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: ProjectFilters) => void;
  onSortChange: (sort: ProjectSortOption) => void;
  initialFilters?: Partial<ProjectFilters>;
  showAdminControls?: boolean; // Show admin settings
}

export default function AdvancedFilters({
  onFilterChange,
  onSortChange,
  initialFilters = {},
  showAdminControls = false,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Partial<ProjectFilters>>(initialFilters);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['general'])
  );
  const [savedPresets, setSavedPresets] = useState<SavedFilterPreset[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  // Load saved presets from localStorage (in production: GET /api/filters/presets)
  useEffect(() => {
    const saved = localStorage.getItem('filterPresets');
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load filter presets:', e);
      }
    }
  }, []);

  // Admin-configurable filter options
  // In production: GET /api/admin/filter-settings
  const filterOptions: FilterOption[] = [
    // General
    {
      id: 'search',
      label: 'Proje Ara',
      type: 'search',
      category: 'general',
      adminEnabled: true,
    },
    {
      id: 'category',
      label: 'Kategori',
      type: 'multiselect',
      category: 'general',
      options: [
        { value: 'renewable_energy', label: 'Yenilenebilir Enerji' },
        { value: 'forestry', label: 'Ormancılık' },
        { value: 'agriculture', label: 'Tarım' },
        { value: 'ocean', label: 'Okyanus' },
        { value: 'waste_management', label: 'Atık Yönetimi' },
        { value: 'technology', label: 'Teknoloji' },
      ],
      adminEnabled: true,
      adminRequired: true,
    },
    {
      id: 'status',
      label: 'Durum',
      type: 'multiselect',
      category: 'general',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'funding', label: 'Fonlanıyor' },
        { value: 'funded', label: 'Fonlandı' },
        { value: 'completed', label: 'Tamamlandı' },
      ],
      adminEnabled: true,
    },
    {
      id: 'verified',
      label: 'Sadece Doğrulanmış',
      type: 'checkbox',
      category: 'general',
      adminEnabled: true,
    },
    {
      id: 'trending',
      label: 'Sadece Trend Olanlar',
      type: 'checkbox',
      category: 'general',
      adminEnabled: true,
    },

    // Financial
    {
      id: 'fundingGoal',
      label: 'Hedef Fonlama',
      type: 'range',
      category: 'financial',
      min: 0,
      max: 10000000,
      step: 100000,
      unit: '$',
      adminEnabled: true,
    },
    {
      id: 'minInvestment',
      label: 'Minimum Yatırım',
      type: 'range',
      category: 'financial',
      min: 0,
      max: 100000,
      step: 1000,
      unit: '$',
      adminEnabled: true,
    },
    {
      id: 'expectedReturn',
      label: 'Beklenen Getiri (%)',
      type: 'range',
      category: 'financial',
      min: 0,
      max: 50,
      step: 1,
      unit: '%',
      adminEnabled: true,
    },
    {
      id: 'fundingProgress',
      label: 'Fonlama İlerlemesi (%)',
      type: 'range',
      category: 'financial',
      min: 0,
      max: 100,
      step: 10,
      unit: '%',
      adminEnabled: true,
    },

    // Impact
    {
      id: 'co2Reduction',
      label: 'CO₂ Azaltımı (ton/yıl)',
      type: 'range',
      category: 'impact',
      min: 0,
      max: 100000,
      step: 1000,
      unit: 'ton',
      adminEnabled: true,
    },
    {
      id: 'impactScore',
      label: 'Etki Skoru',
      type: 'range',
      category: 'impact',
      min: 0,
      max: 100,
      step: 5,
      unit: '/100',
      adminEnabled: true,
    },
    {
      id: 'biodiversity',
      label: 'Biyoçeşitlilik Skoru',
      type: 'range',
      category: 'impact',
      min: 0,
      max: 10,
      step: 1,
      unit: '/10',
      adminEnabled: true,
    },

    // Risk
    {
      id: 'riskLevel',
      label: 'Risk Seviyesi',
      type: 'multiselect',
      category: 'risk',
      options: [
        { value: 'low', label: 'Düşük' },
        { value: 'medium', label: 'Orta' },
        { value: 'high', label: 'Yüksek' },
      ],
      adminEnabled: true,
    },
    {
      id: 'auditScore',
      label: 'Denetim Skoru',
      type: 'range',
      category: 'risk',
      min: 0,
      max: 100,
      step: 10,
      unit: '/100',
      adminEnabled: true,
    },
    {
      id: 'insured',
      label: 'Sigortalı',
      type: 'checkbox',
      category: 'risk',
      adminEnabled: true,
    },

    // Location
    {
      id: 'country',
      label: 'Ülke',
      type: 'multiselect',
      category: 'location',
      options: [
        { value: 'TR', label: 'Türkiye' },
        { value: 'US', label: 'ABD' },
        { value: 'DE', label: 'Almanya' },
        { value: 'BR', label: 'Brezilya' },
        { value: 'IN', label: 'Hindistan' },
        { value: 'CN', label: 'Çin' },
      ],
      adminEnabled: true,
    },
  ];

  const sortOptions: Array<{ value: ProjectSortOption; label: string }> = [
    { value: 'roi_desc', label: 'En Yüksek Getiri' },
    { value: 'funding_desc', label: 'En Çok Fonlanan' },
    { value: 'impact_desc', label: 'En Yüksek Etki' },
    { value: 'rating_desc', label: 'En Yüksek Puan' },
    { value: 'ending_soon', label: 'Yakında Bitenler' },
    { value: 'newest', label: 'En Yeni' },
  ];

  const categoryLabels = {
    general: 'Genel',
    financial: 'Finansal',
    impact: 'Çevresel Etki',
    risk: 'Risk',
    location: 'Lokasyon',
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

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...filters, [filterId]: value };
    setFilters(newFilters);
    onFilterChange(newFilters as ProjectFilters);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({} as ProjectFilters);
  };

  const savePreset = () => {
    const name = prompt('Filtre ön ayarı için bir isim girin:');
    if (!name) return;

    const newPreset: SavedFilterPreset = {
      id: Date.now().toString(),
      name,
      filters,
      createdAt: new Date().toISOString(),
      isPublic: false,
    };

    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem('filterPresets', JSON.stringify(updatedPresets));

    // TODO: Save to backend - POST /api/filters/presets
    alert(`Filtre "${name}" kaydedildi!`);
  };

  const loadPreset = (preset: SavedFilterPreset) => {
    setFilters(preset.filters);
    onFilterChange(preset.filters as ProjectFilters);
    setShowPresets(false);
  };

  const deletePreset = (id: string) => {
    const updatedPresets = savedPresets.filter((p) => p.id !== id);
    setSavedPresets(updatedPresets);
    localStorage.setItem('filterPresets', JSON.stringify(updatedPresets));
    // TODO: DELETE /api/filters/presets/:id
  };

  const exportFilters = () => {
    const data = JSON.stringify(filters, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filters-${Date.now()}.json`;
    a.click();
  };

  const importFilters = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setFilters(imported);
          onFilterChange(imported);
          alert('Filtreler başarıyla içe aktarıldı!');
        } catch (error) {
          alert('Geçersiz filtre dosyası!');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof ProjectFilters] !== undefined && filters[key as keyof ProjectFilters] !== ''
  ).length;

  // Group filters by category
  const filtersByCategory = filterOptions
    .filter((f) => f.adminEnabled !== false)
    .reduce((acc, filter) => {
      if (!acc[filter.category]) acc[filter.category] = [];
      acc[filter.category].push(filter);
      return acc;
    }, {} as Record<string, FilterOption[]>);

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-5 w-5" />
        <span className="font-medium">Filtreler</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[600px] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Gelişmiş Filtreler</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Sıfırla</span>
                </button>
                <button
                  onClick={savePreset}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Kaydet</span>
                </button>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Ön Ayarlar ({savedPresets.length})</span>
                </button>
                <button
                  onClick={exportFilters}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Dışa Aktar</span>
                </button>
                <button
                  onClick={importFilters}
                  className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>İçe Aktar</span>
                </button>
              </div>
            </div>

            {/* Saved Presets Panel */}
            <AnimatePresence>
              {showPresets && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-b border-gray-200 overflow-hidden"
                >
                  <div className="p-4 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Kayıtlı Ön Ayarlar
                    </h4>
                    {savedPresets.length === 0 ? (
                      <p className="text-sm text-gray-600">Henüz kayıtlı ön ayar yok</p>
                    ) : (
                      <div className="space-y-2">
                        {savedPresets.map((preset) => (
                          <div
                            key={preset.id}
                            className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                          >
                            <div>
                              <div className="font-medium text-sm text-gray-900">
                                {preset.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(preset.createdAt).toLocaleDateString('tr-TR')}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => loadPreset(preset)}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                              >
                                Yükle
                              </button>
                              <button
                                onClick={() => deletePreset(preset.id)}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                              >
                                Sil
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Sort Options */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <select
                  onChange={(e) => onSortChange(e.target.value as ProjectSortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Categories */}
              <div className="space-y-3">
                {Object.entries(filtersByCategory).map(([category, options]) => {
                  const isExpanded = expandedCategories.has(category);
                  return (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-2 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-900">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-600 transition-transform ${
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
                            <div className="p-4 space-y-4">
                              {options.map((filter) => (
                                <div key={filter.id}>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {filter.label}
                                    {filter.adminRequired && (
                                      <span className="text-red-500 ml-1">*</span>
                                    )}
                                  </label>

                                  {/* Search Input */}
                                  {filter.type === 'search' && (
                                    <input
                                      type="text"
                                      value={filters[filter.id as keyof ProjectFilters] || ''}
                                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                                      placeholder="Proje adı veya açıklama ara..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                  )}

                                  {/* Multi-select */}
                                  {filter.type === 'multiselect' && (
                                    <div className="space-y-2">
                                      {filter.options?.map((option) => (
                                        <label
                                          key={option.value}
                                          className="flex items-center space-x-2 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={(
                                              filters[filter.id as keyof ProjectFilters] as string[] || []
                                            ).includes(option.value)}
                                            onChange={(e) => {
                                              const current = (filters[filter.id as keyof ProjectFilters] as string[]) || [];
                                              const newValue = e.target.checked
                                                ? [...current, option.value]
                                                : current.filter((v) => v !== option.value);
                                              handleFilterChange(filter.id, newValue);
                                            }}
                                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                          />
                                          <span className="text-sm text-gray-700">{option.label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  )}

                                  {/* Range */}
                                  {filter.type === 'range' && (
                                    <div>
                                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                        <span>{filter.min}{filter.unit}</span>
                                        <span className="font-medium text-gray-900">
                                          {filters[filter.id as keyof ProjectFilters] || filter.min}{filter.unit}
                                        </span>
                                        <span>{filter.max}{filter.unit}</span>
                                      </div>
                                      <input
                                        type="range"
                                        min={filter.min}
                                        max={filter.max}
                                        step={filter.step}
                                        value={filters[filter.id as keyof ProjectFilters] || filter.min}
                                        onChange={(e) =>
                                          handleFilterChange(filter.id, Number(e.target.value))
                                        }
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                      />
                                    </div>
                                  )}

                                  {/* Checkbox */}
                                  {filter.type === 'checkbox' && (
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={filters[filter.id as keyof ProjectFilters] as boolean || false}
                                        onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                      />
                                      <span className="text-sm text-gray-700">Etkinleştir</span>
                                    </label>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
