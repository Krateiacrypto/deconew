-- Create auth users for demo accounts
-- Password for all accounts: Demo123!@#
-- Password hash generated with: SELECT crypt('Demo123!@#', gen_salt('bf'));

-- Note: This is for development/demo purposes only
-- In production, users should be created through the signup flow

DO $$
DECLARE
  -- Pre-generated bcrypt hash for 'Demo123!@#'
  v_password_hash TEXT := '$2a$10$8kzpxQZqZ9qj5L7J6Q.3.eKvxVf9mzJQY9vTz8pZnR1xYZ2qZJqZK';
BEGIN
  -- Insert demo auth users if they don't exist

  -- superadmin (already exists, skip)

  -- admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'admin@decarbonize.world'),
      'authenticated',
      'authenticated',
      'admin@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Platform Admin", "role": "admin"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: admin@decarbonize.world';
  END IF;

  -- webadmin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'webadmin@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'webadmin@decarbonize.world'),
      'authenticated',
      'authenticated',
      'webadmin@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Web Admin", "role": "web_admin"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: webadmin@decarbonize.world';
  END IF;

  -- advisor
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'advisor@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'advisor@decarbonize.world'),
      'authenticated',
      'authenticated',
      'advisor@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Investment Advisor", "role": "advisor"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: advisor@decarbonize.world';
  END IF;

  -- verification
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'verification@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'verification@decarbonize.world'),
      'authenticated',
      'authenticated',
      'verification@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Carbon Verification Org", "role": "verifier"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: verification@decarbonize.world';
  END IF;

  -- ngo
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ngo@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'ngo@decarbonize.world'),
      'authenticated',
      'authenticated',
      'ngo@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Green Future Foundation", "role": "ngo"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: ngo@decarbonize.world';
  END IF;

  -- provider
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'provider@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'provider@decarbonize.world'),
      'authenticated',
      'authenticated',
      'provider@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "EcoCarbon Solutions", "role": "carbon_provider"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: provider@decarbonize.world';
  END IF;

  -- institutional
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'institutional@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'institutional@decarbonize.world'),
      'authenticated',
      'authenticated',
      'institutional@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Global Investment Fund", "role": "institutional_investor"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: institutional@decarbonize.world';
  END IF;

  -- proinvestor
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'proinvestor@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'proinvestor@decarbonize.world'),
      'authenticated',
      'authenticated',
      'proinvestor@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Pro Investor", "role": "pro_investor"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: proinvestor@decarbonize.world';
  END IF;

  -- freeinvestor
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'freeinvestor@decarbonize.world') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      (SELECT id FROM public.users WHERE email = 'freeinvestor@decarbonize.world'),
      'authenticated',
      'authenticated',
      'freeinvestor@decarbonize.world',
      v_password_hash,
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Free Investor", "role": "free_investor"}'::jsonb,
      false,
      '',
      '',
      ''
    );
    RAISE NOTICE 'Created auth user: freeinvestor@decarbonize.world';
  END IF;

  RAISE NOTICE 'Demo auth users setup completed!';
  RAISE NOTICE 'All accounts use password: Demo123!@#';
END $$;