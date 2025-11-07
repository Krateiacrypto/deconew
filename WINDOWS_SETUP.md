# 🚀 Windows Otomatik Kurulum - BAŞLA BURADAN!

**⏱️ Toplam Süre:** 10 dakika
**💻 Platform:** Windows 10/11
**📅 Tarih:** 7 Kasım 2025

---

## ✅ ÖNCE BUNLARI KUR (Tek Sefer)

### 1. Node.js (Gerekli!)
```
https://nodejs.org/
```
- **LTS sürümü** indir (örn: v20.x.x)
- Kur → Next, Next, Finish
- **Test et:** PowerShell'de:
  ```powershell
  node --version
  # v20.x.x görmeli
  ```

### 2. Git (Gerekli!)
```
https://git-scm.com/download/win
```
- 64-bit Windows installer
- Kur → Varsayılan ayarlar
- **Test et:** PowerShell'de:
  ```powershell
  git --version
  # git version 2.x.x görmeli
  ```

### 3. MySQL (Gerekli!)
```
https://dev.mysql.com/downloads/installer/
```
- **mysql-installer-community-8.x.x.msi** indir
- Kur:
  - Setup Type: **Developer Default**
  - Root Password: `Krateia1@` ⚠️ (Tam bu şifre!)
  - Windows Service: MySQL80
  - Execute → Finish

- **Test et:** PowerShell'de:
  ```powershell
  mysql -u root -p
  # Şifre: Krateia1@
  # Giriş yaptıysan: exit
  ```

---

## 🎯 KURULUM (3 Komut!)

### Adım 1: Projeyi İndir

**PowerShell veya CMD'de:**

```powershell
# Masaüstüne git (veya istediğin klasör)
cd C:\Users\%USERNAME%\Desktop

# Projeyi clone et
git clone https://github.com/Krateiacrypto/deconew.git

# Klasöre gir
cd deconew

# Doğru branch'e geç
git checkout claude/continue-project-development-011CUtESrszJEr2o4ndp79hq
```

✅ **Proje indirildi!**

---

### Adım 2: Database Kur

**MySQL Workbench'i aç:**
- Start → MySQL Workbench
- "Local instance MySQL80" tıkla
- Şifre: `Krateia1@`

**Query penceresinde şunu çalıştır:**

```sql
CREATE DATABASE IF NOT EXISTS decarbonize_dev
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'decarbonize'@'localhost'
IDENTIFIED BY 'Krateia1@';

GRANT ALL PRIVILEGES ON decarbonize_dev.*
TO 'decarbonize'@'localhost';

FLUSH PRIVILEGES;
```

- ⚡ İkon'a tıkla (Execute) veya Ctrl+Enter
- ✅ "Query OK" görmeli

**VEYA Komut Satırından:**

```powershell
mysql -u root -p < setup-database.sql
# Şifre: Krateia1@
```

✅ **Database hazır!**

---

### Adım 3: BAŞLAT! 🚀

**Tek komut:**

```powershell
.\start-local.bat
```

**Script şunları yapacak (otomatik):**

```
========================================
   Decarbonize Local Development
========================================

[1/4] Checking MySQL...
✅ MySQL found

[2/4] Testing database connection...
✅ Database ready

[3/4] Starting Backend...
Installing backend dependencies... (2-3 dk)
Running database migrations... (10 saniye)
Building backend... (30 saniye)
✅ Backend started

[4/4] Starting Frontend...
Installing frontend dependencies... (2-3 dk)
✅ Frontend started

========================================
       Decarbonize is running!
========================================

URLs:
  Frontend: http://localhost:5173
  Backend:  http://localhost:3002
  Projects: http://localhost:5173/projects

Press any key to open in browser...
```

**Enter'a bas** → Browser otomatik açılır!

---

## 🎉 TEST ET!

### Browser'da göreceksin:

```
http://localhost:5173/projects
```

**Beklenen:**
- ⏳ "Projeler yükleniyor..." (2 saniye)
- ✅ 4 proje kartı görünür:
  - 🌲 Orman Koruma Projesi
  - ☀️ Yenilenebilir Enerji Projesi
  - 💧 Su Koruma Projesi
  - 🌾 Sürdürülebilir Tarım Projesi

**Test senaryoları:**

1. **Category Filtering:**
   - "Orman Koruma" butonuna tıkla
   - ✅ Sadece orman projeleri gösterilmeli

2. **Search:**
   - Search box'a "solar" yaz
   - ✅ Filtrelenen projeler gösterilmeli

3. **Comparison:**
   - 3 projeyi seç (checkbox)
   - ✅ "Karşılaştır (3)" butonu aktif olmalı

---

## 🔧 SORUN GİDERME

### Problem: "MySQL not found"

**Çözüm:**
```powershell
# MySQL'in PATH'te olup olmadığını kontrol et
where mysql

# Yoksa manuel ekle:
# Sistem → Ortam Değişkenleri → Path
# Ekle: C:\Program Files\MySQL\MySQL Server 8.0\bin
```

---

### Problem: "Database not ready"

**Çözüm 1 - MySQL Workbench:**
- Workbench'i aç
- Query'i tekrar çalıştır (Adım 2)

**Çözüm 2 - PowerShell:**
```powershell
mysql -u root -p < setup-database.sql
```

---

### Problem: Port 3002 veya 5173 kullanımda

**Çözüm:**
```powershell
# Port'u kullanan process'i bul
netstat -ano | findstr :3002
netstat -ano | findstr :5173

# PID'yi not et (en sağdaki sayı)
# Öldür:
taskkill /PID 12345 /F

# Tekrar başlat
.\start-local.bat
```

---

### Problem: Dependencies hatası

**Çözüm:**
```powershell
# Node_modules'leri sil, temiz kurulum
cd deconew
rmdir /s /q node_modules
del package-lock.json
cd backend
rmdir /s /q node_modules
del package-lock.json
cd ..

# Tekrar başlat
.\start-local.bat
```

---

### Problem: Migrations hatası

**Çözüm:**
```powershell
# MySQL Workbench'te database'i sıfırla:
DROP DATABASE decarbonize_dev;
CREATE DATABASE decarbonize_dev;

# Tekrar başlat
.\start-local.bat
```

---

## 🛑 DURDURMA

**Servisleri durdurmak için:**

1. Backend terminal penceresini kapat (veya Ctrl+C)
2. Frontend terminal penceresini kapat (veya Ctrl+C)
3. MySQL'i durdur (opsiyonel):
   ```powershell
   net stop MySQL80
   ```

**Tekrar başlatmak için:**
```powershell
cd deconew
.\start-local.bat
```

---

## 📊 DURUM KONTROLÜ

### Backend çalışıyor mu?

**PowerShell'de test et:**
```powershell
curl http://localhost:3002/api/projects
```

**Beklenen output:**
```json
{"success":true,"count":4,"projects":[...]}
```

---

### Frontend çalışıyor mu?

**Browser'da:**
```
http://localhost:5173
```

Ana sayfa açılmalı.

---

### MySQL çalışıyor mu?

**PowerShell'de:**
```powershell
# Servis durumu
Get-Service MySQL80

# Veya:
net start | findstr MySQL
```

**Görmeli:**
```
MySQL80        Running
```

---

## 📋 HIZLI REFERANS

```powershell
# Projeyi ilk kez kur
cd Desktop
git clone https://github.com/Krateiacrypto/deconew.git
cd deconew
git checkout claude/continue-project-development-011CUtESrszJEr2o4ndp79hq
mysql -u root -p < setup-database.sql
.\start-local.bat

# Her çalıştırmada
cd deconew
.\start-local.bat

# Test URL'leri
http://localhost:5173              # Ana sayfa
http://localhost:5173/projects     # Projeler (BAŞLA BURADAN!)
http://localhost:5173/login        # Login
http://localhost:3002/api/projects # Backend API
```

---

## ✅ BAŞARI KONTROL LİSTESİ

- [ ] Node.js kurulu (v18+)
- [ ] Git kurulu
- [ ] MySQL kurulu ve çalışıyor
- [ ] Proje clone edildi
- [ ] Database oluşturuldu
- [ ] start-local.bat çalıştırıldı
- [ ] Backend başladı (port 3002)
- [ ] Frontend başladı (port 5173)
- [ ] Browser'da projeler görünüyor
- [ ] Category filtering çalışıyor
- [ ] Search çalışıyor

---

## 🎯 SONRAKİ ADIMLAR

Kurulum tamamlandıktan sonra:

1. ✅ **Projects page'i keşfet**
   - Farklı kategorileri dene
   - Search yap
   - 3 proje karşılaştır

2. ✅ **Login page'i test et**
   ```
   http://localhost:5173/login
   ```

3. ✅ **2FA test et** (eğer 2FA aktif kullanıcın varsa)

4. 🚀 **Phase 3.5:** ProjectDetail integration'a geçelim!

---

## 💡 İPUÇLARI

- **İlk başlatma:** 5-10 dakika sürebilir (dependencies yükleme)
- **Sonraki başlatmalar:** 10-15 saniye
- **Terminalleri kapatma:** Backend/Frontend çalışmayı durdurur
- **Hot reload:** Kod değişiklikleri otomatik yüklenir

---

## 🆘 DESTEK

Sorun yaşarsan:

1. **Logs'a bak:**
   - Backend terminal: Hata mesajları gösterir
   - Frontend terminal: Build hataları gösterir
   - Browser Console (F12): JavaScript hataları

2. **Dosyaları kontrol et:**
   ```powershell
   dir backend\.env.local
   dir .env.local
   dir backend\dist
   ```

3. **Temiz başlat:**
   ```powershell
   # Her şeyi kapat
   # Node_modules'leri sil
   # Tekrar start-local.bat
   ```

---

**HAZIRSIN!** 🎉

Şimdi bu adımları takip et ve test et!
