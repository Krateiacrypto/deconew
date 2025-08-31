import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MaintenanceContent {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  videoUrl?: string;
  additionalInfo: string;
  estimatedTime: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    telegram?: string;
  };
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface MaintenanceState {
  isMaintenanceMode: boolean;
  content: MaintenanceContent;
  isLoading: boolean;
  
  // Actions
  toggleMaintenanceMode: () => void;
  updateContent: (content: Partial<MaintenanceContent>) => void;
  resetToDefaults: () => void;
}

const defaultContent: MaintenanceContent = {
  title: 'DECARBONIZE.world',
  subtitle: 'Çok Yakında',
  description: 'Karbon kredilerini tokenleştiren devrimci platformumuz üzerinde çalışıyoruz. Sürdürülebilir bir gelecek için blockchain teknolojisi ile çevre koruma arasında köprü kuruyoruz.',
  mission: 'Blockchain teknolojisinin gücünü kullanarak karbon kredilerini tokenleştirmek, şeffaf ve erişilebilir bir karbon piyasası oluşturmak.',
  vision: 'Küresel karbon nötrleme hedeflerine ulaşılmasında öncü rol oynamak ve sürdürülebilir bir gelecek için teknoloji ile çevre koruma arasında köprü kurmak.',
  videoUrl: '',
  additionalInfo: 'Platform lansmanımız için son hazırlıkları yapıyoruz. CO₂ token ile karbon nötrleme projelerine yatırım yapabileceğiniz, ReefChain altyapısı üzerinde çalışan güvenli ve şeffaf bir platform geliştiriyoruz.',
  estimatedTime: 'Mart 2024',
  contactEmail: 'info@decarbonize.world',
  socialLinks: {
    twitter: 'https://twitter.com/decarbonize',
    linkedin: 'https://linkedin.com/company/decarbonize',
    telegram: 'https://t.me/decarbonize'
  },
  backgroundColor: '#0f172a',
  textColor: '#ffffff',
  accentColor: '#10b981'
};

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set, get) => ({
      isMaintenanceMode: false,
      content: defaultContent,
      isLoading: false,

      toggleMaintenanceMode: () => {
        set(state => ({ isMaintenanceMode: !state.isMaintenanceMode }));
      },

      updateContent: (updates: Partial<MaintenanceContent>) => {
        set(state => ({
          content: { ...state.content, ...updates }
        }));
      },

      resetToDefaults: () => {
        set({ content: defaultContent });
      }
    }),
    {
      name: 'maintenance-storage',
      partialize: (state) => ({
        isMaintenanceMode: state.isMaintenanceMode,
        content: state.content
      })
    }
  )
);