import { supabase } from '../lib/supabase';
import { User } from '../types';
import { Database } from '../types/supabase';

// Type conversion helpers
export const convertSupabaseUser = (supabaseUser: Database['public']['Tables']['users']['Row']): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.name,
    role: supabaseUser.role,
    avatar: supabaseUser.avatar,
    createdAt: supabaseUser.created_at,
    isActive: supabaseUser.is_active,
    kycStatus: supabaseUser.kyc_status,
    walletAddress: supabaseUser.wallet_address,
    phone: supabaseUser.phone,
    country: supabaseUser.country,
    language: supabaseUser.language,
    twoFactorEnabled: supabaseUser.two_factor_enabled,
    lastLogin: supabaseUser.last_login,
    emailVerified: supabaseUser.email_verified,
    organizationName: supabaseUser.organization_name,
    organizationType: supabaseUser.organization_type,
    verificationLevel: supabaseUser.verification_level,
    assignedUsers: supabaseUser.assigned_users,
    specializations: supabaseUser.specializations,
    certifications: supabaseUser.certifications
  };
};

export const convertSupabaseProject = (supabaseProject: Database['public']['Tables']['projects']['Row']) => {
  return {
    id: supabaseProject.id,
    title: supabaseProject.title,
    description: supabaseProject.description,
    location: supabaseProject.location,
    category: supabaseProject.category,
    carbonCredits: supabaseProject.carbon_credits,
    price: supabaseProject.price,
    progress: supabaseProject.progress,
    startDate: supabaseProject.start_date,
    endDate: supabaseProject.end_date,
    participants: supabaseProject.participants,
    verified: supabaseProject.verified,
    image: supabaseProject.image,
    status: supabaseProject.status,
    totalFunding: supabaseProject.total_funding,
    targetFunding: supabaseProject.target_funding,
    advisorId: supabaseProject.advisor_id,
    documents: supabaseProject.documents,
    riskLevel: supabaseProject.risk_level,
    expectedReturn: supabaseProject.expected_return,
    minimumInvestment: supabaseProject.minimum_investment,
    createdBy: supabaseProject.created_by,
    approvedBy: supabaseProject.approved_by,
    approvedAt: supabaseProject.approved_at,
    rejectionReason: supabaseProject.rejection_reason
  };
};

export const convertSupabaseBlogPost = (supabasePost: Database['public']['Tables']['blog_posts']['Row']) => {
  return {
    id: supabasePost.id,
    title: supabasePost.title,
    content: supabasePost.content,
    excerpt: supabasePost.excerpt,
    author: supabasePost.author,
    authorAvatar: supabasePost.author_avatar,
    publishedAt: supabasePost.published_at,
    createdAt: supabasePost.created_at,
    updatedAt: supabasePost.updated_at,
    category: supabasePost.category,
    tags: supabasePost.tags,
    coverImage: supabasePost.cover_image,
    status: supabasePost.status,
    language: supabasePost.language,
    views: supabasePost.views,
    likes: supabasePost.likes,
    readTime: supabasePost.read_time,
    slug: supabasePost.slug,
    seoTitle: supabasePost.seo_title,
    seoDescription: supabasePost.seo_description
  };
};

// Error handling helpers
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase Error:', error);
  
  if (error.code === 'PGRST116') {
    return 'Kayıt bulunamadı';
  } else if (error.code === '23505') {
    return 'Bu kayıt zaten mevcut';
  } else if (error.code === '23503') {
    return 'İlişkili kayıtlar mevcut, silme işlemi yapılamaz';
  } else if (error.code === '42501') {
    return 'Bu işlem için yetkiniz bulunmuyor';
  } else if (error.message?.includes('JWT')) {
    return 'Oturum süresi dolmuş, lütfen tekrar giriş yapın';
  } else if (error.message?.includes('Network')) {
    return 'Bağlantı hatası, lütfen internet bağlantınızı kontrol edin';
  }
  
  return error.message || 'Bilinmeyen bir hata oluştu';
};

// Real-time subscription helpers
export const createRealtimeSubscription = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  let channel = supabase.channel(`${table}-changes`);
  
  if (filter) {
    channel = channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table, filter },
      callback
    );
  } else {
    channel = channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    );
  }
  
  return channel.subscribe();
};

// File upload helpers
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType || file.type,
      upsert: options?.upsert || false
    });

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

// Auth helpers
export const getCurrentUser = async (): Promise<any> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentUserProfile = async (): Promise<User | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return convertSupabaseUser(data);
};

// Database helpers
export const executeRPC = async (functionName: string, params?: any): Promise<any> => {
  const { data, error } = await supabase.rpc(functionName, params);
  if (error) throw error;
  return data;
};

export const batchInsert = async (table: string, records: any[]): Promise<any> => {
  const { data, error } = await supabase
    .from(table)
    .insert(records)
    .select();

  if (error) throw error;
  return data;
};

export const batchUpdate = async (
  table: string, 
  updates: any, 
  condition: { column: string; value: any }
): Promise<any> => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq(condition.column, condition.value)
    .select();

  if (error) throw error;
  return data;
};