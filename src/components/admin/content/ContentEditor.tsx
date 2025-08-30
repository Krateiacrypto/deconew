import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Eye, 
  Upload, 
  Bold, 
  Italic, 
  Link, 
  List, 
  Image as ImageIcon,
  Code,
  Undo,
  Redo
} from 'lucide-react';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onChange,
  placeholder = 'İçeriğinizi yazın...',
  height = '400px'
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Link URL\'sini girin:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Resim URL\'sini girin:');
    if (url) {
      formatText('insertImage', url);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-2">
        <button
          onClick={() => formatText('bold')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Kalın"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('italic')}
          className="p-2 hover:bg-gray-200 rounded"
          title="İtalik"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          onClick={insertLink}
          className="p-2 hover:bg-gray-200 rounded"
          title="Link Ekle"
        >
          <Link className="w-4 h-4" />
        </button>
        <button
          onClick={insertImage}
          className="p-2 hover:bg-gray-200 rounded"
          title="Resim Ekle"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Liste"
        >
          <List className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          onClick={() => formatText('undo')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Geri Al"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => formatText('redo')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Yinele"
        >
          <Redo className="w-4 h-4" />
        </button>
        <div className="flex-1"></div>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`p-2 rounded ${isPreview ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-200'}`}
          title="Önizleme"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Editor/Preview */}
      <div style={{ height }}>
        {isPreview ? (
          <div 
            className="p-4 prose max-w-none overflow-y-auto h-full"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-4 outline-none h-full overflow-y-auto"
            style={{ minHeight: height }}
            onInput={handleContentChange}
            dangerouslySetInnerHTML={{ __html: content }}
            data-placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};