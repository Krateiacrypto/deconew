# DECARBONIZE.world - Global CO₂ Token Platform

DECARBONIZE.world, blockchain teknolojisi ile karbon kredilerini tokenleştirerek sürdürülebilir bir gelecek inşa etmeyi hedefleyen öncü bir platformdur. ReefChain altyapısı üzerinde çalışan platform, karbon nötrleme projelerine erişimi demokratikleştirmekte ve çevre dostu yatırımları teşvik etmektedir.
## 🌍 Proje Hakkında
## 🚀 Özellikler
- **Karbon Kredisi Tokenleştirme**: Geleneksel karbon kredilerinin blockchain üzerinde tokenleştirilmesi
- **ICO Platform**: DCB Token satışı ve yatırımcı yönetimi
- **Proje Yönetimi**: Karbon nötrleme projelerinin listelenmesi ve yönetimi
- **Trading**: Token ve karbon kredisi ticareti
- **Staking**: DCB token staking ve ödül sistemi
- **Blog Sistemi**: İçerik yönetimi ve SEO optimizasyonu
- **Admin Panel**: Kapsamlı yönetim araçları
- **Multi-language**: Türkçe, İngilizce, Almanca, Fransızca desteği
## 🛠️ Teknoloji Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Blockchain**: ReefChain (EVM Compatible)
- **State Management**: Zustand
- **UI Components**: Headless UI, Framer Motion
- **Charts**: Recharts, Chart.js
- **Forms**: React Hook Form
- **Icons**: Lucide React
## 📦 Kurulum
### Gereksinimler
- Node.js 18+
- npm 8+
- Supabase hesabı
### Hızlı Başlangıç
```bash
# Bağımlılıkları yükleyin
npm install

# Development server'ı başlatın
npm run dev
```

Platform `http://localhost:5173` adresinde çalışacaktır.

**📚 Detaylı Kurulum**: [QUICK_START.md](./QUICK_START.md) dosyasına bakın

**🎭 Demo Hesapları**: [DEMO_ACCOUNTS.md](./DEMO_ACCOUNTS.md) dosyasından demo kullanıcı bilgilerine ulaşabilirsiniz
### Supabase Kurulumu
✅ **Supabase zaten yapılandırılmış ve hazır!** Database schema, RLS policies, storage buckets ve seed data tamamlandı.

Detaylar için: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Yeni Özellikler (Phase 1 Complete)
- ✅ **Gerçek Authentication**: Mock auth kaldırıldı, Supabase Auth entegre edildi
- ✅ **Blockchain Entegrasyonu**: ReefChain, wallet connection, token operations
- ✅ **ICO Sistemi**: Token purchase, vesting, whitelist management
- ✅ **Real-time Updates**: Live subscriptions for projects, blogs, notifications
- ✅ **Complete Documentation**: Comprehensive guides and API documentation

**📊 İlerleme Raporu**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
## 🔧 Geliştirme
### Proje Yapısı
```
src/
├── components/          # React bileşenleri
│   ├── admin/          # Admin panel bileşenleri
│   ├── auth/           # Authentication bileşenleri
│   ├── blog/           # Blog sistemi bileşenleri
│   ├── editor/         # Visual editor bileşenleri
│   ├── layout/         # Layout bileşenleri
│   └── wallet/         # Wallet bileşenleri
├── hooks/              # Custom React hooks
├── lib/                # Kütüphane konfigürasyonları
├── pages/              # Sayfa bileşenleri
├── services/           # API servisleri
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Yardımcı fonksiyonlar
```
### Önemli Komutlar
```bash
# Development
npm run dev              # Development server başlat
npm run build           # Production build
npm run preview         # Build'i önizle
npm run lint            # ESLint kontrolü
# Supabase (CLI kuruluysa)
npx supabase start      # Local Supabase başlat
npx supabase stop       # Local Supabase durdur
npx supabase status     # Durum kontrol
npx supabase db reset   # Database reset
```
## 🌐 Deployment
Detaylı deployment rehberi için: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
### Hızlı Deployment (Netlify)
1. GitHub'a push edin
2. Netlify'da "New site from Git" seçin
3. Environment variables ekleyin
4. Deploy edin
### Environment Variables
```bash
# Zorunlu
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
# Opsiyonel
VITE_WALLET_CONNECT_PROJECT_ID=your-walletconnect-id
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```
## 👥 Kullanıcı Rolleri
- **User**: Temel kullanıcı, yatırım yapabilir. Kurumsal ve özel kullanıcı türleri vardır.
- **Advisor**: Projeler Hakkında Danışmanlık hizmetleri verir, danışmanlık ücreti proje bazlı oranlarda belirlenir
- **Verification Org**: Projeleri doğrular, doğrulamalardan komisyon alır
- **NGO**: Çevresel sosyal sorumluluk projeleri yönetir ve oluşturur. Bu projelere bağış yapılabilir. Carbon provider ve Corporate Users projelere sponsor olabilir.
- **Carbon Provider**: Karbon kredisi sağlar, karbon kredilerinin değeri CO2 token ile belirlenir
- **Admin**: Platform yöneticisi
- **Super Admin**: Tam sistem erişimi
## 🔐 Güvenlik
- Row Level Security (RLS) ile veri koruması
- JWT tabanlı authentication
- Role-based access control
- API rate limiting
- Input validation ve sanitization
- HTTPS zorunlu
- Security headers
## 📊 Monitoring
- Supabase Dashboard metrics
- Real-time error tracking
- Performance monitoring
- User analytics
- Database health checks
## 🤝 Katkıda Bulunma
1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın
## 📄 Lisans
Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
## 📞 İletişim
- **Website**: [decarbonize.world](https://decarbonize.world)
- **E-posta**: info@decarbonize.world
- **Twitter**: [@decarbonize_co2](https://twitter.com/decarbonize_co2)
- **LinkedIn**: [DECARBONIZE](https://linkedin.com/company/decarbonize)
## 🙏 Teşekkürler
- [Supabase](https://supabase.com) - Backend infrastructure
- [ReefChain](https://reef.io) - Blockchain platform
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Lucide](https://lucide.dev) - Icon library
---
**DECARBONIZE.world** - Karbon nötrleme ile geleceği şekillendirin 🌱