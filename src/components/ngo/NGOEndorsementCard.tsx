/**
 * NGO Endorsement Card Component
 * Display NGO endorsements for a project with support levels
 * Shows verification badges and endorsement details
 */

import React, { useEffect, useState } from 'react';
import {
  Award,
  Building2,
  Star,
  Shield,
  Globe,
  Calendar,
  MessageSquare,
  Loader,
  AlertCircle,
  ThumbsUp,
} from 'lucide-react';
import {
  getProjectEndorsements,
  ProjectEndorsement,
  getEndorsementBadgeColor,
  calculateEndorsementScore,
} from '../../services/api/ngoApi';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';

interface NGOEndorsementCardProps {
  projectId: number;
  compact?: boolean; // Compact mode for smaller displays
}

export default function NGOEndorsementCard({
  projectId,
  compact = false,
}: NGOEndorsementCardProps) {
  const [endorsements, setEndorsements] = useState<ProjectEndorsement[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);

  // Load endorsements
  const {
    execute: loadEndorsements,
    loading,
    error,
  } = useAsyncOperation(
    async () => {
      const response = await getProjectEndorsements(projectId);
      if (response.success && response.data) {
        const activeEndorsements = response.data.endorsements.filter(
          (e) => e.status === 'active'
        );
        setEndorsements(activeEndorsements);
        setOverallScore(calculateEndorsementScore(activeEndorsements));
      }
    },
    { executeOnMount: true }
  );

  // Get support level icon
  const getSupportIcon = (level: string) => {
    switch (level) {
      case 'FULL':
        return <Award className="w-5 h-5 text-green-600" />;
      case 'HIGH':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'MEDIUM':
        return <ThumbsUp className="w-5 h-5 text-yellow-600" />;
      case 'LOW':
        return <Star className="w-5 h-5 text-gray-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800">Failed to load endorsements</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // No endorsements
  if (endorsements.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">No NGO Endorsements Yet</p>
        <p className="text-sm text-gray-500">
          This project has not been endorsed by any NGOs
        </p>
      </div>
    );
  }

  // Compact mode
  if (compact) {
    return (
      <div className="space-y-3">
        {/* Overall Score */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Endorsement Score</span>
            <span className="text-2xl font-bold text-green-700">{overallScore}/100</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Endorsement Count */}
        <div className="text-sm text-gray-600">
          <strong>{endorsements.length}</strong> NGO{endorsements.length !== 1 && 's'} supporting
          this project
        </div>

        {/* Endorsements List (Compact) */}
        <div className="space-y-2">
          {endorsements.slice(0, 3).map((endorsement) => (
            <div key={endorsement.id} className="flex items-center gap-2 text-sm">
              {getSupportIcon(endorsement.support_level)}
              <span className="font-medium text-gray-900 flex-1">
                {endorsement.ngo?.official_name || 'NGO'}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${getEndorsementBadgeColor(
                  endorsement.support_level
                )}`}
              >
                {endorsement.support_level}
              </span>
            </div>
          ))}
          {endorsements.length > 3 && (
            <p className="text-xs text-gray-500 pl-7">
              +{endorsements.length - 3} more endorsement{endorsements.length - 3 !== 1 && 's'}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full mode
  return (
    <div className="space-y-6">
      {/* Header with Overall Score */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-green-600" />
            NGO Endorsements
          </h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-700">{overallScore}</div>
            <div className="text-xs text-gray-600">Overall Score</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
            <span>Full</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-3">
          <strong>{endorsements.length}</strong> NGO{endorsements.length !== 1 && 's'}{' '}
          {endorsements.length === 1 ? 'has' : 'have'} endorsed this project
        </p>
      </div>

      {/* Endorsements List */}
      <div className="space-y-4">
        {endorsements.map((endorsement) => (
          <div
            key={endorsement.id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-green-300 transition-colors"
          >
            {/* NGO Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {endorsement.ngo?.official_name || 'NGO Organization'}
                  </h4>
                  {endorsement.ngo?.country && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {endorsement.ngo.country}
                    </p>
                  )}
                </div>
              </div>

              {/* Support Level Badge */}
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getEndorsementBadgeColor(
                    endorsement.support_level
                  )}`}
                >
                  {endorsement.support_level} SUPPORT
                </span>
                <span className="text-xs text-gray-500">
                  {endorsement.support_percentage}% commitment
                </span>
              </div>
            </div>

            {/* NGO Rating */}
            {endorsement.ngo?.average_rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (endorsement.ngo?.average_rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {endorsement.ngo.average_rating.toFixed(1)} • {endorsement.ngo.total_endorsements}{' '}
                  total endorsements
                </span>
              </div>
            )}

            {/* Endorsement Text */}
            {endorsement.public_statement && (
              <div className="bg-gray-50 border-l-4 border-green-500 p-4 mb-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 italic">"{endorsement.public_statement}"</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Endorsed {new Date(endorsement.endorsed_at).toLocaleDateString()}
              </div>
              {endorsement.expires_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Expires {new Date(endorsement.expires_at).toLocaleDateString()}
                </div>
              )}
              {endorsement.ngo?.website && (
                <a
                  href={endorsement.ngo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-green-600 hover:text-green-700"
                >
                  <Globe className="w-3 h-3" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadEndorsements}
          disabled={loading}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Endorsements'}
        </button>
      </div>
    </div>
  );
}
