import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  Download
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const ProjectManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects, createProject, updateProject, deleteProject, isLoading } = useDataStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveProject = async (projectId: string) => {
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

  const handleRejectProject = async (projectId: string) => {
    try {
      await updateProject(projectId, { 
        status: 'rejected',
        rejectionReason: 'Admin tarafından reddedildi'
      });
      toast.success('Proje reddedildi!');
    } catch (error) {
      toast.error('Proje reddetme başarısız!');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
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
      color: 'blue'
    },
    {
      title: 'Aktif Projeler',
      value: projects.filter(p => p.status === 'active').length,
      color: 'green'
    },
    {
      title: 'Bekleyen Onay',
      value: projects.filter(p => p.status === 'pending').length,
      color: 'yellow'
    },
    {
      title: 'Reddedilen',
      value: projects.filter(p => p.status === 'rejected').length,
      color: 'red'
    }
  ];

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Proje Yönetimi</h1>
            <p className="text-gray-600">Karbon kredisi projelerini yönetin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Proje</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="pending">Bekleyen</option>
                <option value="rejected">Reddedilen</option>
                <option value="completed">Tamamlanan</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                <Download className="w-4 h-4" />
                <span>Excel İndir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Proje</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Kategori</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Konum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Karbon Kredisi</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{project.title}</p>
                          <p className="text-sm text-gray-600">{project.participants} katılımcı</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{project.location}</td>
                    <td className="py-4 px-6 font-medium">{project.carbonCredits.toLocaleString()} tCO₂</td>
                    <td className="py-4 px-6">
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
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedProject(project.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {project.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveProject(project.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              title="Onayla"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectProject(project.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Reddet"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={createProject}
          />
        )}
      </div>
    </div>
  );
};

interface CreateProjectModalProps {
  onClose: () => void;
  onSubmit: (project: any) => Promise<void>;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onSubmit }) => {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Yeni Proje Oluştur</h3>
        
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
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Proje Oluştur
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};