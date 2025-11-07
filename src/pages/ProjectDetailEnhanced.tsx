/**
 * Enhanced Project Detail Page - Investor-Focused Experience
 * Features: Tab navigation, Impact calculator, Live counters, Social proof
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Heart,
  TrendingUp,
  Shield,
  Award,
  Users,
  Clock,
  MapPin,
} from 'lucide-react';
import { EnhancedProject } from '../types/project-enhanced';
import { useDataStore } from '../store/dataStore';

// Import tab components (to be created)
import OverviewTab from '../components/projects/tabs/OverviewTab';
import FinancialsTab from '../components/projects/tabs/FinancialsTab';
import VerificationTab from '../components/projects/tabs/VerificationTab';
import UpdatesTab from '../components/projects/tabs/UpdatesTab';
import InvestmentTab from '../components/projects/tabs/InvestmentTab';

// Import shared components
import LiveImpactCounter from '../components/projects/LiveImpactCounter';
import ProjectBadges from '../components/projects/ProjectBadges';
import SocialProof from '../components/projects/SocialProof';

type TabType = 'overview' | 'financials' | 'verification' | 'updates' | 'investment';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Genel Bakış', icon: TrendingUp },
  { id: 'financials', label: 'Finansal', icon: TrendingUp },
  { id: 'verification', label: 'Doğrulama', icon: Shield },
  { id: 'updates', label: 'Güncellemeler', icon: Clock },
  { id: 'investment', label: 'Yatırım Yap', icon: Award },
];

export default function ProjectDetailEnhanced() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects } = useDataStore();

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [project, setProject] = useState<EnhancedProject | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to fetch EnhancedProject
      const baseProject = getProjectById(id);
      if (baseProject) {
        // For now, cast to EnhancedProject (in production, fetch full data)
        setProject(baseProject as any as EnhancedProject);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title,
        text: project?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandı!');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like API call
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proje bulunamadı</h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-green-600 hover:text-green-700"
          >
            Projelere dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Projelere Dön
          </button>

          {/* Project Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Title, Badges, Location */}
            <div className="flex-1">
              <div className="flex items-start space-x-4 mb-4">
                {/* Project Image */}
                <img
                  src={project.images?.[0] || '/placeholder-project.jpg'}
                  alt={project.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                {/* Title & Badges */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h1>
                  <ProjectBadges badges={project.badges} />
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <SocialProof
                totalInvestors={project.investorCount || 0}
                averageRating={project.socialProof?.averageRating || 0}
                totalReviews={project.socialProof?.totalReviews || 0}
              />
            </div>

            {/* Right: Actions & Quick Stats */}
            <div className="mt-4 lg:mt-0 lg:ml-8 flex flex-col space-y-4">
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-lg border ${
                    isLiked
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Hedef</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${(project.fundingGoal / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">İlerleme</div>
                    <div className="text-lg font-bold text-green-600">
                      {project.fundingProgress || 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Yatırımcı</div>
                    <div className="text-lg font-bold text-gray-900">
                      {project.investorCount || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Kalan Gün</div>
                    <div className="text-lg font-bold text-orange-600">
                      {project.daysRemaining || 0}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setActiveTab('investment')}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    <Award className="h-5 w-5 mr-2" />
                    Yatırım Yap
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Impact Counter */}
      <LiveImpactCounter project={project} />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab project={project} />}
            {activeTab === 'financials' && <FinancialsTab project={project} />}
            {activeTab === 'verification' && <VerificationTab project={project} />}
            {activeTab === 'updates' && <UpdatesTab project={project} />}
            {activeTab === 'investment' && <InvestmentTab project={project} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
