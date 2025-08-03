import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { Block } from '../../types/editor';
import { BlockRenderer } from './BlockRenderer';

interface SortableItemProps {
  id: string;
  block: Block;
  isSelected: boolean;
  onSelect: (blockId: string) => void;
  onUpdate: (blockId: string, updates: any) => void;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleVisibilityToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(block.id, { isVisible: !block.isVisible });
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(block.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bu bloğu silmek istediğinizden emin misiniz?')) {
      onDelete(block.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${!block.isVisible ? 'opacity-50' : ''}`}
    >
      {/* Drag Handle and Controls */}
      <div className={`absolute -left-12 top-0 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity ${
        isSelected ? 'opacity-100' : ''
      }`}>
        <button
          {...attributes}
          {...listeners}
          className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center hover:bg-gray-700 cursor-grab active:cursor-grabbing"
          title="Sürükle"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleVisibilityToggle}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
            block.isVisible 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-gray-400 text-white hover:bg-gray-500'
          }`}
          title={block.isVisible ? 'Gizle' : 'Göster'}
        >
          {block.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        
        <button
          onClick={handleDuplicate}
          className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700"
          title="Kopyala"
        >
          <Copy className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleDelete}
          className="w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Block Content */}
      <BlockRenderer
        block={block}
        isSelected={isSelected}
        isPreview={false}
        onSelect={onSelect}
        onUpdate={onUpdate}
      />

      {/* Block Type Label */}
      {isSelected && (
        <div className="absolute -top-6 left-0">
          <span className="bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium">
            {block.type.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};