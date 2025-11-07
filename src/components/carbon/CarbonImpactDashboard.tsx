import React, { useState, useEffect } from 'react';
import { Leaf, TrendingUp, Award, Calendar, TreePine, Car, Home, Plane } from 'lucide-react';
import { carbonService } from '../../services/carbonService';

interface Props {
  userId: string;
}

export default function CarbonImpactDashboard({ userId }: Props) {
  const [impact, setImpact] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [footprint, setFootprint] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  async function loadData() {
    try {
      setLoading(true);
      const [impactData, certs, fp] = await Promise.all([
        carbonService.getCurrentCarbonImpact(userId),
        carbonService.getUserCarbonCertificates(userId),
        carbonService.getUserCarbonFootprint(userId, 6)
      ]);

      setImpact(impactData);
      setCertificates(certs);
      setFootprint(fp);
    } catch (error) {
      console.error('Error loading carbon impact:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !impact) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const equivalents = carbonService.getImpactEquivalents(impact.totalOffset);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Offset</p>
              <p className="text-3xl font-bold mt-1">{impact.totalOffset.toFixed(2)}</p>
              <p className="text-sm text-green-100">tons CO₂</p>
            </div>
            <Leaf className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-bold mt-1">{impact.monthlyOffset.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className={`h-4 w-4 ${impact.trend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-sm ${impact.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(impact.trend).toFixed(0)}%
                </span>
              </div>
            </div>
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Certificates</p>
              <p className="text-2xl font-bold mt-1">{impact.certificates}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <Award className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Impact Score</p>
              <p className="text-2xl font-bold mt-1">{impact.impactScore.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Points</p>
            </div>
            <div className="text-3xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Equivalents */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Impact Equals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{equivalents.trees.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Trees Planted</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{equivalents.cars.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Cars Off Road</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Home className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{equivalents.homes.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Homes Powered</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Plane className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{equivalents.flights.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Flights Offset</p>
          </div>
        </div>
      </div>

      {/* Recent Certificates */}
      {certificates.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Your Carbon Certificates</h3>
          <div className="space-y-3">
            {certificates.slice(0, 5).map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{cert.certificate_number}</p>
                    <p className="text-sm text-gray-600">{cert.project?.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{cert.carbon_tons.toFixed(2)} tons</p>
                  <p className="text-xs text-gray-500">
                    {new Date(cert.issued_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Trend */}
      {footprint.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">6-Month Trend</h3>
          <div className="space-y-2">
            {footprint.map((fp) => (
              <div key={fp.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">
                  {new Date(fp.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-green-500 h-6 rounded-full flex items-center justify-end px-2"
                    style={{ width: `${Math.min(100, (fp.total_offset_tons / 10) * 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {fp.total_offset_tons.toFixed(1)} tons
                    </span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 w-20 text-right">
                  {fp.impact_score} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
