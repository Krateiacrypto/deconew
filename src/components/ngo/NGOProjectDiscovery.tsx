/**
 * NGO Project Discovery Component
 * Browse and filter available projects for endorsement
 * Implements PROJECTS_ARC.md - NGO Project Discovery & Matching
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Leaf,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Eye,
  Sparkles,
  Loader,
  AlertCircle,
  ThumbsUp,
  XCircle,
} from 'lucide-react';
import { getPendingProjects, Project } from '../../services/api/workflowApi';
import { formatCO2 } from '../../services/api/carbonApi';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';

const PROJECT_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'reforestation', label: 'Reforestation' },
  { value: 'energy_efficiency', label: 'Energy Efficiency' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'other', label: 'Other' },
];

const PROJECT_SIZES = [
  { value: 'all', label: 'All Sizes' },
  { value: 'small', label: 'Small (<$100k)', max: 100000 },
  { value: 'medium', label: 'Medium ($100k-$1M)', min: 100000, max: 1000000 },
  { value: 'large', label: 'Large (>$1M)', min: 1000000 },
];

const CARBON_IMPACT = [
  { value: 'all', label: 'All Impact Levels' },
  { value: 'low', label: 'Low (<1k tons/year)', max: 1000 },
  { value: 'medium', label: 'Medium (1k-10k tons/year)', min: 1000, max: 10000 },
  { value: 'high', label: 'High (>10k tons/year)', min: 10000 },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'impact_high', label: 'Highest Impact' },
  { value: 'impact_low', label: 'Lowest Impact' },
  { value: 'funding_high', label: 'Largest Budget' },
  { value: 'funding_low', label: 'Smallest Budget' },
];

export default function NGOProjectDiscovery() {
  const navigate = useNavigate();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectType, setProjectType] = useState('all');
  const [projectSize, setProjectSize] = useState('all');
  const [carbonImpact, setCarbonImpact] = useState('all');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Load projects
  const {
    execute: loadProjects,
    loading,
    error,
  } = useAsyncOperation(
    async () => {
      const response = await getPendingProjects();
      if (response.success && response.data) {
        // Filter only projects in "under_verification" stage (open for endorsement)
        const availableProjects = response.data.projects.filter(
          (p) => p.workflow_stage === 'under_verification' || p.workflow_stage === 'pending_admin_review'
        );
        setProjects(availableProjects);
      }
    },
    { executeOnMount: true }
  );

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    // Search query
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Project type
    const matchesType = projectType === 'all' || project.project_type === projectType;

    // Location
    const matchesLocation =
      !location || project.location.toLowerCase().includes(location.toLowerCase());

    // Project size (funding goal)
    let matchesSize = true;
    if (projectSize !== 'all') {
      const sizeConfig = PROJECT_SIZES.find((s) => s.value === projectSize);
      if (sizeConfig) {
        if (sizeConfig.min && project.funding_goal < sizeConfig.min) matchesSize = false;
        if (sizeConfig.max && project.funding_goal > sizeConfig.max) matchesSize = false;
      }
    }

    // Carbon impact
    let matchesImpact = true;
    if (carbonImpact !== 'all') {
      const impactConfig = CARBON_IMPACT.find((i) => i.value === carbonImpact);
      if (impactConfig) {
        if (impactConfig.min && project.co2_reduction_calculated < impactConfig.min)
          matchesImpact = false;
        if (impactConfig.max && project.co2_reduction_calculated > impactConfig.max)
          matchesImpact = false;
      }
    }

    return matchesSearch && matchesType && matchesLocation && matchesSize && matchesImpact;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'impact_high':
        return b.co2_reduction_calculated - a.co2_reduction_calculated;
      case 'impact_low':
        return a.co2_reduction_calculated - b.co2_reduction_calculated;
      case 'funding_high':
        return b.funding_goal - a.funding_goal;
      case 'funding_low':
        return a.funding_goal - b.funding_goal;
      default:
        return 0;
    }
  });

  // Calculate AI alignment score (mock - in production this would be backend)
  const calculateAlignmentScore = (project: Project): number => {
    // Mock algorithm based on project type, impact, and budget
    let score = 50; // base score

    // Higher impact = higher score
    if (project.co2_reduction_calculated > 10000) score += 20;
    else if (project.co2_reduction_calculated > 5000) score += 10;

    // Reasonable budget = higher score
    if (project.funding_goal > 100000 && project.funding_goal < 1000000) score += 15;

    // Has endorsements already = higher score
    score += Math.min(project.endorsement_count * 5, 15);

    return Math.min(score, 100);
  };

  // Get alignment badge
  const getAlignmentBadge = (score: number) => {
    if (score >= 80)
      return { label: 'Excellent Match', color: 'bg-green-100 text-green-800 border-green-300' };
    if (score >= 60)
      return { label: 'Good Match', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (score >= 40)
      return { label: 'Fair Match', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return { label: 'Low Match', color: 'bg-gray-100 text-gray-800 border-gray-300' };
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setProjectType('all');
    setProjectSize('all');
    setCarbonImpact('all');
    setLocation('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-green-600" />
          Discover Projects to Endorse
        </h1>
        <p className="text-gray-600">
          Browse carbon credit projects that need your organization's support and expertise
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, description, or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              showFilters
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(projectType !== 'all' ||
              projectSize !== 'all' ||
              carbonImpact !== 'all' ||
              location) && (
              <span className="bg-white text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                !
              </span>
            )}
          </button>

          {/* Refresh */}
          <button
            onClick={loadProjects}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Project Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Size */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Project Size</label>
              <select
                value={projectSize}
                onChange={(e) => setProjectSize(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {PROJECT_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Carbon Impact */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Carbon Impact</label>
              <select
                value={carbonImpact}
                onChange={(e) => setCarbonImpact(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {CARBON_IMPACT.map((impact) => (
                  <option key={impact.value} value={impact.value}>
                    {impact.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Filter by location..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Reset Button */}
            <div className="md:col-span-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Available</div>
          <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Matching Filters</div>
          <div className="text-2xl font-bold text-green-600">{filteredProjects.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">High Match Projects</div>
          <div className="text-2xl font-bold text-blue-600">
            {sortedProjects.filter((p) => calculateAlignmentScore(p) >= 80).length}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-green-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Failed to load projects</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && (
        <>
          {sortedProjects.length === 0 ? (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">No projects found</p>
              <p className="text-sm text-gray-500">
                {searchQuery || projectType !== 'all' || projectSize !== 'all' || carbonImpact !== 'all' || location
                  ? 'Try adjusting your filters'
                  : 'No projects available for endorsement at the moment'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProjects.map((project) => {
                const alignmentScore = calculateAlignmentScore(project);
                const alignmentBadge = getAlignmentBadge(alignmentScore);

                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all p-6"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${alignmentBadge.color}`}
                          >
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {alignmentScore}% {alignmentBadge.label}
                            </span>
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{formatCO2(project.co2_reduction_calculated)}/year</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">${(project.funding_goal / 1000).toFixed(0)}k goal</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Endorsement Status */}
                    {project.endorsement_count > 0 && (
                      <div className="mb-4 flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">
                          <strong>{project.endorsement_count}</strong> NGO{project.endorsement_count !== 1 && 's'} already
                          endorsed
                          {project.highest_endorsement_level !== 'NONE' && (
                            <span className="ml-2 text-green-600">
                              (Highest: {project.highest_endorsement_level})
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/ngo/endorse/${project.id}`)}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Endorse This Project
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
