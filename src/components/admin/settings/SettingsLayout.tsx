import React from 'react';
import { motion } from 'framer-motion';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  title,
  description
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </motion.div>
        
        {children}
      </div>
    </div>
  );
};