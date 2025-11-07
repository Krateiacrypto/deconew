/**
 * Investment Routes
 * Routes for investment transactions and tracking
 */

import { Router } from 'express';
import {
  createInvestment,
  getMyInvestments,
  getInvestmentById,
  getProjectInvestments,
} from '../controllers/investmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Create new investment
router.post('/', createInvestment);

// Get user's investments
router.get('/my-investments', getMyInvestments);

// Get investment details
router.get('/:id', getInvestmentById);

// Get project investments (for project owners/admins)
router.get('/project/:projectId', getProjectInvestments);

export default router;
