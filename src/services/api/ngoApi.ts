/**
 * NGO API Service
 * Handles NGO registration, endorsements, and profiles
 */

import { apiClient, ApiResponse } from '../apiClient';

// ============================================
// TYPES
// ============================================

export interface NGORegistrationData {
  official_name: string;
  registration_number: string;
  country: string;
  website?: string;
  contact_email: string;
  contact_phone?: string;
  focus_areas: string[]; // e.g., ["climate_change", "renewable_energy", "reforestation"]
  description: string;
  years_active: number;
  previous_projects?: number;
  verification_documents?: Array<{
    document_type: string;
    document_url: string;
  }>;
}

export interface NGO {
  id: number;
  user_id: number;
  official_name: string;
  registration_number: string;
  country: string;
  website?: string;
  contact_email: string;
  contact_phone?: string;
  focus_areas: string[];
  description: string;
  years_active: number;
  previous_projects: number;
  verification_status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  verified_at?: string;
  verified_by?: number;
  rejection_reason?: string;
  total_endorsements: number;
  active_endorsements: number;
  average_rating: number;
  profile_completeness: number;
  created_at: string;
  updated_at: string;
}

export interface EndorsementData {
  support_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  endorsement_text: string;
  public_statement?: string;
  internal_notes?: string;
}

export interface ProjectEndorsement {
  id: number;
  project_id: number;
  ngo_id: number;
  support_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  support_percentage: number;
  endorsement_text: string;
  public_statement?: string;
  status: 'draft' | 'submitted' | 'active' | 'withdrawn' | 'expired';
  endorsed_at: string;
  expires_at?: string;
  withdrawn_at?: string;
  withdrawal_reason?: string;
  ngo?: NGO;
}

export interface EndorsementLevel {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  support_percentage: number;
  requirements: string;
  description: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Register a new NGO
 */
export async function registerNGO(
  data: NGORegistrationData
): Promise<ApiResponse<{ ngo_id: number; status: string }>> {
  return apiClient.post('/ngo/register', data, true);
}

/**
 * Get pending NGO registrations (admin only)
 */
export async function getPendingNGOs(): Promise<ApiResponse<{ ngos: NGO[] }>> {
  return apiClient.get('/admin/ngo/pending', true);
}

/**
 * Review NGO registration (admin only)
 */
export async function reviewNGO(
  ngoId: number,
  action: 'approve' | 'reject',
  notes?: string
): Promise<ApiResponse<{ message: string; new_status: string }>> {
  return apiClient.post(`/admin/ngo/${ngoId}/review`, { action, notes }, true);
}

/**
 * Endorse a project (NGO only)
 */
export async function endorseProject(
  projectId: number,
  data: EndorsementData
): Promise<
  ApiResponse<{ endorsement_id: number; endorsement: ProjectEndorsement }>
> {
  return apiClient.post(`/ngo/endorse/${projectId}`, data, true);
}

/**
 * Get endorsements for a project
 */
export async function getProjectEndorsements(
  projectId: number
): Promise<ApiResponse<{ endorsements: ProjectEndorsement[] }>> {
  return apiClient.get(`/projects/${projectId}/endorsements`, true);
}

/**
 * Get NGO profile (with optional ngoId)
 * If ngoId is not provided, gets the current user's NGO profile
 */
export async function getNGOProfile(
  ngoId?: number
): Promise<ApiResponse<NGO>> {
  const endpoint = ngoId ? `/ngo/${ngoId}` : '/ngo/profile';
  return apiClient.get(endpoint, true);
}

/**
 * Get NGO's endorsements (current user's NGO)
 */
export async function getNGOEndorsements(): Promise<
  ApiResponse<NGOEndorsement[]>
> {
  return apiClient.get('/ngo/my-endorsements', true);
}

/**
 * NGO Endorsement type (simplified for dashboard)
 */
export interface NGOEndorsement {
  id: number;
  project_id: number;
  ngo_id: number;
  support_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  support_percentage: number;
  endorsement_text: string;
  public_statement?: string;
  status: 'draft' | 'submitted' | 'pending' | 'active' | 'withdrawn' | 'expired';
  endorsed_at: string;
  expires_at?: string;
  project?: {
    id: number;
    title: string;
    description: string;
    co2_reduction_calculated: number;
    funding_goal: number;
    funding_raised: number;
    current_stage: string;
  };
}

/**
 * NGO Profile type
 */
export interface NGOProfile extends NGO {}

/**
 * List all approved NGOs
 */
export async function listNGOs(filters?: {
  focus_area?: string;
  country?: string;
  min_rating?: number;
}): Promise<ApiResponse<{ ngos: NGO[]; total: number }>> {
  const params = new URLSearchParams();
  if (filters?.focus_area) params.append('focus_area', filters.focus_area);
  if (filters?.country) params.append('country', filters.country);
  if (filters?.min_rating) params.append('min_rating', filters.min_rating.toString());

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/ngo/list${queryString}`, false);
}

/**
 * Get endorsement level information
 */
export async function getEndorsementLevels(): Promise<
  ApiResponse<{ levels: EndorsementLevel[] }>
> {
  return apiClient.get('/ngo/endorsement-levels', false);
}

/**
 * Calculate endorsement impact score
 */
export function calculateEndorsementScore(endorsements: ProjectEndorsement[]): number {
  if (endorsements.length === 0) return 0;

  const activeEndorsements = endorsements.filter(e => e.status === 'active');
  if (activeEndorsements.length === 0) return 0;

  // Weighted score based on support level and NGO rating
  let totalScore = 0;
  let totalWeight = 0;

  activeEndorsements.forEach(endorsement => {
    const levelWeight = endorsement.support_percentage / 100;
    const ngoRating = endorsement.ngo?.average_rating || 3;
    const weight = levelWeight * ngoRating;

    totalScore += weight * 100;
    totalWeight += weight;
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

/**
 * Get endorsement badge color
 */
export function getEndorsementBadgeColor(
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL'
): string {
  switch (level) {
    case 'FULL':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'HIGH':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'LOW':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}
