# 🚀 Decarbonize Local Test Guide - Complete Setup

**Updated**: 7 Kasım 2025
**Version**: 3.4.1
**Status**: Phase 3.4 Complete - Ready for Testing

---

## 📋 İçindekiler

1. [Ön Gereksinimler](#ön-gereksinimler)
2. [Database Setup (MySQL)](#database-setup-mysql)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Test Senaryoları](#test-senaryoları)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Ön Gereksinimler

### Kurulu Olması Gerekenler:

```bash
✅ Node.js v18+ (npm ile birlikte)
✅ MySQL 8.0+
✅ Git
✅ Code Editor (VS Code önerilir)
```

### Versiyonları Kontrol Et:

```bash
node --version        # v18.0.0 veya üzeri
npm --version         # 9.0.0 veya üzeri
mysql --version       # 8.0.0 veya üzeri
```

---

## 🗄️ Database Setup (MySQL)

### Adım 1: MySQL Servisini Başlat

**Windows:**
```bash
# MySQL Workbench veya Services'den başlat
# VEYA komut satırından:
net start MySQL80
```

**Mac:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

### Adım 2: Database ve User Oluştur

MySQL'e root olarak giriş yap:

```bash
mysql -u root -p
# Şifrenizi girin
```

Database ve kullanıcı oluştur:

```sql
-- Database oluştur
CREATE DATABASE IF NOT EXISTS decarbonize_dev
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User oluştur (şifre: Krateia1@)
CREATE USER IF NOT EXISTS 'decarbonize'@'localhost'
IDENTIFIED BY 'Krateia1@';

-- Tüm yetkileri ver
GRANT ALL PRIVILEGES ON decarbonize_dev.*
TO 'decarbonize'@'localhost';

FLUSH PRIVILEGES;

-- Çıkış
EXIT;
```

### Adım 3: Test Database Connection

```bash
mysql -u decarbonize -p decarbonize_dev
# Şifre: Krateia1@
```

Başarılı giriş yaptıysanız, database hazır! ✅

---

## 🖥️ Backend Setup

### Adım 1: Backend Klasörüne Git

```bash
cd D:\Decarbonize\backend
# VEYA Linux/Mac:
cd ~/Decarbonize/backend
```

### Adım 2: Dependencies Kur (İlk Kez)

```bash
npm install
```

### Adım 3: Environment Variables Ayarla

`.env.local` dosyası zaten oluşturuldu, kontrol et:

```bash
# Windows:
type .env.local

# Linux/Mac:
cat .env.local
```

**Önemli Ayarlar:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=decarbonize
DB_PASSWORD=Krateia1@
DB_NAME=decarbonize_dev
SERVER_PORT=3002
```

### Adım 4: Database Migrations Çalıştır

```bash
# Tabloları oluştur
npm run migrate

# Başarılı olursa göreceksiniz:
# ✅ Migration 001-initial-schema.sql executed
# ✅ Migration 002-workflow-system.sql executed
# ... (10 migrations)
```

### Adım 5: Test Data Seed (Opsiyonel)

```bash
# Demo projeleri ekle
npm run seed

# VEYA sadece NGO projeleri:
npm run seed:simple
```

### Adım 6: Backend'i Başlat

```bash
# Development mode
npm run dev

# VEYA Production build:
npm run build
npm start
```

**Başarılı başlatma çıktısı:**

```
[2025-11-07 09:00:00] [info] 🚀 Server running on port 3002
[2025-11-07 09:00:00] [info] ✅ Database connected successfully
[2025-11-07 09:00:00] [info] Environment: development
```

### Adım 7: Backend API Test

Yeni terminal'de:

```bash
# Projects endpoint'i test et
curl http://localhost:3002/api/projects

# Başarılı response:
# {
#   "success": true,
#   "count": 4,
#   "projects": [...]
# }
```

✅ Backend hazır!

---

## 🎨 Frontend Setup

### Adım 1: Frontend Klasörüne Git

```bash
cd D:\Decarbonize
# VEYA Linux/Mac:
cd ~/Decarbonize
```

### Adım 2: Dependencies Kur (İlk Kez)

```bash
npm install
```

### Adım 3: Environment Variables Ayarla

`.env.local` dosyası oluştur:

```bash
# Windows:
copy .env.example .env.local

# Linux/Mac:
cp .env.example .env.local
```

**Minimum gerekli ayarlar** (`.env.local`):

```env
# Backend API
VITE_API_URL=http://localhost:3002/api

# Application Settings
VITE_APP_NAME=DECARBONIZE.world
VITE_APP_URL=http://localhost:5173
VITE_ENVIRONMENT=development

# Supabase (authentication için - opsiyonel test için)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Blockchain (opsiyonel)
VITE_REEF_CHAIN_RPC=https://rpc.reefscan.com
VITE_REEF_CHAIN_EXPLORER=https://reefscan.com
```

> **Not:** Supabase olmadan da Projects sayfası çalışır (public endpoint).

### Adım 4: Frontend'i Başlat

```bash
npm run dev
```

**Başarılı başlatma çıktısı:**

```
  VITE v5.4.2  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ Frontend hazır!

---

## 🧪 Test Senaryoları

### Test 1: Projects Page Loading ✅

**URL:** `http://localhost:5173/projects`

**Beklenen Davranış:**
1. ⏳ "Projeler yükleniyor..." loading state görünür (1-2 saniye)
2. ✅ 4 proje kartı render edilir
3. ✅ Her proje kartında:
   - Proje resmi (category'ye göre)
   - Başlık ve açıklama
   - Lokasyon ve tarih
   - İlerleme çubuğu
   - Karbon kredisi miktarı
   - Katılımcı sayısı
   - "Yatırım Yap" butonu

**Ekran Görüntüsü:**
```
┌─────────────────────────────────────────┐
│ Karbon Nötrleme Projeleri               │
│ ┌─────┐ ┌─────┐ ┌─────┐                │
│ │ 🌲  │ │ ☀️  │ │ 💧  │ ← Categories   │
│ └─────┘ └─────┘ └─────┘                │
│                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ Project │ │ Project │ │ Project │   │
│ │   #1    │ │   #2    │ │   #3    │   │
│ └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
```

### Test 2: Category Filtering 🔍

**Adımlar:**
1. "Orman Koruma" kategorisine tıkla
2. Sadece `reforestation` projeleri görünmeli
3. "Yenilenebilir Enerji" kategorisine tıkla
4. Sadece `renewable_energy` projeleri görünmeli
5. "Tümü" kategorisine tıkla
6. Tüm projeler geri gelir

**Kontrol:**
- ✅ URL query parameter değişir: `?category=reforestation`
- ✅ Loading state tekrar çalışır
- ✅ Filtrelenmiş projeler gösterilir

### Test 3: Search Functionality 🔎

**Adımlar:**
1. Search input'a "solar" yaz
2. "Solar" içeren projeler filtrelenir
3. Search'ü temizle
4. Tüm projeler geri gelir

**Kontrol:**
- ✅ Debounce çalışır (1 saniye bekler)
- ✅ Backend'e request gönderilir: `?search=solar`
- ✅ Results dinamik güncellenir

### Test 4: Project Comparison 📊

**Adımlar:**
1. 3 farklı proje kartındaki checkbox'ları işaretle
2. "Karşılaştır (3)" butonuna tıkla
3. Karşılaştırma modal'ı açılır
4. Projelerin side-by-side karşılaştırması gösterilir

**Kontrol:**
- ✅ Maksimum 3 proje seçilebilir
- ✅ 4. projeyi seçmeye çalışınca disabled olur
- ✅ Modal açılır ve kapatılır
- ✅ Seçimler korunur

### Test 5: Advanced Filters (Bonus) 🎛️

**Adımlar:**
1. "Gelişmiş Filtreler" butonuna tıkla
2. Filter panel açılır
3. Fiyat aralığı, progress, verified gibi filtreler ayarlanabilir

**Kontrol:**
- ✅ Panel toggle çalışır
- ✅ Filtreler uygulanır
- ✅ Multiple filtreler kombine edilebilir

---

## 🚨 Troubleshooting

### Problem 1: Backend Başlamıyor

**Hata:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Çözüm:**
```bash
# MySQL servisini kontrol et
# Windows:
net start MySQL80

# Linux/Mac:
sudo systemctl status mysql
brew services list
```

---

### Problem 2: Migration Hatası

**Hata:** `Access denied for user 'decarbonize'@'localhost'`

**Çözüm:**
```sql
-- MySQL'e root olarak gir ve yetkileri düzelt:
mysql -u root -p

GRANT ALL PRIVILEGES ON decarbonize_dev.*
TO 'decarbonize'@'localhost';
FLUSH PRIVILEGES;
```

---

### Problem 3: Frontend Backend'e Bağlanamıyor

**Hata:** `Network Error` veya `Failed to fetch`

**Çözüm:**
1. Backend'in çalıştığını kontrol et:
   ```bash
   curl http://localhost:3002/api/projects
   ```

2. `.env.local` dosyasında `VITE_API_URL` doğru mu?
   ```env
   VITE_API_URL=http://localhost:3002/api
   ```

3. Frontend'i yeniden başlat (env değişiklikleri için):
   ```bash
   # Ctrl+C ile durdur, sonra:
   npm run dev
   ```

---

### Problem 4: "Projeler yükleniyor" Takılı Kalıyor

**Çözüm:**

✅ **BU SORUN ÇÖZÜLDÜ!** (Phase 3.4)

Eğer hala görüyorsanız:
1. Browser console'u aç (F12)
2. Network tab'da `/api/projects` request'ini kontrol et
3. Response'u incele - format doğru mu?

Backend response format:
```json
{
  "success": true,
  "count": 4,
  "projects": [...]
}
```

---

### Problem 5: Port Çakışması

**Hata:** `Port 3002 already in use`

**Çözüm:**
```bash
# Windows:
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3002 | xargs kill -9
```

---

## 📊 Başarılı Test Checklist

- [ ] MySQL database oluşturuldu ve bağlantı çalışıyor
- [ ] Backend migrations başarılı (10/10)
- [ ] Backend `localhost:3002` üzerinde çalışıyor
- [ ] `curl http://localhost:3002/api/projects` → 200 OK
- [ ] Frontend `localhost:5173` üzerinde çalışıyor
- [ ] Projects page açılıyor (`/projects`)
- [ ] Loading state çalışıyor (stuck değil!)
- [ ] 4 proje kartı render ediliyor
- [ ] Category filtering çalışıyor
- [ ] Search functionality çalışıyor
- [ ] Project comparison çalışıyor
- [ ] Console'da kritik hata yok

---

## 🎯 Sonraki Adımlar

Test başarılı olduktan sonra:

1. **Phase 3.5: ProjectDetail Integration**
   - Proje detay sayfası backend bağlantısı
   - Investment flow implementation

2. **Phase 4: Smart Contracts**
   - Blockchain entegrasyonu
   - DCB Token deployment

3. **Phase 5: Production**
   - Production deployment
   - Performance optimization

---

## 💡 Yararlı Komutlar

```bash
# Backend'i durdur
# Ctrl+C (terminal'de)

# Frontend'i durdur
# Ctrl+C (terminal'de)

# MySQL'i durdur
# Windows:
net stop MySQL80

# Tüm node process'leri kapat (emin değilseniz kullanmayın!)
# Windows:
taskkill /F /IM node.exe

# Database'i sıfırla (fresh start)
mysql -u root -p
DROP DATABASE decarbonize_dev;
CREATE DATABASE decarbonize_dev;
exit;
cd backend
npm run migrate
npm run seed
```

---

## 📞 Destek

Sorun yaşarsanız:
1. Bu guide'ı takip edin
2. Browser console'u kontrol edin (F12)
3. Backend logs'u inceleyin
4. GitHub Issues'da arayın

**Happy Testing! 🚀**
