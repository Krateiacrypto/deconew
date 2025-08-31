import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Award,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  Eye,
  Download,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';

export const VerificationDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects, isLoading } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Mock verification data
  const verificationStats = {
    totalProjects: 156,
    verifiedProjects: 142,
    pendingVerification: 8,
    rejectedProjects: 6,
    totalCarbonCredits: 2500000,
    monthlyVerifications: 23,
    averageVerificationTime: 5.2,
    verificationAccuracy: 98.5
  };

  const recentVerifications = [
    {
      id: '1',
      projectName: 'Amazon Forest Conservation',
      location: 'Brazil',
      carbonCredits: 125000,
      status: 'verified',
      verifiedAt: '2024-01-20T10:00:00Z',
      verifier: 'Dr. Maria Santos'
    },
    {
      id: '2',
      projectName: 'Wind Energy Turkey',
      location: 'Çanakkale, Turkey',
      carbonCredits: 89000,
      status: 'pending',
      submittedAt: '2024-01-19T14:30:00Z'
    },
    {
      id: '3',
      projectName: 'Solar Farm Project',
      location: 'Konya, Turkey',
      carbonCredits: 67000,
      status: 'under_review',
      reviewStarted: '2024-01-18T09:15:00Z'
    }
  ];

  const stats = [
    {
      title: 'Toplam Proje',
      value: verificationStats.totalProjects,
      icon: Target,
      color: 'blue',
      change: '+12 bu ay'
    },
    {
      title: 'Doğrulanmış',
      value: verificationStats.verifiedProjects,
      icon: CheckCircle,
      color: 'emerald',
      change: '+8 bu ay'
    },
    {
      title: 'Bekleyen Doğrulama',
      value: verificationStats.pendingVerification,
      icon: Clock,
      color: 'yellow',
      change: '+3 bu hafta'
    },
    {
      title: 'Toplam Karbon Kredisi',
      value: verificationStats.totalCarbonCredits.toLocaleString() + ' tCO₂',
      icon: Award,
      color: 'purple',
      change: '+15% bu ay'
    }
  ];

  const handleVerifyProject = async (projectId: string) => {
    // Mock verification process
    console.log('Verifying project:', projectId);
  };

  const handleRejectProject = async (projectId: string, reason: string) => {
    // Mock rejection process
    console.log('Rejecting project:', projectId, 'Reason:', reason);
  };

  if (user?.role !== 'verification_org') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya sadece Doğrulama Kuruluşları erişebilir.</p>
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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Doğrulama Dashboard</h1>
              <p className="text-gray-600">Karbon kredisi projelerini doğrulayın ve onaylayın</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Doğrulama Kuruluşu: {user.organizationName}</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
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

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Doğrulama Performansı</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{verificationStats.monthlyVerifications}</div>
              <div className="text-blue-800 font-medium">Bu Ay Doğrulanan</div>
            </div>
            
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{verificationStats.averageVerificationTime}</div>
              <div className="text-emerald-800 font-medium">Ort. Süre (Gün)</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">{verificationStats.verificationAccuracy}%</div>
              <div className="text-purple-800 font-medium">Doğruluk Oranı</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">A+</div>
              <div className="text-orange-800 font-medium">Kalite Skoru</div>
            </div>
          </div>
        </motion.div>

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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Bekleyen</option>
                <option value="under_review">İnceleniyor</option>
                <option value="verified">Doğrulanmış</option>
                <option value="rejected">Reddedilen</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Rapor İndir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Verifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Son Doğrulama İşlemleri</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Proje</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Konum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Karbon Kredisi</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Tarih</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {recentVerifications.map((verification) => (
                  <tr key={verification.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{verification.projectName}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{verification.location}</td>
                    <td className="py-4 px-6 font-medium">{verification.carbonCredits.toLocaleString()} tCO₂</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        verification.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                        verification.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        verification.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {verification.status === 'verified' ? 'Doğrulanmış' :
                         verification.status === 'pending' ? 'Bekliyor' :
                         verification.status === 'under_review' ? 'İnceleniyor' : 'Reddedildi'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {verification.verifiedAt ? new Date(verification.verifiedAt).toLocaleDateString('tr-TR') :
                       verification.submittedAt ? new Date(verification.submittedAt).toLocaleDateString('tr-TR') :
                       verification.reviewStarted ? new Date(verification.reviewStarted).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {verification.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerifyProject(verification.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Doğrula"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectProject(verification.id, 'Belgeler eksik')}
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

          {recentVerifications.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Doğrulama işlemi bulunamadı</h3>
              <p className="text-gray-600">Henüz doğrulama için proje gönderilmemiş.</p>
            </div>
          )}
        </motion.div>

        {/* Verification Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-3">
            <FileText className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Doğrulama Kriterleri</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Proje dokümantasyonunun eksiksiz olması</li>
                <li>• Karbon kredisi hesaplamalarının doğruluğu</li>
                <li>• Uluslararası standartlara uygunluk (VCS, Gold Standard)</li>
                <li>• Çevresel etki değerlendirmesinin yapılmış olması</li>
                <li>• Yerel topluluk onayının alınmış olması</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};