import React, { useState } from 'react';
import { Block } from '../../../types/editor';

interface HeadingBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
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
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempText(block.content.text || '');
    }
  };

  const getHeadingLevel = () => {
    const fontSize = block.style.fontSize || '2rem';
    if (fontSize.includes('3rem') || fontSize.includes('48px')) return 'h1';
    if (fontSize.includes('2.5rem') || fontSize.includes('40px')) return 'h2';
    if (fontSize.includes('2rem') || fontSize.includes('32px')) return 'h3';
    if (fontSize.includes('1.5rem') || fontSize.includes('24px')) return 'h4';
    if (fontSize.includes('1.25rem') || fontSize.includes('20px')) return 'h5';
    return 'h6';
  };

  const HeadingTag = getHeadingLevel() as keyof JSX.IntrinsicElements;

  const style: React.CSSProperties = {
    fontSize: block.style.fontSize || '2rem',
    fontWeight: block.style.fontWeight || 'bold',
    color: block.style.textColor || '#1f2937',
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
    height: block.style.height
  };

  if (isEditing && !isPreview) {
    return (
      <input
        type="text"
        value={tempText}
        onChange={(e) => setTempText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        className="w-full bg-transparent border-none outline-none"
        style={style}
        autoFocus
      />
    );
  }

  return (
    <HeadingTag
      style={style}
      onDoubleClick={handleDoubleClick}
      className={`${!isPreview ? 'hover:bg-gray-50 hover:bg-opacity-50' : ''} transition-colors`}
    >
      {block.content.text || 'Başlık metni...'}
    </HeadingTag>
  );
};