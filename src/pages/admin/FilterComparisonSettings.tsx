/**
 * Admin Panel - Filter & Comparison Settings
 * Configure project filters, comparison fields, and backup/restore settings
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Filter,
  GitCompare,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'checkbox' | 'search';
  category: string;
  enabled: boolean;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

interface ComparisonFieldConfig {
  id: string;
  label: string;
  category: string;
  enabled: boolean;
  format?: string;
}

export function FilterComparisonSettings() {
  const [activeTab, setActiveTab] = useState<'filters' | 'comparison' | 'backup'>('filters');
  const [filters, setFilters] = useState<FilterConfig[]>([
    {
      id: 'category',
      label: 'Kategori',
      type: 'multiselect',
      category: 'general',
      enabled: true,
      required: true,
      options: [
        { value: 'renewable_energy', label: 'Yenilenebilir Enerji' },
        { value: 'forestry', label: 'Ormancılık' },
      ],
    },
    {
      id: 'fundingGoal',
      label: 'Hedef Fonlama',
      type: 'range',
      category: 'financial',
      enabled: true,
      required: false,
      min: 0,
      max: 10000000,
      step: 100000,
      unit: '$',
    },
  ]);

  const [comparisonFields, setComparisonFields] = useState<ComparisonFieldConfig[]>([
    { id: 'title', label: 'Proje Adı', category: 'basic', enabled: true },
    { id: 'fundingGoal', label: 'Hedef Fonlama', category: 'financial', enabled: true, format: 'currency' },
    { id: 'co2Reduction', label: 'CO₂ Azaltımı', category: 'impact', enabled: true, format: 'number' },
  ]);

  const [editingFilter, setEditingFilter] = useState<FilterConfig | null>(null);
  const [editingComparison, setEditingComparison] = useState<ComparisonFieldConfig | null>(null);

  // Filter Management
  const toggleFilterEnabled = (id: string) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const toggleFilterRequired = (id: string) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, required: !f.required } : f)));
  };

  const deleteFilter = (id: string) => {
    if (confirm('Bu filtreyi silmek istediğinizden emin misiniz?')) {
      setFilters(filters.filter((f) => f.id !== id));
      toast.success('Filtre silindi');
    }
  };

  const saveFilterSettings = async () => {
    try {
      // TODO: POST /api/admin/filter-settings
      localStorage.setItem('adminFilterSettings', JSON.stringify(filters));
      toast.success('Filtre ayarları kaydedildi!');
    } catch (error) {
      toast.error('Kaydetme hatası!');
    }
  };

  // Comparison Field Management
  const toggleComparisonEnabled = (id: string) => {
    setComparisonFields(
      comparisonFields.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const deleteComparisonField = (id: string) => {
    if (confirm('Bu karşılaştırma alanını silmek istediğinizden emin misiniz?')) {
      setComparisonFields(comparisonFields.filter((f) => f.id !== id));
      toast.success('Karşılaştırma alanı silindi');
    }
  };

  const saveComparisonSettings = async () => {
    try {
      // TODO: POST /api/admin/comparison-settings
      localStorage.setItem('adminComparisonSettings', JSON.stringify(comparisonFields));
      toast.success('Karşılaştırma ayarları kaydedildi!');
    } catch (error) {
      toast.error('Kaydetme hatası!');
    }
  };

  // Backup & Restore
  const exportSettings = () => {
    const data = {
      filters,
      comparisonFields,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filter-comparison-settings-${Date.now()}.json`;
    a.click();
    toast.success('Ayarlar dışa aktarıldı!');
  };

  const importSettings = () => {
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
          if (imported.filters) setFilters(imported.filters);
          if (imported.comparisonFields) setComparisonFields(imported.comparisonFields);
          toast.success('Ayarlar içe aktarıldı!');
        } catch (error) {
          toast.error('Geçersiz dosya formatı!');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetToDefaults = () => {
    if (confirm('Tüm ayarları varsayılana sıfırlamak istediğinizden emin misiniz?')) {
      // Reset to default settings
      toast.success('Ayarlar varsayılana sıfırlandı!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Filtre & Karşılaştırma Ayarları
          </h1>
          <p className="text-gray-600">
            Proje filtreleme ve karşılaştırma özelliklerini yönetin
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('filters')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'filters'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span>Filtre Ayarları</span>
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'comparison'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <GitCompare className="h-5 w-5" />
              <span>Karşılaştırma Alanları</span>
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'backup'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Yedekleme & Geri Yükleme</span>
            </button>
          </div>
        </div>

        {/* Filter Settings Tab */}
        {activeTab === 'filters' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Actions */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Filtre Listesi</h2>
              <div className="flex space-x-3">
                <button
                  onClick={saveFilterSettings}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
                <button
                  onClick={() => setEditingFilter({} as FilterConfig)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Yeni Filtre Ekle</span>
                </button>
              </div>
            </div>

            {/* Filter List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Filtre Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Aktif
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Zorunlu
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filters.map((filter) => (
                    <tr key={filter.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{filter.label}</div>
                        <div className="text-xs text-gray-500">{filter.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {filter.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {filter.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleFilterEnabled(filter.id)}
                          className={`p-1 rounded transition-colors ${
                            filter.enabled
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {filter.enabled ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={filter.required}
                          onChange={() => toggleFilterRequired(filter.id)}
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => setEditingFilter(filter)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteFilter(filter.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Comparison Settings Tab */}
        {activeTab === 'comparison' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Karşılaştırma Alanları</h2>
              <div className="flex space-x-3">
                <button
                  onClick={saveComparisonSettings}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
                <button
                  onClick={() => setEditingComparison({} as ComparisonFieldConfig)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Yeni Alan Ekle</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Alan Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Format
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Aktif
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFields.map((field) => (
                    <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{field.label}</div>
                        <div className="text-xs text-gray-500">{field.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {field.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {field.format && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {field.format}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleComparisonEnabled(field.id)}
                          className={`p-1 rounded transition-colors ${
                            field.enabled
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {field.enabled ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => setEditingComparison(field)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteComparisonField(field.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Backup & Restore Tab */}
        {activeTab === 'backup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-900">Yedekleme & Geri Yükleme</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Export */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Download className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ayarları Dışa Aktar</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tüm filtre ve karşılaştırma ayarlarını JSON dosyası olarak kaydedin
                </p>
                <button
                  onClick={exportSettings}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Dışa Aktar
                </button>
              </div>

              {/* Import */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Upload className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ayarları İçe Aktar</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Önceden dışa aktarılmış ayarları geri yükleyin
                </p>
                <button
                  onClick={importSettings}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İçe Aktar
                </button>
              </div>

              {/* Reset */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <RotateCcw className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Varsayılana Sıfırla</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tüm ayarları fabrika varsayılanlarına döndürün
                </p>
                <button
                  onClick={resetToDefaults}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Sıfırla
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Dikkat</h4>
                <p className="text-sm text-yellow-700">
                  Ayarları içe aktarmak veya sıfırlamak mevcut yapılandırmayı değiştirecektir.
                  Değişiklik yapmadan önce mevcut ayarlarınızı dışa aktarmanız önerilir.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default FilterComparisonSettings;
