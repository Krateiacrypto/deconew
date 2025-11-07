/**
 * Overview Tab Component
 * Features: Impact calculator, Timeline, Team, Location map, Description
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Briefcase,
  ExternalLink,
  CheckCircle,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { EnhancedProject } from '../../../types/project-enhanced';
import ImpactCalculator from '../ImpactCalculator';
import BeforeAfterSlider from '../BeforeAfterSlider';

interface OverviewTabProps {
  project: EnhancedProject;
}

export default function OverviewTab({ project }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Description */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Proje Hakkında</h2>
          <p className="text-gray-700 leading-relaxed">{project.description}</p>
        </section>

        {/* Before/After Slider */}
        {project.impactBeforeAfter && (
          <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Projenin Etkisi: Önce & Sonra
            </h2>
            <BeforeAfterSlider
              before={project.impactBeforeAfter.before[0]}
              after={project.impactBeforeAfter.after[0]}
            />
          </section>
        )}

        {/* Impact Calculator */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Etki Hesaplayıcı</h2>
          <p className="text-gray-600 mb-4">
            Yatırımınızın çevresel etkisini hesaplayın
          </p>
          <ImpactCalculator project={project} />
        </section>

        {/* Timeline Roadmap */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Proje Zaman Çizelgesi</h2>
          <div className="space-y-4">
            {project.milestones?.map((milestone, index) => {
              const isCompleted = milestone.status === 'completed';
              const isInProgress = milestone.status === 'in_progress';
              const isDelayed = milestone.status === 'delayed';

              let StatusIcon = Circle;
              let statusColor = 'text-gray-400';
              let bgColor = 'bg-gray-100';

              if (isCompleted) {
                StatusIcon = CheckCircle;
                statusColor = 'text-green-600';
                bgColor = 'bg-green-50';
              } else if (isInProgress) {
                StatusIcon = AlertCircle;
                statusColor = 'text-blue-600';
                bgColor = 'bg-blue-50';
              } else if (isDelayed) {
                StatusIcon = AlertCircle;
                statusColor = 'text-red-600';
                bgColor = 'bg-red-50';
              }

              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < project.milestones.length - 1 && (
                    <div
                      className={`absolute left-4 top-10 w-0.5 h-full ${
                        isCompleted ? 'bg-green-200' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-full ${bgColor} ${statusColor} z-10`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {milestone.description}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                          {new Date(milestone.targetDate).toLocaleDateString('tr-TR', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {!isCompleted && milestone.progress > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>İlerleme</span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                isDelayed ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Location Map Placeholder */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Proje Konumu</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Ülke</div>
                <div className="font-medium text-gray-900">
                  {project.locationDetails?.country || project.location}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Bölge</div>
                <div className="font-medium text-gray-900">
                  {project.locationDetails?.region || '-'}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Alan</div>
                <div className="font-medium text-gray-900">
                  {project.locationDetails?.area
                    ? `${project.locationDetails.area.toLocaleString()} hektar`
                    : '-'}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Koordinatlar</div>
                <div className="font-medium text-gray-900">
                  {project.locationDetails?.coordinates
                    ? `${project.locationDetails.coordinates.lat.toFixed(4)}, ${project.locationDetails.coordinates.lng.toFixed(4)}`
                    : '-'}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Harita yükleniyor...</p>
                <p className="text-sm mt-1">
                  (Leaflet/Mapbox entegrasyonu gelecek)
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column - Team & Partners */}
      <div className="space-y-6">
        {/* Team Section */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Proje Ekibi
          </h2>
          <div className="space-y-4">
            {project.team?.map((member) => (
              <div key={member.id} className="flex items-start space-x-3">
                <img
                  src={member.avatar || '/placeholder-avatar.jpg'}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners Section */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Ortaklar
          </h2>
          <div className="space-y-4">
            {project.partners?.map((partner) => (
              <div key={partner.id} className="flex items-center space-x-3">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-12 h-12 rounded object-contain bg-gray-50 p-1"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{partner.name}</h3>
                  <p className="text-xs text-gray-600 capitalize">
                    {partner.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-4">Hızlı Bilgiler</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Başlangıç Tarihi</span>
              <span className="font-medium text-gray-900">
                {new Date(project.startDate || Date.now()).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bitiş Tarihi</span>
              <span className="font-medium text-gray-900">
                {new Date(project.endDate || Date.now()).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ortalama Yatırım</span>
              <span className="font-medium text-gray-900">
                ${project.averageInvestment?.toLocaleString() || '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Min. Yatırım</span>
              <span className="font-medium text-gray-900">
                ${project.investmentRange?.min.toLocaleString() || '-'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
