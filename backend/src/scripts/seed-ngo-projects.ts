/**
 * Simple Database Seeding Script for NGOs and Projects
 * Seeds sample NGOs and projects WITHOUT creating users
 * Users should be created via API registration
 */

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database.js';
import logger from '../utils/logger.js';

// Sample NGOs data (FIXED: matches migration 009 schema)
const SAMPLE_NGOS = [
  {
    user_id: 1, // Assuming user ID 1 exists
    official_name: 'Green Earth Foundation',
    registration_number: 'NGO-GEF-2020-001',
    country: 'Kenya',
    website: 'https://greenearthfoundation.org',
    email: 'contact@greenearthfoundation.org',
    phone: '+254-700-123456',
    focus_areas: JSON.stringify(['climate_change', 'renewable_energy', 'reforestation']),
    mission_statement: 'Leading organization in East Africa focusing on climate change mitigation through renewable energy and community-led reforestation projects.',
    years_active: 15,
    previous_projects: 47,
    verification_status: 'approved',
  },
  {
    user_id: 2,
    official_name: 'Carbon Action Network',
    registration_number: 'NGO-CAN-2018-042',
    country: 'Brazil',
    website: 'https://carbonactionnetwork.org',
    email: 'info@carbonactionnetwork.org',
    phone: '+55-11-98765-4321',
    focus_areas: JSON.stringify(['reforestation', 'biodiversity']),
    mission_statement: 'Brazilian NGO dedicated to Amazon rainforest conservation and sustainable agriculture practices with local communities.',
    years_active: 8,
    previous_projects: 23,
    verification_status: 'approved',
  },
  {
    user_id: 3,
    official_name: 'Clean Energy Alliance',
    registration_number: 'NGO-CEA-2019-078',
    country: 'India',
    website: 'https://cleanenergyalliance.org',
    email: 'hello@cleanenergyalliance.org',
    phone: '+91-22-8877-6655',
    focus_areas: JSON.stringify(['renewable_energy', 'clean_water']),
    mission_statement: 'Indian NGO promoting solar energy adoption in rural communities to reduce carbon emissions and improve livelihoods.',
    years_active: 6,
    previous_projects: 34,
    verification_status: 'approved',
  },
];

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

async function seedNGOs() {
  logger.info('Seeding NGOs...');

  for (const ngo of SAMPLE_NGOS) {
    try {
      await pool.query(
        `INSERT INTO ngo_registry (
          user_id, official_name, registration_number, country, website,
          email, phone, focus_areas, mission_statement,
          years_active, previous_projects, verification_status,
          verified_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [
          ngo.user_id, ngo.official_name, ngo.registration_number, ngo.country,
          ngo.website, ngo.email, ngo.phone, ngo.focus_areas,
          ngo.mission_statement, ngo.years_active, ngo.previous_projects, ngo.verification_status,
        ]
      );
      logger.info(`✓ NGO: ${ngo.official_name}`);
    } catch (error: any) {
      logger.warn(`NGO ${ngo.official_name}: ${error.message}`);
    }
  }
}

async function seedProjects() {
  logger.info('Seeding projects...');

  // Use user_id 1 as project provider
  const providerId = 1;

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
          providerId, project.title, project.description, project.category, project.location,
          project.baseline_emissions, project.project_emissions, co2Reduction,
          project.start_date, project.end_date, project.funding_goal, project.workflow_stage,
        ]
      );
      logger.info(`✓ Project: ${project.title}`);
    } catch (error: any) {
      logger.warn(`Project ${project.title}: ${error.message}`);
    }
  }
}

async function seed() {
  try {
    logger.info('🌱 Starting simple seeding...');
    logger.info('━'.repeat(50));

    await seedNGOs();
    logger.info('');

    await seedProjects();
    logger.info('');

    logger.info('━'.repeat(50));
    logger.info('✅ Seeding completed!');
    logger.info('');
    logger.info(`Created: ${SAMPLE_NGOS.length} NGOs, ${SAMPLE_PROJECTS.length} projects`);
    logger.info('');
    logger.info('⚠️  NOTE: Users must be created via API registration');
    logger.info('   NGOs are associated with user_ids 1, 2, 3');

    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
