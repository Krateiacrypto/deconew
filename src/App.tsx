import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SupabaseProvider } from './components/providers/SupabaseProvider';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthStore } from './store/authStore';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TradingPage = lazy(() => import('./pages/TradingPage').then(m => ({ default: m.TradingPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPageNew').then(m => ({ default: m.ProjectsPage })));
const ICOPage = lazy(() => import('./pages/ICOPage').then(m => ({ default: m.ICOPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const WhitepaperPage = lazy(() => import('./pages/WhitepaperPage').then(m => ({ default: m.WhitepaperPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const AdvisorPage = lazy(() => import('./pages/AdvisorPage').then(m => ({ default: m.AdvisorPage })));
const WalletPage = lazy(() => import('./pages/WalletPage').then(m => ({ default: m.WalletPage })));
const KYCPage = lazy(() => import('./pages/KYCPage').then(m => ({ default: m.KYCPage })));
const StakingPage = lazy(() => import('./pages/StakingPage').then(m => ({ default: m.StakingPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const SuperAdminDashboard = lazy(() => import('./pages/admin/SuperAdminDashboard').then(m => ({ default: m.SuperAdminDashboard })));
const UserProfiles = lazy(() => import('./pages/admin/UserProfiles').then(m => ({ default: m.UserProfiles })));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard').then(m => ({ default: m.UserDashboard })));
const AdvisorDashboard = lazy(() => import('./pages/advisor/AdvisorDashboard').then(m => ({ default: m.AdvisorDashboard })));
const VerificationDashboard = lazy(() => import('./pages/verification/VerificationDashboard').then(m => ({ default: m.VerificationDashboard })));
const NGODashboard = lazy(() => import('./pages/ngo/NGODashboard').then(m => ({ default: m.NGODashboard })));
const ProviderDashboard = lazy(() => import('./pages/provider/ProviderDashboard').then(m => ({ default: m.ProviderDashboard })));
const KYCManagement = lazy(() => import('./pages/admin/KYCManagement').then(m => ({ default: m.KYCManagement })));
const ProjectManagement = lazy(() => import('./pages/admin/ProjectManagement').then(m => ({ default: m.ProjectManagement })));
const UserManagement = lazy(() => import('./pages/admin/UserManagement').then(m => ({ default: m.UserManagement })));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings').then(m => ({ default: m.SystemSettings })));
const ContentManagement = lazy(() => import('./pages/admin/ContentManagement').then(m => ({ default: m.ContentManagement })));
const VisualEditor = lazy(() => import('./pages/admin/VisualEditor').then(m => ({ default: m.VisualEditor })));
const FilterComparisonSettings = lazy(() => import('./pages/admin/FilterComparisonSettings'));
const ProjectDetailEnhanced = lazy(() => import('./pages/ProjectDetailEnhanced'));
const CarbonCalculatorPage = lazy(() => import('./pages/CarbonCalculatorPage'));
const CarbonDashboardPage = lazy(() => import('./pages/CarbonDashboardPage'));
const PortfolioDashboardPage = lazy(() => import('./pages/PortfolioDashboardPage'));
const NGOProjectDiscoveryPage = lazy(() => import('./pages/ngo/NGOProjectDiscoveryPage'));
const NGOEndorsementPage = lazy(() => import('./pages/ngo/NGOEndorsementPage'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

// Dashboard Router Component
const DashboardRouter: React.FC = () => {
  const { user } = useAuthStore();

  switch (user?.role) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'admin':
    case 'web_admin':
      return <AdminDashboard />;
    case 'advisor':
      return <AdvisorDashboard />;
    case 'verifier':
      return <VerificationDashboard />;
    case 'ngo':
      return <NGODashboard />;
    case 'carbon_provider':
      return <ProviderDashboard />;
    case 'institutional_investor':
    case 'pro_investor':
    case 'free_investor':
    case 'user':
    default:
      return <UserDashboard />;
  }
};

function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession().catch(err => {
      console.error('Initial session check failed:', err);
    });
  }, [checkSession]);

  return (
    <SupabaseProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />

            <Header />
            <main className="pt-20">
              <Suspense fallback={<LoadingFallback />}>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/carbon-dashboard" element={<CarbonDashboardPage />} />
              <Route path="/investment-portfolio" element={<PortfolioDashboardPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailEnhanced />} />
              <Route path="/trading" element={<TradingPage />} />
              <Route path="/ico" element={<ICOPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/whitepaper" element={<WhitepaperPage />} />
              <Route path="/carbon-calculator" element={<CarbonCalculatorPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/portfolio" 
                element={
                  <ProtectedRoute allowedRoles={['user', 'advisor', 'admin', 'superadmin']}>
                    <PortfolioPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <ProtectedRoute>
                    <WalletPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/advisor" 
                element={
                  <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                    <AdvisorPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/kyc" 
                element={
                  <ProtectedRoute>
                    <KYCPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staking" 
                element={
                  <ProtectedRoute allowedRoles={['user', 'advisor', 'admin', 'superadmin']}>
                    <StakingPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/profiles" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <UserProfiles />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/kyc" 
                element={
                  <ProtectedRoute requiredPermission="users.edit">
                    <KYCManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/projects" 
                element={
                  <ProtectedRoute requiredPermission="projects.approve">
                    <ProjectManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredPermission="users.view">
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requiredPermission="system.settings">
                    <SystemSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/content" 
                element={
                  <ProtectedRoute requiredPermission="content.edit">
                    <ContentManagement />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin/editor"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <VisualEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/filter-comparison"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <FilterComparisonSettings />
                  </ProtectedRoute>
                }
              />

              {/* NGO Routes */}
              <Route
                path="/ngo/discovery"
                element={
                  <ProtectedRoute allowedRoles={['ngo']}>
                    <NGOProjectDiscoveryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/endorse/:projectId"
                element={
                  <ProtectedRoute allowedRoles={['ngo']}>
                    <NGOEndorsementPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </SupabaseProvider>
  );
}

export default App;