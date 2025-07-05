export interface ContentItem {
  id: string;
  type: 'news' | 'mission' | 'vision' | 'values' | 'roadmap' | 'announcement' | 'team' | 'banner';
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  metadata?: Record<string, any>;
}

export interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming' | 'cancelled';
  startDate?: string;
  endDate?: string;
  items: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  actionText?: string;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  title: string;
  content: string;
  changedBy: string;
  changedAt: string;
  changeNote?: string;
}

export interface ContentAuditLog {
  id: string;
  contentId: string;
  contentType: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  userId: string;
  userName: string;
  changes: Record<string, { old: any; new: any }>;
  timestamp: string;
  ipAddress?: string;
}