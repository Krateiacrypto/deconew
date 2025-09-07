import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../utils/permissions';
import { SettingsLayout } from '../../components/admin/settings/SettingsLayout';
import { SettingsTabs, SettingsTab } from '../../components/admin/settings/SettingsTabs';
import { GeneralSettings } from '../../components/admin/settings/GeneralSettings';
import { SupabaseSettings } from '../../components/admin/settings/SupabaseSettings';
import { StripeSettings } from '../../components/admin/settings/StripeSettings';
import { SecuritySettings } from '../../components/admin/settings/SecuritySettings';
import { MaintenanceSettings } from '../../components/admin/settings/MaintenanceSettings';
import { AlertTriangle } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  if (!hasPermission(user, 'system.settings')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'supabase':
        return <SupabaseSettings />;
      case 'stripe':
        return <StripeSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'maintenance':
        return <MaintenanceSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <SettingsLayout
      title="Sistem Ayarları"
      description="Platform konfigürasyonu ve yönetim ayarları"
    >
      <SettingsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {renderTabContent()}
    </SettingsLayout>
  );
};