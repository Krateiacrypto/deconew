export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorAvatar?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  coverImage?: string;
  status: 'draft' | 'published';
  language: 'tr' | 'en';
  views: number;
  likes: number;
  readTime: number;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  parentId?: string; // For nested comments
  isApproved: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  publishedPosts: number;
  draftPosts: number;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  status?: 'draft' | 'published';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}