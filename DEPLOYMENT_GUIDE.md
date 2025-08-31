# DECARBONIZE.world Deployment Rehberi

Bu rehber, DECARBONIZE.world platformunu kendi sunucunuza veya hosting sağlayıcınıza nasıl deploy edeceğinizi adım adım açıklar.

## 🗄️ Supabase Kurulumu ve Konfigürasyonu

DECARBONIZE.world platformu, backend servisleri için Supabase kullanmaktadır. Deployment öncesi Supabase kurulumu zorunludur.

### ⚠️ ÖNEMLİ NOTLAR

1. **Environment Variables Güvenliği**
   - `VITE_SUPABASE_ANON_KEY`: Frontend'de güvenle kullanılabilir (RLS ile korunur)
   - `SUPABASE_SERVICE_ROLE_KEY`: SADECE server-side işlemler için, frontend'de asla kullanmayın!
   - `DATABASE_URL`: Direkt veritabanı bağlantısı, migrations ve admin işlemler için

2. **RLS (Row Level Security) Zorunlu**
   - Her tablo için RLS aktif edilmelidir
   - Güvenlik politikaları doğru yapılandırılmalıdır
   - Test kullanıcıları ile politikalar test edilmelidir

3. **Backup ve Monitoring**
   - Otomatik backup'lar aktif edilmelidir
   - Error tracking ve monitoring kurulmalıdır
   - Performance metrikleri takip edilmelidir

### Adım 1: Supabase Projesi Oluşturma

1. **Supabase Hesabı Oluşturun**
   - [supabase.com](https://supabase.com) adresine gidin
   - "Start your project" butonuna tıklayın
   - GitHub, Google veya e-posta ile hesap oluşturun

2. **Yeni Proje Oluşturun**
   ```bash
   # Proje bilgileri
   Proje Adı: decarbonize-production
   Veritabanı Şifresi: [Güçlü bir şifre belirleyin]
   Bölge: Europe West (Ireland) [Türkiye için önerilen]
   ```

3. **Proje Ayarlarını Alın**
   - Dashboard > Settings > API
   - Aşağıdaki bilgileri kaydedin:
     - **Project URL**: `https://your-project-ref.supabase.co`
     - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Adım 1.5: Güvenlik Konfigürasyonu

1. **Authentication Ayarları**
   ```bash
   # Dashboard > Authentication > Settings
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

2. **API Güvenlik Ayarları**
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

### Adım 2: Veritabanı Schema Kurulumu

1. **SQL Editor'ı Açın**
   - Dashboard > SQL Editor
   - "New query" butonuna tıklayın

2. **Temel Tabloları Oluşturun**
   ```sql
   -- Enable necessary extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
   
   -- Users tablosu (auth.users'ı genişletir)
   CREATE TABLE public.users (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
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
   
   -- Blog categories tablosu
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
   
   -- KYC applications tablosu
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
   
   -- Investments tablosu
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
   
   -- Staking pools tablosu
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
   
   -- Staking positions tablosu
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

   -- Projects tablosu
   CREATE TABLE public.projects (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     location TEXT NOT NULL,
     category TEXT NOT NULL CHECK (category IN ('forest', 'renewable', 'water', 'agriculture', 'technology')),
     carbon_credits INTEGER NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
     start_date DATE NOT NULL,
     end_date DATE NOT NULL,
     participants INTEGER DEFAULT 0,
     verified BOOLEAN DEFAULT FALSE,
     image TEXT NOT NULL,
     status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'completed', 'pending', 'rejected')),
     total_funding DECIMAL(12,2) DEFAULT 0,
     target_funding DECIMAL(12,2) NOT NULL,
     advisor_id UUID REFERENCES public.users(id),
     documents TEXT[] DEFAULT '{}',
     risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
     expected_return DECIMAL(5,2) NOT NULL,
     minimum_investment DECIMAL(10,2) NOT NULL,
     created_by UUID REFERENCES public.users(id) NOT NULL,
     approved_by UUID REFERENCES public.users(id),
     approved_at TIMESTAMPTZ,
     rejection_reason TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Blog Posts tablosu
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
     views INTEGER DEFAULT 0,
     likes INTEGER DEFAULT 0,
     read_time INTEGER DEFAULT 1,
     slug TEXT UNIQUE NOT NULL,
     seo_title TEXT,
     seo_description TEXT
   );
   ```

3. **Row Level Security (RLS) Politikalarını Ekleyin**
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
   
   -- Users tablosu için RLS
   CREATE POLICY "Users can read own data" ON public.users
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own data" ON public.users
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

   -- Projects tablosu için RLS
   CREATE POLICY "Anyone can read published projects" ON public.projects
     FOR SELECT USING (status = 'active');

   CREATE POLICY "Users can create projects" ON public.projects
     FOR INSERT WITH CHECK (auth.uid() = created_by);

   CREATE POLICY "Project owners can update" ON public.projects
     FOR UPDATE USING (auth.uid() = created_by);

   CREATE POLICY "Admins can manage all projects" ON public.projects
     FOR ALL USING (
       EXISTS (
         SELECT 1 FROM public.users 
         WHERE id = auth.uid() 
         AND role IN ('admin', 'superadmin')
       )
     );

   -- Blog Posts tablosu için RLS
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

4. **Veritabanı Fonksiyonlarını Ekleyin**
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
   
   -- Blog post views artırma fonksiyonu
   CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
   RETURNS VOID AS $$
   BEGIN
     UPDATE public.blog_posts 
     SET views = views + 1, updated_at = NOW()
     WHERE id = post_id;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Blog post likes artırma fonksiyonu
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

### Adım 3: Storage Bucket'larını Oluşturun

1. **Storage Bölümüne Gidin**
   - Dashboard > Storage
   - "Create a new bucket" butonuna tıklayın

2. **Bucket'ları Oluşturun**
   ```bash
   # Gerekli bucket'lar
   - avatars (Kullanıcı profil fotoğrafları)
   - project-images (Proje görselleri)
   - blog-images (Blog görselleri)
   - documents (KYC belgeleri - private)
   ```

3. **Bucket Politikalarını Ayarlayın**
   ```sql
   -- Avatars bucket - Public read, authenticated write
   INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
   
   CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
     FOR SELECT USING (bucket_id = 'avatars');
   
   CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
   
   CREATE POLICY "Users can update own avatars" ON storage.objects
     FOR UPDATE USING (
       bucket_id = 'avatars' 
       AND auth.role() = 'authenticated'
       AND (storage.foldername(name))[1] = auth.uid()::text
     );

   -- Project images bucket - Public read, admin write
   INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
   
   CREATE POLICY "Project images are publicly accessible" ON storage.objects
     FOR SELECT USING (bucket_id = 'project-images');
   
   CREATE POLICY "Admins can manage project images" ON storage.objects
     FOR ALL USING (
       bucket_id = 'project-images' AND 
       EXISTS (
         SELECT 1 FROM public.users 
         WHERE id = auth.uid() 
         AND role IN ('admin', 'superadmin')
       )
     );
   
   -- Blog images bucket - Public read, admin write
   INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
   
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

   -- Documents bucket - Private
   INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
   
   CREATE POLICY "Users can access own documents" ON storage.objects
     FOR ALL USING (
       bucket_id = 'documents' AND 
       (auth.uid()::text = (storage.foldername(name))[1])
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

### Adım 4: Performance Indexes

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

### Adım 5: Seed Data

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

### Adım 6: Environment Variables Ayarlama

**Geliştirme için (.env.local):**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Service Role Key (sadece server-side işlemler için)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Direct Connection (migrations için)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres

# Application Settings
VITE_APP_NAME=DECARBONIZE.world
VITE_APP_URL=http://localhost:5173
VITE_ENVIRONMENT=development
```

**Production için:**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Settings
VITE_APP_NAME=DECARBONIZE.world
VITE_APP_URL=https://your-domain.com
VITE_ENVIRONMENT=production
```

### Adım 7: Supabase CLI Kurulumu (Opsiyonel - Local Development)

```bash
# Supabase CLI kurulumu
npm install -g supabase

# Proje dizininde Supabase'i başlatın
supabase init

# Local Supabase instance başlatın
supabase start

# Migration'ları uygulayın
supabase db push

# Type definitions oluşturun
supabase gen types typescript --local > src/types/supabase.ts
```

### Adım 8: Backup ve Monitoring

1. **Otomatik Backup Ayarlama**
   - Dashboard > Settings > Database
   - Point-in-time recovery aktif edin
   - Günlük backup schedule ayarlayın

2. **Monitoring ve Alertler**
   - Dashboard > Settings > Monitoring
   - CPU, Memory, Disk kullanım alertleri
   - E-posta bildirimlerini aktif edin

3. **API Rate Limiting**
   - Dashboard > Settings > API
   - Rate limiting kurallarını ayarlayın
   - Abuse protection aktif edin

### Adım 9: Güvenlik Ayarları

1. **Database Security**
   ```sql
   -- IP whitelist (opsiyonel)
   -- Dashboard > Settings > Database > Network Restrictions
   
   -- SSL zorunlu kılma
   ALTER SYSTEM SET ssl = on;
   
   -- Connection pooling
   -- Dashboard > Settings > Database > Connection pooling
   ```

2. **Connection Pooling**
   - Dashboard > Settings > Database
   - Connection pooling aktif edin
   - Pool size: 15-20 (starter plan için)

3. **CDN ve Caching**
   - Supabase Edge Functions kullanın
   - Static asset'ler için CDN ayarlayın
   - Browser caching headers ekleyin

### Adım 10: Supabase Deployment Checklist

**Deployment öncesi kontrol listesi:**

- [ ] ✅ Supabase projesi oluşturuldu
- [ ] ✅ Veritabanı schema kuruldu
- [ ] ✅ RLS politikaları eklendi
- [ ] ✅ Storage bucket'ları oluşturuldu
- [ ] ✅ Auth ayarları yapılandırıldı
- [ ] ✅ Environment variables ayarlandı
- [ ] ✅ Admin kullanıcısı oluşturuldu
- [ ] ✅ Backup ayarları yapıldı
- [ ] ✅ Monitoring aktif edildi
- [ ] ✅ Güvenlik ayarları tamamlandı
- [ ] ✅ Performance optimizasyonları uygulandı
- [ ] ✅ Seed data eklendi
- [ ] ✅ Indexes oluşturuldu
- [ ] ✅ Functions ve triggers eklendi

### Adım 11: Test ve Doğrulama

```bash
# Local test
npm run dev

# Supabase bağlantısını test edin
# Browser console'da:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

# Auth test
# Kayıt ol sayfasından test kullanıcısı oluşturun
# Login sayfasından giriş yapın
# Dashboard'a erişimi kontrol edin
```

### Adım 12: Production Deployment

1. **Environment Variables Kontrolü**
   ```bash
   # Production .env dosyasında olması gerekenler:
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_APP_NAME=DECARBONIZE.world
   VITE_APP_URL=https://your-domain.com
   VITE_ENVIRONMENT=production
   ```

2. **Database Migration Kontrolü**
   ```sql
   -- Tüm tabloların oluşturulduğunu kontrol edin
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   
   -- RLS politikalarının aktif olduğunu kontrol edin
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

3. **Final Test Checklist**
   - [ ] ✅ Kullanıcı kayıt/giriş çalışıyor
   - [ ] ✅ Dashboard erişimi çalışıyor
   - [ ] ✅ Blog sistemi çalışıyor
   - [ ] ✅ Proje listesi çalışıyor
   - [ ] ✅ Admin paneli çalışıyor
   - [ ] ✅ File upload çalışıyor
   - [ ] ✅ Real-time updates çalışıyor

### Supabase Maliyet Optimizasyonu

1. **Free Tier Limitleri**
   - 500MB veritabanı
   - 1GB bandwidth/ay
   - 50,000 monthly active users
   - 2 concurrent connections

2. **Pro Plan Özellikleri ($25/ay)**
   - 8GB veritabanı
   - 250GB bandwidth/ay
   - 100,000 monthly active users
   - 60 concurrent connections
   - Daily backups
   - Email support

3. **Maliyet Azaltma İpuçları**
   - Gereksiz query'leri optimize edin
   - Index'leri doğru kullanın
   - Connection pooling aktif edin
   - Büyük dosyaları CDN'de saklayın
   - Eski log'ları temizleyin
   - Unused storage files'ları silin
   - API rate limiting kullanın
   - Efficient RLS policies yazın

## 📋 Gereksinimler

### Minimum Sistem Gereksinimleri
- **Node.js**: v18.0.0 veya üzeri
- **npm**: v8.0.0 veya üzeri
- **RAM**: En az 2GB
- **Disk**: En az 10GB boş alan
- **Bandwidth**: Aylık en az 100GB

### Önerilen Hosting Sağlayıcıları
1. **Netlify** (Ücretsiz/Ücretli)
2. **Vercel** (Ücretsiz/Ücretli)
3. **GitHub Pages** (Ücretsiz)
4. **AWS S3 + CloudFront** (Ücretli)
5. **DigitalOcean** (Ücretli)

## 🚀 Deployment Seçenekleri

### Seçenek 1: Netlify (Önerilen - En Kolay)

#### Adım 1: Netlify Hesabı Oluşturun
1. [netlify.com](https://netlify.com) adresine gidin
2. "Sign up" butonuna tıklayın
3. GitHub, GitLab veya e-posta ile hesap oluşturun

#### Adım 2: Projeyi GitHub'a Yükleyin
```bash
# Yeni bir GitHub repository oluşturun
# Projeyi klonlayın veya indirin
git clone [PROJE_URL]
cd decarbonize-platform

# Bağımlılıkları yükleyin
npm install

# Build alın
npm run build

# GitHub'a push edin
git add .
git commit -m "Initial deployment"
git push origin main
```

#### Adım 3: Netlify'da Deploy Edin
1. Netlify dashboard'a gidin
2. "New site from Git" butonuna tıklayın
3. GitHub'ı seçin ve repository'nizi bulun
4. Build ayarları:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. "Deploy site" butonuna tıklayın

#### Adım 4: Domain Ayarları (Opsiyonel)
1. Site settings > Domain management
2. "Add custom domain" ile kendi domain'inizi ekleyin
3. DNS ayarlarını yapın

#### Adım 5: Supabase Environment Variables
1. Site settings > Environment variables
2. Yukarıdaki Supabase değişkenlerini ekleyin
3. Deploy'u tetikleyin: "Trigger deploy"

### Seçenek 2: Vercel

#### Adım 1: Vercel CLI Kurulumu
```bash
npm install -g vercel
```

#### Adım 2: Deploy
```bash
# Proje dizininde
vercel

# İlk defa deploy ediyorsanız:
# - Vercel hesabınızla giriş yapın
# - Proje ayarlarını onaylayın
# - Environment variables ekleyin
# - Deploy işlemi otomatik başlar
```

#### Vercel Environment Variables
```bash
# Vercel Dashboard > Project > Settings > Environment Variables
# Tüm Supabase değişkenlerini ekleyin
```

### Seçenek 3: GitHub Pages

#### Adım 1: GitHub Actions Workflow
`.github/workflows/deploy.yml` dosyası oluşturun:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_APP_NAME: ${{ secrets.VITE_APP_NAME }}
        VITE_APP_URL: ${{ secrets.VITE_APP_URL }}
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### Adım 2: Repository Ayarları
1. GitHub repository > Settings > Pages
2. Source: "Deploy from a branch"
3. Branch: "gh-pages"
4. Folder: "/ (root)"
5. Secrets > Actions > Repository secrets
6. Supabase environment variables'ları ekleyin

### Seçenek 4: Kendi Sunucunuz (VPS/Dedicated)

#### Adım 1: Sunucu Hazırlığı
```bash
# Ubuntu/Debian için
sudo apt update
sudo apt install nginx nodejs npm git

# Node.js'i güncelleyin
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Adım 2: Proje Kurulumu
```bash
# Projeyi klonlayın
git clone [PROJE_URL] /var/www/decarbonize
cd /var/www/decarbonize

# Bağımlılıkları yükleyin
npm install

# Production build alın
npm run build

# Environment variables ayarlayın
cp .env.example .env.production
nano .env.production
# Supabase bilgilerini girin

# Dosya izinlerini ayarlayın
sudo chown -R www-data:www-data /var/www/decarbonize
sudo chmod -R 755 /var/www/decarbonize
```

#### Adım 3: Nginx Konfigürasyonu
`/etc/nginx/sites-available/decarbonize` dosyası oluşturun:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/decarbonize/dist;
    index index.html;
    
    # SPA routing için
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static dosyalar için cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

#### Adım 4: SSL Sertifikası (Let's Encrypt)
```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası alın
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Otomatik yenileme
sudo crontab -e
# Şu satırı ekleyin:
0 12 * * * /usr/bin/certbot renew --quiet
```

#### Adım 5: Nginx'i Başlatın
```bash
# Site'ı aktif edin
sudo ln -s /etc/nginx/sites-available/decarbonize /etc/nginx/sites-enabled/

# Nginx'i test edin
sudo nginx -t

# Nginx'i yeniden başlatın
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 🔧 Çevre Değişkenleri (Environment Variables)

Deployment öncesi aşağıdaki çevre değişkenlerini ayarlayın:

### Netlify/Vercel için
Site settings > Environment variables bölümünden ekleyin:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=DECARBONIZE.world
VITE_APP_URL=https://your-domain.com
VITE_WALLET_CONNECT_PROJECT_ID=your-walletconnect-id
VITE_ENVIRONMENT=production
```

### VPS için
`.env.production` dosyası oluşturun:

```bash
# .env.production
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=DECARBONIZE.world
VITE_APP_URL=https://your-domain.com
VITE_WALLET_CONNECT_PROJECT_ID=your-walletconnect-id
VITE_ENVIRONMENT=production
```

### Supabase Environment Variables Açıklaması

```bash
# ZORUNLU DEĞIŞKENLER
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
# Açıklama: Supabase projenizin ana URL'si
# Nereden alınır: Supabase Dashboard > Settings > API > Project URL
# Örnek: https://abcdefghijklmnop.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Açıklama: Public API anahtarı, frontend'de güvenle kullanılabilir
# Nereden alınır: Supabase Dashboard > Settings > API > Project API keys > anon public
# Güvenlik: Bu anahtar public'tir, RLS politikaları ile korunur

# OPSIYONEL DEĞIŞKENLER
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Açıklama: Admin işlemleri için service role anahtarı
# Nereden alınır: Supabase Dashboard > Settings > API > Project API keys > service_role secret
# UYARI: Bu anahtar GİZLİ tutulmalı, sadece server-side kullanılmalı

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
# Açıklama: Direkt veritabanı bağlantısı (migrations için)
# Nereden alınır: Supabase Dashboard > Settings > Database > Connection string
# Kullanım: Database migrations, admin scripts

VITE_APP_NAME=DECARBONIZE.world
# Açıklama: Uygulama adı, meta title'larda kullanılır

VITE_APP_URL=https://your-domain.com
# Açıklama: Production domain URL'si
# Kullanım: Auth redirects, email templates, social sharing
```

## 🔒 Güvenlik Ayarları

### 1. HTTPS Zorunlu
```nginx
# HTTP'den HTTPS'e yönlendirme
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 2. Security Headers
```nginx
# Nginx'e güvenlik header'ları ekleyin
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 3. Rate Limiting
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
}
```

## 📊 Monitoring ve Analytics

### 1. Google Analytics
`index.html` dosyasına ekleyin:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Tracking (Sentry)
```bash
npm install @sentry/react @sentry/tracing
```

### 3. Performance Monitoring
```bash
# Web Vitals
npm install web-vitals
```

## 🔄 Otomatik Deployment

### GitHub Actions ile CI/CD
`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /var/www/decarbonize
          git pull origin main
          npm ci
          npm run build
          sudo systemctl reload nginx
```

## 🐛 Troubleshooting

### Yaygın Sorunlar ve Çözümleri

#### 1. Supabase Bağlantı Sorunları
```bash
# Environment variables kontrol edin
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Browser console'da hata mesajlarını kontrol edin
# Network tab'ında Supabase API çağrılarını inceleyin

# CORS hatası alıyorsanız:
# Supabase Dashboard > Authentication > Settings > Site URL
# Production domain'inizi ekleyin
```

#### 2. Auth Sorunları
```bash
# Email confirmation çalışmıyorsa:
# Supabase Dashboard > Authentication > Settings
# "Enable email confirmations" kontrol edin
# Email templates'i kontrol edin

# Redirect URL sorunları:
# Dashboard > Authentication > URL Configuration
# Redirect URLs listesini kontrol edin
```

#### 3. Database Permission Sorunları
```sql
-- RLS politikalarını kontrol edin
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- User role'ünü kontrol edin
SELECT id, email, role FROM public.users WHERE email = 'your-email@example.com';
```

#### 4. Performance Sorunları
```bash
# Slow query'leri tespit edin
# Supabase Dashboard > Database > Query Performance

# Index'leri kontrol edin
# Dashboard > Database > Indexes

# Connection pool'u optimize edin
# Dashboard > Settings > Database > Connection pooling
```

#### 1. Build Hatası
```bash
# Node modules'ı temizleyin
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Routing Sorunları (404 Hatası)
SPA routing için server konfigürasyonunu kontrol edin.

#### 3. Environment Variables Yüklenmiyor
- Değişken adlarının `VITE_` ile başladığından emin olun
- Build işlemini yeniden çalıştırın

#### 4. SSL Sertifikası Sorunları
```bash
# Certbot loglarını kontrol edin
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Sertifikayı yenileyin
sudo certbot renew --dry-run
```

## 📞 Destek

Deployment sırasında sorun yaşarsanız:

### Supabase Destek
1. **Dokümantasyon**: [supabase.com/docs](https://supabase.com/docs)
2. **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
3. **Discord**: [discord.supabase.com](https://discord.supabase.com)
4. **Support**: Pro plan ve üzeri için e-posta desteği

### DECARBONIZE Destek
1. **Dokümantasyon**: Bu rehberi tekrar okuyun
2. **Loglar**: Browser console ve server loglarını kontrol edin
3. **Community**: GitHub Issues bölümünde sorun bildirin
4. **E-posta**: support@decarbonize.world

### Debugging Araçları

```bash
# Supabase CLI ile debug
supabase status
supabase logs

# Database connection test
psql "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# API endpoint test
curl -H "apikey: [ANON_KEY]" https://[REF].supabase.co/rest/v1/users
```

## 🎉 Deployment Sonrası

Deployment tamamlandıktan sonra:

1. ✅ Tüm sayfaların çalıştığını kontrol edin
2. ✅ Supabase bağlantısını test edin
3. ✅ Auth sistemi çalışıyor mu kontrol edin
4. ✅ Database CRUD işlemlerini test edin
2. ✅ Responsive tasarımı test edin
3. ✅ Form gönderimlerini test edin
4. ✅ SSL sertifikasını kontrol edin
5. ✅ Performance testleri yapın
6. ✅ SEO ayarlarını kontrol edin
7. ✅ Supabase Dashboard'da metrics'leri inceleyin
8. ✅ Error tracking ve monitoring ayarlayın

**Tebrikler! 🎊 DECARBONIZE.world platformunuz artık canlıda!**