/**
 * Complete Database Seeding Script
 * Seeds users, NGOs, and projects with proper relationships
 * Run with: npm run seed:complete
 */

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';

// Sample NGOs data (matches migration 009 schema exactly)
const SAMPLE_NGOS = [
  {
    email: 'contact@greenearthfoundation.org',
    password: 'Password123!',
    full_name: 'Green Earth Foundation',
    ngo_data: {
      official_name: 'Green Earth Foundation',
      registration_number: 'NGO-GEF-2020-001',
      country: 'Kenya',
      website: 'https://greenearthfoundation.org',
      email: 'contact@greenearthfoundation.org',
      phone: '+254-700-123456',
      focus_areas: ['Climate Action', 'Renewable Energy', 'Reforestation'],
      mission_statement: 'Leading organization in East Africa focusing on climate change mitigation through renewable energy and community-led reforestation projects.',
      verification_status: 'approved' as const,
    },
  },
  {
    email: 'info@carbonactionnetwork.org',
    password: 'Password123!',
    full_name: 'Carbon Action Network',
    ngo_data: {
      official_name: 'Carbon Action Network',
      registration_number: 'NGO-CAN-2018-042',
      country: 'Brazil',
      website: 'https://carbonactionnetwork.org',
      email: 'info@carbonactionnetwork.org',
      phone: '+55-11-98765-4321',
      focus_areas: ['Reforestation', 'Biodiversity', 'Sustainable Agriculture'],
      mission_statement: 'Brazilian NGO dedicated to Amazon rainforest conservation and sustainable agriculture practices with local communities.',
      verification_status: 'approved' as const,
    },
  },
  {
    email: 'hello@cleanenergyalliance.org',
    password: 'Password123!',
    full_name: 'Clean Energy Alliance',
    ngo_data: {
      official_name: 'Clean Energy Alliance',
      registration_number: 'NGO-CEA-2019-078',
      country: 'India',
      website: 'https://cleanenergyalliance.org',
      email: 'hello@cleanenergyalliance.org',
      phone: '+91-22-8877-6655',
      focus_areas: ['Renewable Energy', 'Energy Efficiency', 'Clean Water'],
      mission_statement: 'Indian NGO promoting solar energy adoption in rural communities to reduce carbon emissions and improve livelihoods.',
      verification_status: 'approved' as const,
    },
  },
];

// Carbon provider user
const CARBON_PROVIDER = {
  email: 'provider@carboncredits.com',
  password: 'Password123!',
  full_name: 'Carbon Provider Demo',
};

// Sample projects (matches migrations 007_5 + 008 schema)
const SAMPLE_PROJECTS = [
  {
    title: 'Solar Farm Expansion in Rural Kenya',
    description: 'Installing 500 solar panels to provide clean electricity to 2,000 households in rural Kenya. This project will reduce reliance on diesel generators and kerosene lamps.',
    category: 'renewable_energy',
    location: 'Nakuru, Kenya',
    baseline_emissions: 15000,
    project_emissions: 500,
    start_date: '2024-03-01',
    end_date: '2026-03-01',
    funding_goal: 350000,
    workflow_stage: 'under_verification',
  },
  {
    title: 'Amazon Rainforest Reforestation',
    description: 'Planting 100,000 native trees in deforested Amazon areas. Working with local communities to ensure long-term sustainability.',
    category: 'reforestation',
    location: 'Amazonas State, Brazil',
    baseline_emissions: 25000,
    project_emissions: 2000,
    start_date: '2024-02-15',
    end_date: '2029-02-15',
    funding_goal: 600000,
    workflow_stage: 'pending_admin_review',
  },
  {
    title: 'Wind Energy for Rural India',
    description: 'Installing 10 wind turbines in rural Maharashtra to provide clean energy to 5,000 households and small businesses.',
    category: 'renewable_energy',
    location: 'Maharashtra, India',
    baseline_emissions: 35000,
    project_emissions: 1200,
    start_date: '2024-04-01',
    end_date: '2027-04-01',
    funding_goal: 900000,
    workflow_stage: 'under_verification',
  },
  {
    title: 'Mangrove Restoration Initiative',
    description: 'Restoring 50 hectares of coastal mangrove forests to protect biodiversity and sequester carbon.',
    category: 'reforestation',
    location: 'Java, Indonesia',
    baseline_emissions: 18000,
    project_emissions: 800,
    start_date: '2024-05-01',
    end_date: '2028-05-01',
    funding_goal: 250000,
    workflow_stage: 'pending_admin_review',
  },
];

// ============================================
// SEEDING FUNCTIONS
// ============================================

async function seedUsers() {
  logger.info('Seeding users...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create NGO users
  for (const ngoUser of SAMPLE_NGOS) {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO users (email, password_hash, organization_name, user_type, status, created_at, updated_at)
         VALUES (?, ?, ?, 'institutional', 'active', NOW(), NOW())
         ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [ngoUser.email, hashedPassword, ngoUser.full_name]
      );
      logger.info(`✓ User: ${ngoUser.email}`);
    } catch (error: any) {
      logger.warn(`User ${ngoUser.email}: ${error.message}`);
    }
  }

  // Create carbon provider user
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (email, password_hash, organization_name, user_type, status, created_at, updated_at)
       VALUES (?, ?, ?, 'institutional', 'active', NOW(), NOW())
       ON DUPLICATE KEY UPDATE updated_at = NOW()`,
      [CARBON_PROVIDER.email, hashedPassword, CARBON_PROVIDER.full_name]
    );
    logger.info(`✓ User: ${CARBON_PROVIDER.email}`);
  } catch (error: any) {
    logger.warn(`User ${CARBON_PROVIDER.email}: ${error.message}`);
  }
}

async function seedNGOs() {
  logger.info('Seeding NGOs...');

  for (const ngoUser of SAMPLE_NGOS) {
    try {
      // Get user ID
      const [users] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [ngoUser.email]
      );

      if (users.length === 0) {
        logger.warn(`User not found for ${ngoUser.email}, skipping NGO`);
        continue;
      }

      const userId = users[0].id;
      const ngo = ngoUser.ngo_data;

      await pool.query(
        `INSERT INTO ngo_registry (
          user_id, official_name, registration_number, country, website,
          email, phone, focus_areas, mission_statement,
          verification_status, verified_at, joined_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [
          userId,
          ngo.official_name,
          ngo.registration_number,
          ngo.country,
          ngo.website,
          ngo.email,
          ngo.phone,
          JSON.stringify(ngo.focus_areas),
          ngo.mission_statement,
          ngo.verification_status,
        ]
      );
      logger.info(`✓ NGO: ${ngo.official_name}`);
    } catch (error: any) {
      logger.warn(`NGO ${ngoUser.ngo_data.official_name}: ${error.message}`);
    }
  }
}

async function seedProjects() {
  logger.info('Seeding projects...');

  // Get carbon provider user ID
  const [providers] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE email = ?',
    [CARBON_PROVIDER.email]
  );

  if (providers.length === 0) {
    logger.warn('Carbon provider user not found, skipping projects');
    return;
  }

  const providerId = providers[0].id;

  for (const project of SAMPLE_PROJECTS) {
    try {
      const co2Reduction = project.baseline_emissions - project.project_emissions;

      await pool.query(
        `INSERT INTO projects (
          provider_id, title, description, category, location,
          baseline_emissions, project_emissions, co2_reduction_calculated,
          start_date, end_date, funding_goal, workflow_stage,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          providerId,
          project.title,
          project.description,
          project.category,
          project.location,
          project.baseline_emissions,
          project.project_emissions,
          co2Reduction,
          project.start_date,
          project.end_date,
          project.funding_goal,
          project.workflow_stage,
        ]
      );
      logger.info(`✓ Project: ${project.title}`);
    } catch (error: any) {
      logger.warn(`Project ${project.title}: ${error.message}`);
    }
  }
}

// ============================================
// MAIN SEEDING FUNCTION
// ============================================

async function seed() {
  try {
    logger.info('🌱 Starting complete database seeding...');
    logger.info('━'.repeat(50));

    await seedUsers();
    logger.info('');

    await seedNGOs();
    logger.info('');

    await seedProjects();
    logger.info('');

    logger.info('━'.repeat(50));
    logger.info('✅ Database seeding completed successfully!');
    logger.info('');
    logger.info('Test Accounts Created:');
    logger.info('  NGOs (3):');
    logger.info('    - contact@greenearthfoundation.org / Password123!');
    logger.info('    - info@carbonactionnetwork.org / Password123!');
    logger.info('    - hello@cleanenergyalliance.org / Password123!');
    logger.info('  Carbon Provider (1):');
    logger.info('    - provider@carboncredits.com / Password123!');
    logger.info('');
    logger.info('Sample Data:');
    logger.info(`  - ${SAMPLE_NGOS.length} NGOs (all verified)`);
    logger.info(`  - ${SAMPLE_PROJECTS.length} Projects (various stages)`);
    logger.info('');
    logger.info('⚠️  NOTE: Role assignments may need to be done via admin panel');

    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seed();
