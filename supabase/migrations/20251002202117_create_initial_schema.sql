/*
  # Initial Database Schema for DECARBONIZE Platform

  ## Overview
  This migration creates the complete database schema for the DECARBONIZE.world platform,
  including all necessary tables, relationships, security policies, and functions.

  ## Tables Created
  
  ### 1. users
  - Extended user profiles linked to auth.users
  - Stores user role, KYC status, wallet info, and organization details
  - Supports multiple user types: user, advisor, verification_org, ngo, carbon_provider, admin, superadmin
  
  ### 2. projects
  - Carbon offset projects with funding and verification tracking
  - Links to creators, advisors, and approvers
  - Tracks funding progress, carbon credits, and status
  
  ### 3. blog_posts
  - Multi-language blog content
  - SEO optimization fields
  - View and like tracking
  
  ### 4. blog_categories
  - Blog categorization system
  - Automatic post count tracking
  
  ### 5. kyc_applications
  - KYC verification workflow
  - Document management
  - Review and approval tracking
  
  ### 6. investments
  - User investment tracking
  - Carbon credit allocation
  - ROI and return calculations
  
  ### 7. staking_pools
  - Token staking pools configuration
  - APY and lock period management
  
  ### 8. staking_positions
  - Individual user staking positions
  - Reward tracking and claiming
  
  ### 9. transactions
  - Blockchain transaction history
  - Multi-type transaction support
  
  ### 10. notifications
  - User notification system
  - Read status tracking
  
  ### 11. audit_logs
  - System audit trail
  - Action and resource tracking

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Role-based access control policies
  - Data isolation per user and role
  
  ## Performance
  - Strategic indexes on frequently queried columns
  - Optimized for read-heavy operations
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('superadmin', 'admin', 'advisor', 'verification_org', 'ngo', 'carbon_provider', 'user')),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected', 'under_review')),
  wallet_address TEXT,
  phone TEXT,
  country TEXT,
  language TEXT DEFAULT 'tr' CHECK (language IN ('tr', 'en', 'de', 'fr')),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT FALSE,
  organization_name TEXT,
  organization_type TEXT,
  verification_level TEXT CHECK (verification_level IN ('basic', 'advanced', 'premium')),
  assigned_users TEXT[],
  specializations TEXT[],
  certifications TEXT[]
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('forest', 'renewable', 'water', 'agriculture', 'technology')),
  carbon_credits INTEGER NOT NULL CHECK (carbon_credits > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL CHECK (end_date > start_date),
  participants INTEGER DEFAULT 0 CHECK (participants >= 0),
  verified BOOLEAN DEFAULT FALSE,
  image TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'completed', 'pending', 'rejected')),
  total_funding DECIMAL(12,2) DEFAULT 0 CHECK (total_funding >= 0),
  target_funding DECIMAL(12,2) NOT NULL CHECK (target_funding > 0),
  advisor_id UUID REFERENCES public.users(id),
  documents TEXT[] DEFAULT '{}',
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  expected_return DECIMAL(5,2) NOT NULL CHECK (expected_return >= 0),
  minimum_investment DECIMAL(10,2) NOT NULL CHECK (minimum_investment > 0),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  approved_by UUID REFERENCES public.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  author_avatar TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  language TEXT DEFAULT 'tr' CHECK (language IN ('tr', 'en', 'de', 'fr')),
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  read_time INTEGER DEFAULT 1 CHECK (read_time > 0),
  slug TEXT UNIQUE NOT NULL,
  seo_title TEXT,
  seo_description TEXT
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#10b981',
  post_count INTEGER DEFAULT 0 CHECK (post_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC applications table
CREATE TABLE IF NOT EXISTS public.kyc_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  personal_info JSONB NOT NULL,
  documents TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investments table
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  carbon_credits DECIMAL(10,2) NOT NULL CHECK (carbon_credits > 0),
  date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'completed', 'pending', 'cancelled')),
  returns DECIMAL(12,2) DEFAULT 0 CHECK (returns >= 0),
  transaction_hash TEXT,
  fees DECIMAL(10,2) DEFAULT 0 CHECK (fees >= 0),
  roi DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staking pools table
CREATE TABLE IF NOT EXISTS public.staking_pools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  apy DECIMAL(5,2) NOT NULL CHECK (apy >= 0),
  minimum_stake DECIMAL(10,2) NOT NULL CHECK (minimum_stake > 0),
  lock_period INTEGER NOT NULL CHECK (lock_period > 0),
  total_staked DECIMAL(15,2) DEFAULT 0 CHECK (total_staked >= 0),
  participants INTEGER DEFAULT 0 CHECK (participants >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staking positions table
CREATE TABLE IF NOT EXISTS public.staking_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  pool_id UUID REFERENCES public.staking_pools(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  rewards DECIMAL(12,2) DEFAULT 0 CHECK (rewards >= 0),
  last_reward_claim TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  hash TEXT UNIQUE NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount DECIMAL(18,8) NOT NULL,
  token TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('transfer', 'stake', 'unstake', 'trade', 'investment', 'reward')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  fees DECIMAL(18,8) DEFAULT 0,
  block_number BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  action_url TEXT
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Projects policies
CREATE POLICY "Anyone can read active projects" ON public.projects
  FOR SELECT USING (status = 'active' OR status = 'completed');

CREATE POLICY "Authenticated users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = created_by AND auth.role() = 'authenticated');

CREATE POLICY "Project owners can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Blog posts policies
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Blog categories policies
CREATE POLICY "Anyone can read categories" ON public.blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.blog_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- KYC applications policies
CREATE POLICY "Users can read own KYC" ON public.kyc_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own KYC" ON public.kyc_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage KYC applications" ON public.kyc_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin', 'verification_org')
    )
  );

-- Investments policies
CREATE POLICY "Users can read own investments" ON public.investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create investments" ON public.investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all investments" ON public.investments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Staking policies
CREATE POLICY "Anyone can read active pools" ON public.staking_pools
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can read own positions" ON public.staking_positions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create positions" ON public.staking_positions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage staking" ON public.staking_pools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Transactions policies
CREATE POLICY "Users can read own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Audit logs policies
CREATE POLICY "Admins can read audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON public.users(kyc_status);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);

CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_advisor_id ON public.projects(advisor_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_project_id ON public.investments(project_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON public.investments(status);

CREATE INDEX IF NOT EXISTS idx_staking_positions_user_id ON public.staking_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_staking_positions_pool_id ON public.staking_positions(pool_id);
CREATE INDEX IF NOT EXISTS idx_staking_positions_status ON public.staking_positions(status);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON public.transactions(hash);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

CREATE INDEX IF NOT EXISTS idx_kyc_applications_user_id ON public.kyc_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_applications_status ON public.kyc_applications(status);

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_applications_updated_at
  BEFORE UPDATE ON public.kyc_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staking_pools_updated_at
  BEFORE UPDATE ON public.staking_pools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staking_positions_updated_at
  BEFORE UPDATE ON public.staking_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blog post interaction functions
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.blog_posts 
  SET views = views + 1, updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.blog_posts 
  SET likes = likes + 1, updated_at = NOW()
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update blog category post counts
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.category != NEW.category THEN
    UPDATE public.blog_categories 
    SET post_count = (
      SELECT COUNT(*) FROM public.blog_posts 
      WHERE category = OLD.category AND status = 'published'
    )
    WHERE name = OLD.category;
  END IF;
  
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.blog_categories 
    SET post_count = (
      SELECT COUNT(*) FROM public.blog_posts 
      WHERE category = NEW.category AND status = 'published'
    )
    WHERE name = NEW.category;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE public.blog_categories 
    SET post_count = (
      SELECT COUNT(*) FROM public.blog_posts 
      WHERE category = OLD.category AND status = 'published'
    )
    WHERE name = OLD.category;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_category_count
  AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- User profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();