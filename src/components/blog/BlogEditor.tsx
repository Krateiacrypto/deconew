import React, { useState, useRef, useEffect } from 'react';
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
  Save,
  Upload
} from 'lucide-react';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  content,
  onChange,
  placeholder = 'Blog yazınızı buraya yazın...',
  height = '500px'
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editorRef.current && !isMarkdownMode) {
      editorRef.current.innerHTML = content;
    }
  }, [content, isMarkdownMode]);

  const formatText = (command: string, value?: string) => {
    if (isMarkdownMode) return;
    
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
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
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const convertMarkdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n/gim, '<br>');
  };

  const toolbarButtons = [
    { icon: Bold, action: () => isMarkdownMode ? insertMarkdown('**', '**') : formatText('bold'), title: 'Kalın' },
    { icon: Italic, action: () => isMarkdownMode ? insertMarkdown('*', '*') : formatText('italic'), title: 'İtalik' },
    { icon: Heading, action: () => isMarkdownMode ? insertMarkdown('## ', '') : formatText('formatBlock', 'h2'), title: 'Başlık' },
    { icon: Link, action: insertLink, title: 'Link' },
    { icon: ImageIcon, action: insertImage, title: 'Resim' },
    { icon: List, action: () => isMarkdownMode ? insertMarkdown('- ', '') : formatText('insertUnorderedList'), title: 'Liste' },
    { icon: Quote, action: () => isMarkdownMode ? insertMarkdown('> ', '') : formatText('formatBlock', 'blockquote'), title: 'Alıntı' },
    { icon: Code, action: () => isMarkdownMode ? insertMarkdown('`', '`') : formatText('formatBlock', 'pre'), title: 'Kod' }
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={button.title}
              type="button"
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMarkdownMode(!isMarkdownMode)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isMarkdownMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
            type="button"
          >
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

      {/* Editor/Preview */}
      <div style={{ height }} className="relative">
        {isPreview ? (
          <div className="p-4 prose max-w-none overflow-y-auto h-full">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: isMarkdownMode ? convertMarkdownToHtml(content) : content 
              }} 
            />
          </div>
        ) : isMarkdownMode ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleMarkdownChange}
            className="w-full h-full p-4 border-none outline-none resize-none font-mono text-sm"
            placeholder={placeholder}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-4 outline-none h-full overflow-y-auto prose max-w-none"
            style={{ minHeight: height }}
            onInput={handleContentChange}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        )}
      </div>
    </div>
  );
};