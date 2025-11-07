/**
 * Workflow System Types
 * 7-Stage Project Workflow + NGO Endorsement
 */

// ============================================================================
// WORKFLOW STAGES
// ============================================================================

export type WorkflowStage =
  | 'draft'
  | 'pending_admin_review'
  | 'admin_reviewing'
  | 'under_verification'
  | 'verifier_site_visit'
  | 'verifier_reviewing'
  | 'consultant_review'
  | 'pending_final_approval'
  | 'ngo_endorsement'
  | 'approved'
  | 'rejected'
  | 'revision_requested';

export type WorkflowAction =
  | 'submitted'
  | 'assigned'
  | 'approved'
  | 'rejected'
  | 'revision_requested'
  | 'resubmitted'
  | 'escalated'
  | 'completed';

export interface WorkflowStageInfo {
  stage_code: WorkflowStage;
  stage_number: number;
  stage_name: string;
  description: string;
  required_role: string | null;
  typical_duration_days: number | null;
  next_stages: WorkflowStage[];
}

// ============================================================================
// PROJECT WORKFLOW
// ============================================================================

export interface ProjectWorkflowData {
  workflow_stage: WorkflowStage;
  workflow_started_at: Date | null;
  workflow_completed_at: Date | null;

  // Carbon calculation
  baseline_emissions: number;
  project_emissions: number;
  co2_reduction_calculated: number;
  token_exchange_rate: number;
  calculation_method: 'manual' | 'cdm' | 'vcs' | 'gold_standard';
  calculation_verified: boolean;
  calculation_verified_at: Date | null;
  calculation_verified_by: number | null;

  // Assignments
  assigned_verifier_id: number | null;
  assigned_consultant_id: number | null;
  assigned_at: Date | null;

  // Rejection/revision
  rejection_reason: string | null;
  rejected_by: number | null;
  rejected_at: Date | null;
  revision_notes: string | null;
  revision_count: number;

  // Endorsement
  endorsement_count: number;
  highest_endorsement_level: EndorsementLevel | 'NONE';
  endorsement_benefits: EndorsementBenefits | null;
}

// ============================================================================
// WORKFLOW HISTORY
// ============================================================================

export interface WorkflowHistory {
  id: number;
  project_id: number;
  from_stage: WorkflowStage | null;
  to_stage: WorkflowStage;
  changed_by: number;
  changed_at: Date;
  action: WorkflowAction;
  notes: string | null;
  metadata: Record<string, any> | null;
}

export interface CreateWorkflowHistoryDTO {
  project_id: number;
  from_stage?: WorkflowStage | null;
  to_stage: WorkflowStage;
  changed_by: number;
  action: WorkflowAction;
  notes?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// PROJECT ASSIGNMENTS
// ============================================================================

export type AssignmentRole = 'verifier' | 'consultant' | 'admin' | 'ngo';
export type AssignmentStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined';

export interface ProjectAssignment {
  id: number;
  project_id: number;
  user_id: number;
  role: AssignmentRole;
  assigned_by: number;
  assigned_at: Date;
  accepted_at: Date | null;
  completed_at: Date | null;
  status: AssignmentStatus;
  notes: string | null;
  deliverables: string[] | null;
}

export interface CreateAssignmentDTO {
  project_id: number;
  user_id: number;
  role: AssignmentRole;
  assigned_by: number;
  notes?: string;
  deliverables?: string[];
}

export interface UpdateAssignmentDTO {
  status?: AssignmentStatus;
  notes?: string;
  deliverables?: string[];
}

// ============================================================================
// DOCUMENTS
// ============================================================================

export type DocumentType =
  | 'baseline_study'
  | 'feasibility_report'
  | 'environmental_impact'
  | 'financial_plan'
  | 'monitoring_plan'
  | 'validation_report'
  | 'verification_report'
  | 'certification'
  | 'site_photos'
  | 'legal_documents'
  | 'other';

export interface ProjectDocument {
  id: number;
  project_id: number;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  uploaded_at: Date;
  workflow_stage: string | null;
  is_required: boolean;
  is_verified: boolean;
  verified_by: number | null;
  verified_at: Date | null;
  notes: string | null;
}

export interface UploadDocumentDTO {
  project_id: number;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  workflow_stage?: string;
  is_required?: boolean;
  notes?: string;
}

// ============================================================================
// AUDIT REPORTS
// ============================================================================

export type AuditReportType = 'preliminary' | 'site_visit' | 'final' | 'annual_monitoring';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AuditRecommendation = 'approve' | 'approve_with_conditions' | 'request_revision' | 'reject';
export type AuditStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface AuditReport {
  id: number;
  project_id: number;
  verifier_id: number;
  report_type: AuditReportType;
  site_visit_date: Date | null;
  site_visit_duration: number | null;
  site_visit_attendees: string | null;

  // Audit findings
  baseline_verified: boolean;
  additionality_confirmed: boolean;
  leakage_assessed: boolean;
  permanence_verified: boolean;
  monitoring_plan_adequate: boolean;

  // Carbon calculation review
  carbon_calculation_reviewed: boolean;
  carbon_calculation_approved: boolean;
  carbon_adjustment_factor: number;
  carbon_notes: string | null;

  // Overall assessment
  overall_score: number | null;
  risk_level: RiskLevel | null;
  recommendation: AuditRecommendation;
  conditions: string | null;
  findings: string | null;

  // Evidence
  evidence_photos_count: number;
  evidence_documents_count: number;
  evidence_interviews_count: number;

  // Metadata
  submitted_at: Date;
  reviewed_by: number | null;
  reviewed_at: Date | null;
  status: AuditStatus;
}

export interface CreateAuditReportDTO {
  project_id: number;
  verifier_id: number;
  report_type: AuditReportType;
  site_visit_date?: Date;
  site_visit_duration?: number;
  site_visit_attendees?: string;

  baseline_verified?: boolean;
  additionality_confirmed?: boolean;
  leakage_assessed?: boolean;
  permanence_verified?: boolean;
  monitoring_plan_adequate?: boolean;

  carbon_calculation_reviewed?: boolean;
  carbon_calculation_approved?: boolean;
  carbon_adjustment_factor?: number;
  carbon_notes?: string;

  overall_score?: number;
  risk_level?: RiskLevel;
  recommendation: AuditRecommendation;
  conditions?: string;
  findings?: string;

  evidence_photos_count?: number;
  evidence_documents_count?: number;
  evidence_interviews_count?: number;
}

// ============================================================================
// SITE VISITS
// ============================================================================

export type SiteVisitType = 'preliminary' | 'full_audit' | 'monitoring' | 'follow_up';
export type SiteVisitStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

export interface SiteVisit {
  id: number;
  project_id: number;
  verifier_id: number;
  scheduled_date: Date;
  scheduled_time: string | null;
  duration_hours: number;
  visit_type: SiteVisitType;

  location_address: string | null;
  location_coordinates: string | null;

  provider_representatives: string | null;
  local_stakeholders: string | null;
  other_attendees: string | null;

  status: SiteVisitStatus;
  completion_date: Date | null;

  visit_notes: string | null;
  findings_summary: string | null;
  photos_uploaded: number;

  follow_up_required: boolean;
  follow_up_notes: string | null;

  created_at: Date;
  updated_at: Date;
}

export interface CreateSiteVisitDTO {
  project_id: number;
  verifier_id: number;
  scheduled_date: Date;
  scheduled_time?: string;
  duration_hours?: number;
  visit_type: SiteVisitType;
  location_address?: string;
  location_coordinates?: string;
}

export interface UpdateSiteVisitDTO {
  scheduled_date?: Date;
  scheduled_time?: string;
  status?: SiteVisitStatus;
  provider_representatives?: string;
  local_stakeholders?: string;
  visit_notes?: string;
  findings_summary?: string;
  photos_uploaded?: number;
  follow_up_required?: boolean;
  follow_up_notes?: string;
}

// ============================================================================
// CARBON CALCULATIONS
// ============================================================================

export type MethodologyStandard = 'CDM' | 'VCS' | 'Gold Standard' | 'ACR' | 'CAR' | 'Custom';
export type CalculationStatus = 'pending' | 'approved' | 'rejected' | 'revision_needed';

export interface CarbonCalculation {
  id: number;
  project_id: number;

  // Baseline scenario
  baseline_emissions: number;
  baseline_methodology: string | null;
  baseline_data_source: string | null;
  baseline_calculation_date: Date | null;

  // Project scenario
  project_emissions: number;
  project_methodology: string | null;
  project_data_source: string | null;

  // Reduction calculation (computed)
  annual_reduction: number;
  project_lifetime_years: number;
  total_reduction: number;

  // Adjustments
  leakage_factor: number;
  uncertainty_factor: number;
  buffer_factor: number;

  // Net calculation
  net_reduction: number | null;

  // Tokenomics
  token_exchange_rate: number;
  total_tokens: number | null;

  // Verification
  calculated_by: number;
  calculated_at: Date;
  verified_by: number | null;
  verified_at: Date | null;
  verification_status: CalculationStatus;
  verification_notes: string | null;

  // Methodology reference
  methodology_standard: MethodologyStandard | null;
  methodology_version: string | null;
}

export interface CreateCarbonCalculationDTO {
  project_id: number;
  baseline_emissions: number;
  baseline_methodology?: string;
  baseline_data_source?: string;
  baseline_calculation_date?: Date;
  project_emissions: number;
  project_methodology?: string;
  project_data_source?: string;
  project_lifetime_years?: number;
  leakage_factor?: number;
  uncertainty_factor?: number;
  buffer_factor?: number;
  token_exchange_rate?: number;
  calculated_by: number;
  methodology_standard?: MethodologyStandard;
  methodology_version?: string;
}

export interface VerifyCarbonCalculationDTO {
  verification_status: CalculationStatus;
  verification_notes?: string;
  verified_by: number;
}

// ============================================================================
// NGO SYSTEM
// ============================================================================

export type NGOVerificationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';

export interface NGORegistry {
  id: number;
  user_id: number;

  official_name: string;
  short_name: string | null;
  registration_number: string;
  tax_id: string | null;
  country: string;

  focus_areas: string[];
  mission_statement: string;
  vision_statement: string | null;

  website: string | null;
  email: string;
  phone: string | null;
  social_media: Record<string, string> | null;

  verification_status: NGOVerificationStatus;
  verified_at: Date | null;
  verified_by: number | null;

  has_501c3: boolean;
  has_transparency_cert: boolean;
  transparency_score: number | null;
  certification_documents: string[] | null;

  total_endorsements: number;
  active_endorsements: number;
  average_endorsement_level: number;

  joined_at: Date;
  last_active_at: Date | null;
  profile_completeness: number;

  admin_notes: string | null;
  rejection_reason: string | null;

  updated_at: Date;
}

export interface CreateNGORegistryDTO {
  user_id: number;
  official_name: string;
  registration_number: string;
  country: string;
  focus_areas: string[];
  mission_statement: string;
  email: string;
  website?: string;
  phone?: string;
  vision_statement?: string;
  has_501c3?: boolean;
  has_transparency_cert?: boolean;
}

// ============================================================================
// PROJECT ENDORSEMENTS
// ============================================================================

export type EndorsementLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
export type EndorsementStatus = 'draft' | 'submitted' | 'active' | 'withdrawn' | 'expired';

export interface ProjectEndorsement {
  id: number;
  project_id: number;
  ngo_id: number;

  support_level: EndorsementLevel;
  support_rationale: string;
  expertise_alignment: string | null;
  risk_assessment: string | null;

  co_promotion_willing: boolean;
  technical_assistance_offered: boolean;
  technical_assistance_details: string | null;

  monetary_commitment: number;
  monetary_committed: boolean;

  status: EndorsementStatus;
  endorsed_at: Date | null;
  withdrawn_at: Date | null;
  withdrawal_reason: string | null;

  is_public: boolean;
  is_featured: boolean;

  project_completion_percentage: number;
  impact_generated: string | null;

  created_at: Date;
  updated_at: Date;
}

export interface CreateEndorsementDTO {
  project_id: number;
  ngo_id: number;
  support_level: EndorsementLevel;
  support_rationale: string;
  expertise_alignment?: string;
  risk_assessment?: string;
  co_promotion_willing?: boolean;
  technical_assistance_offered?: boolean;
  technical_assistance_details?: string;
  monetary_commitment?: number;
}

export interface EndorsementBenefits {
  fee_discount_percentage: number;
  visibility_boost: number;
  badge_text: string;
  is_featured: boolean;
  priority_listing: boolean;
}

export interface EndorsementLevelInfo {
  level_code: EndorsementLevel;
  level_name: string;
  percentage: number;
  badge_text: string;
  fee_discount_percentage: number;
  visibility_boost: number;
  benefits_description: string | null;
  requirements: string | null;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface SubmitProjectDTO {
  // Basic info (from existing project form)
  title: string;
  description: string;
  category: string;
  location: string;

  // Carbon calculation
  baseline_emissions: number;
  project_emissions: number;
  calculation_method: 'manual' | 'cdm' | 'vcs' | 'gold_standard';
  baseline_methodology?: string;
  project_methodology?: string;
  project_lifetime_years?: number;

  // Tokenomics
  token_exchange_rate?: number;
  funding_goal: number;
  min_investment?: number;

  // Documents (file paths after upload)
  documents: {
    type: DocumentType;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
  }[];
}

export interface AssignVerifierDTO {
  project_id: number;
  verifier_id: number;
  assigned_by: number;
  notes?: string;
}

export interface ReviewProjectDTO {
  project_id: number;
  decision: 'approve' | 'reject' | 'request_revision';
  notes?: string;
  next_stage?: WorkflowStage;
}

export interface WorkflowTimelineItem {
  stage: WorkflowStage;
  stage_name: string;
  status: 'completed' | 'current' | 'upcoming' | 'skipped';
  entered_at: Date | null;
  completed_at: Date | null;
  duration_days: number | null;
  assigned_user: {
    id: number;
    name: string;
    role: string;
  } | null;
  notes: string | null;
}

export interface ProjectWithWorkflow {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  workflow_stage: WorkflowStage;
  workflow_started_at: Date | null;
  workflow_completed_at: Date | null;
  assigned_verifier: { id: number; name: string; email: string } | null;
  assigned_consultant: { id: number; name: string; email: string } | null;
  timeline: WorkflowTimelineItem[];
  documents: ProjectDocument[];
  endorsements: ProjectEndorsement[];
  carbon_calculation: CarbonCalculation | null;
  latest_audit: AuditReport | null;
}
