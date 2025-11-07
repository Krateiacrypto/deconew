import React from 'react';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  Smartphone, 
  Tablet, 
  Monitor,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Play
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import toast from 'react-hot-toast';

export const EditorToolbar: React.FC = () => {
  const {
    currentPage,
    editorState,
    setPreviewMode,
    setDevice,
    setTheme,
    setZoom,
    exportPage,
    importPage,
    publishPage
  } = useEditorStore();

  const handleSave = () => {
    if (currentPage) {
      // In real app, this would save to backend
      toast.success('Sayfa kaydedildi!');
    }
  };

  const handleExport = (format: 'json' | 'html') => {
    const data = exportPage(format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage?.slug || 'page'}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${format.toUpperCase()} olarak dışa aktarıldı!`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        importPage(data, 'json');
        toast.success('Sayfa içe aktarıldı!');
      };
      reader.readAsText(file);
    }
  };

  const handlePublish = () => {
    if (currentPage) {
      publishPage(currentPage.id);
      toast.success('Sayfa yayınlandı!');
    }
  };

  const deviceIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Page Title */}
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-gray-900">
              {currentPage?.title || 'Yeni Sayfa'}
            </h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentPage?.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
              currentPage?.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {currentPage?.status === 'published' ? 'Yayında' :
               currentPage?.status === 'draft' ? 'Taslak' : 'Arşivlendi'}
            </span>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Kaydet</span>
          </button>
        </div>

        {/* Center Section - Device Preview */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          {Object.entries(deviceIcons).map(([device, Icon]) => (
            <button
              key={device}
              onClick={() => setDevice(device as any)}
              className={`p-2 rounded transition-colors ${
                editorState.device === device
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              title={device === 'desktop' ? 'Masaüstü' : device === 'tablet' ? 'Tablet' : 'Mobil'}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setZoom(Math.max(50, editorState.zoom - 10))}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Uzaklaştır"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 px-2 min-w-[3rem] text-center">
              {editorState.zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, editorState.zoom + 10))}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Yakınlaştır"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(editorState.theme === 'light' ? 'dark' : 'light')}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            title={editorState.theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
          >
            {editorState.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Preview Toggle */}
          <button
            onClick={() => setPreviewMode(!editorState.previewMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              editorState.previewMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {editorState.previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{editorState.previewMode ? 'Düzenle' : 'Önizle'}</span>
          </button>

          {/* Export/Import */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleExport('json')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              title="JSON Dışa Aktar"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <label className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 cursor-pointer" title="JSON İçe Aktar">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Yayınla</span>
          </button>
        </div>
      </div>
    </div>
  );
};