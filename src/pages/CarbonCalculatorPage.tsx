/**
 * Carbon Calculator Page
 * Standalone page for carbon credit calculations
 */

import React from 'react';
import CarbonCalculator from '../components/carbon/CarbonCalculator';

export default function CarbonCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CarbonCalculator />
    </div>
  );
}
