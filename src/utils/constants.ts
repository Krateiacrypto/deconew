// Application Constants
export const APP_CONFIG = {
  NAME: 'DECARBONIZE.world',
  DESCRIPTION: 'Global CO₂ Token Platform',
  VERSION: '1.0.0',
  AUTHOR: 'DECARBONIZE Team',
  CONTACT_EMAIL: 'info@decarbonize.world',
  SUPPORT_EMAIL: 'support@decarbonize.world'
};

// API Endpoints
export const API_ENDPOINTS = {
  USERS: '/api/users',
  PROJECTS: '/api/projects',
  BLOG: '/api/blog',
  KYC: '/api/kyc',
  STAKING: '/api/staking',
  TRADING: '/api/trading'
};

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  BLOG_PAGE_SIZE: 9,
  PROJECTS_PAGE_SIZE: 12
};

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user-profile',
  PROJECTS: 'projects',
  BLOG_POSTS: 'blog-posts',
  CATEGORIES: 'blog-categories',
  SETTINGS: 'app-settings'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  LANGUAGE: 'language-storage',
  THEME: 'theme-storage',
  EDITOR: 'editor-storage',
  WALLET: 'wallet-storage'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.',
  UNAUTHORIZED: 'Bu işlem için yetkiniz bulunmuyor.',
  VALIDATION_ERROR: 'Lütfen tüm gerekli alanları doldurun.',
  FILE_TOO_LARGE: 'Dosya boyutu çok büyük.',
  INVALID_FILE_TYPE: 'Desteklenmeyen dosya türü.',
  GENERIC_ERROR: 'Beklenmeyen bir hata oluştu.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Başarıyla kaydedildi!',
  UPDATE_SUCCESS: 'Başarıyla güncellendi!',
  DELETE_SUCCESS: 'Başarıyla silindi!',
  UPLOAD_SUCCESS: 'Dosya başarıyla yüklendi!',
  EMAIL_SENT: 'E-posta başarıyla gönderildi!'
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#10b981',
  SECONDARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
};

// Blockchain Constants
export const BLOCKCHAIN = {
  REEF_CHAIN_ID: 13377,
  REEF_CHAIN_NAME: 'Reef Chain Mainnet',
  REEF_RPC_URL: 'https://rpc.reefscan.com',
  REEF_EXPLORER_URL: 'https://reefscan.com',
  CO2_TOKEN_SYMBOL: 'CO₂',
  DCB_TOKEN_SYMBOL: 'DCB'
};

// Social Media Links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/decarbonize_co2',
  LINKEDIN: 'https://linkedin.com/company/decarbonize',
  TELEGRAM: 'https://t.me/decarbonize_official',
  GITHUB: 'https://github.com/decarbonize-world',
  DISCORD: 'https://discord.gg/decarbonize'
};