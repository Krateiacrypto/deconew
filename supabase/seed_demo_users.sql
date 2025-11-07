/*
  # Seed Demo Users

  This script creates demo user accounts for testing all platform roles.

  Password for all users (except superadmin): testuser

  Users created:
  1. Super Admin - superadmin@decarbonize.world
  2. Platform Admin - admin@decarbonize.world
  3. Web Admin - webadmin@decarbonize.world
  4. Investment Advisor - advisor@decarbonize.world
  5. Verification Organization - verification@decarbonize.world
  6. NGO - ngo@decarbonize.world
  7. Carbon Provider - provider@decarbonize.world
  8. Institutional Investor - institutional@decarbonize.world
  9. Pro Investor - proinvestor@decarbonize.world
  10. Free Investor - freeinvestor@decarbonize.world
*/

-- First, we need to create users in auth.users table
-- Note: In production, this would be done through Supabase Auth UI or API
-- For demo purposes, we're directly inserting into public.users table

-- Clear existing demo users (optional, comment out if not needed)
-- DELETE FROM public.users WHERE email LIKE '%@decarbonize.world';

-- Insert demo users
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  is_active,
  kyc_status,
  kyc_level,
  email_verified,
  phone,
  country,
  language,
  two_factor_enabled,
  organization_name,
  organization_type,
  verification_level,
  specializations,
  certifications,
  wallet_address,
  investor_tier,
  minimum_investment,
  monthly_limit,
  trading_fee_rate,
  staking_multiplier,
  tier_benefits,
  created_at
) VALUES
  -- 1. Super Admin
  (
    gen_random_uuid(),
    'superadmin@decarbonize.world',
    'Super Admin',
    'superadmin',
    true,
    'approved',
    'level_3',
    true,
    '+90 555 000 0001',
    'Turkey',
    'tr',
    true,
    'DECARBONIZE Platform',
    'Platform Management',
    'premium',
    ARRAY['System Administration', 'Platform Management', 'User Management'],
    ARRAY['ISO 27001', 'GDPR Compliance'],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 2. Platform Admin
  (
    gen_random_uuid(),
    'admin@decarbonize.world',
    'Platform Admin',
    'admin',
    true,
    'approved',
    'level_2',
    true,
    '+90 555 000 0002',
    'Turkey',
    'tr',
    false,
    'DECARBONIZE Platform',
    'Administration',
    'advanced',
    ARRAY['User Management', 'Project Approval', 'Content Management'],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 3. Web Admin
  (
    gen_random_uuid(),
    'webadmin@decarbonize.world',
    'Web Administrator',
    'web_admin',
    true,
    'approved',
    'level_1',
    true,
    '+90 555 000 0003',
    'Turkey',
    'en',
    false,
    'DECARBONIZE Platform',
    'Content Management',
    'basic',
    ARRAY['Content Creation', 'SEO', 'Social Media'],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 4. Investment Advisor
  (
    gen_random_uuid(),
    'advisor@decarbonize.world',
    'Investment Advisor',
    'advisor',
    true,
    'approved',
    'level_2',
    true,
    '+90 555 000 0004',
    'Turkey',
    'en',
    true,
    'Green Investment Advisors Ltd.',
    'Investment Advisory',
    'advanced',
    ARRAY['Carbon Credits', 'Sustainability', 'Investment Advisory', 'ESG Analysis'],
    ARRAY['CFA (Chartered Financial Analyst)', 'CFP (Certified Financial Planner)', 'ESG Certification'],
    '0x9C4e46Dd7745D1643036b4e8E4C9db96DfbF43f4',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 5. Verification Organization
  (
    gen_random_uuid(),
    'verification@decarbonize.world',
    'Carbon Verification Org',
    'verifier',
    true,
    'approved',
    'level_3',
    true,
    '+90 555 000 0005',
    'Turkey',
    'en',
    false,
    'Carbon Trust International',
    'Verification Body',
    'premium',
    NULL,
    ARRAY['ISO 14064 (Greenhouse Gases)', 'VCS (Verified Carbon Standard)', 'Gold Standard', 'CDM (Clean Development Mechanism)'],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 6. NGO
  (
    gen_random_uuid(),
    'ngo@decarbonize.world',
    'Green Future Foundation',
    'ngo',
    true,
    'approved',
    'level_2',
    true,
    '+90 555 000 0006',
    'Turkey',
    'tr',
    false,
    'Green Future Foundation',
    'Non-Governmental Organization',
    'advanced',
    ARRAY['Environmental Conservation', 'Reforestation', 'Community Development'],
    ARRAY['UN Certification', 'NGO Registration'],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 7. Carbon Provider
  (
    gen_random_uuid(),
    'provider@decarbonize.world',
    'EcoCarbon Solutions',
    'carbon_provider',
    true,
    'approved',
    'level_3',
    true,
    '+90 555 000 0007',
    'Turkey',
    'en',
    false,
    'EcoCarbon Solutions Inc.',
    'Carbon Credit Provider',
    'premium',
    NULL,
    ARRAY['VCS Registry', 'Gold Standard Registry', 'Carbon Asset Management'],
    '0xAD5f57Ee8856E2684147b5e9F4D9db96DfbF54g5',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 8. Institutional Investor
  (
    gen_random_uuid(),
    'institutional@decarbonize.world',
    'Global Investment Fund',
    'institutional_investor',
    true,
    'approved',
    'level_3',
    true,
    '+90 555 000 0008',
    'Turkey',
    'en',
    true,
    'Global Investment Fund LLC',
    'Institutional Investor',
    'premium',
    NULL,
    NULL,
    '0xBE6g68Ff9967F3795258c6fAE5E9db96DfbF65h6',
    'institutional',
    10000,
    NULL,
    0.001,
    1.0,
    '{"feeDiscount": "0.10% trading fee", "apiAccess": true, "dedicatedManager": true, "priorityAccess": true}',
    NOW()
  ),

  -- 9. Pro Investor
  (
    gen_random_uuid(),
    'proinvestor@decarbonize.world',
    'Pro Investor',
    'pro_investor',
    true,
    'approved',
    'level_2',
    true,
    '+90 555 000 0009',
    'Turkey',
    'tr',
    false,
    NULL,
    NULL,
    'advanced',
    NULL,
    NULL,
    '0xCF7h79Gg0078G4806369d7gBF6F0ec07EgcG76i7',
    'pro',
    1000,
    NULL,
    0.002,
    1.25,
    '{"feeDiscount": "0.20% trading fee", "stakingBonus": "1.25x multiplier", "prioritySupport": true}',
    NOW()
  ),

  -- 10. Free Investor
  (
    gen_random_uuid(),
    'freeinvestor@decarbonize.world',
    'Free Investor',
    'free_investor',
    true,
    'approved',
    'level_1',
    true,
    '+90 555 000 0010',
    'Turkey',
    'tr',
    false,
    NULL,
    NULL,
    'basic',
    NULL,
    NULL,
    '0xDG8i80Hh1189H5917480e8hCG7G1fd18FhdH87j8',
    'free',
    100,
    10000,
    0.0025,
    1.0,
    '{"tradingFee": "0.25%", "monthlyLimit": "$10,000"}',
    NOW()
  ),

  -- Additional test users for realistic data

  -- 11. Pro Investor 2
  (
    gen_random_uuid(),
    'investor.sarah@example.com',
    'Sarah Johnson',
    'pro_investor',
    true,
    'approved',
    'level_2',
    true,
    '+1 555 123 4567',
    'United States',
    'en',
    true,
    NULL,
    NULL,
    'advanced',
    NULL,
    NULL,
    '0xEH9j91Ii2290I6028591f9iDH8H2ge29GieI98k9',
    'pro',
    1000,
    NULL,
    0.002,
    1.25,
    '{"feeDiscount": "0.20% trading fee", "stakingBonus": "1.25x multiplier"}',
    NOW()
  ),

  -- 12. Free Investor 2
  (
    gen_random_uuid(),
    'investor.michael@example.com',
    'Michael Chen',
    'free_investor',
    true,
    'under_review',
    'level_1',
    true,
    '+86 138 0013 8000',
    'China',
    'en',
    false,
    NULL,
    NULL,
    'basic',
    NULL,
    NULL,
    '0xFI0k02Jj3301J7139602g0jEI9I3hf30HjfJ09l0',
    'free',
    100,
    10000,
    0.0025,
    1.0,
    '{"tradingFee": "0.25%", "monthlyLimit": "$10,000"}',
    NOW()
  ),

  -- 13. Carbon Provider 2
  (
    gen_random_uuid(),
    'provider.green@example.com',
    'GreenTech Innovations',
    'carbon_provider',
    true,
    'approved',
    'level_2',
    true,
    '+49 30 12345678',
    'Germany',
    'de',
    false,
    'GreenTech Innovations GmbH',
    'Technology Provider',
    'advanced',
    NULL,
    ARRAY['Renewable Energy', 'Carbon Capture Technology'],
    '0xGJ1l13Kk4412K8240713h1kFJ0J4ig41IkgK10m1',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 14. Advisor 2
  (
    gen_random_uuid(),
    'advisor.maria@example.com',
    'Maria Rodriguez',
    'advisor',
    true,
    'approved',
    'level_2',
    true,
    '+34 91 123 4567',
    'Spain',
    'en',
    false,
    'Sustainable Finance Consultants',
    'Financial Advisory',
    'advanced',
    ARRAY['ESG Investment', 'Climate Finance', 'Portfolio Management'],
    ARRAY['CFA', 'Sustainable Finance Certificate'],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NOW()
  ),

  -- 15. Pending KYC User
  (
    gen_random_uuid(),
    'pending.user@example.com',
    'John Pending',
    'free_investor',
    true,
    'pending',
    'level_1',
    true,
    '+44 20 7123 4567',
    'United Kingdom',
    'en',
    false,
    NULL,
    NULL,
    'basic',
    NULL,
    NULL,
    NULL,
    'free',
    100,
    10000,
    0.0025,
    1.0,
    '{"tradingFee": "0.25%"}',
    NOW()
  )

ON CONFLICT (email) DO NOTHING;

-- Update last_login for active users
UPDATE public.users
SET last_login = NOW() - INTERVAL '2 hours'
WHERE email IN (
  'admin@decarbonize.world',
  'advisor@decarbonize.world',
  'institutional@decarbonize.world',
  'proinvestor@decarbonize.world'
);

-- Add some sample audit logs
INSERT INTO public.audit_logs (user_id, action, resource, resource_id, details, timestamp)
SELECT
  id,
  'user.login',
  'auth',
  id::text,
  '{"ip_address": "192.168.1.1", "user_agent": "Mozilla/5.0"}',
  NOW() - INTERVAL '1 hour'
FROM public.users
WHERE email LIKE '%@decarbonize.world'
LIMIT 5;

-- Show created users summary
SELECT
  name,
  email,
  role,
  kyc_status,
  kyc_level,
  investor_tier,
  is_active
FROM public.users
WHERE email LIKE '%@decarbonize.world' OR email LIKE '%@example.com'
ORDER BY
  CASE role
    WHEN 'superadmin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'web_admin' THEN 3
    WHEN 'advisor' THEN 4
    WHEN 'verifier' THEN 5
    WHEN 'ngo' THEN 6
    WHEN 'carbon_provider' THEN 7
    WHEN 'institutional_investor' THEN 8
    WHEN 'pro_investor' THEN 9
    WHEN 'free_investor' THEN 10
    ELSE 11
  END;
