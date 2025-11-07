# 🗄️ Database Setup Guide

This guide will help you setup the MySQL database for Decarbonize backend.

---

## Prerequisites

- MySQL 8.0+ installed and running
- Administrator access to MySQL (`root` user)
- Terminal/Command Prompt open

---

## Step 1: Connect to MySQL

```bash
mysql -u root -p
# You'll be prompted for root password
# Enter your MySQL root password
```

If you see the `mysql>` prompt, you're connected!

---

## Step 2: Create Database

```sql
CREATE DATABASE decarbonize_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

✅ Database created successfully

---

## Step 3: Create Database User

```sql
CREATE USER 'decarbonize'@'localhost' IDENTIFIED BY 'Dev123!@#';
```

✅ User created successfully

---

## Step 4: Grant Privileges

```sql
GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost';
FLUSH PRIVILEGES;
```

✅ Privileges granted successfully

---

## Step 5: Verify Setup (Optional)

```sql
-- Show databases
SHOW DATABASES;

-- Show users
SELECT user, host FROM mysql.user WHERE user='decarbonize';

-- Exit MySQL
EXIT;
```

---

## Step 6: Test Connection

From your terminal (not in MySQL):

```bash
mysql -u decarbonize -p decarbonize_dev
# Password: Dev123!@#

# If you see mysql> prompt, connection is successful!

# Show existing tables (should be empty)
SHOW TABLES;

# Exit
EXIT;
```

✅ Database is ready!

---

## Credentials Reference

| Parameter | Value |
|-----------|-------|
| Host | localhost |
| Port | 3306 |
| Database | decarbonize_dev |
| Username | decarbonize |
| Password | Dev123!@# |

⚠️ **Important**: These credentials are for **local development only**. Change passwords for production!

---

## Next Steps

After database is ready:

1. Backend dependencies installed: `npm install` ✅
2. Database created and user setup ✅
3. Run migrations: `npm run migrate`
4. Start server: `npm run dev`

---

## Troubleshooting

### "Access denied for user 'root'"
- MySQL might not be running
- Wrong password for root
- Try: `mysql -u root` (without -p flag)

### "Can't connect to MySQL server"
- MySQL service is not running
- Windows: Check Services app for MySQL80
- macOS: `brew services start mysql`
- Linux: `sudo systemctl start mysql`

### "Database already exists"
If database already exists, you can drop it:
```sql
DROP DATABASE decarbonize_dev;
-- Then create it again
CREATE DATABASE decarbonize_dev CHARACTER SET utf8mb4;
```

### "User already exists"
If user already exists, drop and recreate:
```sql
DROP USER 'decarbonize'@'localhost';
CREATE USER 'decarbonize'@'localhost' IDENTIFIED BY 'Dev123!@#';
```

---

## Production Checklist

- [ ] Change database user password
- [ ] Use strong password (min 12 characters, mixed case, numbers, symbols)
- [ ] Restrict user privileges (not ALL PRIVILEGES)
- [ ] Use environment variables for credentials
- [ ] Enable MySQL SSL for remote connections
- [ ] Regular database backups
- [ ] Monitor database performance

---

**Last Updated**: 29 Ekim 2025
**Status**: Ready for Migration
