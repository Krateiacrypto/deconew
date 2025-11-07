# DECARBONIZE - "Yakında Başlıyoruz" Landing Page Projesi

Sürdürülebilirlik ve blockchain odaklı bir karbon nötrleme platformu için modern landing page ve admin panel geliştir.

---

## 🎨 TASARIM

### Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Backend:** Supabase (Database, Auth, Storage)
- **Video Player:** React Player
- **Carousel:** Embla Carousel
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

### Tema
- **Renkler:** 
  - Primary: Emerald (#10b981)
  - Secondary: Teal (#0d9488)
  - Dark: Slate (#0f172a, #1e293b)
- **Stil:** Glassmorphism + gradient effects
- **Mode:** Dark mode default
- **Responsive:** Mobile-first, fully responsive

---

## 📱 LANDING PAGE BİLEŞENLERİ

### 1. HERO SECTION
**Özellikler:**
- Full viewport height
- Animated gradient background
- Logo + "Blockchain ile Karbon Nötrleme Devri Başlıyor" tagline
- Countdown timer (launch date'e kadar)
- 2 CTA button: "Erken Erişim Al" + "Whitepaper İndir"
- Scroll indicator (animated arrow)

**Tasarım Detayları:**
- Arka plan: Animated gradient (emerald → teal → sky)
- Grid pattern overlay (opacity: 10%)
- Floating particles (Framer Motion)
- Typography: 6xl/8xl font size, gradient text

---

### 2. CAROUSEL SECTION
**Özellikler:**
- Auto-play (5 saniye interval) + manuel kontrol
- YouTube/Vimeo video embed desteği
- 3 slide tipi: Video, Görsel, İstatistik kartları
- Thumbnail navigation (alt kısımda)
- Touch/swipe mobile desteği
- Admin panelden tamamen yönetilebilir (CRUD)

**Slide Tipleri:**

1. **Video Slide:**
   - YouTube veya Vimeo URL
   - Custom thumbnail (opsiyonel)
   - Başlık ve açıklama overlay
   - Play button hover effect

2. **Görsel Slide:**
   - Full width image
   - Gradient overlay (bottom)
   - Başlık ve açıklama alt kısımda
   - Zoom hover effect

3. **İstatistik Slide:**
   - 3-column grid
   - Her kart: Icon, değer, label
   - Animated counter (scroll'da)
   - Glassmorphism card design

**Data Yapısı:**
```typescript
interface CarouselSlide {
  id: string;
  type: 'video' | 'image' | 'stats';
  title: string;
  description?: string;
  videoUrl?: string;          // YouTube/Vimeo
  videoThumbnail?: string;
  imageUrl?: string;
  stats?: { 
    label: string; 
    value: string; 
    icon: string;  // Lucide icon name
  }[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 3. PROJE ZAMAN PLANI (Timeline/Roadmap)
**Özellikler:**
- Responsive: Horizontal timeline (desktop) / Vertical (mobile)
- Scroll animations (Intersection Observer)
- Progress line indicator
- Milestone phase'leri
- Admin panelden düzenlenebilir

**Önerilen Timeline:**
- **Q4 2024:** Platform Geliştirme
  - Smart contract yazımı
  - Certik audit
  - Testnet deployment
  - Beta platform launch

- **Q1 2025:** Token Lansmanı
  - Token Generation Event (TGE)
  - DEX listing (ReefSwap)
  - İlk 5 yeşil enerji projesi
  - Gold Standard partnership

- **Q2 2025:** İlk Doğrulayıcı Ortaklıklar
  - Verra entegrasyonu
  - 20+ doğrulanmış proje
  - Mobile app beta
  - 1,000+ kullanıcı

- **Q3 2025:** CEX Listingleri
  - Binance/Coinbase başvuru
  - API v2 launch
  - 50+ proje
  - 10,000+ kullanıcı

- **Q4 2025:** Büyüme
  - 100+ proje hedefi
  - Kurumsal partnerships
  - DAO governance
  - Global expansion

**Data Yapısı:**
```typescript
interface TimelinePhase {
  id: string;
  phase: string;              // "Q1 2025"
  title: string;
  description: string;
  milestones: string[];       // Array of milestone strings
  status: 'completed' | 'active' | 'upcoming';
  date: Date;
  icon: string;               // Lucide icon name (e.g., "Rocket", "Code")
  color: string;              // Tailwind color (e.g., "emerald", "teal")
  order: number;
}
```

**Tasarım:**
- Icon circle (16x16, centered)
- Status indicator (border color + glow for active)
- Card: Title, description, milestone list
- Checkmark icons for completed milestones
- Connecting line between phases

---

### 4. NEDEN DECARBONIZE?
**3-Column Layout:**

**Kolon 1 - Problem (Kırmızı Tema):**
- Başlık: "Mevcut Sorunlar"
- Icon: AlertCircle
- Liste:
  - Yüksek giriş bariyerleri ($10k+ minimum)
  - Karmaşık süreçler (6-12 ay doğrulama)
  - Düşük şeffaflık
  - Pahalı aracılar (%30+ fee)

**Kolon 2 - Çözüm (Yeşil Tema, Highlight):**
- Başlık: "Decarbonize Çözümü"
- Icon: Sparkles
- Gradient background
- Liste:
  - Düşük minimum yatırım ($100'dan başlar)
  - Anında tokenizasyon (blockchain)
  - %100 şeffaf (public ledger)
  - Düşük ücretler (%0.1 - %0.25)

**Kolon 3 - Etki (Mavi Tema):**
- Başlık: "Beklenen Etki"
- Icon: Target
- 2x2 grid istatistikler:
  - 1M+ ton CO2e Offset
  - 100+ Yeşil Enerji Projesi
  - 10K+ Aktif Kullanıcı
  - $50M Platform Hacmi
- Animated counters

**İçerik admin panelden düzenlenebilir (rich text editor).**

---

### 5. ERKEN ERİŞİM FORMU

**3 Adımlı Form:**

#### Adım 1 - Kişisel Bilgiler
- **Ad Soyad** (required, text input)
- **E-posta** (required, email validation)
- **Telefon** (optional, phone input with country code)
- **Ülke** (required, dropdown select)

#### Adım 2 - İlgi Alanı
- **Kullanıcı Tipi** (required, radio cards)
  - Bireysel Yatırımcı (icon: User)
  - İşletme Sahibi (icon: Briefcase)
  - Kurumsal Yatırımcı (icon: Building)
  - STK / NGO (icon: Heart)

- **İlgi Alanları** (checkboxes, multiple selection)
  - Staking ve Ödüller
  - Karbon Nötrleme
  - Token Alım-Satım
  - Yeşil Projeler
  - Danışmanlık
  - Sosyal Sorumluluk

- **Bizi Nasıl Duydunuz?** (dropdown)
  - Sosyal Medya
  - Arkadaş Tavsiyesi
  - Google Arama
  - Haber/Medya
  - Etkinlik/Konferans
  - Diğer

#### Adım 3 - Tercihler
- **Erken Kayıt Avantajları** (info card, read-only)
  - 500 Bonus Token (ilk kayıt)
  - %50 işlem ücreti indirimi (ilk 3 ay)
  - Öncelikli erişim yeni özelliklere
  - Özel webinar davetleri

- **Newsletter** (checkbox)
  "Haftalık piyasa analizleri ve platform güncellemeleri"

- **Whitepaper İndir** (checkbox)
  "Detaylı teknik dokümantasyon ve tokenomics"

- **GDPR Onay** (required checkbox)
  "Gizlilik Politikası ve Kullanım Koşulları'nı okudum ve kabul ediyorum"

**Form Özellikleri:**
- Progress indicator (1/3, 2/3, 3/3)
- Real-time validation (Zod schemas)
- İleri/Geri navigation
- Loading state (submit sırasında)
- Success modal:
  - Konfeti animasyonu
  - "Kaydınız Alındı!" mesajı
  - Referral kodu göster
  - "Linki Kopyala" button
  - Email doğrulama hatırlatması

**Data Yapısı:**
```typescript
interface EarlyAccessForm {
  // Step 1
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  
  // Step 2
  userType: 'individual' | 'business' | 'investor' | 'ngo';
  interests: string[];
  hearAboutUs: string;
  
  // Step 3
  newsletter: boolean;
  whitepaperDownload: boolean;
  gdprConsent: boolean;
  
  // Auto-generated
  referralCode?: string;
  referredBy?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  submittedAt: Date;
  emailVerified: boolean;
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Phone: Optional, valid phone number with country code
- GDPR: Must be checked to submit
- At least 1 interest must be selected

**Email Doğrulama:**
- Kayıt sonrası otomatik email gönderilir
- Verification token (24 saat geçerli)
- Click-to-verify link
- Email verified = true olunca bonus token hak edilir

---

### 6. SOSYAL MEDYA ve FOOTER

**Sosyal Media Bölümü:**
- Başlık: "Bizi Takip Edin"
- İkonlar (hover animasyonlar):
  - **Twitter** (icon: Twitter, color: sky-400)
  - **LinkedIn** (icon: Linkedin, color: blue-500)
  - **Telegram** (icon: Send, color: sky-400)
  - **Discord** (icon: MessageSquare, color: indigo-400)
  - **YouTube** (icon: Youtube, color: red-500)
  - **Medium** (icon: BookOpen, color: slate-300)

**Hızlı Newsletter:**
- Email input + "Abone Ol" button
- Inline form (aynı satırda)
- Submit → Supabase'e kaydet

**Footer:**
- Copyright: "© 2024 Decarbonize. Tüm hakları saklıdır."
- Links:
  - Gizlilik Politikası
  - Kullanım Koşulları
  - İletişim
  - Whitepaper

**Tasarım:**
- Dark background (slate-950)
- Border top (slate-800)
- Hover effects (emerald-400 transition)

---

## 🔧 ADMIN PANEL

### Authentication
- **Provider:** Supabase Auth
- **MFA:** Enabled (TOTP)
- **Roles:** 
  - `super_admin` (full access)
  - `content_editor` (content only)

### Layout
- Sidebar navigation (fixed, 256px width)
- Logo + "Decarbonize Admin" başlık
- User dropdown (top right): Profile, Logout
- Dark theme

### Modüller

#### 1. Dashboard (Overview)
**Widgets:**
- **Toplam Kayıt** (card + number)
- **Bugün** (card + trend)
- **Bu Hafta** (card + chart)
- **Dönüşüm Oranı** (card + percentage)

**Charts:**
- Line chart: Günlük kayıt trendi (son 30 gün)
- Pie chart: User type dağılımı
- Bar chart: Referral kaynakları

**Recent Registrations:**
- Tablo (son 10 kayıt)
- Columns: Ad, Email, Tip, Tarih
- Quick actions: View, Email

---

#### 2. Carousel Yönetimi
**Slide Listesi:**
- Card view (thumbnail + details)
- Drag-drop sıralama (order değiştirme)
- Status badge (Aktif/Pasif)
- Type badge (Video/Image/Stats)

**CRUD İşlemleri:**
- **Create:** "Yeni Slide Ekle" button → Dialog
- **Read:** Preview hover
- **Update:** "Düzenle" button → Dialog
- **Delete:** "Sil" button → Confirmation dialog
- **Duplicate:** "Kopyala" button

**Add/Edit Dialog:**
- Slide tipi seçimi (radio)
- Başlık (text input)
- Açıklama (textarea)
- Video URL (text input, YouTube/Vimeo)
  - Auto-generate thumbnail from video
  - Custom thumbnail upload (optional)
- Image upload (file input, drag-drop)
  - Max size: 5MB
  - Allowed: jpg, png, webp
  - Auto-resize: 1920x1080
- Stats editor (array input)
  - Label, Value, Icon seçici
  - Add/Remove stat
- Aktif/Pasif toggle
- Save button

**Preview:**
- Real-time preview (iframe or component)
- Mobile/Desktop view toggle

---

#### 3. Timeline Yönetimi
**Phase Listesi:**
- Timeline view (visual)
- Drag-drop sıralama
- Status indicator (completed/active/upcoming)

**CRUD İşlemleri:**
- Create, Read, Update, Delete
- Duplicate phase

**Add/Edit Dialog:**
- Phase adı (Q1 2025)
- Başlık
- Açıklama (textarea)
- Milestones (array)
  - Add/Remove milestone (text input)
  - Drag-drop reorder
- Tarih (date picker)
- Icon seçici (Lucide icons grid)
- Status dropdown
- Color picker (Tailwind colors)
- Save button

---

#### 4. Early Access Kayıtları
**Filtreler:**
- User type (dropdown: All, Individual, Business, etc.)
- Tarih aralığı (dropdown: 7 gün, 30 gün, 90 gün, Tümü)
- Arama (text input: isim veya email)

**Kayıt Listesi (Tablo):**
- Columns:
  - Ad Soyad
  - E-posta
  - Ülke
  - Tip
  - İlgi Alanları (badges)
  - Tarih
  - Email Doğrulandı (badge)
  - Actions

**Actions:**
- View (modal: tüm form verilerini göster)
- Email gönder (mailto link)
- Delete (confirmation)

**Toplu İşlemler:**
- Seçili kayıtlara email gönder
- Export seçilenleri

**Export:**
- CSV button
- Excel button
- Tüm data veya filtrelenmiş data

**Stats Cards (Üstte):**
- Toplam kayıt
- Bugün (trend icon)
- Bu hafta
- Dönüşüm oranı

---

#### 5. Content Yönetimi
**Neden Decarbonize Bölümü:**
- 3 section editor:
  - Problem section
  - Çözüm section
  - Etki section

**Her Section için:**
- Başlık (text input)
- İçerik (rich text editor: bold, italic, list)
- Save button

**Etki İstatistikleri:**
- 4 stat editor:
  - Label
  - Value
  - Icon seçici
- Add/Remove stat

---

#### 6. Ayarlar (Settings)
**Genel Ayarlar:**
- Site başlığı
- Site açıklaması
- Launch tarihi (date picker, countdown için)
- Email (info@decarbonize.world)
- Telefon

**Sosyal Medya:**
- Twitter URL
- LinkedIn URL
- Telegram URL
- Discord URL
- YouTube URL
- Medium URL

**Email Ayarları (SMTP):**
- SMTP Host
- SMTP Port
- Username
- Password
- From Name
- From Email

**Analytics:**
- Google Analytics ID
- Facebook Pixel ID (optional)

**SEO:**
- Meta title
- Meta description
- OG image upload
- Keywords (comma-separated)

**Save button (her section için)**

---

## 🗄️ SUPABASE DATABASE SCHEMA

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Carousel Slides Table
create table carousel_slides (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('video', 'image', 'stats')),
  title text not null,
  description text,
  video_url text,
  video_thumbnail text,
  image_url text,
  stats jsonb,
  order_index int not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Timeline Phases Table
create table timeline_phases (
  id uuid primary key default uuid_generate_v4(),
  phase text not null,
  title text not null,
  description text not null,
  milestones text[] not null,
  status text not null check (status in ('completed', 'active', 'upcoming')),
  phase_date date not null,
  icon text not null,
  color text not null,
  order_index int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Early Access Registrations Table
create table early_access_registrations (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  phone text,
  country text not null,
  user_type text not null check (user_type in ('individual', 'business', 'investor', 'ngo')),
  interests text[] not null,
  hear_about_us text,
  newsletter boolean default false,
  whitepaper_download boolean default false,
  gdpr_consent boolean not null,
  referral_code text unique not null,
  referred_by text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  email_verified boolean default false,
  verification_token text unique,
  verification_sent_at timestamp with time zone,
  verified_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Content Settings Table
create table content_settings (
  id uuid primary key default uuid_generate_v4(),
  section text unique not null,
  title text not null,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Site Settings Table
create table site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_carousel_slides_order on carousel_slides(order_index);
create index idx_carousel_slides_active on carousel_slides(is_active);
create index idx_timeline_phases_order on timeline_phases(order_index);
create index idx_timeline_phases_status on timeline_phases(status);
create index idx_registrations_email on early_access_registrations(email);
create index idx_registrations_referral on early_access_registrations(referral_code);
create index idx_registrations_created on early_access_registrations(created_at);

-- RLS (Row Level Security) Policies
alter table carousel_slides enable row level security;
alter table timeline_phases enable row level security;
alter table early_access_registrations enable row level security;
alter table content_settings enable row level security;
alter table site_settings enable row level security;

-- Public read access for landing page
create policy "Public can read active carousel slides"
  on carousel_slides for select
  using (is_active = true);

create policy "Public can read timeline phases"
  on timeline_phases for select
  using (true);

-- Admin full access (requires authentication)
create policy "Admins can do everything on carousel_slides"
  on carousel_slides for all
  using (auth.role() = 'authenticated');

create policy "Admins can do everything on timeline_phases"
  on timeline_phases for all
  using (auth.role() = 'authenticated');

create policy "Admins can read registrations"
  on early_access_registrations for select
  using (auth.role() = 'authenticated');

-- Public can insert registrations (form submission)
create policy "Public can insert registrations"
  on early_access_registrations for insert
  with check (true);

-- Functions
-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger update_carousel_slides_updated_at before update on carousel_slides
  for each row execute procedure update_updated_at_column();

create trigger update_timeline_phases_updated_at before update on timeline_phases
  for each row execute procedure update_updated_at_column();

create trigger update_content_settings_updated_at before update on content_settings
  for each row execute procedure update_updated_at_column();

create trigger update_site_settings_updated_at before update on site_settings
  for each row execute procedure update_updated_at_column();
```

---

## ✨ ÖZELLİKLER ve GEREKSİNİMLER

### Animasyonlar (Framer Motion)
- Smooth scroll behavior
- Fade-in on scroll (viewport entry)
- Scale on hover (buttons, cards)
- Slide transitions (carousel)
- Confetti animation (success)
- Loading spinners
- Toast notifications (success/error)

### SEO Optimizasyonu
- **Metadata:**
  - Title: "Decarbonize - Blockchain ile Karbon Nötrleme"
  - Description: "Yeşil enerji projelerinden karbon kredisi tokenizasyonu..."
  - Keywords: karbon kredisi, blockchain, sürdürülebilirlik...
  - OG Tags (Open Graph)
  - Twitter Cards
  
- **Technical:**
  - Sitemap.xml
  - Robots.txt
  - Canonical URLs
  - Structured data (JSON-LD)

### Performance
- Next.js Image component (automatic optimization)
- Lazy loading (images, components below fold)
- Code splitting (dynamic imports)
- Font optimization (next/font)
- Compression (gzip/brotli)
- **Target:** < 3 seconds initial load

### Accessibility (A11y)
- WCAG 2.1 AA compliance
- Semantic HTML
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader friendly
- ARIA labels
- Focus indicators
- Alt text for images
- Color contrast ratios (4.5:1 minimum)

### Güvenlik
- **Rate Limiting:**
  - Form submissions: 3 per IP per hour
  - API endpoints: 100 requests per IP per minute
  
- **Protection:**
  - CSRF tokens (Supabase handles)
  - XSS prevention (React auto-escapes)
  - SQL injection protection (Supabase RLS)
  - Content Security Policy (CSP) headers
  
- **Validation:**
  - Client-side (Zod)
  - Server-side (Supabase functions)
  - Email verification
  - CAPTCHA (optional, for high traffic)

### Analytics
- Google Analytics 4
- Event tracking:
  - Page views
  - Button clicks (CTAs)
  - Form starts/completions
  - Video plays
  - Download whitepaper
  - Social media clicks
  - Scroll depth

---

## 🚀 ÖNCELİK SIRASI (Development Roadmap)

### Phase 1: Foundation (Week 1)
1. Next.js project setup + TypeScript config
2. Tailwind CSS + shadcn/ui installation
3. Supabase project creation + database schema
4. Landing page basic structure (layout, header, footer)
5. Hero section implementation

### Phase 2: Core Components (Week 2)
6. Carousel implementation (all 3 types)
7. Timeline/Roadmap section
8. "Neden Decarbonize" section
9. Social media + footer links

### Phase 3: Form & Backend (Week 3)
10. Early access form (3-step wizard)
11. Zod validation schemas
12. Supabase integration (form submission)
13. Email verification system
14. Referral code generation

### Phase 4: Admin Panel (Week 4)
15. Admin authentication (Supabase Auth + MFA)
16. Admin layout + navigation
17. Dashboard (stats + charts)
18. Carousel management (CRUD)

### Phase 5: Admin Completion (Week 5)
19. Timeline management (CRUD)
20. Early access registrations view
21. Export functionality (CSV, Excel)
22. Content management (rich text editor)
23. Settings page

### Phase 6: Polish & Deploy (Week 6)
24. Animations (Framer Motion)
25. SEO optimization
26. Performance optimization
27. Accessibility audit
28. Testing (E2E, unit)
29. Deployment (Vercel)
30. Documentation

---

## 📦 TESLIM EDİLECEKLER

### Code Repository
- ✅ Tam çalışır Next.js projesi
- ✅ TypeScript strict mode
- ✅ Clean code (ESLint, Prettier)
- ✅ Component structure (modular)
- ✅ Git history (meaningful commits)

### Database
- ✅ Supabase migration files
- ✅ Seed data (example slides, phases)
- ✅ RLS policies configured
- ✅ Backup strategy

### Documentation
- ✅ **README.md**
  - Project overview
  - Tech stack
  - Installation instructions
  - Environment variables
  - Development commands
  - Deployment guide
  
- ✅ **.env.example**
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  NEXT_PUBLIC_GA_ID=your_google_analytics_id
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your_email
  SMTP_PASSWORD=your_password
  ```

- ✅ **DEPLOYMENT.md**
  - Vercel deployment steps
  - Environment setup
  - Domain configuration
  - SSL certificate
  - Supabase production setup

- ✅ **USER_GUIDE.md** (Admin Panel)
  - How to add carousel slides
  - How to edit timeline
  - How to manage registrations
  - How to export data

### Testing
- ✅ E2E tests (Playwright)
- ✅ Unit tests (Vitest/Jest)
- ✅ Component tests (React Testing Library)
- ✅ Accessibility tests (axe-core)

### Assets
- ✅ Logo files (SVG, PNG)
- ✅ Favicon (all sizes)
- ✅ OG images
- ✅ Sample carousel images/videos

---

## 🎯 ÖNGÖRÜLEn ÖZELLIKLER ve İYILEŞTIRMELER

### v1.1 (Sonraki Sprint)
- [ ] Blog section (CMS integration)
- [ ] FAQ accordion
- [ ] Team section (founders, advisors)
- [ ] Partners/Logos section
- [ ] Live chat widget (Intercom/Crisp)

### v1.2 (Gelecek)
- [ ] Multi-language support (TR/EN)
- [ ] Advanced analytics (Mixpanel)
- [ ] A/B testing (form variations)
- [ ] Email campaign integration (Mailchimp)
- [ ] SMS notifications (Twilio)

### v2.0 (Long-term)
- [ ] Mobile app (React Native)
- [ ] Waitlist ranking system
- [ ] Referral leaderboard
- [ ] Early access tier system (VIP, Gold, Silver)
- [ ] Gamification (badges, points)

---

## 📞 SUPPORT & CONTACT

**Project Name:** Decarbonize Landing Page  
**Version:** 1.0.0  
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase  
**Deployment:** Vercel  
**License:** Proprietary  

---

**Notlar:**
- Bu prompt ile modern, profesyonel ve tam fonksiyonel bir landing page + admin panel oluştur.
- Tüm best practices'leri uygula (TypeScript, ESLint, Prettier, Git).
- Mobile-first ve accessibility'yi unutma.
- Performance ve SEO optimizasyonunu önceliklendır.
- Clean, maintainable, ve scalable kod yaz.

---

**Son Güncelleme:** 2024-11-01  
**Hazırlayan:** Decarbonize Team