import React, { useState } from 'react';
import { Block } from '../../../types/editor';

interface HeroBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(block.content.text || '');
  const [tempSubtitle, setTempSubtitle] = useState(block.content.html || '');

  const handleTitleSave = () => {
    onContentChange({ text: tempTitle });
    setIsEditingTitle(false);
  };

  const handleSubtitleSave = () => {
    onContentChange({ html: tempSubtitle });
    setIsEditingSubtitle(false);
  };

  const style: React.CSSProperties = {
    background: block.style.backgroundColor || 'linear-gradient(135deg, #10b981, #3b82f6)',
    color: block.style.textColor || '#ffffff',
    padding: block.style.padding || '4rem 2rem',
    margin: block.style.margin,
    borderRadius: block.style.borderRadius,
    border: block.style.border,
    boxShadow: block.style.boxShadow,
    opacity: block.style.opacity,
    width: block.style.width || '100%',
    minHeight: block.style.height || '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center' as const,
    backgroundImage: block.style.backgroundImage,
    backgroundSize: block.style.backgroundSize || 'cover',
    backgroundPosition: block.style.backgroundPosition || 'center',
    backgroundRepeat: block.style.backgroundRepeat || 'no-repeat'
  };

  return (
    <div style={style} className="relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Title */}
        {isEditingTitle && !isPreview ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') setIsEditingTitle(false);
            }}
            className="w-full bg-transparent border-none outline-none text-center text-4xl md:text-6xl font-bold mb-6"
            style={{ color: 'inherit' }}
            autoFocus
          />
        ) : (
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            onDoubleClick={() => !isPreview && setIsEditingTitle(true)}
          >
            {block.content.text || 'Hero Başlığı'}
          </h1>
        )}

        {/* Subtitle */}
        {isEditingSubtitle && !isPreview ? (
          <textarea
            value={tempSubtitle}
            onChange={(e) => setTempSubtitle(e.target.value)}
            onBlur={handleSubtitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) handleSubtitleSave();
              if (e.key === 'Escape') setIsEditingSubtitle(false);
            }}
            className="w-full bg-transparent border-none outline-none text-center text-xl resize-none"
            style={{ color: 'inherit' }}
            rows={3}
            autoFocus
          />
        ) : (
          <div
            className="text-xl mb-8 cursor-pointer hover:opacity-80 transition-opacity"
            onDoubleClick={() => !isPreview && setIsEditingSubtitle(true)}
            dangerouslySetInnerHTML={{ 
              __html: block.content.html || '<p>Hero alt başlığı ve açıklama metni</p>' 
            }}
          />
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Başlayın
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors">
            Daha Fazla Bilgi
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 rounded-full animate-pulse delay-1000"></div>
    </div>
  );
};