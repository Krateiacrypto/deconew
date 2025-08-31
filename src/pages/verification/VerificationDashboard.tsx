import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  BarChart3,
  Upload,
  Download,
  Eye,
  Award
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const VerificationDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [pendingProjects, setPendingProjects] = useState([]);
  const [verifiedProjects, setVerifiedProjects] = useState([]);

  const stats = [
    {
      title: 'Bekleyen Doğrulama',
      value: 5,
      icon: Clock,
      color: 'yellow',
      change: '+2 bu hafta'
    },
    {
      title: 'Doğrulanmış Proje',
      value: 23,
      icon: CheckCircle,
      color: 'emerald',
      change: '+4 bu ay'
    },
    {
      title: 'Toplam Karbon Kredisi',
      value: '450K tCO₂',
      icon: Shield,
      color: 'blue',
      change: '+50K bu ay'
    },
    {
      title: 'Doğrulama Puanı',
      value: '98.5%',
      icon: Award,
      color: 'purple',
      change: '+0.5% bu ay'
    }
  ];

  const pendingVerifications = [
    {
      id: '1',
      projectName: 'Amazon Orman Koruma Projesi',
      submittedBy: 'EcoCarbon Solutions',
      submittedDate: '2024-01-20',
      carbonCredits: 125000,
      priority: 'high',
      type: 'forest_conservation'
    },
    {
      id: '2',
      projectName: 'Rüzgar Enerjisi Santrali',
      submittedBy: 'Green Energy Corp',
      submittedDate: '2024-01-18',
      carbonCredits: 89000,
      priority: 'medium',
      type: 'renewable_energy'
    }
  ];

  const quickActions = [
    {
      title: 'Proje Doğrulama',
      description: 'Bekleyen projeleri doğrula ve sertifikala',
      icon: Shield,
      color: 'emerald',
      href: '/verification/projects'
    },
    {
      title: 'Doğrulama Raporu',
      description: 'Teknik doğrulama raporu oluştur',
      icon: FileText,
      color: 'blue',
      href: '/verification/reports'
    },
    {
      title: 'Sertifika Yönetimi',
      description: 'Verilen sertifikaları yönet',
      icon: Award,
      color: 'purple',
      href: '/verification/certificates'
    },
    {
      title: 'Metodoloji Rehberi',
      description: 'Doğrulama metodolojilerini görüntüle',
      icon: BarChart3,
      color: 'orange',
      href: '/verification/methodology'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Doğrulama Kuruluşu Dashboard
          </h1>
          <p className="text-gray-600">
            {user?.organizationName} - Karbon kredisi projelerini doğrulayın ve sertifikalayın
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={action.title}
                href={action.href}
                className="group p-6 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Verifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Bekleyen Doğrulamalar</h3>
            <div className="space-y-4">
              {pendingVerifications.map((project) => (
                <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{project.projectName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.priority === 'high' ? 'bg-red-100 text-red-700' :
                      project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {project.priority === 'high' ? 'Yüksek' :
                       project.priority === 'medium' ? 'Orta' : 'Düşük'} Öncelik
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Gönderen: {project.submittedBy}</p>
                  <p className="text-sm text-gray-600 mb-3">Karbon Kredisi: {project.carbonCredits.toLocaleString()} tCO₂</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{project.submittedDate}</span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        İncele
                      </button>
                      <button className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700">
                        Doğrula
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h3>
            <div className="space-y-4">
              {[
                { action: 'Proje doğrulandı', project: 'Solar Energy Farm', time: '2 saat önce', type: 'success' },
                { action: 'Doğrulama raporu oluşturuldu', project: 'Wind Power Project', time: '5 saat önce', type: 'info' },
                { action: 'Sertifika yüklendi', project: 'Forest Conservation', time: '1 gün önce', type: 'success' },
                { action: 'Proje reddedildi', project: 'Invalid Project', time: '2 gün önce', type: 'error' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.project}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};