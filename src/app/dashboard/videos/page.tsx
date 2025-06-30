'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import { formatDuration } from '@/lib/video';

interface Video {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
  originalFileName: string;
  originalFileSize: number;
  duration?: number;
  thumbnailUrl?: string;
  hlsUrl?: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  specialty?: string;
  tags: string[];
  privacy: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    specialties: string[];
  };
  _count: {
    views: number;
    interactions: number;
    chapters: number;
  };
}

export default function VideosPage() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    specialty: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/videos/upload?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data.videos);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchVideos();
    }
  }, [session, filters]);

  const handleUploadComplete = (videoId: string) => {
    setShowUpload(false);
    fetchVideos(); // Refresh the list
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY':
        return 'text-green-600 bg-green-100';
      case 'PROCESSING':
        return 'text-yellow-600 bg-yellow-100';
      case 'UPLOADING':
        return 'text-blue-600 bg-blue-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SURGICAL_RECORDING':
        return '🏥';
      case 'LECTURE':
        return '🎓';
      case 'CASE_PRESENTATION':
        return '📋';
      case 'CONFERENCE_RECORDING':
        return '🎤';
      default:
        return '🎬';
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in</h1>
          <p className="text-gray-600 mt-2">
            You need to be signed in to manage videos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Video Management
            </h1>
            <p className="text-gray-600 mt-2">
              Upload and manage your medical videos
            </p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showUpload ? 'Hide Upload' : 'Upload Video'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Component */}
        {showUpload && (
          <div className="mb-8">
            <VideoUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="SURGICAL_RECORDING">Surgical Recording</option>
                <option value="LECTURE">Lecture</option>
                <option value="CASE_PRESENTATION">Case Presentation</option>
                <option value="CONFERENCE_RECORDING">
                  Conference Recording
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="READY">Ready</option>
                <option value="PROCESSING">Processing</option>
                <option value="UPLOADING">Uploading</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={filters.specialty}
                onChange={(e) =>
                  handleFilterChange('specialty', e.target.value)
                }
                placeholder="e.g., Cardiology"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    type: '',
                    status: '',
                    specialty: '',
                    page: 1,
                    limit: 10,
                  })
                }
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-600 mb-6">
              Start by uploading your first medical video.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Your First Video
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">{getTypeIcon(video.type)}</div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(video.status)}`}
                      >
                        {video.status}
                      </span>
                    </div>

                    {/* Duration */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        {(video.originalFileSize / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-gray-600">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {video.viewCount}
                        </span>
                        <span className="flex items-center text-gray-600">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {video.likeCount}
                        </span>
                      </div>

                      {video.specialty && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {video.specialty}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {video.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {video.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {video.tags.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{video.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-md ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Video Detail Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedVideo.title}
                  </h2>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Video Player */}
                {selectedVideo.hlsUrl && selectedVideo.status === 'READY' && (
                  <div className="mb-6">
                    <VideoPlayer
                      videoId={selectedVideo.id}
                      hlsUrl={selectedVideo.hlsUrl}
                      title={selectedVideo.title}
                      description={selectedVideo.description}
                    />
                  </div>
                )}

                {/* Video Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Details
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Status:</dt>
                        <dd>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedVideo.status)}`}
                          >
                            {selectedVideo.status}
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Type:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo.type.replace('_', ' ')}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Specialty:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo.specialty || 'Not specified'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Privacy:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo.privacy}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Duration:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo.duration
                            ? formatDuration(selectedVideo.duration)
                            : 'Unknown'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">File size:</dt>
                        <dd className="text-gray-900">
                          {(
                            selectedVideo.originalFileSize /
                            (1024 * 1024)
                          ).toFixed(1)}{' '}
                          MB
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Created:</dt>
                        <dd className="text-gray-900">
                          {new Date(
                            selectedVideo.createdAt
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Analytics
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Views:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo.viewCount}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Likes:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo.likeCount}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Shares:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo.shareCount}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Unique views:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo._count.views}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Interactions:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo._count.interactions}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Chapters:</dt>
                        <dd className="text-gray-900">
                          {selectedVideo._count.chapters}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Description */}
                {selectedVideo.description && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedVideo.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
