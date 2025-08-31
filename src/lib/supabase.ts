import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key çevre değişkenlerinde tanımlanmalıdır');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types will be generated here
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'superadmin' | 'admin' | 'advisor' | 'verification_org' | 'ngo' | 'carbon_provider' | 'user';
          avatar?: string;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          kyc_status: 'pending' | 'approved' | 'rejected' | 'under_review';
          wallet_address?: string;
          phone?: string;
          country?: string;
          language: 'tr' | 'en';
          two_factor_enabled: boolean;
          last_login?: string;
          email_verified: boolean;
          organization_name?: string;
          organization_type?: string;
          verification_level?: 'basic' | 'advanced' | 'premium';
          assigned_users?: string[];
          specializations?: string[];
          certifications?: string[];
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'superadmin' | 'admin' | 'advisor' | 'verification_org' | 'ngo' | 'carbon_provider' | 'user';
          avatar?: string;
          is_active?: boolean;
          kyc_status?: 'pending' | 'approved' | 'rejected' | 'under_review';
          wallet_address?: string;
          phone?: string;
          country?: string;
          language?: 'tr' | 'en';
          two_factor_enabled?: boolean;
          email_verified?: boolean;
          organization_name?: string;
          organization_type?: string;
          verification_level?: 'basic' | 'advanced' | 'premium';
          assigned_users?: string[];
          specializations?: string[];
          certifications?: string[];
        };
        Update: {
          email?: string;
          name?: string;
          role?: 'superadmin' | 'admin' | 'advisor' | 'verification_org' | 'ngo' | 'carbon_provider' | 'user';
          avatar?: string;
          is_active?: boolean;
          kyc_status?: 'pending' | 'approved' | 'rejected' | 'under_review';
          wallet_address?: string;
          phone?: string;
          country?: string;
          language?: 'tr' | 'en';
          two_factor_enabled?: boolean;
          last_login?: string;
          email_verified?: boolean;
          organization_name?: string;
          organization_type?: string;
          verification_level?: 'basic' | 'advanced' | 'premium';
          assigned_users?: string[];
          specializations?: string[];
          certifications?: string[];
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          location: string;
          category: 'forest' | 'renewable' | 'water' | 'agriculture' | 'technology';
          carbon_credits: number;
          price: number;
          progress: number;
          start_date: string;
          end_date: string;
          participants: number;
          verified: boolean;
          image: string;
          status: 'active' | 'completed' | 'pending' | 'rejected';
          total_funding: number;
          target_funding: number;
          advisor_id?: string;
          documents: string[];
          risk_level: 'low' | 'medium' | 'high';
          expected_return: number;
          minimum_investment: number;
          created_by: string;
          approved_by?: string;
          approved_at?: string;
          rejection_reason?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          location: string;
          category: 'forest' | 'renewable' | 'water' | 'agriculture' | 'technology';
          carbon_credits: number;
          price: number;
          start_date: string;
          end_date: string;
          image: string;
          total_funding: number;
          target_funding: number;
          risk_level: 'low' | 'medium' | 'high';
          expected_return: number;
          minimum_investment: number;
          created_by: string;
          progress?: number;
          participants?: number;
          verified?: boolean;
          status?: 'active' | 'completed' | 'pending' | 'rejected';
          advisor_id?: string;
          documents?: string[];
          approved_by?: string;
          approved_at?: string;
          rejection_reason?: string;
        };
        Update: {
          title?: string;
          description?: string;
          location?: string;
          category?: 'forest' | 'renewable' | 'water' | 'agriculture' | 'technology';
          carbon_credits?: number;
          price?: number;
          progress?: number;
          start_date?: string;
          end_date?: string;
          participants?: number;
          verified?: boolean;
          image?: string;
          status?: 'active' | 'completed' | 'pending' | 'rejected';
          total_funding?: number;
          target_funding?: number;
          advisor_id?: string;
          documents?: string[];
          risk_level?: 'low' | 'medium' | 'high';
          expected_return?: number;
          minimum_investment?: number;
          approved_by?: string;
          approved_at?: string;
          rejection_reason?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string;
          author: string;
          author_avatar?: string;
          published_at: string;
          created_at: string;
          updated_at: string;
          category: string;
          tags: string[];
          cover_image?: string;
          status: 'draft' | 'published';
          language: 'tr' | 'en';
          views: number;
          likes: number;
          read_time: number;
          slug: string;
          seo_title?: string;
          seo_description?: string;
        };
        Insert: {
          title: string;
          content: string;
          excerpt: string;
          author: string;
          author_avatar?: string;
          category: string;
          tags: string[];
          cover_image?: string;
          status?: 'draft' | 'published';
          language?: 'tr' | 'en';
          views?: number;
          likes?: number;
          read_time?: number;
          slug: string;
          seo_title?: string;
          seo_description?: string;
        };
        Update: {
          title?: string;
          content?: string;
          excerpt?: string;
          author?: string;
          author_avatar?: string;
          category?: string;
          tags?: string[];
          cover_image?: string;
          status?: 'draft' | 'published';
          language?: 'tr' | 'en';
          views?: number;
          likes?: number;
          read_time?: number;
          slug?: string;
          seo_title?: string;
          seo_description?: string;
        };
      };
    };
  };
};