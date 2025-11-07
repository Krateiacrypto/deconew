/**
 * Investments API Service
 * Handles investment transactions and tracking
 */

import { apiClient, ApiResponse } from '../apiClient';

// ============================================
// TYPES
// ============================================

export interface Investment {
  id: number;
  project_id: number;
  investor_id: number;
  amount: number;
  currency: string;
  platform_fee: number;
  transaction_fee: number;
  net_amount: number;
  tokens_received: number;
  token_symbol: string;
  token_price: number;
  carbon_credits: number;
  estimated_monthly_return: number;
  estimated_yearly_return: number;
  estimated_total_return: number;
  transaction_hash: string | null;
  wallet_address: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: 'crypto_wallet' | 'credit_card' | 'bank_transfer';
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  created_at: string;
  completed_at: string | null;
  updated_at: string;

  // Joined fields from related tables
  project_title?: string;
  project_category?: string;
  project_status?: string;
  project_image?: string;
  project_description?: string;
}

export interface CreateInvestmentRequest {
  projectId: number;
  amount: number;
  currency?: string;
  paymentMethod?: 'crypto_wallet' | 'credit_card' | 'bank_transfer';
  walletAddress?: string;
  termsAccepted: boolean;
}

export interface CreateInvestmentResponse {
  success: boolean;
  investment: {
    id: number;
    projectId: number;
    amount: number;
    netAmount: number;
    tokensReceived: number;
    carbonCredits: number;
    status: string;
    fees: {
      platform: number;
      transaction: number;
    };
    estimatedReturns: {
      monthly: number;
      yearly: number;
      total: number;
    };
  };
}

export interface InvestmentReturn {
  id: number;
  investment_id: number;
  amount: number;
  return_type: 'monthly' | 'quarterly' | 'annual' | 'exit';
  period_start: string;
  period_end: string;
  status: 'pending' | 'paid' | 'cancelled';
  paid_at: string | null;
  transaction_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestmentNote {
  id: number;
  investment_id: number;
  user_id: number;
  note: string;
  note_type: 'admin' | 'system' | 'user';
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export interface InvestmentDetail extends Investment {
  returns: InvestmentReturn[];
  notes: InvestmentNote[];
}

export interface MyInvestmentsResponse {
  success: boolean;
  investments: Investment[];
}

export interface InvestmentDetailResponse {
  success: boolean;
  investment: InvestmentDetail;
}

export interface ProjectInvestmentsResponse {
  success: boolean;
  investments: (Investment & {
    investor_name: string;
    investor_email: string;
  })[];
  summary: {
    totalInvested: number;
    totalInvestors: number;
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Create new investment
 * POST /api/investments
 */
export async function createInvestment(
  data: CreateInvestmentRequest
): Promise<CreateInvestmentResponse> {
  return apiClient.post<CreateInvestmentResponse>('/investments', data, true);
}

/**
 * Get user's investments
 * GET /api/investments/my-investments
 */
export async function getMyInvestments(): Promise<MyInvestmentsResponse> {
  return apiClient.get<MyInvestmentsResponse>('/investments/my-investments', true);
}

/**
 * Get investment details by ID
 * GET /api/investments/:id
 */
export async function getInvestmentById(
  investmentId: number
): Promise<InvestmentDetailResponse> {
  return apiClient.get<InvestmentDetailResponse>(`/investments/${investmentId}`, true);
}

/**
 * Get project investments (for project owners/admins)
 * GET /api/investments/project/:projectId
 */
export async function getProjectInvestments(
  projectId: number
): Promise<ProjectInvestmentsResponse> {
  return apiClient.get<ProjectInvestmentsResponse>(
    `/investments/project/${projectId}`,
    true
  );
}

/**
 * Format investment amount for display
 */
export function formatInvestmentAmount(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get investment status label
 */
export function getInvestmentStatusLabel(
  status: Investment['status']
): { label: string; color: string } {
  const statusMap = {
    pending: { label: 'Beklemede', color: 'yellow' },
    processing: { label: 'İşleniyor', color: 'blue' },
    completed: { label: 'Tamamlandı', color: 'green' },
    failed: { label: 'Başarısız', color: 'red' },
    refunded: { label: 'İade Edildi', color: 'gray' },
  };
  return statusMap[status] || { label: 'Bilinmiyor', color: 'gray' };
}

/**
 * Get payment method label
 */
export function getPaymentMethodLabel(
  method: Investment['payment_method']
): { label: string; icon: string } {
  const methodMap = {
    crypto_wallet: { label: 'Kripto Cüzdan', icon: '🔐' },
    credit_card: { label: 'Kredi Kartı', icon: '💳' },
    bank_transfer: { label: 'Banka Transferi', icon: '🏦' },
  };
  return methodMap[method] || { label: 'Bilinmiyor', icon: '❓' };
}

/**
 * Calculate total returns received
 */
export function calculateTotalReturns(returns: InvestmentReturn[]): number {
  return returns
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);
}

/**
 * Calculate ROI percentage
 */
export function calculateROI(investment: Investment, totalReturns: number): number {
  if (investment.net_amount === 0) return 0;
  return ((totalReturns / investment.net_amount) * 100);
}
