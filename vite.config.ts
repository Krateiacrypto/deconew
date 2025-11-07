import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
          'vendor-charts': ['recharts'],
          'vendor-blockchain': ['ethers'],
          'vendor-ui': ['framer-motion', '@headlessui/react', 'react-hot-toast'],
          'vendor-forms': ['react-hook-form', 'zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
});
