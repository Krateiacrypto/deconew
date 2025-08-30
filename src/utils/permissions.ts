import { User, Permission, RolePermissions } from '../types';

// Tüm izinlerin tanımları
export const PERMISSIONS: Permission[] = [
  // Kullanıcı Yönetimi
  {
    id: 'users.view',
    name: 'Kullanıcıları Görüntüle',
    description: 'Kullanıcı listesini görüntüleme',
    category: 'user_management',
    actions: ['read']
  },
  {
    id: 'users.create',
    name: 'Kullanıcı Oluştur',
    description: 'Yeni kullanıcı hesabı oluşturma',
    category: 'user_management',
    actions: ['create']
  },
  {
    id: 'users.edit',
    name: 'Kullanıcı Düzenle',
    description: 'Kullanıcı bilgilerini düzenleme',
    category: 'user_management',
    actions: ['update']
  },
  {
    id: 'users.delete',
    name: 'Kullanıcı Sil',
    description: 'Kullanıcı hesabını silme',
    category: 'user_management',
    actions: ['delete']
  },
  {
    id: 'users.manage_roles',
    name: 'Rol Yönetimi',
    description: 'Kullanıcı rollerini değiştirme',
    category: 'user_management',
    actions: ['update']
  },

  // Proje Yönetimi
  {
    id: 'projects.view',
    name: 'Projeleri Görüntüle',
    description: 'Proje listesini görüntüleme',
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
    name: 'Proje Düzenle',
    description: 'Proje bilgilerini düzenleme',
    category: 'project_management',
    actions: ['update']
  },
  {
    id: 'projects.approve',
    name: 'Proje Onaylama',
    description: 'Projeleri onaylama/reddetme',
    category: 'project_management',
    actions: ['approve', 'reject']
  },
  {
    id: 'projects.verify',
    name: 'Proje Doğrulama',
    description: 'Proje doğrulama ve sertifikasyon',
    category: 'verification',
    actions: ['verify', 'certify']
  },

  // İçerik Yönetimi
  {
    id: 'content.view',
    name: 'İçerik Görüntüle',
    description: 'İçerikleri görüntüleme',
    category: 'content_management',
    actions: ['read']
  },
  {
    id: 'content.create',
    name: 'İçerik Oluştur',
    description: 'Yeni içerik oluşturma',
    category: 'content_management',
    actions: ['create']
  },
  {
    id: 'content.edit',
    name: 'İçerik Düzenle',
    description: 'İçerikleri düzenleme',
    category: 'content_management',
    actions: ['update']
  },
  {
    id: 'content.publish',
    name: 'İçerik Yayınla',
    description: 'İçerikleri yayınlama',
    category: 'content_management',
    actions: ['publish']
  },
  {
    id: 'content.delete',
    name: 'İçerik Sil',
    description: 'İçerikleri silme',
    category: 'content_management',
    actions: ['delete']
  },

  // Finansal İşlemler
  {
    id: 'finance.view',
    name: 'Finansal Verileri Görüntüle',
    description: 'Finansal raporları görüntüleme',
    category: 'financial',
    actions: ['read']
  },
  {
    id: 'finance.token_distribution',
    name: 'Token Dağıtımı',
    description: 'Token dağıtım onayları',
    category: 'financial',
    actions: ['approve', 'distribute']
  },
  {
    id: 'finance.pricing',
    name: 'Fiyat Belirleme',
    description: 'Token ve karbon kredisi fiyat belirleme',
    category: 'financial',
    actions: ['update']
  },

  // Sistem Ayarları
  {
    id: 'system.settings',
    name: 'Sistem Ayarları',
    description: 'Sistem konfigürasyonu',
    category: 'system_settings',
    actions: ['read', 'update']
  },
  {
    id: 'system.security',
    name: 'Güvenlik Ayarları',
    description: 'Güvenlik konfigürasyonu',
    category: 'system_settings',
    actions: ['read', 'update']
  },
  {
    id: 'system.logs',
    name: 'Sistem Logları',
    description: 'Sistem loglarını görüntüleme',
    category: 'system_settings',
    actions: ['read']
  },

  // Danışmanlık
  {
    id: 'advisory.provide',
    name: 'Danışmanlık Hizmeti',
    description: 'Kullanıcılara danışmanlık hizmeti verme',
    category: 'advisory',
    actions: ['advise', 'communicate']
  },
  {
    id: 'advisory.reports',
    name: 'Danışmanlık Raporları',
    description: 'Danışmanlık raporları oluşturma',
    category: 'advisory',
    actions: ['create', 'read']
  },

  // Doğrulama
  {
    id: 'verification.projects',
    name: 'Proje Doğrulama',
    description: 'Projeleri teknik olarak doğrulama',
    category: 'verification',
    actions: ['verify', 'certify', 'report']
  },
  {
    id: 'verification.carbon_credits',
    name: 'Karbon Kredisi Doğrulama',
    description: 'Karbon kredilerini hesaplama ve doğrulama',
    category: 'verification',
    actions: ['calculate', 'verify', 'certify']
  }
];

// Rol bazlı izin tanımları
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'superadmin',
    permissions: PERMISSIONS.map(p => p.id), // Tüm izinler
    restrictions: {
      dataAccess: 'all'
    }
  },
  {
    role: 'admin',
    permissions: [
      'users.view', 'users.create', 'users.edit', 'users.delete',
      'projects.view', 'projects.create', 'projects.edit', 'projects.approve',
      'content.view', 'content.create', 'content.edit', 'content.publish', 'content.delete',
      'finance.view', 'finance.token_distribution',
      'advisory.reports'
    ],
    restrictions: {
      dataAccess: 'all',
      maxUsers: 10000
    }
  },
  {
    role: 'advisor',
    permissions: [
      'users.view',
      'projects.view',
      'content.view', 'content.create',
      'advisory.provide', 'advisory.reports',
      'finance.view'
    ],
    restrictions: {
      dataAccess: 'assigned',
      maxUsers: 50
    }
  },
  {
    role: 'verification_org',
    permissions: [
      'projects.view', 'projects.verify',
      'verification.projects', 'verification.carbon_credits',
      'content.view'
    ],
    restrictions: {
      dataAccess: 'assigned'
    }
  },
  {
    role: 'ngo',
    permissions: [
      'projects.view', 'projects.create', 'projects.edit',
      'content.view', 'content.create',
      'finance.view'
    ],
    restrictions: {
      dataAccess: 'own',
      maxProjects: 10
    }
  },
  {
    role: 'carbon_provider',
    permissions: [
      'projects.view', 'projects.create', 'projects.edit',
      'finance.view', 'finance.pricing',
      'content.view'
    ],
    restrictions: {
      dataAccess: 'own',
      maxProjects: 25
    }
  },
  {
    role: 'user',
    permissions: [
      'projects.view',
      'content.view',
      'finance.view'
    ],
    restrictions: {
      dataAccess: 'own'
    }
  }
];

// İzin kontrol fonksiyonları
export const hasPermission = (user: User | null, permissionId: string): boolean => {
  if (!user) return false;
  
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === user.role);
  return rolePermissions?.permissions.includes(permissionId) || false;
};

export const hasAnyPermission = (user: User | null, permissionIds: string[]): boolean => {
  return permissionIds.some(permissionId => hasPermission(user, permissionId));
};

export const hasAllPermissions = (user: User | null, permissionIds: string[]): boolean => {
  return permissionIds.every(permissionId => hasPermission(user, permissionId));
};

export const canAccessData = (user: User | null, dataOwnerId?: string): boolean => {
  if (!user) return false;
  
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === user.role);
  const dataAccess = rolePermissions?.restrictions?.dataAccess;
  
  switch (dataAccess) {
    case 'all':
      return true;
    case 'assigned':
      return user.assignedUsers?.includes(dataOwnerId || '') || user.id === dataOwnerId;
    case 'own':
      return user.id === dataOwnerId;
    default:
      return false;
  }
};

export const getRoleDisplayName = (role: User['role']): string => {
  switch (role) {
    case 'superadmin':
      return 'Süper Admin';
    case 'admin':
      return 'Admin';
    case 'advisor':
      return 'Danışman';
    case 'verification_org':
      return 'Doğrulama Kuruluşu';
    case 'ngo':
      return 'STK';
    case 'carbon_provider':
      return 'Karbon Sağlayıcı';
    case 'user':
      return 'Kullanıcı';
    default:
      return role;
  }
};

export const getRoleColor = (role: User['role']): string => {
  switch (role) {
    case 'superadmin':
      return 'bg-purple-100 text-purple-800';
    case 'admin':
      return 'bg-blue-100 text-blue-800';
    case 'advisor':
      return 'bg-emerald-100 text-emerald-800';
    case 'verification_org':
      return 'bg-orange-100 text-orange-800';
    case 'ngo':
      return 'bg-pink-100 text-pink-800';
    case 'carbon_provider':
      return 'bg-green-100 text-green-800';
    case 'user':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPermissionsByCategory = (user: User | null) => {
  if (!user) return {};
  
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === user.role);
  if (!rolePermissions) return {};
  
  const userPermissions = PERMISSIONS.filter(p => 
    rolePermissions.permissions.includes(p.id)
  );
  
  return userPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
};