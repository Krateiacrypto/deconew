export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'superadmin' | 'admin' | 'advisor' | 'verification_org' | 'ngo' | 'carbon_provider' | 'user'
          avatar: string | null
          created_at: string
          updated_at: string
          is_active: boolean
          kyc_status: 'pending' | 'approved' | 'rejected' | 'under_review'
          wallet_address: string | null
          phone: string | null
          country: string | null
          language: 'tr' | 'en'
          two_factor_enabled: boolean
          last_login: string | null
          email_verified: boolean
          organization_name: string | null
          organization_type: string | null
          verification_level: 'basic' | 'advanced' | 'premium' | null
          assigned_users: string[] | null
          specializations: string[] | null
          certifications: string[] | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'superadmin' | 'admin' | 'advisor' | 'verification_org' | 'ngo' | 'carbon_provider' | 'user'
          avatar?: string | null
          is_active?: boolean
          kyc_status?: 'pending' | 'approved' | 'rejected' | 'under_review'
          wallet_address?: string | null
          phone?: string | null
          country?: string | null
          language?: 'tr' | 'en'
          two_factor_enabled?: boolean
          email_verified?: boolean
          organization_name?: string | null
          organization_type?: string | null
          verification_level?: 'basic' | 'advanced' | 'premium' | null
          assigned_users?: string[] | null
          specializations?: string[] | null
          certifications?: string[] | null
        }
        Update: {
          email?: string
          name?: string
          role?: 'superadmin' | 'admin' | 'advisor' | 'verification_org' | 'ngo' | 'carbon_provider' | 'user'
          avatar?: string | null
          is_active?: boolean
          kyc_status?: 'pending' | 'approved' | 'rejected' | 'under_review'
          wallet_address?: string | null
          phone?: string | null
          country?: string | null
          language?: 'tr' | 'en'
          two_factor_enabled?: boolean
          last_login?: string | null
          email_verified?: boolean
          organization_name?: string | null
          organization_type?: string | null
          verification_level?: 'basic' | 'advanced' | 'premium' | null
          assigned_users?: string[] | null
          specializations?: string[] | null
          certifications?: string[] | null
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          category: 'forest' | 'renewable' | 'water' | 'agriculture' | 'technology'
          carbon_credits: number
          price: number
          progress: number
          start_date: string
          end_date: string
          participants: number
          verified: boolean
          image: string
          status: 'active' | 'completed' | 'pending' | 'rejected'
          total_funding: number
          target_funding: number
          advisor_id: string | null
          documents: string[]
          risk_level: 'low' | 'medium' | 'high'
          expected_return: number
          minimum_investment: number
          created_by: string
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          description: string
          location: string
          category: 'forest' | 'renewable' | 'water' | 'agriculture' | 'technology'
          carbon_credits: number
          price: number
          start_date: string
          end_date: string
          image: string
          target_funding: number
          risk_level: 'low' | 'medium' | 'high'
          expected_return: number
          minimum_investment: number
          created_by: string
          progress?: number
          participants?: number
          verified?: boolean
          status?: 'active' | 'completed' | 'pending' | 'rejected'
          total_funding?: number
          advisor_id?: string | null
          documents?: string[]
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
        }
        Update: {
          title?: string
          description?: string
          location?: string
          category?: 'forest' | 'renewable' | 'water' | 'agriculture' | 'technology'
          carbon_credits?: number
          price?: number
          progress?: number
          start_date?: string
          end_date?: string
          participants?: number
          verified?: boolean
          image?: string
          status?: 'active' | 'completed' | 'pending' | 'rejected'
          total_funding?: number
          target_funding?: number
          advisor_id?: string | null
          documents?: string[]
          risk_level?: 'low' | 'medium' | 'high'
          expected_return?: number
          minimum_investment?: number
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          author: string
          author_avatar: string | null
          published_at: string
          created_at: string
          updated_at: string
          category: string
          tags: string[]
          cover_image: string | null
          status: 'draft' | 'published'
          language: 'tr' | 'en'
          views: number
          likes: number
          read_time: number
          slug: string
          seo_title: string | null
          seo_description: string | null
        }
        Insert: {
          title: string
          content: string
          excerpt: string
          author: string
          author_avatar?: string | null
          category: string
          tags: string[]
          cover_image?: string | null
          status?: 'draft' | 'published'
          language?: 'tr' | 'en'
          views?: number
          likes?: number
          read_time?: number
          slug: string
          seo_title?: string | null
          seo_description?: string | null
        }
        Update: {
          title?: string
          content?: string
          excerpt?: string
          author?: string
          author_avatar?: string | null
          category?: string
          tags?: string[]
          cover_image?: string | null
          status?: 'draft' | 'published'
          language?: 'tr' | 'en'
          views?: number
          likes?: number
          read_time?: number
          slug?: string
          seo_title?: string | null
          seo_description?: string | null
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          post_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          color?: string
          post_count?: number
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          color?: string
          post_count?: number
        }
      }
      kyc_applications: {
        Row: {
          id: string
          user_id: string
          personal_info: Json
          documents: string[]
          status: 'pending' | 'approved' | 'rejected' | 'under_review'
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          personal_info: Json
          documents?: string[]
          status?: 'pending' | 'approved' | 'rejected' | 'under_review'
          reviewed_by?: string | null
          rejection_reason?: string | null
        }
        Update: {
          personal_info?: Json
          documents?: string[]
          status?: 'pending' | 'approved' | 'rejected' | 'under_review'
          reviewed_at?: string | null
          reviewed_by?: string | null
          rejection_reason?: string | null
        }
      }
      investments: {
        Row: {
          id: string
          user_id: string
          project_id: string
          amount: number
          carbon_credits: number
          date: string
          status: 'active' | 'completed' | 'pending' | 'cancelled'
          returns: number
          transaction_hash: string | null
          fees: number
          roi: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          project_id: string
          amount: number
          carbon_credits: number
          date?: string
          status?: 'active' | 'completed' | 'pending' | 'cancelled'
          returns?: number
          transaction_hash?: string | null
          fees?: number
          roi?: number
        }
        Update: {
          amount?: number
          carbon_credits?: number
          date?: string
          status?: 'active' | 'completed' | 'pending' | 'cancelled'
          returns?: number
          transaction_hash?: string | null
          fees?: number
          roi?: number
        }
      }
      staking_pools: {
        Row: {
          id: string
          name: string
          token_symbol: string
          apy: number
          minimum_stake: number
          lock_period: number
          total_staked: number
          participants: number
          status: 'active' | 'inactive'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          token_symbol: string
          apy: number
          minimum_stake: number
          lock_period: number
          total_staked?: number
          participants?: number
          status?: 'active' | 'inactive'
          description?: string | null
        }
        Update: {
          name?: string
          token_symbol?: string
          apy?: number
          minimum_stake?: number
          lock_period?: number
          total_staked?: number
          participants?: number
          status?: 'active' | 'inactive'
          description?: string | null
        }
      }
      staking_positions: {
        Row: {
          id: string
          user_id: string
          pool_id: string
          amount: number
          start_date: string
          end_date: string
          status: 'active' | 'completed' | 'withdrawn'
          rewards: number
          last_reward_claim: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          pool_id: string
          amount: number
          start_date?: string
          end_date: string
          status?: 'active' | 'completed' | 'withdrawn'
          rewards?: number
          last_reward_claim?: string | null
        }
        Update: {
          amount?: number
          end_date?: string
          status?: 'active' | 'completed' | 'withdrawn'
          rewards?: number
          last_reward_claim?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_post_views: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      increment_post_likes: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}