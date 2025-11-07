# 📋 MYSQL DATABASE SETUP - ADIM ADIM REHBER

**Tahmini Süre**: 10-15 dakika
**Seviye**: Başlangıç dostu
**Platform**: Windows / macOS / Linux

---

## ADIM 1: MySQL Servisi Çalışıyor mu Kontrol Et

### Windows için:

**Yöntem 1: Services Uygulaması**
1. Tuşla basın: `Windows Tuşu + R`
2. Yaz: `services.msc`
3. Enter'e basın
4. Bul: `MySQL80` (veya `MySQL57`, `MySQL` - versiyona göre)
5. **Status**: `Running` olmalı (Yeşil simge)

Eğer **Running** değilse:
- Sağ tıkla `MySQL80`
- Seç: `Start`
- 5 saniye bekle

**Yöntem 2: Command Prompt (Hızlı)**
1. `Win + R` basın
2. `cmd` yazın
3. Enter'e basın

Terminal açılacak. Test et:
```
mysql --version
```

Sonuç:
```
mysql Ver 8.0.33 for Win64 on x86_64 (MySQL Community Server)
```

Eğer hata alırsan:
- MySQL kurulu değil
- MySQL PATH'e eklenmemiş
- MySQL service çalışmıyor

---

## ADIM 2: MySQL Command Line'ı Aç

### Windows:

1. **Command Prompt Aç**
   - `Win + R` tuşlarını basılı tut
   - `cmd` yaz
   - Enter'e bas
   - Siyah pencere açılacak

2. **MySQL'e Bağlan**

   Terminale yaz:
   ```
   mysql -u root -p
   ```

   Sonra Enter'e bas

3. **Şifre Gir**

   Yazılı gelecek:
   ```
   Enter password:
   ```

   MySQL root şifrenizi yazın (karakterler görünmeyecek)

   Örnek: MySQL kurulum sırasında koyduğunuz şifre

   Enter'e bas

4. **Başarı Kontrol**

   Eğer şöyle yazılırsa başarılı:
   ```
   mysql>
   ```

   Bu prompt MySQL'de olduğunuzu gösterir ✅

---

## ADIM 3: Veritabanı Oluştur

MySQL prompt'unde (`mysql>`) şunu yazın:

```sql
CREATE DATABASE decarbonize_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Kopyala-Yapıştır:**
- Üstteki komutu kopyala (Ctrl + C)
- MySQL'e yapıştır (Ctrl + V)
- Enter'e bas

**Beklenen Sonuç:**
```
Query OK, 1 row affected (0.03 sec)
```

✅ Veritabanı başarıyla oluşturuldu!

---

## ADIM 4: Veritabanı Kullanıcısı Oluştur

MySQL prompt'unde (`mysql>`) şunu yazın:

```sql
CREATE USER 'decarbonize'@'localhost' IDENTIFIED BY 'Dev123!@#';
```

**Kopyala-Yapıştır:**
- Komutu kopyala
- MySQL'e yapıştır
- Enter'e bas

**Beklenen Sonuç:**
```
Query OK, 0 rows affected (0.05 sec)
```

✅ Kullanıcı başarıyla oluşturuldu!

---

## ADIM 5: İzinleri Ver

MySQL prompt'unde (`mysql>`) şunu yazın:

```sql
GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost';
```

**Kopyala-Yapıştır:**
- Komutu kopyala
- MySQL'e yapıştır
- Enter'e bas

**Beklenen Sonuç:**
```
Query OK, 0 rows affected (0.02 sec)
```

✅ İzinler verildi!

---

## ADIM 6: Değişiklikleri Uygula

MySQL prompt'unde (`mysql>`) şunu yazın:

```sql
FLUSH PRIVILEGES;
```

**Kopyala-Yapıştır:**
- Komutu kopyala
- MySQL'e yapıştır
- Enter'e bas

**Beklenen Sonuç:**
```
Query OK, 0 rows affected (0.01 sec)
```

✅ Değişiklikler uygulandı!

---

## ADIM 7: MySQL'den Çık

MySQL prompt'unde (`mysql>`) şunu yazın:

```
EXIT;
```

Veya:
```
QUIT;
```

Enter'e bas

**Beklenen Sonuç:**
```
Bye
```

Ve command prompt'a geri dön:
```
C:\Users\YourName>
```

✅ MySQL'den çıktın!

---

## ADIM 8: Bağlantıyı Test Et

Command prompt'ta (`C:\Users\...>`) şunu yazın:

```
mysql -u decarbonize -p decarbonize_dev
```

Enter'e bas

**Şifre Prompt'u:**
```
Enter password:
```

Şifreyi yazın: `Dev123!@#`

Enter'e bas

**Beklenen Sonuç:**
```
mysql>
```

Bu, yeni kullanıcı ile başarılı bağlandığınız anlamına gelir! ✅

---

## ADIM 9: Tabloları Kontrol Et

MySQL prompt'ta şunu yazın:

```sql
SHOW TABLES;
```

Enter'e bas

**Beklenen Sonuç:**
```
Empty set (0.00 sec)
```

Bu normal - henüz migration'ları çalıştırmadık.

---

## ADIM 10: MySQL'den Çık

```
EXIT;
```

Enter'e bas

---

## ADIM 11: Backend Folder'ına Git

Command prompt'ta:

```
cd D:\Decarbonize\backend
```

Enter'e bas

**Kontrol:**
```
D:\Decarbonize\backend>
```

Bu path'te olduğunuzu gösterir ✅

---

## ADIM 12: Migration'ları Çalıştır

Command prompt'ta (`D:\Decarbonize\backend>`):

```
npm run migrate
```

Enter'e bas

**Beklenen Çıktı:**
```
Running migration: 001_create_users.sql
✅ 001_create_users.sql completed successfully

Running migration: 002_create_roles.sql
✅ 002_create_roles.sql completed successfully

Running migration: 003_create_permissions.sql
✅ 003_create_permissions.sql completed successfully

... (daha 4 tane)

✅ All migrations completed successfully
```

Bu 1-2 dakika sürebilir. Bekle.

**Eğer Hata Alırsan:**

```
Error: ER_ACCESS_DENIED_FOR_USER
```
= Şifre yanlış veya kullanıcı yok

```
Error: ER_BAD_DB_ERROR
```
= Veritabanı yok

Yukarıdaki adımları tekrar kontrol et.

---

## ADIM 13: Backend Sunucusunu Başlat

Command prompt'ta (`D:\Decarbonize\backend>`):

```
npm run dev
```

Enter'e bas

**Beklenen Çıktı:**
```
✅ Server started
📍 Listening on http://localhost:3001
🔧 Environment: development
✅ Ready to accept requests
```

Server çalışıyor! ✅

**NOT:** Bu terminal açık kalmalı. Kapatma!

---

## ADIM 14: Backend'i Test Et

**YENİ bir Command Prompt Aç** (eskisini kapalı bırak):

1. `Win + R`
2. `cmd`
3. Enter

Yeni terminal açılacak.

Yazı:
```
curl http://localhost:3001/api/health
```

Enter'e bas

**Beklenen Sonuç:**
```json
{"status":"ok","message":"Backend is running","timestamp":"2025-10-29T...","environment":"development"}
```

✅ Backend çalışıyor!

---

## ADIM 15: Database Health Check

Aynı terminal'de:

```
curl http://localhost:3001/api/health/db
```

Enter'e bas

**Beklenen Sonuç:**
```json
{"status":"ok","message":"Database connection successful","database":"decarbonize_dev","timestamp":"2025-10-29T..."}
```

✅ Database bağlantısı başarılı!

---

## ✅ TAMAMLANDI!

Tebrikler! Aşağıdakiler başarıyla tamamlandı:

| Görev | Durum |
|-------|-------|
| MySQL Database Oluştur | ✅ |
| Kullanıcı Oluştur | ✅ |
| İzinleri Ver | ✅ |
| Migration'ları Çalıştır | ✅ |
| 7 Tablo Oluştur | ✅ |
| Backend Server Başlat | ✅ |
| Health Check Test | ✅ |
| Database Connection Test | ✅ |

---

## 📊 Veritabanı Kontrol

Eğer veritabanında tablolar var mı kontrol etmek istersen:

Yeni command prompt'ta:

```
mysql -u decarbonize -p decarbonize_dev
```

Şifre: `Dev123!@#`

Sonra:

```sql
SHOW TABLES;
```

**Sonuç (7 tablo görmeli):**
```
+----------------------------+
| Tables_in_decarbonize_dev  |
+----------------------------+
| audit_logs                 |
| kyc_profiles               |
| partnerships               |
| pending_registrations      |
| permissions                |
| roles                       |
| users                      |
+----------------------------+
7 rows in set (0.01 sec)
```

✅ Tüm tablolar oluşturuldu!

---

## 🔐 Sonraki Adımlar

Backend çalışıyor ve database hazır. Şimdi:

1. ✅ Backend server: `http://localhost:3001` (Terminal 1'de çalışıyor)
2. ✅ Database: `decarbonize_dev` (7 tablo, ready)
3. ⏳ Frontend: `http://localhost:5173` (ayrıca çalıştırabilirsin)
4. ⏳ Authentication endpoints (sonraki aşama)

---

## 🐛 Sorun Giderme

### Hata: "Access denied for user 'root'"
**Çözüm:**
- MySQL root şifresi yanlış
- `mysql -u root` (şifresiz) dene
- Veya MySQL'i yeniden kur

### Hata: "Can't connect to MySQL server"
**Çözüm:**
- MySQL service çalışmıyor
- Windows Services'te MySQL80'i start et
- Veya: `net start MySQL80`

### Hata: "Unknown database"
**Çözüm:**
- CREATE DATABASE komutu çalışmadı
- Tekrar çalıştır
- Hata mesajını kontrol et

### Hata: "Unknown user"
**Çözüm:**
- CREATE USER komutu çalışmadı
- Tekrar çalıştır
- Kullanıcı adı doğru mu?

### Backend Error: "ER_ACCESS_DENIED"
**Çözüm:**
- Şifre yanlış (.env.local kontrol et)
- Kullanıcı izinleri yok (GRANT tekrar çalıştır)

### Backend Error: "Unknown database"
**Çözüm:**
- Database adı yanlış
- CREATE DATABASE'i tekrar çalıştır

---

## 📱 Komut Özeti (Hızlı Referans)

### MySQL Setup
```sql
CREATE DATABASE decarbonize_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'decarbonize'@'localhost' IDENTIFIED BY 'Dev123!@#';
GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost';
FLUSH PRIVILEGES;
```

### Test Commands
```bash
# MySQL'e bağlan
mysql -u decarbonize -p decarbonize_dev

# Tabloları göster
SHOW TABLES;

# Exit
EXIT;
```

### Backend Commands
```bash
# Backend folder'ına git
cd D:\Decarbonize\backend

# Migration'ları çalıştır
npm run migrate

# Backend başlat
npm run dev

# Test et (başka terminal'de)
curl http://localhost:3001/api/health
curl http://localhost:3001/api/health/db
```

---

## ⏱️ ZAMAN TAHMİNİ

| Görev | Süre |
|-------|------|
| MySQL Check | 1 min |
| Database Create | 1 min |
| User Create | 1 min |
| Privileges | 1 min |
| Connection Test | 1 min |
| Migrations Run | 2 min |
| Backend Start | 1 min |
| Health Check | 1 min |
| **TOPLAM** | **~10 dakika** |

---

## ✨ Sonuç

Tamamladığında:
- ✅ MySQL 8.0+ çalışıyor
- ✅ decarbonize_dev database var
- ✅ decarbonize user oluşturuldu
- ✅ 7 tablo migrated
- ✅ Backend http://localhost:3001'de çalışıyor
- ✅ Database bağlantısı başarılı

**Şu anda:**
- Terminal 1: Backend sunucusu çalışıyor
- Terminal 2: Test komutları çalıştırabilisin
- Terminal 3: Başka görevler için açık

Devamını söyle - Authentication endpoints kodlamaya geçebiliriz! 🚀

---

**Version**: 1.0
**Last Updated**: 29 Ekim 2025
**Difficulty**: Beginner Friendly ✅
