/**
 * NGO Controller
 * Handles NGO registry and project endorsements
 */

import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {
  CreateNGORegistryDTO,
  CreateEndorsementDTO,
  EndorsementLevel,
  NGOVerificationStatus,
} from '../types/workflow.js';

/**
 * Register a new NGO
 * POST /api/ngo/register
 */
export async function registerNGO(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      official_name,
      registration_number,
      country,
      focus_areas,
      mission_statement,
      email,
      website,
      phone,
      vision_statement,
      has_501c3,
      has_transparency_cert,
    } = req.body as CreateNGORegistryDTO;

    // Check if NGO already registered for this user
    const [existing] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM ngo_registry WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      res.status(400).json({ error: 'NGO already registered for this user' });
      return;
    }

    // Insert NGO registry
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO ngo_registry (
        user_id, official_name, registration_number, country,
        focus_areas, mission_statement, vision_statement,
        email, website, phone,
        has_501c3, has_transparency_cert,
        verification_status, profile_completeness
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 30)`,
      [
        userId, official_name, registration_number, country,
        JSON.stringify(focus_areas), mission_statement, vision_statement,
        email, website, phone,
        has_501c3 || false, has_transparency_cert || false
      ]
    );

    const ngoId = result.insertId;

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'NGO registration submitted for review',
      ngo_id: ngoId,
      verification_status: 'pending',
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Register NGO error:', error);
    res.status(500).json({
      error: 'Failed to register NGO',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}

/**
 * Get pending NGO registrations (admin)
 * GET /api/admin/ngo/pending
 */
export async function getPendingNGOs(req: Request, res: Response): Promise<void> {
  try {
    const status = req.query.status as NGOVerificationStatus || 'pending';

    const [ngos] = await pool.query<RowDataPacket[]>(
      `SELECT
        nr.*,
        u.email as user_email,
        u.full_name as user_name
      FROM ngo_registry nr
      JOIN users u ON nr.user_id = u.id
      WHERE nr.verification_status = ?
      ORDER BY nr.joined_at ASC`,
      [status]
    );

    res.json({
      success: true,
      count: ngos.length,
      ngos,
    });

  } catch (error: any) {
    console.error('Get pending NGOs error:', error);
    res.status(500).json({
      error: 'Failed to fetch pending NGOs',
      details: error.message,
    });
  }
}

/**
 * Approve or reject NGO registration (admin)
 * POST /api/admin/ngo/:id/review
 */
export async function reviewNGO(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const ngoId = parseInt(req.params.id);
    const { decision, notes } = req.body; // decision: 'approve' | 'reject'
    const admin_id = req.user?.id;

    if (!admin_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const newStatus: NGOVerificationStatus = decision === 'approve' ? 'approved' : 'rejected';

    await connection.query(
      `UPDATE ngo_registry SET
        verification_status = ?,
        verified_at = NOW(),
        verified_by = ?,
        admin_notes = ?,
        rejection_reason = ?
      WHERE id = ?`,
      [
        newStatus,
        admin_id,
        notes,
        decision === 'reject' ? notes : null,
        ngoId
      ]
    );

    await connection.commit();

    res.json({
      success: true,
      message: `NGO ${decision}d successfully`,
      ngo_id: ngoId,
      verification_status: newStatus,
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Review NGO error:', error);
    res.status(500).json({
      error: 'Failed to review NGO',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}

/**
 * Endorse a project (NGO)
 * POST /api/ngo/endorse/:projectId
 */
export async function endorseProject(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const projectId = parseInt(req.params.projectId);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get NGO ID from user
    const [ngoResult] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM ngo_registry WHERE user_id = ? AND verification_status = \'approved\'',
      [userId]
    );

    if (ngoResult.length === 0) {
      res.status(403).json({ error: 'NGO not found or not approved' });
      return;
    }

    const ngoId = ngoResult[0].id;

    const {
      support_level,
      support_rationale,
      expertise_alignment,
      risk_assessment,
      co_promotion_willing,
      technical_assistance_offered,
      technical_assistance_details,
      monetary_commitment,
    } = req.body as CreateEndorsementDTO;

    // Check if already endorsed
    const [existing] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM project_endorsements WHERE project_id = ? AND ngo_id = ?',
      [projectId, ngoId]
    );

    if (existing.length > 0) {
      res.status(400).json({ error: 'Project already endorsed by this NGO' });
      return;
    }

    // Insert endorsement
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO project_endorsements (
        project_id, ngo_id, support_level, support_rationale,
        expertise_alignment, risk_assessment,
        co_promotion_willing, technical_assistance_offered, technical_assistance_details,
        monetary_commitment, monetary_committed,
        status, endorsed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
      [
        projectId, ngoId, support_level, support_rationale,
        expertise_alignment, risk_assessment,
        co_promotion_willing || false, technical_assistance_offered || false, technical_assistance_details,
        monetary_commitment || 0, (monetary_commitment && monetary_commitment > 0)
      ]
    );

    const endorsementId = result.insertId;

    // Update project endorsement count and level manually (since no triggers)
    await connection.query(
      `UPDATE projects SET
        endorsement_count = endorsement_count + 1,
        highest_endorsement_level = CASE
          WHEN ? = 'FULL' THEN 'FULL'
          WHEN ? = 'HIGH' AND highest_endorsement_level != 'FULL' THEN 'HIGH'
          WHEN ? = 'MEDIUM' AND highest_endorsement_level NOT IN ('FULL', 'HIGH') THEN 'MEDIUM'
          WHEN ? = 'LOW' AND highest_endorsement_level = 'NONE' THEN 'LOW'
          ELSE highest_endorsement_level
        END
      WHERE id = ?`,
      [support_level, support_level, support_level, support_level, projectId]
    );

    // Update NGO stats manually
    await connection.query(
      `UPDATE ngo_registry SET
        total_endorsements = total_endorsements + 1,
        active_endorsements = active_endorsements + 1
      WHERE id = ?`,
      [ngoId]
    );

    // Create endorsement history
    await connection.query(
      `INSERT INTO endorsement_history (
        endorsement_id, project_id, ngo_id, action,
        to_status, to_level, changed_by, notes
      ) VALUES (?, ?, ?, 'created', 'active', ?, ?, 'Endorsement created')`,
      [endorsementId, projectId, ngoId, support_level, userId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Project endorsed successfully',
      endorsement_id: endorsementId,
      support_level,
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Endorse project error:', error);
    res.status(500).json({
      error: 'Failed to endorse project',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}

/**
 * Get endorsements for a project
 * GET /api/projects/:id/endorsements
 */
export async function getProjectEndorsements(req: Request, res: Response): Promise<void> {
  try {
    const projectId = parseInt(req.params.id);

    const [endorsements] = await pool.query<RowDataPacket[]>(
      `SELECT
        pe.*,
        nr.official_name as ngo_name,
        nr.short_name as ngo_short_name,
        nr.website as ngo_website,
        eli.badge_text, eli.fee_discount_percentage, eli.visibility_boost
      FROM project_endorsements pe
      JOIN ngo_registry nr ON pe.ngo_id = nr.id
      JOIN endorsement_levels_info eli ON pe.support_level = eli.level_code
      WHERE pe.project_id = ? AND pe.status = 'active' AND pe.is_public = TRUE
      ORDER BY
        FIELD(pe.support_level, 'FULL', 'HIGH', 'MEDIUM', 'LOW'),
        pe.endorsed_at DESC`,
      [projectId]
    );

    res.json({
      success: true,
      count: endorsements.length,
      endorsements,
    });

  } catch (error: any) {
    console.error('Get project endorsements error:', error);
    res.status(500).json({
      error: 'Failed to fetch endorsements',
      details: error.message,
    });
  }
}

/**
 * Get NGO profile
 * GET /api/ngo/:id
 */
export async function getNGOProfile(req: Request, res: Response): Promise<void> {
  try {
    const ngoId = parseInt(req.params.id);

    const [ngos] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ngo_registry WHERE id = ? AND verification_status = 'approved'`,
      [ngoId]
    );

    if (ngos.length === 0) {
      res.status(404).json({ error: 'NGO not found or not approved' });
      return;
    }

    const ngo = ngos[0];

    // Get team members
    const [team] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ngo_team_members WHERE ngo_id = ? ORDER BY display_order, is_primary_contact DESC',
      [ngoId]
    );

    // Get achievements
    const [achievements] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ngo_achievements WHERE ngo_id = ? AND display_on_profile = TRUE ORDER BY display_order, year DESC',
      [ngoId]
    );

    // Get recent endorsements
    const [endorsements] = await pool.query<RowDataPacket[]>(
      `SELECT
        pe.support_level, pe.endorsed_at,
        p.title as project_title, p.category, p.location
      FROM project_endorsements pe
      JOIN projects p ON pe.project_id = p.id
      WHERE pe.ngo_id = ? AND pe.status = 'active'
      ORDER BY pe.endorsed_at DESC
      LIMIT 10`,
      [ngoId]
    );

    res.json({
      success: true,
      ngo: {
        ...ngo,
        focus_areas: JSON.parse(ngo.focus_areas),
        social_media: ngo.social_media ? JSON.parse(ngo.social_media) : null,
        certification_documents: ngo.certification_documents ? JSON.parse(ngo.certification_documents) : null,
      },
      team,
      achievements,
      endorsements,
    });

  } catch (error: any) {
    console.error('Get NGO profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch NGO profile',
      details: error.message,
    });
  }
}

/**
 * Get current user's NGO profile
 * GET /api/ngo/profile
 */
export async function getMyNGOProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const [ngos] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ngo_registry WHERE user_id = ?`,
      [userId]
    );

    if (ngos.length === 0) {
      res.status(404).json({ error: 'NGO profile not found' });
      return;
    }

    const ngo = ngos[0];

    // Get team members
    const [team] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ngo_team_members WHERE ngo_id = ? ORDER BY display_order, is_primary_contact DESC',
      [ngo.id]
    );

    // Get achievements
    const [achievements] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ngo_achievements WHERE ngo_id = ? ORDER BY display_order, year DESC',
      [ngo.id]
    );

    res.json({
      success: true,
      data: {
        ...ngo,
        focus_areas: JSON.parse(ngo.focus_areas || '[]'),
        social_media: ngo.social_media ? JSON.parse(ngo.social_media) : null,
        certification_documents: ngo.certification_documents ? JSON.parse(ngo.certification_documents) : null,
      },
      team,
      achievements,
    });

  } catch (error: any) {
    console.error('Get my NGO profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch NGO profile',
      details: error.message,
    });
  }
}

/**
 * Get current user's NGO endorsements
 * GET /api/ngo/my-endorsements
 */
export async function getMyEndorsements(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get NGO ID from user
    const [ngoResult] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM ngo_registry WHERE user_id = ?',
      [userId]
    );

    if (ngoResult.length === 0) {
      res.status(404).json({ error: 'NGO not found' });
      return;
    }

    const ngoId = ngoResult[0].id;

    // Get endorsements with project details
    const [endorsements] = await pool.query<RowDataPacket[]>(
      `SELECT
        pe.*,
        p.id as project_id,
        p.title,
        p.description,
        p.location,
        p.project_type,
        p.co2_reduction_calculated,
        p.funding_goal,
        p.funding_raised,
        p.current_stage,
        p.created_at as project_created_at
      FROM project_endorsements pe
      JOIN projects p ON pe.project_id = p.id
      WHERE pe.ngo_id = ?
      ORDER BY pe.endorsed_at DESC`,
      [ngoId]
    );

    res.json({
      success: true,
      data: endorsements,
      count: endorsements.length,
    });

  } catch (error: any) {
    console.error('Get my endorsements error:', error);
    res.status(500).json({
      error: 'Failed to fetch endorsements',
      details: error.message,
    });
  }
}

/**
 * Get all approved NGOs (marketplace)
 * GET /api/ngo/list
 */
export async function listNGOs(req: Request, res: Response): Promise<void> {
  try {
    const { focus_area, country, min_transparency_score } = req.query;

    let query = `
      SELECT
        id, official_name, short_name, country,
        focus_areas, mission_statement, website,
        total_endorsements, active_endorsements, average_endorsement_level,
        transparency_score, profile_completeness
      FROM ngo_registry
      WHERE verification_status = 'approved'
    `;

    const params: any[] = [];

    if (focus_area) {
      query += ` AND JSON_CONTAINS(focus_areas, ?)`;
      params.push(JSON.stringify(focus_area));
    }

    if (country) {
      query += ` AND country = ?`;
      params.push(country);
    }

    if (min_transparency_score) {
      query += ` AND transparency_score >= ?`;
      params.push(parseInt(min_transparency_score as string));
    }

    query += ` ORDER BY active_endorsements DESC, transparency_score DESC`;

    const [ngos] = await pool.query<RowDataPacket[]>(query, params);

    res.json({
      success: true,
      count: ngos.length,
      ngos: ngos.map((ngo: any) => ({
        ...ngo,
        focus_areas: typeof ngo.focus_areas === 'string' ? JSON.parse(ngo.focus_areas) : ngo.focus_areas,
      })),
    });

  } catch (error: any) {
    console.error('List NGOs error:', error);
    res.status(500).json({
      error: 'Failed to fetch NGOs',
      details: error.message,
    });
  }
}
