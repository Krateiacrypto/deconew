import React from 'react';
import { Block } from '../../types/editor';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ParagraphBlock } from './blocks/ParagraphBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { HeroBlock } from './blocks/HeroBlock';
import { ColumnsBlock } from './blocks/ColumnsBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { SDGGoalsBlock } from './blocks/SDGGoalsBlock';
import { FormBlock } from './blocks/FormBlock';
import { SpacerBlock } from './blocks/SpacerBlock';

interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreview?: boolean;
  onSelect?: (blockId: string) => void;
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isSelected = false,
  isPreview = false,
  onSelect,
  onUpdate
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview && onSelect) {
      e.stopPropagation();
      onSelect(block.id);
    }
  };

  const handleContentChange = (content: any) => {
    if (onUpdate) {
      onUpdate(block.id, { content: { ...block.content, ...content } });
    }
  };

  const handleStyleChange = (style: any) => {
    if (onUpdate) {
      onUpdate(block.id, { style: { ...block.style, ...style } });
    }
  };

  const blockProps = {
    block,
    isSelected,
    isPreview,
    onContentChange: handleContentChange,
    onStyleChange: handleStyleChange
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'heading':
        return <HeadingBlock {...blockProps} />;
      case 'paragraph':
        return <ParagraphBlock {...blockProps} />;
      case 'image':
        return <ImageBlock {...blockProps} />;
      case 'button':
        return <ButtonBlock {...blockProps} />;
      case 'hero':
        return <HeroBlock {...blockProps} />;
      case 'columns':
        return <ColumnsBlock {...blockProps} />;
      case 'video':
        return <VideoBlock {...blockProps} />;
      case 'sdg-goals':
        return <SDGGoalsBlock {...blockProps} />;
      case 'form':
        return <FormBlock {...blockProps} />;
      case 'spacer':
        return <SpacerBlock {...blockProps} />;
      default:
        return (
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-600">Bilinmeyen blok türü: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative group transition-all duration-200 ${
        isSelected && !isPreview 
          ? 'ring-2 ring-emerald-500 ring-offset-2' 
          : ''
      } ${!isPreview ? 'hover:ring-1 hover:ring-emerald-300 cursor-pointer' : ''}`}
      style={{ order: block.order }}
    >
      {renderBlock()}
      
      {/* Block Controls */}
      {!isPreview && (
        <div className={`absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
          isSelected ? 'opacity-100' : ''
        }`}>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle duplicate
              }}
              className="w-6 h-6 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              title="Kopyala"
            >
              📋
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete
              }}
              className="w-6 h-6 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              title="Sil"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};