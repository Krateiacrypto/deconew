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
  Phone
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import toast from 'react-hot-toast';


export const UserManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { users, fetchUsers, updateUser, deleteUser } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    setIsLoading(false);
  }, [fetchUsers]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesKyc = kycFilter === 'all' || u.kycStatus === kycFilter;
    return matchesSearch && matchesRole && matchesKyc;
  });

  const handleToggleUserStatus = async (userId: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate) {
      await updateUser(userId, { isActive: !userToUpdate.isActive });
    }
    toast.success('Kullanıcı durumu güncellendi');
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      await deleteUser(userId);
      toast.success('Kullanıcı silindi');
    }
  };

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: users.length,
      color: 'blue'
    },
    {
      title: 'Aktif Kullanıcı',
      value: users.filter(u => u.isActive).length,
      color: 'green'
    },
    {
      title: 'KYC Bekleyen',
      value: users.filter(u => u.kycStatus === 'pending').length,
      color: 'yellow'
    },
    {
      title: 'Admin Kullanıcı',
      value: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
      color: 'purple'
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600">Platform kullanıcılarını yönetin</p>
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
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm Roller</option>
                <option value="user">Kullanıcı</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>

              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Tüm KYC Durumları</option>
                <option value="approved">Onaylı</option>
                <option value="pending">Bekleyen</option>
                <option value="rejected">Reddedilen</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
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
                  <th className="text-left py-4 px-6 font-medium text-gray-600">KYC Durumu</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Toplam Yatırım</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Son Giriş</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'superadmin' ? 'Super Admin' :
                         user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        user.kycStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.kycStatus === 'approved' ? 'Onaylı' :
                         user.kycStatus === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium">-</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : 'Hiç'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedUser(user.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`p-2 rounded-lg ${
                            user.isActive 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={user.isActive ? 'Deaktif Et' : 'Aktif Et'}
                        >
                          {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteUser(user.id)}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinize uygun kullanıcı bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};