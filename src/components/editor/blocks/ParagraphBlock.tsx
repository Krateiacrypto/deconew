import React, { useState } from 'react';
import { Block } from '../../../types/editor';

interface ParagraphBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const ParagraphBlock: React.FC<ParagraphBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(block.content.text || '');

  const handleDoubleClick = () => {
    if (!isPreview) {
      setIsEditing(true);
      setTempText(block.content.text || '');
    }
  };

  const handleSave = () => {
    onContentChange({ text: tempText });
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempText(block.content.text || '');
    }
  };

  const style: React.CSSProperties = {
    fontSize: block.style.fontSize || '1rem',
    fontWeight: block.style.fontWeight || 'normal',
    color: block.style.textColor || '#4b5563',
    textAlign: block.style.textAlign || 'left',
    fontFamily: block.style.fontFamily,
    padding: block.style.padding,
    margin: block.style.margin,
    backgroundColor: block.style.backgroundColor,
    borderRadius: block.style.borderRadius,
    border: block.style.border,
    boxShadow: block.style.boxShadow,
    opacity: block.style.opacity,
    width: block.style.width,
    height: block.style.height,
    lineHeight: '1.6'
  };

  if (isEditing && !isPreview) {
    return (
      <textarea
        value={tempText}
        onChange={(e) => setTempText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className="w-full bg-transparent border-none outline-none resize-none"
        style={style}
        rows={4}
        autoFocus
      />
    );
  }

  return (
    <p
      style={style}
      onDoubleClick={handleDoubleClick}
      className={`${!isPreview ? 'hover:bg-gray-50 hover:bg-opacity-50' : ''} transition-colors`}
    >
      {block.content.text || 'Paragraf metni... (Düzenlemek için çift tıklayın)'}
    </p>
  );
};