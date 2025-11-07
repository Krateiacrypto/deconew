# 🚀 DECARBONIZE.world - Entegre İş Akışı Planı

**Created**: 31 Ekim 2025
**Status**: PROJECTS_ARC.md → Mevcut Proje Entegrasyonu
**Progress**: Phase 2.5 Complete → Phase 3 Başlangıç

---

## 📊 MEVCUT DURUM ANALİZİ

### ✅ Tamamlananlar (Phase 1-2.5)
```
Frontend (85% Complete):
├─ 100+ React Components
├─ 11 Zustand Stores
├─ Enhanced Project Module (Phase 2.4)
│  ├─ 5-Tab Detail View ✅
│  ├─ Impact Calculator ✅
│  ├─ Investment Simulator ✅
│  └─ Live Counters ✅
├─ Comparison & Filters (Phase 2.5)
│  ├─ Advanced Filters (15+ options) ✅
│  ├─ Project Comparison Tool ✅
│  └─ Admin Configuration ✅
├─ Security Improvements
│  ├─ XSS Prevention ✅
│  ├─ Error Boundaries ✅
│  ├─ Async Operations ✅
│  └─ 2FA Integration ✅
└─ Build: PASSING (3036 modules)

Backend (60% Complete):
├─ Node.js + Express + TypeScript ✅
├─ MySQL Schema (7 tables) ✅
├─ Authentication Endpoints ✅
├─ 2FA System (TOTP) ✅
├─ Sentry Monitoring ✅
└─ Health Endpoints ✅

Blockchain (40% Complete):
├─ ReefChain Integration ✅
├─ MetaMask Wallet ✅
├─ Smart Contract Service Layer ✅
└─ Contracts: Pending (DCB, CO₂, ICO)
```

### ⏳ PROJECTS_ARC.md ile GAP Analizi

```
PROJECTS_ARC Requirements vs Mevcut Durum:

✅ MEVCUT (Implemented):
├─ User Roles: 6/6 roles defined
├─ Authentication: JWT + 2FA ✅
├─ Dashboard: Basic structures ✅
├─ Project Listing: ProjectsPage ✅
├─ Project Detail: Enhanced (Phase 2.4) ✅
├─ Investment Calculator: Implemented ✅
├─ Admin Panels: Multiple pages ✅
├─ KYC System: Basic workflow ✅
└─ Blockchain Integration: Partial ✅

⚠️ EKSIK (Not Implemented):
├─ ❌ STK/NGO Registration & Onboarding (Stage 0)
├─ ❌ STK Endorsement System (Stage 2.5)
├─ ❌ Donation Mechanism (Investor→NGO, Provider→NGO)
├─ ❌ Revenue Share Smart Contracts
├─ ❌ Donation NFT Certificates
├─ ❌ Multi-sig Wallet for NGOs
├─ ❌ Carbon Credit Calculation System
├─ ❌ Project Approval Workflow (7-Stage)
├─ ❌ Verifier (Auditor) Dashboard
├─ ❌ Consultant Dashboard
├─ ❌ Real-time Chat (Sağlayıcı-Danışman-Doğrulayıcı)
├─ ❌ Document Sharing Workspace
├─ ❌ Smart Contracts (8 contracts)
├─ ❌ Transparency Scoring System
├─ ❌ Impact Reporting Tools
└─ ❌ Gamification & Achievements
```

---

## 🎯 ENTEGRASYON STRATEJİSİ

### Yaklaşım: **Incremental Integration**
Mevcut yapıyı koruyarak, PROJECTS_ARC özelliklerini adım adım ekleyeceğiz.

### Öncelik Sıralaması (MoSCoW Method):

```
MUST HAVE (Phase 3 - Immediate):
1. Project Workflow System (7-Stage)
2. Carbon Credit Calculation
3. Provider Dashboard Enhancement
4. Admin Approval Workflow
5. Smart Contracts (Core 3)

SHOULD HAVE (Phase 4 - Short-term):
6. NGO/STK Registration System
7. Endorsement Mechanism
8. Donation System (Basic)
9. Verifier Dashboard
10. Consultant Dashboard

COULD HAVE (Phase 5 - Mid-term):
11. Advanced Donation Features
12. Impact Reporting
13. Transparency Scoring
14. Gamification
15. Real-time Chat

WON'T HAVE (Future Phases):
16. DAO Governance
17. Cross-chain Support
18. Metaverse Integration
19. Satellite Data Integration
```

---

## 🏗️ PHASE 3: PROJECT WORKFLOW & CARBON CREDITS

### 📅 Timeline: 2-3 weeks
### 🎯 Goal: Implement 7-Stage Project Approval Workflow + Carbon Credit System

---

### **Stage 1: Project Submission Enhancement**

#### Backend Tasks:

**1.1 Database Schema Updates**
```sql
-- Add to existing projects table
ALTER TABLE projects ADD COLUMN carbon_calculation JSON;
ALTER TABLE projects ADD COLUMN token_exchange_rate DECIMAL(10,6);
ALTER TABLE projects ADD COLUMN co2_target DECIMAL(15,2);
ALTER TABLE projects ADD COLUMN workflow_stage ENUM('pending_admin_review', 'under_verification', 'endorsement_phase', 'consultant_review', 'final_approval', 'approved', 'rejected') DEFAULT 'pending_admin_review';
ALTER TABLE projects ADD COLUMN funding_goal DECIMAL(18,2);
ALTER TABLE projects ADD COLUMN min_investment DECIMAL(18,2);
ALTER TABLE projects ADD COLUMN max_investment DECIMAL(18,2);

-- New table: project_documents
CREATE TABLE project_documents (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  document_type ENUM('feasibility_study', 'environmental_impact', 'carbon_methodology', 'verification_report', 'audit_report', 'other') NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by VARCHAR(36) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- New table: carbon_calculations
CREATE TABLE carbon_calculations (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  baseline_emissions DECIMAL(15,2),
  project_emissions DECIMAL(15,2),
  total_reduction DECIMAL(15,2),
  methodology VARCHAR(255), -- VCS, CDM, Gold Standard
  calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_by VARCHAR(36),
  verification_date TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

**1.2 API Endpoints** (`backend/src/routes/projects.ts`)
```typescript
POST   /api/projects/submit          // Enhanced with carbon data
GET    /api/projects/:id/carbon      // Get carbon calculation
POST   /api/projects/:id/documents   // Upload documents
GET    /api/projects/:id/workflow    // Get workflow status
PATCH  /api/projects/:id/stage       // Update workflow stage (admin)
```

#### Frontend Tasks:

**1.3 Enhanced Project Submission Form** (`src/pages/provider/ProjectSubmission.tsx`)
```tsx
Components to create:
├─ CarbonCalculator.tsx          (Calculate CO2 reduction)
├─ TokenEconomicsForm.tsx         (Define token exchange rate)
├─ DocumentUploader.tsx           (Feasibility, EIA, Methodology)
├─ FundingGoalSetup.tsx          (Goal, min/max investment)
└─ ProjectSubmissionWizard.tsx   (Multi-step form)
```

---

### **Stage 2: Admin Review & Assignment**

#### Backend Tasks:

**2.1 Database Schema**
```sql
-- New table: project_assignments
CREATE TABLE project_assignments (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  assigned_to VARCHAR(36) NOT NULL,
  role_type ENUM('verifier', 'consultant') NOT NULL,
  assigned_by VARCHAR(36) NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'completed', 'reassigned') DEFAULT 'active',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (assigned_by) REFERENCES users(id)
);

-- New table: workflow_history
CREATE TABLE workflow_history (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  from_stage VARCHAR(50),
  to_stage VARCHAR(50) NOT NULL,
  changed_by VARCHAR(36) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

**2.2 API Endpoints**
```typescript
GET    /api/admin/projects/pending        // Pending admin review
POST   /api/admin/projects/:id/assign     // Assign verifier/consultant
GET    /api/admin/projects/:id/history    // Workflow history
POST   /api/admin/projects/:id/approve    // Move to next stage
POST   /api/admin/projects/:id/reject     // Reject project
```

#### Frontend Tasks:

**2.3 Admin Review Dashboard** (`src/pages/admin/ProjectReview.tsx`)
```tsx
Components:
├─ PendingProjectsQueue.tsx       (List with filters)
├─ ProjectReviewModal.tsx         (Detailed review)
├─ VerifierAssignment.tsx         (Select & assign verifier)
├─ ConsultantAssignment.tsx       (Select & assign consultant)
├─ CarbonCalculationReview.tsx    (Verify CO2 data)
└─ WorkflowTimeline.tsx           (Visual progress)
```

---

### **Stage 3: Verification Process**

#### Backend Tasks:

**3.1 Database Schema**
```sql
-- New table: audit_reports
CREATE TABLE audit_reports (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  verifier_id VARCHAR(36) NOT NULL,
  executive_summary TEXT,
  carbon_verification JSON, -- methodology, accuracy, findings
  risk_assessment JSON,
  recommendation ENUM('approve', 'reject', 'revise') NOT NULL,
  evidence_urls JSON, -- photos, videos, documents
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  status ENUM('draft', 'submitted', 'reviewed') DEFAULT 'draft',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (verifier_id) REFERENCES users(id)
);

-- New table: site_visits
CREATE TABLE site_visits (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  verifier_id VARCHAR(36) NOT NULL,
  visit_date TIMESTAMP NOT NULL,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  findings TEXT,
  photos JSON,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

**3.2 API Endpoints**
```typescript
GET    /api/verifier/assignments         // My assigned projects
GET    /api/verifier/projects/:id        // Project details
POST   /api/verifier/projects/:id/audit  // Submit audit report
POST   /api/verifier/site-visit          // Record site visit
GET    /api/verifier/checklists          // ISO 14064, GHG Protocol
```

#### Frontend Tasks:

**3.3 Verifier Dashboard** (`src/pages/verifier/VerifierDashboard.tsx`)
```tsx
NEW Pages & Components:
├─ VerifierDashboard.tsx            (Overview + assigned projects)
├─ AuditWorkbench.tsx               (Checklist, evidence collector)
├─ CarbonVerificationTool.tsx       (Calculation validator)
├─ SiteVisitScheduler.tsx           (Schedule & record visits)
├─ EvidenceUploader.tsx             (Photos, videos, measurements)
└─ AuditReportBuilder.tsx           (Template-based report)
```

---

### **Stage 4-7: Rapid Development**

Following same pattern for:
- Stage 4: Consultant Review
- Stage 5: Final Admin Approval
- Stage 6: Smart Contract Deployment
- Stage 7: Project Goes Live

---

## 🎨 FRONTEND GÖRÜNÜM SORUNUNU DÜZELTME

### Problem: ProjectsPage'de Enhanced Components Görünmüyor

**User Feedback**: "Frontend te ilettiğin şekilde bir preview göremedim."

**Root Cause**: Phase 2.5 components (ProjectComparison, AdvancedFilters) created but not integrated into visible UI.

**Solution**: Integrate into ProjectsPage with visible buttons and modals.

---

## 📋 IMPLEMENTATION TIMELINE

### Phase 3.0: Frontend UI Fix (IMMEDIATE - 30 min)
```
Fix ProjectsPage to show Phase 2.5 components:
├─ Add "Gelişmiş Filtreler" button in header
├─ Add "Karşılaştır" button to project cards
├─ Integrate AdvancedFilters panel
└─ Integrate ProjectComparison modal
```

### Phase 3.1: Database Schema (1-2 hours)
```
Execute migrations:
├─ ALTER TABLE projects (add workflow fields)
├─ CREATE TABLE project_documents
├─ CREATE TABLE carbon_calculations
├─ CREATE TABLE project_assignments
├─ CREATE TABLE workflow_history
├─ CREATE TABLE audit_reports
└─ CREATE TABLE site_visits
```

### Phase 3.2: Enhanced Project Submission (4-6 hours)
```
Create Components:
├─ CarbonCalculator.tsx
├─ TokenEconomicsForm.tsx
├─ DocumentUploader.tsx (enhanced)
├─ FundingGoalSetup.tsx
└─ ProjectSubmissionWizard.tsx (multi-step)

Backend Endpoints:
├─ POST /api/projects/submit (enhanced)
├─ GET /api/projects/:id/carbon
├─ POST /api/projects/:id/documents
└─ GET /api/projects/:id/workflow
```

### Phase 3.3: Admin Review System (3-4 hours)
```
Create Components:
├─ PendingProjectsQueue.tsx
├─ ProjectReviewModal.tsx
├─ VerifierAssignment.tsx
├─ ConsultantAssignment.tsx
├─ CarbonCalculationReview.tsx
└─ WorkflowTimeline.tsx

Backend Endpoints:
├─ GET /api/admin/projects/pending
├─ POST /api/admin/projects/:id/assign
├─ GET /api/admin/projects/:id/history
├─ POST /api/admin/projects/:id/approve
└─ POST /api/admin/projects/:id/reject
```

### Phase 3.4: Verifier Dashboard (4-6 hours)
```
NEW Pages:
├─ VerifierDashboard.tsx
├─ AuditWorkbench.tsx
├─ CarbonVerificationTool.tsx
├─ SiteVisitScheduler.tsx
├─ EvidenceUploader.tsx
└─ AuditReportBuilder.tsx

Backend Endpoints:
├─ GET /api/verifier/assignments
├─ GET /api/verifier/projects/:id
├─ POST /api/verifier/projects/:id/audit
├─ POST /api/verifier/site-visit
└─ GET /api/verifier/checklists
```

---

## 🚀 QUICK START CHECKLIST

### Prerequisites
- [ ] MySQL database running
- [ ] Backend server started (port 3002)
- [ ] Frontend dev server running (port 5173)
- [ ] Phase 2.5 components created (✅ DONE)

### Phase 3 Kickoff
1. [ ] Fix ProjectsPage UI (30 min)
2. [ ] Run database migrations (10 min)
3. [ ] Test Phase 2.5 components (10 min)
4. [ ] Begin Stage 1 implementation (4-6 hours)

---

## 📊 PROGRESS TRACKING

```
PROJECTS_ARC Integration Progress:

Phase 3.0 (UI Fix):           0% ⏳ NEXT
Phase 3.1 (DB Schema):        0% ⏳
Phase 3.2 (Submission):       0% ⏳
Phase 3.3 (Admin Review):     0% ⏳
Phase 3.4 (Verifier):         0% ⏳

Phase 4 (NGO System):         0% ⏳
Phase 5 (Advanced):           0% ⏳

Overall PROJECTS_ARC: 5% (Analysis Complete)
```

---

## 🎯 SUCCESS CRITERIA

### Phase 3 Complete When:
- ✅ ProjectsPage shows Comparison & Filters UI
- ✅ 7-stage workflow implemented
- ✅ Carbon calculator functional
- ✅ Admin can assign verifiers
- ✅ Verifiers can submit audits
- ✅ Projects move through workflow stages
- ✅ All database migrations executed
- ✅ 15+ new API endpoints working
- ✅ 20+ new components created

---

## ⚠️ RISK MITIGATION

### Potential Issues:
1. **Data Migration**: Existing projects need workflow_stage default
   - Solution: ALTER TABLE with DEFAULT value
2. **Backward Compatibility**: Old project structure vs new enhanced
   - Solution: Make new fields optional, gradual migration
3. **Performance**: Carbon calculations may be slow
   - Solution: Cache results, async processing
4. **Smart Contracts**: Not yet deployed
   - Solution: Mock contract layer, deploy in Phase 3.6

---

## 📞 NEXT IMMEDIATE ACTION

**Step 1 (NOW)**: Fix ProjectsPage UI - Add visible buttons for Comparison & Filters

After UI fix, user will see:
- "Gelişmiş Filtreler" button → opens AdvancedFilters panel
- "Karşılaştır" checkbox on each project card → select & compare
- Working filter presets with backup/restore
- Working comparison tool with admin-configured fields

**Estimated Time**: 30 minutes

---

**End of INTEGRATED_WORKFLOW.md**

**Created**: 31 Ekim 2025
**Status**: Analysis Complete, Ready for Phase 3 Implementation
**Next**: Fix ProjectsPage UI → Begin Stage 1 Development