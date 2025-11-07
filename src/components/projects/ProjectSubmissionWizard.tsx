/**
 * Project Submission Wizard Component
 * Multi-step wizard for submitting new carbon credit projects
 * Integrates with workflow API
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  MapPin,
  DollarSign,
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader,
  AlertCircle,
  Building2,
  Handshake,
  TrendingUp,
  X,
} from 'lucide-react';
import { submitProject, ProjectSubmissionData } from '../../services/api/workflowApi';
import { listNGOs, NGO } from '../../services/api/ngoApi';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import toast from 'react-hot-toast';

type Step = 1 | 2 | 3 | 4 | 5;

const PROJECT_TYPES = [
  { value: 'renewable_energy', label: 'Renewable Energy', description: 'Solar, wind, hydro projects' },
  { value: 'reforestation', label: 'Reforestation', description: 'Forest restoration and conservation' },
  { value: 'energy_efficiency', label: 'Energy Efficiency', description: 'Building and industrial efficiency' },
  { value: 'waste_management', label: 'Waste Management', description: 'Waste reduction and recycling' },
  { value: 'other', label: 'Other', description: 'Custom carbon reduction project' },
] as const;

const DOCUMENT_TYPES = [
  { value: 'feasibility_study', label: 'Feasibility Study' },
  { value: 'baseline_report', label: 'Baseline Report' },
  { value: 'methodology', label: 'Methodology Document' },
  { value: 'monitoring_plan', label: 'Monitoring Plan' },
  { value: 'other', label: 'Other Documents' },
] as const;

export default function ProjectSubmissionWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form data
  const [formData, setFormData] = useState<Partial<ProjectSubmissionData>>({
    title: '',
    description: '',
    location: '',
    project_type: 'renewable_energy',
    baseline_emissions: 0,
    project_emissions: 0,
    start_date: '',
    end_date: '',
    estimated_budget: 0,
    funding_goal: 0,
    documents: [],
  });

  // Document upload state
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('feasibility_study');

  // NGO Partnership state
  const [availableNGOs, setAvailableNGOs] = useState<NGO[]>([]);
  const [selectedNGOs, setSelectedNGOs] = useState<number[]>([]);
  const [revenueSharePercentage, setRevenueSharePercentage] = useState<number>(0);
  const [coPromotionAgreed, setCoPromotionAgreed] = useState<boolean>(false);
  const [partnershipProposal, setPartnershipProposal] = useState<string>('');

  // Load NGOs
  const {
    execute: loadNGOs,
    loading: ngosLoading,
  } = useAsyncOperation(
    async () => {
      const response = await listNGOs();
      if (response.success && response.data) {
        // Filter only verified NGOs
        const verifiedNGOs = response.data.ngos.filter(
          (ngo) => ngo.verification_status === 'approved'
        );
        setAvailableNGOs(verifiedNGOs);
      }
    },
    { executeOnMount: true }
  );

  // Submission
  const {
    execute: handleSubmit,
    loading: submitting,
    error: submitError,
  } = useAsyncOperation(
    async () => {
      const response = await submitProject(formData as ProjectSubmissionData);
      if (response.success) {
        toast.success('Project submitted successfully!');
        navigate('/dashboard');
      }
    },
    {
      onError: (error) => {
        toast.error(`Submission failed: ${error}`);
      },
    }
  );

  // Field update
  const updateField = <K extends keyof ProjectSubmissionData>(
    field: K,
    value: ProjectSubmissionData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add document
  const addDocument = () => {
    if (!documentFile) return;

    const doc = {
      document_type: documentType as any,
      document_url: URL.createObjectURL(documentFile), // In production: upload to S3/cloud storage
      file_name: documentFile.name,
      file_size: documentFile.size,
    };

    setFormData((prev) => ({
      ...prev,
      documents: [...(prev.documents || []), doc],
    }));

    setDocumentFile(null);
    toast.success('Document added');
  };

  // Remove document
  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents?.filter((_, i) => i !== index),
    }));
  };

  // NGO Partnership functions
  const toggleNGOSelection = (ngoId: number) => {
    setSelectedNGOs((prev) =>
      prev.includes(ngoId)
        ? prev.filter((id) => id !== ngoId)
        : [...prev, ngoId]
    );
  };

  const removeSelectedNGO = (ngoId: number) => {
    setSelectedNGOs((prev) => prev.filter((id) => id !== ngoId));
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((currentStep + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.title &&
          formData.description &&
          formData.project_type &&
          formData.location
        );
      case 2:
        return !!(
          formData.baseline_emissions &&
          formData.project_emissions &&
          formData.baseline_emissions > formData.project_emissions
        );
      case 3:
        return !!(
          formData.start_date &&
          formData.end_date &&
          formData.estimated_budget &&
          formData.funding_goal
        );
      case 4:
        return true; // Documents are optional
      case 5:
        // NGO partnership is optional, but if selected, must provide proposal
        if (selectedNGOs.length > 0) {
          return partnershipProposal.trim().length >= 100; // Min 100 chars if requesting partnership
        }
        return true; // Can skip if no NGOs selected
      default:
        return false;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>

            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Solar Farm in Rural Kenya"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Describe your project, its goals, methodology, and expected impact..."
                required
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Project Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      formData.project_type === type.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="project_type"
                      value={type.value}
                      checked={formData.project_type === type.value}
                      onChange={(e) => updateField('project_type', e.target.value as any)}
                      className="sr-only"
                    />
                    <div className="font-semibold text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Nairobi, Kenya"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Carbon Impact</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These values will be verified by our carbon credit experts.
                Provide your best estimates based on methodology standards.
              </p>
            </div>

            {/* Baseline Emissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baseline Emissions (tons CO₂/year) *
              </label>
              <input
                type="number"
                value={formData.baseline_emissions || ''}
                onChange={(e) => updateField('baseline_emissions', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="0"
                step="100"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Expected emissions without your project (business-as-usual scenario)
              </p>
            </div>

            {/* Project Emissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Emissions (tons CO₂/year) *
              </label>
              <input
                type="number"
                value={formData.project_emissions || ''}
                onChange={(e) => updateField('project_emissions', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="0"
                step="100"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Expected emissions with your project implemented
              </p>
            </div>

            {/* Reduction Calculation */}
            {formData.baseline_emissions && formData.project_emissions && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">Estimated Annual Reduction</h4>
                <div className="text-3xl font-bold text-green-700">
                  {(formData.baseline_emissions - formData.project_emissions).toLocaleString()} tons
                  CO₂
                </div>
                <div className="text-sm text-green-600 mt-2">
                  {(
                    ((formData.baseline_emissions - formData.project_emissions) /
                      formData.baseline_emissions) *
                    100
                  ).toFixed(1)}
                  % reduction from baseline
                </div>
              </div>
            )}

            {/* Warning if project > baseline */}
            {formData.baseline_emissions &&
              formData.project_emissions &&
              formData.project_emissions >= formData.baseline_emissions && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    Project emissions must be lower than baseline emissions to generate carbon credits.
                  </div>
                </div>
              )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Financial & Timeline</h3>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Start Date *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => updateField('start_date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project End Date *
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => updateField('end_date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Estimated Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Total Budget (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.estimated_budget || ''}
                  onChange={(e) => updateField('estimated_budget', parseFloat(e.target.value) || 0)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>

            {/* Funding Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Goal (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.funding_goal || ''}
                  onChange={(e) => updateField('funding_goal', parseFloat(e.target.value) || 0)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="1000"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Amount you wish to raise through the platform
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Supporting Documents</h3>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                Upload supporting documents to strengthen your project submission. While optional,
                these documents significantly improve approval chances.
              </p>
            </div>

            {/* Document Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                </div>

                <button
                  onClick={addDocument}
                  disabled={!documentFile}
                  className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Add Document
                </button>
              </div>
            </div>

            {/* Uploaded Documents List */}
            {formData.documents && formData.documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Uploaded Documents</h4>
                {formData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{doc.file_name}</div>
                        <div className="text-xs text-gray-500">
                          {DOCUMENT_TYPES.find((t) => t.value === doc.document_type)?.label} •{' '}
                          {(doc.file_size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Handshake className="w-6 h-6 text-green-600" />
              NGO Partnership (Optional)
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Optional:</strong> Request partnership with verified NGOs to increase your
                project's credibility and access co-promotion opportunities. NGOs will review your
                request and may endorse your project.
              </p>
            </div>

            {/* Available NGOs */}
            {ngosLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-3 text-gray-600">Loading verified NGOs...</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select NGOs to Request Partnership ({selectedNGOs.length} selected)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {availableNGOs.length === 0 ? (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No verified NGOs available at this time</p>
                      </div>
                    ) : (
                      availableNGOs.map((ngo) => (
                        <label
                          key={ngo.id}
                          className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                            selectedNGOs.includes(ngo.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedNGOs.includes(ngo.id)}
                            onChange={() => toggleNGOSelection(ngo.id)}
                            className="sr-only"
                          />
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-green-600" />
                                {ngo.official_name}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">{ngo.country}</div>
                              <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                                {ngo.description || 'No description available'}
                              </div>
                              {ngo.focus_areas && ngo.focus_areas.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {ngo.focus_areas.slice(0, 2).map((area, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded"
                                    >
                                      {area.replace('_', ' ')}
                                    </span>
                                  ))}
                                  {ngo.focus_areas.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{ngo.focus_areas.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {selectedNGOs.includes(ngo.id) && (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Selected NGOs Summary */}
                {selectedNGOs.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Selected NGOs</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNGOs.map((ngoId) => {
                        const ngo = availableNGOs.find((n) => n.id === ngoId);
                        return ngo ? (
                          <span
                            key={ngoId}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {ngo.official_name}
                            <button
                              type="button"
                              onClick={() => removeSelectedNGO(ngoId)}
                              className="hover:bg-green-200 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Revenue Share Percentage */}
                {selectedNGOs.length > 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revenue Share Percentage (0-10%) *
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.5"
                          value={revenueSharePercentage}
                          onChange={(e) => setRevenueSharePercentage(parseFloat(e.target.value))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <span className="text-2xl font-bold text-green-700 w-16 text-right">
                          {revenueSharePercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Percentage of revenue you're willing to share with partner NGOs
                      </p>
                    </div>

                    {/* Co-Promotion Agreement */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={coPromotionAgreed}
                          onChange={(e) => setCoPromotionAgreed(e.target.checked)}
                          className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            Agree to Co-Promotion
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            I agree to jointly promote this project with partner NGOs through
                            shared marketing efforts, social media, and communication channels.
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Partnership Proposal */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Partnership Proposal * (minimum 100 characters)
                      </label>
                      <textarea
                        value={partnershipProposal}
                        onChange={(e) => setPartnershipProposal(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Explain why you're seeking partnership with these NGOs, how they align with your project goals, and what value this partnership will bring to both parties..."
                        required={selectedNGOs.length > 0}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          Describe the partnership value and alignment
                        </p>
                        <span
                          className={`text-xs font-medium ${
                            partnershipProposal.length >= 100
                              ? 'text-green-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {partnershipProposal.length}/100
                        </span>
                      </div>
                    </div>

                    {/* Partnership Benefits Info */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Partnership Benefits
                      </h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Enhanced credibility through NGO endorsement</li>
                        <li>• Access to NGO's network and community</li>
                        <li>• Co-promotion opportunities</li>
                        <li>• Potential fee discounts (10-20% based on support level)</li>
                        <li>• Priority visibility on the platform</li>
                      </ul>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit New Project</h1>
        <p className="text-gray-600">
          Follow the steps below to submit your carbon credit project for verification
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step < currentStep
                      ? 'bg-green-600 text-white'
                      : step === currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <div className="text-xs mt-2 text-gray-600 text-center">
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Carbon Impact'}
                  {step === 3 && 'Financial'}
                  {step === 4 && 'Documents'}
                  {step === 5 && 'Partnership'}
                </div>
              </div>
              {step < 5 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        {renderStepContent()}
      </div>

      {/* Error Display */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Submission Error</p>
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {currentStep < 5 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !canProceed()}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Project
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
