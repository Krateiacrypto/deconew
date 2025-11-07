/**
 * Database Seeding Script
 * Seeds sample data for NGOs, projects, and test users
 * Run with: npm run seed
 */

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';

// ============================================
// SAMPLE DATA
// ============================================

const SAMPLE_NGOS = [
  {
    official_name: 'Green Earth Foundation',
    registration_number: 'NGO-GEF-2020-001',
    country: 'Kenya',
    website: 'https://greenearthfoundation.org',
    contact_email: 'contact@greenearthfoundation.org',
    contact_phone: '+254-700-123456',
    focus_areas: JSON.stringify(['climate_change', 'renewable_energy', 'reforestation']),
    description: 'Leading organization in East Africa focusing on climate change mitigation through renewable energy and reforestation projects.',
    years_active: 15,
    previous_projects: 47,
    verification_status: 'approved',
  },
  {
    official_name: 'Carbon Action Network',
    registration_number: 'NGO-CAN-2018-042',
    country: 'Brazil',
    website: 'https://carbonactionnetwork.org',
    contact_email: 'info@carbonactionnetwork.org',
    contact_phone: '+55-11-98765-4321',
    focus_areas: JSON.stringify(['reforestation', 'biodiversity', 'sustainable_agriculture']),
    description: 'Brazilian NGO dedicated to Amazon rainforest conservation and sustainable agriculture practices.',
    years_active: 8,
    previous_projects: 23,
    verification_status: 'approved',
  },
  {
    official_name: 'Clean Energy Alliance',
    registration_number: 'NGO-CEA-2019-078',
    country: 'India',
    website: 'https://cleanenergyalliance.org',
    contact_email: 'hello@cleanenergyalliance.org',
    contact_phone: '+91-22-8877-6655',
    focus_areas: JSON.stringify(['renewable_energy', 'energy_efficiency', 'clean_water']),
    description: 'Indian NGO promoting solar and wind energy adoption in rural communities.',
    years_active: 6,
    previous_projects: 34,
    verification_status: 'approved',
  },
  {
    official_name: 'Ocean Conservation Society',
    registration_number: 'NGO-OCS-2017-156',
    country: 'Indonesia',
    website: 'https://oceanconservation.org',
    contact_email: 'contact@oceanconservation.org',
    contact_phone: '+62-21-555-7890',
    focus_areas: JSON.stringify(['biodiversity', 'clean_water', 'waste_management']),
    description: 'Protecting marine ecosystems and promoting coastal mangrove restoration.',
    years_active: 9,
    previous_projects: 18,
    verification_status: 'approved',
  },
  {
    official_name: 'Sustainable Future Initiative',
    registration_number: 'NGO-SFI-2021-203',
    country: 'South Africa',
    website: 'https://sustainablefuture.org',
    contact_email: 'info@sustainablefuture.org',
    contact_phone: '+27-11-444-3322',
    focus_areas: JSON.stringify(['climate_change', 'environmental_education', 'waste_management']),
    description: 'Educating communities about climate change and implementing waste reduction programs.',
    years_active: 4,
    previous_projects: 12,
    verification_status: 'approved',
  },
];

const SAMPLE_PROJECTS = [
  {
    title: 'Solar Farm Expansion in Rural Kenya',
    description: 'Installing 500 solar panels to provide clean electricity to 2,000 households in rural Kenya. This project will reduce reliance on diesel generators and kerosene lamps.',
    location: 'Nakuru, Kenya',
    project_type: 'renewable_energy',
    baseline_emissions: 15000,
    project_emissions: 500,
    start_date: '2024-03-01',
    end_date: '2026-03-01',
    estimated_budget: 450000,
    funding_goal: 350000,
    current_stage: 'under_verification',
  },
  {
    title: 'Amazon Rainforest Reforestation Project',
    description: 'Planting 100,000 native trees in deforested areas of the Amazon. Working with local communities to ensure long-term sustainability.',
    location: 'Amazonas State, Brazil',
    project_type: 'reforestation',
    baseline_emissions: 25000,
    project_emissions: 2000,
    start_date: '2024-02-15',
    end_date: '2029-02-15',
    estimated_budget: 780000,
    funding_goal: 600000,
    current_stage: 'pending_admin_review',
  },
  {
    title: 'Wind Energy for Rural India',
    description: 'Installing 10 wind turbines in rural Maharashtra to provide clean energy to 5,000 households and small businesses.',
    location: 'Maharashtra, India',
    project_type: 'renewable_energy',
    baseline_emissions: 35000,
    project_emissions: 1200,
    start_date: '2024-04-01',
    end_date: '2027-04-01',
    estimated_budget: 1200000,
    funding_goal: 900000,
    current_stage: 'under_verification',
  },
  {
    title: 'Mangrove Restoration Initiative',
    description: 'Restoring 50 hectares of coastal mangrove forests to protect biodiversity and sequester carbon.',
    location: 'Java, Indonesia',
    project_type: 'reforestation',
    baseline_emissions: 18000,
    project_emissions: 800,
    start_date: '2024-05-01',
    end_date: '2028-05-01',
    estimated_budget: 320000,
    funding_goal: 250000,
    current_stage: 'pending_admin_review',
  },
  {
    title: 'Clean Cookstove Distribution Program',
    description: 'Distributing 5,000 clean cookstoves to rural households to reduce indoor air pollution and deforestation.',
    location: 'Western Cape, South Africa',
    project_type: 'energy_efficiency',
    baseline_emissions: 12000,
    project_emissions: 1500,
    start_date: '2024-06-01',
    end_date: '2025-12-01',
    estimated_budget: 180000,
    funding_goal: 150000,
    current_stage: 'under_verification',
  },
  {
    title: 'Urban Solar Rooftop Initiative',
    description: 'Installing solar panels on 200 commercial buildings in Mumbai to reduce grid dependency.',
    location: 'Mumbai, India',
    project_type: 'renewable_energy',
    baseline_emissions: 42000,
    project_emissions: 3000,
    start_date: '2024-07-01',
    end_date: '2026-07-01',
    estimated_budget: 950000,
    funding_goal: 750000,
    current_stage: 'pending_admin_review',
  },
  {
    title: 'Watershed Conservation in Kenya',
    description: 'Protecting and restoring 1,000 hectares of watershed forest to ensure clean water supply for 10,000 people.',
    location: 'Mount Kenya Region, Kenya',
    project_type: 'reforestation',
    baseline_emissions: 22000,
    project_emissions: 1000,
    start_date: '2024-08-01',
    end_date: '2029-08-01',
    estimated_budget: 560000,
    funding_goal: 450000,
    current_stage: 'under_verification',
  },
  {
    title: 'Biogas Plant for Agricultural Waste',
    description: 'Converting agricultural waste into biogas energy for 500 farms, reducing methane emissions.',
    location: 'São Paulo State, Brazil',
    project_type: 'waste_management',
    baseline_emissions: 28000,
    project_emissions: 2500,
    start_date: '2024-09-01',
    end_date: '2027-09-01',
    estimated_budget: 680000,
    funding_goal: 550000,
    current_stage: 'pending_admin_review',
  },
];

// ============================================
// SEEDING FUNCTIONS
// ============================================

async function seedUsers() {
  logger.info('Seeding users...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const users = [
    {
      email: 'ngo@greenearthfoundation.org',
      password: hashedPassword,
      full_name: 'Green Earth Admin',
      role: 'ngo',
      status: 'active',
    },
    {
      email: 'ngo@carbonactionnetwork.org',
      password: hashedPassword,
      full_name: 'Carbon Action Admin',
      role: 'ngo',
      status: 'active',
    },
    {
      email: 'ngo@cleanenergyalliance.org',
      password: hashedPassword,
      full_name: 'Clean Energy Admin',
      role: 'ngo',
      status: 'active',
    },
    {
      email: 'ngo@oceanconservation.org',
      password: hashedPassword,
      full_name: 'Ocean Conservation Admin',
      role: 'ngo',
      status: 'active',
    },
    {
      email: 'ngo@sustainablefuture.org',
      password: hashedPassword,
      full_name: 'Sustainable Future Admin',
      role: 'ngo',
      status: 'active',
    },
    {
      email: 'provider@carboncredits.com',
      password: hashedPassword,
      full_name: 'Carbon Provider Test',
      role: 'carbon_provider',
      status: 'active',
    },
  ];

  for (const user of users) {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO users (email, password, full_name, role, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [user.email, user.password, user.full_name, user.role, user.status]
      );
      logger.info(`✓ User created: ${user.email}`);
    } catch (error) {
      logger.warn(`User ${user.email} may already exist, skipping...`);
    }
  }
}

async function seedNGOs() {
  logger.info('Seeding NGOs...');

  // Get user IDs for NGO users
  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT id, email FROM users WHERE role = ? AND status = ?',
    ['ngo', 'active']
  );

  for (let i = 0; i < SAMPLE_NGOS.length && i < users.length; i++) {
    const ngo = SAMPLE_NGOS[i];
    const user = users[i];

    try {
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO ngo_registry (
          user_id, official_name, registration_number, country, website,
          contact_email, contact_phone, focus_areas, description,
          years_active, previous_projects, verification_status,
          verified_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [
          user.id,
          ngo.official_name,
          ngo.registration_number,
          ngo.country,
          ngo.website,
          ngo.contact_email,
          ngo.contact_phone,
          ngo.focus_areas,
          ngo.description,
          ngo.years_active,
          ngo.previous_projects,
          ngo.verification_status,
        ]
      );
      logger.info(`✓ NGO created: ${ngo.official_name}`);
    } catch (error: any) {
      logger.warn(`NGO ${ngo.official_name} may already exist: ${error.message}`);
    }
  }
}

async function seedProjects() {
  logger.info('Seeding projects...');

  // Get a carbon provider user
  const [providers] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE role = ? AND status = ? LIMIT 1',
    ['carbon_provider', 'active']
  );

  if (providers.length === 0) {
    logger.warn('No carbon provider user found, skipping project seeding');
    return;
  }

  const providerId = providers[0].id;

  for (const project of SAMPLE_PROJECTS) {
    try {
      const co2Reduction = project.baseline_emissions - project.project_emissions;

      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO projects (
          user_id, title, description, location, project_type,
          baseline_emissions, project_emissions, co2_reduction_calculated,
          start_date, end_date, estimated_budget, funding_goal,
          current_stage, submission_date, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
        [
          providerId,
          project.title,
          project.description,
          project.location,
          project.project_type,
          project.baseline_emissions,
          project.project_emissions,
          co2Reduction,
          project.start_date,
          project.end_date,
          project.estimated_budget,
          project.funding_goal,
          project.current_stage,
        ]
      );
      logger.info(`✓ Project created: ${project.title}`);
    } catch (error: any) {
      logger.warn(`Project ${project.title} seeding failed: ${error.message}`);
    }
  }
}

// ============================================
// MAIN SEEDING FUNCTION
// ============================================

async function seed() {
  try {
    logger.info('🌱 Starting database seeding...');
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
    logger.info('  NGOs (5):');
    logger.info('    - ngo@greenearthfoundation.org / Password123!');
    logger.info('    - ngo@carbonactionnetwork.org / Password123!');
    logger.info('    - ngo@cleanenergyalliance.org / Password123!');
    logger.info('    - ngo@oceanconservation.org / Password123!');
    logger.info('    - ngo@sustainablefuture.org / Password123!');
    logger.info('  Provider (1):');
    logger.info('    - provider@carboncredits.com / Password123!');
    logger.info('');
    logger.info('Sample Data:');
    logger.info(`  - ${SAMPLE_NGOS.length} NGOs (all verified)`);
    logger.info(`  - ${SAMPLE_PROJECTS.length} Projects (various stages)`);

    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seed();
