# 🚀 DECARBONIZE.world - Local Test Guide

**Created**: 31 Ekim 2025
**Status**: Phase 2.5 Complete - Ready for Local Testing

---

## 📍 LOCAL ADDRESSES

### **Frontend (React + Vite)**
```
✅ RUNNING
URL: http://localhost:5173
Status: Active & Hot Reloading
```

### **Backend (Node.js + Express)**
```
⚠️ NEEDS CONFIGURATION
URL: http://localhost:3002/api
Status: Module import issues - see fixes below
```

---

## 🎯 WHAT TO TEST

### **Phase 2.4: Enhanced Project Detail Page**
```
URL: http://localhost:5173/projects/:projectId
Example: http://localhost:5173/projects/1

Features to Test:
✅ 5-Tab Navigation (Overview, Financials, Verification, Updates, Investment)
✅ Live Impact Counter (real-time animations)
✅ Impact Calculator (investment amount → CO₂ + returns)
✅ Before/After Slider (drag to compare images)
✅ 3-Step Investment Flow (Calculate → Review → Confirm)
✅ Social Proof Indicators (investor count, ratings)
✅ Project Badges (verified, trending, high_impact)
```

### **Phase 2.5: Comparison & Advanced Filters**
```
Comparison Tool:
- Open ProjectsPage: http://localhost:5173/projects
- Select "Compare Projects" button (need to add to UI)
- Or test directly in component

Advanced Filters:
- Open ProjectsPage: http://localhost:5173/projects
- Click "Filtreler" button
- Test 15+ filter options
- Save/Load filter presets
- Export/Import filters
```

### **Admin Panel - Filter/Comparison Settings**
```
URL: http://localhost:5173/admin/filter-comparison
Login Required: Admin/Superadmin role

Features to Test:
✅ Filter Management (enable/disable, required fields)
✅ Comparison Field Configuration
✅ Backup & Restore (Export/Import JSON)
✅ Tab Navigation (Filters, Comparison, Backup)
```

---

## 🔧 QUICK START

### **1. Start Frontend (Already Running)**
```bash
# Frontend is already running on port 5173
# If not, run:
cd D:\decarbonize
npm run dev
```

### **2. Access Application**
```
Open Browser: http://localhost:5173
```

### **3. Demo Accounts (for testing)**
```
Admin Account:
- Email: admin@decarbonize.com
- Password: admin123

User Account:
- Email: user@decarbonize.com
- Password: user123

(These are using Supabase auth - check DEMO_ACCOUNTS.md for full list)
```

---

## 🎨 TESTING SCENARIOS

### **Scenario 1: Investor Journey - Project Discovery**
```
1. Go to: http://localhost:5173/projects
2. Browse project cards
3. Click on a project → Opens ProjectDetailEnhanced
4. Explore all 5 tabs
5. Use Impact Calculator (try different amounts)
6. Test investment flow (3 steps)
```

### **Scenario 2: Advanced Filtering**
```
1. Go to: http://localhost:5173/projects
2. Click "Filtreler" button
3. Apply filters:
   - Category: Renewable Energy
   - Min Investment: $1000
   - Risk Level: Low
4. Save as preset "My Favorite Filters"
5. Export filters to JSON
6. Clear filters
7. Import filters back
```

### **Scenario 3: Project Comparison**
```
1. Go to: http://localhost:5173/projects
2. Select 2-3 projects for comparison
3. Open comparison tool
4. Compare metrics across categories:
   - Basic Info
   - Financial Performance
   - Environmental Impact
   - Risk Assessment
   - Verification Status
5. Export comparison as JSON
6. Share comparison URL
```

### **Scenario 4: Admin Configuration**
```
1. Login as admin
2. Go to: http://localhost:5173/admin/filter-comparison
3. Filter Settings Tab:
   - Enable/Disable filters
   - Mark filters as required
   - Add new filter
4. Comparison Settings Tab:
   - Enable/Disable comparison fields
   - Add new comparison field
5. Backup Tab:
   - Export all settings
   - Import settings from JSON
   - Reset to defaults
```

---

## 🐛 KNOWN ISSUES & WORKAROUNDS

### **Issue 1: Backend Not Running**
```
Problem: Backend API not accessible
Impact: 2FA, real-time data syncing not working
Workaround: Frontend falls back to Supabase auth
Status: Module import issues in backend (see below)
```

### **Issue 2: Project Data Mock**
```
Problem: Enhanced project data is mocked (not from real API)
Impact: Some tabs may show incomplete data
Workaround: Using base Project type cast to EnhancedProject
Fix: Integrate real backend API for full project data
```

### **Issue 3: Sentry Warnings**
```
Problem: Sentry deprecated API warnings in console
Impact: None - just warnings, error tracking still works
Workaround: DSN not configured, so Sentry disabled in dev
Status: Will update to Sentry v8 API later
```

---

## 🔨 BACKEND FIXES NEEDED

### **Fix Module Import Issues**
```bash
cd D:\decarbonize\backend

# The backend has ES module import issues
# Quick fix: Update tsconfig.json
```

**backend/tsconfig.json** - Update:
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    // ... rest of config
  }
}
```

**OR** - Use CommonJS for now:
```bash
# Remove .js extensions from imports
# Or change package.json type to commonjs
```

---

## 📊 COMPONENT TESTING CHECKLIST

### **ProjectDetailEnhanced**
- [ ] Page loads without errors
- [ ] All 5 tabs render correctly
- [ ] Tab switching works smoothly
- [ ] Live counter animates
- [ ] Impact calculator computes correctly
- [ ] Before/After slider draggable
- [ ] Investment flow 3 steps work
- [ ] Back button returns to projects
- [ ] Share button copies URL
- [ ] Like button toggles state

### **AdvancedFilters**
- [ ] Filter panel opens/closes
- [ ] All filter categories expand
- [ ] Filters apply to project list
- [ ] Preset save works
- [ ] Preset load works
- [ ] Export downloads JSON
- [ ] Import loads JSON correctly
- [ ] Active filter count badge shows
- [ ] Reset clears all filters
- [ ] Sorting changes order

### **ProjectComparison**
- [ ] Comparison modal opens
- [ ] Can add up to 3 projects
- [ ] Can remove projects
- [ ] All categories display
- [ ] Expand/collapse works
- [ ] Values format correctly
- [ ] Export downloads comparison
- [ ] Share copies URL
- [ ] Modal closes properly

### **FilterComparisonSettings (Admin)**
- [ ] Page loads (admin only)
- [ ] Tab switching works
- [ ] Filter table displays
- [ ] Enable/disable toggles work
- [ ] Required checkbox works
- [ ] Add new filter works
- [ ] Delete filter works
- [ ] Comparison fields manage
- [ ] Backup export works
- [ ] Backup import works
- [ ] Reset to defaults works

---

## 🎯 PERFORMANCE TESTING

### **Build Performance**
```
✅ Build Status: PASSING
✅ Modules: 3036 transformed
✅ Build Time: ~4.5s
✅ Bundle Size: ~1.2MB (gzipped)
✅ Chunks: 85 files
```

### **Runtime Performance**
```
Test in Browser DevTools:
1. Open http://localhost:5173
2. F12 → Performance tab
3. Record page load
4. Check metrics:
   - First Contentful Paint (FCP): < 1.5s
   - Time to Interactive (TTI): < 3s
   - Largest Contentful Paint (LCP): < 2.5s
```

---

## 📱 MOBILE TESTING

### **Responsive Design Test**
```
Chrome DevTools → Device Toolbar (Ctrl+Shift+M)

Test Devices:
- iPhone 12 Pro (390x844)
- iPad Pro (1024x1366)
- Samsung Galaxy S20 (360x800)

Check:
✅ Project cards responsive
✅ Tabs scrollable on mobile
✅ Filters accessible
✅ Comparison readable
✅ Forms usable
```

---

## 🌐 BROWSER COMPATIBILITY

### **Supported Browsers**
```
✅ Chrome 90+ (Primary)
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

Known Issues:
⚠️ IE11: Not supported (uses ES6+)
⚠️ Safari < 14: Some CSS features missing
```

---

## 📸 SCREENSHOTS FOR TESTING

### **Capture These Views**
```
1. Projects List with Filters Open
2. Project Detail - Overview Tab
3. Project Detail - Investment Tab (Step 2)
4. Comparison Tool (3 projects)
5. Admin Filter Settings
6. Mobile View - Project Detail
```

---

## 🔐 SECURITY TESTING

### **XSS Prevention**
```
Test in Browser Console:
1. Try injecting HTML in project title
2. Check if sanitizer blocks script tags
3. Verify dangerouslySetInnerHTML removed

Expected: All HTML sanitized via DOMPurify
```

### **Auth Flow**
```
1. Logout → Should redirect to login
2. Try accessing /admin → Should block non-admin
3. Try accessing /admin/filter-comparison → Should block non-admin
4. Login as user → Should redirect to /dashboard
5. Login as admin → Should access admin pages
```

---

## 📝 FEEDBACK COLLECTION

### **While Testing, Note:**
```
✅ What works well?
⚠️ What's confusing?
🐛 Any bugs found?
💡 Feature suggestions?
⏱️ Performance issues?
📱 Mobile UX problems?
```

---

## 🚀 NEXT STEPS AFTER TESTING

1. ✅ Fix any critical bugs found
2. ✅ Optimize slow components
3. ✅ Improve mobile UX if needed
4. ✅ Add unit tests for calculators
5. ✅ Integrate real backend API
6. ✅ Deploy to staging environment

---

## 📞 SUPPORT

**Issues Found?**
- Create issue on GitHub
- Document steps to reproduce
- Include browser/OS info
- Attach screenshots

**Quick Help:**
```
Restart Frontend: Ctrl+C → npm run dev
Clear Cache: Ctrl+Shift+Delete (browser)
Reset State: Clear localStorage in DevTools
```

---

**Happy Testing! 🎉**

**Pro Tip:** Use React DevTools extension to inspect component state and props while testing!
