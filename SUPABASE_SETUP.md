# 🗄️ DECARBONIZE.world Supabase Kurulum Rehberi

Bu dokümantasyon, DECARBONIZE.world platformu için Supabase backend kurulumunu detaylı olarak açıklar.

## 📋 Genel Bakış

DECARBONIZE.world aşağıdaki Supabase servislerini kullanır:

- **Database**: PostgreSQL veritabanı (kullanıcılar, projeler, blog)
- **Auth**: Kullanıcı kimlik doğrulama ve yetkilendirme
- **Storage**: Dosya yükleme ve saklama (resimler, belgeler)
- **Edge Functions**: Serverless fonksiyonlar (webhook'lar, API'ler)
- **Real-time**: Canlı veri güncellemeleri

## 🚀 Hızlı Başlangıç

### 1. Supabase Projesi Oluşturma

```bash
# 1. supabase.com'a gidin
# 2. "New Project" butonuna tıklayın
# 3. Proje bilgilerini girin:

Proje Adı: decarbonize-production
Organization: [Şirketiniz]
Database Password: [Güçlü şifre - kaydedin!]
Region: Europe West (Ireland) # Türkiye için en yakın
```

### 2. Environment Variables

```bash
# .env.local dosyası oluşturun
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Database Schema

Supabase SQL Editor'da aşağıdaki script'i çalıştırın:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE public.users (
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
  language TEXT DEFAULT 'tr' CHECK (language IN ('tr', 'en')),
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
CREATE TABLE public.projects (
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
CREATE TABLE public.blog_posts (
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
  language TEXT DEFAULT 'tr' CHECK (language IN ('tr', 'en')),
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  read_time INTEGER DEFAULT 1 CHECK (read_time > 0),
  slug TEXT UNIQUE NOT NULL,
  seo_title TEXT,
  seo_description TEXT
);

-- Blog categories table
CREATE TABLE public.blog_categories (
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
CREATE TABLE public.kyc_applications (
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
CREATE TABLE public.investments (
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
CREATE TABLE public.staking_pools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  apy DECIMAL(5,2) NOT NULL CHECK (apy >= 0),
  minimum_stake DECIMAL(10,2) NOT NULL CHECK (minimum_stake > 0),
  lock_period INTEGER NOT NULL CHECK (lock_period > 0), -- days
  total_staked DECIMAL(15,2) DEFAULT 0 CHECK (total_staked >= 0),
  participants INTEGER DEFAULT 0 CHECK (participants >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staking positions table
CREATE TABLE public.staking_positions (
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
```

### 4. Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_positions ENABLE ROW LEVEL SECURITY;

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
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

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
      AND role IN ('admin', 'superadmin')
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
```

### 5. Database Functions

```sql
-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
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
  -- Update old category count
  IF TG_OP = 'UPDATE' AND OLD.category != NEW.category THEN
    UPDATE public.blog_categories 
    SET post_count = (
      SELECT COUNT(*) FROM public.blog_posts 
      WHERE category = OLD.category AND status = 'published'
    )
    WHERE name = OLD.category;
  END IF;
  
  -- Update new category count
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.blog_categories 
    SET post_count = (
      SELECT COUNT(*) FROM public.blog_posts 
      WHERE category = NEW.category AND status = 'published'
    )
    WHERE name = NEW.category;
  END IF;
  
  -- Update category count on delete
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
```

### 6. Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true),
  ('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Project images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Admins can manage project images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'project-images' 
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Blog images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can manage blog images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'blog-images' 
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Users can access own documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can access all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' 
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );
```

### 7. Performance Indexes

```sql
-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_kyc_status ON public.users(kyc_status);
CREATE INDEX idx_users_is_active ON public.users(is_active);

CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_created_by ON public.projects(created_by);
CREATE INDEX idx_projects_advisor_id ON public.projects(advisor_id);

CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author);

CREATE INDEX idx_investments_user_id ON public.investments(user_id);
CREATE INDEX idx_investments_project_id ON public.investments(project_id);
CREATE INDEX idx_investments_status ON public.investments(status);

CREATE INDEX idx_staking_positions_user_id ON public.staking_positions(user_id);
CREATE INDEX idx_staking_positions_pool_id ON public.staking_positions(pool_id);
CREATE INDEX idx_staking_positions_status ON public.staking_positions(status);

CREATE INDEX idx_kyc_applications_user_id ON public.kyc_applications(user_id);
CREATE INDEX idx_kyc_applications_status ON public.kyc_applications(status);
```

### 8. Seed Data

```sql
-- Insert default blog categories
INSERT INTO public.blog_categories (name, slug, description, color) VALUES
  ('Karbon Kredisi', 'karbon-kredisi', 'Karbon kredisi piyasası ve tokenleştirme', '#10b981'),
  ('Sürdürülebilirlik', 'surdurulebilirlik', 'Çevre koruma ve sürdürülebilir kalkınma', '#3b82f6'),
  ('Blockchain', 'blockchain', 'Blockchain teknolojisi ve uygulamaları', '#8b5cf6'),
  ('Yenilenebilir Enerji', 'yenilenebilir-enerji', 'Temiz enerji teknolojileri', '#f59e0b');

-- Insert default staking pools
INSERT INTO public.staking_pools (name, token_symbol, apy, minimum_stake, lock_period, description) VALUES
  ('DCB Staking Pool', 'DCB', 12.5, 100, 30, 'Stake your DCB tokens and earn rewards'),
  ('Carbon Credit Pool', 'CO2', 8.7, 50, 90, 'Stake carbon credits for long-term rewards'),
  ('High Yield Pool', 'DCB', 18.2, 1000, 180, 'High APY pool with longer lock period');

-- Note: Admin user should be created manually through Supabase Auth UI
-- Then update the users table with admin role
```

## 🔧 Konfigürasyon Ayarları

### Authentication Settings

```bash
# Supabase Dashboard > Authentication > Settings

Site URL: https://your-domain.com
Redirect URLs: 
  - https://your-domain.com/auth/callback
  - https://your-domain.com/reset-password
  - http://localhost:5173/auth/callback (development)

# Email Settings
Enable email confirmations: false (ICO için hızlı kayıt)
Enable email change confirmations: true
Enable phone confirmations: false

# Password Settings
Minimum password length: 8
Password requirements: 
  - At least one uppercase letter
  - At least one lowercase letter  
  - At least one number

# Session Settings
JWT expiry: 3600 (1 hour)
Refresh token expiry: 2592000 (30 days)
```

### Database Settings

```bash
# Dashboard > Settings > Database

Connection pooling: Enabled
Pool size: 15 (Free tier)
Pool mode: Transaction

# Backup Settings
Point-in-time recovery: Enabled
Backup retention: 7 days (Free tier)

# Extensions
uuid-ossp: Enabled
pg_stat_statements: Enabled (monitoring için)
```

### API Settings

```bash
# Dashboard > Settings > API

Max rows: 1000
Max request size: 3MB
Request timeout: 30s

# CORS Settings
Allowed origins: 
  - https://your-domain.com
  - http://localhost:5173 (development)
```

## 📊 Monitoring ve Maintenance

### 1. Health Checks

```sql
-- Database health check
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY n_tup_ins DESC;

-- Active connections
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. Performance Monitoring

```bash
# Supabase Dashboard > Database > Query Performance
# Slow query'leri takip edin

# Dashboard > Database > Indexes
# Missing index'leri kontrol edin

# Dashboard > Logs
# Error log'larını inceleyin
```

### 3. Backup Strategy

```bash
# Otomatik backup (Supabase tarafından)
# - Point-in-time recovery: 7 gün (Free tier)
# - Full backup: Günlük

# Manuel backup
pg_dump "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" > backup.sql

# Restore
psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" < backup.sql
```

## 🔒 Güvenlik Best Practices

### 1. RLS Politikaları
- Her tablo için RLS aktif
- Minimum yetki prensibi
- Role-based access control

### 2. API Security
- Rate limiting aktif
- CORS doğru yapılandırılmış
- JWT token rotation

### 3. Data Protection
- Hassas veriler şifrelenmiş
- PII data masking
- Audit logging aktif

## 🚨 Troubleshooting

### Yaygın Hatalar

1. **"relation does not exist"**
   ```sql
   -- Schema'nın doğru oluşturulduğunu kontrol edin
   \dt public.*
   ```

2. **"permission denied for table"**
   ```sql
   -- RLS politikalarını kontrol edin
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

3. **"JWT expired"**
   ```javascript
   // Token refresh kontrol edin
   const { data, error } = await supabase.auth.refreshSession();
   ```

4. **"Row level security violation"**
   ```sql
   -- User role'ünü kontrol edin
   SELECT id, email, role FROM public.users WHERE id = auth.uid();
   ```

### Debug Komutları

```bash
# Supabase CLI ile debug
npx supabase status
npx supabase logs

# Database connection test
psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" -c "SELECT version();"

# API test
curl -H "apikey: [ANON_KEY]" \
     -H "Authorization: Bearer [ANON_KEY]" \
     https://[REF].supabase.co/rest/v1/users
```

## 📈 Scaling Considerations

### Free Tier Limits
- Database: 500MB
- Bandwidth: 5GB/month
- Storage: 1GB
- Edge Function invocations: 500K/month

### Pro Tier Benefits ($25/month)
- Database: 8GB
- Bandwidth: 250GB/month
- Storage: 100GB
- Edge Function invocations: 2M/month
- Daily backups
- Email support

### Enterprise Features
- Dedicated resources
- Custom domains
- Advanced security
- SLA guarantees
- Priority support

## 🎯 Production Checklist

- [ ] ✅ Database schema oluşturuldu
- [ ] ✅ RLS politikaları eklendi
- [ ] ✅ Storage bucket'ları yapılandırıldı
- [ ] ✅ Auth ayarları tamamlandı
- [ ] ✅ Performance index'leri eklendi
- [ ] ✅ Backup stratejisi belirlendi
- [ ] ✅ Monitoring kuruldu
- [ ] ✅ Security review yapıldı
- [ ] ✅ Load testing tamamlandı
- [ ] ✅ Documentation güncellendi

**Supabase kurulumunuz tamamlandı! 🎉**