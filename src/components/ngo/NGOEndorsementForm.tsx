/**
 * NGO Endorsement Form Component
 * Form for NGOs to endorse carbon credit projects
 * Implements PROJECTS_ARC.md Stage 2.5 - STK Endorsement Phase
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Award,
  Star,
  ThumbsUp,
  Shield,
  MessageSquare,
  AlertTriangle,
  Handshake,
  BookOpen,
  DollarSign,
  Eye,
  CheckCircle,
  Loader,
  AlertCircle,
  Info,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { endorseProject, EndorsementData } from '../../services/api/ngoApi';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import toast from 'react-hot-toast';

// Support level details (from PROJECTS_ARC.md)
const SUPPORT_LEVELS = [
  {
    value: 'LOW' as const,
    label: 'Low Support (25%)',
    percentage: 25,
    icon: Star,
    color: 'gray',
    badge: 'Supported by',
    benefits: ['NGO badge on project page', 'Listed in supporters'],
    description: 'Basic acknowledgment of project alignment',
  },
  {
    value: 'MEDIUM' as const,
    label: 'Medium Support (50%)',
    percentage: 50,
    icon: ThumbsUp,
    color: 'yellow',
    badge: 'Recommended by',
    benefits: ['Recommended badge', 'Priority listing', 'Enhanced visibility'],
    description: 'Project meets most of your criteria and deserves investor attention',
  },
  {
    value: 'HIGH' as const,
    label: 'High Support (75%)',
    percentage: 75,
    icon: TrendingUp,
    color: 'blue',
    badge: 'Highly Recommended',
    benefits: ['Featured project', '10% fee discount', 'Co-promotion opportunities'],
    description: 'Exceptional project with strong impact potential',
  },
  {
    value: 'FULL' as const,
    label: 'Full Partnership (100%)',
    percentage: 100,
    icon: Award,
    color: 'green',
    badge: 'NGO Partnered',
    benefits: [
      'Maximum visibility',
      '20% fee discount',
      'Guaranteed promotion',
      'Joint branding',
    ],
    description: 'Strategic partnership - your organization fully backs this project',
  },
];

const EXPERTISE_AREAS = [
  'Climate Change Mitigation',
  'Renewable Energy',
  'Reforestation & Conservation',
  'Sustainable Agriculture',
  'Clean Water & Sanitation',
  'Waste Management',
  'Biodiversity Protection',
  'Carbon Markets & Trading',
  'Community Development',
  'Environmental Education',
];

const TECHNICAL_ASSISTANCE_OPTIONS = [
  { value: 'training', label: 'Training & Capacity Building' },
  { value: 'mentoring', label: 'Project Mentoring' },
  { value: 'network', label: 'Network & Connections' },
  { value: 'research', label: 'Research Support' },
  { value: 'monitoring', label: 'Monitoring & Evaluation' },
  { value: 'advocacy', label: 'Advocacy & Policy' },
];

interface NGOEndorsementFormProps {
  projectId?: number; // Can be passed as prop or from URL
  onSuccess?: () => void;
}

export default function NGOEndorsementForm({
  projectId: propProjectId,
  onSuccess,
}: NGOEndorsementFormProps) {
  const navigate = useNavigate();
  const { projectId: urlProjectId } = useParams<{ projectId: string }>();
  const projectId = propProjectId || parseInt(urlProjectId || '0');

  // Form state
  const [supportLevel, setSupportLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'FULL'>('MEDIUM');
  const [endorsementText, setEndorsementText] = useState('');
  const [publicStatement, setPublicStatement] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [riskRating, setRiskRating] = useState<number>(3); // 1-5 scale
  const [coPromotionWilling, setCoPromotionWilling] = useState(false);
  const [technicalAssistance, setTechnicalAssistance] = useState<string[]>([]);
  const [monetarySupport, setMonetarySupport] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);

  // Submit endorsement
  const {
    execute: handleSubmit,
    loading: submitting,
    error: submitError,
  } = useAsyncOperation(
    async () => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const data: EndorsementData = {
        support_level: supportLevel,
        endorsement_text: endorsementText,
        public_statement: publicStatement || undefined,
        internal_notes: internalNotes || undefined,
      };

      const response = await endorseProject(projectId, data);
      if (response.success) {
        toast.success('Project endorsed successfully!');
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/dashboard');
        }
      }
    },
    {
      onError: (error) => {
        toast.error(`Endorsement failed: ${error}`);
      },
    }
  );

  // Toggle expertise area
  const toggleExpertise = (area: string) => {
    setExpertiseAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // Toggle technical assistance
  const toggleTechAssistance = (option: string) => {
    setTechnicalAssistance((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  // Validation
  const canSubmit = (): boolean => {
    return !!(
      supportLevel &&
      endorsementText.trim().length >= 50 &&
      expertiseAreas.length > 0 &&
      riskRating > 0
    );
  };

  // Get selected support level details
  const selectedLevel = SUPPORT_LEVELS.find((l) => l.value === supportLevel)!;
  const LevelIcon = selectedLevel.icon;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Award className="w-8 h-8 text-green-600" />
          Endorse Project
        </h1>
        <p className="text-gray-600">
          Provide your organization's endorsement to support this carbon credit project
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">About NGO Endorsements</p>
          <p>
            Your endorsement signals trust to investors and can provide fee discounts to project
            providers. Higher support levels unlock more benefits but carry greater responsibility.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
        {/* Support Level Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            1. Select Support Level *
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUPPORT_LEVELS.map((level) => {
              const Icon = level.icon;
              const isSelected = supportLevel === level.value;
              return (
                <label
                  key={level.value}
                  className={`cursor-pointer border-2 rounded-lg p-5 transition-all ${
                    isSelected
                      ? `border-${level.color}-500 bg-${level.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="support_level"
                    value={level.value}
                    checked={isSelected}
                    onChange={(e) => setSupportLevel(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3 mb-3">
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected ? `text-${level.color}-600` : 'text-gray-400'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Benefits:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {level.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="text-green-600">✓</span> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Selected Level Summary */}
          <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <LevelIcon className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  Selected: {selectedLevel.label}
                </p>
                <p className="text-sm text-gray-700">
                  Badge: "{selectedLevel.badge}" • {selectedLevel.percentage}% commitment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Endorsement Rationale */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            2. Endorsement Rationale *
          </h3>

          <div className="space-y-4">
            {/* Main Endorsement Text (Internal) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Endorsement Rationale (Internal) *
              </label>
              <textarea
                value={endorsementText}
                onChange={(e) => setEndorsementText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Explain why your organization endorses this project. Include:&#10;- Alignment with your mission&#10;- Technical assessment&#10;- Expected impact&#10;- Any concerns or conditions&#10;&#10;(Minimum 50 characters)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {endorsementText.length} / 50 minimum characters • This is for internal records
              </p>
            </div>

            {/* Public Statement (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Statement (Optional)
              </label>
              <textarea
                value={publicStatement}
                onChange={(e) => setPublicStatement(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Optional public message that will appear on the project page.&#10;Example: 'We are proud to support this innovative reforestation project that aligns with our mission to combat climate change through community-led initiatives.'"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be publicly visible on the project page
              </p>
            </div>

            {/* Internal Notes (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes (Optional)
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Private notes for your organization's records (not visible to others)"
              />
            </div>
          </div>
        </div>

        {/* Expertise Alignment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            3. Expertise Alignment * (Select at least one)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {EXPERTISE_AREAS.map((area) => (
              <label
                key={area}
                className={`cursor-pointer border-2 rounded-lg p-3 transition-all text-sm ${
                  expertiseAreas.includes(area)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={expertiseAreas.includes(area)}
                  onChange={() => toggleExpertise(area)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{area}</span>
                  {expertiseAreas.includes(area) && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </label>
            ))}
          </div>

          {expertiseAreas.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Selected: <strong>{expertiseAreas.length}</strong> area{expertiseAreas.length !== 1 && 's'}
            </div>
          )}
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-green-600" />
            4. Risk Assessment * (Your perspective)
          </h3>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Rate the overall risk level of this project from your organization's perspective:
            </p>

            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setRiskRating(rating)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    riskRating === rating
                      ? rating <= 2
                        ? 'border-red-500 bg-red-50'
                        : rating === 3
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{rating}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {rating === 1 && 'Very High'}
                      {rating === 2 && 'High'}
                      {rating === 3 && 'Moderate'}
                      {rating === 4 && 'Low'}
                      {rating === 5 && 'Very Low'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500">
              1 = Very High Risk (significant concerns) • 5 = Very Low Risk (minimal concerns)
            </p>
          </div>
        </div>

        {/* Additional Support */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-green-600" />
            5. Additional Support (Optional)
          </h3>

          <div className="space-y-6">
            {/* Co-Promotion */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coPromotionWilling}
                  onChange={(e) => setCoPromotionWilling(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    Co-Promotion Willingness
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    We will promote this project through our channels (social media, newsletter,
                    website, events)
                  </p>
                </div>
              </label>
            </div>

            {/* Technical Assistance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Technical Assistance Offered (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TECHNICAL_ASSISTANCE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                      technicalAssistance.includes(option.value)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={technicalAssistance.includes(option.value)}
                      onChange={() => toggleTechAssistance(option.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      {technicalAssistance.includes(option.value) && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Monetary Support */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monetary Support Commitment (Optional)
              </label>
              <div className="relative max-w-sm">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={monetarySupport || ''}
                  onChange={(e) => setMonetarySupport(parseFloat(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  min="0"
                  step="100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Amount your organization commits to support (USD)
              </p>
            </div>
          </div>
        </div>

        {/* Preview Toggle */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Preview Endorsement'}
          </button>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Preview: How it will appear on project page
            </h3>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Your NGO Name</h4>
                    <p className="text-sm text-gray-600">Your Country</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border-2 bg-${selectedLevel.color}-100 text-${selectedLevel.color}-800 border-${selectedLevel.color}-300`}
                >
                  {supportLevel} SUPPORT
                </span>
              </div>

              {/* Public Statement */}
              {publicStatement && (
                <div className="bg-gray-50 border-l-4 border-green-500 p-4 mb-3">
                  <p className="text-sm text-gray-700 italic">"{publicStatement}"</p>
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <div>Support Level: {selectedLevel.percentage}%</div>
                <div>Risk: {riskRating}/5</div>
                {coPromotionWilling && <div>✓ Co-promotion</div>}
                {technicalAssistance.length > 0 && (
                  <div>✓ {technicalAssistance.length} assistance type(s)</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Endorsement Error</p>
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={submitting}
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
                Submitting Endorsement...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Endorsement
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
