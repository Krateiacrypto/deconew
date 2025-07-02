import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Translations {
  [key: string]: {
    tr: string;
    en: string;
    de: string;
    fr: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    tr: 'Ana Sayfa',
    en: 'Home',
    de: 'Startseite',
    fr: 'Accueil'
  },
  'nav.projects': {
    tr: 'Projeler',
    en: 'Projects',
    de: 'Projekte',
    fr: 'Projets'
  },
  'nav.trading': {
    tr: 'Trading',
    en: 'Trading',
    de: 'Handel',
    fr: 'Trading'
  },
  'nav.ico': {
    tr: 'ICO',
    en: 'ICO',
    de: 'ICO',
    fr: 'ICO'
  },
  'nav.blog': {
    tr: 'Blog',
    en: 'Blog',
    de: 'Blog',
    fr: 'Blog'
  },
  'nav.about': {
    tr: 'Hakkımızda',
    en: 'About',
    de: 'Über uns',
    fr: 'À propos'
  },
  'nav.dashboard': {
    tr: 'Dashboard',
    en: 'Dashboard',
    de: 'Dashboard',
    fr: 'Tableau de bord'
  },
  'nav.portfolio': {
    tr: 'Portföy',
    en: 'Portfolio',
    de: 'Portfolio',
    fr: 'Portefeuille'
  },
  'nav.wallet': {
    tr: 'Cüzdan',
    en: 'Wallet',
    de: 'Wallet',
    fr: 'Portefeuille'
  },
  'nav.advisor': {
    tr: 'Danışman',
    en: 'Advisor',
    de: 'Berater',
    fr: 'Conseiller'
  },
  'nav.login': {
    tr: 'Giriş Yap',
    en: 'Login',
    de: 'Anmelden',
    fr: 'Connexion'
  },
  'nav.register': {
    tr: 'Kayıt Ol',
    en: 'Register',
    de: 'Registrieren',
    fr: 'S\'inscrire'
  },
  'nav.logout': {
    tr: 'Çıkış Yap',
    en: 'Logout',
    de: 'Abmelden',
    fr: 'Déconnexion'
  },

  // Common
  'common.loading': {
    tr: 'Yükleniyor...',
    en: 'Loading...',
    de: 'Laden...',
    fr: 'Chargement...'
  },
  'common.save': {
    tr: 'Kaydet',
    en: 'Save',
    de: 'Speichern',
    fr: 'Enregistrer'
  },
  'common.cancel': {
    tr: 'İptal',
    en: 'Cancel',
    de: 'Abbrechen',
    fr: 'Annuler'
  },
  'common.delete': {
    tr: 'Sil',
    en: 'Delete',
    de: 'Löschen',
    fr: 'Supprimer'
  },
  'common.edit': {
    tr: 'Düzenle',
    en: 'Edit',
    de: 'Bearbeiten',
    fr: 'Modifier'
  },
  'common.view': {
    tr: 'Görüntüle',
    en: 'View',
    de: 'Ansehen',
    fr: 'Voir'
  },
  'common.approve': {
    tr: 'Onayla',
    en: 'Approve',
    de: 'Genehmigen',
    fr: 'Approuver'
  },
  'common.reject': {
    tr: 'Reddet',
    en: 'Reject',
    de: 'Ablehnen',
    fr: 'Rejeter'
  },

  // Dashboard
  'dashboard.welcome': {
    tr: 'Hoş geldiniz',
    en: 'Welcome',
    de: 'Willkommen',
    fr: 'Bienvenue'
  },
  'dashboard.totalValue': {
    tr: 'Toplam Portföy Değeri',
    en: 'Total Portfolio Value',
    de: 'Gesamtportfoliowert',
    fr: 'Valeur totale du portefeuille'
  },
  'dashboard.carbonCredits': {
    tr: 'Karbon Kredisi Bakiyesi',
    en: 'Carbon Credits Balance',
    de: 'Kohlenstoffkredit-Saldo',
    fr: 'Solde des crédits carbone'
  },

  // KYC
  'kyc.title': {
    tr: 'Kimlik Doğrulama (KYC)',
    en: 'Identity Verification (KYC)',
    de: 'Identitätsprüfung (KYC)',
    fr: 'Vérification d\'identité (KYC)'
  },
  'kyc.personalInfo': {
    tr: 'Kişisel Bilgiler',
    en: 'Personal Information',
    de: 'Persönliche Informationen',
    fr: 'Informations personnelles'
  },
  'kyc.documents': {
    tr: 'Belgeler',
    en: 'Documents',
    de: 'Dokumente',
    fr: 'Documents'
  },

  // Staking
  'staking.title': {
    tr: 'DCB Token Staking',
    en: 'DCB Token Staking',
    de: 'DCB Token Staking',
    fr: 'Staking de tokens DCB'
  },
  'staking.stake': {
    tr: 'Stake Et',
    en: 'Stake',
    de: 'Staken',
    fr: 'Staker'
  },
  'staking.unstake': {
    tr: 'Unstake',
    en: 'Unstake',
    de: 'Unstaken',
    fr: 'Unstaker'
  },

  // Admin
  'admin.userManagement': {
    tr: 'Kullanıcı Yönetimi',
    en: 'User Management',
    de: 'Benutzerverwaltung',
    fr: 'Gestion des utilisateurs'
  },
  'admin.projectManagement': {
    tr: 'Proje Yönetimi',
    en: 'Project Management',
    de: 'Projektverwaltung',
    fr: 'Gestion de projet'
  },
  'admin.kycManagement': {
    tr: 'KYC Yönetimi',
    en: 'KYC Management',
    de: 'KYC-Verwaltung',
    fr: 'Gestion KYC'
  },
  'admin.systemSettings': {
    tr: 'Sistem Ayarları',
    en: 'System Settings',
    de: 'Systemeinstellungen',
    fr: 'Paramètres système'
  }
};

interface LanguageState {
  currentLanguage: 'tr' | 'en' | 'de' | 'fr';
  setLanguage: (language: 'tr' | 'en' | 'de' | 'fr') => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'tr',
      
      setLanguage: (language: 'tr' | 'en' | 'de' | 'fr') => {
        set({ currentLanguage: language });
      },
      
      t: (key: string) => {
        const { currentLanguage } = get();
        const translation = translations[key];
        
        if (!translation) {
          console.warn(`Translation missing for key: ${key}`);
          return key;
        }
        
        return translation[currentLanguage] || translation.tr || key;
      }
    }),
    {
      name: 'language-storage'
    }
  )
);