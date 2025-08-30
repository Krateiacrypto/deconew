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
import { hasPermission, getRoleDisplayName, getRoleColor } from '../../utils/permissions';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'advisor' | 'verification_org' | 'ngo' | 'carbon_provider' | 'user';
  kycStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  totalInvestment: number;
  carbonCredits: number;
  organizationName?: string;
  organizationType?: string;
}

export const UserManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, this would be an API call
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        kycStatus: 'approved',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        lastLogin: '2024-01-20T14:30:00Z',
        totalInvestment: 15000,
        carbonCredits: 450
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        kycStatus: 'pending',
        isActive: true,
        createdAt: '2024-01-18T09:15:00Z',
        lastLogin: '2024-01-19T16:45:00Z',
        totalInvestment: 8500,
        carbonCredits: 280
      },
      {
        id: '3',
        name: 'Admin User',
        email: 'admin@decarbonize.world',
        role: 'superadmin',
        kycStatus: 'approved',
        isActive: true,
        createdAt: '2023-12-01T00:00:00Z',
        lastLogin: '2024-01-20T08:00:00Z',
        totalInvestment: 0,
        carbonCredits: 0
      },
      {
        id: '4',
        name: 'Dr. Sarah Johnson',
        email: 'advisor@decarbonize.world',
        role: 'advisor',
        kycStatus: 'approved',
        isActive: true,
        createdAt: '2023-12-15T00:00:00Z',
        lastLogin: '2024-01-20T09:30:00Z',
        totalInvestment: 0,
        carbonCredits: 0,
        organizationName: 'Carbon Advisory Services'
      },
      {
        id: '5',
        name: 'Carbon Trust International',
        email: 'verification@decarbonize.world',
        role: 'verification_org',
        kycStatus: 'approved',
        isActive: true,
        createdAt: '2023-11-01T00:00:00Z',
        lastLogin: '2024-01-19T14:20:00Z',
        totalInvestment: 0,
        carbonCredits: 0,
        organizationName: 'Carbon Trust International',
        organizationType: 'Verification Body'
      }
    ];
    
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesKyc = kycFilter === 'all' || u.kycStatus === kycFilter;
    return matchesSearch && matchesRole && matchesKyc;
  });

  const handleToggleUserStatus = (userId: string) => {
    if (!hasPermission(user, 'users.edit')) {
      toast.error('Kullanıcı düzenleme yetkiniz bulunmamaktadır!');
      return;
    }
    
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    toast.success('Kullanıcı durumu güncellendi');
  };

  const handleDeleteUser = (userId: string) => {
    if (!hasPermission(user, 'users.delete')) {
      toast.error('Kullanıcı silme yetkiniz bulunmamaktadır!');
      return;
    }
    
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      setUsers(users.filter(u => u.id !== userId));
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
      title: 'Organizasyonlar',
      value: users.filter(u => ['admin', 'superadmin', 'advisor', 'verification_org', 'ngo', 'carbon_provider'].includes(u.role)).length,
      color: 'purple'
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

  // Süper admin olmayan adminler sadece kendi seviyesinden düşük rolleri yönetebilir
  const canManageUser = (targetUser: User) => {
    if (user?.role === 'superadmin') return true;
    if (user?.role === 'admin') {
      return !['superadmin', 'admin'].includes(targetUser.role);
    }
    return false;
  };

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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Organizasyon</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">KYC Durumu</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Toplam Yatırım</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Son Giriş</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Durum</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((targetUser) => (
                  <tr key={targetUser.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{targetUser.name}</p>
                        <p className="text-sm text-gray-600">{targetUser.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRoleColor(targetUser.role)}`}>
                        {getRoleDisplayName(targetUser.role)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        {targetUser.organizationName && (
                          <>
                            <p className="font-medium text-gray-900 text-sm">{targetUser.organizationName}</p>
                            <p className="text-xs text-gray-500">{targetUser.organizationType}</p>
                          </>
                        )}
                        {!targetUser.organizationName && (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        targetUser.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        targetUser.kycStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {targetUser.kycStatus === 'approved' ? 'Onaylı' :
                         targetUser.kycStatus === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium">${targetUser.totalInvestment.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {targetUser.lastLogin ? new Date(targetUser.lastLogin).toLocaleDateString('tr-TR') : 'Hiç'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {targetUser.lastLogin ? new Date(targetUser.lastLogin).toLocaleDateString('tr-TR') : 'Hiç'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        targetUser.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {targetUser.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedUser(targetUser.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {canManageUser(targetUser) && (
                          <>
                            <button
                              onClick={() => handleToggleUserStatus(targetUser.id)}
                              className={`p-2 rounded-lg ${
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
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Sil"
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
      </div>
    </div>
  );
};