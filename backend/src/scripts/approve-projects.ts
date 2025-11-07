/**
 * Approve Projects Script
 * Updates test projects to 'approved' stage for testing public listing
 */

import pool from '../config/database.js';
import logger from '../utils/logger.js';

async function approveProjects() {
  try {
    logger.info('🔄 Updating projects to approved stage...');

    // Update projects 5, 7, 9, 11 to approved stage
    const [result] = await pool.query(
      `UPDATE projects
       SET workflow_stage = 'approved',
           status = 'active',
           verified = TRUE,
           workflow_completed_at = NOW()
       WHERE id IN (5, 7, 9, 11)
         AND workflow_stage = 'under_verification'`
    );

    logger.info(`✅ Updated ${(result as any).affectedRows} projects to 'approved' stage`);

    // Show approved projects
    const [projects] = await pool.query(
      `SELECT id, title, workflow_stage, status, verified, co2_reduction_calculated, funding_goal
       FROM projects
       WHERE workflow_stage = 'approved'
       ORDER BY id`
    );

    logger.info('\n📊 Approved Projects:');
    (projects as any[]).forEach((p: any) => {
      logger.info(`  - [${p.id}] ${p.title} (CO2: ${p.co2_reduction_calculated} tons, Goal: $${p.funding_goal})`);
    });

    logger.info('\n✅ Done! Test with: curl http://localhost:3002/api/projects');

    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Error:', error.message);
    process.exit(1);
  }
}

approveProjects();
