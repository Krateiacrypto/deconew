import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  SortableItem
} from './SortableItem';
import { useEditorStore } from '../../store/editorStore';
import { BlockRenderer } from './BlockRenderer';

export const EditorCanvas: React.FC = () => {
  const {
    currentPage,
    editorState,
    setSelectedBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks
  } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && currentPage) {
      const oldIndex = currentPage.blocks.findIndex(block => block.id === active.id);
      const newIndex = currentPage.blocks.findIndex(block => block.id === over?.id);

      const reorderedBlocks = arrayMove(currentPage.blocks, oldIndex, newIndex);
      reorderBlocks(reorderedBlocks);
    }
  };

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlock(blockId);
  };

  const handleBlockUpdate = (blockId: string, updates: any) => {
    updateBlock(blockId, updates);
  };

  const handleBlockDelete = (blockId: string) => {
    deleteBlock(blockId);
    setSelectedBlock(null);
  };

  const handleBlockDuplicate = (blockId: string) => {
    duplicateBlock(blockId);
  };

  const getCanvasStyle = () => {
    const baseStyle: React.CSSProperties = {
      transform: `scale(${editorState.zoom / 100})`,
      transformOrigin: 'top center',
      transition: 'transform 0.2s ease'
    };

    switch (editorState.device) {
      case 'mobile':
        return { ...baseStyle, maxWidth: '375px', margin: '0 auto' };
      case 'tablet':
        return { ...baseStyle, maxWidth: '768px', margin: '0 auto' };
      default:
        return { ...baseStyle, maxWidth: '100%' };
    }
  };

  const getCanvasClasses = () => {
    const baseClasses = 'min-h-screen transition-all duration-200';
    const themeClasses = editorState.theme === 'dark' 
      ? 'bg-gray-900 text-white' 
      : 'bg-white text-gray-900';
    
    return `${baseClasses} ${themeClasses}`;
  };

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📄</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sayfa Seçin</h3>
          <p className="text-gray-600">Düzenlemek için bir sayfa oluşturun veya seçin</p>
        </div>
      </div>
    );
  }

  const sortedBlocks = [...currentPage.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-8">
      <div style={getCanvasStyle()}>
        <div className={getCanvasClasses()}>
          {editorState.previewMode ? (
            // Preview Mode - No drag and drop
            <div className="space-y-4">
              {sortedBlocks.map(block => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  isPreview={true}
                />
              ))}
            </div>
          ) : (
            // Edit Mode - With drag and drop
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedBlocks.map(block => block.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {sortedBlocks.map(block => (
                    <SortableItem
                      key={block.id}
                      id={block.id}
                      block={block}
                      isSelected={editorState.selectedBlockId === block.id}
                      onSelect={handleBlockSelect}
                      onUpdate={handleBlockUpdate}
                      onDelete={handleBlockDelete}
                      onDuplicate={handleBlockDuplicate}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Empty State */}
          {sortedBlocks.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sayfanızı Oluşturmaya Başlayın</h3>
                <p className="text-gray-600">Sol menüden blokları sürükleyerek sayfanızı tasarlayın</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};