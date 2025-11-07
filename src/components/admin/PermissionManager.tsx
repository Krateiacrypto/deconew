import React, { useState, useEffect } from 'react';
import { Shield, Plus, X, Clock, Check } from 'lucide-react';
import { permissionService } from '../../services/permissionService';
import { UserRole, Permission } from '../../types';
import { useAsyncData, useAsyncMutation } from '../../hooks/useAsyncOperation';

interface Props {
  userId: string;
  userRole: UserRole;
  currentUserId: string;
}

export default function PermissionManager({ userId, userRole, currentUserId }: Props) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [customPermissions, setCustomPermissions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showGrantModal, setShowGrantModal] = useState(false);

  /**
   * Load permissions data using useAsyncData hook
   */
  const { loading } = useAsyncData(
    async () => {
      const [allPerms, effective, custom] = await Promise.all([
        permissionService.getAllPermissions(),
        permissionService.getUserEffectivePermissions(userId),
        permissionService.getUserCustomPermissions(userId)
      ]);

      setPermissions(allPerms);
      setUserPermissions(effective.map(p => p.permission_code));
      setCustomPermissions(custom);

      return { allPerms, effective, custom };
    },
    [userId],
    {
      showErrorToast: true,
      errorMessage: 'Failed to load permissions',
      autoLog: true,
    }
  );

  /**
   * Grant temporary permission mutation
   */
  const { mutate: grantTemporaryPermission } = useAsyncMutation(
    async (payload: { permCode: string; hours: number }) => {
      await permissionService.grantTemporaryPermission(
        userId,
        payload.permCode,
        payload.hours,
        currentUserId,
        'Granted via admin panel'
      );
      return { success: true };
    },
    {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: 'Temporary permission granted',
      autoLog: true,
      onSuccess: () => {
        // Reload data after granting permission
        // In a real app, you might use a cache invalidation strategy
      },
    }
  );

  /**
   * Revoke permission mutation
   */
  const { mutate: revokePermission } = useAsyncMutation(
    async (permissionId: string) => {
      await permissionService.revokeCustomPermission(permissionId);
      return { success: true };
    },
    {
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: 'Permission revoked',
      autoLog: true,
      onSuccess: () => {
        // Update custom permissions state
        setCustomPermissions(prev => prev.filter(p => p.id !== permissionId));
      },
    }
  );

  const handleGrantTemporary = async (permCode: string, hours: number) => {
    await grantTemporaryPermission({ permCode, hours });
  };

  const handleRevoke = async (permissionId: string) => {
    await revokePermission(permissionId);
  };

  const categories = ['all', ...new Set(permissions.map(p => p.category))];
  const filteredPermissions = selectedCategory === 'all'
    ? permissions
    : permissions.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Permission Management
        </h3>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {cat.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Custom Permissions */}
      {customPermissions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-3">Custom Permissions</h4>
          <div className="space-y-2">
            {customPermissions.map(cp => (
              <div key={cp.id} className="flex items-center justify-between bg-white p-3 rounded">
                <div>
                  <p className="font-medium">{cp.permission_code}</p>
                  {cp.expires_at && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expires: {new Date(cp.expires_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRevoke(cp.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Grid */}
      <div className="grid gap-3">
        {filteredPermissions.map(perm => {
          const hasPermission = userPermissions.includes(perm.code);
          return (
            <div
              key={perm.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                hasPermission
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {hasPermission && <Check className="h-4 w-4 text-green-600" />}
                    <h4 className="font-medium">{perm.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{perm.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Code: {perm.code}</p>
                </div>
                {!hasPermission && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGrantTemporary(perm.code, 24)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      24h
                    </button>
                    <button
                      onClick={() => handleGrantTemporary(perm.code, 168)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      7d
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
