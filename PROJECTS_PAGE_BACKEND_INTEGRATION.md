# ProjectsPage Backend Integration - Quick Summary

**Date**: 1 Kasım 2025 - 19:22
**Status**: ✅ Backend READY, Frontend needs update

---

## ✅ Backend Completed

### New Endpoint Created
```
GET /api/projects
```

**Features**:
- Returns approved & active projects only
- Category filtering (renewable_energy, reforestation, etc.)
- Search filtering (title, description, location)
- Pagination support (limit & offset)

**Test**:
```bash
curl http://localhost:3002/api/projects
# Returns 4 projects:
# - 2x Solar Farm Expansion in Rural Kenya
# - 2x Wind Energy for Rural India
```

**Response Example**:
```json
{
  "success": true,
  "count": 4,
  "projects": [
    {
      "id": 9,
      "title": "Solar Farm Expansion in Rural Kenya",
      "description": "Installing 500 solar panels...",
      "category": "renewable_energy",
      "location": "Nakuru, Kenya",
      "co2_reduction_calculated": "14500.00",
      "funding_goal": "350000.00",
      "provider_name": "Carbon Provider Demo",
      "verified": 1,
      "workflow_stage": "approved",
      "status": "active"
    }
    // ... 3 more projects
  ]
}
```

---

## 🔄 Frontend Update Needed

**File**: `src/pages/ProjectsPage.tsx`

**Current Issue**: Uses hardcoded mock data (6 Turkish projects)
**Solution**: Fetch from `/api/projects` endpoint

### Quick Fix Options:

#### Option 1: Add Backend Fetching (Best)
Update ProjectsPage to fetch from API on mount:

```typescript
import { useAsyncOperation } from '../hooks/useAsyncOperation';
import { apiClient } from '../services/apiClient';

// Add state
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);

// Add fetch
const { execute: loadProjects } = useAsyncOperation(
  async () => {
    const response = await apiClient.get('/projects', false);
    if (response.success && response.data) {
      setProjects(response.data.projects);
    }
    setLoading(false);
  },
  { executeOnMount: true }
);
```

#### Option 2: Keep Mock Data + Add Backend Toggle
Add a toggle to switch between mock and real data for testing.

#### Option 3: Use NGOProjectDiscovery Component
This component already fetches from backend (`getPendingProjects`).
Could redirect `/projects` route to use this component instead.

---

## 📝 Frontend API Integration Guide

### 1. Create Projects API Service

**File**: `src/services/api/projectsApi.ts` (NEW)

```typescript
import { apiClient, ApiResponse } from '../apiClient';

export interface PublicProject {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  co2_reduction_calculated: number;
  funding_goal: number;
  current_funding: number;
  provider_name: string;
  verified: boolean;
  status: string;
  workflow_stage: string;
  start_date: string;
  end_date: string;
  progress: number;
}

export async function getPublicProjects(filters?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<{ projects: PublicProject[]; count: number }>> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/projects${queryString}`, false);
}
```

### 2. Update ProjectsPage.tsx

Replace mock data section with:

```typescript
import { getPublicProjects, PublicProject } from '../services/api/projectsApi';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

// Replace const projects = [...] with:
const [projects, setProjects] = useState<PublicProject[]>([]);

// Add loading hook
const {
  execute: loadProjects,
  loading,
  error
} = useAsyncOperation(
  async () => {
    const response = await getPublicProjects({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      search: searchTerm || undefined
    });
    if (response.success && response.data) {
      setProjects(response.data.projects);
    }
  },
  { executeOnMount: true }
);

// Reload when filters change
useEffect(() => {
  loadProjects();
}, [selectedCategory, searchTerm]);
```

### 3. Add Loading State

```typescript
{loading && (
  <div className="text-center py-12">
    <Loader className="w-12 h-12 animate-spin mx-auto text-emerald-600" />
    <p className="mt-4 text-gray-600">Projeler yükleniyor...</p>
  </div>
)}

{error && (
  <div className="text-center py-12 text-red-600">
    <AlertCircle className="w-12 h-12 mx-auto" />
    <p className="mt-4">Projeler yüklenirken hata oluştu</p>
  </div>
)}
```

---

## 🎯 Category Mapping

**Frontend Categories** → **Backend Categories**:
```
'forest' → 'reforestation'
'renewable' → 'renewable_energy'
'water' → 'clean_water' (need to add projects)
'agriculture' → 'sustainable_agriculture' (need to add projects)
```

**Current Backend Projects**:
- renewable_energy: 4 projects ✅
- reforestation: 0 projects (pending/under_verification only)

**Action Needed**: Approve some reforestation projects too

---

## 🐛 Known Issues & Fixes

### Issue 1: Category Names Don't Match
**Problem**: Frontend uses 'forest', backend uses 'reforestation'
**Fix**: Map categories in frontend before sending to API

### Issue 2: Missing Image URLs
**Problem**: Backend projects have `image_url: null`
**Fix**: Add default images or use placeholder service

### Issue 3: Progress Field
**Problem**: Backend has `progress: 0` for all projects
**Fix**: Calculate progress from `current_funding / funding_goal * 100`

---

## ✅ Testing Checklist

Backend:
- [x] `/api/projects` endpoint created
- [x] Returns approved projects only
- [x] Category filtering works
- [x] Search filtering works
- [x] 4 test projects approved

Frontend (TODO):
- [ ] Create `projectsApi.ts` service
- [ ] Update `ProjectsPage.tsx` to use API
- [ ] Add loading state
- [ ] Add error handling
- [ ] Map categories correctly
- [ ] Handle empty results
- [ ] Test filtering
- [ ] Test search

---

## 🚀 Quick Test After Frontend Update

```bash
# 1. Open browser
http://localhost:5173/projects

# 2. Should see:
# - 4 projects loading from backend
# - Solar Farm Expansion (2x)
# - Wind Energy (2x)
# - Real data (not mock Turkish projects)

# 3. Test filters:
# - Category: "Yenilenebilir Enerji" → Should show all 4
# - Category: "Orman Koruma" → Should show 0
# - Search: "Kenya" → Should show 2
# - Search: "India" → Should show 2
```

---

**Status**: Ready for frontend integration!
**Next**: Update ProjectsPage.tsx with backend fetching
