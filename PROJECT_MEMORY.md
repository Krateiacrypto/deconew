# 🌍 DECARBONIZE.world - Proje Hafızası

> Bu dosya projenin yapısı, amacı ve temel bilgileri hakkında hızlı referans için oluşturulmuştur.

---

## 📋 Proje Özeti

**DECARBONIZE.world** - Karbon kredilerini tokenlei yapan, blockchain tabanlı bir sürdürülebilir yatırım platformu.

| Özellik | Açıklama |
|---------|----------|
| **Amaç** | CO2 kredilerine erişimi demokratikleştirmek |
| **Platform** | React Frontend + Supabase Backend + ReefChain Blockchain |
| **Durum** | Aşama 1 Tamamlandı, Aşama 2 Devam Ediyor |
| **Başlama Tarihi** | 2025 |

---

## 🏗️ Proje Mimarisi

```
Frontend (React)
├── 81 Bileşen (TSX)
├── 30+ Sayfalar
├── 11 Zustand Store
├── 6 Servis Modülü
└── 5 Utility Modülü
        ↓
Backend (Supabase)
├── PostgreSQL Veritabanı
├── JWT Kimlik Doğrulaması
├── Row-Level Security (RLS)
├── Real-time Abonelikler
└── 13 Migration Dosyası
        ↓
Blockchain (ReefChain)
├── ethers.js Entegrasyonu
├── Smart Contracts (ERC20, ICO, Staking)
├── MetaMask Bağlantısı
└── Token Transfer Sistemi
```

---

## 📁 Dizin Yapısı

```
D:/Decarbonize/
├── src/                          # Kaynak Kod (1.4MB)
│   ├── components/               # 81 React Bileşeni
│   │   ├── admin/               # Admin Panel Bileşenleri
│   │   ├── advisor/             # Danışman Özellikleri
│   │   ├── auth/                # Kimlik Doğrulama
│   │   ├── blog/                # Blog Sistemi
│   │   ├── carbon/              # Karbon Takibi
│   │   ├── editor/              # Görsel İçerik Editörü
│   │   ├── investor/            # Yatırımcı Yönetimi
│   │   ├── kyc/                 # KYC Formları
│   │   ├── layout/              # Layout Bileşenleri
│   │   ├── providers/           # Provider Bileşenleri
│   │   ├── staking/             # Staking Panosu
│   │   └── wallet/              # Cüzdan Entegrasyonu
│   ├── pages/                   # 30+ Sayfa Bileşenleri
│   │   ├── admin/               # Admin Sayfaları
│   │   ├── advisor/             # Danışman Sayfaları
│   │   ├── dashboard/           # Dashboard Sayfaları
│   │   ├── ngo/                 # NGO Dashboard
│   │   ├── provider/            # Provider Sayfaları
│   │   └── verification/        # Doğrulama Dashboard
│   ├── hooks/                   # 3 Custom Hook
│   │   ├── useLocalStorage.ts
│   │   ├── useRealtimeSubscription.ts
│   │   └── useSupabase.ts
│   ├── store/                   # 11 Zustand Store
│   │   ├── authStore.ts         # Kimlik Doğrulama
│   │   ├── walletStore.ts       # Blockchain Cüzdanı
│   │   ├── kycStore.ts          # KYC Durumu
│   │   ├── stakingStore.ts      # Staking Bilgileri
│   │   ├── tradingStore.ts      # İşlem Bilgileri
│   │   ├── editorStore.ts       # Editör Durumu
│   │   ├── blogStore.ts         # Blog Durumu
│   │   ├── contentStore.ts      # İçerik Yönetimi
│   │   ├── dataStore.ts         # Genel Veri
│   │   ├── languageStore.ts     # Dil Seçimi
│   │   └── notificationStore.ts # Bildirimler
│   ├── services/                # 6 Servis Modülü
│   │   ├── blockchainService.ts # Blockchain İşlemleri
│   │   ├── carbonService.ts     # Karbon Takibi
│   │   ├── icoService.ts        # ICO Yönetimi
│   │   ├── permissionService.ts # İzin Yönetimi
│   │   ├── supabaseService.ts   # Supabase İşlemleri
│   │   └── tierService.ts       # Yatırımcı Tier Sistemi
│   ├── types/                   # TypeScript Türleri
│   │   ├── index.ts            # Ana Türler
│   │   ├── blog.ts
│   │   ├── content.ts
│   │   ├── editor.ts
│   │   └── supabase.ts
│   ├── utils/                   # 5 Utility Modülü
│   │   ├── logger.ts
│   │   ├── markdown.ts
│   │   ├── permissionHelpers.ts
│   │   ├── permissions.ts
│   │   └── supabaseHelpers.ts
│   ├── lib/                     # Kütüphane Yapılandırmaları
│   │   └── supabase.ts         # Supabase Client
│   ├── App.tsx                  # Ana App Bileşeni
│   ├── main.tsx                 # Entry Point
│   └── index.css                # Global Stiller
│
├── supabase/                    # Supabase Yapılandırması (148KB)
│   ├── migrations/             # 13 SQL Migration Dosyası
│   │   ├── 20251002202117_create_initial_schema.sql
│   │   ├── 20251002202215_setup_storage_and_seed_data_v2.sql
│   │   ├── 20251002214906_add_blog_comments_and_seed_data.sql
│   │   ├── 20251002220928_create_content_and_additional_tables.sql
│   │   ├── 20251005154155_20251005_enhance_user_structure_applied.sql
│   │   ├── 20251005_enhance_user_structure.sql
│   │   ├── 20251017095623_20251017_enhance_sustainability_features.sql
│   │   ├── 20251017095836_20251017_permission_functions_complete.sql
│   │   └── 20251017102016_fix_security_issues_final.sql
│   └── seed_*.sql              # Seed Veri Dosyaları
│
├── public/                     # Statik Kaynaklar (150KB)
│   ├── logo.png
│   ├── co2-icon.svg
│   └── DECARBONIZE TOKEN WHITEPAPER.docx
│
├── dist/                       # Üretim Build Çıktısı
│
├── Yapılandırma Dosyaları
│   ├── package.json            # NPM Bağımlılıkları & Scripts
│   ├── vite.config.ts          # Vite Build Yapılandırması
│   ├── tsconfig.json           # TypeScript Yapılandırması
│   ├── tailwind.config.js      # Tailwind CSS Yapılandırması
│   ├── postcss.config.js       # PostCSS Yapılandırması
│   ├── eslint.config.js        # ESLint Yapılandırması
│   ├── index.html              # HTML Entry Point
│   ├── .env.example            # Ortam Değişkenleri Şablonu
│   └── .env                    # Ortam Değişkenleri (Gizli)
│
└── Dokümantasyon (17 Dosya)
    ├── README.md
    ├── QUICK_START.md
    ├── DEPLOYMENT_GUIDE.md
    ├── ROADMAP.md
    ├── FRONTEND_ARCHITECTURE.md
    ├── SUPABASE_SETUP.md
    ├── TEST_GUIDE.md
    └── ... (13 dosya daha)
```

---

## 🔧 Teknoloji Yığını

### Frontend
- **React** 18.3.1 - UI Kütüphanesi
- **TypeScript** 5.5.3 - Tip Güvenliği
- **Vite** 5.4.2 - Build Aracı
- **Tailwind CSS** 3.4.1 - UI Framework
- **Zustand** 4.4.7 - State Management (11 store)
- **React Router** 6.20.1 - Yönlendirme
- **Framer Motion** 10.16.16 - Animasyonlar
- **Recharts** 2.8.0 - Grafikler
- **React Hook Form** 7.48.2 - Form Yönetimi
- **dnd-kit** - Drag & Drop Sistemi

### Backend
- **Supabase** - Full-Stack Backend
  - PostgreSQL Veritabanı
  - JWT Kimlik Doğrulaması
  - Row-Level Security (RLS)
  - Real-time Abonelikler
  - Storage Buckets
  - Edge Functions

### Blockchain
- **ethers.js** 5.7.2 - Web3 Kütüphanesi
- **ReefChain** - EVM-Compatible Blockchain
  - Chain ID: 0x3441 (13377)
  - RPC: https://rpc.reefscan.com
  - Explorer: https://reefscan.com

### Desteklenen Diller
- 🇹🇷 Turkish (TR)
- 🇬🇧 English (EN)
- 🇩🇪 German (DE)
- 🇫🇷 French (FR)

---

## 👥 Kullanıcı Rolleri (11 Rol)

| Rol | Açıklama | Erişim Seviyesi |
|-----|----------|-----------------|
| **superadmin** | Tam sistem erişimi | ⭐⭐⭐⭐⭐ |
| **admin** | Platform yönetimi | ⭐⭐⭐⭐ |
| **carbon_provider** | Karbon kredi sağlayıcısı | ⭐⭐⭐ |
| **verifier** | Proje doğrulayıcı | ⭐⭐⭐ |
| **advisor** | Yatırım danışmanı | ⭐⭐⭐ |
| **ngo** | Çevresel proje yönetimi | ⭐⭐⭐ |
| **institutional_investor** | Kurumsal yatırımcı | ⭐⭐⭐ |
| **pro_investor** | Profesyonel yatırımcı | ⭐⭐ |
| **free_investor** | Temel yatırımcı | ⭐⭐ |
| **user** | Düzenli kullanıcı | ⭐ |

### Yatırımcı Tier Sistemi
- **Free Tier**: $0 Minimum
- **Pro Tier**: Daha yüksek limitler, daha iyi ücretler
- **Institutional Tier**: Kurumsal özellikler

### KYC Seviyeleri
- **Level 1**: Temel kimlik
- **Level 2**: Orta seviye doğrulama
- **Level 3**: Tam kurumsal doğrulama

---

## ✨ Temel Özellikler

### ✅ Aşama 1 (Tamamlandı)
- [x] Supabase backend RLS ile
- [x] JWT kimlik doğrulaması
- [x] 11 kullanıcı rolü & izin sistemi
- [x] 3-seviye KYC sistemi
- [x] Proje tokenleştirme & ticaret
- [x] ICO platformu vesting ile
- [x] Staking sistemi APY'li
- [x] Blog sistemi yorumlarla
- [x] Görsel içerik editörü (10 blok tipi)
- [x] Karbon etkisi takibi
- [x] Multi-dil desteği (TR, EN, DE, FR)
- [x] Yatırımcı tier sistemi
- [x] Admin yönetim panelleri
- [x] Portföy takibi
- [x] Kapsamlı dokümantasyon

### ⏳ Aşama 2 (Devam Ediyor)
- [ ] Smart contract geliştirme (DCB Token, CO2 Token, ICO Contract)
- [ ] Ödeme ağ geçidi (Stripe)
- [ ] Gelişmiş analitikler
- [ ] Video danışma sistemi
- [ ] Mobil uygulama

### 📅 Aşama 3 (Planlanmış)
- [ ] Gelişmiş DeFi özellikleri
- [ ] Cross-chain köprüler
- [ ] DAO yönetim sistemi
- [ ] AI tavsiye motoru

---

## 🚀 Başlangıç Komutları

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (localhost:5173)
npm run dev

# Üretim yapısı oluştur
npm run build

# Üretim yapısını önizle
npm run preview

# Kod kalitesi kontrolü
npm run lint
```

---

## 🔑 Önemli Dosyalar

| Dosya | Amaç |
|-------|------|
| `src/App.tsx` | 30+ rota ile ana yönlendiricisi |
| `src/lib/supabase.ts` | Supabase client başlatma |
| `src/store/authStore.ts` | Kimlik doğrulama state |
| `src/store/walletStore.ts` | Blockchain cüzdanı state |
| `src/types/index.ts` | TypeScript tip tanımları |
| `src/services/blockchainService.ts` | Smart contract etkileşimleri |
| `src/services/permissionService.ts` | İzin yönetimi |
| `src/components/editor/` | Görsel içerik editörü |
| `supabase/migrations/` | Veritabanı şemaları |
| `package.json` | Bağımlılıklar & scripts |
| `vite.config.ts` | Build optimizasyonu |

---

## 📊 Proje İstatistikleri

```
Toplam Dosyalar:        168 (node_modules/dist hariç)
TypeScript/TSX Dosyaları: 115 (81 TSX + 34 TS)
React Bileşenleri:      81
Sayfa Bileşenleri:      30+
Zustand Stores:         11
Servis Modülleri:       6
Custom Hooks:           3
Utility Modülleri:      5
TypeScript Türleri:     40+
Toplam Kod Boyutu:      1.4MB (src)
Veritabanı Migrations:  13
Dokümantasyon:          17 dosya
```

---

## 🌐 Önemli URLs

| URL | Açıklama |
|-----|----------|
| **Dev Server** | http://localhost:5173 |
| **ReefChain RPC** | https://rpc.reefscan.com |
| **ReefChain Explorer** | https://reefscan.com |
| **Supabase Dashboard** | https://app.supabase.com |

---

## 🔐 Ortam Değişkenleri (.env)

```bash
# Supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Blockchain
VITE_WALLET_CONNECT_PROJECT_ID=...
VITE_REEF_CHAIN_RPC=https://rpc.reefscan.com
VITE_REEF_CHAIN_EXPLORER=https://reefscan.com

# Ödeme (Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...

# Analytics (İsteğe Bağlı)
VITE_GOOGLE_ANALYTICS_ID=...
VITE_HOTJAR_ID=...
```

---

## 💾 Veritabanı Yapısı

### Temel Tablolar
- **users** - Kullanıcı hesapları
- **user_roles** - Kullanıcı rolleri
- **user_permissions** - İzin yönetimi
- **projects** - Carbon projeler
- **investments** - Yatırım kayıtları
- **staking_pools** - Staking havuzları
- **blog_posts** - Blog yazıları
- **blog_comments** - Blog yorumları
- **kyc_submissions** - KYC doğrulamaları
- **carbon_offsets** - Karbon offsetleri
- **notifications** - Bildirim sistemi

### Önemli Database Fonksiyonları
- `get_user_effective_permissions()` - İzin kontrolü
- `bulk_update_role_permissions()` - Toplu güncelleme
- `grant_temporary_permission()` - Geçici izin
- `check_and_upgrade_investor_tier()` - Otomatik tier yükseltme
- `calculate_user_carbon_offset()` - Karbon hesaplaması
- `issue_carbon_certificate()` - Sertifika verisi

---

## 🎯 Geliştirme Notları

### Best Practices
1. **TypeScript Kullan** - Tüm yeni kod TypeScript olmalı
2. **Zustand Stores** - State management için Zustand kullan
3. **Service Layer** - Business logic'i servis modüllerine ayır
4. **Components** - Küçük, tekrar kullanılabilir bileşenler yaz
5. **RLS Policies** - Supabase'de her tablo için RLS kuralları
6. **Error Handling** - Tüm async işlemler için error handling ekle
7. **Logging** - Debug ve error için logger.ts'yi kullan
8. **Permissions** - Permission service'i kullanarak access kontrol et

### Kod Kalitesi
- ESLint yapılandırması aktif
- TypeScript strict mode
- Prettier formatting (önerilir)
- 80+ karakterde satır uzunluğu

### Performance
- Code splitting aktif (vendor chunks)
- Lazy loading sayfalar
- Zustand state persistence
- Real-time WebSocket abonelikleri
- Optimized Vite build

---

## 🐛 Sorun Giderme

### Ortak Sorunlar

**Problem**: Supabase bağlantısı başarısız
- **.env dosyasını kontrol et** - VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY doğru mu?
- **Supabase projesi aktif mi?** - Supabase dashboard'da kontrol et

**Problem**: Blockchain işlemleri başarısız
- **MetaMask ağı doğru mu?** - ReefChain (Chain ID: 13377) seçili mi?
- **RPC bağlantısı aktif mi?** - https://rpc.reefscan.com erişilebilir mi?
- **Cüzdan bakiyesi var mı?** - Gas ücreti için yeterli bakiye var mı?

**Problem**: Rol/İzin hatası
- **permissionService.ts'i kontrol et** - Doğru rol/izin kombinasyonu mu?
- **Veritabanı RLS kuralları** - supabase/migrations dosyalarında kontrol et

---

## 📖 Dokümantasyon

- **README.md** - Proje genel bilgileri
- **QUICK_START.md** - Hızlı başlangıç rehberi
- **FRONTEND_ARCHITECTURE.md** - Frontend yapısı
- **DEPLOYMENT_GUIDE.md** - Dağıtım talimatları
- **SUPABASE_SETUP.md** - Supabase kurulumu
- **ROADMAP.md** - Proje yol haritası
- **TEST_GUIDE.md** - Test yazma rehberi
- **TROUBLESHOOTING.md** - Sorun giderme
- **UsersStructure.md** - Kullanıcı yapısı
- **DEMO_ACCOUNTS.md** - Demo hesapları

---

## 📞 İletişim & Destek

Bu dosya **PROJECT_MEMORY.md** olarak proje hafızasını tutar.

**Son Güncelleme**: 2025-10-29
**Proje Durumu**: Aşama 1 Tamamlandı, Aşama 2 Devam Ediyor
**Bakım Eden**: Claude Code

---

> 💡 **Not**: Bu dosya proje hakkında hızlı referans için oluşturulmuştur. Detaylı bilgi için ilgili dokümantasyon dosyalarını kontrol edin.
