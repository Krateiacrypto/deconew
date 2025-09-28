import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  Image as ImageIcon,
  Code,
  Quote,
  Heading,
  Eye,
  EyeOff,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';
import { markdownToHtml, htmlToMarkdown } from '../../utils/markdown';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  showToolbar?: boolean;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  content,
  onChange,
  placeholder = 'Blog yazınızı buraya yazın...',
  height = '500px',
  showToolbar = true
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editorRef.current && !isMarkdownMode) {
      editorRef.current.innerHTML = content;
    }
  }, [content, isMarkdownMode]);

  const saveToHistory = useCallback((newContent: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      return newHistory.slice(-50); // Keep last 50 changes
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const formatText = (command: string, value?: string) => {
    if (isMarkdownMode) return;
    
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      saveToHistory(newContent);
    }
  };

  const insertHeading = (level: number) => {
    if (isMarkdownMode) {
      const prefix = '#'.repeat(level) + ' ';
      insertMarkdown(prefix, '');
    } else {
      formatText('formatBlock', `h${level}`);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    if (!isMarkdownMode || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    onChange(newContent);
    saveToHistory(newContent);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertLink = () => {
    if (isMarkdownMode) {
      insertMarkdown('[', '](url)');
    } else {
      const url = prompt('Link URL\'sini girin:');
      if (url) {
        formatText('createLink', url);
      }
    }
  };

  const insertImage = () => {
    if (isMarkdownMode) {
      insertMarkdown('![alt text](', ')');
    } else {
      const url = prompt('Resim URL\'sini girin:');
      if (url) {
        formatText('insertImage', url);
      }
    }
  };

  const handleContentChange = () => {
    if (editorRef.current && !isMarkdownMode) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    onChange(newContent);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousContent = history[newIndex];
      setHistoryIndex(newIndex);
      onChange(previousContent);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextContent = history[newIndex];
      setHistoryIndex(newIndex);
      onChange(nextContent);
    }
  };

  const toggleMode = () => {
    if (isMarkdownMode) {
      // Converting from Markdown to HTML
      const htmlContent = markdownToHtml(content);
      onChange(htmlContent);
    } else {
      // Converting from HTML to Markdown
      const markdownContent = htmlToMarkdown(content);
      onChange(markdownContent);
    }
    setIsMarkdownMode(!isMarkdownMode);
  };

  const toolbarButtons = [
    { 
      icon: Bold, 
      action: () => isMarkdownMode ? insertMarkdown('**', '**') : formatText('bold'), 
      title: 'Kalın (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    { 
      icon: Italic, 
      action: () => isMarkdownMode ? insertMarkdown('*', '*') : formatText('italic'), 
      title: 'İtalik (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    { 
      icon: Heading, 
      action: () => insertHeading(2), 
      title: 'Başlık 2',
      dropdown: [
        { label: 'Başlık 1', action: () => insertHeading(1) },
        { label: 'Başlık 2', action: () => insertHeading(2) },
        { label: 'Başlık 3', action: () => insertHeading(3) }
      ]
    },
    { icon: Link, action: insertLink, title: 'Link Ekle (Ctrl+K)', shortcut: 'Ctrl+K' },
    { icon: ImageIcon, action: insertImage, title: 'Resim Ekle' },
    { icon: List, action: () => isMarkdownMode ? insertMarkdown('- ', '') : formatText('insertUnorderedList'), title: 'Liste' },
    { icon: Quote, action: () => isMarkdownMode ? insertMarkdown('> ', '') : formatText('formatBlock', 'blockquote'), title: 'Alıntı' },
    { icon: Code, action: () => isMarkdownMode ? insertMarkdown('`', '`') : formatText('formatBlock', 'pre'), title: 'Kod' }
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            isMarkdownMode ? insertMarkdown('**', '**') : formatText('bold');
            break;
          case 'i':
            e.preventDefault();
            isMarkdownMode ? insertMarkdown('*', '*') : formatText('italic');
            break;
          case 'k':
            e.preventDefault();
            insertLink();
            break;
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault();
              handleUndo();
            } else {
              e.preventDefault();
              handleRedo();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMarkdownMode, content, historyIndex]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {showToolbar && (
        <div className="bg-gray-50 border-b border-gray-300 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {toolbarButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.action}
                  className="p-2 hover:bg-gray-200 rounded transition-colors group relative"
                  title={button.title}
                  type="button"
                >
                  <button.icon className="w-4 h-4" />
                  {button.shortcut && (
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {button.shortcut}
                    </span>
                  )}
                </button>
              ))}
              
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Geri Al (Ctrl+Z)"
                type="button"
              >
                <Undo className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Yinele (Ctrl+Shift+Z)"
                type="button"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMode}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  isMarkdownMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
                type="button"
                title="Editör modunu değiştir"
              >
                <Type className="w-4 h-4 mr-1 inline" />
                {isMarkdownMode ? 'Markdown' : 'Rich Text'}
              </button>
              
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`p-2 rounded transition-colors ${
                  isPreview ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-200'
                }`}
                title="Önizleme"
                type="button"
              >
                {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor/Preview */}
      <div style={{ height }} className="relative">
        {isPreview ? (
          <div className="p-6 prose prose-lg max-w-none overflow-y-auto h-full bg-white">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: isMarkdownMode ? markdownToHtml(content) : content 
              }} 
            />
          </div>
        ) : isMarkdownMode ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleMarkdownChange}
            className="w-full h-full p-6 border-none outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder={placeholder}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-6 outline-none h-full overflow-y-auto prose prose-lg max-w-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset"
            style={{ minHeight: height }}
            onInput={handleContentChange}
            onPaste={(e) => {
              // Handle paste events to clean up formatting
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
            suppressContentEditableWarning={true}
          />
        )}
        
        {/* Placeholder for empty content */}
        {!content && !isPreview && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
      
      {/* Word Count */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>
            Kelime sayısı: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
          </span>
          <span>
            Karakter: {content.replace(/<[^>]*>/g, '').length}
          </span>
        </div>
      </div>
    </div>
  );
};