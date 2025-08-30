import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Search,
  Download,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Award,
  TrendingUp,
  AlertTriangle,
  Leaf,
  X,
  Save,
  Upload,
  Target,
  BarChart3
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../utils/permissions';
import { Project } from '../../types';
import toast from 'react-hot-toast';

export const ProjectManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects, createProject, updateProject, deleteProject, isLoading } = useDataStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleApproveProject = async (projectId: string) => {
    if (!hasPermission(user, 'projects.approve')) {
      toast.error('Proje onaylama yetkiniz bulunmamaktadır!');
      return;
    }
    
    try {
      await updateProject(projectId, { 
        status: 'active',
        approvedBy: user?.id,
        approvedAt: new Date().toISOString()
      });
      toast.success('Proje onaylandı!');
    } catch (error) {
      toast.error('Proje onaylama başarısız!');
    }
  };

  const handleRejectProject = async (projectId: string, reason?: string) => {
    if (!hasPermission(user, 'projects.approve')) {
      toast.error('Proje reddetme yetkiniz bulunmamaktadır!');
      return;
    }
    
    try {
      await updateProject(projectId, { 
        status: 'rejected',
        rejectionReason: reason || 'Admin tarafından reddedildi'
      });
      toast.success('Proje reddedildi!');
    } catch (error) {
      toast.error('Proje reddetme başarısız!');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!hasPermission(user, 'projects.edit')) {
      toast.error('Proje silme yetkiniz bulunmamaktadır!');
      return;
    }

    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteProject(projectId);
        toast.success('Proje silindi!');
      } catch (error) {
        toast.error('Proje silme başarısız!');
      }
    }
  };

  const stats = [
    {
      title: 'Toplam Proje',
      value: projects.length,
      icon: Target,
      color: 'blue',
      change: '+8 bu ay'
    },
    {
      title: 'Aktif Projeler',
      value: projects.filter(p => p.status === 'active').length,
      icon: CheckCircle,
      color: 'emerald',
      change: '+5 bu ay'
    },
    {
      title: 'Bekleyen Onay',
      value: projects.filter(p => p.status === 'pending').length,
      icon: Clock,
      color: 'yellow',
      change: '+3 bu hafta'
    },
    {
      title: 'Toplam Fonlama',
      value: '$' + projects.reduce((sum, p) => sum + p.totalFunding, 0).toLocaleString(),
      icon: DollarSign,
      color: 'purple',
      change: '+15% bu ay'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: Target },
    { id: 'forest', name: 'Orman Koruma', icon: Leaf },
    { id: 'renewable', name: 'Yenilenebilir Enerji', icon: BarChart3 },
    { id: 'water', name: 'Su Koruma', icon: Users },
    { id: 'agriculture', name: 'Sürdürülebilir Tarım', icon: Award },
    { id: 'technology', name: 'Temiz Teknoloji', icon: TrendingUp }
  ];

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Proje Yönetimi</h1>
              <p className="text-gray-600">Karbon kredisi projelerini yönetin ve onaylayın</p>
            </div>
            {hasPermission(user, 'projects.create') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Proje</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="pending">Bekleyen</option>
                <option value="rejected">Reddedilen</option>
                <option value="completed">Tamamlanan</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Excel İndir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    project.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {project.status === 'active' ? 'Aktif' :
                     project.status === 'pending' ? 'Bekliyor' :
                     project.status === 'rejected' ? 'Reddedildi' : 'Tamamlandı'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  {project.verified && (
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                {/* Project Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Leaf className="w-4 h-4" />
                    <span>{project.carbonCredits.toLocaleString()} tCO₂</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{project.participants.toLocaleString()} katılımcı</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>${project.price}/tCO₂</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Fonlama İlerlemesi</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${project.totalFunding.toLocaleString()}</span>
                    <span>${project.targetFunding.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {hasPermission(user, 'projects.edit') && (
                      <button
                        onClick={() => setEditingProject(project)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    
                    {hasPermission(user, 'projects.edit') && (
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {project.status === 'pending' && hasPermission(user, 'projects.approve') && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveProject(project.id)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleRejectProject(project.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Proje bulunamadı</h3>
            <p className="text-gray-600 mb-4">Arama kriterlerinize uygun proje bulunamadı.</p>
            {hasPermission(user, 'projects.create') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                İlk Projeyi Oluştur
              </button>
            )}
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateProjectModal
              onClose={() => setShowCreateModal(false)}
              onSubmit={createProject}
              isLoading={isLoading}
            />
          )}

          {selectedProject && (
            <ProjectDetailModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onApprove={() => {
                handleApproveProject(selectedProject.id);
                setSelectedProject(null);
              }}
              onReject={(reason) => {
                handleRejectProject(selectedProject.id, reason);
                setSelectedProject(null);
              }}
              canApprove={hasPermission(user, 'projects.approve')}
            />
          )}

          {editingProject && (
            <EditProjectModal
              project={editingProject}
              onClose={() => setEditingProject(null)}
              onSave={async (updates) => {
                await updateProject(editingProject.id, updates);
                setEditingProject(null);
                toast.success('Proje güncellendi!');
              }}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Create Project Modal
interface CreateProjectModalProps {
  onClose: () => void;
  onSubmit: (project: any) => Promise<void>;
  isLoading: boolean;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'forest',
    carbonCredits: 0,
    price: 0,
    targetFunding: 0,
    minimumInvestment: 100,
    expectedReturn: 0,
    riskLevel: 'medium',
    startDate: '',
    endDate: '',
    image: 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        progress: 0,
        participants: 0,
        verified: false,
        status: 'pending',
        totalFunding: 0,
        documents: [],
        createdBy: 'admin'
      });
      toast.success('Proje başarıyla oluşturuldu!');
      onClose();
    } catch (error) {
      toast.error('Proje oluşturma başarısız!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Yeni Proje Oluştur</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proje Adı</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="forest">Orman Koruma</option>
                <option value="renewable">Yenilenebilir Enerji</option>
                <option value="water">Su Koruma</option>
                <option value="agriculture">Sürdürülebilir Tarım</option>
                <option value="technology">Temiz Teknoloji</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konum</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Karbon Kredisi (tCO₂)</label>
              <input
                type="number"
                value={formData.carbonCredits}
                onChange={(e) => setFormData({...formData, carbonCredits: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Fon ($)</label>
              <input
                type="number"
                value={formData.targetFunding}
                onChange={(e) => setFormData({...formData, targetFunding: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min. Yatırım ($)</label>
              <input
                type="number"
                value={formData.minimumInvestment}
                onChange={(e) => setFormData({...formData, minimumInvestment: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Oluşturuluyor...' : 'Proje Oluştur'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Project Detail Modal
interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  canApprove: boolean;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onApprove,
  onReject,
  canApprove
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Proje Detayları</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Project Image */}
          <div>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{project.carbonCredits.toLocaleString()}</div>
                <div className="text-sm text-emerald-800">Karbon Kredisi (tCO₂)</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">${project.price}</div>
                <div className="text-sm text-blue-800">tCO₂ Başına Fiyat</div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h4>
              <p className="text-gray-600 leading-relaxed">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Konum</label>
                <p className="text-gray-900">{project.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Kategori</label>
                <p className="text-gray-900 capitalize">{project.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Risk Seviyesi</label>
                <p className="text-gray-900 capitalize">{project.riskLevel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Beklenen Getiri</label>
                <p className="text-gray-900">{project.expectedReturn}%</p>
              </div>
            </div>

            {/* Funding Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Fonlama İlerlemesi</span>
                <span className="text-sm text-gray-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>${project.totalFunding.toLocaleString()}</span>
                <span>${project.targetFunding.toLocaleString()}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Başlangıç Tarihi</label>
                <p className="text-gray-900">{new Date(project.startDate).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Bitiş Tarihi</label>
                <p className="text-gray-900">{new Date(project.endDate).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
              project.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              project.status === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {project.status === 'active' ? 'Aktif' :
               project.status === 'pending' ? 'Bekliyor' :
               project.status === 'rejected' ? 'Reddedildi' : 'Tamamlandı'}
            </span>
            {project.verified && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                Doğrulanmış
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            {project.status === 'pending' && canApprove && !showRejectForm && (
              <>
                <button
                  onClick={onApprove}
                  className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Onayla</span>
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reddet</span>
                </button>
              </>
            )}

            {showRejectForm && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Red sebebi"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => onReject(rejectionReason)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reddet
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Edit Project Modal
interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSave: (updates: Partial<Project>) => Promise<void>;
  isLoading: boolean;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    location: project.location,
    category: project.category,
    carbonCredits: project.carbonCredits,
    price: project.price,
    targetFunding: project.targetFunding,
    minimumInvestment: project.minimumInvestment,
    expectedReturn: project.expectedReturn,
    riskLevel: project.riskLevel,
    startDate: project.startDate,
    endDate: project.endDate,
    image: project.image
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (error) {
      toast.error('Proje güncelleme başarısız!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Proje Düzenle</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Proje Adı</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beklenen Getiri (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.expectedReturn}
                onChange={(e) => setFormData({...formData, expectedReturn: parseFloat(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};