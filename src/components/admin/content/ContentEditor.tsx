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
import { BlogEditor } from '../../editor/BlogEditor';

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

  return (
    <BlogEditor
      content={content}
      onChange={onChange}
      placeholder={placeholder}
      height={height}
    />
  );
};