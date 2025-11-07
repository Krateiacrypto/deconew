# 🚀 Decarbonize - Production Deployment Guide

**Last Updated**: 7 Kasım 2025
**Version**: 3.6.0

---

## 📋 Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **CPU**: 4+ cores recommended
- **RAM**: 8GB+ minimum, 16GB+ recommended
- **Storage**: 50GB+ SSD storage
- **Network**: Static IP address and domain name

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for build process)
- MySQL 8.0+
- Nginx 1.18+
- SSL Certificate (Let's Encrypt recommended)

---

## 🔐 Step 1: Environment Configuration

### 1.1 Copy Environment Template
```bash
cp .env.production.template .env.production
```

### 1.2 Configure Environment Variables

Edit `.env.production` and fill in:

**Critical Variables**:
```bash
# Database
DB_HOST=your-production-db-host
DB_PASSWORD=strong-password-here

# JWT Secrets (generate with: openssl rand -base64 64)
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Domain
FRONTEND_URL=https://yourdomain.com
```

**Generate Secure Keys**:
```bash
# JWT Secret
openssl rand -base64 64

# Encryption Key
openssl rand -base64 32

# Session Secret
openssl rand -base64 32
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Create Production Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE decarbonize_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'decarbonize_prod'@'%' IDENTIFIED BY 'your-strong-password';
GRANT ALL PRIVILEGES ON decarbonize_production.* TO 'decarbonize_prod'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### 2.2 Run Migrations

```bash
cd backend
npm run migrate:prod
```

### 2.3 Verify Database

```bash
# Run migration check script
./backend/check-migrations.sh
```

---

## 🧪 Step 3: Testing

### Run API Test Suite

```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

---

## 📞 Support

For deployment issues:
- GitHub Issues: https://github.com/Krateiacrypto/deconew/issues
- Documentation: Check CLAUDE.md for latest updates

---

**Version**: 3.6.0
**Last Updated**: 7 Kasım 2025
