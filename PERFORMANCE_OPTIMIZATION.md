# 🚀 Performance Optimization Guide

**Last Updated**: 7 Kasım 2025 (Night - 03:30 AM)
**Version**: 1.0.0
**Status**: Phase 3.9 - Complete

---

## 📊 Bundle Size Analysis

### Current Configuration

**Vite Config Optimizations:**
```typescript
// vite.config.ts
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
  'vendor-charts': ['recharts', 'chart.js', 'react-chartjs-2', 'react-countup'],
  'vendor-blockchain': ['ethers'],
  'vendor-ui': ['framer-motion', '@headlessui/react', 'react-hot-toast'],
  'vendor-forms': ['react-hook-form', 'zustand'],
}
```

### Bundle Visualization

Run the following command to analyze bundle size:
```bash
npm run build
```

Then open `dist/stats.html` in your browser to see the visual breakdown.

**Expected Bundle Sizes (gzipped):**
- Main bundle: ~200-300 KB
- vendor-react: ~150-200 KB
- vendor-charts: ~100-150 KB (largest due to Chart.js)
- vendor-blockchain: ~150-200 KB (ethers.js is large)
- vendor-ui: ~80-100 KB
- vendor-supabase: ~50-80 KB
- vendor-forms: ~30-50 KB

---

## ⚡ Code Splitting & Lazy Loading

### Current Implementation

✅ **All routes are lazy-loaded** via `React.lazy()`:
```typescript
const HomePage = lazy(() => import('./pages/HomePage'));
const CarbonDashboardPage = lazy(() => import('./pages/CarbonDashboardPage'));
const PortfolioDashboardPage = lazy(() => import('./pages/PortfolioDashboardPage'));
// ... 40+ routes
```

✅ **Suspense boundaries** with loading fallbacks
✅ **Route-based code splitting** - Each page is a separate chunk

### Recommendations

1. ✅ Already Implemented:
   - All major routes lazy-loaded
   - Vendor dependencies chunked separately
   - Loading fallback UI

2. 🔄 Future Improvements:
   - Consider lazy loading heavy modals/dialogs
   - Lazy load Chart.js components only when needed
   - Implement intersection observer for below-the-fold content

---

## 🎨 Component Optimization

### React.memo Usage

The following components have been wrapped with `React.memo()` to prevent unnecessary re-renders:

#### Dashboard Components
- ✅ `CarbonDashboard` - Heavy data processing and multiple charts
- ✅ `PortfolioDashboard` - Multiple sub-components and charts
- ✅ `AdvancedCalculator` - Complex state management

#### Chart Components
- ✅ `InvestmentPerformanceChart` - Expensive Chart.js rendering
- ✅ `AssetAllocationChart` - Doughnut chart with calculations
- ✅ `CarbonImpactChart` - Line chart with data processing

#### Input Components
- ✅ `CategoryInputs` - Multiple input fields and state updates
- ✅ `CalculatorModeSelector` - Frequent parent re-renders

#### List Components
- ✅ `InvestmentsList` - Large table with sorting/filtering
- ✅ `ProjectRecommendations` - Multiple project cards

### useMemo Optimization

Used for expensive calculations:
```typescript
// Example: Portfolio calculations
const totalValue = useMemo(() => {
  return investments.reduce((sum, inv) => sum + inv.currentValue, 0);
}, [investments]);

// Example: Chart data
const chartData = useMemo(() => {
  return processChartData(rawData);
}, [rawData]);
```

### useCallback Optimization

Used for callback functions passed to child components:
```typescript
const handleProjectClick = useCallback((projectId: number) => {
  navigate(`/projects/${projectId}`);
}, [navigate]);
```

---

## 🖼️ Image Optimization

### Best Practices

1. **Use WebP format** with fallbacks:
   ```html
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="Description">
   </picture>
   ```

2. **Lazy load images** below the fold:
   ```html
   <img loading="lazy" src="image.jpg" alt="Description">
   ```

3. **Responsive images** with srcset:
   ```html
   <img
     srcset="image-320w.jpg 320w, image-640w.jpg 640w, image-1280w.jpg 1280w"
     sizes="(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px"
     src="image-640w.jpg"
     alt="Description"
   />
   ```

4. **Optimize image size**:
   - Use tools like TinyPNG, ImageOptim
   - Target: < 100 KB per image
   - Use CDN for faster delivery

### Icon Optimization

✅ Currently using emoji icons (zero bundle size)
- Consider switching to icon library only for specific needs
- If using icon library, use tree-shaking compatible library (lucide-react)

---

## 🔄 State Management Optimization

### Zustand Store Best Practices

1. **Slice stores** by domain:
   ```typescript
   // ✅ Good: Separate stores
   useAuthStore()
   useCartStore()
   useNotificationStore()

   // ❌ Bad: One giant store
   useAppStore()
   ```

2. **Use selectors** to prevent unnecessary re-renders:
   ```typescript
   // ✅ Good: Select only what you need
   const user = useAuthStore((state) => state.user);

   // ❌ Bad: Select entire store
   const { user, isLoading, error } = useAuthStore();
   ```

3. **Persist only essential data**:
   - Don't persist large datasets
   - Use sessionStorage for temporary data

---

## 🌐 Network Optimization

### API Calls

1. **Use React Query / SWR** for data fetching (Future improvement):
   - Automatic caching
   - Background refetching
   - Request deduplication

2. **Implement pagination**:
   ```typescript
   // ✅ Load data in chunks
   const { data, hasMore } = useInfiniteQuery({
     queryKey: ['projects'],
     queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),
   });
   ```

3. **Debounce search inputs**:
   ```typescript
   const debouncedSearch = useMemo(
     () => debounce((value: string) => {
       performSearch(value);
     }, 300),
     []
   );
   ```

---

## 📱 Lighthouse Performance Metrics

### Target Scores

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Performance | > 90 | TBD | ⏳ |
| Accessibility | > 90 | TBD | ⏳ |
| Best Practices | > 90 | TBD | ⏳ |
| SEO | > 90 | TBD | ⏳ |

### Core Web Vitals

| Metric | Target | Description |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Page loading performance |
| FID (First Input Delay) | < 100ms | Interactivity |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |

### Run Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5173 --view

# Or use Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Click "Analyze page load"
```

---

## 🎯 Performance Monitoring

### Recommended Tools

1. **Web Vitals** - Monitor real user metrics:
   ```typescript
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

2. **React DevTools Profiler**:
   - Identify slow components
   - Find unnecessary re-renders
   - Measure component render time

3. **Bundle Analysis**:
   - Run `npm run build` regularly
   - Check `dist/stats.html`
   - Monitor bundle size growth

---

## ✅ Optimization Checklist

### Code-Level

- [x] Lazy load routes
- [x] Manual chunk splitting
- [x] React.memo on heavy components
- [x] useMemo for expensive calculations
- [x] useCallback for callbacks
- [x] Tree-shakeable imports
- [ ] Dynamic imports for heavy libraries
- [ ] Web Workers for heavy computations

### Assets

- [ ] Image optimization (WebP, lazy loading)
- [ ] Font subsetting
- [ ] SVG optimization
- [ ] Asset compression (gzip/brotli)
- [ ] CDN integration

### Network

- [ ] API response caching
- [ ] Request deduplication
- [ ] GraphQL/REST optimization
- [ ] Service Workers for offline support
- [ ] HTTP/2 or HTTP/3

### Rendering

- [x] Code splitting by route
- [x] Lazy component loading
- [ ] Virtualized lists (react-window)
- [ ] Intersection Observer for lazy content
- [ ] CSS-in-JS optimization

---

## 🚀 Quick Wins (Immediate Impact)

1. ✅ **Vendor chunk splitting** - Already configured
2. ✅ **Lazy route loading** - Already implemented
3. ✅ **React.memo on charts** - Implemented in Phase 3.9
4. ⏳ **Image optimization** - TODO
5. ⏳ **API caching layer** - TODO
6. ⏳ **Lighthouse audit** - TODO

---

## 📖 Additional Resources

- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)

---

**Note**: Performance is an ongoing process. Run regular audits and monitor metrics after each major release.
