import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Mail,
  Phone,
  Plus,
  UserPlus,
  Building,
  Award,
  Calendar,
  Activity,
  AlertTriangle,
  User,
  Settings,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { hasPermission, getRoleDisplayName, getRoleColor } from '../../utils/permissions';
import { User as UserType } from '../../types';
import toast from 'react-hot-toast';

export const UserManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { users, fetchUsers, updateUser, deleteUser, isLoading } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (u.organizationName && u.organizationName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesKyc = kycFilter === 'all' || u.kycStatus === kycFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && u.isActive) ||
                         (statusFilter === 'inactive' && !u.isActive);
    return matchesSearch && matchesRole && matchesKyc && matchesStatus;
  });

  const handleToggleUserStatus = async (userId: string) => {
    if (!hasPermission(user, 'users.edit')) {
      toast.error('Kullanıcı düzenleme yetkiniz bulunmamaktadır!');
      return;
    }
    
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    try {
      await updateUser(userId, { isActive: !targetUser.isActive });
      toast.success(`Kullanıcı ${targetUser.isActive ? 'deaktif' : 'aktif'} edildi!`);
    } catch (error) {
      toast.error('Durum güncellenemedi!');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!hasPermission(user, 'users.delete')) {
      toast.error('Kullanıcı silme yetkiniz bulunmamaktadır!');
      return;
    }
    
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteUser(userId);
        toast.success('Kullanıcı silindi!');
      } catch (error) {
        toast.error('Kullanıcı silinemedi!');
      }
    }
  };

  const handleUpdateKYC = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      await updateUser(userId, { kycStatus: status });
      toast.success(`KYC durumu ${status === 'approved' ? 'onaylandı' : 'reddedildi'}!`);
    } catch (error) {
      toast.error('KYC durumu güncellenemedi!');
    }
  };

  const canManageUser = (targetUser: UserType) => {
    if (user?.role === 'superadmin') return true;
    if (user?.role === 'admin') {
      return !['superadmin', 'admin'].includes(targetUser.role);
    }
    return false;
  };

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: users.length,
      icon: Users,
      color: 'blue',
      change: '+12.5%'
    },
    {
      title: 'Aktif Kullanıcı',
      value: users.filter(u => u.isActive).length,
      icon: CheckCircle,
      color: 'emerald',
      change: '+8.3%'
    },
    {
      title: 'KYC Bekleyen',
      value: users.filter(u => u.kycStatus === 'pending').length,
      icon: Clock,
      color: 'yellow',
      change: '-5.2%'
    },
    {
      title: 'Organizasyonlar',
      value: users.filter(u => ['admin', 'superadmin', 'advisor', 'verification_org', 'ngo', 'carbon_provider'].includes(u.role)).length,
      icon: Building,
      color: 'purple',
      change: '+15.7%'
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h1>
              <p className="text-gray-600">Platform kullanıcılarını yönetin ve izinleri düzenleyin</p>
            </div>
            {hasPermission(user, 'users.create') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-5 h-5" />
                <span>Yeni Kullanıcı</span>
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
                placeholder="Ad, e-posta veya organizasyon ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm Roller</option>
                <option value="user">Kullanıcı</option>
                <option value="advisor">Danışman</option>
                <option value="verification_org">Doğrulama Kuruluşu</option>
                <option value="ngo">STK</option>
                <option value="carbon_provider">Karbon Sağlayıcı</option>
                <option value="admin">Admin</option>
                {user?.role === 'superadmin' && <option value="superadmin">Süper Admin</option>}
              </select>

              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm KYC Durumları</option>
                <option value="approved">Onaylı</option>
                <option value="pending">Bekleyen</option>
                <option value="rejected">Reddedilen</option>
                <option value="under_review">İnceleniyor</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Excel İndir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Kullanıcı</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Rol</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Organizasyon</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">KYC Durumu</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Son Giriş</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((targetUser) => (
                  <tr key={targetUser.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{targetUser.name}</p>
                          <p className="text-sm text-gray-600">{targetUser.email}</p>
                          {targetUser.phone && (
                            <p className="text-xs text-gray-500">{targetUser.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(targetUser.role)}`}>
                        {getRoleDisplayName(targetUser.role)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        {targetUser.organizationName ? (
                          <>
                            <p className="font-medium text-gray-900 text-sm">{targetUser.organizationName}</p>
                            {targetUser.organizationType && (
                              <p className="text-xs text-gray-500">{targetUser.organizationType}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          targetUser.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          targetUser.kycStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                          targetUser.kycStatus === 'under_review' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {targetUser.kycStatus === 'approved' ? 'Onaylı' :
                           targetUser.kycStatus === 'rejected' ? 'Reddedildi' :
                           targetUser.kycStatus === 'under_review' ? 'İnceleniyor' : 'Bekliyor'}
                        </span>
                        {targetUser.kycStatus === 'pending' && canManageUser(targetUser) && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleUpdateKYC(targetUser.id, 'approved')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="KYC Onayla"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleUpdateKYC(targetUser.id, 'rejected')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="KYC Reddet"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {targetUser.lastLogin ? (
                        <div>
                          <div>{new Date(targetUser.lastLogin).toLocaleDateString('tr-TR')}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(targetUser.lastLogin).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ) : (
                        'Hiç giriş yapmadı'
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          targetUser.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {targetUser.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                        {targetUser.twoFactorEnabled && (
                          <Shield className="w-4 h-4 text-emerald-600" title="2FA Aktif" />
                        )}
                        {targetUser.emailVerified && (
                          <CheckCircle className="w-4 h-4 text-blue-600" title="E-posta Doğrulandı" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedUser(targetUser)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {canManageUser(targetUser) && (
                          <>
                            <button
                              onClick={() => handleToggleUserStatus(targetUser.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                targetUser.isActive 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={targetUser.isActive ? 'Deaktif Et' : 'Aktif Et'}
                            >
                              {targetUser.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteUser(targetUser.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Kullanıcıyı Sil"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinize uygun kullanıcı bulunamadı.</p>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUpdate={updateUser}
            canEdit={canManageUser(selectedUser)}
          />
        )}
      </div>
    </div>
  );
};

// User Detail Modal Component
interface UserDetailModalProps {
  user: any;
  onClose: () => void;
  onUpdate: (id: string, updates: any) => Promise<void>;
  canEdit: boolean;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user: targetUser, onClose, onUpdate, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: targetUser.name,
    email: targetUser.email,
    phone: targetUser.phone || '',
    country: targetUser.country || '',
    role: targetUser.role,
    kycStatus: targetUser.kycStatus,
    isActive: targetUser.isActive,
    emailVerified: targetUser.emailVerified,
    twoFactorEnabled: targetUser.twoFactorEnabled,
    organizationName: targetUser.organizationName || '',
    organizationType: targetUser.organizationType || ''
  });

  const handleSave = async () => {
    try {
      await onUpdate(targetUser.id, editForm);
      toast.success('Kullanıcı güncellendi!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Güncelleme başarısız!');
    }
  };

  const getUserStats = () => {
    switch (targetUser.role) {
      case 'user':
        return [
          { label: 'Toplam Yatırım', value: '$' + (Math.floor(Math.random() * 50000)).toLocaleString(), icon: DollarSign },
          { label: 'Karbon Kredisi', value: Math.floor(Math.random() * 1000) + ' tCO₂', icon: Award },
          { label: 'Aktif Projeler', value: Math.floor(Math.random() * 10), icon: Activity },
          { label: 'Getiri Oranı', value: '+' + (Math.random() * 20).toFixed(1) + '%', icon: TrendingUp }
        ];
      case 'advisor':
        return [
          { label: 'Atanan Kullanıcı', value: Math.floor(Math.random() * 50), icon: Users },
          { label: 'Tamamlanan Danışmanlık', value: Math.floor(Math.random() * 200), icon: CheckCircle },
          { label: 'Değerlendirme', value: (4.5 + Math.random() * 0.5).toFixed(1) + '/5', icon: Star },
          { label: 'Aylık Gelir', value: '$' + Math.floor(Math.random() * 10000).toLocaleString(), icon: DollarSign }
        ];
      default:
        return [];
    }
  };

  const stats = getUserStats();

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
          <h3 className="text-xl font-bold text-gray-900">Kullanıcı Detayları</h3>
          <div className="flex items-center space-x-2">
            {canEdit && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>{isEditing ? 'İptal' : 'Düzenle'}</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="advisor">Danışman</option>
                  <option value="verification_org">Doğrulama Kuruluşu</option>
                  <option value="ngo">STK</option>
                  <option value="carbon_provider">Karbon Sağlayıcı</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Süper Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KYC Durumu</label>
                <select
                  value={editForm.kycStatus}
                  onChange={(e) => setEditForm({...editForm, kycStatus: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="approved">Onaylı</option>
                  <option value="rejected">Reddedildi</option>
                  <option value="under_review">İnceleniyor</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Kaydet
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ad Soyad</label>
                  <p className="text-lg font-medium text-gray-900">{targetUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">E-posta</label>
                  <p className="text-gray-900">{targetUser.email}</p>
                </div>
                {targetUser.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefon</label>
                    <p className="text-gray-900">{targetUser.phone}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Rol</label>
                  <p className="text-gray-900">{getRoleDisplayName(targetUser.role)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kayıt Tarihi</label>
                  <p className="text-gray-900">{new Date(targetUser.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                {targetUser.country && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ülke</label>
                    <p className="text-gray-900">{targetUser.country}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Organization Info */}
            {targetUser.organizationName && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Organizasyon Bilgileri</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-blue-700">Organizasyon Adı</label>
                    <p className="text-blue-900">{targetUser.organizationName}</p>
                  </div>
                  {targetUser.organizationType && (
                    <div>
                      <label className="text-sm font-medium text-blue-700">Tür</label>
                      <p className="text-blue-900">{targetUser.organizationType}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">İstatistikler</h4>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <stat.icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{stat.label}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specializations & Certifications */}
            {(targetUser.specializations?.length > 0 || targetUser.certifications?.length > 0) && (
              <div className="space-y-4">
                {targetUser.specializations?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Uzmanlık Alanları</h4>
                    <div className="flex flex-wrap gap-2">
                      {targetUser.specializations.map((spec: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {targetUser.certifications?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Sertifikalar</h4>
                    <div className="flex flex-wrap gap-2">
                      {targetUser.certifications.map((cert: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};