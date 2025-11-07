/*
  DECARBONIZE.world - Demo Accounts Setup Script

  This script prepares user profiles for demo accounts.
  After running this script, create accounts via Supabase Auth Dashboard or signup page.

  ALL DEMO ACCOUNTS PASSWORD: Demo123!@#

  Demo Accounts:
  1. superadmin@decarbonize.world - Super Admin
  2. admin@decarbonize.world - Platform Admin
  3. advisor@decarbonize.world - Investment Advisor
  4. verification@decarbonize.world - Verification Organization
  5. ngo@decarbonize.world - NGO Representative
  6. provider@decarbonize.world - Carbon Provider
  7. user@decarbonize.world - Regular User
*/

-- 1. SUPERADMIN ACCOUNT
-- Email: superadmin@decarbonize.world
-- Password: Demo123!@#
-- Already created, just ensure it has all details

UPDATE public.users
SET
  role = 'superadmin',
  name = 'Super Admin',
  kyc_status = 'approved',
  email_verified = true,
  is_active = true,
  phone = '+90 555 000 0001',
  country = 'Turkey',
  language = 'tr',
  wallet_address = '0x742d35Cc6634C0532925a3b8D4C9db96DfbF31d2',
  organization_name = 'DECARBONIZE Platform',
  organization_type = 'Platform Management',
  verification_level = 'premium',
  specializations = ARRAY['System Administration', 'Platform Management', 'User Management'],
  certifications = ARRAY['ISO 27001', 'GDPR Compliance'],
  updated_at = NOW()
WHERE email = 'superadmin@decarbonize.world';

-- Show current demo users
SELECT
  email,
  name,
  role,
  kyc_status,
  is_active,
  'Profile exists - ready for login' as status
FROM public.users
WHERE email LIKE '%@decarbonize.world'
ORDER BY
  CASE role
    WHEN 'superadmin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'advisor' THEN 3
    WHEN 'verification_org' THEN 4
    WHEN 'ngo' THEN 5
    WHEN 'carbon_provider' THEN 6
    ELSE 7
  END;
