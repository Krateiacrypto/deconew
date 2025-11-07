/**
 * Carbon Calculation Controller
 * Handles carbon credit calculations and verification
 */

import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {
  CreateCarbonCalculationDTO,
  VerifyCarbonCalculationDTO,
  MethodologyStandard,
} from '../types/workflow.js';

/**
 * Create or update carbon calculation for a project
 * POST /api/projects/:id/carbon-calculation
 */
export async function createCarbonCalculation(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const projectId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      baseline_emissions,
      baseline_methodology,
      baseline_data_source,
      baseline_calculation_date,
      project_emissions,
      project_methodology,
      project_data_source,
      project_lifetime_years = 10,
      leakage_factor = 0,
      uncertainty_factor = 0,
      buffer_factor = 0.10, // 10% default buffer
      token_exchange_rate = 1.0,
      methodology_standard,
      methodology_version,
    } = req.body as CreateCarbonCalculationDTO;

    // Calculate reductions
    const annual_reduction = baseline_emissions - project_emissions;
    const total_reduction = annual_reduction * project_lifetime_years;

    // Apply adjustments
    const leakage_deduction = total_reduction * (leakage_factor / 100);
    const uncertainty_deduction = total_reduction * (uncertainty_factor / 100);
    const buffer_deduction = total_reduction * buffer_factor;

    const net_reduction = total_reduction - leakage_deduction - uncertainty_deduction - buffer_deduction;
    const total_tokens = net_reduction * token_exchange_rate;

    // Check if calculation already exists
    const [existing] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM carbon_calculations WHERE project_id = ?',
      [projectId]
    );

    if (existing.length > 0) {
      // Update existing
      await connection.query(
        `UPDATE carbon_calculations SET
          baseline_emissions = ?, baseline_methodology = ?, baseline_data_source = ?,
          baseline_calculation_date = ?, project_emissions = ?, project_methodology = ?,
          project_data_source = ?, project_lifetime_years = ?,
          leakage_factor = ?, uncertainty_factor = ?, buffer_factor = ?,
          net_reduction = ?, token_exchange_rate = ?, total_tokens = ?,
          methodology_standard = ?, methodology_version = ?,
          calculated_by = ?, calculated_at = NOW(), verification_status = 'pending'
        WHERE project_id = ?`,
        [
          baseline_emissions, baseline_methodology, baseline_data_source,
          baseline_calculation_date, project_emissions, project_methodology,
          project_data_source, project_lifetime_years,
          leakage_factor, uncertainty_factor, buffer_factor,
          net_reduction, token_exchange_rate, total_tokens,
          methodology_standard, methodology_version,
          userId, projectId
        ]
      );
    } else {
      // Insert new
      await connection.query(
        `INSERT INTO carbon_calculations (
          project_id, baseline_emissions, baseline_methodology, baseline_data_source,
          baseline_calculation_date, project_emissions, project_methodology,
          project_data_source, project_lifetime_years,
          leakage_factor, uncertainty_factor, buffer_factor,
          net_reduction, token_exchange_rate, total_tokens,
          methodology_standard, methodology_version,
          calculated_by, verification_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          projectId, baseline_emissions, baseline_methodology, baseline_data_source,
          baseline_calculation_date, project_emissions, project_methodology,
          project_data_source, project_lifetime_years,
          leakage_factor, uncertainty_factor, buffer_factor,
          net_reduction, token_exchange_rate, total_tokens,
          methodology_standard, methodology_version,
          userId
        ]
      );
    }

    // Update project table
    await connection.query(
      `UPDATE projects SET
        baseline_emissions = ?, project_emissions = ?, co2_reduction_calculated = ?,
        token_exchange_rate = ?, calculation_method = ?, carbon_credits = ?,
        calculation_verified = FALSE, updated_at = NOW(), updated_by = ?
      WHERE id = ?`,
      [
        baseline_emissions, project_emissions, net_reduction,
        token_exchange_rate, methodology_standard || 'manual', total_tokens,
        userId, projectId
      ]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Carbon calculation saved successfully',
      calculation: {
        project_id: projectId,
        baseline_emissions,
        project_emissions,
        annual_reduction,
        total_reduction,
        net_reduction,
        total_tokens,
        adjustments: {
          leakage: leakage_deduction,
          uncertainty: uncertainty_deduction,
          buffer: buffer_deduction,
        },
        verification_status: 'pending',
      },
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Create carbon calculation error:', error);
    res.status(500).json({
      error: 'Failed to create carbon calculation',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}

/**
 * Get carbon calculation for a project
 * GET /api/projects/:id/carbon-calculation
 */
export async function getCarbonCalculation(req: Request, res: Response): Promise<void> {
  try {
    const projectId = parseInt(req.params.id);

    const [calculations] = await pool.query<RowDataPacket[]>(
      `SELECT
        cc.*,
        u.full_name as calculated_by_name,
        u.email as calculated_by_email,
        v.full_name as verified_by_name,
        v.email as verified_by_email
      FROM carbon_calculations cc
      JOIN users u ON cc.calculated_by = u.id
      LEFT JOIN users v ON cc.verified_by = v.id
      WHERE cc.project_id = ?`,
      [projectId]
    );

    if (calculations.length === 0) {
      res.status(404).json({ error: 'Carbon calculation not found' });
      return;
    }

    res.json({
      success: true,
      calculation: calculations[0],
    });

  } catch (error: any) {
    console.error('Get carbon calculation error:', error);
    res.status(500).json({
      error: 'Failed to fetch carbon calculation',
      details: error.message,
    });
  }
}

/**
 * Verify carbon calculation (admin/verifier)
 * POST /api/admin/projects/:id/verify-carbon
 */
export async function verifyCarbonCalculation(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const projectId = parseInt(req.params.id);
    const { verification_status, verification_notes } = req.body as VerifyCarbonCalculationDTO;
    const verifier_id = req.user?.id;

    if (!verifier_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Update carbon calculation
    await connection.query(
      `UPDATE carbon_calculations SET
        verification_status = ?, verification_notes = ?,
        verified_by = ?, verified_at = NOW()
      WHERE project_id = ?`,
      [verification_status, verification_notes, verifier_id, projectId]
    );

    // Update project if approved
    if (verification_status === 'approved') {
      await connection.query(
        `UPDATE projects SET
          calculation_verified = TRUE,
          calculation_verified_at = NOW(),
          calculation_verified_by = ?,
          updated_at = NOW(), updated_by = ?
        WHERE id = ?`,
        [verifier_id, verifier_id, projectId]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: `Carbon calculation ${verification_status}`,
      project_id: projectId,
      verification_status,
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Verify carbon calculation error:', error);
    res.status(500).json({
      error: 'Failed to verify carbon calculation',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}

/**
 * Get available calculation methodologies
 * GET /api/carbon/methodologies
 */
export async function getMethodologies(req: Request, res: Response): Promise<void> {
  try {
    const methodologies = [
      {
        code: 'CDM',
        name: 'Clean Development Mechanism',
        description: 'UN framework for emission reduction projects',
        typical_buffer: 0.10,
        documentation_url: 'https://cdm.unfccc.int/',
      },
      {
        code: 'VCS',
        name: 'Verified Carbon Standard',
        description: 'Leading voluntary carbon credit program',
        typical_buffer: 0.15,
        documentation_url: 'https://verra.org/programs/verified-carbon-standard/',
      },
      {
        code: 'Gold Standard',
        name: 'Gold Standard',
        description: 'High-quality carbon credit certification',
        typical_buffer: 0.20,
        documentation_url: 'https://www.goldstandard.org/',
      },
      {
        code: 'ACR',
        name: 'American Carbon Registry',
        description: 'First private voluntary greenhouse gas registry',
        typical_buffer: 0.10,
        documentation_url: 'https://americancarbonregistry.org/',
      },
      {
        code: 'CAR',
        name: 'Climate Action Reserve',
        description: 'North America carbon offset program',
        typical_buffer: 0.10,
        documentation_url: 'https://www.climateactionreserve.org/',
      },
      {
        code: 'Custom',
        name: 'Custom Methodology',
        description: 'Platform-specific calculation method',
        typical_buffer: 0.15,
        documentation_url: null,
      },
    ];

    res.json({
      success: true,
      methodologies,
    });

  } catch (error: any) {
    console.error('Get methodologies error:', error);
    res.status(500).json({
      error: 'Failed to fetch methodologies',
      details: error.message,
    });
  }
}

/**
 * Calculate carbon credits (utility function)
 * POST /api/carbon/calculate
 */
export async function calculateCredits(req: Request, res: Response): Promise<void> {
  try {
    const {
      baseline_emissions,
      project_emissions,
      project_lifetime_years = 10,
      leakage_factor = 0,
      uncertainty_factor = 0,
      buffer_factor = 0.10,
      token_exchange_rate = 1.0,
    } = req.body;

    // Validate inputs
    if (baseline_emissions <= 0 || project_emissions < 0) {
      res.status(400).json({ error: 'Invalid emissions values' });
      return;
    }

    if (baseline_emissions <= project_emissions) {
      res.status(400).json({
        error: 'Project emissions must be less than baseline emissions',
      });
    }

    // Calculate
    const annual_reduction = baseline_emissions - project_emissions;
    const total_reduction = annual_reduction * project_lifetime_years;

    const leakage_deduction = total_reduction * (leakage_factor / 100);
    const uncertainty_deduction = total_reduction * (uncertainty_factor / 100);
    const buffer_deduction = total_reduction * buffer_factor;

    const net_reduction = total_reduction - leakage_deduction - uncertainty_deduction - buffer_deduction;
    const total_tokens = net_reduction * token_exchange_rate;

    res.json({
      success: true,
      calculation: {
        inputs: {
          baseline_emissions,
          project_emissions,
          project_lifetime_years,
          leakage_factor,
          uncertainty_factor,
          buffer_factor,
          token_exchange_rate,
        },
        results: {
          annual_reduction,
          total_reduction,
          adjustments: {
            leakage: leakage_deduction,
            uncertainty: uncertainty_deduction,
            buffer: buffer_deduction,
            total: leakage_deduction + uncertainty_deduction + buffer_deduction,
          },
          net_reduction,
          total_tokens,
          reduction_percentage: ((annual_reduction / baseline_emissions) * 100).toFixed(2),
        },
      },
    });

  } catch (error: any) {
    console.error('Calculate credits error:', error);
    res.status(500).json({
      error: 'Failed to calculate credits',
      details: error.message,
    });
  }
}
