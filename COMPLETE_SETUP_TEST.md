# 🧪 COMPLETE SETUP TEST - Step by Step

**Tarih**: 30 Ekim 2025
**Amaç**: Tüm sistemi local'de test et

---

## 🎯 TEST PLAN

Bu dokümanda sırası ile adımları takip ederek projeyi test edeceksin.

### Aşama 1: Backend Setup Doğrulama (5 dakika)
### Aşama 2: Database Doğrulama (5 dakika)
### Aşama 3: API Testing (10 dakika)
### Aşama 4: Frontend Integration (5 dakika)

**Total Süre**: ~25 dakika

---

## 🔴 AŞAMA 1: BACKEND SETUP DOĞRULAMA

### Adım 1.1: Build'i kontrol et

```bash
cd D:\Decarbonize\backend
npm run build
```

**Beklenen Çıktı**: Hata yok

**Eğer hata varsa**:
```bash
# TypeScript errors
npm run build 2>&1 | grep error

# Module yok
npm install

# tsconfig sorunu
cat tsconfig.json | grep -E "module|moduleResolution"
# Beklenen: "module": "NodeNext", "moduleResolution": "nodenext"
```

---

### Adım 1.2: Server'ı başlat

**Terminal 1'de**:
```bash
cd D:\Decarbonize\backend
node dist/index.js
```

**Beklenen Çıktı**:
```
Server listening on port 3001
✅ Database connection successful
```

**Eğer başlamıyorsa**:
- Port kullanımda → `netstat -ano | findstr :3001`
- Database yok → `mysql -u decarbonize -p decarbonize_dev`
- .env.local yanlış → `cat .env.local | grep DB_`

---

## 🟡 AŞAMA 2: DATABASE DOĞRULAMA

### Adım 2.1: MySQL'e bağlan

**Terminal 2'de**:
```bash
mysql -u decarbonize -p decarbonize_dev
# Password: Dev123!@#
```

**Başarı İşareti**: `mysql>` prompt'u göreceksin

---

### Adım 2.2: Tabloları listele

```sql
SHOW TABLES;
```

**Beklenen Çıktı** (7 tablo):
```
+-----------------------------+
| Tables_in_decarbonize_dev   |
+-----------------------------+
| audit_logs                  |
| kyc_profiles                |
| partnerships                |
| pending_registrations       |
| permissions                 |
| roles                       |
| users                       |
+-----------------------------+
```

---

### Adım 2.3: Her tabelinin yapısını kontrol et

```sql
-- Users table
DESCRIBE users;

-- Beklenen: id, email, password_hash, status, role_id, vb.

-- Roles table
DESCRIBE roles;

-- Permissions table
DESCRIBE permissions;

-- KYC table
DESCRIBE kyc_profiles;

-- Partnerships
DESCRIBE partnerships;

-- Audit Logs
DESCRIBE audit_logs;

-- Pending Registrations
DESCRIBE pending_registrations;
```

---

### Adım 2.4: Veri sayıları kontrol et

```sql
-- Boş mı?
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as role_count FROM roles;
SELECT COUNT(*) as permission_count FROM permissions;
```

**Beklenen Çıktı**: Tüm count 0 veya seed data'dan başka

---

### Adım 2.5: MySQL'den çık

```sql
EXIT;
```

---

## 🟢 AŞAMA 3: API TESTING

### Adım 3.1: Health Check

**Terminal 3'te**:

```bash
# Simple health check
curl http://localhost:3001/api/health

# Pretty print (json formatting)
curl -s http://localhost:3001/api/health | jq .

# With headers
curl -v http://localhost:3001/api/health 2>&1 | grep -E "HTTP|status|message"
```

**Beklenen Çıktı**:
```json
{
  "status": "ok",
  "message": "Backend is running",
  "timestamp": "2025-10-30T...",
  "environment": "development"
}
```

---

### Adım 3.2: Database Health Check

```bash
curl http://localhost:3001/api/health/db

# Pretty print
curl -s http://localhost:3001/api/health/db | jq .
```

**Beklenen Çıktı**:
```json
{
  "status": "ok",
  "message": "Database connection successful",
  "database": "decarbonize_dev",
  "timestamp": "2025-10-30T..."
}
```

---

### Adım 3.3: Error Handling Test

```bash
# 404 route (yok olmayan endpoint)
curl http://localhost:3001/api/nonexistent

# Beklenen: 404 error response

curl http://localhost:3001/api/doesnotexist/hello
```

**Beklenen Çıktı**:
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Route not found",
  "code": "ROUTE_NOT_FOUND"
}
```

---

### Adım 3.4: Response Headers Check

```bash
curl -i http://localhost:3001/api/health
```

**Beklenen Headers**:
```
HTTP/1.1 200 OK
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: ...
```

(Security headers aktif mi?)

---

## 🔵 AŞAMA 4: FRONTEND INTEGRATION

### Adım 4.1: Frontend server başlat

**Terminal 4'te**:
```bash
cd D:\Decarbonize
npm run dev
```

**Beklenen Çıktı**:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

---

### Adım 4.2: Browser'da test et

Browser'da `http://localhost:5173` aç ve kontrol et:

- [ ] Sayfa yükleniyor mu?
- [ ] DevTools F12 → Console tab'ında hata var mı?
- [ ] Network tab'ında requests başarılı mı?
- [ ] Backend'e requests gidiyor mu?

---

### Adım 4.3: Network Requests'i izle

Browser'de F12 → Network tab:

1. `/` (main page) → 200
2. Eğer API call varsa → http://localhost:3001 → 200

---

## ✅ VERIFICATION CHECKLIST

### Backend
- [ ] TypeScript compile başarılı
- [ ] Server port 3001'de çalışıyor
- [ ] Database bağlantısı aktif
- [ ] Health endpoint 200 OK
- [ ] Database health endpoint 200 OK
- [ ] 404 hatası doğru
- [ ] Security headers var

### Database
- [ ] 7 tablo oluşturulmuş
- [ ] Her tabelinin schema doğru
- [ ] Veri boş (seed data henüz yok)
- [ ] User/role/permission tablolar var

### API
- [ ] GET /api/health → 200
- [ ] GET /api/health/db → 200
- [ ] GET /api/nonexistent → 404
- [ ] Content-Type: application/json
- [ ] Response time < 100ms

### Frontend
- [ ] Sayfa yükleniyor
- [ ] Console hatası yok
- [ ] Network requests başarılı
- [ ] Backend'e ulaşabiliyor

---

## 🚨 COMMON ISSUES & FIXES

### "Address already in use :3001"

```bash
# Port boşat
netstat -ano | findstr :3001
# Çıkış: PID'yi not et
taskkill /PID <PID> /F

# Veya port değiştir
# .env.local:
SERVER_PORT=3002
```

### "Cannot connect to database"

```bash
# MySQL çalışıyor mu?
mysql -u root -p

# decarbonize user var mı?
SELECT user, host FROM mysql.user WHERE user='decarbonize';

# Privileges kontrol
SHOW GRANTS FOR 'decarbonize'@'localhost';
```

### "Module not found"

```bash
cd D:\Decarbonize\backend
npm install
npm run build
```

### "TypeScript errors"

```bash
# Check tsconfig
cat tsconfig.json | grep -E "module|moduleResolution"

# Rebuild
rm -rf dist
npm run build

# Check specific error
npm run build 2>&1 | head -20
```

### "Frontend can't reach backend"

```bash
# Check CORS in backend
cat src/index.ts | grep -A 5 "CORS"

# Check .env.local
cat .env.local | grep FRONTEND_URL

# Should be: FRONTEND_URL=http://localhost:5173
```

---

## 🎯 SUCCESS INDICATORS

Aşağıdaki tüm koşullar sağlanırsa setup başarılı:

```
✅ Backend çalışıyor (port 3001)
✅ Database bağlantısı aktif
✅ 7 tablo oluşturulmuş
✅ API endpoints 200 OK
✅ Frontend yükleniyor
✅ Network requests başarılı
✅ Hata yok
✅ Security headers var
```

---

## 📊 Performance Baseline

Bu değerleri not et, sonra karşılaştır:

```
Health endpoint response time: ___ ms
Database health response time: ___ ms
Frontend load time: ___ ms
Server startup time: ___ ms
```

---

## 🔒 Security Checklist

- [ ] .env.local .gitignore'da
- [ ] Credentials hard-coded değil
- [ ] Security headers aktif
- [ ] CORS düzgün ayarlanmış
- [ ] Dev credentials kullanılıyor (production değil)

---

## 📝 NEXT STEPS (After Verification)

1. **Phase 2.3: Authentication**
   - Register endpoint
   - Login endpoint
   - JWT tokens
   - Admin approval

2. **Phase 2.2: Security**
   - DOMPurify
   - ErrorBoundary
   - 2FA

3. **Phase 3: Advanced**
   - Smart contracts
   - Payment gateway
   - Analytics

---

**Status**: Ready for comprehensive testing! 🚀

Tüm adımları takip ettikten sonra rapor hazırla.

