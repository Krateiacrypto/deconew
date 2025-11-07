import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Plus, Search, Filter, MoreVertical, Eye, CreditCard as Edit, Trash2, TrendingUp, Users, DollarSign, Award, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

interface Project {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'active' | 'rejected';
  carbonCredits: number;
  fundingProgress: number;
  totalFunding: number;
  targetFunding: number;
  investors: number;
  createdAt: string;
  image: string;
}

export const ProviderProjectsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // TODO: Fetch projects from Supabase
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          title: 'Solar Energy Farm - Antalya',
          category: 'Renewable Energy',
          status: 'active',
          carbonCredits: 5000,
          fundingProgress: 75,
          totalFunding: 750000,
          targetFunding: 1000000,
          investors: 142,
          createdAt: '2024-09-15',
          image: '/api/placeholder/400/300',
        },
        {
          id: '2',
          title: 'Forest Restoration - Black Sea',
          category: 'Reforestation',
          status: 'approved',
          carbonCredits: 3000,
          fundingProgress: 45,
          totalFunding: 450000,
          targetFunding: 1000000,
          investors: 89,
          createdAt: '2024-10-01',
          image: '/api/placeholder/400/300',
        },
        {
          id: '3',
          title: 'Wind Power Installation',
          category: 'Renewable Energy',
          status: 'under_review',
          carbonCredits: 8000,
          fundingProgress: 0,
          totalFunding: 0,
          targetFunding: 2000000,
          investors: 0,
          createdAt: '2024-10-03',
          image: '/api/placeholder/400/300',
        },
      ]);
      setLoading(false);
    }, 500);
  }, [user?.id]);

  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Edit },
      submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock },
      under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: Award,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      label: 'Active Projects',
      value: projects.filter((p) => p.status === 'active').length,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'Total Funding',
      value: `$${projects.reduce((acc, p) => acc + p.totalFunding, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Total Investors',
      value: projects.reduce((acc, p) => acc + p.investors, 0),
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
        <p className="text-gray-600 mt-1">Manage your carbon offset projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Filter and Create */}
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
            </select>

            <Link
              to="/dashboard/provider/projects/new"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Project
            </Link>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first project'}
          </p>
          <Link
            to="/dashboard/provider/projects/new"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(project.status)}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.category}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Carbon Credits</p>
                    <p className="font-semibold text-gray-900">{project.carbonCredits.toLocaleString()} tCO₂</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Investors</p>
                    <p className="font-semibold text-gray-900">{project.investors}</p>
                  </div>
                </div>

                {/* Funding Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                    <span className="text-sm font-semibold text-emerald-600">{project.fundingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.fundingProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ${project.totalFunding.toLocaleString()} / ${project.targetFunding.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Link>
                  <Link
                    to={`/dashboard/provider/projects/${project.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
