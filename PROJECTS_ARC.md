# Blockchain Tabanlı Karbon Kredisi Platform Sistemi - Kapsamlı Geliştirme Prompt'u

## Sistem Genel Bakış

Blockchain tabanlı karbon kredisi platformu için çok katmanlı proje onay, yönetim, yatırım ve STK bağış sistemi geliştirmelisin.

---

## ROLLER VE YETKİLER

### 1. Süper Admin
- Tüm sistem yönetimi
- Final onaylar
- Rol atamaları
- STK onayı

### 2. Karbon Kredisi Sağlayıcı
- Proje başvurusu yapma
- Doküman yükleme
- STK'lara bağış yapma

### 3. Doğrulayıcı (Auditor)
- Denetim raporu hazırlama
- Kanıt toplama

### 4. Danışman (Consultant)
- İletişim koordinasyonu
- Süreç yönetimi

### 5. Yatırımcı (Investor)
- CO2 token ile projelere yatırım yapma
- STK'lara bağış yapma
- Portfolio yönetimi

### 6. Sivil Toplum Kuruluşu (NGO)
- Projeleri destekleme
- Bağış alma
- Impact reporting

---

## WORKFLOW AKIŞI

### ═══════════════════════════════════════════════════════
### STK ONBOARDING VE PROJE DESTEKLEME SÜRECİ (YENİ)
### ═══════════════════════════════════════════════════════

## Stage 0 - STK Kayıt ve Onay

### A) STK Başvurusu

**STK Profil Oluşturma:**
- Resmi kuruluş adı
- Vergi numarası / Registration number
- Faaliyet alanları (Climate Action, Reforestation, Ocean Conservation, Renewable Energy)
- Misyon ve vizyon
- Geçmiş proje portföyü
- Team bilgileri
- Resmi belgeler (tüzük, vergi levhası, faaliyet raporu)
- Banka hesap bilgileri (bağış almak için)
- Blockchain wallet address (CO2 token alımı için)
- Sosyal medya ve web site

**Gerekli Sertifikalar:**
- 501(c)(3) status (US) / Dernekler Kanunu belgesi (TR)
- Transparency certification (GiveWell, Charity Navigator score)
- ISO 26000 (Social Responsibility)
- Previous audit reports

### B) Admin Onay Süreci

**Süper admin STK başvurusunu inceler:**
- Legal document verification
- Background check
- Financial transparency review
- Past project success rate
- Reputation check (awards, media coverage)
- Conflict of interest check

**Onay sonrası:**
- STK dashboard erişimi aktive edilir
- Public STK profile page oluşturulur
- Notification sistemi aktive edilir
- Proje destekleme hakkı verilir

### C) STK Proje Destekleme Mekanizması

**Proje Keşif:**
- STK dashboard'unda "Available Projects" bölümü
- Filtreleme:
  - Kendi uzmanlık alanı (Climate, Forest, Ocean, Energy)
  - Lokasyon (focus areas)
  - Project size
  - Carbon impact
  - Alignment score (AI-powered matching)

**Destekleme Bildirimi (Endorsement):**
- STK projeyi inceler (Stage 2'de "Under Verification" aşamasında)
- "Endorse This Project" butonu
- Endorsement formu:
  - Support level: LOW (25%) / MEDIUM (50%) / HIGH (75%) / FULL (100%)
  - Support rationale (detaylı açıklama)
  - Expertise alignment (neden bu proje?)
  - Risk assessment (STK perspektifinden)
  - Co-promotion willingness (kendi kanallarında tanıtım yapacak mı?)
  - Technical assistance offer (eğitim, mentoring, network)
  - Monetary support commitment (optional, kendi bütçesinden destek)

**Endorsement sisteme kaydedilir:**
- Danışman ve admin bilgilendirilir
- Proje sayfasında STK badge'i belirir
- STK logo ve support level görünür hale gelir
- Doğrulayıcı endorsement'ı audit sürecine dahil eder

**STK Support Level Impact:**

```javascript
Endorsement Levels:
- LOW (25%): "Supported by [NGO]" badge
- MEDIUM (50%): "Recommended by [NGO]" badge + priority listing
- HIGH (75%): "Highly Recommended" + featured project + 10% fee discount
- FULL (100%): "NGO Partnered" + maximum visibility + 20% fee discount + guaranteed promotion
```

---

### ═══════════════════════════════════════════════════════
### BAĞIŞ MEKANİZMASI (YENİ)
### ═══════════════════════════════════════════════════════

## A) YATIRIMCI → STK Bağışı

### Yatırımcı Dashboard'unda "Support NGOs" Bölümü

#### 1. STK Marketplace

**Filtreleme:**
- Focus area (Climate, Ocean, Forest, Energy)
- Transparency score (yüksekten düşüğe)
- Impact rating (5 star system)
- Total projects endorsed
- Geography
- Donation acceptance (CO2 Token, Fiat, Crypto)

**Her STK kartında:**
- STK logo ve banner
- Mission statement (kısa)
- Endorsed projects count
- Average endorsement level
- Total donations received
- Impact metrics (tons CO2, projects supported)
- Transparency score (0-100)
- "Donate" button
- "View Profile" button

#### 2. STK Detay Sayfası

**About Section:**
- Full mission & vision
- Team members
- Past achievements
- Awards & recognitions
- Financial transparency report
- Audit reports

**Projects Endorsed:**
- List of all supported projects
- Endorsement levels
- Success rate
- Total impact generated

**Impact Dashboard:**
- Total CO2 offset facilitated
- Projects brought to platform
- Geographic reach
- SDG alignment

**Donation Options:**
- One-time donation
- Recurring donation (monthly)
- Earmarked donation (specific project support)
- General fund

#### 3. Donation Flow

```
Step 1: Amount Selection
- CO2 Token amount slider
- Fiat equivalent display
- Suggested amounts (10, 50, 100, 500 CO2 Tokens)
- Custom amount
- Tax deduction calculation (if applicable)

Step 2: Donation Type
○ General Fund (STK discretion)
○ Project-Specific (dropdown: endorsed projects)
○ Emergency Fund
○ Operating Costs

Step 3: Recurring Setup (Optional)
- Frequency (monthly, quarterly, annually)
- Duration (6 months, 1 year, ongoing)
- Auto-renewal toggle

Step 4: Impact Estimate
- Your donation: 100 CO2 Tokens
- Supports: "Amazon Reforestation Project"
- Estimated impact: 50 tons CO2 offset
- NGO's track record: 95% success rate
- Your contribution helps: Project certification costs

Step 5: Transaction
- Smart contract execution
- Donation NFT minting (tax receipt + proof)
- Thank you message from STK
- Social sharing option
```

#### 4. Donation Benefits

- Donation NFT certificate (blockchain proof)
- Tax deduction documents (auto-generated)
- Impact reports (quarterly from STK)
- Exclusive updates on supported projects
- Donor recognition (with permission):
  - Bronze (<100 CO2): Name on website
  - Silver (100-500 CO2): Logo + special thanks
  - Gold (500-1000 CO2): Featured donor + call with team
  - Platinum (1000+ CO2): Board meeting invitation + co-branding

#### 5. Donor Dashboard

- Total donations (lifetime)
- Active recurring donations
- Donation history
- Impact generated (aggregate from all STKs)
- Tax documents repository
- NFT certificate gallery
- Impact reports archive

---

## B) KARBON KREDİSİ SAĞLAYICI → STK Bağışı

### Sağlayıcı Motivasyonu
- STK endorsement almak için teşvik
- Corporate social responsibility (CSR)
- Better project visibility
- Trust signals for investors
- Fee discounts based on STK support level

### Bağış Mekanizması

#### 1. Project Revenue Sharing Model

Proje yaratıcısı kurulum aşamasında belirler:
- Revenue share percentage (0-10%)
- Destination STK seçimi (endorsed STKs listesinden)
- Distribution frequency (monthly, quarterly)
- Automatic or manual release

#### 2. Direct Donation Option

- Sağlayıcı dashboard'unda "Support NGOs"
- Endorsed by my project (liste)
- Similar mission STKs (AI önerisi)
- Donation flow (yatırımcı ile aynı)

#### 3. In-Kind Contribution

- Free project consultation
- Data sharing
- Co-branding opportunities
- Field access for STK research
- Employment opportunities

---

## C) STK Bağış Alma Dashboard

### 1. Donation Management
- Incoming donations (real-time)
- Donor list (anonymous / public)
- Allocation tracker (fund usage)
- Withdrawal requests
- Multi-sig wallet management

### 2. Impact Reporting Tools
- Quarterly report generator
- Impact metrics calculator
- Photo/video upload
- Donor communication templates
- Transparency dashboard (public facing)

### 3. Project Endorsement ROI
- Which projects generated donations
- Endorsement effectiveness score
- Donor retention rate
- Average donation size

### 4. Financial Transparency

**Fund allocation breakdown:**
- Program expenses (min 70%)
- Admin costs (max 15%)
- Fundraising (max 15%)
- Real-time balance
- Blockchain transaction history
- Audit trail
- Annual report auto-generation

---

## D) BAĞIŞ DOĞRULAMA VE GÜVENİLİRLİK

### Trust Mechanisms

#### 1. Transparency Score (0-100)
- Financial disclosure: 30 points
- Regular reporting: 20 points
- Third-party audits: 20 points
- Project success rate: 15 points
- Community feedback: 15 points

#### 2. Smart Contract Safeguards
- Multi-sig withdrawal (3/5 approval)
- Time-locked funds (vesting schedule)
- Automatic allocation rules
- Emergency pause function
- Refund mechanism (if STK violates terms)

#### 3. Community Oversight
- Donor voting on major decisions
- Quarterly AMAs
- Public comment section
- Whistleblower protection
- Dispute resolution protocol

#### 4. Admin Monitoring
- Unusual withdrawal patterns alert
- Compliance checks
- Performance review (annual)
- Certification renewal
- Potential suspension/ban

---

### ═══════════════════════════════════════════════════════
### MAIN PROJECT WORKFLOW (Updated with STK Integration)
### ═══════════════════════════════════════════════════════

## Stage 1 - Proje Başvurusu

Karbon kredisi sağlayıcı proje detaylarını doldurur:
- Lokasyon, CO2 hedefi, süre, bütçe, tokenomics
- KARBON KREDİSİ HESAPLAMA: Her proje için CO2 azaltım miktarı belirlenir (örn: 10,000 ton CO2/yıl)
- TOKEN EXCHANGE RATE: 1 CO2 Token = X ton karbon kredisi oranı tanımlanır
- Proje funding goal ve minimum/maximum yatırım limitleri belirlenir

**STK Partnership (Optional but Recommended):**
- İlgili STK'ları seç (multiple selection)
- Partnership proposal yaz
- Revenue sharing teklifi (0-10%)
- Co-promotion agreement

**Gerekli dokümanlar:**
- Feasibility study
- Environmental impact assessment
- Carbon calculation methodology

Başvuru "Pending Admin Review" durumuna geçer.

---

## Stage 2 - Admin İncelemesi ve Atama

Süper admin başvuruyu inceler:
- Duplicate check, initial validation
- Carbon credit calculation review
- CO2 token conversion rate'i doğrular ve onaylar

**STK'lara proje bildirimi gönderilir (endorsement opportunity)**

Admin atamaları yapar:
- Uygun doğrulayıcı seçer ve atar (specialization, workload, location match, carbon credit expertise)
- Proje için özel danışman atar

**Atamalar sonrası sistem otomatik olarak:**
- Dedicated chat room oluşturur (Sağlayıcı-Danışman-Doğrulayıcı)
- Document sharing workspace hazırlar
- Timeline ve milestone'ları set eder

Proje durumu: "Under Verification" + "Open for NGO Endorsement"

---

## Stage 2.5 - STK Endorsement Phase (YENİ)

- STK'lar projeyi inceler (14 gün süre)
- Endorsement kararı verir (support level seçer)
- Multiple STK endorsement possible
- Highest endorsement level projeye uygulanır
- Endorsement'lar audit sürecine input sağlar

---

## Stage 3 - Doğrulama Süreci

### Doğrulayıcı Dashboard'unda:
- Assigned projects listesi
- Carbon credit calculation verification tool
- Required audit checklist (ISO 14064, GHG Protocol, Verra VCS, Gold Standard)
- Document request form (danışman üzerinden iletilir)
- Site visit scheduler
- CO2 measurement verification tools
- Evidence upload section (photos, videos, measurements, third-party reports, carbon monitoring data)

### Danışman Messaging Hub:
- Threaded conversations
- Document approval workflow
- Meeting scheduler
- Progress tracker
- Automated reminders

### Doğrulayıcı Audit Raporunu Hazırlar:
- Executive summary
- Carbon credit methodology verification
- CO2 calculation accuracy check
- Baseline vs project scenario analysis
- Findings & evidence
- Risk assessment
- Token exchange rate validation
- **STK endorsement'ları audit raporuna dahil edilir**
- Recommendation (Approve/Reject/Revise)
- Supporting documents attachment

---

## Stage 4 - Danışman Review

Danışman tüm süreç dokümanlarını toplar:
- Audit report
- Carbon credit verification documents
- Communication logs
- Revised documents
- Issue resolution records
- **STK endorsement summary**

Completeness check yapar, token economics review, final recommendation report hazırlar.

Süper admin'e "Ready for Final Approval" olarak iletir.

---

## Stage 5 - Final Approval

### Süper Admin Review Dashboard:
- Complete project timeline view
- All stakeholder comments
- Audit report with evidence
- Carbon credit calculation final review
- Token conversion rate approval
- **STK endorsement consideration (bonus points)**
- Consultant recommendation
- Risk scoring
- Compliance checklist

**Approve/Reject/Request Revision seçenekleri** (Rejection nedeni mandatory)

### Approval Sonrası:
- Smart contract deployment (ERC-20 project token + staking mechanism)
- Project goes live on "Projects" page
- Investment pool creation
- CO2 token acceptance configuration
- **STK badges görünür**
- **Endorsed projects section'da featured**
- Investor notification (email, push, in-app)
- Public project page activation
- Carbon credit registry integration

---

## Stage 6 - Investment + Donation Phase

- Yatırımcılar projeye invest eder
- **STK endorsement trust signal olarak gösterilir**
- **Yatırımcılar aynı anda STK'ya da bağış yapabilir (optional add-on)**
- **Revenue share otomatik STK'ya aktarılır**

### YATIRIMCI PANELİ

#### A) Dashboard Overview
- Wallet bağlantı durumu (CO2 token balance görünür)
- Active investments portfolio
- Total carbon impact (ton CO2 offset)
- ROI tracker (real-time)
- Upcoming dividend/reward distributions
- Investment recommendations (AI-powered)

#### B) Projects Marketplace

**Filtreleme sistemi:**
- CO2 token price range
- Carbon credit per token ratio (örn: 1 CO2 Token = 0.5 ton karbon kredisi)
- Expected ROI/APY
- Funding progress (%)
- Time remaining
- Risk level
- Certification type (Verra, Gold Standard, CDM)
- Geography
- Project type (Renewable Energy, Reforestation, Ocean Clean-up)
- **STK-endorsed filter**

**Her proje kartında:**
- CO2 Token Fiyatı: "1 CO2 Token = X karbon kredisi"
- Current funding: "2,500 / 10,000 CO2 Tokens"
- Carbon credits generated: "5,000 tons CO2/year"
- Token-to-Carbon ratio calculator
- Minimum investment: "10 CO2 Tokens"
- Maximum investment: "1,000 CO2 Tokens"
- Expected returns: "15% APY"
- **🏅 Endorsed by: [STK Logos + Support Level]**
- Investment button (Quick invest)
- Detailed view button

#### C) Proje Detay Sayfası

**INVESTMENT CALCULATOR:**
- CO2 Token amount slider
- Real-time calculation:
  - Yatırım tutarı (CO2 Token)
  - Karbon kredisi karşılığı (ton CO2)
  - Expected returns (timeline ile)
  - Your carbon impact
  - Project ownership percentage
- Gas fee estimator
- Slippage tolerance ayarı

**CARBON CREDIT DETAILS:**
- Methodology (VCS, CDM, Gold Standard)
- Verification body
- Baseline scenario
- Project scenario
- Additionality proof
- Permanence guarantees
- Leakage analysis
- Co-benefits (SDG alignment)

**TOKENOMICS:**
- Total token supply
- Tokens for sale
- Token distribution (investors, team, reserve)
- Vesting schedule
- Buyback mechanism
- Dividend distribution logic

**VERIFICATION DOCS:**
- Audit report (public summary)
- Carbon calculation methodology
- Third-party certifications
- Monitoring reports
- Blockchain transaction history

**NGO ENDORSEMENTS SECTION:**
```
═══ NGO ENDORSEMENTS ═══
┌─────────────────────────────────────────┐
│  🏅 This project is endorsed by 2 NGOs  │
│                                         │
│  [WWF Logo]                             │
│  World Wildlife Fund                    │
│  Endorsement Level: HIGH (75%)          │
│  "Exceptional reforestation methodology │
│   with strong community engagement and  │
│   biodiversity protection measures."    │
│  [Donate to WWF] [View Profile]         │
│                                         │
│  [Greenpeace Logo]                      │
│  Greenpeace International               │
│  Endorsement Level: MEDIUM (50%)        │
│  "Solid project with good carbon        │
│   accounting and monitoring protocols." │
│  [Donate to Greenpeace] [View Profile]  │
│                                         │
│  💡 NGO-endorsed projects have 2.3x     │
│     higher success rate                 │
└─────────────────────────────────────────┘
```

#### D) Investment Transaction Flow

**Step 1 - Amount Selection:**
- CO2 Token amount input
- Max button (invest all available)
- Validation checks:
  - Sufficient CO2 token balance
  - Min/max investment limits
  - Remaining project capacity
  - Wallet connection status

**Step 2 - Impact Preview:**

Transaction summary card:
- CO2 Tokens: 100
- Carbon Credits: 50 tons CO2
- Your contribution: 2% of project
- Expected annual return: 15 CO2 Tokens
- Total carbon offset: 50 tons (equivalent to X trees planted)
- Network fee: 0.005 ETH
- Total cost breakdown

**Step 3 - Smart Contract Interaction:**
- Approve CO2 token spending (if needed)
- Execute investment transaction
- Real-time transaction status:
  - Pending (wallet confirmation)
  - Submitted (tx hash link)
  - Confirming (block confirmations)
  - Success (confetti animation 🎉)
  - Failed (error details + retry)

**Step 4 - Post-Investment:**
- NFT certificate minting (proof of carbon offset)
- Portfolio automatic update
- Achievement unlocked notifications
- Social sharing option
- Transaction receipt download

**Combined Invest + Donate Flow:**
```
Investment Modal:
┌─────────────────────────────────────────┐
│  Invest in Amazon Reforestation         │
│                                         │
│  Investment Amount:                     │
│  [1000] CO2 Tokens                      │
│                                         │
│  Expected Returns: 150 CO2 Tokens/year  │
│  Carbon Credits: 500 tons CO2           │
│                                         │
│  ✨ Also support the NGOs behind this   │
│     project:                            │
│                                         │
│  ☑ Donate 50 CO2 to WWF                 │
│  ☑ Donate 30 CO2 to Greenpeace          │
│                                         │
│  Total: 1,080 CO2 Tokens                │
│  (1,000 investment + 80 donation)       │
│                                         │
│  💝 Get exclusive donor NFT certificates│
│                                         │
│  [Confirm Transaction]                  │
└─────────────────────────────────────────┘
```

#### E) Portfolio Management

**Active Investments Table:**
- Project name & logo
- Investment amount (CO2 Tokens)
- Carbon credits owned (tons)
- Current value
- ROI (%)
- Status (Active/Matured/Exited)
- Claim rewards button
- Reinvest option

**Performance Charts:**
- Portfolio value over time
- Carbon impact accumulation
- Per-project breakdown
- Realized vs unrealized gains

**Carbon Impact Dashboard:**
- Total CO2 offset (lifetime)
- Equivalent metrics (trees planted, cars off road, homes powered)
- Interactive visualization
- Impact certificates gallery
- Social proof badges

#### F) Rewards & Distribution
- Claimable rewards tracker
- Distribution schedule calendar
- Auto-compound option
- Reward history
- Tax report generator

#### G) Secondary Market (Advanced)
- Sell carbon credits to other users
- P2P trading interface
- Order book
- Price discovery mechanism
- Escrow smart contract

---

## Stage 7 - Post-Launch (YENİ)

- Project monitoring
- STK impact reporting
- Donation distribution
- Quarterly stakeholder updates
- Success metrics tracking

---

### ═══════════════════════════════════════════════════════
### CARBON CREDIT TOKEN EKONOMİSİ
### ═══════════════════════════════════════════════════════

## Token Conversion System

```javascript
// Örnek hesaplama
Project: Amazon Reforestation
Total Carbon Credits: 100,000 tons CO2
Token Supply: 200,000 CO2 Tokens
Conversion Rate: 1 CO2 Token = 0.5 ton carbon credit

Investor Investment:
- Invests: 1,000 CO2 Tokens
- Receives: 500 tons carbon credit rights
- Ownership: 0.5% of project
- Annual CO2 offset: 500 tons
```

## Smart Contract Logic

- ERC-20 standardı CO2 token integration
- Staking mechanism (lock tokens, earn rewards)
- Vesting schedule enforcement
- Dividend distribution automation
- Carbon credit retirement mechanism
- Fractional ownership tracking
- Emergency pause functionality
- Upgradeable proxy pattern

## Pricing Mechanism

Dynamic pricing based on:
- Project demand (funding speed)
- Carbon credit market prices
- Risk assessment score
- Remaining capacity
- Time to project start

---

### ═══════════════════════════════════════════════════════
### DASHBOARD BÖLÜMLER
### ═══════════════════════════════════════════════════════

## 1. Super Admin Panel

**Features:**
- Pending applications queue
- **STK application review**
- Active verifications monitor
- **STK performance monitoring**
- **Donation flow oversight**
- CO2 token conversion rate management
- Investment pool monitoring
- Auditor/Consultant management
- **STK suspension/ban management**
- System analytics (TVL, total donations, STK impact)
- Role assignment interface
- **STK registry management**
- Carbon credit registry sync

---

## 2. Karbon Sağlayıcı Panel

**Features:**
- Application form wizard (carbon calculation included, STK partnership section)
- Token economics planner
- **STK endorsement tracker**
- Document upload manager (drag-drop, version control)
- Project status tracker (visual timeline)
- Funding progress monitor
- **Donation commitment tracker**
- Investor communication center
- **STK collaboration hub**
- Revenue dashboard
- Carbon credit issuance tracker

---

## 3. Doğrulayıcı Panel

**Features:**
- Assignment inbox
- **STK endorsement review**
- Carbon credit calculation verification tool
- Audit workbench (checklist, evidence collector)
- Field data entry forms
- Report builder (templates, auto-calculations, STK input section)
- Quality assurance tools
- Certification checklist

---

## 4. Danışman Panel

**Features:**
- Active projects overview
- Communication hub (all parties)
- **STK coordination**
- Document coordination center
- Token economics review tools
- Meeting scheduler
- Escalation manager
- Progress reporting tools

---

## 5. Yatırımcı Panel

**Features:**
- Wallet dashboard (CO2 token balance, portfolio value)
- Projects marketplace (filtreleme ve sıralama, **STK-endorsed filter**)
- Investment calculator
- Active investments portfolio
- **Donation dashboard (NEW)**
- **Supported NGOs (NEW)**
- **Impact tracker (investments + donations)**
- Carbon impact tracker
- Rewards center (claim, history)
- Transaction history
- **Donation NFT gallery (NEW)**
- NFT certificate gallery
- Watchlist (favorite projects)
- Investment analytics
- Tax documents (investments + donations)

---

## 6. STK Panel (YENİ)

### Dashboard Overview
- Total donations received
- Active donors count
- Projects endorsed
- Average endorsement level
- Impact generated
- Transparency score

### Project Discovery
- Available projects (Under Verification)
- Matching score (AI-powered)
- Endorsement recommendations
- Past endorsed projects performance

### Endorsement Management
- Pending endorsement requests
- Active endorsements
- Endorsement history
- Impact tracking per project

### Donation Center
- Incoming donations (real-time)
- Donor management
- Thank you message automation
- Recurring donation tracker
- Impact report sender

### Financial Management
- Wallet balance (CO2 Token, ETH, stablecoins)
- Fund allocation dashboard
- Withdrawal requests (multi-sig)
- Transaction history
- Budget planning tools

### Impact Reporting
- Quarterly report builder
- Impact metrics calculator
- Photo/video gallery
- Success stories
- Public transparency dashboard

### Communication Hub
- Donor messaging
- Project creator collaboration
- Admin communication
- Newsletter builder
- Social media integration

### Analytics
- Donation trends
- Donor demographics
- Endorsement ROI
- Project success correlation
- Retention metrics

---

### ═══════════════════════════════════════════════════════
### NOTIFICATION SYSTEM (Enhanced)
### ═══════════════════════════════════════════════════════

## Yatırımcı Notifications
- Project you invested in received NGO endorsement
- NGO you donated to posted new impact report
- Recurring donation processed successfully
- Tax document ready for download
- NGO invites you to exclusive event
- Investment opportunity alerts
- Distribution announcements
- Project update notifications
- Price alerts

## STK Notifications
- New project matching your expertise
- Donation received (real-time)
- Endorsement request from project creator
- Quarterly report deadline approaching
- Transparency score updated
- New donor milestone reached

## Karbon Sağlayıcı Notifications
- NGO endorsed your project
- Revenue share distributed to NGO
- NGO mentioned your project in report
- Endorsement level upgraded

## Admin Notifications
- New NGO application
- Unusual donation pattern detected
- NGO compliance issue
- High-value donation flagged
- NGO performance review due

## Common Notifications (All Roles)
- Real-time WebSocket notifications
- Push notifications (mobile)
- Email digests
- SMS for critical actions
- In-app notification center
- Deadline reminders

---

### ═══════════════════════════════════════════════════════
### SMART CONTRACT ARCHITECTURE
### ═══════════════════════════════════════════════════════

## New Contracts

### 1. NGORegistry.sol
```solidity
- registerNGO()
- approveNGO()
- suspendNGO()
- updateNGOProfile()
- getNGODetails()
```

### 2. EndorsementManager.sol
```solidity
- endorseProject(projectId, supportLevel, rationale)
- updateEndorsement()
- getProjectEndorsements()
- calculateEndorsementBonus()
```

### 3. DonationManager.sol
```solidity
- donateToNGO(ngoId, amount, donationType)
- setupRecurringDonation()
- cancelRecurring()
- claimDonation() // NGO claims
- mintDonationNFT()
- getDonorHistory()
```

### 4. RevenueShare.sol
```solidity
- setupRevenueShare(projectId, ngoId, percentage)
- distributeRevenue() // automated
- updateSharePercentage()
- getShareHistory()
```

## Updated Contracts

### 5. ProjectToken.sol (Enhanced)
```solidity
- Include endorsement data
- Revenue share logic
- Donation allocation tracking
```

### 6. InvestmentPool.sol (Enhanced)
```solidity
- Track NGO-endorsed projects
- Apply endorsement bonuses
- Handle combined invest+donate txs
```

---

### ═══════════════════════════════════════════════════════
### CARBON CREDIT TRACKING
### ═══════════════════════════════════════════════════════

- Real-time carbon offset calculator
- Project monitoring dashboard
- Verification updates
- Retirement tracking (when credits are used)
- Impact reporting (monthly/yearly)
- Certification renewals
- Compliance checks

---

### ═══════════════════════════════════════════════════════
### SECURITY & COMPLIANCE
### ═══════════════════════════════════════════════════════

## Security Features
- KYC/AML for investors (above threshold)
- Smart contract audits (CertiK, OpenZeppelin)
- Multi-sig treasury
- Rate limiting (prevent pump & dump)
- Whitelist/blacklist management
- Circuit breaker mechanism
- Insurance coverage (DeFi insurance protocols)
- Regular security audits
- Bug bounty program

## NGO Compliance
- 501(c)(3) verification (US)
- Dernekler Kanunu compliance (TR)
- GDPR compliance (EU donors)
- Financial transparency (annual audits)
- Anti-money laundering checks
- Sanctions screening (OFAC)

## Platform Compliance
- Securities regulations (if applicable)
- Carbon credit regulations (Verra, Gold Standard)
- Tax reporting (1099 for US donors, 5000 TL+ for TR)
- Data protection (encryption at rest & transit)
- Smart contract audits (mandatory)
- Regular penetration testing

## User Protection
- Donation refund policy (within 48hrs)
- Dispute resolution mechanism
- Whistleblower protection
- Privacy policy (clear opt-in/out)
- Terms of service (plain language)
- Cookie consent (GDPR)

---

### ═══════════════════════════════════════════════════════
### ANALYTICS & REPORTING
### ═══════════════════════════════════════════════════════

## Platform-Wide Analytics
- Real-time TVL (Total Value Locked)
- Total donations (lifetime)
- Active NGOs count
- Average endorsement level
- NGO-endorsed project success rate
- Donor retention rate
- Donation velocity
- Investment velocity
- Average investment size
- Investor demographics
- Carbon impact metrics
- Project performance rankings
- Market trends
- Whale tracking
- User behavior analytics
- Total impact (NGO-facilitated)

## Per NGO Analytics
- Endorsement accuracy score
- Donation conversion rate
- Donor satisfaction (NPS)
- Project success rate
- Average response time
- Transparency score trend
- Community engagement score

## Per Project Analytics
- Endorsement impact on funding speed
- NGO donor conversion
- Revenue share generated
- Combined invest+donate rate

---

### ═══════════════════════════════════════════════════════
### GAMIFICATION (Enhanced)
### ═══════════════════════════════════════════════════════

## Investor Achievements
- First Investment
- 🎗️ Generous Donor (first donation)
- Carbon Hero (1,000 tons offset)
- 💚 NGO Supporter (5+ NGOs)
- Diversified Investor (5+ projects)
- 🌟 Platinum Donor (1000+ CO2)
- Early Bird (invest in first 48hrs)
- 🔄 Recurring Hero (6+ months)
- Diamond Hands (hold 1+ year)
- 🤝 Partner Investor (invest + donate in one tx)

## NGO Achievements
- 🏆 Trusted Partner (10+ endorsements)
- ⚡ Quick Responder (24hr endorsement)
- 📈 Impact Champion (highest impact/project)
- 💎 Top Rated (4.8+ rating)
- 🌍 Global Reach (projects in 10+ countries)

## Features
- Leaderboard (top carbon offsetters, top NGOs)
- Referral rewards program
- NFT badges for milestones
- Community challenges
- Seasonal campaigns

---

### ═══════════════════════════════════════════════════════
### TECHNICAL STACK (Complete)
### ═══════════════════════════════════════════════════════

## Backend
- **Next.js 14** (App Router)
- **tRPC API** (type-safe)
- **Prisma ORM** + PostgreSQL
- **Redis** (caching, pubsub, sessions)
- **Socket.io** (real-time notifications)
- **Bull Queue** (job scheduling: recurring donations, reports, distributions)
- **AWS S3 / IPFS** (documents, NFT metadata)
- **SendGrid** (transactional emails)
- **Twilio** (SMS notifications)

## Blockchain
- **Wagmi v2** + **Viem** (Web3 interactions)
- **ethers.js v6** (fallback)
- **Hardhat** (smart contract development)
- **OpenZeppelin Contracts** (security standards)
- **Chainlink** (price feeds, automation for recurring donations)
- **The Graph** (indexing all transactions)
- **Tenderly** (monitoring, alerts, simulation)
- **Gnosis Safe** (multi-sig for NGOs)

## Frontend
- **React 18** + **TypeScript**
- **Zustand** (global state management)
- **TanStack Query** (server state, caching)
- **React Hook Form** + **Zod** (form validation)
- **Shadcn/ui** + **Tailwind CSS** (components + styling)
- **Framer Motion** (animations)
- **Recharts** + **D3.js** (data visualization)
- **RainbowKit** (wallet connection)
- **wagmi hooks** (blockchain reads/writes)
- **React-PDF** (tax documents)

## Infrastructure
- **Vercel** (deployment)
- **Railway / Supabase** (database hosting)
- **Alchemy / Infura** (RPC nodes)
- **IPFS / Arweave** (decentralized storage)
- **Sentry** (error tracking)
- **PostHog** (analytics)
- **Mixpanel** (event tracking)

## Monitoring & Security
- **Grafana** (metrics dashboard)
- **Prometheus** (time-series data)
- **Datadog** (APM - Application Performance Monitoring)
- **LogRocket** (session replay)
- **CertiK / OpenZeppelin** (smart contract audits)
- **Immunefi** (bug bounty platform)
- **Upstash** (rate limiting)
- **Cloudflare** (DDoS protection)
- **Persona / Sumsub** (KYC/AML)
- **Nexus Mutual** (DeFi insurance)

## Testing
- **Jest** + **React Testing Library** (unit/integration tests)
- **Playwright** (E2E testing)
- **Hardhat tests** (smart contract testing)
- **k6** (load testing)

---

### ═══════════════════════════════════════════════════════
### UI/UX REQUIREMENTS (Complete)
### ═══════════════════════════════════════════════════════

## Design Principles
- **Mobile-first** responsive design
- **PWA** (Progressive Web App) - offline support for dashboards
- **Dark/Light mode** (persisted user preference)
- **Accessibility**: WCAG 2.1 AA compliance
- **Keyboard navigation** support
- **Screen reader** optimized
- **Color-blind friendly** palettes
- **RTL support** (Arabic, Hebrew)
- **Multi-language**: EN, TR, ES, FR, DE, ZH, AR (i18n)

## Performance Features
- **Loading states** (skeleton screens, spinners)
- **Error boundaries** (graceful degradation)
- **Optimistic UI updates**
- **Infinite scroll** + **virtual scrolling** (large lists)
- **Toast notifications** (React Hot Toast)
- **Modal management** (Radix Dialog)
- **Form validation** (real-time + async)
- **File upload** (drag-drop, progress bars, preview)
- **Image optimization** (Next.js Image component)
- **Code splitting** (lazy loading)
- **Prefetching** (smart link prefetch)
- **Service Worker** (caching strategy)

## Performance Targets
- **Lighthouse Score**: 95+
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

---

### ═══════════════════════════════════════════════════════
### INTEGRATION POINTS
### ═══════════════════════════════════════════════════════

- **Carbon registries** (Verra, Gold Standard API)
- **Price oracles** (carbon credit market prices, Chainlink)
- **DeFi protocols** (yield farming options)
- **Social platforms** (Twitter, LinkedIn sharing)
- **Tax software** (CoinTracker, Koinly integration)
- **Portfolio trackers** (DeBank, Zapper)
- **Analytics tools** (Dune Analytics dashboards)
- **Payment gateways** (Stripe for fiat on-ramp)

---

### ═══════════════════════════════════════════════════════
### FUTURE ENHANCEMENTS
### ═══════════════════════════════════════════════════════

## Phase 2
- DAO governance (community voting on NGO approvals)
- Quadratic funding for NGOs
- NFT marketplace (donation proof trading)
- Cross-chain support (Polygon, Arbitrum, Optimism)
- Fiat on-ramp (credit card donations)
- Payroll giving (automated monthly from salary)

## Phase 3
- AI-powered project matching (donors to projects/NGOs)
- Carbon footprint calculator integration
- Corporate CSR dashboard (bulk donations, reporting)
- Impact bonds (performance-based returns)
- Metaverse presence (virtual NGO pavilions)
- Mobile app (React Native)

## Phase 4
- Satellite data integration (real-time project monitoring)
- IoT sensors (carbon measurement devices)
- Blockchain oracle for carbon credit verification
- Prediction markets (project success betting)
- Social impact tokens (reward engaged donors)

---

### ═══════════════════════════════════════════════════════
### DEVELOPMENT REQUIREMENTS
### ═══════════════════════════════════════════════════════

## Code Quality Standards
- **Type-safe**: Full TypeScript coverage
- **Well-documented**: JSDoc comments for all functions
- **Test coverage**: Minimum 80%
- **SEO-optimized**: Next.js metadata API
- **Performance-tuned**: Lighthouse 95+ score
- **Accessibility**: WCAG 2.1 AA compliant
- **Security**: Regular audits and penetration testing

## Architecture Patterns
- **Clean Architecture** (separation of concerns)
- **Repository Pattern** (data access layer)
- **Factory Pattern** (object creation)
- **Observer Pattern** (event-driven architecture)
- **Singleton Pattern** (shared services)

## Best Practices
- **SOLID principles**
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)
- **Error handling** (try-catch, error boundaries)
- **Logging** (structured logs with context)
- **Monitoring** (performance metrics, error tracking)

---

### ═══════════════════════════════════════════════════════
### DELIVERABLES
### ═══════════════════════════════════════════════════════

## 6 ROL İÇİN COMPLETE DASHBOARDS

1. **Super Admin** (platform oversight + NGO management)
2. **Karbon Kredisi Sağlayıcı** (project management + NGO collaboration + donation giving)
3. **Doğrulayıcı** (audit + NGO endorsement verification)
4. **Danışman** (coordination + NGO liaison)
5. **Yatırımcı** (investment + donation + portfolio + impact tracking)
6. **STK/NGO** (project endorsement + donation receiving + impact reporting + transparency)

## CORE FEATURES

### Workflow & Process Management
- Complete workflow state machine (7 stages)
- NGO registration & approval process
- Project endorsement system (4 support levels)
- Multi-stakeholder collaboration tools
- Document management system
- Automated notifications

### Financial Systems
- Dual donation mechanism (investor→NGO, provider→NGO)
- CO2 token investment flow
- Revenue sharing automation
- Multi-sig wallet management
- Reward distribution system
- Tax document generation

### Trust & Transparency
- NGO transparency scoring (0-100)
- Smart contract safeguards
- Blockchain transaction tracking
- Audit trail (immutable)
- Community oversight tools
- Dispute resolution

### Impact & Reporting
- Carbon credit tracking
- Impact visualization dashboards
- Donation NFT certificates
- Quarterly report automation
- Real-time metrics
- Portfolio management

### User Experience
- 6 role-specific dashboards
- Real-time notifications
- Advanced filtering & search
- Mobile PWA support
- Multi-language support (7 languages)
- Gamification & achievements
- Social proof & trust signals

### Technical Excellence
- 8 smart contracts (audited)
- Type-safe API (tRPC)
- Real-time communication (Socket.io)
- Decentralized storage (IPFS)
- Blockchain indexing (The Graph)
- Performance optimization
- Security compliance

---

## SYSTEM ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  Investor │ │ Provider │ │   NGO    │  + 3 more │
│  │Dashboard │ │Dashboard │ │Dashboard │   roles   │
│  └──────────┘ └──────────┘ └──────────┘           │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼─────────┐   ┌─────────▼────────┐
│   API (tRPC)     │   │   Smart Contracts │
│  ┌────────────┐  │   │  ┌─────────────┐ │
│  │ Auth       │  │   │  │ NGORegistry │ │
│  │ Projects   │  │   │  │ Endorsement │ │
│  │ Investments│  │   │  │ Donations   │ │
│  │ Donations  │  │   │  │ Investment  │ │
│  │ NGOs       │  │   │  │ Revenue     │ │
│  └────────────┘  │   │  └─────────────┘ │
└──────────────────┘   └──────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │                       │
┌────────▼─────────┐   ┌─────────▼────────┐
│  Database        │   │   Blockchain     │
│  (PostgreSQL)    │   │  (Ethereum/L2)   │
│  ┌────────────┐  │   │  ┌─────────────┐ │
│  │ Users      │  │   │  │ Transactions│ │
│  │ Projects   │  │   │  │ Tokens      │ │
│  │ NGOs       │  │   │  │ NFTs        │ │
│  │ Donations  │  │   │  │ Credits     │ │
│  └────────────┘  │   │  └─────────────┘ │
└──────────────────┘   └──────────────────┘
```

---

## FINAL NOTES

Bu kapsamlı sistem prompt'u kullanılarak geliştirilecek platform şunları sağlar:

✅ **Tam Ölçekli Blockchain Entegrasyonu**
✅ **6 Farklı Kullanıcı Rolü ve Dashboard'u**
✅ **STK Ekosistemi ve Endorsement Sistemi**
✅ **Çift Yönlü Bağış Mekanizması**
✅ **Karbon Kredisi Tracking ve Tokenization**
✅ **Multi-Layer Onay Süreci**
✅ **Real-time İletişim ve Bildirimler**
✅ **Transparency ve Trust Mekanizmaları**
✅ **Impact Reporting ve Analytics**
✅ **Production-Ready Security Standards**

---

**Son Güncelleme**: 2025
**Versiyon**: 1.0
**Lisans**: Proje Özel

---

## Katkıda Bulunanlar

Bu prompt, karbon kredisi platformu için kapsamlı bir geliştirme kılavuzu olarak hazırlanmıştır. Tüm teknik detaylar, best practices ve modern Web3 standartları dikkate alınarak oluşturulmuştur.

**Önemli**: Bu dokümandaki tüm özelliklerin implementasyonu sırasında:
- Smart contract güvenliği öncelikli olmalı
- Kullanıcı deneyimi sürekli test edilmeli
- Regulatory compliance kontrol edilmeli
- Performance metrics takip edilmeli
- Security audits düzenli yapılmalı

---

**İyi geliştirmeler! 🚀🌍💚**
