# 🧪 Local Testing Guide - Decarbonize

**Last Updated**: 30 Ekim 2025
**Status**: Ready for Testing

---

## 📋 Başlamadan Önce

### Gereksinimler
- ✅ Node.js 18+ installed
- ✅ MySQL 8.0+ running
- ✅ Backend setup complete (`npm install` done)
- ✅ Database created and migrated
- ✅ .env.local configured

---

## 🚀 QUICK START - 5 Adım

### Terminal 1: Backend Server'ı Başlat
```bash
cd D:\Decarbonize\backend
npm run build      # Compile TypeScript
node dist/index.js # Start server
```

Server `http://localhost:3001`'de çalışacak.

### Terminal 2: Frontend Server'ı Başlat
```bash
cd D:\Decarbonize
npm run dev        # Vite dev server
```

Frontend `http://localhost:5173`'te çalışacak.

---

## 🧪 TESTING CHECKLIST

### 1️⃣ Backend Health Check

**Terminal 3'te**:

```bash
# Server çalışıyor mu?
curl http://localhost:3001/api/health

# Beklenen response:
{
  "status": "ok",
  "message": "Backend is running",
  "timestamp": "2025-10-30T...",
  "environment": "development"
}
```

**Database bağlantısı çalışıyor mu?**

```bash
curl http://localhost:3001/api/health/db

# Beklenen response:
{
  "status": "ok",
  "message": "Database connection successful",
  "database": "decarbonize_dev",
  "timestamp": "2025-10-30T..."
}
```

---

### 2️⃣ Database Tabloları Kontrol Et

**Terminal 3'te**:

```bash
# MySQL'e bağlan
mysql -u decarbonize -p decarbonize_dev
# Password: Dev123!@#

# Tabloları listele
SHOW TABLES;

# Beklenen çıktı:
# audit_logs
# kyc_profiles
# partnerships
# pending_registrations
# permissions
# roles
# users
```

**Her tabelinin yapısını kontrol et**:

```sql
DESCRIBE users;
DESCRIBE roles;
DESCRIBE permissions;
DESCRIBE kyc_profiles;
DESCRIBE partnerships;
DESCRIBE audit_logs;
DESCRIBE pending_registrations;

-- Örnek veri için
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM roles;
```

**MySQL'den çık**:

```sql
EXIT;
```

---

### 3️⃣ Backend Logs'u Kontrol Et

Backend Terminal'inde aşağıdaki mesajları görmelisin:

```
[2025-10-30 12:00:00] [info] ✅ Database connection successful
[2025-10-30 12:00:01] [info] Server listening on port 3001
```

Hata varsa:
- Database credentials yanlış → `.env.local` kontrol et
- Port kullanımda → `SERVER_PORT=3002` olarak değiştir
- Module bulunamıyor → `npm install` tekrarla

---

### 4️⃣ Frontend'e Bağlanabilir mi?

Browser'de `http://localhost:5173` açıp kontrol et:

- [ ] Sayfa yükleniyor mu?
- [ ] Console'da hata var mı? (F12 → Console tab)
- [ ] Network tab'ında requests başarılı mı?

---

### 5️⃣ API Requests Test Et

**Postman** veya **curl** ile test et:

#### Health Check
```bash
curl -X GET http://localhost:3001/api/health
```

#### Database Health
```bash
curl -X GET http://localhost:3001/api/health/db
```

#### 404 Route (Error Handler Test)
```bash
curl -X GET http://localhost:3001/api/nonexistent
```

---

## 🔧 Development Commands

### Backend

```bash
# Development (watch mode)
cd D:\Decarbonize\backend
npm run dev              # ts-node ile hot reload

# Production build
npm run build           # Compile TS to JS

# Start production build
npm start               # Node ile compiled JS'yi çalıştır

# Database
npm run migrate         # Run migrations
npm run seed            # Seed demo data (coming soon)

# Code quality
npm run lint            # ESLint check
npm run format          # Prettier format
npm test                # Run tests
```

### Frontend

```bash
# Development
cd D:\Decarbonize
npm run dev             # Vite dev server (hot reload)

# Production build
npm run build           # Build for production

# Preview production build
npm run preview         # Preview build locally

# Testing
npm run test            # Run tests
```

---

## 📊 Expected Project Structure

```
D:\Decarbonize\
├── backend/
│   ├── src/
│   │   ├── index.ts          (Express app entry)
│   │   ├── config/
│   │   │   └── database.ts    (MySQL connection)
│   │   ├── migrations/        (SQL files)
│   │   ├── utils/
│   │   │   └── logger.ts      (Winston logger)
│   │   └── types/
│   ├── dist/                  (Compiled JS)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.local
│   └── README.md
│
├── src/                       (React frontend)
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── services/
│   └── types/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🐛 Troubleshooting

### Backend Port Açmıyor

```bash
# Port 3001 kullanımda mı kontrol et
# Windows:
netstat -ano | findstr :3001

# Mac/Linux:
lsof -i :3001

# Port değiştir (.env.local)
SERVER_PORT=3002
```

### Database Bağlantı Hatası

```bash
# Credentials kontrol et
cat D:\Decarbonize\backend\.env.local | grep DB_

# MySQL çalışıyor mu?
mysql -u root -p

# Database var mı?
SHOW DATABASES;

# User var mı?
SELECT user, host FROM mysql.user WHERE user='decarbonize';
```

### Module Not Found Error

```bash
# node_modules'ı yeniden kur
cd D:\Decarbonize\backend
rm -rf node_modules
npm install

# TypeScript compile hatası
npm run build

# Detaylı hata mesajı
npm run build 2>&1 | more
```

### TypeScript Hataları

```bash
# tsconfig.json kontrol et
cat D:\Decarbonize\backend\tsconfig.json | grep -E '"module"|"moduleResolution"'

# Should be:
# "module": "NodeNext"
# "moduleResolution": "nodenext"
```

### Build Yavaş

```bash
# Dist'i temizle
rm -rf D:\Decarbonize\backend\dist

# Rebuild
cd D:\Decarbonize\backend
npm run build
```

---

## 🧪 Advanced Testing

### Database Testing

```sql
-- Yeni user test et
INSERT INTO users (email, password_hash, first_name, last_name, status)
VALUES (
  'test@example.com',
  'hashed_password_here',
  'Test',
  'User',
  'active'
);

-- Sorgu sonuçla
SELECT * FROM users WHERE email='test@example.com';

-- Temizle
DELETE FROM users WHERE email='test@example.com';
```

### API Testing (Postman / Insomnia)

```javascript
// Health Check
GET http://localhost:3001/api/health

// Database Health
GET http://localhost:3001/api/health/db

// Future: Register (when auth is implemented)
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Frontend Testing

```bash
# Open DevTools (F12)
# Console tab → check for errors
# Network tab → check API calls
# Application tab → check localStorage/cookies

# Test with different screen sizes
# Responsive Design Mode (F12 → Ctrl+Shift+M)
```

---

## 📈 Performance Testing

```bash
# Backend startup time
time npm run dev

# Build time
time npm run build

# API response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/health
```

---

## ✅ Pre-Deployment Checklist

- [ ] Backend health check ✅
- [ ] Database health check ✅
- [ ] All 7 tables created ✅
- [ ] No console errors ✅
- [ ] No TypeScript errors ✅
- [ ] API endpoints responding ✅
- [ ] Frontend loads ✅
- [ ] Database credentials secure ✅
- [ ] Environment variables set ✅
- [ ] No hardcoded secrets ✅

---

## 🔐 Security Notes for Testing

- ⚠️ `.env.local` **NOT** in git
- ⚠️ Never commit passwords
- ⚠️ Test credentials are for DEV only
- ⚠️ Change credentials in PRODUCTION
- ⚠️ Use strong passwords in production

---

## 📞 Quick Reference

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Ready |
| Backend API | http://localhost:3001 | ✅ Ready |
| API Health | http://localhost:3001/api/health | ✅ Ready |
| MySQL | localhost:3306 | ✅ Ready |

---

## 🎯 Next Steps

1. **Run Backend**: `npm run build && node dist/index.js`
2. **Run Frontend**: `npm run dev`
3. **Test APIs**: Use curl or Postman
4. **Implement Auth**: Phase 2.3 starting
5. **Add Security**: DOMPurify, ErrorBoundary, 2FA

---

**Status**: All systems ready for testing! 🚀

