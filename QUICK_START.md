# ⚡ Decarbonize - Quick Start Guide

**Version**: 3.4.1
**Last Updated**: 7 Kasım 2025
**Status**: ✅ Phase 3.4 Complete - Ready for Testing

---

## 🎯 2 Dakikada Başlat!

### Windows:

```bash
# 1. Database setup (ilk kez)
mysql -u root -p < setup-database.sql

# 2. Her şeyi başlat
start-local.bat
```

### Linux/Mac:

```bash
# 1. Database setup (ilk kez)
mysql -u root -p < setup-database.sql

# 2. Her şeyi başlat
chmod +x start-local.sh
./start-local.sh
```

**İşte bu kadar!** 🎉

Browser otomatik açılır: `http://localhost:5173/projects`

---

## 📁 Dosya Yapısı

```
Decarbonize/
├── 📄 LOCAL_TEST_COMPLETE_GUIDE.md  ← Detaylı guide
├── 📄 QUICK_START.md                 ← Bu dosya
├── 📄 setup-database.sql             ← DB setup script
├── 🔧 start-local.bat                ← Windows starter
├── 🔧 start-local.sh                 ← Linux/Mac starter
├── 📄 .env.local                     ← Frontend config
├── backend/
│   ├── 📄 .env.local                 ← Backend config
│   ├── migrations/                   ← DB migrations (10 files)
│   └── src/                          ← Backend source
└── src/                              ← Frontend source
```

---

## ✅ Gereksinimler

- ✅ Node.js v18+
- ✅ MySQL 8.0+
- ✅ 10 GB boş disk alanı

---

## 🧪 Test Et

1. **Projects Page:** `http://localhost:5173/projects`
2. **Backend API:** `http://localhost:3002/api/projects`
3. **Health Check:** `curl http://localhost:3002/api/projects`

---

## 🆘 Sorun mu var?

👉 **Detaylı guide:** `LOCAL_TEST_COMPLETE_GUIDE.md`

**Hızlı çözümler:**

```bash
# MySQL başlamadı mı?
net start MySQL80  # Windows
brew services start mysql  # Mac

# Port çakışması mı?
netstat -ano | findstr :3002  # Windows
lsof -ti:3002 | xargs kill -9  # Linux/Mac

# Dependencies eksik mi?
cd backend && npm install
cd .. && npm install
```

---

## 🚀 Sonraki Adımlar

Phase 3.4 tamamlandı! ✅

**Sıradaki:** Phase 3.5 - ProjectDetail Integration

---

---

## 🔑 Demo Kullanıcı Hesapları

### **Tüm Kullanıcılar İçin Şifre:** `testuser`

| Email | Role | KYC | Tier | Açıklama |
|-------|------|-----|------|----------|
| superadmin@decarbonize.world | Super Admin | Level 3 | - | Sistem yönetimi |
| admin@decarbonize.world | Admin | Level 2 | - | Platform yönetimi |
| institutional@decarbonize.world | Institutional | Level 3 | Institutional | Kurumsal yatırımcı |
| proinvestor@decarbonize.world | Pro Investor | Level 2 | Pro | Pro yatırımcı |
| freeinvestor@decarbonize.world | Free Investor | Level 1 | Free | Temel yatırımcı |

---

## ✅ Düzeltilen Hatalar

### 1. **Logout Sorunu - ÇÖZÜLDÜ** ✅
- Problem: Çıkış butonuna tıklama çalışmıyordu
- Çözüm: `useNavigate` eklendi, logout sonrası `/` sayfasına yönlendirme yapılıyor
- Test: Profil menüsünden "Çıkış Yap" tıklandığında ana sayfaya yönlendiriliyor

### 2. **Kullanıcı Listesi Boş - ÇÖZÜLDÜ** ✅
- Problem: Kullanıcı yönetimi sayfasında kullanıcılar görünmüyordu
- Çözüm: `dataStore.fetchUsers()` fonksiyonu tüm alanları çekecek şekilde güncellendi
- Test: 10 demo kullanıcı başarıyla görüntüleniyor

---

## 🧪 Test Senaryoları

### Test 1: Logout Fonksiyonu
1. Herhangi bir kullanıcı ile login yapın
2. Sağ üst köşede kullanıcı adına tıklayın
3. "Çıkış Yap" butonuna tıklayın
4. ✅ Ana sayfaya yönlendirilmeli
5. ✅ Oturum kapanmalı

### Test 2: Kullanıcı Yönetimi
1. Admin ile login yapın (admin@decarbonize.world / testuser)
2. Sol menüden "Kullanıcı Yönetimi" seçin
3. ✅ 10 kullanıcı listelenm eli
4. ✅ Her kullanıcıda şunlar görünmeli:
   - Role badge (renkli)
   - KYC status
   - Tier badge (yatırımcılar için)
   - Organization bilgisi

### Test 3: Filtreleme
1. Role filter: "Pro Investor" seçin → 1 kullanıcı
2. KYC filter: "Approved" seçin → 10 kullanıcı
3. Search: "Investment" → 2 kullanıcı

---

## 📊 Database Kontrolü

```sql
-- Kullanıcıları listele
SELECT name, email, role, kyc_status, investor_tier
FROM public.users
WHERE email LIKE '%@decarbonize.world'
ORDER BY created_at DESC;
```

**Beklenen:** 10 kullanıcı

---

## 🚀 Geliştirme

```bash
# Build
npm run build

# Preview
npm run preview
```

---

**Status:** ✅ Ready for Testing
**Build:** ✅ Successful
**Last Updated:** 2025-10-05
