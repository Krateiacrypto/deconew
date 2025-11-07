# 🚀 QUICK COMMANDS - Copy & Paste Ready

---

## 📋 Terminal Setup (3 Terminal Aç)

### Terminal 1: BACKEND
```bash
cd D:\Decarbonize\backend
npm run build
node dist/index.js
```

### Terminal 2: FRONTEND
```bash
cd D:\Decarbonize
npm run dev
```

### Terminal 3: TESTING (Curl Commands)
```bash
# Health check
curl http://localhost:3001/api/health

# Database health
curl http://localhost:3001/api/health/db

# With pretty JSON
curl -s http://localhost:3001/api/health | jq .
```

---

## ✅ QUICK VERIFICATION (Copy-Paste All)

### Backend Check
```bash
# 1. Backend running?
curl -s http://localhost:3001/api/health | jq .status

# 2. Database connected?
curl -s http://localhost:3001/api/health/db | jq .status

# Both should return: "ok"
```

### Database Check
```bash
# 1. Login
mysql -u decarbonize -p decarbonize_dev
# Password: Dev123!@#

# 2. Check tables (paste this entire block)
SHOW TABLES;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema='decarbonize_dev';

# 3. Exit
EXIT;
```

### Frontend Check
Open browser: `http://localhost:5173`
- No errors in Console (F12)
- Page loads

---

## 🔧 Common Operations

### Build Backend
```bash
cd D:\Decarbonize\backend && npm run build
```

### Run Backend
```bash
cd D:\Decarbonize\backend && node dist/index.js
```

### Run Frontend
```bash
cd D:\Decarbonize && npm run dev
```

### Run Migrations
```bash
cd D:\Decarbonize\backend && npm run migrate
```

### Clean & Rebuild
```bash
cd D:\Decarbonize\backend
rm -rf dist node_modules
npm install
npm run build
node dist/index.js
```

---

## 🧪 API Testing (curl)

### All endpoints
```bash
# Health
curl http://localhost:3001/api/health

# DB Health
curl http://localhost:3001/api/health/db

# 404 Test
curl http://localhost:3001/api/nonexistent

# With verbose
curl -v http://localhost:3001/api/health
```

---

## 📊 Database Queries

### Login to MySQL
```bash
mysql -u decarbonize -p decarbonize_dev
# Password: Dev123!@#
```

### Show all tables
```sql
SHOW TABLES;
```

### Check table structure
```sql
DESCRIBE users;
DESCRIBE roles;
DESCRIBE permissions;
DESCRIBE kyc_profiles;
DESCRIBE partnerships;
DESCRIBE audit_logs;
DESCRIBE pending_registrations;
```

### Count records
```sql
SELECT COUNT(*) as total FROM users;
SELECT COUNT(*) as total FROM roles;
```

### Exit MySQL
```sql
EXIT;
```

---

## 🐛 Troubleshooting Commands

### Port in use?
```bash
netstat -ano | findstr :3001
```

### Check MySQL running
```bash
mysql -u root -p
# If works, MySQL is running
EXIT;
```

### Check Node version
```bash
node --version
# Should be v18+
```

### Check npm version
```bash
npm --version
# Should be v8+
```

### Check all dependencies
```bash
cd D:\Decarbonize\backend
npm list | head -20
```

### TypeScript compile check
```bash
cd D:\Decarbonize\backend
npm run build 2>&1 | head -20
```

---

## 📌 Essential Credentials

**Database**:
- User: `decarbonize`
- Password: `Dev123!@#`
- Database: `decarbonize_dev`
- Host: `localhost`
- Port: `3306`

**Backend**:
- URL: `http://localhost:3001`
- Health: `http://localhost:3001/api/health`

**Frontend**:
- URL: `http://localhost:5173`

---

## 🎯 3-Step Test

### Step 1: Build
```bash
cd D:\Decarbonize\backend && npm run build
```

### Step 2: Start Backend
```bash
node D:\Decarbonize\backend\dist\index.js
```

### Step 3: Test
```bash
curl http://localhost:3001/api/health
```

Expected: `"status":"ok"`

---

## 🚀 Development Workflow

```bash
# 1. Change code
# Edit src/index.ts or other files

# 2. Rebuild
cd D:\Decarbonize\backend && npm run build

# 3. Restart backend
# Kill old process (Ctrl+C) and restart

# 4. Test
curl http://localhost:3001/api/health
```

---

## 📝 Log Checking

### Backend logs
Look at Terminal 1 where backend is running

### Frontend logs
Browser Console (F12 → Console tab)

### Error logs
```bash
# If using pm2
pm2 logs

# Or file-based
cat D:\Decarbonize\backend\logs\error.log
tail -f D:\Decarbonize\backend\logs\combined.log
```

---

## 🔒 Security Check

### Verify .env.local not in git
```bash
cd D:\Decarbonize\backend
cat .gitignore | grep env
# Should contain .env.local
```

### Check credentials not hardcoded
```bash
grep -r "Dev123\|decarbonize" D:\Decarbonize\backend\src\
# Should be empty (only in .env.local)
```

---

## 💾 Database Backup

```bash
# Export
mysqldump -u decarbonize -p decarbonize_dev > backup.sql
# Password: Dev123!@#

# Import (if needed)
mysql -u decarbonize -p decarbonize_dev < backup.sql
```

---

## 🧹 Clean Up

### Remove node_modules
```bash
cd D:\Decarbonize\backend
rm -rf node_modules
```

### Remove dist
```bash
cd D:\Decarbonize\backend
rm -rf dist
```

### Clear npm cache
```bash
npm cache clean --force
```

### Reinstall everything
```bash
cd D:\Decarbonize\backend
npm install
npm run build
```

---

**Save this file for quick reference!** 📌

