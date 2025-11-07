🎨 FRONTEND MODÜL YAPISI
APP ROUTER STRUCTURE
/app
├── (public)
│   ├── page.tsx                    # Homepage
│   ├── projects
│   │   ├── page.tsx               # Projects listing
│   │   └── [id]
│   │       └── page.tsx           # Project detail
│   ├── trading
│   │   └── page.tsx               # Trading interface
│   ├── about
│   │   └── page.tsx               # About page
│   └── blog
│       ├── page.tsx               # Blog listing
│       └── [slug]
│           └── page.tsx           # Blog post
│
├── (auth)
│   ├── login
│   │   └── page.tsx
│   ├── register
│   │   └── page.tsx
│   └── kyc
│       └── page.tsx
│
├── dashboard
│   ├── layout.tsx                 # Dashboard layout
│   ├── page.tsx                   # Dashboard home
│   │
│   ├── portfolio
│   │   └── page.tsx
│   ├── wallet
│   │   └── page.tsx
│   ├── staking
│   │   └── page.tsx
│   │
│   ├── provider
│   │   ├── projects
│   │   │   ├── page.tsx           # Provider projects list
│   │   │   ├── new
│   │   │   │   └── page.tsx       # Create project
│   │   │   └── [id]
│   │   │       └── edit
│   │   │           └── page.tsx   # Edit project
│   │   └── analytics
│   │       └── page.tsx
│   │
│   ├── verifier
│   │   ├── queue
│   │   │   └── page.tsx           # Verification queue
│   │   ├── [projectId]
│   │   │   └── verify
│   │   │       └── page.tsx       # Verification interface
│   │   └── certificates
│   │       └── page.tsx
│   │
│   └── advisor
│       ├── clients
│       │   └── page.tsx
│       ├── recommendations
│       │   └── page.tsx
│       └── analytics
│           └── page.tsx
│
└── admin
├── layout.tsx
├── page.tsx
│
├── users
│   └── page.tsx
├── projects
│   └── page.tsx
├── content
│   ├── blog
│   │   └── page.tsx
│   └── pages
│       └── page.tsx
└── system
└── page.tsx

COMPONENT ARCHITECTURE
/src/components
├── layout
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── DashboardLayout.tsx
│
├── projects
│   ├── ProjectCard.tsx
│   ├── ProjectGrid.tsx
│   ├── ProjectFilters.tsx
│   ├── ProjectSearch.tsx
│   │
│   ├── detail
│   │   ├── ProjectHero.tsx
│   │   ├── ProjectTabs.tsx
│   │   ├── OverviewTab.tsx
│   │   ├── ImpactTab.tsx
│   │   ├── FinancialsTab.tsx
│   │   ├── DocumentsTab.tsx
│   │   └── TimelineTab.tsx
│   │
│   └── create
│       ├── ProjectWizard.tsx
│       ├── BasicInfoStep.tsx
│       ├── LocationStep.tsx
│       ├── FinancialsStep.tsx
│       ├── TokenomicsStep.tsx
│       └── ReviewStep.tsx
│
├── trading
│   ├── TradingChart.tsx
│   ├── OrderBook.tsx
│   ├── TradeForm.tsx
│   ├── OrderHistory.tsx
│   └── PriceAlerts.tsx
│
├── wallet
│   ├── WalletConnect.tsx
│   ├── BalanceDisplay.tsx
│   ├── SendReceive.tsx
│   ├── TransactionHistory.tsx
│   └── TokenList.tsx
│
├── staking
│   ├── StakingPools.tsx
│   ├── StakeForm.tsx
│   ├── RewardsTracker.tsx
│   ├── StakingCalculator.tsx
│   └── UnstakeModal.tsx
│
├── kyc
│   ├── KYCWizard.tsx
│   ├── DocumentUpload.tsx
│   ├── IdentityVerification.tsx
│   └── StatusTracker.tsx
│
├── admin
│   ├── users
│   │   ├── UserList.tsx
│   │   ├── UserDetails.tsx
│   │   └── KYCReview.tsx
│   │
│   ├── projects
│   │   ├── ProjectList.tsx
│   │   ├── ProjectReview.tsx
│   │   └── ApprovalForm.tsx
│   │
│   └── content
│       ├── BlogEditor.tsx
│       ├── MediaManager.tsx
│       └── SEOManager.tsx
│
├── charts
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   ├── PieChart.tsx
│   └── TradingChart.tsx
│
└── ui (shadcn/ui)
├── button.tsx
├── input.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── tabs.tsx
├── toast.tsx
└── ... (other shadcn components)


👥 KULLANICI ROLLERİ VE YETKİ MATRİSİ
SUPERADMIN
interface SuperAdmin {
id: 'SUPERADMIN';
permissions: {
smartContract: [
'mint_tokens',
'burn_tokens',
'upgrade_contracts',
'emergency_shutdown',
'parameter_configuration'
];
userManagement: [
'approve_kyc_level3',
'suspend_accounts',
'ban_users',
'modify_limits',
'grant_vip_status'
];
projectManagement: [
'approve_projects',
'reject_projects',
'suspend_projects',
'delist_projects',
'override_verification'
];
platformControl: [
'trading_halt',
'fee_adjustment',
'liquidity_management',
'system_configuration',
'emergency_protocols'
];
financial: [
'treasury_management',
'reserve_allocation',
'revenue_distribution',
'insurance_fund'
];
};
dashboardModules: [
'SystemMonitoring',
'UserManagement',
'ProjectOverview',
'FinancialMetrics',
'SecurityAlerts',
'ComplianceReports',
'AuditLogs'
];
securityRequirements: {
multiSig: 'Required for critical operations (3/5)';
timelock: '48 hours for contract upgrades';
auditTrail: 'Mandatory logging for all actions';
};
}

SUPERADMIN Authorities:
Full system control and administration.
Ability to manage all user types and edit their permissions.
System settings and configuration.
Access to all data across the platform.
Ability to set token economy parameters.
Security settings and system logs.

WEB ADMIN (EDITOR)
interface WebAdmin {
id: 'WEB_ADMIN';
permissions: {
contentManagement: [
'create_blog_posts',
'edit_pages',
'manage_media',
'seo_optimization',
'content_scheduling'
];
    marketing: [
      'campaign_creation',
      'email_templates',
      'push_notifications',
      'banner_management'
    ];
    
    analytics: [
      'view_user_metrics',
      'content_performance',
      'conversion_tracking',
      'ab_testing'
    ];
    
    community: [
      'moderate_forum',
      'manage_comments',
      'user_engagement',
      'event_management'
    ];
};
dashboardModules: [
'ContentEditor',
'MediaLibrary',
'AnalyticsDashboard',
'CampaignManager',
'CommunityModeration'
];
}

WEB ADMIN (EDITOR) Authorities:
Platform management and approvals.
User account management (excluding Super Admins).
Project evaluation: Assigning validation bodies and approving/rejecting projects after the validation body's assessment.
Creating advisors, evaluating, approving, and assigning user requests for advisors.
Access to reporting and analytical data.
KYC verification and management processes.
Full authority over blog content, including creation, evaluation, publication, and editing.
Token distribution approvals.

CARBON PROVIDER
interface CarbonProvider {
id: 'CARBON_PROVIDER';
permissions: {
projects: [
'create_project',
'edit_own_projects',
'submit_for_verification',
'upload_documents',
'update_milestones'
];
    tokenization: [
      'request_tokenization',
      'set_token_parameters',
      'manage_distribution',
      'set_pricing'
    ];
    
    financial: [
      'track_revenue',
      'withdraw_earnings',
      'set_royalties',
      'view_investor_list'
    ];
    
    staking: [
      'stake_ico2',
      'earn_provider_rewards',
      'governance_participation'
    ];
};
dashboardModules: [
'ProjectPortfolio',
'TokenMetrics',
'RevenueAnalytics',
'DocumentManager',
'StakingInterface',
'InvestorRelations'
];
revenueStreams: {
primarySales: 'Initial token sale',
tradingFees: '0.5% of secondary market trades',
stakingRewards: 'Platform fee sharing',
royalties: '2% perpetual on transfers'
};
}

CARBON PROVIDER Authorities:
Creating and managing projects.
Generating carbon credits.
Managing the project portfolio.
Sales and price determination.
Customer communication.

VERIFICATION AUTHORITY
interface VerificationAuthority {
id: 'VERIFIER';
permissions: {
verification: [
'review_projects',
'conduct_audits',
'issue_certificates',
'quality_scoring',
'compliance_check'
];
    blockchain: [
      'sign_transactions',
      'mint_certificates',
      'update_metadata',
      'on_chain_verification'
    ];
    
    monitoring: [
      'continuous_monitoring',
      'satellite_data_access',
      'iot_integration',
      'impact_validation'
    ];
};
dashboardModules: [
'VerificationQueue',
'AuditWorkflow',
'CertificateManager',
'MonitoringTools',
'ImpactDashboard'
];
verificationProcess: {
stage1: 'Document review + AI pre-screening';
stage2: 'Technical audit + on-site inspection';
stage3: 'Blockchain certificate minting';
stage4: 'Continuous monitoring setup';
};
rewardSystem: {
baseReward: '100 ICO2 per verification';
accuracyBonus: 'Up to 50% extra for high accuracy';
speedBonus: '25% for fast-track completion';
stakingMultiplier: '2x staking rewards';
};
}

VERIFICATION AUTHORITY Authorities:
Project verification and certification.
Calculating and verifying carbon credits, and forwarding them for admin approval.
Creation of technical verification reports.
Project monitoring and tracking.
Uploading and managing certificates.


ADVISOR (CONSULTANT)
interface Advisor {
id: 'ADVISOR';
permissions: {
analysis: [
'view_all_approved_projects',
'access_financial_data',
'risk_assessment',
'market_analysis'
];
    recommendations: [
      'create_investment_reports',
      'portfolio_optimization',
      'risk_profiling',
      'market_insights'
    ];
    
    client: [
      'direct_messaging',
      'schedule_consultations',
      'webinar_hosting',
      'educational_content'
    ];
};
dashboardModules: [
'ProjectAnalytics',
'ClientPortfolios',
'RecommendationEngine',
'MarketIntelligence',
'ClientCommunications'
];
tools: [
'AIRecommendationSystem',
'RiskCalculator',
'PortfolioOptimizer',
'MarketTrendAnalysis'
];
}

ADVISOR (CONSULTANT) Authorities:
User consultancy and guidance.
Preparation of project evaluation reports.
Responding to user inquiries.
Access to educational materials, creating blog posts, and submitting them for approval.
Viewing limited statistics.


NGO (SIVIL TOPLUM KURULUŞU)
interface NGO {
id: 'NGO';
permissions: {
assessment: [
'evaluate_social_impact',
'community_feedback',
'transparency_review',
'public_interest_check'
];
    endorsement: [
      'endorse_projects',
      'issue_recommendations',
      'public_statements'
    ];
    
    education: [
      'create_awareness_content',
      'community_programs',
      'educational_webinars'
    ];
};
dashboardModules: [
'ImpactAssessment',
'CommunityFeedback',
'TransparencyReports',
'EndorsementManager'
];
}

NGO (SIVIL TOPLUM KURULUŞU) Authorities:
Listing social impact projects.
Creating and managing projects.
Organizing funding campaigns.
Publishing impact reports.
Interaction with the community.

INSTITUTIONAL INVESTOR
interface InstitutionalInvestor {
id: 'INSTITUTIONAL_INVESTOR';
minimumInvestment: 10000; // $10K
permissions: {
trading: [
'bulk_trading',
'otc_access',
'advanced_order_types',
'api_integration',
'custom_strategies'
];
    analytics: [
      'institutional_dashboard',
      'advanced_risk_metrics',
      'portfolio_analytics',
      'esg_compliance_tracking'
    ];
    
    support: [
      'dedicated_account_manager',
      'priority_support',
      'custom_reporting'
    ];
};
dashboardModules: [
'InstitutionalDashboard',
'BulkTradingInterface',
'AdvancedAnalytics',
'ESGComplianceTracker',
'APIManagement'
];
benefits: {
feeDiscount: '0.1% trading fee (vs 0.25% standard)';
priorityAccess: 'Early access to new projects';
customTerms: 'Negotiable investment terms';
apiAccess: 'Full REST + WebSocket API';
};
}
PRO INVESTOR
typescript
interface ProInvestor {
id: 'PRO_INVESTOR';
minimumInvestment: 1000; // $1K
permissions: {
trading: [
'advanced_trading_tools',
'limit_orders',
'stop_loss',
'portfolio_rebalancing'
];
    analytics: [
      'advanced_charts',
      'technical_indicators',
      'portfolio_analytics',
      'performance_tracking'
    ];
    
    staking: [
      'enhanced_staking',
      'yield_farming',
      'liquidity_provision'
    ];
    
    social: [
      'copy_trading',
      'social_features',
      'project_reviews'
    ];
};
dashboardModules: [
'ProTradingInterface',
'AdvancedCharts',
'PortfolioAnalytics',
'StakingDashboard',
'SocialTrading'
];
benefits: {
feeDiscount: '0.2% trading fee';
stakingBonus: '1.25x staking multiplier';
prioritySupport: '24h support response';
educationalContent: 'Premium courses access';
};
}
FREE INVESTOR
typescript
interface FreeInvestor {
id: 'FREE_INVESTOR';
minimumInvestment: 100; // $100
permissions: {
trading: [
'basic_buy_sell',
'market_orders',
'portfolio_view'
];
    staking: [
      'basic_staking',
      'limited_pools'
    ];
    
    education: [
      'free_educational_content',
      'community_forum',
      'basic_analytics'
    ];
};
dashboardModules: [
'BasicDashboard',
'SimpleTrading',
'PortfolioOverview',
'BasicStaking',
'EducationalHub'
];
limitations: {
tradingFee: '0.25%';
monthlyLimit: '$10,000';
withdrawalFee: '$5 flat';
stakingPools: 'Limited selection';
};
upgradePath: {
toPro: 'Invest $1,000+ or stake 10,000 ICO2';
toInstitutional: 'Apply for institutional status';
};
}

INVESTOR'S Authorities:
Investment and portfolio management.
Token purchase/sale transactions.
Access to a personal dashboard.
Viewing and evaluating projects.
Completing the KYC process.


📊 VERİ MODELİ VE DATABASE SCHEMA
PRISMA SCHEMA
prisma
// schema.prisma
generator client {
provider = "prisma-client-js"
}
datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}
// ============ USER MANAGEMENT ============
model User {
id            String   @id @default(cuid())
email         String   @unique
passwordHash  String
role          UserRole
profile       UserProfile?
kyc           KYC?
wallet        Wallet?
investments   Investment[]
stakings      Staking[]
favorites     Favorite[]
createdAt     DateTime @default(now())
updatedAt     DateTime @updatedAt
@@map("users")
}
enum UserRole {
SUPERADMIN
WEB_ADMIN
CARBON_PROVIDER
VERIFIER
ADVISOR
NGO
INSTITUTIONAL_INVESTOR
PRO_INVESTOR
FREE_INVESTOR
}
model UserProfile {
id              String  @id @default(cuid())
userId          String  @unique
user            User    @relation(fields: [userId], references: [id])
firstName       String
lastName        String
phone           String?
country         String
language        String  @default("en")
timezone        String  @default("UTC")
avatar          String?
bio             String?
company         String?
website         String?
notifications   Json    @default("{}")
preferences     Json    @default("{}")
@@map("user_profiles")
}
model KYC {
id                String      @id @default(cuid())
userId            String      @unique
user              User        @relation(fields: [userId], references: [id])
level             KYCLevel
status            KYCStatus
// Level 1: Basic
emailVerified     Boolean     @default(false)
phoneVerified     Boolean     @default(false)
// Level 2: Enhanced
identityDocument  String?     // S3 URL
addressProof      String?     // S3 URL
selfie            String?     // S3 URL
// Level 3: Institutional
companyRegistration String?
taxId             String?
beneficialOwners  Json?
verifiedAt        DateTime?
verifiedBy        String?
notes             String?
createdAt         DateTime    @default(now())
updatedAt         DateTime    @updatedAt
@@map("kyc_records")
}
enum KYCLevel {
LEVEL_1
LEVEL_2
LEVEL_3
}
enum KYCStatus {
PENDING
UNDER_REVIEW
APPROVED
REJECTED
EXPIRED
}
// ============ WALLET & BLOCKCHAIN ============
model Wallet {
id              String   @id @default(cuid())
userId          String   @unique
user            User     @relation(fields: [userId], references: [id])
address         String   @unique
chainId         Int      @default(1)
balances        Json     @default("{}")
transactions    Transaction[]
createdAt       DateTime @default(now())
updatedAt       DateTime @updatedAt
@@map("wallets")
}
model Transaction {
id              String          @id @default(cuid())
walletId        String
wallet          Wallet          @relation(fields: [walletId], references: [id])
type            TransactionType
hash            String          @unique
from            String
to              String
amount          String
token           String
status          TransactionStatus
confirmations   Int             @default(0)
metadata        Json?
createdAt       DateTime        @default(now())
@@map("transactions")
}
enum TransactionType {
BUY
SELL
STAKE
UNSTAKE
TRANSFER
MINT
BURN
}
enum TransactionStatus {
PENDING
CONFIRMED
FAILED
}


// ============ PROJECTS ============
model Project {
id                String        @id @default(cuid())
name              String
description       String
projectType       ProjectType
developerId       String
developer         User          @relation(fields: [developerId], references: [id])
location          Json
financials        Json
timeline          Json
verification      Json
impact            Json
tokenization      Json?
blockchain        Json?
marketData        Json?
status            ProjectStatus
documents         Document[]
investments       Investment[]
milestones        Milestone[]
updates           ProjectUpdate[]
createdAt         DateTime      @default(now())
updatedAt         DateTime      @updatedAt
@@map("projects")
}
enum ProjectType {
RENEWABLE_ENERGY
REFORESTATION
WASTE_MANAGEMENT
CARBON_CAPTURE
SUSTAINABLE_AGRICULTURE
WATER_CONSERVATION
OTHER
}
enum ProjectStatus {
DRAFT
SUBMITTED
UNDER_REVIEW
APPROVED
ACTIVE
COMPLETED
SUSPENDED
REJECTED
}
model Document {
id              String   @id @default(cuid())
projectId       String
project         Project  @relation(fields: [projectId], references: [id])
name            String
type            DocumentType
url             String
ipfsHash        String?
size            Int
uploadedBy      String
uploadedAt      DateTime @default(now())
@@map("documents")
}
enum DocumentType {
PDF
IMAGE
VIDEO
DOCUMENT
CERTIFICATE
}
model Milestone {
id              String   @id @default(cuid())
projectId       String
project         Project  @relation(fields: [projectId], references: [id])
title           String
description     String
targetDate      DateTime
completedDate   DateTime?
status          MilestoneStatus
proof           String?
@@map("milestones")
}
enum MilestoneStatus {
PENDING
IN_PROGRESS
COMPLETED
DELAYED
}
model ProjectUpdate {
id              String   @id @default(cuid())
projectId       String
project         Project  @relation(fields: [projectId], references: [id])
title           String
content         String
media           Json?
createdBy       String
createdAt       DateTime @default(now())
@@map("project_updates")
}
// ============ INVESTMENTS ============
model Investment {
id              String   @id @default(cuid())
userId          String
user            User     @relation(fields: [userId], references: [id])
projectId       String
project         Project  @relation(fields: [projectId], references: [id])
amount          Float
tokenAmount     Float
pricePerToken   Float
transactionHash String
status          InvestmentStatus
createdAt       DateTime @default(now())
updatedAt       DateTime @updatedAt
@@map("investments")
}
enum InvestmentStatus {
PENDING
COMPLETED
FAILED
REFUNDED
}
// ============ STAKING ============
model Staking {
id              String        @id @default(cuid())
userId          String
user            User          @relation(fields: [userId], references: [id])
tokenType       String
amount          Float
stakingPeriod   Int          // in days
startDate       DateTime     @default(now())
endDate         DateTime
apr             Float
rewardsClaimed  Float        @default(0)
status          StakingStatus
createdAt       DateTime     @default(now())
updatedAt       DateTime     @updatedAt
@@map("stakings")
}
enum StakingStatus {
ACTIVE
COMPLETED
WITHDRAWN
}
// ============ PLATFORM ANALYTICS ============
model PlatformMetrics {
id              String   @id @default(cuid())
date            DateTime @default(now())
totalUsers      Int
activeUsers     Int
totalProjects   Int
approvedProjects Int
totalValueLocked Float
tradingVolume   Float
carbonOffset    Float
metrics         Json
@@map("platform_metrics")
}
model AuditLog {
id              String   @id @default(cuid())
userId          String
action          String
entity          String
entityId        String?
oldValue        Json?
newValue        Json?
ipAddress       String?
userAgent       String?
createdAt       DateTime @default(now())
@@map("audit_logs")
}
// ============ CONTENT MANAGEMENT ============
model BlogPost {
id              String   @id @default(cuid())
title           String
slug            String   @unique
content         String
excerpt         String
coverImage      String?
tags            String[]
category        String
authorId        String
published       Boolean  @default(false)
publishedAt     DateTime?
views           Int      @default(0)
seo             Json?
createdAt       DateTime @default(now())
updatedAt       DateTime @updatedAt
@@map("blog_posts")
}
model Favorite {
id              String   @id @default(cuid())
userId          String
user            User     @relation(fields: [userId], references: [id])
projectId       String
createdAt       DateTime @default(now())
@@unique([userId, projectId])
@@map("favorites")
}


Let the user permissions be shaped in the structure above, let the superadmin manage the user type and permissions for each user, make predictions as a sustainability expert and submit the suggestions you think are needed for the project purpose.
