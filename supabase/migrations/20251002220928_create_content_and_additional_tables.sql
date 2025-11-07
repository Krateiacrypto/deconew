/*
  # Create Additional Content and System Tables

  ## Overview
  This migration creates all missing tables for:
  - Content Management (pages, about, mission, vision)
  - Roadmap items
  - Team members
  - Banners/Sliders
  - Advisors
  - ICO/Token sale data

  ## Tables Created
  1. content_items - CMS content (mission, vision, about, etc.)
  2. roadmap_items - Project roadmap phases
  3. team_members - Team and staff
  4. banners - Homepage banners/sliders
  5. advisors - Project advisors
  6. ico_config - ICO configuration and stages
  7. content_versions - Version history for content
  8. content_audit_logs - Audit trail for changes

  ## Security
  - RLS enabled on all tables
  - Authenticated users can manage content
  - Public can read published content
*/

-- ============================================
-- 1. CONTENT ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- 'mission', 'vision', 'about', 'faq', 'terms', 'privacy'
  title text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'draft', -- 'draft', 'published'
  language text DEFAULT 'tr',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by text NOT NULL,
  updated_by text NOT NULL,
  version integer DEFAULT 1,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON public.content_items(status);

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published content"
  ON public.content_items FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated can read all content"
  ON public.content_items FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated can manage content"
  ON public.content_items FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 2. ROADMAP ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase text NOT NULL, -- 'Q1 2024', 'Q2 2024', etc.
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending', -- 'pending', 'active', 'completed', 'delayed'
  start_date date,
  end_date date,
  items text[] DEFAULT ARRAY[]::text[],
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_roadmap_order ON public.roadmap_items(order_index);

ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read roadmap"
  ON public.roadmap_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can manage roadmap"
  ON public.roadmap_items FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 3. TEAM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  avatar text,
  linkedin text,
  twitter text,
  email text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_order ON public.team_members(order_index);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active team members"
  ON public.team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage team"
  ON public.team_members FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 4. BANNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image text NOT NULL,
  link text,
  button_text text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_banners_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_order ON public.banners(order_index);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active banners"
  ON public.banners FOR SELECT
  USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  );

CREATE POLICY "Authenticated can manage banners"
  ON public.banners FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 5. ADVISORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  avatar text,
  expertise text[] DEFAULT ARRAY[]::text[],
  languages text[] DEFAULT ARRAY[]::text[],
  rating numeric(3,2) DEFAULT 0,
  total_consultations integer DEFAULT 0,
  hourly_rate numeric(10,2),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisors_available ON public.advisors(is_available);

ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read available advisors"
  ON public.advisors FOR SELECT
  USING (is_available = true);

CREATE POLICY "Authenticated can read all advisors"
  ON public.advisors FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated can manage advisors"
  ON public.advisors FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 6. ICO CONFIGURATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ico_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage text NOT NULL, -- 'private', 'presale', 'public'
  stage_name text NOT NULL,
  token_price numeric(10,4) NOT NULL,
  tokens_available bigint NOT NULL,
  tokens_sold bigint DEFAULT 0,
  bonus_percentage integer DEFAULT 0,
  min_purchase numeric(10,2) DEFAULT 0,
  max_purchase numeric(10,2),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ico_active ON public.ico_config(is_active);

ALTER TABLE public.ico_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active ICO config"
  ON public.ico_config FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage ICO config"
  ON public.ico_config FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- 7. CONTENT VERSIONS TABLE (for version history)
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  version_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON public.content_versions(content_id);

ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read versions"
  ON public.content_versions FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated can create versions"
  ON public.content_versions FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================
-- 8. CONTENT AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.content_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL, -- 'content', 'roadmap', 'team', 'banner', etc.
  content_id text NOT NULL,
  action text NOT NULL, -- 'create', 'update', 'delete', 'publish', 'unpublish'
  user_email text NOT NULL,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_content_id ON public.content_audit_logs(content_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.content_audit_logs(created_at);

ALTER TABLE public.content_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read audit logs"
  ON public.content_audit_logs FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated can create audit logs"
  ON public.content_audit_logs FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================
-- SEED DATA - Preserve existing localStorage data
-- ============================================

-- Seed Content Items
INSERT INTO public.content_items (type, title, content, status, published_at, created_by, updated_by)
VALUES
  ('mission', 'Misyonumuz', 'Blockchain teknolojisinin gücünü kullanarak karbon kredilerini tokenleştirmek, şeffaf ve erişilebilir bir karbon piyasası oluşturmak.', 'published', now(), 'admin', 'admin'),
  ('vision', 'Vizyonumuz', 'Küresel karbon nötrleme hedeflerine ulaşılmasında öncü rol oynamak ve sürdürülebilir bir gelecek için teknoloji ile çevre koruma arasında köprü kurmak.', 'published', now(), 'admin', 'admin'),
  ('about', 'Hakkımızda', 'DECARBONIZE.world, karbon kredilerini blockchain teknolojisi ile tokenleştirerek çevre dostu projelere yatırımı demokratikleştiren yenilikçi bir platformdur.', 'published', now(), 'admin', 'admin')
ON CONFLICT DO NOTHING;

-- Seed Roadmap Items
INSERT INTO public.roadmap_items (phase, title, description, status, start_date, end_date, items, order_index)
VALUES
  ('Q1 2024', 'Platform Lansmanı', 'DECARBONIZE platformunun beta versiyonu', 'completed', '2024-01-01', '2024-03-31', ARRAY['ICO Başlangıcı', 'Smart Contract Denetimi', 'Community Building'], 1),
  ('Q2 2024', 'Token Satışı', 'DCB Token public sale ve exchange listelemeleri', 'active', '2024-04-01', '2024-06-30', ARRAY['Public Sale', 'Exchange Listelemeleri', 'Staking Protokolü'], 2),
  ('Q3 2024', 'Platform Genişlemesi', 'Yeni özellikler ve ortaklıklar', 'pending', '2024-07-01', '2024-09-30', ARRAY['Mobil Uygulama', 'Yeni Proje Entegrasyonları', 'DAO Yönetimi'], 3),
  ('Q4 2024', 'Global Büyüme', 'Uluslararası pazarlara açılım', 'pending', '2024-10-01', '2024-12-31', ARRAY['Avrupa Pazarı', 'Kurumsal Ortaklıklar', 'Carbon Offset Sertifikaları'], 4)
ON CONFLICT DO NOTHING;

-- Seed Team Members
INSERT INTO public.team_members (name, role, bio, avatar, order_index, is_active)
VALUES
  ('İsmail Ayrancı', 'CEO & Founder', 'Blockchain ve sürdürülebilirlik alanında 10+ yıl deneyim', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 1, true),
  ('Dr. Sarah Johnson', 'CTO', 'Distributed systems ve smart contract uzmanı', 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg', 2, true),
  ('Prof. Ahmed Hassan', 'Chief Sustainability Officer', 'Çevre bilimleri profesörü, karbon kredisi uzmanı', 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg', 3, true),
  ('Ayşe Demir', 'Head of Operations', 'Proje yönetimi ve operasyonel mükemmellik', 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg', 4, true)
ON CONFLICT DO NOTHING;

-- Seed Banners
INSERT INTO public.banners (title, subtitle, image, link, button_text, order_index, is_active)
VALUES
  ('DECARBONIZE Token ICO', 'Karbon kredilerini tokenleştirerek geleceğe yatırım yapın', 'https://images.pexels.com/photos/9324302/pexels-photo-9324302.jpeg', '/ico', 'ICO''ya Katıl', 1, true),
  ('Sürdürülebilir Projeler', 'Doğrulanmış karbon kredisi projelerine yatırım yapın', 'https://images.pexels.com/photos/9324301/pexels-photo-9324301.jpeg', '/projects', 'Projeleri İncele', 2, true),
  ('Blockchain ile Şeffaflık', 'Tüm işlemler blockchain üzerinde kaydedilir', 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg', '/about', 'Daha Fazla Bilgi', 3, true)
ON CONFLICT DO NOTHING;

-- Seed Advisors
INSERT INTO public.advisors (name, title, bio, avatar, expertise, languages, rating, hourly_rate, is_available)
VALUES
  ('Dr. Michael Chen', 'Carbon Credit Specialist', '15 yıllık karbon piyasası deneyimi', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', ARRAY['carbon credits', 'sustainability', 'project verification'], ARRAY['English', 'Chinese', 'Turkish'], 4.8, 150.00, true),
  ('Emma Rodriguez', 'Blockchain Consultant', 'Smart contract ve DeFi uzmanı', 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg', ARRAY['blockchain', 'smart contracts', 'tokenization'], ARRAY['English', 'Spanish'], 4.9, 200.00, true),
  ('Dr. Yuki Tanaka', 'ESG Investment Advisor', 'Sürdürülebilir yatırım stratejileri', 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg', ARRAY['ESG investing', 'green finance', 'impact assessment'], ARRAY['English', 'Japanese'], 4.7, 175.00, true)
ON CONFLICT DO NOTHING;

-- Seed ICO Configuration
INSERT INTO public.ico_config (stage, stage_name, token_price, tokens_available, tokens_sold, bonus_percentage, min_purchase, max_purchase, start_date, end_date, is_active)
VALUES
  ('private', 'Private Sale', 0.05, 50000000, 35000000, 40, 1000, 100000, '2024-01-01', '2024-03-31', false),
  ('presale', 'Pre-Sale', 0.08, 100000000, 78000000, 25, 100, 50000, '2024-04-01', '2024-06-30', true),
  ('public', 'Public Sale', 0.12, 150000000, 0, 0, 10, 10000, '2024-07-01', '2024-09-30', false)
ON CONFLICT DO NOTHING;

-- Verify tables created
SELECT 
  'Tables Created' as status,
  COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'content_items', 'roadmap_items', 'team_members', 
    'banners', 'advisors', 'ico_config', 
    'content_versions', 'content_audit_logs'
  );
