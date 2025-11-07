/**
 * NGO Registration Form Component
 * Form for NGO organizations to register on the platform
 * Integrates with NGO API
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  CheckCircle,
  Loader,
  AlertCircle,
  X,
} from 'lucide-react';
import { registerNGO, NGORegistrationData } from '../../services/api/ngoApi';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import toast from 'react-hot-toast';

const FOCUS_AREAS = [
  { value: 'climate_change', label: 'Climate Change' },
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'reforestation', label: 'Reforestation & Conservation' },
  { value: 'sustainable_agriculture', label: 'Sustainable Agriculture' },
  { value: 'clean_water', label: 'Clean Water & Sanitation' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'biodiversity', label: 'Biodiversity Protection' },
  { value: 'environmental_education', label: 'Environmental Education' },
];

export default function NGORegistrationForm() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<Partial<NGORegistrationData>>({
    official_name: '',
    registration_number: '',
    country: '',
    website: '',
    contact_email: '',
    contact_phone: '',
    focus_areas: [],
    description: '',
    years_active: 0,
    previous_projects: 0,
    verification_documents: [],
  });

  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);

  // Submit
  const {
    execute: handleSubmit,
    loading: submitting,
    error: submitError,
  } = useAsyncOperation(
    async () => {
      const dataToSubmit: NGORegistrationData = {
        ...formData,
        focus_areas: selectedFocusAreas,
      } as NGORegistrationData;

      const response = await registerNGO(dataToSubmit);
      if (response.success) {
        toast.success('NGO registration submitted successfully!');
        navigate('/dashboard');
      }
    },
    {
      onError: (error) => {
        toast.error(`Registration failed: ${error}`);
      },
    }
  );

  // Update field
  const updateField = <K extends keyof NGORegistrationData>(
    field: K,
    value: NGORegistrationData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle focus area
  const toggleFocusArea = (area: string) => {
    setSelectedFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // Validation
  const canSubmit = (): boolean => {
    return !!(
      formData.official_name &&
      formData.registration_number &&
      formData.country &&
      formData.contact_email &&
      selectedFocusAreas.length > 0 &&
      formData.description &&
      formData.years_active
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Registration</h1>
        <p className="text-gray-600">
          Register your NGO to endorse and support carbon credit projects
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
        {/* Organization Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" />
            Organization Information
          </h3>

          <div className="space-y-4">
            {/* Official Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Official Organization Name *
              </label>
              <input
                type="text"
                value={formData.official_name}
                onChange={(e) => updateField('official_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Green Earth Foundation"
                required
              />
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration/Tax Number *
              </label>
              <input
                type="text"
                value={formData.registration_number}
                onChange={(e) => updateField('registration_number', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., NGO-12345-2020"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Kenya"
                  required
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.org"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-600" />
            Contact Information
          </h3>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="contact@example.org"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Focus Areas * (Select at least one)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FOCUS_AREAS.map((area) => (
              <label
                key={area.value}
                className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                  selectedFocusAreas.includes(area.value)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFocusAreas.includes(area.value)}
                  onChange={() => toggleFocusArea(area.value)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{area.label}</span>
                  {selectedFocusAreas.includes(area.value) && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </label>
            ))}
          </div>

          {selectedFocusAreas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedFocusAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {FOCUS_AREAS.find((a) => a.value === area)?.label}
                  <button
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description & Experience */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Organization Description & Experience
          </h3>

          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Describe your organization's mission, vision, and activities in the carbon credit and sustainability space..."
                required
              />
            </div>

            {/* Years Active */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years Active *
                </label>
                <input
                  type="number"
                  value={formData.years_active || ''}
                  onChange={(e) => updateField('years_active', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  placeholder="e.g., 5"
                  required
                />
              </div>

              {/* Previous Projects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Projects (Optional)
                </label>
                <input
                  type="number"
                  value={formData.previous_projects || ''}
                  onChange={(e) => updateField('previous_projects', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  placeholder="e.g., 15"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your NGO registration will be reviewed by our admin team. You
            will be notified once your application is approved or if additional information is
            needed.
          </p>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Registration Error</p>
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !canSubmit()}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Registration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
