/**
 * Investment Controller
 * Handles investment transactions and tracking
 */

import { Request, Response } from 'express';
import pool from '../config/database.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ============================================
// TYPES
// ============================================

interface InvestmentRequest {
  projectId: number;
  amount: number;
  currency?: string;
  paymentMethod?: 'crypto_wallet' | 'credit_card' | 'bank_transfer';
  walletAddress?: string;
  termsAccepted: boolean;
}

interface InvestmentCalculation {
  investmentAmount: number;
  platformFee: number;
  transactionFee: number;
  netAmount: number;
  tokensReceived: number;
  tokenPrice: number;
  carbonCredits: number;
  estimatedReturns: {
    monthly: number;
    yearly: number;
    total: number;
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate investment fees and returns
 */
function calculateInvestment(
  amount: number,
  tokenPrice: number,
  carbonCreditsPerToken: number,
  annualReturnRate: number = 0.12 // 12% default annual return
): InvestmentCalculation {
  // Fees
  const platformFee = amount * 0.02; // 2% platform fee
  const transactionFee = amount * 0.005; // 0.5% transaction fee
  const netAmount = amount - platformFee - transactionFee;

  // Tokens
  const tokensReceived = netAmount / tokenPrice;

  // Carbon Credits
  const carbonCredits = tokensReceived * carbonCreditsPerToken;

  // Estimated Returns (not guaranteed, for display only)
  const yearlyReturn = netAmount * annualReturnRate;
  const monthlyReturn = yearlyReturn / 12;
  const totalReturn = yearlyReturn * 5; // 5-year projection

  return {
    investmentAmount: amount,
    platformFee,
    transactionFee,
    netAmount,
    tokensReceived,
    tokenPrice,
    carbonCredits,
    estimatedReturns: {
      monthly: monthlyReturn,
      yearly: yearlyReturn,
      total: totalReturn,
    },
  };
}

// ============================================
// ENDPOINTS
// ============================================

/**
 * Create new investment
 * POST /api/investments
 */
export async function createInvestment(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const {
      projectId,
      amount,
      currency = 'USD',
      paymentMethod = 'crypto_wallet',
      walletAddress,
      termsAccepted,
    }: InvestmentRequest = req.body;

    // Validation
    if (!projectId || !amount || amount <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid investment data',
      });
      return;
    }

    if (!termsAccepted) {
      res.status(400).json({
        success: false,
        error: 'Terms and conditions must be accepted',
      });
      return;
    }

    await connection.beginTransaction();

    // Get project details
    const [projectRows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM projects WHERE id = ? AND workflow_stage = ? AND status = ?',
      [projectId, 'approved', 'active']
    );

    if (projectRows.length === 0) {
      await connection.rollback();
      res.status(404).json({
        success: false,
        error: 'Project not found or not available for investment',
      });
      return;
    }

    const project = projectRows[0];

    // Check investment limits
    const minInvestment = parseFloat(project.min_investment);
    const maxInvestment = parseFloat(project.funding_goal);

    if (amount < minInvestment) {
      await connection.rollback();
      res.status(400).json({
        success: false,
        error: `Minimum investment is $${minInvestment}`,
      });
      return;
    }

    if (amount > maxInvestment) {
      await connection.rollback();
      res.status(400).json({
        success: false,
        error: `Maximum investment is $${maxInvestment}`,
      });
      return;
    }

    // Check if project funding goal would be exceeded
    const currentFunding = parseFloat(project.current_funding);
    const fundingGoal = parseFloat(project.funding_goal);

    if (currentFunding + amount > fundingGoal) {
      await connection.rollback();
      res.status(400).json({
        success: false,
        error: `Investment would exceed project funding goal. Maximum available: $${(fundingGoal - currentFunding).toFixed(2)}`,
      });
      return;
    }

    // Get token price (from carbon credits calculation or default)
    const tokenPrice = 10; // Default $10 per CO2 token
    const carbonCreditsPerToken = 0.1; // Default 0.1 ton CO2 per token

    // Calculate investment
    const calculation = calculateInvestment(
      amount,
      tokenPrice,
      carbonCreditsPerToken
    );

    // Insert investment record
    const [investmentResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO investments (
        project_id,
        investor_id,
        amount,
        currency,
        platform_fee,
        transaction_fee,
        net_amount,
        tokens_received,
        token_symbol,
        token_price,
        carbon_credits,
        estimated_monthly_return,
        estimated_yearly_return,
        estimated_total_return,
        wallet_address,
        status,
        payment_method,
        terms_accepted,
        terms_accepted_at,
        ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        projectId,
        userId,
        calculation.investmentAmount,
        currency,
        calculation.platformFee,
        calculation.transactionFee,
        calculation.netAmount,
        calculation.tokensReceived,
        'CO2',
        calculation.tokenPrice,
        calculation.carbonCredits,
        calculation.estimatedReturns.monthly,
        calculation.estimatedReturns.yearly,
        calculation.estimatedReturns.total,
        walletAddress || null,
        'pending',
        paymentMethod,
        termsAccepted,
        req.ip,
      ]
    );

    const investmentId = investmentResult.insertId;

    // Update project funding and participants
    await connection.query(
      `UPDATE projects
       SET current_funding = current_funding + ?,
           participants_count = participants_count + 1
       WHERE id = ?`,
      [calculation.netAmount, projectId]
    );

    // Add system note
    await connection.query(
      `INSERT INTO investment_notes (investment_id, user_id, note, note_type)
       VALUES (?, ?, ?, ?)`,
      [
        investmentId,
        userId,
        `Investment created: $${amount} (${paymentMethod})`,
        'system',
      ]
    );

    await connection.commit();

    // Return investment details
    res.status(201).json({
      success: true,
      investment: {
        id: investmentId,
        projectId,
        amount: calculation.investmentAmount,
        netAmount: calculation.netAmount,
        tokensReceived: calculation.tokensReceived,
        carbonCredits: calculation.carbonCredits,
        status: 'pending',
        fees: {
          platform: calculation.platformFee,
          transaction: calculation.transactionFee,
        },
        estimatedReturns: calculation.estimatedReturns,
      },
    });
  } catch (error: any) {
    await connection.rollback();
    console.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create investment',
    });
  } finally {
    connection.release();
  }
}

/**
 * Get user's investments
 * GET /api/investments/my-investments
 */
export async function getMyInvestments(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const [investments] = await pool.query<RowDataPacket[]>(
      `SELECT
        i.*,
        p.title as project_title,
        p.category as project_category,
        p.status as project_status,
        p.image_url as project_image
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.investor_id = ?
      ORDER BY i.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      investments,
    });
  } catch (error: any) {
    console.error('Get my investments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch investments',
    });
  }
}

/**
 * Get investment details by ID
 * GET /api/investments/:id
 */
export async function getInvestmentById(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const investmentId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const [investments] = await pool.query<RowDataPacket[]>(
      `SELECT
        i.*,
        p.title as project_title,
        p.category as project_category,
        p.description as project_description,
        p.status as project_status,
        p.image_url as project_image
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.id = ? AND i.investor_id = ?`,
      [investmentId, userId]
    );

    if (investments.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Investment not found',
      });
      return;
    }

    // Get investment returns
    const [returns] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM investment_returns
       WHERE investment_id = ?
       ORDER BY period_start DESC`,
      [investmentId]
    );

    // Get investment notes
    const [notes] = await pool.query<RowDataPacket[]>(
      `SELECT
        n.*,
        u.email as user_email,
        COALESCE(u.organization_name, CONCAT(u.first_name, ' ', u.last_name)) as user_name
      FROM investment_notes n
      JOIN users u ON n.user_id = u.id
      WHERE n.investment_id = ?
      ORDER BY n.created_at DESC`,
      [investmentId]
    );

    res.json({
      success: true,
      investment: {
        ...investments[0],
        returns,
        notes,
      },
    });
  } catch (error: any) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch investment details',
    });
  }
}

/**
 * Get project investments (for project owners/admins)
 * GET /api/investments/project/:projectId
 */
export async function getProjectInvestments(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;
    const projectId = parseInt(req.params.projectId);

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    // Check if user is project owner or admin
    const [projects] = await pool.query<RowDataPacket[]>(
      'SELECT provider_id FROM projects WHERE id = ?',
      [projectId]
    );

    if (projects.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    // TODO: Add role check for admin users
    if (projects[0].provider_id !== userId) {
      res.status(403).json({
        success: false,
        error: 'Access denied',
      });
      return;
    }

    const [investments] = await pool.query<RowDataPacket[]>(
      `SELECT
        i.*,
        COALESCE(u.organization_name, CONCAT(u.first_name, ' ', u.last_name)) as investor_name,
        u.email as investor_email
      FROM investments i
      JOIN users u ON i.investor_id = u.id
      WHERE i.project_id = ?
      ORDER BY i.created_at DESC`,
      [projectId]
    );

    // Calculate totals
    const totalInvested = investments.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0);
    const totalInvestors = investments.length;

    res.json({
      success: true,
      investments,
      summary: {
        totalInvested,
        totalInvestors,
      },
    });
  } catch (error: any) {
    console.error('Get project investments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project investments',
    });
  }
}
