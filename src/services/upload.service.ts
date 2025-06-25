import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';

export interface UploadResponse {
  url: string;
  publicId: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // for video/audio
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type UploadType = 'image' | 'video' | 'document' | 'avatar';

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'webp';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

class UploadService {
  private validateFile(
    file: File,
    type: UploadType
  ): { valid: boolean; error?: string } {
    const limits = {
      image: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      },
      video: {
        maxSize: 500 * 1024 * 1024, // 500MB
        allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
      },
      document: {
        maxSize: 20 * 1024 * 1024, // 20MB
        allowedTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'text/markdown',
        ],
      },
      avatar: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
    };

    const limit = limits[type];
    
    if (file.size > limit.maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${limit.maxSize / (1024 * 1024)}MB limit`,
      };
    }

    if (!limit.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    return { valid: true };
  }

  async uploadImage(
    file: File,
    options?: {
      folder?: string;
      transformOptions?: ImageTransformOptions;
      onProgress?: (progress: UploadProgress) => void;
    }
  ): Promise<UploadResponse> {
    const validation = this.validateFile(file, 'image');
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    
    if (options?.transformOptions) {
      formData.append('transformOptions', JSON.stringify(options.transformOptions));
    }

    return apiClient.upload<UploadResponse>(
      API_ENDPOINTS.UPLOAD.IMAGE,
      formData
    );
  }

  async uploadVideo(
    file: File,
    options?: {
      folder?: string;
      generateThumbnail?: boolean;
      onProgress?: (progress: UploadProgress) => void;
    }
  ): Promise<UploadResponse> {
    const validation = this.validateFile(file, 'video');
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    
    if (options?.generateThumbnail !== undefined) {
      formData.append('generateThumbnail', String(options.generateThumbnail));
    }

    return apiClient.upload<UploadResponse>(
      API_ENDPOINTS.UPLOAD.VIDEO,
      formData
    );
  }

  async uploadDocument(
    file: File,
    options?: {
      folder?: string;
      onProgress?: (progress: UploadProgress) => void;
    }
  ): Promise<UploadResponse> {
    const validation = this.validateFile(file, 'document');
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.folder) {
      formData.append('folder', options.folder);
    }

    return apiClient.upload<UploadResponse>(
      API_ENDPOINTS.UPLOAD.DOCUMENT,
      formData
    );
  }

  async uploadAvatar(
    file: File,
    options?: {
      cropData?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }
  ): Promise<UploadResponse> {
    const validation = this.validateFile(file, 'avatar');
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.cropData) {
      formData.append('cropData', JSON.stringify(options.cropData));
    }

    return apiClient.upload<UploadResponse>(
      API_ENDPOINTS.UPLOAD.AVATAR,
      formData
    );
  }

  async uploadMultiple(
    files: File[],
    type: UploadType,
    options?: {
      folder?: string;
      onProgress?: (progress: UploadProgress) => void;
    }
  ): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => {
      switch (type) {
        case 'image':
          return this.uploadImage(file, options);
        case 'video':
          return this.uploadVideo(file, options);
        case 'document':
          return this.uploadDocument(file, options);
        default:
          throw new Error(`Unsupported upload type: ${type}`);
      }
    });

    return Promise.all(uploadPromises);
  }

  async deleteFile(publicId: string): Promise<void> {
    return apiClient.delete(`/upload/delete/${publicId}`);
  }

  async getUploadUrl(
    type: UploadType,
    fileName: string
  ): Promise<{
    uploadUrl: string;
    publicId: string;
    expires: number;
  }> {
    return apiClient.post('/upload/generate-url', {
      type,
      fileName,
    });
  }

  // Helper method to optimize images before upload
  async optimizeImage(
    file: File,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          let { width, height } = img;

          // Calculate new dimensions
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(optimizedFile);
              } else {
                reject(new Error('Could not create blob'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }
}

export const uploadService = new UploadService();