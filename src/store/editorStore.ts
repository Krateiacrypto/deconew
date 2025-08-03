import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Block, Page, EditorState, BlockTemplate, BlockType } from '../types/editor';

interface EditorStore {
  // State
  currentPage: Page | null;
  pages: Page[];
  editorState: EditorState;
  blockTemplates: BlockTemplate[];
  isLoading: boolean;
  
  // Actions
  setCurrentPage: (page: Page) => void;
  addBlock: (blockType: BlockType, position?: number) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  reorderBlocks: (blocks: Block[]) => void;
  duplicateBlock: (blockId: string) => void;
  
  // Page actions
  createPage: (title: string, slug: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  publishPage: (pageId: string) => void;
  
  // Editor state
  setSelectedBlock: (blockId: string | null) => void;
  setPreviewMode: (preview: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setZoom: (zoom: number) => void;
  
  // Import/Export
  exportPage: (format: 'json' | 'html') => string;
  importPage: (data: string, format: 'json') => void;
  
  // Templates
  fetchBlockTemplates: () => void;
  saveAsTemplate: (block: Block, name: string, description: string) => void;
}

const defaultBlockTemplates: BlockTemplate[] = [
  {
    id: 'heading-1',
    name: 'Ana Başlık',
    description: 'Büyük başlık metni',
    icon: '📝',
    category: 'Metin',
    defaultContent: { text: 'Ana Başlık' },
    defaultStyle: { 
      fontSize: '3rem', 
      fontWeight: 'bold', 
      textAlign: 'center',
      color: '#1f2937',
      marginBottom: '2rem'
    },
    preview: 'H1'
  },
  {
    id: 'paragraph-1',
    name: 'Paragraf',
    description: 'Normal metin paragrafı',
    icon: '📄',
    category: 'Metin',
    defaultContent: { text: 'Bu bir paragraf metnidir. İçeriğinizi buraya yazabilirsiniz.' },
    defaultStyle: { 
      fontSize: '1rem', 
      lineHeight: '1.6',
      color: '#4b5563',
      marginBottom: '1rem'
    },
    preview: 'P'
  },
  {
    id: 'image-1',
    name: 'Resim',
    description: 'Resim bloğu',
    icon: '🖼️',
    category: 'Medya',
    defaultContent: { 
      imageUrl: 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg',
      imageAlt: 'Örnek resim'
    },
    defaultStyle: { 
      width: '100%',
      borderRadius: '0.5rem',
      marginBottom: '1rem'
    },
    preview: 'IMG'
  },
  {
    id: 'button-1',
    name: 'Buton',
    description: 'Tıklanabilir buton',
    icon: '🔘',
    category: 'Etkileşim',
    defaultContent: { 
      buttonText: 'Tıklayın',
      buttonUrl: '#'
    },
    defaultStyle: { 
      backgroundColor: '#10b981',
      color: '#ffffff',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      textAlign: 'center',
      display: 'inline-block',
      textDecoration: 'none'
    },
    preview: 'BTN'
  },
  {
    id: 'hero-1',
    name: 'Hero Bölümü',
    description: 'Ana sayfa hero alanı',
    icon: '🎯',
    category: 'Layout',
    defaultContent: { 
      text: 'Karbon Nötrleme ile Geleceği Şekillendirin',
      html: '<p class="text-xl text-gray-600 mb-8">DECARBONIZE Token ile sürdürülebilir bir gelecek inşa edin</p>'
    },
    defaultStyle: { 
      backgroundColor: 'linear-gradient(135deg, #10b981, #3b82f6)',
      color: '#ffffff',
      padding: '4rem 2rem',
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    preview: 'HERO'
  },
  {
    id: 'columns-2',
    name: '2 Sütun',
    description: 'İki sütunlu layout',
    icon: '📊',
    category: 'Layout',
    defaultContent: { 
      columns: [
        {
          id: 'col-1',
          type: 'paragraph',
          content: { text: 'Sol sütun içeriği' },
          style: {},
          order: 0,
          isVisible: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'col-2',
          type: 'paragraph',
          content: { text: 'Sağ sütun içeriği' },
          style: {},
          order: 1,
          isVisible: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    },
    defaultStyle: { 
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '2rem'
    },
    preview: '2COL'
  },
  {
    id: 'sdg-goals',
    name: 'SDG Hedefleri',
    description: 'Sürdürülebilir Kalkınma Hedefleri',
    icon: '🌍',
    category: 'Sürdürülebilirlik',
    defaultContent: { 
      sdgGoals: [7, 13, 15], // Clean Energy, Climate Action, Life on Land
      text: 'Sürdürülebilir Kalkınma Hedeflerimiz'
    },
    defaultStyle: { 
      padding: '2rem',
      backgroundColor: '#f0fdf4',
      borderRadius: '1rem',
      textAlign: 'center'
    },
    preview: 'SDG'
  },
  {
    id: 'video-1',
    name: 'Video',
    description: 'YouTube/Vimeo video embed',
    icon: '🎥',
    category: 'Medya',
    defaultContent: { 
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    defaultStyle: { 
      width: '100%',
      aspectRatio: '16/9',
      borderRadius: '0.5rem',
      marginBottom: '1rem'
    },
    preview: 'VID'
  }
];

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      currentPage: null,
      pages: [],
      editorState: {
        selectedBlockId: null,
        isDragging: false,
        previewMode: false,
        theme: 'light',
        device: 'desktop',
        zoom: 100
      },
      blockTemplates: defaultBlockTemplates,
      isLoading: false,

      setCurrentPage: (page: Page) => {
        set({ currentPage: page });
      },

      addBlock: (blockType: BlockType, position?: number) => {
        const { currentPage, blockTemplates } = get();
        if (!currentPage) return;

        const template = blockTemplates.find(t => t.id.startsWith(blockType)) || blockTemplates[0];
        
        const newBlock: Block = {
          id: `block-${Date.now()}`,
          type: blockType,
          content: template.defaultContent,
          style: template.defaultStyle,
          order: position ?? currentPage.blocks.length,
          isVisible: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedBlocks = [...currentPage.blocks];
        if (position !== undefined) {
          updatedBlocks.splice(position, 0, newBlock);
          // Reorder subsequent blocks
          updatedBlocks.forEach((block, index) => {
            block.order = index;
          });
        } else {
          updatedBlocks.push(newBlock);
        }

        const updatedPage = {
          ...currentPage,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };

        set({ currentPage: updatedPage });
      },

      updateBlock: (blockId: string, updates: Partial<Block>) => {
        const { currentPage } = get();
        if (!currentPage) return;

        const updatedBlocks = currentPage.blocks.map(block =>
          block.id === blockId 
            ? { ...block, ...updates, updatedAt: new Date().toISOString() }
            : block
        );

        const updatedPage = {
          ...currentPage,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };

        set({ currentPage: updatedPage });
      },

      deleteBlock: (blockId: string) => {
        const { currentPage } = get();
        if (!currentPage) return;

        const updatedBlocks = currentPage.blocks
          .filter(block => block.id !== blockId)
          .map((block, index) => ({ ...block, order: index }));

        const updatedPage = {
          ...currentPage,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };

        set({ currentPage: updatedPage });
      },

      reorderBlocks: (blocks: Block[]) => {
        const { currentPage } = get();
        if (!currentPage) return;

        const reorderedBlocks = blocks.map((block, index) => ({
          ...block,
          order: index,
          updatedAt: new Date().toISOString()
        }));

        const updatedPage = {
          ...currentPage,
          blocks: reorderedBlocks,
          updatedAt: new Date().toISOString()
        };

        set({ currentPage: updatedPage });
      },

      duplicateBlock: (blockId: string) => {
        const { currentPage } = get();
        if (!currentPage) return;

        const blockToDuplicate = currentPage.blocks.find(b => b.id === blockId);
        if (!blockToDuplicate) return;

        const duplicatedBlock: Block = {
          ...blockToDuplicate,
          id: `block-${Date.now()}`,
          order: blockToDuplicate.order + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedBlocks = [...currentPage.blocks];
        updatedBlocks.splice(blockToDuplicate.order + 1, 0, duplicatedBlock);
        
        // Reorder subsequent blocks
        updatedBlocks.forEach((block, index) => {
          block.order = index;
        });

        const updatedPage = {
          ...currentPage,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };

        set({ currentPage: updatedPage });
      },

      createPage: (title: string, slug: string) => {
        const newPage: Page = {
          id: `page-${Date.now()}`,
          title,
          slug,
          blocks: [],
          settings: {
            theme: 'light',
            layout: 'container'
          },
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'admin',
          updatedBy: 'admin'
        };

        set(state => ({
          pages: [...state.pages, newPage],
          currentPage: newPage
        }));
      },

      updatePage: (pageId: string, updates: Partial<Page>) => {
        set(state => ({
          pages: state.pages.map(page =>
            page.id === pageId 
              ? { ...page, ...updates, updatedAt: new Date().toISOString() }
              : page
          ),
          currentPage: state.currentPage?.id === pageId 
            ? { ...state.currentPage, ...updates, updatedAt: new Date().toISOString() }
            : state.currentPage
        }));
      },

      deletePage: (pageId: string) => {
        set(state => ({
          pages: state.pages.filter(page => page.id !== pageId),
          currentPage: state.currentPage?.id === pageId ? null : state.currentPage
        }));
      },

      publishPage: (pageId: string) => {
        get().updatePage(pageId, { status: 'published' });
      },

      setSelectedBlock: (blockId: string | null) => {
        set(state => ({
          editorState: { ...state.editorState, selectedBlockId: blockId }
        }));
      },

      setPreviewMode: (preview: boolean) => {
        set(state => ({
          editorState: { ...state.editorState, previewMode: preview }
        }));
      },

      setTheme: (theme: 'light' | 'dark') => {
        set(state => ({
          editorState: { ...state.editorState, theme }
        }));
      },

      setDevice: (device: 'desktop' | 'tablet' | 'mobile') => {
        set(state => ({
          editorState: { ...state.editorState, device }
        }));
      },

      setZoom: (zoom: number) => {
        set(state => ({
          editorState: { ...state.editorState, zoom }
        }));
      },

      exportPage: (format: 'json' | 'html') => {
        const { currentPage } = get();
        if (!currentPage) return '';

        if (format === 'json') {
          return JSON.stringify(currentPage, null, 2);
        } else {
          // Generate HTML from blocks
          const html = currentPage.blocks
            .sort((a, b) => a.order - b.order)
            .map(block => {
              // Convert block to HTML based on type
              return `<div data-block-id="${block.id}" data-block-type="${block.type}">
                <!-- Block content would be rendered here -->
              </div>`;
            })
            .join('\n');
          
          return `<!DOCTYPE html>
<html>
<head>
  <title>${currentPage.title}</title>
  <meta name="description" content="${currentPage.settings.seoDescription || ''}" />
</head>
<body>
  ${html}
</body>
</html>`;
        }
      },

      importPage: (data: string, format: 'json') => {
        try {
          if (format === 'json') {
            const page: Page = JSON.parse(data);
            set({ currentPage: page });
          }
        } catch (error) {
          console.error('Import failed:', error);
        }
      },

      fetchBlockTemplates: () => {
        set({ blockTemplates: defaultBlockTemplates });
      },

      saveAsTemplate: (block: Block, name: string, description: string) => {
        const newTemplate: BlockTemplate = {
          id: `template-${Date.now()}`,
          name,
          description,
          icon: '🎨',
          category: 'Özel',
          defaultContent: block.content,
          defaultStyle: block.style,
          preview: name.substring(0, 3).toUpperCase()
        };

        set(state => ({
          blockTemplates: [...state.blockTemplates, newTemplate]
        }));
      }
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        pages: state.pages,
        currentPage: state.currentPage,
        editorState: state.editorState
      })
    }
  )
);