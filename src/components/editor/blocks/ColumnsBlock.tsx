import React from 'react';
import { Plus } from 'lucide-react';
import { Block } from '../../../types/editor';
import { BlockRenderer } from '../BlockRenderer';

interface ColumnsBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const ColumnsBlock: React.FC<ColumnsBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const columns = block.content.columns || [];

  const addColumn = () => {
    const newColumn: Block = {
      id: `col-${Date.now()}`,
      type: 'paragraph',
      content: { text: 'Yeni sütun içeriği' },
      style: { padding: '1rem' },
      order: columns.length,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onContentChange({ columns: [...columns, newColumn] });
  };

  const updateColumn = (columnId: string, updates: Partial<Block>) => {
    const updatedColumns = columns.map(col =>
      col.id === columnId ? { ...col, ...updates } : col
    );
    onContentChange({ columns: updatedColumns });
  };

  const removeColumn = (columnId: string) => {
    const updatedColumns = columns.filter(col => col.id !== columnId);
    onContentChange({ columns: updatedColumns });
  };

  const style: React.CSSProperties = {
    display: block.style.display || 'grid',
    gridTemplateColumns: `repeat(${columns.length || 2}, 1fr)`,
    gap: block.style.gap || '2rem',
    padding: block.style.padding,
    margin: block.style.margin,
    backgroundColor: block.style.backgroundColor,
    borderRadius: block.style.borderRadius,
    border: block.style.border,
    boxShadow: block.style.boxShadow,
    opacity: block.style.opacity,
    width: block.style.width || '100%'
  };

  return (
    <div style={style} className="relative">
      {columns.map((column, index) => (
        <div key={column.id} className="relative group">
          <BlockRenderer
            block={column}
            isPreview={isPreview}
            onUpdate={updateColumn}
          />
          
          {!isPreview && (
            <button
              onClick={() => removeColumn(column.id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          )}
        </div>
      ))}
      
      {!isPreview && (
        <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <button
            onClick={addColumn}
            className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
          >
            <Plus className="w-5 h-5" />
            <span>Sütun Ekle</span>
          </button>
        </div>
      )}
    </div>
  );
};