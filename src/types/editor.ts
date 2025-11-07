export interface BlockStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  opacity?: number;
  animation?: string;
  width?: string;
  height?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  display?: string;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
}

export interface BlockContent {
  text?: string;
  html?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonUrl?: string;
  videoUrl?: string;
  embedCode?: string;
  iconName?: string;
  formFields?: FormField[];
  columns?: Block[];
  menuItems?: MenuItem[];
  sdgGoals?: number[];
  mapLocation?: string;
  mapZoom?: number;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  children?: MenuItem[];
}

export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  style: BlockStyle;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BlockType = 
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'background'
  | 'icon'
  | 'columns'
  | 'form'
  | 'blog'
  | 'menu'
  | 'video'
  | 'social-embed'
  | 'map'
  | 'sdg-goals'
  | 'spacer'
  | 'divider'
  | 'testimonial'
  | 'stats'
  | 'cta'
  | 'hero';

export interface Page {
  id: string;
  title: string;
  slug: string;
  blocks: Block[];
  settings: PageSettings;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PageSettings {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  customCSS?: string;
  customJS?: string;
  theme: 'light' | 'dark';
  layout: 'full-width' | 'container' | 'narrow';
}

export interface EditorState {
  selectedBlockId: string | null;
  isDragging: boolean;
  previewMode: boolean;
  theme: 'light' | 'dark';
  device: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
}

export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultContent: BlockContent;
  defaultStyle: BlockStyle;
  preview: string;
}