/**
 * Workflow Controller
 * Handles 7-stage project workflow operations
 */

import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {
  WorkflowStage,
  ProjectWorkflowData,
  CreateWorkflowHistoryDTO,
  CreateAssignmentDTO,
  AssignVerifierDTO,
  ReviewProjectDTO,
  WorkflowTimelineItem,
} from '../types/workflow.js';

/**
 * Submit a new project with carbon calculation
 * POST /api/projects/submit
 */
export async function submitProject(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      title,
      description,
      category,
      location,
      baseline_emissions,
      project_emissions,
      calculation_method,
      baseline_methodology,
      project_methodology,
      project_lifetime_years = 10,
      token_exchange_rate = 1.0,
      funding_goal,
      min_investment = 100,
      documents = [],
    } = req.body;

    const provider_id = req.user?.id; // From auth middleware

    if (!provider_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Calculate CO2 reduction
    const co2_reduction_calculated = baseline_emissions - project_emissions;

    // Insert project
    const [projectResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO projects (
        title, description, category, location,
        provider_id, status, workflow_stage,
        baseline_emissions, project_emissions, co2_reduction_calculated,
        token_exchange_rate, calculation_method,
        carbon_credits, funding_goal, min_investment,
        workflow_started_at, created_at, updated_at, updated_by
      ) VALUES (?, ?, ?, ?, ?, 'draft', 'pending_admin_review', ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW(), ?)`,
      [
        title, description, category, location,
        provider_id,
        baseline_emissions, project_emissions, co2_reduction_calculated,
        token_exchange_rate, calculation_method,
        co2_reduction_calculated * token_exchange_rate, // carbon_credits
        funding_goal, min_investment,
        provider_id
      ]
    );

    const projectId = projectResult.insertId;

    // Insert carbon calculation
    await connection.query(
      `INSERT INTO carbon_calculations (
        project_id, baseline_emissions, baseline_methodology,
        project_emissions, project_methodology,
        project_lifetime_years, token_exchange_rate,
        calculated_by, verification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        projectId, baseline_emissions, baseline_methodology,
        project_emissions, project_methodology,
        project_lifetime_years, token_exchange_rate,
        provider_id
      ]
    );

    // Insert documents
    for (const doc of documents) {
      await connection.query(
        `INSERT INTO project_documents (
          project_id, document_type, file_name, file_path,
          file_size, file_type, uploaded_by, workflow_stage, is_required
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_admin_review', ?)`,
        [
          projectId, doc.type, doc.file_name, doc.file_path,
          doc.file_size, doc.file_type, provider_id, doc.is_required || false
        ]
      );
    }

    // Create workflow history entry
    await connection.query(
      `INSERT INTO workflow_history (
        project_id, from_stage, to_stage, changed_by, action, notes
      ) VALUES (?, NULL, 'pending_admin_review', ?, 'submitted', 'Project submitted for review')`,
      [projectId, provider_id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully',
      project_id: projectId,
      workflow_stage: 'pending_admin_review',
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Submit project error:', error);
    res.status(500).json({
      error: 'Failed to submit project',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}

/**
 * Get pending projects for admin review
 * GET /api/admin/projects/pending
 */
export async function getPendingProjects(req: Request, res: Response): Promise<void> {
  try {
    const stage = req.query.stage as WorkflowStage || 'pending_admin_review';

    const [projects] = await pool.query<RowDataPacket[]>(
      `SELECT
        p.*,
        u.email as provider_email,
        COALESCE(u.organization_name, CONCAT(u.first_name, ' ', u.last_name)) as provider_name,
        (SELECT COUNT(*) FROM project_documents WHERE project_id = p.id) as document_count,
        (SELECT COUNT(*) FROM project_documents WHERE project_id = p.id AND is_verified = TRUE) as verified_document_count
      FROM projects p
      JOIN users u ON p.provider_id = u.id
      WHERE p.workflow_stage = ?
      ORDER BY p.created_at ASC`,
      [stage]
    );

    res.json({
      success: true,
      count: projects.length,
      projects,
    });

  } catch (error: any) {
    console.error('Get pending projects error:', error);
    res.status(500).json({
      error: 'Failed to fetch pending projects',
      details: error.message,
    });
  }
}

/**
 * Get approved/active projects for public listing
 * GET /api/projects
 */
export async function getPublicProjects(req: Request, res: Response): Promise<void> {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT
        p.*,
        COALESCE(u.organization_name, CONCAT(u.first_name, ' ', u.last_name)) as provider_name,
        (SELECT COUNT(*) FROM project_endorsements WHERE project_id = p.id AND status = 'active') as endorsement_count
      FROM projects p
      JOIN users u ON p.provider_id = u.id
      WHERE p.workflow_stage = 'approved' AND p.status = 'active'
    `;

    const params: any[] = [];

    if (category && category !== 'all') {
      query += ` AND p.category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.location LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const [projects] = await pool.query<RowDataPacket[]>(query, params);

    res.json({
      success: true,
      count: projects.length,
      projects,
    });

  } catch (error: any) {
    console.error('Get public projects error:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      details: error.message,
    });
  }
}

/**
 * Assign verifier to project
 * POST /api/admin/projects/:id/assign-verifier
 */
export async function assignVerifier(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const projectId = parseInt(req.params.id);
    const { verifier_id, notes } = req.body;
    const admin_id = req.user?.id;

    if (!admin_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if verifier exists and has verifier role
    const [verifier] = await connection.query<RowDataPacket[]>(
      `SELECT u.id FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE u.id = ? AND r.name = 'verifier'`,
      [verifier_id]
    );

    if (verifier.length === 0) {
      res.status(400).json({ error: 'Invalid verifier ID or user is not a verifier' });
      return;
    }

    // Update project
    await connection.query(
      `UPDATE projects
       SET assigned_verifier_id = ?, assigned_at = NOW(),
           workflow_stage = 'under_verification', updated_at = NOW(), updated_by = ?
       WHERE id = ?`,
      [verifier_id, admin_id, projectId]
    );

    // Create assignment
    await connection.query(
      `INSERT INTO project_assignments (
        project_id, user_id, role, assigned_by, status
      ) VALUES (?, ?, 'verifier', ?, 'pending')`,
      [projectId, verifier_id, admin_id]
    );

    // Create workflow history
    await connection.query(
      `INSERT INTO workflow_history (
        project_id, from_stage, to_stage, changed_by, action, notes, metadata
      ) VALUES (?, 'pending_admin_review', 'under_verification', ?, 'assigned', ?, ?)`,
      [projectId, admin_id, notes || 'Verifier assigned', JSON.stringify({ verifier_id })]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Verifier assigned successfully',
      project_id: projectId,
      verifier_id,
      workflow_stage: 'under_verification',
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Assign verifier error:', error);
    res.status(500).json({
      error: 'Failed to assign verifier',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}

/**
 * Review project (approve, reject, or request revision)
 * POST /api/admin/projects/:id/review
 */
export async function reviewProject(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const projectId = parseInt(req.params.id);
    const { decision, notes, next_stage } = req.body as ReviewProjectDTO;
    const reviewer_id = req.user?.id;

    if (!reviewer_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get current project state
    const [projects] = await connection.query<RowDataPacket[]>(
      'SELECT workflow_stage FROM projects WHERE id = ?',
      [projectId]
    );

    if (projects.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const currentStage = projects[0].workflow_stage;
    let newStage: WorkflowStage;
    let action: string;

    switch (decision) {
      case 'approve':
        newStage = next_stage || 'under_verification';
        action = 'approved';
        break;
      case 'reject':
        newStage = 'rejected';
        action = 'rejected';
        await connection.query(
          `UPDATE projects SET rejection_reason = ?, rejected_by = ?, rejected_at = NOW() WHERE id = ?`,
          [notes, reviewer_id, projectId]
        );
        break;
      case 'request_revision':
        newStage = 'revision_requested';
        action = 'revision_requested';
        await connection.query(
          `UPDATE projects SET revision_notes = ?, revision_count = revision_count + 1 WHERE id = ?`,
          [notes, projectId]
        );
        break;
      default:
        res.status(400).json({ error: 'Invalid decision' });
      return;
    }

    // Update project workflow stage
    await connection.query(
      `UPDATE projects SET workflow_stage = ?, updated_at = NOW(), updated_by = ? WHERE id = ?`,
      [newStage, reviewer_id, projectId]
    );

    // If approved and moving to final stage
    if (newStage === 'approved') {
      await connection.query(
        `UPDATE projects SET workflow_completed_at = NOW() WHERE id = ?`,
        [projectId]
      );
    }

    // Create workflow history
    await connection.query(
      `INSERT INTO workflow_history (
        project_id, from_stage, to_stage, changed_by, action, notes
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [projectId, currentStage, newStage, reviewer_id, action, notes]
    );

    await connection.commit();

    res.json({
      success: true,
      message: `Project ${decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'revision requested'}`,
      project_id: projectId,
      workflow_stage: newStage,
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Review project error:', error);
    res.status(500).json({
      error: 'Failed to review project',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}

/**
 * Get workflow timeline for a project
 * GET /api/projects/:id/workflow-timeline
 */
export async function getWorkflowTimeline(req: Request, res: Response): Promise<void> {
  try {
    const projectId = parseInt(req.params.id);

    // Get workflow history
    const [history] = await pool.query<RowDataPacket[]>(
      `SELECT
        wh.*,
        COALESCE(u.organization_name, CONCAT(u.first_name, ' ', u.last_name)) as changed_by_name,
        u.email as changed_by_email
      FROM workflow_history wh
      JOIN users u ON wh.changed_by = u.id
      WHERE wh.project_id = ?
      ORDER BY wh.changed_at ASC`,
      [projectId]
    );

    // Get current project state
    const [projects] = await pool.query<RowDataPacket[]>(
      `SELECT
        p.workflow_stage, p.workflow_started_at, p.workflow_completed_at,
        p.assigned_verifier_id, p.assigned_consultant_id,
        COALESCE(v.organization_name, CONCAT(v.first_name, ' ', v.last_name)) as verifier_name, v.email as verifier_email,
        COALESCE(c.organization_name, CONCAT(c.first_name, ' ', c.last_name)) as consultant_name, c.email as consultant_email
      FROM projects p
      LEFT JOIN users v ON p.assigned_verifier_id = v.id
      LEFT JOIN users c ON p.assigned_consultant_id = c.id
      WHERE p.id = ?`,
      [projectId]
    );

    if (projects.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const project = projects[0];

    // Get all workflow stages info
    const [stages] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM workflow_stage_info ORDER BY stage_number ASC'
    );

    // Build timeline
    const timeline: WorkflowTimelineItem[] = stages.map(stage => {
      const historyEntry = history.find(h => h.to_stage === stage.stage_code);
      const isCurrentStage = project.workflow_stage === stage.stage_code;

      let status: 'completed' | 'current' | 'upcoming' | 'skipped' = 'upcoming';

      if (historyEntry) {
        status = isCurrentStage ? 'current' : 'completed';
      } else if (isCurrentStage) {
        status = 'current';
      } else if (stage.stage_code === 'rejected' || stage.stage_code === 'revision_requested') {
        status = 'skipped';
      }

      return {
        stage: stage.stage_code,
        stage_name: stage.stage_name,
        status,
        entered_at: historyEntry ? historyEntry.changed_at : null,
        completed_at: historyEntry && !isCurrentStage ? historyEntry.changed_at : null,
        duration_days: null, // Calculate if needed
        assigned_user: stage.required_role === 'verifier' && project.verifier_name ? {
          id: project.assigned_verifier_id,
          name: project.verifier_name,
          role: 'verifier',
        } : stage.required_role === 'consultant' && project.consultant_name ? {
          id: project.assigned_consultant_id,
          name: project.consultant_name,
          role: 'consultant',
        } : null,
        notes: historyEntry?.notes || null,
      };
    });

    res.json({
      success: true,
      project_id: projectId,
      current_stage: project.workflow_stage,
      started_at: project.workflow_started_at,
      completed_at: project.workflow_completed_at,
      timeline,
      history,
    });

  } catch (error: any) {
    console.error('Get workflow timeline error:', error);
    res.status(500).json({
      error: 'Failed to fetch workflow timeline',
      details: error.message,
    });
  }
}

/**
 * Get projects assigned to current user (verifier/consultant)
 * GET /api/my-assignments
 */
export async function getMyAssignments(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const role = req.query.role as 'verifier' | 'consultant' || 'verifier';

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const [assignments] = await pool.query<RowDataPacket[]>(
      `SELECT
        pa.*,
        p.title, p.description, p.category, p.location,
        p.workflow_stage, p.carbon_credits,
        COALESCE(u.organization_name, CONCAT(u.first_name, ' ', u.last_name)) as provider_name, u.email as provider_email,
        (SELECT COUNT(*) FROM project_documents WHERE project_id = p.id) as document_count
      FROM project_assignments pa
      JOIN projects p ON pa.project_id = p.id
      JOIN users u ON p.provider_id = u.id
      WHERE pa.user_id = ? AND pa.role = ? AND pa.status IN ('pending', 'accepted', 'in_progress')
      ORDER BY pa.assigned_at DESC`,
      [userId, role]
    );

    res.json({
      success: true,
      count: assignments.length,
      assignments,
    });

  } catch (error: any) {
    console.error('Get my assignments error:', error);
    res.status(500).json({
      error: 'Failed to fetch assignments',
      details: error.message,
    });
  }
}

/**
 * Accept or decline an assignment
 * POST /api/assignments/:id/respond
 */
export async function respondToAssignment(req: Request, res: Response): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const assignmentId = parseInt(req.params.id);
    const { response, notes } = req.body; // response: 'accept' | 'decline'
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify assignment belongs to user
    const [assignments] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM project_assignments WHERE id = ? AND user_id = ?',
      [assignmentId, userId]
    );

    if (assignments.length === 0) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    const newStatus = response === 'accept' ? 'accepted' : 'declined';
    const timestamp = response === 'accept' ? ', accepted_at = NOW()' : '';

    await connection.query(
      `UPDATE project_assignments SET status = ?, notes = ?${timestamp} WHERE id = ?`,
      [newStatus, notes, assignmentId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: `Assignment ${response}ed successfully`,
      assignment_id: assignmentId,
      status: newStatus,
    });

  } catch (error: any) {
    await connection.rollback();
    console.error('Respond to assignment error:', error);
    res.status(500).json({
      error: 'Failed to respond to assignment',
      details: error.message,
    });
  } finally {
    connection.release();
  }
}
