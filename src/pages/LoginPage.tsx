import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuthStore } from '../store/authStore';
import { useAsyncMutation } from '../hooks/useAsyncOperation';
import { TwoFactorVerify } from '../components/auth/TwoFactorVerify';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(true); // Controls login form vs 2FA view
  const { login, requires2FA, pending2FAEmail, loginWith2FA } = useAuthStore();
  const navigate = useNavigate();

  /**
   * Login mutation using useAsyncMutation hook
   */
  const { mutate: performLogin, loading: isLoading, error: loginError } = useAsyncMutation(
    async () => {
      await login(email, password);
      return { success: true };
    },
    {
      showErrorToast: true,
      showSuccessToast: false, // Don't show success yet (might need 2FA)
      errorMessage: 'Giriş yapılırken bir hata oluştu',
      autoLog: true,
      onSuccess: () => {
        const { requires2FA } = useAuthStore.getState();
        if (!requires2FA) {
          // Direct login successful
          navigate('/dashboard');
        } else {
          // 2FA required - show 2FA form
          setShowForm(false);
        }
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin();
  };

  // Handle 2FA verification
  const handle2FAVerify = async (token: string, isBackupCode: boolean) => {
    if (loginWith2FA) {
      await loginWith2FA(email, password, token, isBackupCode);
      navigate('/dashboard');
    }
  };

  const handle2FACancel = () => {
    setShowForm(true);
    useAuthStore.setState({ requires2FA: false, pending2FAEmail: null });
  };

  // If 2FA is required, show 2FA verification form
  if (!showForm && requires2FA) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            <TwoFactorVerify
              onVerify={handle2FAVerify}
              onCancel={handle2FACancel}
              userEmail={pending2FAEmail || email}
            />
          </motion.div>
        </div>
      </ErrorBoundary>
    );
  }

  // Show login form
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">CO₂</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            DECARBONIZE.world platformuna hoş geldiniz
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="E-posta adresinizi girin"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Şifrenizi girin"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Şifremi unuttum
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Giriş Yap'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link
                to="/register"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Kayıt olun
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Hesaplar</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('superadmin@decarbonize.world');
                  setPassword('Demo123!@#');
                }}
                className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Süper Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@decarbonize.world');
                  setPassword('Demo123!@#');
                }}
                className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('user@decarbonize.world');
                  setPassword('Demo123!@#');
                }}
                className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Kullanıcı
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('advisor@decarbonize.world');
                  setPassword('Demo123!@#');
                }}
                className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Danışman
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('verification@decarbonize.world');
                  setPassword('Demo123!@#');
                }}
                className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Doğrulama
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('ngo@decarbonize.world');
                  setPassword('Demo123!@#');
                }}
                className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                STK
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('provider@decarbonize.world');
                  setPassword('Demo123!@#');
                }}
                className="w-full inline-flex justify-center py-2 px-2 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Sağlayıcı
              </button>
            </div>
          </div>
        </form>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};