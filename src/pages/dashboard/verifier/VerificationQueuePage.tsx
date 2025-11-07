import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import {
  FileCheck,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Eye,
  DollarSign,
  Calendar,
  MapPin,
  Leaf,
} from 'lucide-react';

interface VerificationProject {
  id: string;
  title: string;
  provider: string;
  category: string;
  submittedAt: string;
  carbonCredits: number;
  location: string;
  priority: 'low' | 'medium' | 'high';
  documents: number;
  estimatedReward: number;
  deadline: string;
}

export const VerificationQueuePage: React.FC = () => {
  const [projects, setProjects] = useState<VerificationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Fetch from Supabase
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          title: 'Solar Energy Farm - Antalya',
          provider: 'Green Energy Solutions',
          category: 'Renewable Energy',
          submittedAt: '2024-10-04T10:30:00',
          carbonCredits: 5000,
          location: 'Antalya, Turkey',
          priority: 'high',
          documents: 8,
          estimatedReward: 175,
          deadline: '2024-10-07',
        },
        {
          id: '2',
          title: 'Forest Restoration Project',
          provider: 'EcoForest NGO',
          category: 'Reforestation',
          submittedAt: '2024-10-03T14:20:00',
          carbonCredits: 3000,
          location: 'Black Sea Region',
          priority: 'medium',
          documents: 12,
          estimatedReward: 150,
          deadline: '2024-10-08',
        },
        {
          id: '3',
          title: 'Wind Power Installation',
          provider: 'Renewable Energy Corp',
          category: 'Wind Energy',
          submittedAt: '2024-10-02T09:15:00',
          carbonCredits: 8000,
          location: 'Aegean Coast',
          priority: 'high',
          documents: 15,
          estimatedReward: 200,
          deadline: '2024-10-06',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getPriorityBadge = (priority: VerificationProject['priority']) => {
    const config = {
      high: { label: 'High Priority', color: 'bg-red-100 text-red-700' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
      low: { label: 'Low', color: 'bg-gray-100 text-gray-700' },
    };
    const { label, color } = config[priority];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return `${hours} hours left`;
    }
    const days = Math.floor(hours / 24);
    return `${days} days left`;
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || project.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: 'Pending Verifications',
      value: projects.length,
      icon: Clock,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      label: 'High Priority',
      value: projects.filter((p) => p.priority === 'high').length,
      icon: AlertCircle,
      color: 'text-red-600 bg-red-100',
    },
    {
      label: 'Est. Total Rewards',
      value: `$${projects.reduce((acc, p) => acc + p.estimatedReward, 0)}`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Total Carbon Credits',
      value: `${projects.reduce((acc, p) => acc + p.carbonCredits, 0).toLocaleString()} tCO₂`,
      icon: Leaf,
      color: 'text-emerald-600 bg-emerald-100',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verification Queue</h1>
        <p className="text-gray-600 mt-1">
          Review and verify carbon offset projects to earn rewards
        </p>
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

      {/* Reward Info Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Verification Reward System</h3>
            <p className="text-emerald-50 text-sm mb-1">Base Reward: $100 per verification</p>
            <p className="text-emerald-50 text-sm mb-1">Accuracy Bonus: Up to +$50 (95%+ accuracy)</p>
            <p className="text-emerald-50 text-sm">Speed Bonus: +$25 (Fast-track completion)</p>
          </div>
          <Award className="w-16 h-16 opacity-50" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
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

          <div className="flex items-center space-x-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects in queue</h3>
          <p className="text-gray-600">All caught up! Check back later for new verification requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    {getPriorityBadge(project.priority)}
                  </div>
                  <p className="text-sm text-gray-600">{project.provider}</p>
                </div>
                <Link
                  to={`/dashboard/verifier/${project.id}/verify`}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium inline-flex items-center"
                >
                  <FileCheck className="w-5 h-5 mr-2" />
                  Start Verification
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>{project.carbonCredits.toLocaleString()} tCO₂</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                  <span>{project.documents} documents</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Est. ${project.estimatedReward}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Submitted {new Date(project.submittedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center text-orange-600 font-medium">
                    <Calendar className="w-4 h-4 mr-1" />
                    {getTimeRemaining(project.deadline)}
                  </span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                  {project.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};
