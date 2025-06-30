'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDuration } from '@/lib/video';

interface VideoAnnotation {
  id: string;
  timestamp: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text: string;
  type: 'arrow' | 'label' | 'measurement' | 'anatomy' | 'instrument';
  color?: string;
}

interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime?: number;
  description?: string;
}

interface VideoPlayerProps {
  videoId: string;
  hlsUrl?: string;
  title: string;
  description?: string;
  chapters?: VideoChapter[];
  annotations?: VideoAnnotation[];
  autoplay?: boolean;
  controls?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

export default function VideoPlayer({
  videoId,
  hlsUrl,
  title,
  description,
  chapters = [],
  annotations = [],
  autoplay = false,
  controls = true,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentChapter, setCurrentChapter] = useState<VideoChapter | null>(
    null
  );
  const [visibleAnnotations, setVisibleAnnotations] = useState<
    VideoAnnotation[]
  >([]);
  const [showChapters, setShowChapters] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [quality, setQuality] = useState('auto');

  // Track video analytics
  const analyticsRef = useRef({
    startTime: Date.now(),
    totalWatchTime: 0,
    lastUpdateTime: 0,
    engagementPoints: [] as { timestamp: number; engagement: number }[],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);

      // Update analytics
      const now = Date.now();
      if (analyticsRef.current.lastUpdateTime > 0) {
        analyticsRef.current.totalWatchTime +=
          (now - analyticsRef.current.lastUpdateTime) / 1000;
      }
      analyticsRef.current.lastUpdateTime = now;

      // Update current chapter
      const chapter = chapters.find(
        (ch) => time >= ch.startTime && (!ch.endTime || time < ch.endTime)
      );
      setCurrentChapter(chapter || null);

      // Update visible annotations
      const visible = annotations.filter(
        (ann) => Math.abs(ann.timestamp - time) < 1 // Show annotations within 1 second
      );
      setVisibleAnnotations(visible);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      analyticsRef.current.lastUpdateTime = Date.now();
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      analyticsRef.current.lastUpdateTime = 0;
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();

      // Send final analytics
      trackVideoAnalytics('video_completed', {
        totalWatchTime: analyticsRef.current.totalWatchTime,
        completionRate: (analyticsRef.current.totalWatchTime / duration) * 100,
      });
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [chapters, annotations, duration, onTimeUpdate, onPlay, onPause, onEnded]);

  const trackVideoAnalytics = useCallback(
    async (event: string, data: any) => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: event,
            eventData: {
              videoId,
              ...data,
              timestamp: Date.now(),
            },
          }),
        });
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
    },
    [videoId]
  );

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    trackVideoAnalytics('video_seek', { fromTime: currentTime, toTime: time });
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    video.muted = newVolume === 0;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    trackVideoAnalytics('playback_rate_change', { rate });
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const jumpToChapter = (chapter: VideoChapter) => {
    handleSeek(chapter.startTime);
    setShowChapters(false);
  };

  const renderAnnotations = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !showAnnotations) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw annotations
    visibleAnnotations.forEach((annotation) => {
      const x = (annotation.x / 100) * canvas.width;
      const y = (annotation.y / 100) * canvas.height;

      ctx.fillStyle = annotation.color || '#FF0000';
      ctx.strokeStyle = annotation.color || '#FF0000';
      ctx.lineWidth = 2;
      ctx.font = '16px Arial';

      switch (annotation.type) {
        case 'arrow':
          // Draw arrow
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 20, y - 10);
          ctx.moveTo(x, y);
          ctx.lineTo(x + 20, y + 10);
          ctx.stroke();
          break;

        case 'label':
          // Draw label with background
          const metrics = ctx.measureText(annotation.text);
          const padding = 8;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(
            x - padding,
            y - 20 - padding,
            metrics.width + 2 * padding,
            20 + 2 * padding
          );
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(annotation.text, x, y - padding);
          break;

        case 'measurement':
          // Draw measurement line
          if (annotation.width && annotation.height) {
            const endX = x + (annotation.width / 100) * canvas.width;
            const endY = y + (annotation.height / 100) * canvas.height;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Add measurement text
            const distance = Math.sqrt(
              Math.pow(endX - x, 2) + Math.pow(endY - y, 2)
            );
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(
              `${distance.toFixed(1)}px`,
              (x + endX) / 2,
              (y + endY) / 2
            );
          }
          break;

        default:
          // Draw simple dot
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fill();
      }
    });
  };

  useEffect(() => {
    renderAnnotations();
  }, [visibleAnnotations, showAnnotations]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
    >
      {/* Video Element */}
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-auto"
          autoPlay={autoplay}
          playsInline
          preload="metadata"
        >
          {hlsUrl && (
            <source src={hlsUrl} type="application/vnd.apple.mpegurl" />
          )}
          <p className="text-white p-4">
            Your browser doesn't support video playback.
          </p>
        </video>

        {/* Annotations Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ display: showAnnotations ? 'block' : 'none' }}
        />

        {/* Custom Controls */}
        {controls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />

                {/* Chapter Markers */}
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="absolute top-0 w-1 h-2 bg-yellow-400 rounded cursor-pointer"
                    style={{ left: `${(chapter.startTime / duration) * 100}%` }}
                    onClick={() => jumpToChapter(chapter)}
                    title={chapter.title}
                  />
                ))}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isPlaying ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-blue-400"
                  >
                    {isMuted || volume === 0 ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Time Display */}
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Current Chapter */}
                {currentChapter && (
                  <span className="text-yellow-400 text-sm">
                    {currentChapter.title}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {/* Playback Rate */}
                <select
                  value={playbackRate}
                  onChange={(e) => changePlaybackRate(Number(e.target.value))}
                  className="bg-gray-800 text-white text-sm rounded px-2 py-1"
                >
                  <option value={0.25}>0.25x</option>
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                {/* Chapters */}
                {chapters.length > 0 && (
                  <button
                    onClick={() => setShowChapters(!showChapters)}
                    className="text-white hover:text-blue-400 transition-colors"
                    title="Chapters"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                )}

                {/* Annotations Toggle */}
                {annotations.length > 0 && (
                  <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`transition-colors ${showAnnotations ? 'text-blue-400' : 'text-white hover:text-blue-400'}`}
                    title="Toggle annotations"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </button>
                )}

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isFullscreen ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5.5 5.5M20 8V4m0 0h-4m4 0l-5.5 5.5M4 16v4m0 0h4m-4 0l5.5-5.5M20 16v4m0 0h-4m4 0l-5.5-5.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chapters Panel */}
        {showChapters && chapters.length > 0 && (
          <div className="absolute right-4 bottom-20 bg-black/90 rounded-lg p-4 w-64 max-h-64 overflow-y-auto">
            <h3 className="text-white font-semibold mb-2">Chapters</h3>
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => jumpToChapter(chapter)}
                  className={`w-full text-left p-2 rounded transition-colors ${
                    currentChapter?.id === chapter.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">{chapter.title}</div>
                  <div className="text-sm text-gray-400">
                    {formatTime(chapter.startTime)}
                    {chapter.endTime && ` - ${formatTime(chapter.endTime)}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>
    </div>
  );
}
