import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Type, Layout, Space as Spacing, Sword as Border, Share as Shadow, ChevronDown, ChevronRight } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useEditorStore } from '../../store/editorStore';
import { BlockStyle } from '../../types/editor';

export const StylePanel: React.FC = () => {
  const { currentPage, editorState, updateBlock } = useEditorStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(['colors', 'typography']);
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const selectedBlock = currentPage?.blocks.find(b => b.id === editorState.selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Stil Paneli</h3>
          <p className="text-gray-600 text-sm">Stilini düzenlemek için bir blok seçin</p>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateStyle = (styleUpdates: Partial<BlockStyle>) => {
    updateBlock(selectedBlock.id, {
      style: { ...selectedBlock.style, ...styleUpdates }
    });
  };

  const StyleSection: React.FC<{
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    children: React.ReactNode;
  }> = ({ id, title, icon: Icon, children }) => {
    const isExpanded = expandedSections.includes(id);

    return (
      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
        >
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
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
              <div className="p-3 border-t border-gray-200">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ColorPicker: React.FC<{
    label: string;
    value: string;
    onChange: (color: string) => void;
    property: string;
  }> = ({ label, value, onChange, property }) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveColorPicker(activeColorPicker === property ? null : property)}
          className="w-8 h-8 rounded border border-gray-300 shadow-sm"
          style={{ backgroundColor: value || '#ffffff' }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
          placeholder="#ffffff"
        />
      </div>
      
      {activeColorPicker === property && (
        <div className="absolute z-50 mt-2">
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
            <HexColorPicker
              color={value || '#ffffff'}
              onChange={onChange}
            />
            <button
              onClick={() => setActiveColorPicker(null)}
              className="mt-2 w-full px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Stil Ayarları</h3>
        <p className="text-sm text-gray-600">
          {selectedBlock.type.toUpperCase()} bloğu düzenleniyor
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Colors */}
        <StyleSection id="colors" title="Renkler" icon={Palette}>
          <ColorPicker
            label="Arka Plan Rengi"
            value={selectedBlock.style.backgroundColor || ''}
            onChange={(color) => updateStyle({ backgroundColor: color })}
            property="backgroundColor"
          />
          <ColorPicker
            label="Metin Rengi"
            value={selectedBlock.style.textColor || ''}
            onChange={(color) => updateStyle({ textColor: color })}
            property="textColor"
          />
        </StyleSection>

        {/* Typography */}
        <StyleSection id="typography" title="Tipografi" icon={Type}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Boyutu</label>
              <select
                value={selectedBlock.style.fontSize || '1rem'}
                onChange={(e) => updateStyle({ fontSize: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="0.75rem">Çok Küçük (12px)</option>
                <option value="0.875rem">Küçük (14px)</option>
                <option value="1rem">Normal (16px)</option>
                <option value="1.125rem">Büyük (18px)</option>
                <option value="1.25rem">Çok Büyük (20px)</option>
                <option value="1.5rem">XL (24px)</option>
                <option value="2rem">2XL (32px)</option>
                <option value="3rem">3XL (48px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Kalınlığı</label>
              <select
                value={selectedBlock.style.fontWeight || 'normal'}
                onChange={(e) => updateStyle({ fontWeight: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="300">İnce</option>
                <option value="400">Normal</option>
                <option value="500">Orta</option>
                <option value="600">Yarı Kalın</option>
                <option value="700">Kalın</option>
                <option value="800">Çok Kalın</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metin Hizalama</label>
              <div className="grid grid-cols-4 gap-1">
                {['left', 'center', 'right', 'justify'].map(align => (
                  <button
                    key={align}
                    onClick={() => updateStyle({ textAlign: align as any })}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      selectedBlock.style.textAlign === align
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {align === 'left' ? 'Sol' :
                     align === 'center' ? 'Orta' :
                     align === 'right' ? 'Sağ' : 'İki Yana'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </StyleSection>

        {/* Spacing */}
        <StyleSection id="spacing" title="Boşluklar" icon={Spacing}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İç Boşluk (Padding)</label>
              <input
                type="text"
                value={selectedBlock.style.padding || ''}
                onChange={(e) => updateStyle({ padding: e.target.value })}
                placeholder="1rem"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dış Boşluk (Margin)</label>
              <input
                type="text"
                value={selectedBlock.style.margin || ''}
                onChange={(e) => updateStyle({ margin: e.target.value })}
                placeholder="1rem 0"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </StyleSection>

        {/* Border & Shadow */}
        <StyleSection id="border" title="Kenarlık & Gölge" icon={Border}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kenarlık</label>
              <input
                type="text"
                value={selectedBlock.style.border || ''}
                onChange={(e) => updateStyle({ border: e.target.value })}
                placeholder="1px solid #e5e7eb"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Köşe Yuvarlaklığı</label>
              <input
                type="text"
                value={selectedBlock.style.borderRadius || ''}
                onChange={(e) => updateStyle({ borderRadius: e.target.value })}
                placeholder="0.5rem"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gölge</label>
              <select
                value={selectedBlock.style.boxShadow || 'none'}
                onChange={(e) => updateStyle({ boxShadow: e.target.value === 'none' ? undefined : e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="none">Gölge Yok</option>
                <option value="0 1px 3px rgba(0,0,0,0.1)">Küçük</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Orta</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Büyük</option>
                <option value="0 20px 25px rgba(0,0,0,0.1)">Çok Büyük</option>
              </select>
            </div>
          </div>
        </StyleSection>

        {/* Layout */}
        <StyleSection id="layout" title="Layout" icon={Layout}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genişlik</label>
              <input
                type="text"
                value={selectedBlock.style.width || ''}
                onChange={(e) => updateStyle({ width: e.target.value })}
                placeholder="100%"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yükseklik</label>
              <input
                type="text"
                value={selectedBlock.style.height || ''}
                onChange={(e) => updateStyle({ height: e.target.value })}
                placeholder="auto"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şeffaflık</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedBlock.style.opacity || 1}
                onChange={(e) => updateStyle({ opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {Math.round((selectedBlock.style.opacity || 1) * 100)}%
              </div>
            </div>
          </div>
        </StyleSection>

        {/* Quick Presets */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-3">Hızlı Stiller</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateStyle({
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '0.5rem'
              })}
              className="p-2 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"
            >
              Emerald Card
            </button>
            <button
              onClick={() => updateStyle({
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '0.5rem'
              })}
              className="p-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              Blue Card
            </button>
            <button
              onClick={() => updateStyle({
                border: '2px solid #e5e7eb',
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#ffffff'
              })}
              className="p-2 border-2 border-gray-300 rounded text-xs hover:bg-gray-50"
            >
              Outlined
            </button>
            <button
              onClick={() => updateStyle({
                boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#ffffff'
              })}
              className="p-2 bg-white shadow-lg rounded text-xs hover:shadow-xl"
            >
              Shadow
            </button>
          </div>
        </div>
      </div>

      {/* Color Picker Overlay */}
      {activeColorPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveColorPicker(null)}
        />
      )}
    </div>
  );
};