import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Block } from '../../../types/editor';

interface VideoBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onContentChange: (content: any) => void;
  onStyleChange: (style: any) => void;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  isSelected,
  isPreview,
  onContentChange,
  onStyleChange
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState(block.content.videoUrl || '');

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const handleUrlSave = () => {
    onContentChange({ videoUrl: tempUrl });
    setShowUrlInput(false);
  };

  const style: React.CSSProperties = {
    width: block.style.width || '100%',
    height: block.style.height || '400px',
    borderRadius: block.style.borderRadius || '0.5rem',
    border: block.style.border,
    boxShadow: block.style.boxShadow,
    opacity: block.style.opacity,
    aspectRatio: '16/9'
  };

  const containerStyle: React.CSSProperties = {
    padding: block.style.padding,
    margin: block.style.margin,
    backgroundColor: block.style.backgroundColor,
    textAlign: block.style.textAlign || 'center'
  };

  if (!block.content.videoUrl && !isPreview) {
    return (
      <div style={containerStyle} className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Video ekleyin</p>
          
          {showUrlInput ? (
            <div className="flex space-x-2 max-w-md mx-auto">
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="YouTube veya Vimeo URL'si"
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
              <span>Video URL Ekle</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <iframe
        src={getEmbedUrl(block.content.videoUrl || '')}
        style={style}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`${!isPreview ? 'hover:opacity-80' : ''} transition-opacity`}
        onDoubleClick={() => !isPreview && setShowUrlInput(true)}
      />
      
      {showUrlInput && !isPreview && (
        <div className="mt-2 flex space-x-2">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Yeni video URL'si"
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