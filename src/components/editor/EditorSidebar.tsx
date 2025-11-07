import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Layers, 
  Palette, 
  Settings, 
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { BlockType } from '../../types/editor';

export const EditorSidebar: React.FC = () => {
  const { blockTemplates, addBlock, editorState } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'blocks' | 'layers' | 'styles'>('blocks');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Metin', 'Layout']);

  const categories = Array.from(new Set(blockTemplates.map(t => t.category)));

  const filteredTemplates = blockTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAddBlock = (blockType: BlockType) => {
    addBlock(blockType);
  };

  const tabs = [
    { id: 'blocks' as const, label: 'Bloklar', icon: Plus },
    { id: 'layers' as const, label: 'Katmanlar', icon: Layers },
    { id: 'styles' as const, label: 'Stiller', icon: Palette }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'blocks' && (
            <motion.div
              key="blocks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Blok ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Block Categories */}
              <div className="space-y-2">
                {categories.map(category => {
                  const categoryTemplates = filteredTemplates.filter(t => t.category === category);
                  const isExpanded = expandedCategories.includes(category);

                  return (
                    <div key={category}>
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <span>{category}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 gap-2 p-2">
                              {categoryTemplates.map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleAddBlock(template.id.split('-')[0] as BlockType)}
                                  className="p-3 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
                                  title={template.description}
                                >
                                  <div className="text-2xl mb-1">{template.icon}</div>
                                  <div className="text-xs font-medium text-gray-700 group-hover:text-emerald-700">
                                    {template.name}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'layers' && (
            <motion.div
              key="layers"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Katman Yönetimi</h3>
              <p className="text-gray-600 text-sm">
                Bu bölüm blok sıralaması ve görünürlük kontrolü için geliştirilecek.
              </p>
            </motion.div>
          )}

          {activeTab === 'styles' && (
            <motion.div
              key="styles"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Global Stiller</h3>
              <p className="text-gray-600 text-sm">
                Bu bölüm sayfa geneli stil ayarları için geliştirilecek.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};