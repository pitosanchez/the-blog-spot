import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import {
  MediaConvertClient,
  CreateJobCommand,
} from '@aws-sdk/client-mediaconvert';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// AWS Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const mediaConvertClient = new MediaConvertClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Video Types and Interfaces
export interface VideoMetadata {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  thumbnailUrl?: string;
  hlsUrl?: string;
  originalUrl: string;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  specialty?: string;
  tags: string[];
  isLive?: boolean;
  conferenceId?: string;
  chapters?: VideoChapter[];
  annotations?: VideoAnnotation[];
  privacy: {
    faceBlurred: boolean;
    watermarked: boolean;
    downloadRestricted: boolean;
  };
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime?: number;
  description?: string;
}

export interface VideoAnnotation {
  id: string;
  timestamp: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  type: 'arrow' | 'label' | 'measurement' | 'anatomy' | 'instrument';
  color?: string;
}

export interface UploadProgress {
  percentage: number;
  stage: 'uploading' | 'processing' | 'complete';
  message: string;
}

// Video Upload Functions
export async function generatePresignedUploadUrl(
  fileName: string,
  fileType: string,
  userId: string
): Promise<{ uploadUrl: string; key: string }> {
  const key = `videos/${userId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET || '',
    Key: key,
    ContentType: fileType,
    Metadata: {
      userId,
      uploadedAt: new Date().toISOString(),
    },
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return { uploadUrl, key };
}

export async function initiateVideoProcessing(
  s3Key: string,
  videoId: string,
  options: {
    qualities: string[];
    generateThumbnails: boolean;
    enableCaptions: boolean;
  }
): Promise<string> {
  const outputKey = s3Key.replace(/\.[^/.]+$/, '');

  const jobSettings = {
    Role: process.env.AWS_MEDIACONVERT_ROLE || '',
    Settings: {
      Inputs: [
        {
          FileInput: `s3://${process.env.AWS_S3_BUCKET}/${s3Key}`,
          VideoSelector: {},
          AudioSelectors: {
            'Audio Selector 1': {
              DefaultSelection: 'DEFAULT',
            },
          },
        },
      ],
      OutputGroups: [
        // HLS Output Group
        {
          Name: 'HLS',
          OutputGroupSettings: {
            Type: 'HLS_GROUP_SETTINGS',
            HlsGroupSettings: {
              Destination: `s3://${process.env.AWS_S3_BUCKET}/processed/${outputKey}/`,
              SegmentLength: 10,
              MinSegmentLength: 0,
            },
          },
          Outputs: options.qualities.map((quality) => ({
            NameModifier: `_${quality}`,
            VideoDescription: {
              CodecSettings: {
                Codec: 'H_264',
                H264Settings: {
                  RateControlMode: 'CBR',
                  Bitrate:
                    quality === '1080p'
                      ? 5000000
                      : quality === '720p'
                        ? 3000000
                        : 1000000,
                  MaxBitrate:
                    quality === '1080p'
                      ? 6000000
                      : quality === '720p'
                        ? 4000000
                        : 1500000,
                },
              },
              Width:
                quality === '1080p' ? 1920 : quality === '720p' ? 1280 : 854,
              Height:
                quality === '1080p' ? 1080 : quality === '720p' ? 720 : 480,
            },
            AudioDescriptions: [
              {
                CodecSettings: {
                  Codec: 'AAC',
                  AacSettings: {
                    Bitrate: 128000,
                    SampleRate: 48000,
                  },
                },
              },
            ],
          })),
        },
        // Thumbnail Output Group
        ...(options.generateThumbnails
          ? [
              {
                Name: 'Thumbnails',
                OutputGroupSettings: {
                  Type: 'FILE_GROUP_SETTINGS',
                  FileGroupSettings: {
                    Destination: `s3://${process.env.AWS_S3_BUCKET}/thumbnails/${outputKey}/`,
                  },
                },
                Outputs: [
                  {
                    NameModifier: '_thumb',
                    VideoDescription: {
                      CodecSettings: {
                        Codec: 'FRAME_CAPTURE',
                        FrameCaptureSettings: {
                          FramerateNumerator: 1,
                          FramerateDenominator: 10,
                          MaxCaptures: 5,
                        },
                      },
                      Width: 640,
                      Height: 360,
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    },
    UserMetadata: {
      videoId,
      processedAt: new Date().toISOString(),
    },
  };

  const command = new CreateJobCommand(jobSettings);
  const response = await mediaConvertClient.send(command);

  return response.Job?.Id || '';
}

// Video Player Configuration
export const videoPlayerConfig = {
  controls: true,
  responsive: true,
  fluid: true,
  playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4],
  plugins: {
    hotkeys: {
      volumeStep: 0.1,
      seekStep: 5,
      enableModifiersForNumbers: false,
    },
  },
  techOrder: ['html5'],
  html5: {
    vhs: {
      overrideNative: true,
    },
  },
};

// Live Streaming with Daily.co
export interface LiveStreamConfig {
  roomName: string;
  userId: string;
  userName: string;
  isHost: boolean;
  recordSession: boolean;
  enableScreenShare: boolean;
  maxParticipants: number;
}

export async function createLiveStreamRoom(config: LiveStreamConfig): Promise<{
  roomUrl: string;
  roomToken: string;
}> {
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: config.roomName,
      privacy: 'private',
      properties: {
        max_participants: config.maxParticipants,
        enable_recording: config.recordSession ? 'cloud' : 'off',
        enable_screenshare: config.enableScreenShare,
        enable_chat: true,
        enable_knocking: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  });

  const room = await response.json();

  // Generate meeting token
  const tokenResponse = await fetch('https://api.daily.co/v1/meeting-tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: config.roomName,
        user_name: config.userName,
        is_owner: config.isHost,
        exp: Math.floor(Date.now() / 1000) + 4 * 60 * 60, // 4 hours
      },
    }),
  });

  const tokenData = await tokenResponse.json();

  return {
    roomUrl: room.url,
    roomToken: tokenData.token,
  };
}

// Privacy and Security Functions
export async function applyPrivacyFilters(
  videoKey: string,
  options: {
    blurFaces: boolean;
    addWatermark: boolean;
    watermarkText?: string;
  }
): Promise<string> {
  // This would integrate with a video processing service
  // For now, return the original key
  // TODO: Implement face blurring and watermarking
  return videoKey;
}

// Video Analytics
export interface VideoAnalytics {
  views: number;
  uniqueViews: number;
  averageWatchTime: number;
  completionRate: number;
  engagementPoints: { timestamp: number; engagement: number }[];
  geographicData: { country: string; views: number }[];
}

export async function getVideoAnalytics(
  videoId: string
): Promise<VideoAnalytics> {
  // TODO: Implement analytics collection
  return {
    views: 0,
    uniqueViews: 0,
    averageWatchTime: 0,
    completionRate: 0,
    engagementPoints: [],
    geographicData: [],
  };
}

// Utility Functions
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function validateVideoFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
  const allowedTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/webm',
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5GB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported video format' };
  }

  return { valid: true };
}
