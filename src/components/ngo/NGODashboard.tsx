/**
 * NGO Dashboard Component
 * Central control panel for NGO organizations
 * Provides overview, project discovery, endorsement management, and impact tracking
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Building2,
  TrendingUp,
  Heart,
  Leaf,
  Users,
  DollarSign,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  Calendar,
  BarChart3,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Globe,
  FileText,
  RefreshCw,
  Loader,
} from 'lucide-react';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import {
  getNGOEndorsements,
  getNGOProfile,
  NGOEndorsement,
  NGOProfile,
} from '../../services/api/ngoApi';
import { getPendingProjects, Project } from '../../services/api/workflowApi';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'discover' | 'endorsed' | 'impact' | 'settings';

export default function NGODashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [ngoProfile, setNgoProfile] = useState<NGOProfile | null>(null);
  const [endorsements, setEndorsements] = useState<NGOEndorsement[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);

  // Load NGO profile
  const {
    execute: loadProfile,
    loading: profileLoading,
    error: profileError,
  } = useAsyncOperation(
    async () => {
      const response = await getNGOProfile();
      if (response.success && response.data) {
        setNgoProfile(response.data);
      }
    },
    { executeOnMount: true }
  );

  // Load endorsements
  const {
    execute: loadEndorsements,
    loading: endorsementsLoading,
    error: endorsementsError,
  } = useAsyncOperation(
    async () => {
      const response = await getNGOEndorsements();
      if (response.success && response.data) {
        setEndorsements(response.data);
      }
    },
    { executeOnMount: true }
  );

  // Load available projects
  const {
    execute: loadAvailableProjects,
    loading: projectsLoading,
    error: projectsError,
  } = useAsyncOperation(
    async () => {
      const response = await getPendingProjects();
      if (response.success && response.data) {
        // Filter for projects in review stages
        const eligibleProjects = response.data.filter(
          (p) => p.current_stage === 'under_verification' || p.current_stage === 'pending_admin_review'
        );
        setAvailableProjects(eligibleProjects);
      }
    },
    { executeOnMount: true }
  );

  // Calculate metrics
  const totalEndorsements = endorsements.length;
  const activeEndorsements = endorsements.filter((e) => e.status === 'active').length;
  const pendingEndorsements = endorsements.filter((e) => e.status === 'pending').length;
  const totalImpact = endorsements.reduce((sum, e) => sum + (e.project?.co2_reduction_calculated || 0), 0);
  const totalFundsSupported = endorsements.reduce((sum, e) => sum + (e.project?.funding_raised || 0), 0);

  // Support level distribution
  const supportDistribution = endorsements.reduce((acc, e) => {
    acc[e.support_level] = (acc[e.support_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Refresh all data
  const handleRefresh = () => {
    loadProfile();
    loadEndorsements();
    loadAvailableProjects();
    toast.success('Dashboard refreshed');
  };

  // Tab configuration
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'discover' as const, label: 'Discover Projects', icon: Search },
    { id: 'endorsed' as const, label: 'My Endorsements', icon: Award },
    { id: 'impact' as const, label: 'Impact Report', icon: TrendingUp },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-10 h-10" />
              <h1 className="text-3xl font-bold">
                {ngoProfile?.official_name || 'NGO Dashboard'}
              </h1>
            </div>
            <p className="text-green-100 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {ngoProfile?.country || 'Loading...'}
            </p>
            {ngoProfile?.verification_status === 'verified' && (
              <div className="mt-3 flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Verified NGO</span>
              </div>
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={profileLoading || endorsementsLoading || projectsLoading}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${profileLoading || endorsementsLoading || projectsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{activeEndorsements}</span>
          </div>
          <p className="text-sm text-gray-600">Active Endorsements</p>
          {pendingEndorsements > 0 && (
            <p className="text-xs text-yellow-600 mt-1">{pendingEndorsements} pending</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Leaf className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              {(totalImpact / 1000).toFixed(1)}k
            </span>
          </div>
          <p className="text-sm text-gray-600">Total CO₂ Reduction (tons/year)</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-gray-900">
              ${(totalFundsSupported / 1000).toFixed(0)}k
            </span>
          </div>
          <p className="text-sm text-gray-600">Funds Supported</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <Search className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{availableProjects.length}</span>
          </div>
          <p className="text-sm text-gray-600">Projects Available</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>

              {/* Support Level Distribution */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Support Level Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['LOW', 'MEDIUM', 'HIGH', 'FULL'].map((level) => (
                    <div
                      key={level}
                      className={`p-4 rounded-lg ${
                        level === 'LOW'
                          ? 'bg-gray-100 border border-gray-300'
                          : level === 'MEDIUM'
                          ? 'bg-yellow-50 border border-yellow-300'
                          : level === 'HIGH'
                          ? 'bg-blue-50 border border-blue-300'
                          : 'bg-green-50 border border-green-300'
                      }`}
                    >
                      <div className="text-2xl font-bold text-gray-900">
                        {supportDistribution[level] || 0}
                      </div>
                      <div className="text-sm text-gray-600">{level} Support</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {endorsements.slice(0, 5).map((endorsement) => (
                    <div
                      key={endorsement.id}
                      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                    >
                      <Award
                        className={`w-10 h-10 ${
                          endorsement.support_level === 'FULL'
                            ? 'text-green-600'
                            : endorsement.support_level === 'HIGH'
                            ? 'text-blue-600'
                            : endorsement.support_level === 'MEDIUM'
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {endorsement.project?.title || 'Project'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {endorsement.support_level} support • Endorsed{' '}
                          {new Date(endorsement.endorsed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          endorsement.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : endorsement.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {endorsement.status}
                      </span>
                    </div>
                  ))}
                  {endorsements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No endorsements yet</p>
                      <button
                        onClick={() => setActiveTab('discover')}
                        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                      >
                        Discover Projects
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Discover Projects Tab */}
          {activeTab === 'discover' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Discover Projects</h2>
                <button
                  onClick={() => navigate('/ngo/discovery')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Advanced Search
                </button>
              </div>

              {projectsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-green-600" />
                </div>
              ) : projectsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Failed to load projects</p>
                    <p className="text-sm text-red-600">{projectsError}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableProjects.slice(0, 6).map((project) => (
                    <div
                      key={project.id}
                      className="bg-white border border-gray-200 rounded-lg p-5 hover:border-green-300 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Leaf className="w-4 h-4" />
                          {project.co2_reduction_calculated.toLocaleString()} tons/year
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${(project.funding_goal / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="flex-1 px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/ngo/endorse/${project.id}`)}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Endorse
                        </button>
                      </div>
                    </div>
                  ))}
                  {availableProjects.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No projects available for endorsement</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* My Endorsements Tab */}
          {activeTab === 'endorsed' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">My Endorsements</h2>

              {endorsementsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-green-600" />
                </div>
              ) : endorsementsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Failed to load endorsements</p>
                    <p className="text-sm text-red-600">{endorsementsError}</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Project
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Support Level
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Impact
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {endorsements.map((endorsement) => (
                        <tr key={endorsement.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {endorsement.project?.title || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                endorsement.support_level === 'FULL'
                                  ? 'bg-green-100 text-green-800'
                                  : endorsement.support_level === 'HIGH'
                                  ? 'bg-blue-100 text-blue-800'
                                  : endorsement.support_level === 'MEDIUM'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {endorsement.support_level}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                endorsement.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : endorsement.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {endorsement.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(endorsement.endorsed_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {endorsement.project?.co2_reduction_calculated
                              ? `${endorsement.project.co2_reduction_calculated.toLocaleString()} tons/yr`
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                navigate(`/projects/${endorsement.project_id}`)
                              }
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              View Project
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {endorsements.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No endorsements yet</p>
                      <button
                        onClick={() => setActiveTab('discover')}
                        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                      >
                        Discover Projects
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Impact Report Tab */}
          {activeTab === 'impact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Impact Report</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                  <Leaf className="w-12 h-12 text-green-600 mb-3" />
                  <div className="text-3xl font-bold text-green-900">
                    {(totalImpact / 1000).toFixed(1)}k
                  </div>
                  <p className="text-sm text-green-700">Total CO₂ Reduction (tons/year)</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                  <Users className="w-12 h-12 text-blue-600 mb-3" />
                  <div className="text-3xl font-bold text-blue-900">{totalEndorsements}</div>
                  <p className="text-sm text-blue-700">Projects Endorsed</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
                  <DollarSign className="w-12 h-12 text-yellow-600 mb-3" />
                  <div className="text-3xl font-bold text-yellow-900">
                    ${(totalFundsSupported / 1000).toFixed(0)}k
                  </div>
                  <p className="text-sm text-yellow-700">Total Funds Supported</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Over Time</h3>
                <p className="text-gray-600 text-sm">
                  Impact charts and detailed analytics will be available soon.
                </p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">NGO Settings</h2>

              {profileLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-green-600" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Organization Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Official Name
                        </label>
                        <p className="text-gray-900">{ngoProfile?.official_name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Country</label>
                        <p className="text-gray-900">{ngoProfile?.country || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Registration Number
                        </label>
                        <p className="text-gray-900">
                          {ngoProfile?.registration_number || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <p className="text-gray-900">
                          {ngoProfile?.website ? (
                            <a
                              href={ngoProfile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700"
                            >
                              {ngoProfile.website}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Verification Status
                    </h3>
                    <div className="flex items-center gap-3">
                      {ngoProfile?.verification_status === 'verified' ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Verified NGO</p>
                            <p className="text-sm text-gray-600">
                              Your organization has been verified
                            </p>
                          </div>
                        </>
                      ) : ngoProfile?.verification_status === 'pending' ? (
                        <>
                          <Clock className="w-6 h-6 text-yellow-600" />
                          <div>
                            <p className="font-medium text-gray-900">Pending Verification</p>
                            <p className="text-sm text-gray-600">
                              Your application is under review
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Not Verified</p>
                            <p className="text-sm text-gray-600">
                              Complete verification to endorse projects
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
