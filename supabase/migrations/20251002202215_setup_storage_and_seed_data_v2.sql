/*
  # Storage Buckets and Seed Data (v2)

  ## Storage Buckets
  1. avatars - User profile pictures (public)
  2. project-images - Project cover images (public)
  3. blog-images - Blog post images (public)
  4. documents - KYC and project documents (private)

  ## Seed Data
  1. Default blog categories
  2. Default staking pools
  3. Sample projects for testing

  ## Storage Policies
  - Public buckets: Read access for everyone
  - Upload access: Authenticated users only
  - Private buckets: Owner and admin access only
*/

-- Insert storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('project-images', 'project-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Avatar images are publicly accessible'
  ) THEN
    CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'avatars');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload avatars'
  ) THEN
    CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update own avatars'
  ) THEN
    CREATE POLICY "Users can update own avatars" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete own avatars'
  ) THEN
    CREATE POLICY "Users can delete own avatars" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Storage policies for project images
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Project images are publicly accessible'
  ) THEN
    CREATE POLICY "Project images are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'project-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload project images'
  ) THEN
    CREATE POLICY "Authenticated users can upload project images" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'project-images' 
        AND auth.role() = 'authenticated'
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can manage project images'
  ) THEN
    CREATE POLICY "Admins can manage project images" ON storage.objects
      FOR ALL USING (
        bucket_id = 'project-images' 
        AND EXISTS (
          SELECT 1 FROM public.users 
          WHERE id = auth.uid() 
          AND role IN ('admin', 'superadmin')
        )
      );
  END IF;
END $$;

-- Storage policies for blog images
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Blog images are publicly accessible'
  ) THEN
    CREATE POLICY "Blog images are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'blog-images');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can manage blog images'
  ) THEN
    CREATE POLICY "Admins can manage blog images" ON storage.objects
      FOR ALL USING (
        bucket_id = 'blog-images' 
        AND EXISTS (
          SELECT 1 FROM public.users 
          WHERE id = auth.uid() 
          AND role IN ('admin', 'superadmin')
        )
      );
  END IF;
END $$;

-- Storage policies for documents
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can access own documents'
  ) THEN
    CREATE POLICY "Users can access own documents" ON storage.objects
      FOR ALL USING (
        bucket_id = 'documents' 
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can access all documents'
  ) THEN
    CREATE POLICY "Admins can access all documents" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'documents' 
        AND EXISTS (
          SELECT 1 FROM public.users 
          WHERE id = auth.uid() 
          AND role IN ('admin', 'superadmin', 'verification_org')
        )
      );
  END IF;
END $$;

-- Insert default blog categories
INSERT INTO public.blog_categories (name, slug, description, color) VALUES
  ('Karbon Kredisi', 'karbon-kredisi', 'Karbon kredisi piyasası ve tokenleştirme hakkında yazılar', '#10b981'),
  ('Sürdürülebilirlik', 'surdurulebilirlik', 'Çevre koruma ve sürdürülebilir kalkınma', '#3b82f6'),
  ('Blockchain', 'blockchain', 'Blockchain teknolojisi ve uygulamaları', '#8b5cf6'),
  ('Yenilenebilir Enerji', 'yenilenebilir-enerji', 'Temiz enerji teknolojileri ve projeleri', '#f59e0b'),
  ('İklim Değişikliği', 'iklim-degisikligi', 'İklim değişikliği ve etkileri', '#ef4444'),
  ('Yeşil Finans', 'yesil-finans', 'Sürdürülebilir finansal ürünler ve yatırımlar', '#06b6d4')
ON CONFLICT (slug) DO NOTHING;

-- Insert default staking pools (minimum 1 day lock period)
INSERT INTO public.staking_pools (name, token_symbol, apy, minimum_stake, lock_period, description, status) VALUES
  ('DCB Flexible Pool', 'DCB', 8.5, 100, 1, 'Flexible staking with minimal 1-day lock period. Nearly instant access.', 'active'),
  ('DCB 30-Day Pool', 'DCB', 12.5, 100, 30, 'Stake for 30 days and earn 12.5% APY', 'active'),
  ('DCB 90-Day Pool', 'DCB', 15.8, 500, 90, 'Stake for 90 days and earn 15.8% APY with higher rewards', 'active'),
  ('DCB 180-Day Pool', 'DCB', 18.2, 1000, 180, 'Long-term staking with premium APY for committed investors', 'active'),
  ('CO2 Carbon Pool', 'CO2', 10.5, 50, 60, 'Stake carbon credits and support environmental projects', 'active')
ON CONFLICT DO NOTHING;