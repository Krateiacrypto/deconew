/*
  # Fix User Registration - Auto Create Profile

  1. Problem
    - Users table has no INSERT policy
    - Registration fails with "Database error saving new user"
    - Manual profile creation not possible

  2. Solution
    - Create trigger to auto-create user profile when auth user is created
    - Add INSERT policy as fallback
    - This is Supabase best practice for user profile management

  3. Security
    - Trigger runs with SECURITY DEFINER (bypasses RLS)
    - INSERT policy checks auth.uid() = id (users can only insert their own profile)
    - Existing SELECT/UPDATE policies remain unchanged
*/

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
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
    language,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    true,
    true,
    'pending',
    'level_1',
    'basic',
    'en',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth user creation
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add INSERT policy for manual profile creation
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON public.users;
CREATE POLICY "Users can insert own profile during registration"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verify RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
