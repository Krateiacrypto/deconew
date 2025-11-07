import { supabase } from '../lib/supabase';
import { UserRole, Permission, UserCustomPermission } from '../types';

export interface EffectivePermission {
  permission_code: string;
  permission_name: string;
  permission_category: string;
  source: string;
}

export interface BulkUpdateResult {
  success: boolean;
  added: number;
  removed: number;
  role: string;
}

export const permissionService = {
  async getUserEffectivePermissions(userId: string): Promise<EffectivePermission[]> {
    const { data, error } = await supabase.rpc('get_user_effective_permissions', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error fetching effective permissions:', error);
      throw error;
    }

    return data || [];
  },

  async getAllPermissions(): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('category, name');

    if (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }

    return data || [];
  },

  async getRolePermissions(role: UserRole): Promise<string[]> {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('permission_code')
      .eq('role', role);

    if (error) {
      console.error('Error fetching role permissions:', error);
      throw error;
    }

    return data?.map(p => p.permission_code) || [];
  },

  async bulkUpdateRolePermissions(
    role: UserRole,
    permissionCodes: string[],
    adminId: string
  ): Promise<BulkUpdateResult> {
    const { data, error } = await supabase.rpc('bulk_update_role_permissions', {
      p_role: role,
      p_permission_codes: permissionCodes,
      p_admin_id: adminId
    });

    if (error) {
      console.error('Error bulk updating permissions:', error);
      throw error;
    }

    return data;
  },

  async grantTemporaryPermission(
    userId: string,
    permissionCode: string,
    durationHours: number,
    grantedBy: string,
    notes?: string
  ): Promise<string> {
    const { data, error } = await supabase.rpc('grant_temporary_permission', {
      p_user_id: userId,
      p_permission_code: permissionCode,
      p_duration_hours: durationHours,
      p_granted_by: grantedBy,
      p_notes: notes
    });

    if (error) {
      console.error('Error granting temporary permission:', error);
      throw error;
    }

    return data;
  },

  async getUserCustomPermissions(userId: string): Promise<UserCustomPermission[]> {
    const { data, error } = await supabase
      .from('user_custom_permissions')
      .select(`
        *,
        permission:permissions(code, name, category)
      `)
      .eq('user_id', userId)
      .order('granted_at', { ascending: false });

    if (error) {
      console.error('Error fetching custom permissions:', error);
      throw error;
    }

    return data || [];
  },

  async revokeCustomPermission(permissionId: string): Promise<void> {
    const { error } = await supabase
      .from('user_custom_permissions')
      .delete()
      .eq('id', permissionId);

    if (error) {
      console.error('Error revoking permission:', error);
      throw error;
    }
  },

  async checkPermission(userId: string, permissionCode: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('user_has_permission', {
      p_user_id: userId,
      p_permission_code: permissionCode
    });

    if (error) {
      console.error('Error checking permission:', error);
      return false;
    }

    return data || false;
  },

  async getPermissionsByCategory(category: string): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) {
      console.error('Error fetching permissions by category:', error);
      throw error;
    }

    return data || [];
  },

  async getUsersByPermission(permissionCode: string): Promise<any[]> {
    const { data, error } = await supabase.rpc('get_users_by_permission', {
      p_permission_code: permissionCode
    });

    if (error) {
      console.error('Error fetching users by permission:', error);
      throw error;
    }

    return data || [];
  }
};
