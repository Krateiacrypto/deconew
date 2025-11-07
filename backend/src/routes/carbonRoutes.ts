/**
 * Carbon Calculation Routes
 */

import { Router } from 'express';
import {
  createCarbonCalculation,
  getCarbonCalculation,
  verifyCarbonCalculation,
  getMethodologies,
  calculateCredits,
} from '../controllers/carbonController.js';

const router = Router();

// Carbon calculation management
router.post('/projects/:id/carbon-calculation', createCarbonCalculation);
router.get('/projects/:id/carbon-calculation', getCarbonCalculation);

// Admin/verifier verification
router.post('/admin/projects/:id/verify-carbon', verifyCarbonCalculation);

// Utilities
router.get('/carbon/methodologies', getMethodologies);
router.post('/carbon/calculate', calculateCredits);

export default router;
