# 🔧 DECARBONIZE.world - Troubleshooting Guide

## Common Issues and Solutions

### 🔐 Authentication Issues

#### Issue 1: Login Loading Forever / Stuck on Loading
**Symptoms:**
- After entering credentials, the page shows infinite loading
- No error message appears
- Browser console shows errors

**Solution:**
```bash
# Check if user exists in database
# Run this query in Supabase SQL Editor:
SELECT id, email, name, role, is_active
FROM public.users
WHERE email = 'your-email@example.com';

# If user doesn't exist or role is wrong, update:
UPDATE public.users
SET
  role = 'superadmin',  -- or your desired role
  kyc_status = 'approved',
  email_verified = true,
  is_active = true
WHERE email = 'your-email@example.com';
```

**Root Cause:**
- User profile not created in `public.users` table
- Auth trigger not fired properly during signup
- RLS policies blocking profile access

**Prevention:**
- Always check Supabase dashboard after signup
- Verify trigger `on_auth_user_created` is active
- Check RLS policies allow user to read own profile

---

#### Issue 2: "Invalid Login Credentials" Error
**Symptoms:**
- Error message: "Invalid login credentials"
- Can't login with correct password

**Solution:**
```bash
# 1. Check if user exists in auth.users
# Supabase Dashboard > Authentication > Users

# 2. If user doesn't exist, create via Supabase Auth UI
# OR use this query (ONLY for testing):
# Note: This won't hash the password properly, use Auth UI instead

# 3. Reset password
# Supabase Dashboard > Authentication > Users > Select User > Reset Password
```

**Root Cause:**
- User doesn't exist in `auth.users`
- Password typed incorrectly
- Email not confirmed (if email confirmation enabled)

---

#### Issue 3: User Created but Wrong Role
**Symptoms:**
- Login works but dashboard shows wrong content
- User has 'user' role instead of 'admin' or 'superadmin'

**Solution:**
```sql
-- Update user role
UPDATE public.users
SET role = 'superadmin'  -- or 'admin', 'advisor', etc.
WHERE email = 'your-email@example.com';

-- Verify change
SELECT email, role FROM public.users
WHERE email = 'your-email@example.com';
```

**Root Cause:**
- Auth trigger uses default role 'user'
- Metadata not passed during signup

---

### 💾 Database Issues

#### Issue 4: "Relation does not exist" Error
**Symptoms:**
- Error: `relation "public.users" does not exist`
- Database queries fail

**Solution:**
```bash
# 1. Check if migrations ran successfully
# Supabase Dashboard > Database > Migrations

# 2. Run migrations manually
# Copy content from:
# - supabase/migrations/20251002202117_create_initial_schema.sql
# - supabase/migrations/20251002202215_setup_storage_and_seed_data_v2.sql
# And run in SQL Editor

# 3. Verify tables exist
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public';
```

**Root Cause:**
- Migrations not applied
- Wrong database selected
- Tables dropped accidentally

---

#### Issue 5: "Permission Denied" / RLS Policy Error
**Symptoms:**
- Error: `new row violates row-level security policy`
- Can't insert/update data

**Solution:**
```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Temporarily disable RLS for testing (NOT for production)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Re-enable after fixing
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

**Root Cause:**
- RLS policy too restrictive
- User not authenticated
- Missing role in policy check

---

### 🌐 Blockchain Issues

#### Issue 6: MetaMask Not Connecting
**Symptoms:**
- "MetaMask not installed" error
- Wallet connection fails

**Solution:**
```javascript
// 1. Check if MetaMask is installed
console.log('MetaMask:', window.ethereum);

// 2. Verify network
console.log('ChainId:', await window.ethereum.request({ method: 'eth_chainId' }));

// 3. Switch to ReefChain
// The platform will automatically prompt to add network
```

**Steps:**
1. Install MetaMask extension
2. Refresh page
3. Click "Connect Wallet"
4. Approve network addition when prompted
5. Approve connection request

---

#### Issue 7: Transaction Fails / Gas Error
**Symptoms:**
- Transaction fails with gas error
- "Insufficient funds" message

**Solution:**
1. Check REEF balance in wallet
2. Get testnet REEF from faucet (for testing)
3. Ensure on correct network (ReefChain Mainnet)
4. Try increasing gas limit

---

### 📦 Build & Development Issues

#### Issue 8: Build Fails
**Symptoms:**
- `npm run build` fails
- TypeScript errors

**Solution:**
```bash
# 1. Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# 2. Check TypeScript
npm run lint

# 3. Rebuild
npm run build

# 4. If still fails, check specific error and fix
```

---

#### Issue 9: Dev Server Won't Start
**Symptoms:**
- `npm run dev` fails
- Port already in use

**Solution:**
```bash
# 1. Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# 2. Use different port
npm run dev -- --port 5174

# 3. Check .env file exists
ls -la .env
```

---

### 🗄️ Supabase Issues

#### Issue 10: "JWT expired" Error
**Symptoms:**
- Logged out unexpectedly
- API calls fail with auth error

**Solution:**
```typescript
// Refresh session manually
const { data, error } = await supabase.auth.refreshSession();

// Or just reload page - session will auto-refresh
window.location.reload();
```

**Root Cause:**
- JWT token expired (default 1 hour)
- Session not refreshed automatically
- Network issue during refresh

---

#### Issue 11: Storage Upload Fails
**Symptoms:**
- File upload returns error
- "Bucket not found" or "Permission denied"

**Solution:**
```sql
-- 1. Check if bucket exists
SELECT * FROM storage.buckets;

-- 2. Check storage policies
SELECT * FROM storage.policies;

-- 3. Create missing bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- 4. Add policy
CREATE POLICY "Users can upload own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

### 🔍 Debugging Tips

#### Enable Debug Mode
```typescript
// Add to src/lib/supabase.ts
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: true  // Add this line
  }
});
```

#### Check Console Logs
```javascript
// Browser Console (F12)
// Look for:
// - Auth errors
// - Database query errors
// - Network errors
// - RLS policy violations
```

#### Check Network Tab
```
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Look for failed requests
5. Check request/response details
```

#### Check Supabase Logs
```
1. Supabase Dashboard
2. Logs & Reports
3. Filter by error level
4. Check recent errors
```

---

### 🚨 Emergency Recovery

#### Reset Everything
```bash
# 1. Clear browser data
# Chrome: Settings > Privacy > Clear browsing data
# Select: Cookies, Cache, Local Storage

# 2. Clear Zustand storage
localStorage.clear();
sessionStorage.clear();

# 3. Rebuild project
rm -rf node_modules dist
npm install
npm run build

# 4. Restart dev server
npm run dev
```

#### Reset Database (DESTRUCTIVE)
```sql
-- WARNING: This will delete ALL data!
-- Only use in development

-- Drop all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Re-run migrations
-- Copy and paste from migration files
```

---

### 📞 Getting Help

#### Before Asking for Help
1. ✅ Check this troubleshooting guide
2. ✅ Check browser console for errors
3. ✅ Check Supabase logs
4. ✅ Check network tab in DevTools
5. ✅ Try in incognito/private mode
6. ✅ Try different browser

#### Provide This Information
```
1. Error message (full text + screenshot)
2. Browser console logs
3. Network request details
4. Steps to reproduce
5. Browser version
6. Operating system
7. When did it start happening?
8. What changed before the error?
```

#### Where to Get Help
- **Email**: dev@decarbonize.world
- **Documentation**: Check all .md files in project
- **Supabase**: https://supabase.com/docs
- **ReefChain**: https://docs.reef.io/

---

### 🔧 Quick Fixes Checklist

**Login Not Working?**
- [ ] Clear browser cache
- [ ] Check if user exists in database
- [ ] Verify role is correct
- [ ] Check RLS policies
- [ ] Try password reset

**Dashboard Not Loading?**
- [ ] Check authentication
- [ ] Verify user role
- [ ] Check browser console
- [ ] Clear local storage
- [ ] Reload page

**Wallet Not Connecting?**
- [ ] MetaMask installed?
- [ ] Correct network?
- [ ] Page refreshed?
- [ ] Wallet unlocked?

**Database Query Fails?**
- [ ] Migrations applied?
- [ ] RLS policies correct?
- [ ] User authenticated?
- [ ] Table exists?

---

## 📝 Maintenance Tasks

### Weekly
- [ ] Check Supabase logs
- [ ] Review error reports
- [ ] Test critical flows
- [ ] Update dependencies (npm audit)

### Monthly
- [ ] Database backup
- [ ] Security audit
- [ ] Performance check
- [ ] Update documentation

---

**Last Updated**: 2025-10-02
**Version**: 1.0
