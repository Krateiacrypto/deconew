/**
 * Workflow API Service
 * Handles project submission, assignment, review workflows
 */

import { apiClient, ApiResponse } from '../apiClient';

// ============================================
// TYPES
// ============================================

export interface ProjectSubmissionData {
  title: string;
  description: string;
  location: string;
  project_type: 'renewable_energy' | 'reforestation' | 'energy_efficiency' | 'waste_management' | 'other';
  baseline_emissions: number;
  project_emissions: number;
  start_date: string;
  end_date: string;
  estimated_budget: number;
  funding_goal: number;
  documents?: Array<{
    document_type: 'feasibility_study' | 'baseline_report' | 'methodology' | 'monitoring_plan' | 'other';
    document_url: string;
    file_name: string;
    file_size: number;
  }>;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  project_type: string;
  workflow_stage: string;
  baseline_emissions: number;
  project_emissions: number;
  co2_reduction_calculated: number;
  token_exchange_rate: number;
  estimated_tokens: number;
  start_date: string;
  end_date: string;
  estimated_budget: number;
  funding_goal: number;
  current_funding: number;
  provider_id: number;
  assigned_verifier_id?: number;
  endorsement_count: number;
  highest_endorsement_level: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTimelineItem {
  stage: string;
  stage_display_name: string;
  description: string;
  estimated_duration: string;
  status: 'completed' | 'current' | 'upcoming';
  completed_at?: string;
  completed_by?: string;
  comments?: string;
}

export interface Assignment {
  id: number;
  project_id: number;
  user_id: number;
  role: 'verifier' | 'consultant' | 'auditor';
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  assigned_at: string;
  responded_at?: string;
  project?: Project;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Submit a new project for review
 */
export async function submitProject(
  data: ProjectSubmissionData
): Promise<ApiResponse<{ project_id: number; workflow_stage: string }>> {
  return apiClient.post('/projects/submit', data, true);
}

/**
 * Get pending projects (admin only)
 */
export async function getPendingProjects(): Promise<
  ApiResponse<{ projects: Project[] }>
> {
  return apiClient.get('/admin/projects/pending', true);
}

/**
 * Assign a verifier to a project (admin only)
 */
export async function assignVerifier(
  projectId: number,
  verifierId: number
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post(
    `/admin/projects/${projectId}/assign-verifier`,
    { verifier_id: verifierId },
    true
  );
}

/**
 * Review a project (admin action: approve, reject, request revision)
 */
export async function reviewProject(
  projectId: number,
  action: 'approve' | 'reject' | 'request_revision',
  comments?: string
): Promise<ApiResponse<{ message: string; new_stage: string }>> {
  return apiClient.post(
    `/admin/projects/${projectId}/review`,
    { action, comments },
    true
  );
}

/**
 * Get workflow timeline for a project
 */
export async function getWorkflowTimeline(
  projectId: number
): Promise<ApiResponse<{ timeline: WorkflowTimelineItem[] }>> {
  return apiClient.get(`/projects/${projectId}/workflow-timeline`, true);
}

/**
 * Get user's assignments (verifier/consultant/auditor)
 */
export async function getMyAssignments(): Promise<
  ApiResponse<{ assignments: Assignment[] }>
> {
  return apiClient.get('/my-assignments', true);
}

/**
 * Respond to an assignment (accept/decline)
 */
export async function respondToAssignment(
  assignmentId: number,
  action: 'accept' | 'decline'
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post(`/assignments/${assignmentId}/respond`, { action }, true);
}
