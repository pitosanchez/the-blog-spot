'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatDuration, validateVideoFile } from '@/lib/video';

interface VideoUploadProps {
  onUploadComplete: (videoId: string) => void;
  onUploadError: (error: string) => void;
  maxFileSize?: number;
  acceptedFormats?: string[];
}

interface UploadProgress {
  stage: 'selecting' | 'uploading' | 'processing' | 'complete';
  percentage: number;
  message: string;
}

export default function VideoUpload({
  onUploadComplete,
  onUploadError,
  maxFileSize = 5 * 1024 * 1024 * 1024, // 5GB
  acceptedFormats = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/webm',
  ],
}: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<UploadProgress>({
    stage: 'selecting',
    percentage: 0,
    message: 'Select a video file to upload',
  });
  const [videoMetadata, setVideoMetadata] = useState({
    title: '',
    description: '',
    type: 'LECTURE',
    specialty: '',
    tags: [] as string[],
    privacy: 'PRIVATE',
  });
  const [isUploading, setIsUploading] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const validation = validateVideoFile(file);
      if (!validation.valid) {
        onUploadError(validation.error || 'Invalid file');
        return;
      }

      setSelectedFile(file);
      setVideoMetadata((prev) => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      }));
      setProgress({
        stage: 'selecting',
        percentage: 0,
        message: `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
      });
    },
    [onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': acceptedFormats.map((format) => format.split('/')[1]),
    },
    maxSize: maxFileSize,
    multiple: false,
  });

  const handleMetadataChange = (field: string, value: any) => {
    setVideoMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    handleMetadataChange('tags', tags);
  };

  const uploadToS3 = async (
    file: File,
    uploadUrl: string,
    onProgress: (progress: number) => void
  ) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      abortController.current = new AbortController();
      abortController.current.signal.addEventListener('abort', () => {
        xhr.abort();
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const startUpload = async () => {
    if (!selectedFile) {
      onUploadError('No file selected');
      return;
    }

    if (!videoMetadata.title.trim()) {
      onUploadError('Please provide a title for your video');
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Get presigned upload URL
      setProgress({
        stage: 'uploading',
        percentage: 0,
        message: 'Preparing upload...',
      });

      const uploadResponse = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          ...videoMetadata,
        }),
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Failed to prepare upload');
      }

      const { videoId, uploadUrl } = await uploadResponse.json();

      // Step 2: Upload to S3
      setProgress({
        stage: 'uploading',
        percentage: 0,
        message: 'Uploading video...',
      });

      await uploadToS3(selectedFile, uploadUrl, (progress) => {
        setProgress({
          stage: 'uploading',
          percentage: progress,
          message: `Uploading... ${progress.toFixed(1)}%`,
        });
      });

      // Step 3: Start processing
      setProgress({
        stage: 'processing',
        percentage: 0,
        message: 'Starting video processing...',
      });

      const processResponse = await fetch('/api/videos/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          processingOptions: {
            qualities: ['1080p', '720p', '480p'],
            generateThumbnails: true,
            enableCaptions: false,
          },
        }),
      });

      if (!processResponse.ok) {
        const error = await processResponse.json();
        throw new Error(error.error || 'Failed to start processing');
      }

      setProgress({
        stage: 'complete',
        percentage: 100,
        message: 'Upload complete! Processing in background...',
      });

      onUploadComplete(videoId);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
      setProgress({
        stage: 'selecting',
        percentage: 0,
        message: 'Upload failed - please try again',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setIsUploading(false);
    setProgress({
      stage: 'selecting',
      percentage: 0,
      message: 'Upload cancelled',
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Upload Medical Video
      </h2>

      {/* File Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : selectedFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          {selectedFile ? (
            <>
              <div className="text-green-600">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-gray-400">
                <svg
                  className="mx-auto h-12 w-12"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive
                    ? 'Drop your video here'
                    : 'Drag and drop your video file'}
                </p>
                <p className="text-sm text-gray-500">
                  Or click to browse • Max {maxFileSize / (1024 * 1024 * 1024)}
                  GB
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supported: MP4, AVI, MOV, WMV, WebM
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="mt-6 space-y-4">
          {/* Video Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={videoMetadata.title}
                onChange={(e) => handleMetadataChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={videoMetadata.type}
                onChange={(e) => handleMetadataChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LECTURE">Medical Lecture</option>
                <option value="SURGICAL_RECORDING">Surgical Recording</option>
                <option value="CASE_PRESENTATION">Case Presentation</option>
                <option value="CONFERENCE_RECORDING">
                  Conference Recording
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Specialty
              </label>
              <input
                type="text"
                value={videoMetadata.specialty}
                onChange={(e) =>
                  handleMetadataChange('specialty', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Cardiology, Surgery"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Privacy
              </label>
              <select
                value={videoMetadata.privacy}
                onChange={(e) =>
                  handleMetadataChange('privacy', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PRIVATE">Private</option>
                <option value="UNLISTED">Unlisted</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={videoMetadata.description}
              onChange={(e) =>
                handleMetadataChange('description', e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your video content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={videoMetadata.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="surgery, cardiac, education"
            />
          </div>

          {/* Progress Bar */}
          {progress.stage !== 'selecting' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{progress.message}</span>
                <span className="text-gray-600">
                  {progress.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress.stage === 'complete'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Controls */}
          <div className="flex justify-end space-x-3">
            {isUploading ? (
              <button
                onClick={cancelUpload}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel Upload
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setProgress({
                      stage: 'selecting',
                      percentage: 0,
                      message: 'Select a video file to upload',
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear
                </button>
                <button
                  onClick={startUpload}
                  disabled={!videoMetadata.title.trim()}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Video
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
