import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Briefcase, TrendingUp, Wallet, Settings, LogOut, Menu, X, Users, FileCheck, Award, Building2, CircleUser as UserCircle, Bell, Search, ChevronDown } from 'lucide-react';
import { getRoleDisplayName } from '../../utils/permissions';
import { getInvestorTierLimits } from '../../utils/permissionHelpers';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
  badge?: string | number;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavItems = (): NavItem[] => {
    const commonItems: NavItem[] = [
      {
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/dashboard',
      },
    ];

    // Role-specific navigation
    const roleSpecificItems: Record<string, NavItem[]> = {
      superadmin: [
        { label: 'System Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'User Management', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
        { label: 'Projects', icon: <Briefcase className="w-5 h-5" />, path: '/admin/projects' },
        { label: 'KYC Management', icon: <FileCheck className="w-5 h-5" />, path: '/admin/kyc' },
        { label: 'Content', icon: <FileCheck className="w-5 h-5" />, path: '/admin/content' },
        { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
      ],
      admin: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
        { label: 'Projects', icon: <Briefcase className="w-5 h-5" />, path: '/admin/projects' },
        { label: 'KYC Review', icon: <FileCheck className="w-5 h-5" />, path: '/admin/kyc' },
        { label: 'Content', icon: <FileCheck className="w-5 h-5" />, path: '/admin/content' },
      ],
      web_admin: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'Content', icon: <FileCheck className="w-5 h-5" />, path: '/admin/content' },
        { label: 'Blog', icon: <FileCheck className="w-5 h-5" />, path: '/blog' },
      ],
      carbon_provider: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'My Projects', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard/provider/projects' },
        { label: 'New Project', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard/provider/projects/new' },
        { label: 'Analytics', icon: <TrendingUp className="w-5 h-5" />, path: '/dashboard/provider/analytics' },
      ],
      verifier: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'Verification Queue', icon: <FileCheck className="w-5 h-5" />, path: '/dashboard/verifier/queue' },
        { label: 'Certificates', icon: <Award className="w-5 h-5" />, path: '/dashboard/verifier/certificates' },
      ],
      advisor: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'Clients', icon: <Users className="w-5 h-5" />, path: '/dashboard/advisor/clients' },
        { label: 'Recommendations', icon: <TrendingUp className="w-5 h-5" />, path: '/dashboard/advisor/recommendations' },
        { label: 'Analytics', icon: <TrendingUp className="w-5 h-5" />, path: '/dashboard/advisor/analytics' },
      ],
      ngo: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'Projects', icon: <Briefcase className="w-5 h-5" />, path: '/projects' },
      ],
      institutional_investor: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'Portfolio', icon: <Briefcase className="w-5 h-5" />, path: '/portfolio' },
        { label: 'Trading', icon: <TrendingUp className="w-5 h-5" />, path: '/trading', badge: 'PRO' },
        { label: 'Wallet', icon: <Wallet className="w-5 h-5" />, path: '/wallet' },
        { label: 'Staking', icon: <Award className="w-5 h-5" />, path: '/staking' },
        { label: 'Projects', icon: <Briefcase className="w-5 h-5" />, path: '/projects' },
      ],
      pro_investor: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'Portfolio', icon: <Briefcase className="w-5 h-5" />, path: '/portfolio' },
        { label: 'Trading', icon: <TrendingUp className="w-5 h-5" />, path: '/trading', badge: 'PRO' },
        { label: 'Wallet', icon: <Wallet className="w-5 h-5" />, path: '/wallet' },
        { label: 'Staking', icon: <Award className="w-5 h-5" />, path: '/staking' },
        { label: 'Projects', icon: <Briefcase className="w-5 h-5" />, path: '/projects' },
      ],
      free_investor: [
        { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { label: 'Portfolio', icon: <Briefcase className="w-5 h-5" />, path: '/portfolio' },
        { label: 'Trading', icon: <TrendingUp className="w-5 h-5" />, path: '/trading' },
        { label: 'Wallet', icon: <Wallet className="w-5 h-5" />, path: '/wallet' },
        { label: 'Projects', icon: <Briefcase className="w-5 h-5" />, path: '/projects' },
      ],
    };

    return roleSpecificItems[user?.role || 'free_investor'] || commonItems;
  };

  const navItems = getNavItems();
  const tierLimits = user?.investorTier ? getInvestorTierLimits(user.investorTier) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center ml-4 lg:ml-0">
                <img src="/logo.png" alt="DECARBONIZE" className="h-8 w-auto" />
                <span className="ml-2 text-xl font-bold text-emerald-600">DECARBONIZE</span>
              </Link>

              {/* Search Bar (Desktop) */}
              <div className="hidden lg:block ml-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search projects, transactions..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-80"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Tier Badge */}
              {user?.investorTier && (
                <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white text-sm font-medium">
                  {user.investorTier.toUpperCase()} TIER
                </div>
              )}

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role || 'user')}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    {user?.kycStatus !== 'approved' && (
                      <Link
                        to="/kyc"
                        className="block px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        Complete KYC
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 pt-16
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="h-full overflow-y-auto py-4">
          {/* Tier Info Card */}
          {tierLimits && user?.investorTier && (
            <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {user.investorTier.charAt(0).toUpperCase() + user.investorTier.slice(1)} Tier
              </h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Trading Fee:</span>
                  <span className="font-medium">{(tierLimits.tradingFee * 100).toFixed(2)}%</span>
                </div>
                {tierLimits.monthlyLimit && (
                  <div className="flex justify-between">
                    <span>Monthly Limit:</span>
                    <span className="font-medium">${tierLimits.monthlyLimit.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Staking Bonus:</span>
                  <span className="font-medium">{tierLimits.stakingMultiplier}x</span>
                </div>
              </div>
              {user.investorTier !== 'institutional' && (
                <button className="mt-3 w-full text-xs bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors">
                  Upgrade Tier
                </button>
              )}
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1 px-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* KYC Status */}
          {user && user.kycStatus !== 'approved' && (
            <div className="mx-4 mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="text-sm font-semibold text-orange-800 mb-1">KYC Pending</h4>
              <p className="text-xs text-orange-600 mb-2">
                Complete your KYC to unlock full features
              </p>
              <Link
                to="/kyc"
                className="block text-center text-xs bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Complete KYC
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
