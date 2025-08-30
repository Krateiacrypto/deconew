import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Award,
  Settings,
  Eye,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Building,
  Globe
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { getRoleDisplayName, getRoleColor, hasPermission } from '../../utils/permissions';
import toast from 'react-hot-toast';

export const UserProfiles: React.FC = () => {
  const { user } = useAuthStore();
  const { users, fetchUsers, updateUser, isLoading } = useDataStore();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Kullanıcı profillerine sadece Süper Admin erişebilir.</p>
        </div>
      </div>
    );
  }

  const handleEditUser = (targetUser: any) => {
    setSelectedUser(targetUser);
    setEditForm({
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      phone: targetUser.phone || '',
      country: targetUser.country || '',
      organizationName: targetUser.organizationName || '',
      organizationType: targetUser.organizationType || '',
      isActive: targetUser.isActive,
      kycStatus: targetUser.kycStatus,
      twoFactorEnabled: targetUser.twoFactorEnabled,
      emailVerified: targetUser.emailVerified,
      verificationLevel: targetUser.verificationLevel || 'basic',
      specializations: targetUser.specializations || [],
      certifications: targetUser.certifications || []
    });
    setIsEditing(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.id, editForm);
      toast.success('Kullanıcı profili güncellendi!');
      setIsEditing(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Güncelleme başarısız!');
    }
  };

  const handleToggleUserStatus = async (targetUser: any) => {
    try {
      await updateUser(targetUser.id, { isActive: !targetUser.isActive });
      toast.success(`Kullanıcı ${targetUser.isActive ? 'deaktif' : 'aktif'} edildi!`);
    } catch (error) {
      toast.error('Durum güncellenemedi!');
    }
  };

  const getUserTypeIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return Shield;
      case 'admin': return Settings;
      case 'advisor': return UserCheck;
      case 'verification_org': return Award;
      case 'ngo': return Building;
      case 'carbon_provider': return Globe;
      default: return User;
    }
  };

  const renderUserCard = (targetUser: any) => {
    const IconComponent = getUserTypeIcon(targetUser.role);
    
    return (
      <motion.div
        key={targetUser.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${
          targetUser.isActive ? 'border-emerald-500' : 'border-red-500'
        } hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{targetUser.name}</h3>
              <p className="text-gray-600">{targetUser.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(targetUser.role)}`}>
                {getRoleDisplayName(targetUser.role)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditUser(targetUser)}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
              title="Düzenle"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleUserStatus(targetUser)}
              className={`p-2 rounded-lg ${
                targetUser.isActive 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-emerald-600 hover:bg-emerald-50'
              }`}
              title={targetUser.isActive ? 'Deaktif Et' : 'Aktif Et'}
            >
              {targetUser.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Kayıt: {new Date(targetUser.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
            {targetUser.lastLogin && (
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Son giriş: {new Date(targetUser.lastLogin).toLocaleDateString('tr-TR')}</span>
              </div>
            )}
            {targetUser.phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{targetUser.phone}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                targetUser.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                targetUser.kycStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                KYC: {targetUser.kycStatus === 'approved' ? 'Onaylı' :
                      targetUser.kycStatus === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                targetUser.emailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                E-posta: {targetUser.emailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                targetUser.twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
              }`}>
                2FA: {targetUser.twoFactorEnabled ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>
        </div>

        {/* Organization Info */}
        {targetUser.organizationName && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">{targetUser.organizationName}</span>
            </div>
            {targetUser.organizationType && (
              <p className="text-sm text-blue-700">{targetUser.organizationType}</p>
            )}
          </div>
        )}

        {/* Specializations & Certifications */}
        {(targetUser.specializations?.length > 0 || targetUser.certifications?.length > 0) && (
          <div className="mt-4 space-y-3">
            {targetUser.specializations?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Uzmanlık Alanları:</p>
                <div className="flex flex-wrap gap-2">
                  {targetUser.specializations.map((spec: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {targetUser.certifications?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Sertifikalar:</p>
                <div className="flex flex-wrap gap-2">
                  {targetUser.certifications.map((cert: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kullanıcı Profilleri</h1>
          <p className="text-gray-600">Tüm kullanıcı profillerini görüntüle ve yönet</p>
        </motion.div>

        {/* User Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(renderUserCard)}
        </div>

        {/* Edit Modal */}
        {isEditing && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Kullanıcı Profili Düzenle</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ülke</label>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Organization Fields */}
                {['advisor', 'verification_org', 'ngo', 'carbon_provider'].includes(editForm.role) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organizasyon Adı</label>
                      <input
                        type="text"
                        value={editForm.organizationName}
                        onChange={(e) => setEditForm({...editForm, organizationName: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organizasyon Türü</label>
                      <input
                        type="text"
                        value={editForm.organizationType}
                        onChange={(e) => setEditForm({...editForm, organizationType: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Status Toggles */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.isActive}
                        onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">E-posta Doğrulandı</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.emailVerified}
                        onChange={(e) => setEditForm({...editForm, emailVerified: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">2FA</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.twoFactorEnabled}
                        onChange={(e) => setEditForm({...editForm, twoFactorEnabled: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
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
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Kaydediliyor...' : 'Kaydet'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};