/**
 * Workflow Timeline Component
 * Display project workflow progress with visual timeline
 * Shows completed, current, and upcoming stages
 */

import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  Circle,
  Loader,
  AlertCircle,
  User,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import {
  getWorkflowTimeline,
  WorkflowTimelineItem,
} from '../../services/api/workflowApi';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';

interface WorkflowTimelineProps {
  projectId: number;
  compact?: boolean; // Compact mode for sidebar/card display
}

export default function WorkflowTimeline({ projectId, compact = false }: WorkflowTimelineProps) {
  const [timeline, setTimeline] = useState<WorkflowTimelineItem[]>([]);

  // Load timeline
  const {
    execute: loadTimeline,
    loading,
    error,
  } = useAsyncOperation(
    async () => {
      const response = await getWorkflowTimeline(projectId);
      if (response.success && response.data) {
        setTimeline(response.data.timeline);
      }
    },
    { executeOnMount: true }
  );

  // Get icon for status
  const getStatusIcon = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'current':
        return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
      case 'upcoming':
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  // Get color classes for status
  const getStatusColor = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return 'border-green-600 bg-green-50';
      case 'current':
        return 'border-blue-600 bg-blue-50';
      case 'upcoming':
        return 'border-gray-300 bg-gray-50';
    }
  };

  // Get connector line color
  const getConnectorColor = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'current':
        return 'bg-gradient-to-b from-green-600 to-blue-600';
      case 'upcoming':
        return 'bg-gray-300';
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
          <p className="text-sm font-medium text-red-800">Failed to load timeline</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (timeline.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No timeline data available</p>
      </div>
    );
  }

  // Compact mode (for sidebars/cards)
  if (compact) {
    return (
      <div className="space-y-3">
        {timeline.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">{getStatusIcon(item.status)}</div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  item.status === 'completed'
                    ? 'text-green-700'
                    : item.status === 'current'
                    ? 'text-blue-700'
                    : 'text-gray-500'
                }`}
              >
                {item.stage_display_name}
              </p>
              {item.status === 'completed' && item.completed_at && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(item.completed_at).toLocaleDateString()}
                </p>
              )}
              {item.status === 'current' && (
                <p className="text-xs text-blue-600 mt-0.5">In Progress</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Full mode (detailed timeline)
  return (
    <div className="space-y-1">
      {timeline.map((item, index) => {
        const isLast = index === timeline.length - 1;

        return (
          <div key={index} className="relative">
            {/* Timeline Item */}
            <div
              className={`border-2 rounded-lg p-4 transition-all ${getStatusColor(item.status)} ${
                item.status === 'current' ? 'shadow-md' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">{getStatusIcon(item.status)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4
                        className={`font-semibold ${
                          item.status === 'completed'
                            ? 'text-green-900'
                            : item.status === 'current'
                            ? 'text-blue-900'
                            : 'text-gray-600'
                        }`}
                      >
                        {item.stage_display_name}
                      </h4>
                      <p
                        className={`text-sm ${
                          item.status === 'upcoming' ? 'text-gray-500' : 'text-gray-700'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Duration Badge */}
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/80 rounded text-xs font-medium text-gray-600">
                        <Clock className="w-3 h-3" />
                        {item.estimated_duration}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  {item.status !== 'upcoming' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {/* Completed Date */}
                      {item.completed_at && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">
                            Completed: {new Date(item.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {/* Completed By */}
                      {item.completed_by && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">By: {item.completed_by}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comments */}
                  {item.comments && (
                    <div className="mt-3 bg-white/60 border border-gray-200 rounded p-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{item.comments}</p>
                      </div>
                    </div>
                  )}

                  {/* Current Stage Info */}
                  {item.status === 'current' && (
                    <div className="mt-3 bg-blue-100 border border-blue-300 rounded p-3">
                      <p className="text-sm font-medium text-blue-900">
                        ⏳ This stage is currently in progress
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className="flex justify-start pl-6 py-2">
                <div className={`w-0.5 h-8 ${getConnectorColor(item.status)}`} />
              </div>
            )}
          </div>
        );
      })}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {timeline.filter((t) => t.status === 'completed').length}
          </div>
          <div className="text-xs text-gray-600 mt-1">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {timeline.filter((t) => t.status === 'current').length}
          </div>
          <div className="text-xs text-gray-600 mt-1">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-500">
            {timeline.filter((t) => t.status === 'upcoming').length}
          </div>
          <div className="text-xs text-gray-600 mt-1">Upcoming</div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={loadTimeline}
          disabled={loading}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Timeline'}
        </button>
      </div>
    </div>
  );
}
