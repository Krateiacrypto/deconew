/**
 * Carbon API Service
 * Handles carbon credit calculations and verification
 */

import { apiClient, ApiResponse } from '../apiClient';

// ============================================
// TYPES
// ============================================

export interface CarbonCalculationInput {
  baseline_emissions: number;
  project_emissions: number;
  project_lifetime_years?: number;
  leakage_factor?: number;
  uncertainty_factor?: number;
  buffer_factor?: number;
  token_exchange_rate?: number;
  methodology?: string;
}

export interface CarbonCalculationResult {
  inputs: {
    baseline_emissions: number;
    project_emissions: number;
    project_lifetime_years: number;
    leakage_factor: number;
    uncertainty_factor: number;
    buffer_factor: number;
    token_exchange_rate: number;
  };
  results: {
    annual_reduction: number;
    total_reduction: number;
    adjustments: {
      leakage: number;
      uncertainty: number;
      buffer: number;
      total: number;
    };
    net_reduction: number;
    total_tokens: number;
    reduction_percentage: string;
  };
}

export interface CarbonCalculation {
  id: number;
  project_id: number;
  baseline_emissions: number;
  project_emissions: number;
  annual_reduction: number;
  total_reduction: number;
  leakage_deduction: number;
  uncertainty_deduction: number;
  buffer_deduction: number;
  net_reduction: number;
  total_tokens: number;
  methodology: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_by?: number;
  verified_at?: string;
  verification_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Methodology {
  code: string;
  name: string;
  description: string;
  typical_buffer: number;
  documentation_url: string | null;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Calculate carbon credits (utility function, no auth required)
 */
export async function calculateCarbonCredits(
  input: CarbonCalculationInput
): Promise<ApiResponse<{ calculation: CarbonCalculationResult }>> {
  return apiClient.post('/carbon/calculate', input, false);
}

/**
 * Create or update carbon calculation for a project
 */
export async function createCarbonCalculation(
  projectId: number,
  input: CarbonCalculationInput
): Promise<
  ApiResponse<{ calculation_id: number; calculation: CarbonCalculation }>
> {
  return apiClient.post(`/projects/${projectId}/carbon-calculation`, input, true);
}

/**
 * Get carbon calculation for a project
 */
export async function getCarbonCalculation(
  projectId: number
): Promise<ApiResponse<{ calculation: CarbonCalculation }>> {
  return apiClient.get(`/projects/${projectId}/carbon-calculation`, true);
}

/**
 * Verify carbon calculation (admin/verifier only)
 */
export async function verifyCarbonCalculation(
  projectId: number,
  status: 'verified' | 'rejected',
  notes?: string
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post(
    `/admin/projects/${projectId}/verify-carbon`,
    { status, notes },
    true
  );
}

/**
 * Get available carbon credit methodologies
 */
export async function getMethodologies(): Promise<
  ApiResponse<{ methodologies: Methodology[] }>
> {
  return apiClient.get('/carbon/methodologies', false);
}

/**
 * Calculate estimated tokens for a project
 */
export function estimateTokens(
  baselineEmissions: number,
  projectEmissions: number,
  lifetimeYears: number = 10,
  bufferFactor: number = 0.1,
  tokenExchangeRate: number = 1
): number {
  const annualReduction = baselineEmissions - projectEmissions;
  const totalReduction = annualReduction * lifetimeYears;
  const buffer = totalReduction * bufferFactor;
  const netReduction = totalReduction - buffer;
  return Math.floor(netReduction * tokenExchangeRate);
}

/**
 * Format CO2 value with proper units
 */
export function formatCO2(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)} Mt CO₂`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kt CO₂`;
  } else {
    return `${value.toFixed(2)} t CO₂`;
  }
}

/**
 * Calculate reduction percentage
 */
export function calculateReductionPercentage(
  baseline: number,
  projected: number
): string {
  if (baseline === 0) return '0.00';
  const reduction = ((baseline - projected) / baseline) * 100;
  return reduction.toFixed(2);
}
