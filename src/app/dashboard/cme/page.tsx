"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getUserCMETranscript, 
  checkSpecialtyRequirements,
  exportCMETranscript,
  type CMETranscript 
} from '@/lib/cme';

interface SpecialtyProgress {
  meetsRequirements: boolean;
  currentCredits: number;
  requiredCredits: number;
  deficit: number;
  details: {
    category1Credits: number;
    minimumCategory1Required: number;
    acceptedTypes: string[];
  };
}

export default function CMEDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transcript, setTranscript] = useState<CMETranscript | null>(null);
  const [specialtyProgress, setSpecialtyProgress] = useState<SpecialtyProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    fetchCMEData();
  }, [session, status, router]);

  const fetchCMEData = async () => {
    setIsLoading(true);
    try {
      // Fetch transcript
      const transcriptResponse = await fetch('/api/cme/transcript');
      if (transcriptResponse.ok) {
        const transcriptData = await transcriptResponse.json();
        setTranscript(transcriptData);
      }

      // Check specialty requirements if user has specialties
      if (session?.user?.specialties?.length > 0) {
        const specialty = session.user.specialties[0];
        const progressResponse = await fetch(`/api/cme/requirements?specialty=${specialty}`);
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setSpecialtyProgress(progressData);
        }
      }
    } catch (error) {
      console.error('Error fetching CME data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'PDF' | 'CSV' | 'XML') => {
    setExportLoading(true);
    try {
      const response = await fetch('/api/cme/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });

      if (response.ok) {
        const { downloadUrl } = await response.json();
        window.open(downloadUrl, '_blank');
      } else {
        alert('Failed to export transcript');
      }
    } catch (error) {
      alert('Error exporting transcript');
    } finally {
      setExportLoading(false);
    }
  };

  const getYearlyCredits = (year: number) => {
    if (!transcript) return 0;
    return transcript.completions
      .filter(c => new Date(c.completionDate).getFullYear() === year)
      .reduce((sum, c) => sum + c.creditsEarned, 0);
  };

  const getCreditTypeBreakdown = () => {
    if (!transcript) return [];
    return Object.entries(transcript.creditsByType).map(([type, credits]) => ({
      type,
      credits,
      percentage: ((credits / transcript.totalCredits) * 100).toFixed(1),
    }));
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CME Credit Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Track your continuing medical education progress
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Link
                href="/discover/cme"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Browse CME Activities
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Credits</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {transcript?.totalCredits || 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">Lifetime earned</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">This Year</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {getYearlyCredits(selectedYear)}
            </p>
            <p className="mt-1 text-sm text-gray-600">{selectedYear} credits</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Activities</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {transcript?.completions.length || 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">Completed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-2">
              {specialtyProgress?.meetsRequirements ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Requirements Met
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {specialtyProgress?.deficit || 0} Credits Needed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specialty Requirements */}
            {specialtyProgress && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {session?.user?.specialties?.[0]} Requirements
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Annual Progress</span>
                      <span className="text-sm text-gray-600">
                        {specialtyProgress.currentCredits} / {specialtyProgress.requiredCredits} credits
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (specialtyProgress.currentCredits / specialtyProgress.requiredCredits) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Category 1 Credits</span>
                      <span className="text-sm font-medium">
                        {specialtyProgress.details.category1Credits} / {specialtyProgress.details.minimumCategory1Required}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Accepted Types</span>
                      <span className="text-sm">
                        {specialtyProgress.details.acceptedTypes.join(', ')}
                      </span>
                    </div>
                  </div>

                  {!specialtyProgress.meetsRequirements && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        You need {specialtyProgress.deficit} more credits to meet your annual requirement.
                      </p>
                      <Link
                        href="/discover/cme"
                        className="mt-2 inline-block text-sm font-medium text-yellow-900 hover:text-yellow-800"
                      >
                        Find CME Activities →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent CME Activities</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {transcript?.completions.slice(0, 5).map((completion, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          Activity #{completion.activityId.slice(-8)}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Completed {new Date(completion.completionDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {completion.creditsEarned} Credits
                        </p>
                        {completion.certificateUrl && (
                          <a
                            href={completion.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {transcript && transcript.completions.length > 5 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <Link
                    href="/dashboard/cme/history"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View All Activities →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credit Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Breakdown</h3>
              <div className="space-y-3">
                {getCreditTypeBreakdown().map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                      <span className="text-sm text-gray-600">{item.credits} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Transcript</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download your CME transcript for state board reporting or personal records.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleExport('PDF')}
                  disabled={exportLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => handleExport('CSV')}
                  disabled={exportLoading}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('XML')}
                  disabled={exportLoading}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  State Board Format (XML)
                </button>
              </div>
            </div>

            {/* Expiring Credits */}
            {transcript && transcript.expiringCredits.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">Expiring Credits</h3>
                <div className="space-y-2">
                  {transcript.expiringCredits.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-yellow-800">{item.credits} credits</span>
                      <span className="text-yellow-700">
                        Expires {new Date(item.expirationDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/cme/accreditation"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Accreditation Information
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cme/state-requirements"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    State Requirements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cme/faq"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    CME FAQ
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:cme@medipublish.com"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Contact CME Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}