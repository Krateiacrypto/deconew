import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  Filter,
  Search,
  Shield,
  FileText,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  X,
  Save
} from 'lucide-react';
import { useKYCStore } from '../../store/kycStore';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../utils/permissions';
import toast from 'react-hot-toast';

export const KYCManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { applications, fetchKYCApplications, reviewKYCApplication, isLoading } = useKYCStore();
  
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  useEffect(() => {
    fetchKYCApplications();
  }, [fetchKYCApplications]);

  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch = 
      app.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.personalInfo.idNumber.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleReview = async (applicationId: string, status: 'approved' | 'rejected', notes?: string) => {
    if (!hasPermission(user, 'users.edit')) {
      toast.error('KYC onaylama yetkiniz bulunmamaktadır!');
      return;
    }
    
    try {
      await reviewKYCApplication(applicationId, status, notes);
      toast.success(`KYC başvurusu ${status === 'approved' ? 'onaylandı' : 'reddedildi'}`);
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const stats = [
    {
      title: 'Toplam Başvuru',
      value: applications.length,
      icon: Users,
      color: 'blue',
      change: '+12 bu hafta'
    },
    {
      title: 'Bekleyen',
      value: applications.filter(app => app.status === 'pending').length,
      icon: Clock,
      color: 'yellow',
      change: '+5 bu hafta'
    },
    {
      title: 'Onaylanan',
      value: applications.filter(app => app.status === 'approved').length,
      icon: CheckCircle,
      color: 'emerald',
      change: '+8 bu hafta'
    },
    {
      title: 'Reddedilen',
      value: applications.filter(app => app.status === 'rejected').length,
      icon: XCircle,
      color: 'red',
      change: '+2 bu hafta'
    }
  ];

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">KYC Yönetimi</h1>
          <p className="text-gray-600">Kullanıcı kimlik doğrulama başvurularını yönetin</p>
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
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ad, soyad veya TC kimlik no ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Bekleyen</option>
                <option value="under_review">İnceleniyor</option>
                <option value="approved">Onaylanan</option>
                <option value="rejected">Reddedilen</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Excel İndir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Başvuran</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">TC Kimlik No</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Başvuru Tarihi</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {application.personalInfo.firstName} {application.personalInfo.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{application.personalInfo.city}, {application.personalInfo.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-sm">{application.personalInfo.idNumber}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div>
                        <div>{new Date(application.submittedAt).toLocaleDateString('tr-TR')}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(application.submittedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        application.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {application.status === 'approved' ? 'Onaylandı' :
                         application.status === 'rejected' ? 'Reddedildi' :
                         application.status === 'under_review' ? 'İnceleniyor' : 'Bekliyor'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {application.status === 'pending' && hasPermission(user, 'users.edit') && (
                          <>
                            <button
                              onClick={() => handleReview(application.id, 'approved')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Onayla"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReview(application.id, 'rejected', 'Belgeler eksik')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reddet"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Başvuru bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinize uygun KYC başvurusu bulunamadı.</p>
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        <AnimatePresence>
          {selectedApplication && (
            <ApplicationDetailModal
              application={selectedApplication}
              onClose={() => setSelectedApplication(null)}
              onReview={handleReview}
              canReview={hasPermission(user, 'users.edit')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Application Detail Modal
interface ApplicationDetailModalProps {
  application: any;
  onClose: () => void;
  onReview: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
  canReview: boolean;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onReview,
  canReview
}) => {
  const [reviewNotes, setReviewNotes] = useState('');
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
          <h3 className="text-2xl font-bold text-gray-900">KYC Başvuru Detayları</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="flex items-center space-x-2 font-bold text-blue-900 mb-4">
                <User className="w-5 h-5" />
                <span>Kişisel Bilgiler</span>
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-blue-700 font-medium">Ad Soyad</label>
                  <p className="text-blue-900 font-medium">
                    {application.personalInfo.firstName} {application.personalInfo.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-blue-700 font-medium">Doğum Tarihi</label>
                  <p className="text-blue-900">{new Date(application.personalInfo.dateOfBirth).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <label className="text-blue-700 font-medium">TC Kimlik No</label>
                  <p className="text-blue-900 font-mono">{application.personalInfo.idNumber}</p>
                </div>
                <div>
                  <label className="text-blue-700 font-medium">Uyruk</label>
                  <p className="text-blue-900">{application.personalInfo.nationality}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl">
              <h4 className="flex items-center space-x-2 font-bold text-emerald-900 mb-4">
                <MapPin className="w-5 h-5" />
                <span>Adres Bilgileri</span>
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-emerald-700 font-medium">Adres</label>
                  <p className="text-emerald-900">{application.personalInfo.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-emerald-700 font-medium">Şehir</label>
                    <p className="text-emerald-900">{application.personalInfo.city}</p>
                  </div>
                  <div>
                    <label className="text-emerald-700 font-medium">Posta Kodu</label>
                    <p className="text-emerald-900">{application.personalInfo.postalCode}</p>
                  </div>
                </div>
                <div>
                  <label className="text-emerald-700 font-medium">Ülke</label>
                  <p className="text-emerald-900">{application.personalInfo.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Status & Actions */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="flex items-center space-x-2 font-bold text-gray-900 mb-4">
                <FileText className="w-5 h-5" />
                <span>Başvuru Durumu</span>
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Başvuru ID:</span>
                  <span className="font-mono text-gray-900">KYC-{application.id}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Başvuru Tarihi:</span>
                  <span className="text-gray-900">{new Date(application.submittedAt).toLocaleDateString('tr-TR')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    application.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {application.status === 'approved' ? 'Onaylandı' :
                     application.status === 'rejected' ? 'Reddedildi' :
                     application.status === 'under_review' ? 'İnceleniyor' : 'Bekliyor'}
                  </span>
                </div>

                {application.reviewedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">İnceleme Tarihi:</span>
                    <span className="text-gray-900">{new Date(application.reviewedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                )}

                {application.rejectionReason && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 mb-2">Red Sebebi:</h5>
                    <p className="text-red-700 text-sm">{application.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-purple-50 p-6 rounded-xl">
              <h4 className="flex items-center space-x-2 font-bold text-purple-900 mb-4">
                <FileText className="w-5 h-5" />
                <span>Yüklenen Belgeler</span>
              </h4>
              
              <div className="space-y-3">
                {['Kimlik Belgesi', 'Adres Belgesi', 'Gelir Belgesi'].map((docType, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-purple-900 font-medium">{docType}</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                      Yüklendi
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Section */}
            {application.status === 'pending' && canReview && (
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h4 className="font-bold text-yellow-900 mb-4">İnceleme ve Onay</h4>
                
                {!showRejectForm ? (
                  <div className="space-y-4">
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="İnceleme notları (opsiyonel)"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onReview(application.id, 'approved', reviewNotes)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Onayla</span>
                      </button>
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reddet</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-2">Red Sebebi</label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Reddetme sebebini açıklayın..."
                        rows={3}
                        className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        İptal
                      </button>
                      <button
                        onClick={() => onReview(application.id, 'rejected', reviewNotes)}
                        disabled={!reviewNotes.trim()}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        Reddet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};