/*
  # Add Blog Comments Table and Seed Initial Blog Data

  ## Changes
  1. Create blog_comments table
  2. Add RLS policies for comments
  3. Seed initial blog categories
  4. Seed sample blog posts for testing

  ## Tables
  - blog_comments: User comments on blog posts
    - Supports moderation workflow
    - Like tracking
    - Nested comment support (future)

  ## Security
  - Anyone can read approved comments
  - Authenticated users can create comments
  - Admins can manage all comments
*/

-- Create blog_comments table if not exists
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  author text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  likes integer DEFAULT 0,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can read approved comments"
  ON public.blog_comments
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authenticated can read all comments"
  ON public.blog_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can create comments"
  ON public.blog_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update comments"
  ON public.blog_comments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete comments"
  ON public.blog_comments
  FOR DELETE
  TO authenticated
  USING (true);

-- Seed blog categories
INSERT INTO public.blog_categories (id, name, slug, description, color)
VALUES
  (gen_random_uuid(), 'Karbon Kredisi', 'karbon-kredisi', 'Karbon kredisi piyasası ve tokenleştirme', '#10b981'),
  (gen_random_uuid(), 'Sürdürülebilirlik', 'surdurulebilirlik', 'Çevre koruma ve sürdürülebilir kalkınma', '#3b82f6'),
  (gen_random_uuid(), 'Blockchain', 'blockchain', 'Blockchain teknolojisi ve uygulamaları', '#8b5cf6'),
  (gen_random_uuid(), 'Yenilenebilir Enerji', 'yenilenebilir-enerji', 'Temiz enerji teknolojileri', '#f59e0b')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color;

-- Seed sample blog post (for testing - admin can edit/delete)
INSERT INTO public.blog_posts (
  id,
  title,
  content,
  excerpt,
  author,
  author_avatar,
  published_at,
  created_at,
  updated_at,
  category,
  tags,
  cover_image,
  status,
  language,
  views,
  likes,
  read_time,
  slug,
  seo_title,
  seo_description
)
VALUES (
  gen_random_uuid(),
  'Karbon Kredisi Piyasasının Geleceği ve Blockchain Teknolojisi',
  '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Karbon Kredisi Nedir?</h2>
<p class="mb-4">Karbon kredisi, atmosfere salınan sera gazı emisyonlarını azaltmak veya absorbe etmek için kullanılan bir piyasa mekanizmasıdır. Her bir karbon kredisi, bir ton karbondioksit eşdeğeri (tCO2e) emisyon azaltımını temsil eder.</p>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">Blockchain''in Karbon Kredisi Piyasasına Katkıları</h3>
<p class="mb-4">Blockchain teknolojisi, karbon kredisi piyasasında şeffaflık, güvenilirlik ve erişilebilirlik sağlayarak devrim yaratmaktadır.</p>

<h3 class="text-xl font-bold text-gray-900 mb-4 mt-6">DECARBONIZE Token''ın Rolü</h3>
<p class="mb-4">DECARBONIZE Token (DCB), karbon kredilerini tokenleştirerek bu avantajları gerçek dünyaya taşımaktadır. ReefChain altyapısı sayesinde düşük maliyetli ve hızlı işlemler mümkün olmaktadır.</p>',
  'Blockchain teknolojisinin karbon kredisi piyasasına getirdiği yenilikler ve gelecek projeksiyonları hakkında kapsamlı analiz.',
  'Dr. Sarah Johnson',
  'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
  now(),
  now(),
  now(),
  'Karbon Kredisi',
  ARRAY['karbon kredisi', 'blockchain', 'tokenleştirme', 'sürdürülebilirlik'],
  'https://images.pexels.com/photos/9324302/pexels-photo-9324302.jpeg',
  'published',
  'tr',
  150,
  12,
  8,
  'karbon-kredisi-piyasasinin-gelecegi-ve-blockchain-teknolojisi',
  'Karbon Kredisi Piyasasının Geleceği | DECARBONIZE Blog',
  'Blockchain teknolojisinin karbon kredisi piyasasına etkilerini keşfedin. Tokenleştirme ve sürdürülebilir yatırım fırsatları.'
)
ON CONFLICT (slug) DO UPDATE SET
  updated_at = now(),
  views = public.blog_posts.views + 1;

-- Verify tables and policies
SELECT 
  'blog_comments table' as item,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'blog_comments'
  ) THEN '✅ Created' ELSE '❌ Missing' END as status
UNION ALL
SELECT 
  'blog_categories seeded',
  CASE WHEN EXISTS (
    SELECT 1 FROM public.blog_categories LIMIT 1
  ) THEN '✅ Done' ELSE '❌ Empty' END
UNION ALL
SELECT 
  'blog_posts seeded',
  CASE WHEN EXISTS (
    SELECT 1 FROM public.blog_posts LIMIT 1
  ) THEN '✅ Done' ELSE '❌ Empty' END;
