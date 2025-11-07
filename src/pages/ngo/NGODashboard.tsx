/**
 * NGO Dashboard Page
 * Page wrapper for NGODashboard component
 */

import React from 'react';
import NGODashboard from '../../components/ngo/NGODashboard';

export const NGODashboardPage: React.FC = () => {
  return <NGODashboard />;
};

// Export for backward compatibility
export { NGODashboardPage as NGODashboard };
export default NGODashboardPage;
