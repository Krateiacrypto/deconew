/**
 * NGO Routes
 */

import { Router } from 'express';
import {
  registerNGO,
  getPendingNGOs,
  reviewNGO,
  endorseProject,
  getProjectEndorsements,
  getNGOProfile,
  getMyNGOProfile,
  getMyEndorsements,
  listNGOs,
} from '../controllers/ngoController.js';

const router = Router();

// NGO registration
router.post('/ngo/register', registerNGO);

// Admin routes
router.get('/admin/ngo/pending', getPendingNGOs);
router.post('/admin/ngo/:id/review', reviewNGO);

// Endorsements
router.post('/ngo/endorse/:projectId', endorseProject);
router.get('/projects/:id/endorsements', getProjectEndorsements);

// NGO profiles (IMPORTANT: Specific routes BEFORE parameterized routes!)
router.get('/ngo/profile', getMyNGOProfile); // Current user's profile
router.get('/ngo/my-endorsements', getMyEndorsements); // Current user's endorsements
router.get('/ngo/list', listNGOs); // List all NGOs (MUST be before /:id)
router.get('/ngo/:id', getNGOProfile); // Specific NGO by ID (MUST be last)

export default router;
