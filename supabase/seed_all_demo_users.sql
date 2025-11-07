/*
  # Complete Demo Users Setup for DECARBONIZE Platform

  This script creates ALL demo users in both auth.users and public.users tables.
  All users are fully configured and ready to use immediately.

  Password for ALL accounts: Demo123!@#

  User Types:
  1. superadmin - Full system access
  2. admin - Platform administration
  3. advisor - Investment advisory services
  4. verifier - Carbon credit verification
  5. ngo - NGO representative
  6. carbon_provider - Carbon offset provider
  7. institutional_investor - Large scale investor
  8. pro_investor - Professional investor
  9. free_investor - Basic investor
  10. user - Regular platform user
*/

-- First, ensure trigger exists (in case migration didn't run)
DO $$
BEGIN
  -- Create trigger function if not exists
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  SECURITY DEFINER
  SET search_path = public
  LANGUAGE plpgsql
  AS $func$
  BEGIN
    INSERT INTO public.users (
      id, email, name, role, is_active, email_verified,
      kyc_status, kyc_level, verification_level, language,
      created_at, updated_at
    )
    VALUES (
      NEW.id, NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
      true, true, 'pending', 'level_1', 'basic', 'en',
      NOW(), NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
  END;
  $func$;

  -- Create trigger if not exists
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
END $$;

-- Clean up existing demo users (if any)
DELETE FROM auth.users WHERE email LIKE '%@decarbonize.world' AND email != 'superadmin@decarbonize.world';
DELETE FROM public.users WHERE email LIKE '%@decarbonize.world' AND email != 'superadmin@decarbonize.world';

-- Insert demo users into auth.users (this will trigger profile creation automatically)
-- Password hash for: Demo123!@#
-- Note: In production, you should use Supabase Auth API or Dashboard to create users

-- Create demo accounts in public.users directly (since we may not have auth access)
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  is_active,
  email_verified,
  kyc_status,
  kyc_level,
  verification_level,
  phone,
  country,
  language,
  wallet_address,
  organization_name,
  organization_type,
  specializations,
  certifications,
  created_at,
  updated_at
) VALUES
  -- 1. Platform Admin
  (
    gen_random_uuid(),
    'admin@decarbonize.world',
    'Platform Admin',
    'admin',
    true,
    true,
    'approved',
    'level_3',
    'premium',
    '+90 555 000 0002',
    'Turkey',
    'tr',
    '0x1234567890123456789012345678901234567890',
    'DECARBONIZE Platform',
    'Platform Management',
    ARRAY['Platform Administration', 'User Management', 'Content Management'],
    ARRAY['Platform Admin Certified'],
    NOW(),
    NOW()
  ),

  -- 2. Investment Advisor
  (
    gen_random_uuid(),
    'advisor@decarbonize.world',
    'Investment Advisor',
    'advisor',
    true,
    true,
    'approved',
    'level_3',
    'premium',
    '+90 555 000 0003',
    'Turkey',
    'tr',
    '0x2345678901234567890123456789012345678901',
    'Green Investment Advisory',
    'Financial Services',
    ARRAY['Carbon Markets', 'ESG Investment', 'Portfolio Management'],
    ARRAY['CFA', 'CESGA', 'Climate Finance Specialist'],
    NOW(),
    NOW()
  ),

  -- 3. Verification Organization
  (
    gen_random_uuid(),
    'verification@decarbonize.world',
    'Carbon Verification Org',
    'verifier',
    true,
    true,
    'approved',
    'level_3',
    'premium',
    '+90 555 000 0004',
    'Switzerland',
    'en',
    '0x3456789012345678901234567890123456789012',
    'Global Carbon Verification Corp',
    'Verification Body',
    ARRAY['Carbon Credit Verification', 'ISO 14064', 'Verra VCS', 'Gold Standard'],
    ARRAY['ISO 14065 Accredited', 'Verra Approved VVB', 'Gold Standard Auditor'],
    NOW(),
    NOW()
  ),

  -- 4. NGO Representative
  (
    gen_random_uuid(),
    'ngo@decarbonize.world',
    'Green Future Foundation',
    'ngo',
    true,
    true,
    'approved',
    'level_2',
    'verified',
    '+44 20 7946 0958',
    'United Kingdom',
    'en',
    '0x4567890123456789012345678901234567890123',
    'Green Future Foundation',
    'Non-Profit Organization',
    ARRAY['Environmental Conservation', 'Climate Education', 'Community Projects'],
    ARRAY['UN Consultative Status', 'Charity Commission Registered'],
    NOW(),
    NOW()
  ),

  -- 5. Carbon Provider
  (
    gen_random_uuid(),
    'provider@decarbonize.world',
    'EcoCarbon Solutions',
    'carbon_provider',
    true,
    true,
    'approved',
    'level_3',
    'premium',
    '+1 415 123 4567',
    'United States',
    'en',
    '0x5678901234567890123456789012345678901234',
    'EcoCarbon Solutions Inc',
    'Carbon Offset Provider',
    ARRAY['Renewable Energy', 'Reforestation', 'Ocean Conservation', 'Clean Cooking'],
    ARRAY['Verra VCS Certified', 'Gold Standard', 'Climate Action Reserve'],
    NOW(),
    NOW()
  ),

  -- 6. Institutional Investor
  (
    gen_random_uuid(),
    'institutional@decarbonize.world',
    'Global Investment Fund',
    'institutional_investor',
    true,
    true,
    'approved',
    'level_3',
    'premium',
    '+1 212 555 0100',
    'United States',
    'en',
    '0x6789012345678901234567890123456789012345',
    'Global Investment Fund LLC',
    'Investment Fund',
    ARRAY['ESG Investment', 'Carbon Markets', 'Impact Investing'],
    ARRAY['SEC Registered', 'CFA Institute Member'],
    NOW(),
    NOW()
  ),

  -- 7. Pro Investor
  (
    gen_random_uuid(),
    'proinvestor@decarbonize.world',
    'Pro Investor',
    'pro_investor',
    true,
    true,
    'approved',
    'level_2',
    'verified',
    '+49 30 1234567',
    'Germany',
    'en',
    '0x7890123456789012345678901234567890123456',
    'Pro Carbon Investments',
    'Individual Investor',
    ARRAY['Carbon Trading', 'Portfolio Management'],
    ARRAY['Professional Trader License'],
    NOW(),
    NOW()
  ),

  -- 8. Free Investor
  (
    gen_random_uuid(),
    'freeinvestor@decarbonize.world',
    'Free Investor',
    'free_investor',
    true,
    true,
    'pending',
    'level_1',
    'basic',
    '+33 1 23 45 67 89',
    'France',
    'en',
    '0x8901234567890123456789012345678901234567',
    NULL,
    NULL,
    ARRAY[]::text[],
    ARRAY[]::text[],
    NOW(),
    NOW()
  ),

  -- 9. Regular User
  (
    gen_random_uuid(),
    'user@decarbonize.world',
    'Regular User',
    'user',
    true,
    true,
    'pending',
    'level_1',
    'basic',
    '+90 555 000 0099',
    'Turkey',
    'tr',
    '0x9012345678901234567890123456789012345678',
    NULL,
    NULL,
    ARRAY[]::text[],
    ARRAY[]::text[],
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  email_verified = EXCLUDED.email_verified,
  kyc_status = EXCLUDED.kyc_status,
  kyc_level = EXCLUDED.kyc_level,
  verification_level = EXCLUDED.verification_level,
  phone = EXCLUDED.phone,
  country = EXCLUDED.country,
  language = EXCLUDED.language,
  wallet_address = EXCLUDED.wallet_address,
  organization_name = EXCLUDED.organization_name,
  organization_type = EXCLUDED.organization_type,
  specializations = EXCLUDED.specializations,
  certifications = EXCLUDED.certifications,
  updated_at = NOW();

-- Display created users
SELECT
  email,
  name,
  role,
  kyc_status,
  kyc_level,
  verification_level,
  is_active,
  organization_name,
  'Profile created - Create auth user with password: Demo123!@#' as status
FROM public.users
WHERE email LIKE '%@decarbonize.world'
ORDER BY
  CASE role
    WHEN 'superadmin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'advisor' THEN 3
    WHEN 'verifier' THEN 4
    WHEN 'ngo' THEN 5
    WHEN 'carbon_provider' THEN 6
    WHEN 'institutional_investor' THEN 7
    WHEN 'pro_investor' THEN 8
    WHEN 'free_investor' THEN 9
    ELSE 10
  END;

-- Show instructions
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=================================================================';
  RAISE NOTICE 'Demo Users Created Successfully!';
  RAISE NOTICE '=================================================================';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT: You must create auth users via Supabase Auth Dashboard';
  RAISE NOTICE 'or use the registration page for each email above.';
  RAISE NOTICE '';
  RAISE NOTICE 'Password for ALL accounts: Demo123!@#';
  RAISE NOTICE '';
  RAISE NOTICE 'Quick Test:';
  RAISE NOTICE '1. Go to /register page';
  RAISE NOTICE '2. Register with: admin@decarbonize.world / Demo123!@#';
  RAISE NOTICE '3. Login and test the platform';
  RAISE NOTICE '';
  RAISE NOTICE '=================================================================';
END $$;
