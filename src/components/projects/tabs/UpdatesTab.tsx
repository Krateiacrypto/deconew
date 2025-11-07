/**
 * Updates Tab Component
 * Project updates, Progress photos/videos, Milestone achievements, Community discussions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Image,
  Video,
  FileText,
  MessageCircle,
  ThumbsUp,
  Share2,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { EnhancedProject } from '../../../types/project-enhanced';

interface UpdatesTabProps {
  project: EnhancedProject;
}

export default function UpdatesTab({ project }: UpdatesTabProps) {
  const [likedUpdates, setLikedUpdates] = useState<Set<string>>(new Set());

  const handleLike = (updateId: string) => {
    setLikedUpdates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(updateId)) {
        newSet.delete(updateId);
      } else {
        newSet.add(updateId);
      }
      return newSet;
    });
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return CheckCircle;
      case 'progress':
        return TrendingUp;
      case 'media':
        return Image;
      case 'announcement':
        return FileText;
      default:
        return Calendar;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'media':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'announcement':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Updates Feed */}
      <div className="lg:col-span-2 space-y-6">
        {project.updates?.map((update, index) => {
          const Icon = getUpdateIcon(update.type);
          const colorClass = getUpdateColor(update.type);
          const isLiked = likedUpdates.has(update.id);

          return (
            <motion.article
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {update.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(update.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span>{update.author}</span>
                      </div>
                    </div>
                  </div>
                  {update.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      Öne Çıkan
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                  <p>{update.content}</p>
                </div>

                {/* Media */}
                {update.media && update.media.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {update.media.slice(0, 4).map((media, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                      >
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={media.caption || `Update media ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                            <Video className="h-12 w-12 text-white" />
                          </div>
                        )}
                        {media.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-xs">{media.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {update.media.length > 4 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        +{update.media.length - 4} daha
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {update.tags && update.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {update.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer - Actions */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(update.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      isLiked
                        ? 'text-red-600'
                        : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                    />
                    <span>{(update.likes || 0) + (isLiked ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{update.comments || 0}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Paylaş</span>
                  </button>
                </div>
                {update.impactMetrics && (
                  <div className="text-sm text-green-600 font-medium">
                    +{update.impactMetrics.co2Reduction} ton CO₂
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}

        {(!project.updates || project.updates.length === 0) && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz güncelleme bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Milestone Progress */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Kilometre Taşları
          </h2>
          <div className="space-y-4">
            {project.milestones?.slice(0, 5).map((milestone, index) => {
              const isCompleted = milestone.status === 'completed';
              return (
                <div key={milestone.id} className="flex items-start space-x-3">
                  <div
                    className={`mt-1 rounded-full p-1 ${
                      isCompleted ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {new Date(milestone.targetDate).toLocaleDateString('tr-TR', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {!isCompleted && milestone.progress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Update Statistics */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-4">Güncelleme İstatistikleri</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Toplam Güncelleme</span>
              <span className="font-semibold text-gray-900">
                {project.updates?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bu Ay</span>
              <span className="font-semibold text-green-700">
                {project.updates?.filter(
                  (u) =>
                    new Date(u.date).getMonth() === new Date().getMonth() &&
                    new Date(u.date).getFullYear() === new Date().getFullYear()
                ).length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Medya İçeriği</span>
              <span className="font-semibold text-purple-700">
                {project.updates?.reduce(
                  (sum, u) => sum + (u.media?.length || 0),
                  0
                ) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Toplam Beğeni</span>
              <span className="font-semibold text-red-700">
                {project.updates?.reduce((sum, u) => sum + (u.likes || 0), 0) || 0}
              </span>
            </div>
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">
            Güncellemeleri Takip Edin
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Proje güncellemelerini e-posta ile alın
          </p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            E-posta Bildirimleri
          </button>
        </section>

        {/* Community Activity */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Topluluk Aktivitesi</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">
                <strong>124</strong> yorum
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4 text-red-600" />
              <span className="text-gray-700">
                <strong>2.5K</strong> beğeni
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">
                <strong>487</strong> paylaşım
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
