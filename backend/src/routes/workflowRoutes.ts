/**
 * Workflow Routes
 * Routes for 7-stage project workflow
 */

import { Router } from 'express';
import {
  submitProject,
  getPendingProjects,
  getPublicProjects,
  assignVerifier,
  reviewProject,
  getWorkflowTimeline,
  getMyAssignments,
  respondToAssignment,
} from '../controllers/workflowController.js';

const router = Router();

// Public routes (must be before parameterized routes)
router.get('/projects', getPublicProjects);

// Project submission
router.post('/projects/submit', submitProject);

// Admin routes
router.get('/admin/projects/pending', getPendingProjects);
router.post('/admin/projects/:id/assign-verifier', assignVerifier);
router.post('/admin/projects/:id/review', reviewProject);

// Timeline and history
router.get('/projects/:id/workflow-timeline', getWorkflowTimeline);

// Assignment management
router.get('/my-assignments', getMyAssignments);
router.post('/assignments/:id/respond', respondToAssignment);

export default router;
