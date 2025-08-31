import { supabase } from '../lib/supabase';
import { User, Project, BlogPost } from '../types';

// Auth Services
export const authService = {
  async signUp(email: string, password: string, userData: Partial<User>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role || 'user'
        }
      }
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          name: userData.name!,
          role: userData.role || 'user',
          language: 'tr',
          is_active: true,
          kyc_status: 'pending',
          email_verified: false,
          two_factor_enabled: false
        });

      if (profileError) throw profileError;
    }

    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Update last login
    if (data.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }
};

// User Services
export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        phone: updates.phone,
        country: updates.country,
        language: updates.language,
        organization_name: updates.organizationName,
        organization_type: updates.organizationType,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateUserRole(userId: string, role: User['role']) {
    const { data, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateKYCStatus(userId: string, status: User['kycStatus']) {
    const { data, error } = await supabase
      .from('users')
      .update({ kyc_status: status, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Project Services
export const projectService = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createProject(project: Omit<Project, 'id'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        description: project.description,
        location: project.location,
        category: project.category,
        carbon_credits: project.carbonCredits,
        price: project.price,
        start_date: project.startDate,
        end_date: project.endDate,
        image: project.image,
        total_funding: project.totalFunding,
        target_funding: project.targetFunding,
        risk_level: project.riskLevel,
        expected_return: project.expectedReturn,
        minimum_investment: project.minimumInvestment,
        created_by: project.createdBy,
        progress: 0,
        participants: 0,
        verified: false,
        status: 'pending',
        documents: []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: updates.title,
        description: updates.description,
        location: updates.location,
        category: updates.category,
        carbon_credits: updates.carbonCredits,
        price: updates.price,
        progress: updates.progress,
        start_date: updates.startDate,
        end_date: updates.endDate,
        participants: updates.participants,
        verified: updates.verified,
        image: updates.image,
        status: updates.status,
        total_funding: updates.totalFunding,
        target_funding: updates.targetFunding,
        advisor_id: updates.advisorId,
        documents: updates.documents,
        risk_level: updates.riskLevel,
        expected_return: updates.expectedReturn,
        minimum_investment: updates.minimumInvestment,
        approved_by: updates.approvedBy,
        approved_at: updates.approvedAt,
        rejection_reason: updates.rejectionReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Blog Services
export const blogService = {
  async getPosts(filters?: any) {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.language) {
      query = query.eq('language', filters.language);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return data;
  },

  async createPost(post: Omit<BlogPost, 'id'>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        author: post.author,
        author_avatar: post.authorAvatar,
        category: post.category,
        tags: post.tags,
        cover_image: post.coverImage,
        status: post.status,
        language: post.language,
        views: 0,
        likes: 0,
        read_time: post.readTime,
        slug: post.slug,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription,
        published_at: post.status === 'published' ? new Date().toISOString() : new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePost(id: string, updates: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: updates.title,
        content: updates.content,
        excerpt: updates.excerpt,
        author: updates.author,
        author_avatar: updates.authorAvatar,
        category: updates.category,
        tags: updates.tags,
        cover_image: updates.coverImage,
        status: updates.status,
        language: updates.language,
        read_time: updates.readTime,
        slug: updates.slug,
        seo_title: updates.seoTitle,
        seo_description: updates.seoDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePost(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async incrementViews(id: string) {
    const { error } = await supabase.rpc('increment_post_views', { post_id: id });
    if (error) throw error;
  },

  async incrementLikes(id: string) {
    const { error } = await supabase.rpc('increment_post_likes', { post_id: id });
    if (error) throw error;
  }
};

// Storage Services
export const storageService = {
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data;
  },

  async getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }
};

// Real-time subscriptions
export const subscriptionService = {
  subscribeToProjects(callback: (payload: any) => void) {
    return supabase
      .channel('projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        callback
      )
      .subscribe();
  },

  subscribeToBlogPosts(callback: (payload: any) => void) {
    return supabase
      .channel('blog_posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blog_posts' }, 
        callback
      )
      .subscribe();
  },

  subscribeToUsers(callback: (payload: any) => void) {
    return supabase
      .channel('users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        callback
      )
      .subscribe();
  }
};