import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useEditorStore } from '../../store/editorStore';
import { EditorToolbar } from '../../components/editor/EditorToolbar';
import { EditorSidebar } from '../../components/editor/EditorSidebar';
import { EditorCanvas } from '../../components/editor/EditorCanvas';
import { StylePanel } from '../../components/editor/StylePanel';

export const VisualEditor: React.FC = () => {
  const { user } = useAuthStore();
  const { currentPage, createPage, fetchBlockTemplates } = useEditorStore();

  useEffect(() => {
    fetchBlockTemplates();
    
    // Create a default page if none exists
    if (!currentPage) {
      createPage('Ana Sayfa', 'home');
    }
  }, [currentPage, createPage, fetchBlockTemplates]);

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Görsel Website Editörü</h1>
            <p className="text-gray-600">Sürükle-bırak ile website tasarlayın</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Son kayıt: {currentPage?.updatedAt ? new Date(currentPage.updatedAt).toLocaleTimeString('tr-TR') : 'Henüz kaydedilmedi'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <EditorToolbar />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Block Library */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <EditorSidebar />
        </motion.div>

        {/* Canvas Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1"
        >
          <EditorCanvas />
        </motion.div>

        {/* Right Sidebar - Style Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StylePanel />
        </motion.div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Blok sayısı: {currentPage?.blocks.length || 0}</span>
            <span>Son güncelleme: {currentPage?.updatedAt ? new Date(currentPage.updatedAt).toLocaleString('tr-TR') : 'Henüz güncellenmedi'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Otomatik kayıt aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};