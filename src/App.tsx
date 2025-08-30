import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TradingPage } from './pages/TradingPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ICOPage } from './pages/ICOPage';
import { AboutPage } from './pages/AboutPage';
import { WhitepaperPage } from './pages/WhitepaperPage';
import { BlogPage } from './pages/BlogPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AdvisorPage } from './pages/AdvisorPage';
import { WalletPage } from './pages/WalletPage';
import { KYCPage } from './pages/KYCPage';
import { StakingPage } from './pages/StakingPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';
import { UserProfiles } from './pages/admin/UserProfiles';
import { UserDashboard } from './pages/user/UserDashboard';
import { AdvisorDashboard } from './pages/advisor/AdvisorDashboard';
import { VerificationDashboard } from './pages/verification/VerificationDashboard';
import { NGODashboard } from './pages/ngo/NGODashboard';
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { KYCManagement } from './pages/admin/KYCManagement';
import { ProjectManagement } from './pages/admin/ProjectManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { SystemSettings } from './pages/admin/SystemSettings';
import { ContentManagement } from './pages/admin/ContentManagement';
import { VisualEditor } from './pages/admin/VisualEditor';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';

// Dashboard Router Component
const DashboardRouter: React.FC = () => {
  const { user } = useAuthStore();
  
  switch (user?.role) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'advisor':
      return <AdvisorDashboard />;
    case 'verification_org':
      return <VerificationDashboard />;
    case 'ngo':
      return <NGODashboard />;
    case 'carbon_provider':
      return <ProviderDashboard />;
    default:
      return <UserDashboard />;
  }
};

function App() {
  return (
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
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/trading" element={<TradingPage />} />
            <Route path="/ico" element={<ICOPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/whitepaper" element={<WhitepaperPage />} />
            
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
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                  <AdminDashboard />
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
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;