import React from 'react';
import { Block } from '../../../types/editor';

interface SpacerBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const height = block.style.height || '2rem';

  const style: React.CSSProperties = {
    height,
    width: block.style.width || '100%',
    backgroundColor: block.style.backgroundColor || 'transparent',
    margin: block.style.margin,
    borderRadius: block.style.borderRadius,
    border: block.style.border,
    opacity: block.style.opacity
  };

  return (
    <div
      style={style}
      className={`${!isPreview ? 'border-2 border-dashed border-gray-300 hover:border-emerald-400' : ''} transition-colors relative`}
    >
      {!isPreview && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
            Boşluk: {height}
          </span>
        </div>
      )}
    </div>
  );
};