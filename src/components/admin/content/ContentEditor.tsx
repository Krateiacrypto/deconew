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
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  AlertTriangle
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

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Kalın (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'İtalik (Ctrl+I)' },
    { icon: Code, command: 'code', title: 'Kod' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Alıntı' },
    { icon: List, command: 'insertUnorderedList', title: 'Madde İşaretli Liste' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Sola Hizala' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Ortala' },
    { icon: AlignRight, command: 'justifyRight', title: 'Sağa Hizala' }
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Text Formatting */}
            <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
              {toolbarButtons.slice(0, 4).map((btn, index) => (
                <button
                  key={index}
                  onClick={() => formatText(btn.command, btn.value)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title={btn.title}
                  type="button"
                >
                  <btn.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
              <button
                onClick={() => formatText('insertUnorderedList')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Madde İşaretli Liste"
                type="button"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('insertOrderedList')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Numaralı Liste"
                type="button"
              >
                <Type className="w-4 h-4" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
              {toolbarButtons.slice(5, 8).map((btn, index) => (
                <button
                  key={index}
                  onClick={() => formatText(btn.command)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title={btn.title}
                  type="button"
                >
                  <btn.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Media */}
            <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
              <button
                onClick={insertLink}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Link Ekle"
                type="button"
              >
                <Link className="w-4 h-4" />
              </button>
              <button
                onClick={insertImage}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Resim Ekle"
                type="button"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>

            {/* History */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => formatText('undo')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Geri Al (Ctrl+Z)"
                type="button"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('redo')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Yinele (Ctrl+Y)"
                type="button"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
              isPreview ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-200'
            }`}
            title="Önizleme"
            type="button"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">Önizle</span>
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div style={{ height }} className="relative">
        {isPreview ? (
          <div className="p-6 prose max-w-none overflow-y-auto h-full bg-white">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Başlık'}</h1>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-6 outline-none h-full overflow-y-auto prose max-w-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset"
            style={{ minHeight: height }}
            onInput={handleContentChange}
            dangerouslySetInnerHTML={{ __html: content }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        )}
        
        {/* Placeholder */}
        {!content && !isPreview && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Word Count */}
      <div className="px-6 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        Kelime sayısı: {content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length}
      </div>
    </div>
  );
};