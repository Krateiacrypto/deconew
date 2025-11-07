import React, { useState } from 'react';
import { Upload, ExternalLink } from 'lucide-react';
import { Block } from '../../../types/editor';

interface ImageBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState(block.content.imageUrl || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onContentChange({ imageUrl: url, imageAlt: file.name });
    }
  };

  const handleUrlSave = () => {
    onContentChange({ imageUrl: tempUrl });
    setShowUrlInput(false);
  };

  const style: React.CSSProperties = {
    width: block.style.width || '100%',
    height: block.style.height || 'auto',
    borderRadius: block.style.borderRadius,
    border: block.style.border,
    boxShadow: block.style.boxShadow,
    opacity: block.style.opacity,
    objectFit: 'cover' as const
  };

  const containerStyle: React.CSSProperties = {
    padding: block.style.padding,
    margin: block.style.margin,
    backgroundColor: block.style.backgroundColor,
    textAlign: block.style.textAlign || 'center'
  };

  if (!block.content.imageUrl && !isPreview) {
    return (
      <div style={containerStyle} className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Resim ekleyin</p>
          
          <div className="space-y-3">
            <label className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Dosya Yükle</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            
            <div className="text-gray-500">veya</div>
            
            {showUrlInput ? (
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 p-2 border border-gray-300 rounded"
                  autoFocus
                />
                <button
                  onClick={handleUrlSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Ekle
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowUrlInput(true)}
                className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>URL ile Ekle</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={block.content.imageUrl}
        alt={block.content.imageAlt || 'Resim'}
        style={style}
        className={`${!isPreview ? 'hover:opacity-80' : ''} transition-opacity`}
        onDoubleClick={() => !isPreview && setShowUrlInput(true)}
      />
      
      {showUrlInput && !isPreview && (
        <div className="mt-2 flex space-x-2">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Yeni resim URL'si"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleUrlSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Güncelle
          </button>
          <button
            onClick={() => setShowUrlInput(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            İptal
          </button>
        </div>
      )}
    </div>
  );
};