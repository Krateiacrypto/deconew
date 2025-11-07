# 🚀 LOCAL DEVELOPMENT SETUP GUIDE

> **Tarih**: 29 Ekim 2025
> **Amaç**: Decarbonize Backend + Frontend local test ortamı
> **Tahmini Süre**: 30-45 dakika
> **Zorluk**: Orta

---

## ✅ PRE-REQUISITE KONTROL LİSTESİ

### Bilgisayarında Kurulu Olması Gerekenler

```bash
# 1. Node.js 18+ kontrolü
node --version
# Output: v18.x.x veya v20.x.x

# 2. npm kontrolü
npm --version
# Output: 9.x.x veya 10.x.x

# 3. MySQL 8.0+ kontrolü
mysql --version
# Output: mysql Ver 8.0.x

# 4. Git kontrolü
git --version
# Output: git version 2.x.x
```

### Kurulu Değilse İndir

| Yazılım | Link | Notlar |
|---------|------|--------|
| **Node.js** | https://nodejs.org/ | LTS sürüm önerilir (v20) |
| **MySQL** | https://dev.mysql.com/downloads/mysql/ | 8.0+ |
| **Git** | https://git-scm.com/ | |
| **VSCode** (Opsiyonel) | https://code.visualstudio.com/ | Kod editörü |
| **Postman** (Opsiyonel) | https://www.postman.com/ | API testing |

---

## 📁 PROJECT DIRECTORY SETUP

### Mevcut Durum

```
D:\
├── Decarbonize\              ← Frontend React projesi (VAR)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ... (30+ dosya)
│
└── (backend henüz yok)
```

### Hedef Durum

```
D:\
├── Decarbonize\              ← Frontend React projesi
│   ├── src/
│   ├── package.json
│   └── ...
│
└── Decarbonize\backend\      ← Yeni Backend projesi
    ├── src/
    ├── migrations/
    ├── tests/
    ├── package.json
    ├── .env.local
    └── ...
```

---

## 🗄️ STEP 1: MySQL DATABASE SETUP

### 1.1 MySQL Servisini Başlat

**Windows:**
```bash
# MySQL Service'i başlat
net start MySQL80
# veya Services uygulaması açarak MySQL80 servisini başlat
```

**macOS (Homebrew):**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

### 1.2 Veritabanı Oluştur

```bash
# MySQL'e root olarak bağlan
mysql -u root -p
# Şifre iste, gir

# Bu komutları çalıştır:
CREATE DATABASE decarbonize_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'decarbonize'@'localhost' IDENTIFIED BY 'Dev123!@#';
GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost';
FLUSH PRIVILEGES;

# Çıkış yap
EXIT;
```

### 1.3 Veritabanı Bağlantısını Test Et

```bash
mysql -u decarbonize -p decarbonize_dev
# Şifre: Dev123!@#

# Test komutu
SHOW TABLES;
# Output: Empty set (henüz tablo yok)

EXIT;
```

✅ **Tamamlandı**: MySQL database hazırlandı

---

## 🔧 STEP 2: BACKEND PROJECT SETUP

### 2.1 Backend Klasörü Oluştur

```bash
# Windows Command Prompt veya PowerShell
cd D:\Decarbonize

# Backend klasörü oluştur
mkdir backend
cd backend
```

### 2.2 Node.js Projesi Başlat

```bash
# package.json oluştur
npm init -y

# Output:
# {
#   "name": "decarbonize-backend",
#   "version": "1.0.0",
#   "description": "",
#   "main": "dist/index.js",
#   ...
# }
```

### 2.3 TypeScript Yapılandırması

```bash
# TypeScript kurulumu
npm install -D typescript ts-node @types/node

# tsconfig.json oluştur
npx tsc --init

# package.json'da scripts güncelle
```

Şu scriptleri `package.json`'a ekle:

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "ts-node src/migrations/runner.ts",
    "seed": "ts-node src/seeds/seed.ts"
  }
}
```

### 2.4 Temel Bağımlılıkları Kur

```bash
# Express ve HTTP
npm install express cors helmet morgan

# Database
npm install mysql2 sequelize

# Authentication
npm install jsonwebtoken bcryptjs

# Validation
npm install joi express-validator

# Email
npm install nodemailer

# Environment
npm install dotenv

# Logging
npm install winston

# Type definitions
npm install -D @types/express @types/node

# Development tools
npm install -D prettier eslint ts-node
```

### 2.5 Klasör Yapısını Oluştur

```bash
mkdir -p src/{config,controllers,services,models,middleware,routes,utils,types}
mkdir -p migrations
mkdir -p tests
mkdir -p seeds
```

✅ **Tamamlandı**: Backend projesi yapısı hazırlandı

---

## 🔐 STEP 3: ENVIRONMENT VARIABLES

### 3.1 .env.local Dosyası Oluştur

`D:\Decarbonize\backend\.env.local` dosyasını oluştur:

```bash
# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_HOST=localhost
DB_PORT=3306
DB_USER=decarbonize
DB_PASSWORD=Dev123!@#
DB_NAME=decarbonize_dev

# ============================================
# JWT CONFIGURATION
# ============================================
JWT_SECRET=your_super_secret_key_minimum_32_characters_long_here_23456789
JWT_REFRESH_SECRET=your_refresh_secret_key_minimum_32_characters_long_here_23456
JWT_ACCESS_EXPIRY=3600
JWT_REFRESH_EXPIRY=604800

# ============================================
# EMAIL CONFIGURATION
# ============================================
MAIL_FROM=noreply@decarbonize.world
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password

# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
SERVER_PORT=3001
SERVER_HOST=localhost

# ============================================
# FRONTEND URLs
# ============================================
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD_URL=https://decarbonize.world

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=debug

# ============================================
# BLOCKCHAIN (ReefChain)
# ============================================
REEF_CHAIN_RPC=https://rpc.reefscan.com
REEF_CHAIN_EXPLORER=https://reefscan.com
```

**Not**: JWT_SECRET için güçlü bir secret generate et:

```bash
# Linux/macOS
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Windows (PowerShell)
node -e "[System.Convert]::ToHexString([System.Random]::new().NextBytes(32))"
```

### 3.2 .env.example Oluştur

`D:\Decarbonize\backend\.env.example` dosyasını oluştur (değerler boş):

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=decarbonize
DB_PASSWORD=your_password
DB_NAME=decarbonize_dev

JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRY=3600
JWT_REFRESH_EXPIRY=604800

# ... vs
```

✅ **Tamamlandı**: Environment variables hazırlandı

---

## 📝 STEP 4: TEMEL TYPESCRIPT DOSYALARI

### 4.1 Types Dosyası (`src/types/index.ts`)

```typescript
// User types
export type UserRole =
  | 'superadmin'
  | 'admin'
  | 'institutional_investor'
  | 'pro_investor'
  | 'free_investor'
  | 'carbon_provider'
  | 'verifier'
  | 'advisor'
  | 'ngo'
  | 'web_admin'
  | 'user';

export type UserStatus =
  | 'pending_approval'
  | 'email_verified'
  | 'under_review'
  | 'active'
  | 'suspended'
  | 'rejected'
  | 'archived';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | null;
  status: UserStatus;
  kycLevel: 'level_1' | 'level_2' | 'level_3';
  kycStatus: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  phone?: string;
  country?: string;
  language?: 'tr' | 'en' | 'de' | 'fr';
}

export interface JWT {
  sub: string;
  email: string;
  role: UserRole | null;
  roleId: number | null;
  permissions: string[];
  kycLevel: string;
  iat: number;
  exp: number;
}
```

### 4.2 Database Config (`src/config/database.ts`)

```typescript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

export default pool;
```

### 4.3 Express App (`src/index.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Routes (TODO: implement)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

✅ **Tamamlandı**: Temel TypeScript dosyaları oluşturuldu

---

## 🗄️ STEP 5: DATABASE MIGRATIONS

### 5.1 Users Table Migration

`src/migrations/001_create_users.sql`:

```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),

  -- Status
  status ENUM('pending_approval', 'email_verified', 'under_review',
               'active', 'suspended', 'rejected', 'archived')
         DEFAULT 'pending_approval',

  -- Role
  role_id BIGINT,

  -- KYC
  kyc_level ENUM('level_1', 'level_2', 'level_3') DEFAULT 'level_1',
  kyc_status ENUM('pending', 'approved', 'rejected', 'expired', 'under_review')
             DEFAULT 'pending',

  -- Contact
  phone VARCHAR(20),
  country VARCHAR(100),
  language ENUM('tr', 'en', 'de', 'fr') DEFAULT 'tr',

  -- Organization
  organization_name VARCHAR(255),
  organization_type VARCHAR(100),

  -- Blockchain
  wallet_address VARCHAR(255) UNIQUE,

  -- Security
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,

  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_role_id (role_id),
  INDEX idx_created_at (created_at)
);
```

### 5.2 Roles Table Migration

`src/migrations/002_create_roles.sql`:

```sql
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_code VARCHAR(50) UNIQUE NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  permissions JSON,
  restrictions JSON,
  metadata JSON,
  is_system_role BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_role_code (role_code)
);
```

### 5.3 Other Tables

Diğer migration dosyaları benzer şekilde oluştur.

### 5.4 Migration Runner

`src/migrations/runner.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function runMigrations() {
  const migrationsDir = __dirname;
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Running migration: ${file}`);

    try {
      const connection = await pool.getConnection();
      await connection.query(sql);
      connection.release();
      console.log(`✅ ${file} completed`);
    } catch (error) {
      console.error(`❌ ${file} failed:`, error);
    }
  }

  console.log('✅ All migrations completed');
  process.exit(0);
}

runMigrations().catch(console.error);
```

✅ **Tamamlandı**: Database migrations hazırlandı

---

## 🚀 STEP 6: BACKEND SUNUCUSUNU BAŞLAT

### 6.1 Migrasyonları Çalıştır

```bash
cd D:\Decarbonize\backend
npm run migrate
```

**Output:**
```
Running migration: 001_create_users.sql
✅ 001_create_users.sql completed
Running migration: 002_create_roles.sql
✅ 002_create_roles.sql completed
...
✅ All migrations completed
```

### 6.2 Backend Sunucusunu Başlat

```bash
npm run dev
```

**Output:**
```
✅ Server running on http://localhost:3001
```

### 6.3 Health Check

```bash
# Başka bir Terminal'de
curl http://localhost:3001/api/health

# Output:
# {"status":"ok","message":"Backend is running"}
```

✅ **Tamamlandı**: Backend çalışıyor

---

## 🎨 STEP 7: FRONTEND SETUP

### 7.1 Frontend Dependencies

```bash
cd D:\Decarbonize
npm install
```

### 7.2 Frontend'i Backend'e Bağla

`src/lib/api.ts` dosyasını oluştur:

```typescript
// API base URL
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// API helper
export async function apiCall(
  endpoint: string,
  options?: RequestInit
) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
```

### 7.3 Frontend Environment

`D:\Decarbonize\.env.local` güncelle:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SUPABASE_URL=... (existing)
VITE_SUPABASE_ANON_KEY=... (existing)
```

### 7.4 Frontend'i Başlat

```bash
cd D:\Decarbonize
npm run dev
```

**Output:**
```
  VITE v5.4.2  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

✅ **Tamamlandı**: Frontend çalışıyor

---

## 🧪 STEP 8: LOCAL TESTING

### Terminal Layout

```
Terminal 1: Backend          Terminal 2: Frontend         Terminal 3: Test/Utility
┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐
│ cd D:\Decarbonize\backend│ │ cd D:\Decarbonize        │ │ $ curl http://localhost  │
│ npm run dev              │ │ npm run dev              │ │ $ mysql -u decarbonize   │
│                          │ │                          │ │ $ node scripts/seed.ts   │
│ ✅ Backend on :3001      │ │ ✅ Frontend on :5173     │ │                          │
└──────────────────────────┘ └──────────────────────────┘ └──────────────────────────┘
```

### 8.1 Backend Health Check

```bash
curl http://localhost:3001/api/health
# {"status":"ok","message":"Backend is running"}
```

### 8.2 Database Check

```bash
mysql -u decarbonize -p decarbonize_dev
SHOW TABLES;
DESC users;
EXIT;
```

### 8.3 Postman Testing

1. Postman aç
2. New Request oluştur
3. Method: POST
4. URL: `http://localhost:3001/api/auth/register`
5. Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "Test123!@#",
  "firstName": "Test",
  "lastName": "User",
  "country": "Turkey"
}
```
6. Send butonu tıkla

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful. Pending approval.",
  "user_id": 1,
  "status": "pending_approval"
}
```

### 8.4 Frontend Testing

1. Browser'da http://localhost:5173 aç
2. Register page'e git
3. Test user ile kaydol
4. Veritabanında kontrol et

```bash
mysql -u decarbonize -p decarbonize_dev
SELECT * FROM users;
```

✅ **Tamamlandı**: Local testing başarılı

---

## 📋 DEMO USERS (Testing)

### Superadmin Hesapları (Backend'de hardcoded)

Seed file'ında aşağıdaki demo users oluştur:

```sql
INSERT INTO users (email, password_hash, first_name, last_name, status, role_id, kyc_status, is_active)
VALUES
  ('superadmin@decarbonize.world', '$2a$12$...', 'Super', 'Admin', 'active', 1, 'approved', TRUE),
  ('admin@decarbonize.world', '$2a$12$...', 'Admin', 'User', 'active', 2, 'approved', TRUE),
  ('test.user@decarbonize.world', '$2a$12$...', 'Test', 'User', 'active', 10, 'pending', TRUE);
```

Password: `Demo123!@#`

### Test Credentials

| Email | Password | Role | Status |
|-------|----------|------|--------|
| superadmin@decarbonize.world | Demo123!@# | superadmin | active |
| admin@decarbonize.world | Demo123!@# | admin | active |
| investor@decarbonize.world | Demo123!@# | free_investor | active |

---

## 🔍 TROUBLESHOOTING

### Problem: "Cannot connect to MySQL"

```bash
# MySQL'in çalışıp çalışmadığını kontrol et
mysql -u root -p
# Şifre iste

# Veya service durumunu kontrol et (Windows)
Get-Service MySQL80
```

### Problem: "Port 3001 already in use"

```bash
# Başka bir process 3001 portunu kullanıyor
# PORT değiştir .env.local'de:
SERVER_PORT=3002
```

### Problem: "Module not found"

```bash
# Dependencies eksik
cd D:\Decarbonize\backend
npm install
```

### Problem: "JWT secret too short"

```bash
# JWT_SECRET minimum 32 karakter olmalı
# Yeni secret generate et ve .env.local'de güncelle
```

---

## ✅ FINAL CHECKLIST

- [ ] Node.js 18+ kurulu
- [ ] MySQL 8.0+ kurulu ve çalışıyor
- [ ] `D:\Decarbonize\backend` klasörü oluşturuldu
- [ ] `npm install` tamamlandı
- [ ] `.env.local` dolduruldu
- [ ] Database migrations çalıştırıldı
- [ ] Backend `npm run dev` ile çalışıyor
- [ ] Frontend `npm run dev` ile çalışıyor
- [ ] `http://localhost:3001/api/health` çalışıyor
- [ ] `http://localhost:5173` açılıyor
- [ ] Postman ile test register başarılı
- [ ] Database'de user kaydı görünüyor

---

## 🎯 SON ADIMLAR

1. ✅ Local environment hazır
2. 📝 Backend endpoints implement et (Coming Next)
3. 🧪 Postman ile test et
4. 🔗 Frontend entegrasyonunu tamamla
5. 🚀 Production deployment

---

**Son Güncelleme**: 29 Ekim 2025
**Durum**: ✅ READY TO START DEVELOPMENT
