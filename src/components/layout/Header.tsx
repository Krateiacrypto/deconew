import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, User, LogOut, Settings, ChevronDown, TrendingUp, Shield, Zap, Leaf } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useLanguageStore } from '../../store/languageStore';
import { LanguageSelector } from './LanguageSelector';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false);
      setActiveDropdown(null);
    };
    if (isProfileOpen || activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isProfileOpen, activeDropdown]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();
  const { isConnected, address } = useWalletStore();
  const { t } = useLanguageStore();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.trading'), href: '/trading' },
    { name: t('nav.ico'), href: '/ico' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.about'), href: '/about' },
  ];

  const userNavigation = [
    { name: t('nav.dashboard'), href: '/dashboard' },
    ...(user?.role === 'user' || user?.role === 'advisor' || user?.role === 'admin' || user?.role === 'superadmin' 
      ? [{ name: t('nav.portfolio'), href: '/portfolio' }] : []),
    { name: t('nav.wallet'), href: '/wallet' },
    ...(user?.role === 'user' || user?.role === 'admin' || user?.role === 'superadmin' 
      ? [{ name: t('nav.advisor'), href: '/advisor' }] : []),
    { name: 'KYC', href: '/kyc' },
    ...(user?.role === 'user' || user?.role === 'advisor' || user?.role === 'admin' || user?.role === 'superadmin' 
      ? [{ name: 'Staking', href: '/staking' }] : []),
  ];

  const adminNavigation = [
    ...(user?.role === 'superadmin' 
      ? [{ name: 'Kullanıcı Profilleri', href: '/admin/profiles' }] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' 
      ? [{ name: t('admin.userManagement'), href: '/admin/users' }] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' 
      ? [{ name: t('admin.projectManagement'), href: '/admin/projects' }] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' 
      ? [{ name: t('admin.kycManagement'), href: '/admin/kyc' }] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' 
      ? [{ name: 'İçerik Yönetimi', href: '/admin/content' }] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' 
      ? [{ name: 'Görsel Editör', href: '/admin/editor' }] : []),
    ...(user?.role === 'superadmin' 
      ? [{ name: t('admin.systemSettings'), href: '/admin/settings' }] : []),
  ];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const megaMenuFeatures = [
    {
      name: 'Carbon Trading',
      href: '/trading',
      icon: TrendingUp,
      description: 'Trade verified carbon credits',
      color: 'emerald'
    },
    {
      name: 'Token Sale',
      href: '/ico',
      icon: Zap,
      description: 'Join our token presale',
      color: 'blue'
    },
    {
      name: 'Verified Projects',
      href: '/projects',
      icon: Shield,
      description: 'Explore carbon offset projects',
      color: 'green'
    },
    {
      name: 'Sustainability',
      href: '/about',
      icon: Leaf,
      description: 'Our environmental impact',
      color: 'teal'
    },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200'
        : 'bg-white/80 backdrop-blur-md border-b border-emerald-50'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Enhanced */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-shadow duration-300"
              >
                <span className="text-white font-bold text-base">CO₂</span>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              >
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </motion.div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                DECARBONIZE
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1 font-medium tracking-wider">.world</p>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${
                    isActive
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-3/4 transition-all duration-300"
                  />
                </Link>
              );
            })}
          </div>

          {/* User Actions - Enhanced */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="mr-1">
              <LanguageSelector />
            </div>

            {/* Wallet Status - Enhanced */}
            {isConnected && address && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Link
                  to="/wallet"
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg hover:from-emerald-100 hover:to-green-100 transition-all duration-300 border border-emerald-200/50 shadow-sm hover:shadow-md group"
                >
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-mono text-xs font-medium">{formatAddress(address)}</span>
                </Link>
              </motion.div>
            )}

            {isAuthenticated ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <div className="mt-2 inline-flex items-center px-2 py-1 bg-white rounded-full text-xs font-medium text-emerald-600 border border-emerald-200">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
                          {user?.role}
                        </div>
                      </div>

                      <div className="py-1">
                        {userNavigation.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              to={item.href}
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-600 transition-all duration-200 group"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                              {item.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {(user?.role === 'admin' || user?.role === 'superadmin') && adminNavigation.length > 0 && (
                        <>
                          <div className="my-1 px-4">
                            <div className="border-t border-gray-200"></div>
                          </div>
                          <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50">
                            <p className="text-xs font-semibold text-amber-900 flex items-center">
                              <Settings className="w-3 h-3 mr-1.5" />
                              Admin Controls
                            </p>
                          </div>
                          <div className="py-1">
                            {adminNavigation.filter(item => item.name).map((item, index) => (
                              <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                              >
                                <Link
                                  to={item.href}
                                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 transition-all duration-200 group"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                  {item.name}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="my-1 px-4">
                        <div className="border-t border-gray-200"></div>
                      </div>
                      <div className="p-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (isLoggingOut) return;
                            setIsLoggingOut(true);
                            setIsProfileOpen(false);
                            try {
                              await logout();
                              navigate('/login');
                            } catch (error) {
                              console.error('Logout error:', error);
                            } finally {
                              setIsLoggingOut(false);
                            }
                          }}
                          disabled={isLoggingOut || isLoading}
                          className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-lg hover:from-red-100 hover:to-pink-100 border border-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                        >
                          {isLoggingOut ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              <span>Çıkış yapılıyor...</span>
                            </>
                          ) : (
                            <>
                              <LogOut className="w-4 h-4" />
                              <span>{t('nav.logout')}</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-200 hover:bg-emerald-50 rounded-lg"
                >
                  {t('nav.login')}
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-600 hover:via-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm group"
                  >
                    <Wallet className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>{t('nav.register')}</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button - Enhanced */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation - Enhanced */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-gradient-to-r from-emerald-100 to-blue-100"
            >
              <div className="py-4 space-y-1 bg-gradient-to-b from-emerald-50/50 to-white">
                {navigation.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center px-4 py-3.5 text-base font-medium rounded-lg mx-2 transition-all duration-200 ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-emerald-500 to-blue-600 shadow-lg'
                            : 'text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50'
                        }`}
                      >
                        {isActive && (
                          <span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>
                        )}
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}

              {isAuthenticated && (
                <>
                  <div className="my-3 mx-4 border-t border-emerald-200"></div>
                  <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 mx-2 rounded-lg">
                    <p className="text-xs font-semibold text-emerald-900 flex items-center">
                      <User className="w-3 h-3 mr-1.5" />
                      Kullanıcı Menüsü
                    </p>
                  </div>
                  {userNavigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 mx-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 rounded-lg transition-all duration-200"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 opacity-0 hover:opacity-100"></span>
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </>
              )}

              <div className="pt-4 mt-3 border-t border-emerald-100">
                <div className="px-6 py-3">
                  <LanguageSelector />
                </div>

                {isAuthenticated ? (
                  <div className="px-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={async () => {
                        if (isLoggingOut) return;
                        setIsLoggingOut(true);
                        setIsMenuOpen(false);
                        try {
                          await logout();
                          navigate('/login');
                        } catch (error) {
                          console.error('Logout error:', error);
                        } finally {
                          setIsLoggingOut(false);
                        }
                      }}
                      disabled={isLoggingOut || isLoading}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Çıkış yapılıyor...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-5 h-5" />
                          <span>{t('nav.logout')}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3 px-4">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center w-full px-6 py-3.5 border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                      >
                        <User className="w-5 h-5 mr-2" />
                        {t('nav.login')}
                      </Link>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center w-full px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-600 hover:via-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        {t('nav.register')}
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};