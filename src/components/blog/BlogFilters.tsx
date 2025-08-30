import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Tag } from 'lucide-react';
import { BlogCategory, BlogFilters as BlogFiltersType } from '../../types/blog';

interface BlogFiltersProps {
  categories: BlogCategory[];
  filters: BlogFiltersType;
  searchTerm: string;
  onFiltersChange: (filters: BlogFiltersType) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  categories,
  filters,
  searchTerm,
  onFiltersChange,
  onSearchChange,
  onClearFilters
}) => {
  const hasActiveFilters = filters.category || filters.tag || filters.author || searchTerm;

  const popularTags = [
    'karbon kredisi',
    'blockchain',
    'sürdürülebilirlik',
    'yenilenebilir enerji',
    'ESG',
    'tokenleştirme',
    'çevre',
    'yatırım'
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filtreler</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
          >
            <X className="w-4 h-4" />
            <span>Temizle</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Blog yazılarında ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Kategoriler</label>
          <div className="space-y-2">
            <button
              onClick={() => onFiltersChange({ ...filters, category: undefined })}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                !filters.category ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
              }`}
            >
              Tümü ({categories.reduce((sum, cat) => sum + cat.postCount, 0)})
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onFiltersChange({ 
                  ...filters, 
                  category: filters.category === category.name ? undefined : category.name 
                })}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  filters.category === category.name ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                }`}
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">({category.postCount})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Popüler Etiketler</label>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onFiltersChange({ 
                  ...filters, 
                  tag: filters.tag === tag ? undefined : tag 
                })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.tag === tag 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Aktif Filtreler</label>
            <div className="space-y-2">
              {searchTerm && (
                <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-blue-800">Arama: "{searchTerm}"</span>
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {filters.category && (
                <div className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-emerald-800">Kategori: {filters.category}</span>
                  <button
                    onClick={() => onFiltersChange({ ...filters, category: undefined })}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {filters.tag && (
                <div className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-purple-800">Etiket: #{filters.tag}</span>
                  <button
                    onClick={() => onFiltersChange({ ...filters, tag: undefined })}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};