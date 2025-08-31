import { User, Permission, RolePermissions } from '../types';

// Define all available permissions
export const PERMISSIONS: Permission[] = [
  // User Management
  {
    id: 'users.view',
    name: 'Kullanıcıları Görüntüle',
    description: 'Kullanıcı listesini ve profillerini görüntüleme',
    category: 'user_management',
    actions: ['read']
  },
  {
    id: 'users.edit',
    name: 'Kullanıcıları Düzenle',
    description: 'Kullanıcı bilgilerini düzenleme ve güncelleme',
    category: 'user_management',
    actions: ['update']
  },
  {
    id: 'users.delete',
    name: 'Kullanıcıları Sil',
    description: 'Kullanıcı hesaplarını silme',
    category: 'user_management',
    actions: ['delete']
  },
  {
    id: 'users.create',
    name: 'Kullanıcı Oluştur',
    description: 'Yeni kullanıcı hesabı oluşturma',
    category: 'user_management',
    actions: ['create']
  },
  
  // Project Management
  {
    id: 'projects.view',
    name: 'Projeleri Görüntüle',
    description: 'Proje listesini ve detaylarını görüntüleme',
    category: 'project_management',
    actions: ['read']
  },
  {
    id: 'projects.create',
    name: 'Proje Oluştur',
    description: 'Yeni proje oluşturma',
    category: 'project_management',
    actions: ['create']
  },
  {
    id: 'projects.edit',
    name: 'Projeleri Düzenle',
    description: 'Proje bilgilerini düzenleme',
    category: 'project_management',
    actions: ['update']
  },
  {
    id: 'projects.approve',
    name: 'Projeleri Onayla',
    description: 'Proje onaylama ve reddetme',
    category: 'project_management',
    actions: ['approve', 'reject']
  },
  
  // Content Management
  {
    id: 'content.view',
    name: 'İçerikleri Görüntüle',
    description: 'Site içeriklerini görüntüleme',
    category: 'content_management',
    actions: ['read']
  },
  {
    id: 'content.edit',
    name: 'İçerikleri Düzenle',
    description: 'Site içeriklerini düzenleme',
    category: 'content_management',
    actions: ['create', 'update', 'delete']
  },
  {
    id: 'blog.manage',
    name: 'Blog Yönetimi',
    description: 'Blog yazıları oluşturma, düzenleme ve yayınlama',
    category: 'content_management',
    actions: ['create', 'update', 'delete', 'publish']
  },
  
  // System Settings
  {
    id: 'system.settings',
    name: 'Sistem Ayarları',
    description: 'Platform ayarlarını yapılandırma',
    category: 'system_settings',
    actions: ['read', 'update']
  },
  {
    id: 'system.backup',
    name: 'Sistem Yedekleme',
    description: 'Sistem yedekleme ve geri yükleme',
    category: 'system_settings',
    actions: ['backup', 'restore']
  },
  
  // Financial
  {
    id: 'financial.view',
    name: 'Mali Verileri Görüntüle',
    description: 'Mali raporları ve istatistikleri görüntüleme',
    category: 'financial',
    actions: ['read']
  },
  {
    id: 'financial.manage',
    name: 'Mali İşlemler',
    description: 'Mali işlemleri yönetme',
    category: 'financial',
    actions: ['create', 'update', 'approve']
  },
  
  // Verification
  {
    id: 'verification.kyc',
    name: 'KYC Doğrulama',
    description: 'KYC başvurularını inceleme ve onaylama',
    category: 'verification',
    actions: ['review', 'approve', 'reject']
  },
  {
    id: 'verification.projects',
    name: 'Proje Doğrulama',
    description: 'Karbon kredisi projelerini doğrulama',
    category: 'verification',
    actions: ['verify', 'audit']
  },
  
  // Advisory
  {
    id: 'advisory.assign',
    name: 'Danışman Atama',
    description: 'Kullanıcılara danışman atama',
    category: 'advisory',
    actions: ['assign', 'reassign']
  },
  {
    id: 'advisory.manage',
    name: 'Danışmanlık Yönetimi',
    description: 'Danışmanlık süreçlerini yönetme',
    category: 'advisory',
    actions: ['create', 'update', 'schedule']
  }
];

// Define role permissions
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'superadmin',
    permissions: PERMISSIONS.map(p => p.id), // All permissions
    restrictions: {
      dataAccess: 'all'
    }
  },
  {
    role: 'admin',
    permissions: [
      'users.view', 'users.edit', 'users.create',
      'projects.view', 'projects.create', 'projects.edit', 'projects.approve',
      'content.view', 'content.edit', 'blog.manage',
      'financial.view',
      'verification.kyc'
    ],
    restrictions: {
      dataAccess: 'all',
      maxUsers: 1000
    }
  },
  {
    role: 'advisor',
    permissions: [
      'users.view',
      'projects.view',
      'content.view',
      'advisory.manage'
    ],
    restrictions: {
      dataAccess: 'assigned',
      maxUsers: 50
    }
  },
  {
    role: 'verification_org',
    permissions: [
      'projects.view',
      'verification.projects',
      'verification.kyc'
    ],
    restrictions: {
      dataAccess: 'own'
    }
  },
  {
    role: 'ngo',
    permissions: [
      'projects.view',
      'projects.create',
      'content.view'
    ],
    restrictions: {
      dataAccess: 'own',
      maxProjects: 10
    }
  },
  {
    role: 'carbon_provider',
    permissions: [
      'projects.view',
      'projects.create',
      'projects.edit',
      'content.view'
    ],
    restrictions: {
      dataAccess: 'own',
      maxProjects: 50
    }
  },
  {
    role: 'user',
    permissions: [
      'projects.view',
      'content.view'
    ],
    restrictions: {
      dataAccess: 'own'
    }
  }
];

// Helper functions
export const hasPermission = (user: User | null, permissionId: string): boolean => {
  if (!user) return false;
  
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === user.role);
  return rolePermissions?.permissions.includes(permissionId) || false;
};

export const getUserPermissions = (user: User | null): string[] => {
  if (!user) return [];
  
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === user.role);
  return rolePermissions?.permissions || [];
};

export const canAccessResource = (user: User | null, resourceOwnerId: string): boolean => {
  if (!user) return false;
  
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === user.role);
  const dataAccess = rolePermissions?.restrictions?.dataAccess;
  
  switch (dataAccess) {
    case 'all':
      return true;
    case 'assigned':
      // Check if user is assigned to this resource (implementation depends on context)
      return user.assignedUsers?.includes(resourceOwnerId) || user.id === resourceOwnerId;
    case 'own':
      return user.id === resourceOwnerId;
    default:
      return false;
  }
};

export const getRoleDisplayName = (role: User['role']): string => {
  const roleNames: Record<User['role'], string> = {
    superadmin: 'Süper Admin',
    admin: 'Admin',
    advisor: 'Danışman',
    verification_org: 'Doğrulama Kuruluşu',
    ngo: 'STK',
    carbon_provider: 'Karbon Sağlayıcı',
    user: 'Kullanıcı'
  };
  
  return roleNames[role] || role;
};

export const getRoleColor = (role: User['role']): string => {
  const roleColors: Record<User['role'], string> = {
    superadmin: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
    advisor: 'bg-blue-100 text-blue-800',
    verification_org: 'bg-green-100 text-green-800',
    ngo: 'bg-orange-100 text-orange-800',
    carbon_provider: 'bg-teal-100 text-teal-800',
    user: 'bg-gray-100 text-gray-800'
  };
  
  return roleColors[role] || 'bg-gray-100 text-gray-800';
};

export const getPermissionsByCategory = (category: Permission['category']): Permission[] => {
  return PERMISSIONS.filter(p => p.category === category);
};

export const hasAnyPermission = (user: User | null, permissionIds: string[]): boolean => {
  if (!user) return false;
  return permissionIds.some(permissionId => hasPermission(user, permissionId));
};

export const canManageUser = (currentUser: User | null, targetUser: User): boolean => {
  if (!currentUser) return false;
  
  // Superadmin can manage everyone
  if (currentUser.role === 'superadmin') return true;
  
  // Admin can manage everyone except superadmin and other admins
  if (currentUser.role === 'admin') {
    return !['superadmin', 'admin'].includes(targetUser.role);
  }
  
  // Others can only manage themselves
  return currentUser.id === targetUser.id;
};