# 🚀 LOCALHOST TEST REHBERİ - ŞİMDİ TEST ET!

**Hazır Durum**: ✅ TÜM SERVİSLER ÇALIŞIYOR
**Tarih**: 1 Kasım 2025 - 16:45
**Test Süresi**: 10-15 dakika

---

## ✅ MEVCUT DURUM

### Çalışan Servisler
```
✅ Frontend:  http://localhost:5173  (Vite dev server - HMR active)
✅ Backend:   http://localhost:3002  (Node.js/Express - 28 endpoints)
✅ Database:  MySQL 8.0 (decarbonize_dev) - 3 NGOs, 8 Projects seeded
```

### API Endpoint Test Sonuçları (Az Önce Test Edildi)
```
✅ GET /api/health → Backend running
✅ GET /api/health/db → Database connected (decarbonize_dev)
✅ GET /api/ngo/list → 3 NGOs returned
✅ GET /api/admin/projects/pending → 4 pending projects returned
```

---

## 🎯 TEST ADIMLARI

### 1️⃣ Ana Sayfa Kontrolü (1 dakika)

**Adımlar**:
1. Browser'da aç: **http://localhost:5173**
2. Ana sayfa yüklendi mi kontrol et
3. Navigation menüsünü kontrol et
4. Console'da hata var mı bak (F12 → Console)

**Beklenen Sonuç**:
- ✅ Sayfa hatasız yükleniyor
- ✅ Console'da kritik hata yok
- ✅ Navigation menüsü görünüyor

---

### 2️⃣ NGO Listesi Testi (2 dakika)

**Option A - ProjectSubmissionWizard'da NGO Seçimi**:

1. **Navigate et**: Projects → Submit New Project (veya direkt URL: http://localhost:5173/submit-project)
2. **Form doldur**:
   - Step 1 (Project Details):
     - Title: "Test Solar Project"
     - Description: En az 50 karakter
     - Project Type: Renewable Energy seç
     - Location: "Test Location"
   - Step 2 (Carbon Calculation):
     - Baseline: 10000
     - Project: 1000
     - Method seç
   - Step 3 & 4: Doldur (basit bilgiler)
3. **Step 5'e gel** (NGO Partnership)
4. **KONTROL ET**:
   - ✅ 3 NGO otomatik yüklendi mi?
   - ✅ NGO isimleri görünüyor mu?
     - Green Earth Foundation (Kenya)
     - Carbon Action Network (Brazil)
     - Clean Energy Alliance (India)
   - ✅ Checkbox'lar çalışıyor mu?
   - ✅ Revenue share slider çalışıyor mu?

**Screenshot**: Step 5'teki NGO grid'ini görmelisin (2 sütun)

**Option B - Direkt API Test (Developer Console)**:

1. Browser'da http://localhost:5173 aç
2. F12 → Console
3. Şunu çalıştır:
```javascript
fetch('http://localhost:3002/api/ngo/list')
  .then(r => r.json())
  .then(d => console.log('NGOs:', d))
```
4. **KONTROL ET**:
   - ✅ Console'da 3 NGO görünüyor mu?
   - ✅ `success: true` dönüyor mu?

---

### 3️⃣ Proje Listesi Testi (2 dakika)

**Option A - NGO Project Discovery Sayfası**:

1. **Navigate et**: NGO → Project Discovery (URL: http://localhost:5173/ngo/projects)
2. **KONTROL ET**:
   - ✅ Sayfa yüklendi mi?
   - ✅ 8 proje görünüyor mu?
   - ✅ Proje kartları doğru render ediliyor mu?
   - ✅ Filtreleme çalışıyor mu?
     - Project Type dropdown: renewable_energy, reforestation seç
     - Location input: "Kenya", "Brazil", "India" dene

**Beklenen Projeler**:
```
Pending Admin Review (4):
- Amazon Rainforest Reforestation (Brazil)
- Mangrove Restoration Initiative (Indonesia)
- [2 duplicate entries]

Under Verification (4):
- Solar Farm Expansion in Rural Kenya
- Wind Energy for Rural India
- [2 duplicate entries]
```

**Option B - Direkt API Test**:

F12 → Console:
```javascript
fetch('http://localhost:3002/api/admin/projects/pending')
  .then(r => r.json())
  .then(d => console.log('Projects:', d.count, 'pending projects'))
```
**KONTROL ET**:
- ✅ `count: 4` dönüyor mu?

---

### 4️⃣ Network Tab İncelemesi (2 dakika)

**Adımlar**:
1. F12 → Network tab
2. Sayfayı refresh et (Ctrl+R)
3. **KONTROL ET**:
   - ✅ `/api/ngo/list` request görünüyor mu?
   - ✅ Status: 200 OK mi?
   - ✅ Response time: <20ms mi?
   - ✅ Response'da 3 NGO dönüyor mu?

**İyi Durumda Olması Gereken**:
```
Request URL: http://localhost:3002/api/ngo/list
Status: 200 OK
Response Time: 2-6ms
Response Size: ~2KB
```

---

### 5️⃣ Backend Logs Kontrolü (1 dakika)

**Terminal'de backend log'larını kontrol et**:

Backend terminal'inde şunları göreceksin:
```
[info] GET /api/ngo/list 200 5.906 ms
[info] GET /api/admin/projects/pending 200 10.044 ms
```

**KONTROL ET**:
- ✅ Request'ler loglanıyor mu?
- ✅ 200 status code döndürüyor mu?
- ✅ Response time <50ms mi?
- ✅ Hata log'u yok mu?

---

## 🐛 YAKIN SORUN GİDERME

### Problem 1: "Failed to fetch NGOs"
**Çözüm**:
```bash
# Backend çalışıyor mu kontrol et
curl http://localhost:3002/api/health

# Çalışmıyorsa yeniden başlat:
cd D:/decarbonize/backend
npm run build
node dist/index.js
```

### Problem 2: "Network Error" veya CORS Hatası
**Çözüm**:
- Backend CORS ayarları zaten yapılandırılmış
- API base URL doğru mu kontrol et (src/services/apiClient.ts)
- Backend'in 3002 portunda çalıştığından emin ol

### Problem 3: "No NGOs found"
**Çözüm**:
```bash
# Database'de NGO var mı kontrol et
cd D:/decarbonize/backend
npm run seed

# Sonra backend'i restart et
```

### Problem 4: Frontend Yüklenmiyor
**Çözüm**:
```bash
cd D:/decarbonize
npm run dev

# Port 5173 kullanımda ise:
# Vite otomatik olarak başka port seçer (5174, 5175, vs.)
```

---

## 📊 TEST BAŞARI KRİTERLERİ

**✅ TÜM TESTLER BAŞARILI SAYILIR EĞER**:

1. **Frontend Loading**:
   - [ ] http://localhost:5173 açılıyor
   - [ ] Console'da kritik hata yok
   - [ ] Navigation menüsü görünüyor

2. **NGO Integration**:
   - [ ] ProjectSubmissionWizard Step 5'te 3 NGO görünüyor
   - [ ] NGO isimleri doğru: Green Earth, Carbon Action, Clean Energy
   - [ ] Checkbox selection çalışıyor

3. **Project Integration**:
   - [ ] NGO Project Discovery sayfası açılıyor
   - [ ] 8 proje listeleniyor
   - [ ] Filtreleme çalışıyor

4. **Backend Health**:
   - [ ] API requests 200 OK dönüyor
   - [ ] Response time <50ms
   - [ ] Backend logs temiz (hata yok)

5. **Database Connection**:
   - [ ] /api/health/db başarılı
   - [ ] Seeded data görünüyor

---

## 🎯 ÖNCELİKLİ TEST SENARYOSU (5 Dakika)

**Eğer zamanın kısıtlıysa, sadece bunu yap**:

1. **Browser'da aç**: http://localhost:5173
2. **Console'a yapıştır**:
```javascript
// Test 1: NGO List
fetch('http://localhost:3002/api/ngo/list')
  .then(r => r.json())
  .then(d => console.log('✅ NGOs:', d.count, 'NGOs loaded'))
  .catch(e => console.error('❌ NGO Error:', e))

// Test 2: Projects
fetch('http://localhost:3002/api/admin/projects/pending')
  .then(r => r.json())
  .then(d => console.log('✅ Projects:', d.count, 'projects loaded'))
  .catch(e => console.error('❌ Projects Error:', e))

// Test 3: Database
fetch('http://localhost:3002/api/health/db')
  .then(r => r.json())
  .then(d => console.log('✅ Database:', d.message))
  .catch(e => console.error('❌ DB Error:', e))
```

**Beklenen Console Output**:
```
✅ NGOs: 3 NGOs loaded
✅ Projects: 4 projects loaded
✅ Database: Database connection successful
```

---

## 📝 TEST HESAPLARI (Authentication İçin)

**Hazırda Bekleyen Test Hesapları**:

```
NGO Accounts:
1. contact@greenearthfoundation.org / Password123!
2. info@carbonactionnetwork.org / Password123!
3. hello@cleanenergyalliance.org / Password123!

Provider Account:
4. provider@carboncredits.com / Password123!
```

**Not**: Authentication şu an test edilmiyor (JWT token gerekiyor). Önce yukarıdaki public endpoint'leri test et.

---

## 🎉 TEST BAŞARILI OLUNCA

**Sıradaki adımlar**:
1. ✅ Authentication testi (Login/JWT)
2. ✅ NGO endorsement workflow testi
3. ✅ Project submission testi
4. ✅ Admin panel testi

---

## 📞 HIZLI KOMUTLAR

```bash
# Backend status
curl http://localhost:3002/api/health

# NGO list
curl http://localhost:3002/api/ngo/list

# Pending projects
curl http://localhost:3002/api/admin/projects/pending

# Database health
curl http://localhost:3002/api/health/db

# Backend restart (if needed)
cd D:/decarbonize/backend && npm run build && node dist/index.js

# Frontend restart (if needed)
cd D:/decarbonize && npm run dev

# Re-seed database (if needed)
cd D:/decarbonize/backend && npm run seed
```

---

**HAZIR! ŞİMDİ TEST ET! 🚀**

Browser'ı aç ve http://localhost:5173'e git!
