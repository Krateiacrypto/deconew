import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Database, 
  CreditCard, 
  Shield, 
  AlertTriangle,
  Globe,
  Activity
} from 'lucide-react';

export type SettingsTab = 'general' | 'supabase' | 'stripe' | 'security' | 'maintenance';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    {
      id: 'general' as const,
      name: 'Genel',
      icon: SettingsIcon,
      description: 'Site ayarları ve konfigürasyon'
    },
    {
      id: 'supabase' as const,
      name: 'Supabase',
      icon: Database,
      description: 'Veritabanı ve backend ayarları'
    },
    {
      id: 'stripe' as const,
      name: 'Stripe',
      icon: CreditCard,
      description: 'Ödeme sistemi konfigürasyonu'
    },
    {
      id: 'security' as const,
      name: 'Güvenlik',
      icon: Shield,
      description: 'Güvenlik politikaları ve loglar'
    },
    {
      id: 'maintenance' as const,
      name: 'Bakım',
      icon: AlertTriangle,
      description: 'Sistem bakımı ve monitoring'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-3 py-6 px-8 border-b-2 font-medium text-sm transition-colors whitespace-nowrap min-w-0 ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">{tab.name}</div>
                <div className="text-xs text-gray-500">{tab.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};