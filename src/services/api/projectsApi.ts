/**
 * Projects API Service
 * Handles public project listing and details
 */

import { apiClient, ApiResponse } from '../apiClient';

// ============================================
// TYPES
// ============================================

export interface PublicProject {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  provider_id: number;
  provider_name: string;
  status: string;
  workflow_stage: string;

  // Carbon metrics
  carbon_credits: string;
  baseline_emissions: string;
  project_emissions: string;
  co2_reduction_calculated: string;

  // Funding
  funding_goal: string;
  current_funding: string;
  min_investment: string;
  progress: number;

  // Dates
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;

  // Verification
  verified: boolean;
  calculation_verified: boolean;

  // Engagement
  participants_count: number;
  endorsement_count: number;

  // Media
  image_url: string | null;
  impact_metrics: any;
}

export interface ProjectFilters {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Public Projects Response (direct from backend, no data wrapper)
 */
export interface PublicProjectsResponse {
  success: boolean;
  count: number;
  projects: PublicProject[];
}

/**
 * Get public (approved) projects
 * GET /api/projects
 */
export async function getPublicProjects(
  filters?: ProjectFilters
): Promise<PublicProjectsResponse> {
  const params = new URLSearchParams();

  if (filters?.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }

  if (filters?.search) {
    params.append('search', filters.search);
  }

  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }

  if (filters?.offset) {
    params.append('offset', filters.offset.toString());
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get<PublicProjectsResponse>(`/projects${queryString}`, false); // Public endpoint, no auth required
}

/**
 * Project Detail Response (full project with relations)
 */
export interface ProjectDetailResponse {
  success: boolean;
  project: PublicProject & {
    provider_type?: string;
    provider_country?: string;
    carbon_calculation?: {
      id: number;
      project_id: number;
      baseline_emissions: string;
      baseline_methodology: string;
      project_emissions: string;
      project_methodology: string;
      project_lifetime_years: number;
      token_exchange_rate: string;
      verification_status: string;
      verified_by?: number;
      verified_at?: string;
      created_at: string;
    } | null;
    endorsements?: Array<{
      id: number;
      project_id: number;
      ngo_id: number;
      ngo_name: string;
      endorsement_type: string;
      status: string;
      comments?: string;
      created_at: string;
    }>;
    documents?: Array<{
      id: number;
      document_type: string;
      file_name: string;
      file_type: string;
      file_size: number;
      uploaded_at: string;
      workflow_stage: string;
    }>;
    endorsement_count: number;
  };
}

/**
 * Get project details by ID
 * GET /api/projects/:id
 */
export async function getProjectDetails(
  projectId: number
): Promise<ProjectDetailResponse> {
  return apiClient.get<ProjectDetailResponse>(`/projects/${projectId}`, false);
}

/**
 * Map frontend category to backend category
 */
export function mapCategoryToBackend(frontendCategory: string): string {
  const categoryMap: Record<string, string> = {
    'forest': 'reforestation',
    'renewable': 'renewable_energy',
    'water': 'clean_water',
    'agriculture': 'sustainable_agriculture',
    'all': 'all'
  };

  return categoryMap[frontendCategory] || frontendCategory;
}

/**
 * Map backend category to frontend category
 */
export function mapCategoryToFrontend(backendCategory: string): string {
  const categoryMap: Record<string, string> = {
    'reforestation': 'forest',
    'renewable_energy': 'renewable',
    'clean_water': 'water',
    'sustainable_agriculture': 'agriculture'
  };

  return categoryMap[backendCategory] || backendCategory;
}

/**
 * Calculate project progress percentage
 */
export function calculateProgress(project: PublicProject): number {
  const current = parseFloat(project.current_funding);
  const goal = parseFloat(project.funding_goal);

  if (goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}

/**
 * Get default image for project category
 */
export function getDefaultProjectImage(category: string): string {
  const imageMap: Record<string, string> = {
    'renewable_energy': 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg',
    'reforestation': 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg',
    'clean_water': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    'sustainable_agriculture': 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg'
  };

  return imageMap[category] || 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg';
}
