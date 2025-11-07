/**
 * Admin Project Review Component
 * Review and manage pending carbon credit projects
 * Assign verifiers and approve/reject submissions
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  FileEdit,
  UserCheck,
  Eye,
  Loader,
  Search,
  Filter,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  Leaf,
} from 'lucide-react';
import {
  getPendingProjects,
  assignVerifier,
  reviewProject,
  Project,
} from '../../services/api/workflowApi';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import toast from 'react-hot-toast';
import { formatCO2 } from '../../services/api/carbonApi';

export default function AdminProjectReview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [verifierId, setVerifierId] = useState<number>(0);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'request_revision'>(
    'approve'
  );
  const [reviewComments, setReviewComments] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');

  // Load pending projects
  const {
    execute: loadProjects,
    loading: loadingProjects,
    error: loadError,
  } = useAsyncOperation(
    async () => {
      const response = await getPendingProjects();
      if (response.success && response.data) {
        setProjects(response.data.projects);
      }
    },
    { executeOnMount: true }
  );

  // Assign verifier
  const {
    execute: handleAssignVerifier,
    loading: assigning,
  } = useAsyncOperation(
    async () => {
      if (!selectedProject || !verifierId) return;

      const response = await assignVerifier(selectedProject.id, verifierId);
      if (response.success) {
        toast.success('Verifier assigned successfully');
        setShowAssignModal(false);
        setSelectedProject(null);
        setVerifierId(0);
        await loadProjects();
      }
    },
    {
      onError: (error) => toast.error(`Failed to assign verifier: ${error}`),
    }
  );

  // Review project
  const {
    execute: handleReviewProject,
    loading: reviewing,
  } = useAsyncOperation(
    async () => {
      if (!selectedProject) return;

      const response = await reviewProject(
        selectedProject.id,
        reviewAction,
        reviewComments || undefined
      );
      if (response.success) {
        toast.success(`Project ${reviewAction}d successfully`);
        setShowReviewModal(false);
        setSelectedProject(null);
        setReviewComments('');
        await loadProjects();
      }
    },
    {
      onError: (error) => toast.error(`Review failed: ${error}`),
    }
  );

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = filterStage === 'all' || project.workflow_stage === filterStage;

    return matchesSearch && matchesStage;
  });

  // Get stage badge color
  const getStageBadgeColor = (stage: string): string => {
    switch (stage) {
      case 'pending_admin_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'admin_reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'under_verification':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Format stage name
  const formatStage = (stage: string): string => {
    return stage
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Review Dashboard</h1>
        <p className="text-gray-600">Review and manage pending carbon credit projects</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Stage Filter */}
          <div className="md:w-64">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Stages</option>
              <option value="pending_admin_review">Pending Review</option>
              <option value="admin_reviewing">In Review</option>
              <option value="under_verification">Under Verification</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadProjects}
            disabled={loadingProjects}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors disabled:opacity-50"
          >
            {loadingProjects ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loadingProjects && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-green-600" />
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Failed to load projects</p>
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        </div>
      )}

      {/* Projects List */}
      {!loadingProjects && !loadError && (
        <>
          {filteredProjects.length === 0 ? (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">No projects found</p>
              <p className="text-sm text-gray-500">
                {searchQuery || filterStage !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No pending projects at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStageBadgeColor(
                            project.workflow_stage
                          )}`}
                        >
                          {formatStage(project.workflow_stage)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">
                        {formatCO2(project.co2_reduction_calculated)}/year
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        ${project.funding_goal.toLocaleString()} goal
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowAssignModal(true);
                      }}
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      Assign Verifier
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setReviewAction('approve');
                        setShowReviewModal(true);
                      }}
                      className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setReviewAction('request_revision');
                        setShowReviewModal(true);
                      }}
                      className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      <FileEdit className="w-4 h-4" />
                      Request Revision
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setReviewAction('reject');
                        setShowReviewModal(true);
                      }}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>

                    <a
                      href={`/projects/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Assign Verifier Modal */}
      {showAssignModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Verifier</h3>
            <p className="text-gray-600 mb-6">
              Assign a verifier to review: <strong>{selectedProject.title}</strong>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verifier User ID
              </label>
              <input
                type="number"
                value={verifierId || ''}
                onChange={(e) => setVerifierId(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter verifier user ID"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the user ID of an approved verifier
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedProject(null);
                  setVerifierId(0);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                disabled={assigning}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignVerifier}
                disabled={!verifierId || assigning}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {assigning ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  'Assign'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Project Modal */}
      {showReviewModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {reviewAction === 'approve' && 'Approve Project'}
              {reviewAction === 'reject' && 'Reject Project'}
              {reviewAction === 'request_revision' && 'Request Revision'}
            </h3>
            <p className="text-gray-600 mb-6">
              Project: <strong>{selectedProject.title}</strong>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments {reviewAction !== 'approve' && '(Required)'}
              </label>
              <textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder={
                  reviewAction === 'approve'
                    ? 'Optional comments for approval...'
                    : reviewAction === 'reject'
                    ? 'Explain the reason for rejection...'
                    : 'Describe what needs to be revised...'
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedProject(null);
                  setReviewComments('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                disabled={reviewing}
              >
                Cancel
              </button>
              <button
                onClick={handleReviewProject}
                disabled={
                  reviewing ||
                  (reviewAction !== 'approve' && !reviewComments.trim())
                }
                className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  reviewAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : reviewAction === 'reject'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                } disabled:bg-gray-400`}
              >
                {reviewing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {reviewAction === 'approve' && <CheckCircle className="w-4 h-4" />}
                    {reviewAction === 'reject' && <XCircle className="w-4 h-4" />}
                    {reviewAction === 'request_revision' && <FileEdit className="w-4 h-4" />}
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
