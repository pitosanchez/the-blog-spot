"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calculateCMEPrice } from '@/lib/cme';

interface CMEActivity {
  id: string;
  title: string;
  credits: number;
  price: number;
  releaseDate: string;
  expirationDate: string;
  learningObjectives: string[];
  author: {
    id: string;
    email: string;
    medicalCredentials?: any;
    verificationStatus: string;
  };
  tags: string[];
}

export default function DiscoverCMEPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<CMEActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    creditType: '',
    searchTerm: '',
  });

  useEffect(() => {
    fetchCMEActivities();
  }, [filters]);

  const fetchCMEActivities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.creditType) params.append('creditType', filters.creditType);

      const response = await fetch(`/api/cme/activities?${params}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching CME activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    activity.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()))
  );

  const handleEnroll = (activityId: string) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    router.push(`/cme/activity/${activityId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CME Activities</h1>
          <p className="mt-2 text-gray-600">
            Discover accredited continuing medical education content
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search activities..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specialties</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Surgery">Surgery</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
                <option value="Family Medicine">Family Medicine</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Type
              </label>
              <select
                value={filters.creditType}
                onChange={(e) => setFilters(prev => ({ ...prev, creditType: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="AMA_PRA_1">AMA PRA Category 1</option>
                <option value="AMA_PRA_2">AMA PRA Category 2</option>
                <option value="AAFP">AAFP Prescribed</option>
                <option value="ACEP">ACEP Approved</option>
                <option value="AOA">AOA Category 1-A</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ specialty: '', creditType: '', searchTerm: '' })}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Activities Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          🏆 {activity.credits} Credits
                        </span>
                        <span className="flex items-center">
                          💰 ${activity.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {activity.author.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.author.email}
                        </p>
                        {activity.author.verificationStatus === 'VERIFIED' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Learning Objectives */}
                  {activity.learningObjectives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Objectives:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {activity.learningObjectives.slice(0, 2).map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {objective}
                          </li>
                        ))}
                        {activity.learningObjectives.length > 2 && (
                          <li className="text-gray-500 italic">
                            +{activity.learningObjectives.length - 2} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {activity.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {activity.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expiration Info */}
                  <div className="mb-4 text-sm text-gray-600">
                    <p>Expires: {new Date(activity.expirationDate).toLocaleDateString()}</p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleEnroll(activity.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Start Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CME Activities Found</h3>
            <p className="text-gray-600 mb-4">
              {filters.searchTerm || filters.specialty || filters.creditType
                ? 'Try adjusting your search filters to find more activities.'
                : 'No CME activities are currently available.'}
            </p>
            {session?.user?.role === 'CREATOR' && (
              <Link
                href="/create/cme"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create CME Activity
              </Link>
            )}
          </div>
        )}

        {/* Create CME CTA for Creators */}
        {session?.user?.role === 'CREATOR' && filteredActivities.length > 0 && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Share Your Medical Expertise
            </h3>
            <p className="text-blue-800 mb-4">
              Create accredited CME activities and earn revenue from your medical knowledge.
            </p>
            <Link
              href="/create/cme"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create CME Activity
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}