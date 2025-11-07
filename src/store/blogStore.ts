import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { BlogPost, BlogComment, BlogCategory, BlogStats, BlogFilters, PaginationInfo } from '../types/blog';
import { generateSlug, calculateReadTime, extractExcerpt } from '../utils/markdown';
import toast from 'react-hot-toast';

interface BlogState {
  posts: BlogPost[];
  comments: BlogComment[];
  categories: BlogCategory[];
  stats: BlogStats;
  isLoading: boolean;

  // Actions
  fetchPosts: (filters?: BlogFilters, page?: number, limit?: number) => Promise<{ posts: BlogPost[]; pagination: PaginationInfo }>;
  fetchPost: (slug: string) => Promise<BlogPost | null>;
  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'slug'>) => Promise<BlogPost>;
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  publishPost: (id: string) => Promise<void>;
  unpublishPost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;

  // Comments
  fetchComments: (postId: string) => Promise<BlogComment[]>;
  addComment: (comment: Omit<BlogComment, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => Promise<void>;
  likeComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  approveComment: (id: string) => Promise<void>;

  // Categories
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<BlogCategory, 'id' | 'postCount'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<BlogCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Stats
  fetchStats: () => Promise<void>;

  // Search
  searchPosts: (query: string) => Promise<BlogPost[]>;
}

// Convert database snake_case to camelCase
const convertDbPostToPost = (dbPost: any): BlogPost => ({
  id: dbPost.id,
  title: dbPost.title,
  content: dbPost.content,
  excerpt: dbPost.excerpt,
  author: dbPost.author,
  authorAvatar: dbPost.author_avatar,
  publishedAt: dbPost.published_at,
  createdAt: dbPost.created_at,
  updatedAt: dbPost.updated_at,
  category: dbPost.category,
  tags: dbPost.tags || [],
  coverImage: dbPost.cover_image,
  status: dbPost.status || 'draft',
  language: dbPost.language || 'tr',
  views: dbPost.views || 0,
  likes: dbPost.likes || 0,
  readTime: dbPost.read_time || 0,
  slug: dbPost.slug,
  seoTitle: dbPost.seo_title,
  seoDescription: dbPost.seo_description
});

const convertPostToDb = (post: Partial<BlogPost>) => ({
  title: post.title,
  content: post.content,
  excerpt: post.excerpt,
  author: post.author,
  author_avatar: post.authorAvatar,
  published_at: post.publishedAt,
  created_at: post.createdAt,
  updated_at: post.updatedAt,
  category: post.category,
  tags: post.tags,
  cover_image: post.coverImage,
  status: post.status,
  language: post.language,
  views: post.views,
  likes: post.likes,
  read_time: post.readTime,
  slug: post.slug,
  seo_title: post.seoTitle,
  seo_description: post.seoDescription
});

const calculateStats = (posts: BlogPost[], comments: BlogComment[]): BlogStats => ({
  totalPosts: posts.length,
  totalViews: posts.reduce((sum, post) => sum + post.views, 0),
  totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
  totalComments: comments.length,
  publishedPosts: posts.filter(post => post.status === 'published').length,
  draftPosts: posts.filter(post => post.status === 'draft').length
});

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  comments: [],
  categories: [],
  stats: {
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    publishedPosts: 0,
    draftPosts: 0
  },
  isLoading: false,

  fetchPosts: async (filters?: BlogFilters, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.tag) {
        query = query.contains('tags', [filters.tag]);
      }

      if (filters?.author) {
        query = query.eq('author', filters.author);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.dateRange) {
        query = query
          .gte('published_at', filters.dateRange.start)
          .lte('published_at', filters.dateRange.end);
      }

      // Sort by published date (newest first)
      query = query.order('published_at', { ascending: false });

      // Pagination
      const startIndex = (page - 1) * limit;
      query = query.range(startIndex, startIndex + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const posts = (data || []).map(convertDbPostToPost);

      const pagination: PaginationInfo = {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit
      };

      set({ posts, isLoading: false });
      return { posts, pagination };
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast.error('Blog yazıları yüklenemedi');
      set({ isLoading: false });
      return { posts: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: limit } };
    }
  },

  fetchPost: async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const post = convertDbPostToPost(data);

      // Increment views
      if (post.status === 'published') {
        get().incrementViews(post.id);
      }

      return post;
    } catch (error: any) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  createPost: async (postData) => {
    set({ isLoading: true });
    try {
      const slug = generateSlug(postData.title);
      const readTime = calculateReadTime(postData.content);
      const excerpt = postData.excerpt || extractExcerpt(postData.content);

      const dbPost = {
        ...convertPostToDb(postData as any),
        slug,
        read_time: readTime,
        excerpt,
        views: 0,
        likes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([dbPost])
        .select()
        .single();

      if (error) throw error;

      const newPost = convertDbPostToPost(data);

      const { posts } = get();
      set({
        posts: [newPost, ...posts],
        isLoading: false
      });

      toast.success('Blog yazısı oluşturuldu!');
      await get().fetchStats();

      return newPost;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Blog yazısı oluşturulamadı: ' + error.message);
      set({ isLoading: false });
      throw error;
    }
  },

  updatePost: async (id: string, updates: Partial<BlogPost>) => {
    set({ isLoading: true });
    try {
      const dbUpdates: any = {
        ...convertPostToDb(updates),
        updated_at: new Date().toISOString()
      };

      if (updates.title) {
        dbUpdates.slug = generateSlug(updates.title);
      }

      if (updates.content) {
        dbUpdates.read_time = calculateReadTime(updates.content);
        if (!updates.excerpt) {
          dbUpdates.excerpt = extractExcerpt(updates.content);
        }
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedPost = convertDbPostToPost(data);

      const { posts } = get();
      set({
        posts: posts.map(post => post.id === id ? updatedPost : post),
        isLoading: false
      });

      toast.success('Blog yazısı güncellendi!');
      await get().fetchStats();
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error('Blog yazısı güncellenemedi: ' + error.message);
      set({ isLoading: false });
      throw error;
    }
  },

  deletePost: async (id: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { posts } = get();
      set({
        posts: posts.filter(post => post.id !== id),
        isLoading: false
      });

      toast.success('Blog yazısı silindi!');
      await get().fetchStats();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error('Blog yazısı silinemedi: ' + error.message);
      set({ isLoading: false });
      throw error;
    }
  },

  publishPost: async (id: string) => {
    await get().updatePost(id, {
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  },

  unpublishPost: async (id: string) => {
    await get().updatePost(id, { status: 'draft' });
  },

  likePost: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('likes')
        .eq('id', id)
        .single();

      if (error) throw error;

      const newLikes = (data.likes || 0) + 1;

      await supabase
        .from('blog_posts')
        .update({ likes: newLikes })
        .eq('id', id);

      const { posts } = get();
      set({
        posts: posts.map(post =>
          post.id === id ? { ...post, likes: newLikes } : post
        )
      });
    } catch (error: any) {
      console.error('Error liking post:', error);
    }
  },

  incrementViews: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('views')
        .eq('id', id)
        .single();

      if (error) throw error;

      const newViews = (data.views || 0) + 1;

      await supabase
        .from('blog_posts')
        .update({ views: newViews })
        .eq('id', id);

      const { posts } = get();
      set({
        posts: posts.map(post =>
          post.id === id ? { ...post, views: newViews } : post
        )
      });
    } catch (error: any) {
      console.error('Error incrementing views:', error);
    }
  },

  fetchComments: async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  addComment: async (commentData) => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert([{
          post_id: commentData.postId,
          author: commentData.author,
          author_email: commentData.authorEmail,
          content: commentData.content,
          is_approved: true,
          likes: 0,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Yorum eklendi!');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Yorum eklenemedi');
    }
  },

  likeComment: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('likes')
        .eq('id', id)
        .single();

      if (error) throw error;

      await supabase
        .from('blog_comments')
        .update({ likes: (data.likes || 0) + 1 })
        .eq('id', id);
    } catch (error: any) {
      console.error('Error liking comment:', error);
    }
  },

  deleteComment: async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Yorum silindi!');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error('Yorum silinemedi');
    }
  },

  approveComment: async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;

      toast.success('Yorum onaylandı!');
    } catch (error: any) {
      console.error('Error approving comment:', error);
      toast.error('Yorum onaylanamadı');
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;

      // Count posts for each category
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('category, status');

      const categories = (data || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        color: cat.color || '#10b981',
        postCount: posts?.filter(p => p.category === cat.name && p.status === 'published').length || 0
      }));

      set({ categories, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      set({ isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert([{
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          color: categoryData.color
        }])
        .select()
        .single();

      if (error) throw error;

      const newCategory: BlogCategory = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        color: data.color || '#10b981',
        postCount: 0
      };

      const { categories } = get();
      set({ categories: [...categories, newCategory] });

      toast.success('Kategori oluşturuldu!');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error('Kategori oluşturulamadı');
    }
  },

  updateCategory: async (id: string, updates: Partial<BlogCategory>) => {
    try {
      const { error } = await supabase
        .from('blog_categories')
        .update({
          name: updates.name,
          slug: updates.slug,
          description: updates.description,
          color: updates.color
        })
        .eq('id', id);

      if (error) throw error;

      const { categories } = get();
      set({
        categories: categories.map(cat =>
          cat.id === id ? { ...cat, ...updates } : cat
        )
      });

      toast.success('Kategori güncellendi!');
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error('Kategori güncellenemedi');
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { categories } = get();
      set({ categories: categories.filter(cat => cat.id !== id) });

      toast.success('Kategori silindi!');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error('Kategori silinemedi');
    }
  },

  fetchStats: async () => {
    try {
      const { posts, comments } = get();
      set({ stats: calculateStats(posts, comments) });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  },

  searchPosts: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);

      if (error) throw error;

      return (data || []).map(convertDbPostToPost);
    } catch (error: any) {
      console.error('Error searching posts:', error);
      return [];
    }
  }
}));
