import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`bg-white rounded-2xl p-6 shadow-lg ${className}`}
    >
      <div className="flex items-center space-x-3 mb-6">
        {Icon && (
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
};