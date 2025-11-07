import React, { useState } from 'react';
import { Block } from '../../../types/editor';

interface ButtonBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempText, setTempText] = useState(block.content.buttonText || '');
  const [tempUrl, setTempUrl] = useState(block.content.buttonUrl || '');

  const handleTextSave = () => {
    onContentChange({ buttonText: tempText });
    setIsEditingText(false);
  };

  const handleUrlSave = () => {
    onContentChange({ buttonUrl: tempUrl });
    setIsEditingUrl(false);
  };

  const style: React.CSSProperties = {
    backgroundColor: block.style.backgroundColor || '#10b981',
    color: block.style.textColor || '#ffffff',
    fontSize: block.style.fontSize || '1rem',
    fontWeight: block.style.fontWeight || '600',
    fontFamily: block.style.fontFamily,
    padding: block.style.padding || '0.75rem 1.5rem',
    margin: block.style.margin,
    borderRadius: block.style.borderRadius || '0.5rem',
    border: block.style.border || 'none',
    boxShadow: block.style.boxShadow,
    opacity: block.style.opacity,
    width: block.style.width || 'auto',
    height: block.style.height || 'auto',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center' as const,
    transition: 'all 0.2s ease'
  };

  const containerStyle: React.CSSProperties = {
    textAlign: block.style.textAlign || 'left',
    padding: '1rem 0'
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      e.preventDefault();
    }
  };

  return (
    <div style={containerStyle}>
      {isEditingText && !isPreview ? (
        <input
          type="text"
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onBlur={handleTextSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleTextSave();
            if (e.key === 'Escape') setIsEditingText(false);
          }}
          className="px-4 py-2 border border-gray-300 rounded"
          style={{ ...style, backgroundColor: '#ffffff', color: '#000000' }}
          autoFocus
        />
      ) : (
        <button
          style={style}
          onClick={handleClick}
          onDoubleClick={() => !isPreview && setIsEditingText(true)}
          className={`${!isPreview ? 'hover:opacity-80' : ''} transition-opacity`}
        >
          {block.content.buttonText || 'Buton Metni'}
        </button>
      )}
      
      {isSelected && !isPreview && (
        <div className="mt-2">
          {isEditingUrl ? (
            <div className="flex space-x-2">
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
                autoFocus
              />
              <button
                onClick={handleUrlSave}
                className="px-3 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
              >
                Kaydet
              </button>
              <button
                onClick={() => setIsEditingUrl(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                İptal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingUrl(true)}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              URL: {block.content.buttonUrl || 'Belirtilmemiş'} (Düzenle)
            </button>
          )}
        </div>
      )}
    </div>
  );
};