"use client";

import { useState } from 'react';
import { UploadDropzone } from '@/lib/uploadthing';

interface DicomViewerProps {
  onInsert: (imageHtml: string) => void;
  onClose: () => void;
}

interface DicomImage {
  id: string;
  url: string;
  fileName: string;
  metadata?: {
    patientId?: string;
    studyDate?: string;
    modality?: string;
    bodyPart?: string;
    studyDescription?: string;
  };
  annotations?: DicomAnnotation[];
}

interface DicomAnnotation {
  id: string;
  type: 'arrow' | 'circle' | 'rectangle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
}

export function DicomViewer({ onInsert, onClose }: DicomViewerProps) {
  const [uploadedImages, setUploadedImages] = useState<DicomImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<DicomImage | null>(null);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotationTool, setAnnotationTool] = useState<'arrow' | 'circle' | 'text'>('arrow');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(100);

  const handleImageUpload = (files: any[]) => {
    files.forEach((file) => {
      const dicomImage: DicomImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: file.url,
        fileName: file.name,
        metadata: {
          // In a real implementation, you would parse DICOM metadata
          studyDate: new Date().toISOString().split('T')[0],
          modality: 'Unknown',
          bodyPart: 'Unknown',
          studyDescription: 'Uploaded Study',
        },
        annotations: [],
      };
      
      setUploadedImages(prev => [...prev, dicomImage]);
      if (!selectedImage) {
        setSelectedImage(dicomImage);
      }
    });
  };

  const addAnnotation = (x: number, y: number) => {
    if (!selectedImage || !isAnnotating) return;

    const annotation: DicomAnnotation = {
      id: Math.random().toString(36).substr(2, 9),
      type: annotationTool,
      x,
      y,
      color: '#ff0000',
      text: annotationTool === 'text' ? 'Annotation' : undefined,
    };

    const updatedImage = {
      ...selectedImage,
      annotations: [...(selectedImage.annotations || []), annotation],
    };

    setUploadedImages(prev => 
      prev.map(img => img.id === selectedImage.id ? updatedImage : img)
    );
    setSelectedImage(updatedImage);
  };

  const removeAnnotation = (annotationId: string) => {
    if (!selectedImage) return;

    const updatedImage = {
      ...selectedImage,
      annotations: selectedImage.annotations?.filter(a => a.id !== annotationId) || [],
    };

    setUploadedImages(prev => 
      prev.map(img => img.id === selectedImage.id ? updatedImage : img)
    );
    setSelectedImage(updatedImage);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnnotating) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    addAnnotation(x, y);
  };

  const generateImageHtml = (image: DicomImage): string => {
    const annotationElements = image.annotations?.map(annotation => {
      switch (annotation.type) {
        case 'arrow':
          return `<div style="position: absolute; left: ${annotation.x}%; top: ${annotation.y}%; color: ${annotation.color}; font-size: 20px; pointer-events: none;">➤</div>`;
        case 'circle':
          return `<div style="position: absolute; left: ${annotation.x - 2}%; top: ${annotation.y - 2}%; width: 4%; height: 4%; border: 2px solid ${annotation.color}; border-radius: 50%; pointer-events: none;"></div>`;
        case 'text':
          return `<div style="position: absolute; left: ${annotation.x}%; top: ${annotation.y}%; color: ${annotation.color}; background: rgba(255,255,255,0.8); padding: 2px 4px; font-size: 12px; pointer-events: none;">${annotation.text}</div>`;
        default:
          return '';
      }
    }).join('') || '';

    return `
      <div class="dicom-image-container" style="position: relative; display: inline-block; max-width: 100%; margin: 20px 0;">
        <img 
          src="${image.url}" 
          alt="${image.fileName}"
          style="max-width: 100%; height: auto; filter: brightness(${brightness}%) contrast(${contrast}%); transform: scale(${zoom / 100});"
          class="dicom-image"
        />
        ${annotationElements}
        <div style="margin-top: 8px; font-size: 12px; color: #666;">
          <strong>Study:</strong> ${image.metadata?.studyDescription || 'Unknown'} | 
          <strong>Date:</strong> ${image.metadata?.studyDate || 'Unknown'} | 
          <strong>Modality:</strong> ${image.metadata?.modality || 'Unknown'}
        </div>
      </div>
    `;
  };

  const handleInsert = () => {
    if (selectedImage) {
      const imageHtml = generateImageHtml(selectedImage);
      onInsert(imageHtml);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">DICOM Viewer & Medical Images</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Image Library */}
          <div className="w-1/4 border-r border-gray-200 overflow-y-auto p-4">
            <h4 className="font-medium text-gray-900 mb-3">Medical Images</h4>
            
            {/* Upload Area */}
            <div className="mb-4">
              <UploadDropzone
                endpoint="contentMedia"
                onClientUploadComplete={(res) => {
                  if (res) {
                    handleImageUpload(res);
                  }
                }}
                onUploadError={(error) => {
                  alert(`Upload failed: ${error.message}`);
                }}
              />
            </div>

            {/* Image List */}
            <div className="space-y-2">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    selectedImage?.id === image.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.fileName}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <p className="text-xs font-medium truncate">{image.fileName}</p>
                  <p className="text-xs text-gray-500">{image.metadata?.modality}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Viewer */}
          <div className="w-1/2 flex flex-col">
            {selectedImage ? (
              <>
                {/* Controls */}
                <div className="border-b border-gray-200 p-3 space-y-3">
                  {/* Annotation Tools */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsAnnotating(!isAnnotating)}
                      className={`px-3 py-1 text-sm rounded ${
                        isAnnotating ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isAnnotating ? 'Stop Annotating' : 'Start Annotating'}
                    </button>
                    
                    {isAnnotating && (
                      <>
                        <select
                          value={annotationTool}
                          onChange={(e) => setAnnotationTool(e.target.value as any)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="arrow">Arrow</option>
                          <option value="circle">Circle</option>
                          <option value="text">Text</option>
                        </select>
                      </>
                    )}
                  </div>

                  {/* Image Controls */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <label className="block text-xs text-gray-600">Brightness</label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{brightness}%</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Contrast</label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{contrast}%</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">Zoom</label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{zoom}%</span>
                    </div>
                  </div>
                </div>

                {/* Image Display */}
                <div className="flex-1 p-4 overflow-auto bg-gray-900 relative">
                  <div
                    className="relative inline-block cursor-crosshair"
                    onClick={handleImageClick}
                  >
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.fileName}
                      className="max-w-full max-h-full"
                      style={{
                        filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: 'top left',
                      }}
                    />
                    
                    {/* Annotations */}
                    {selectedImage.annotations?.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="absolute cursor-pointer group"
                        style={{
                          left: `${annotation.x}%`,
                          top: `${annotation.y}%`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAnnotation(annotation.id);
                        }}
                      >
                        {annotation.type === 'arrow' && (
                          <div style={{ color: annotation.color, fontSize: '20px' }}>
                            ➤
                          </div>
                        )}
                        {annotation.type === 'circle' && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              border: `2px solid ${annotation.color}`,
                              borderRadius: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        )}
                        {annotation.type === 'text' && (
                          <div
                            style={{
                              color: annotation.color,
                              background: 'rgba(255,255,255,0.8)',
                              padding: '2px 4px',
                              fontSize: '12px',
                              borderRadius: '2px',
                            }}
                          >
                            {annotation.text}
                          </div>
                        )}
                        
                        {/* Delete button on hover */}
                        <button className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Upload or select an image to view
              </div>
            )}
          </div>

          {/* Metadata Panel */}
          <div className="w-1/4 border-l border-gray-200 overflow-y-auto p-4">
            <h4 className="font-medium text-gray-900 mb-3">Image Information</h4>
            
            {selectedImage ? (
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-600">File Name</label>
                  <p className="text-gray-900">{selectedImage.fileName}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600">Study Date</label>
                  <p className="text-gray-900">{selectedImage.metadata?.studyDate || 'Unknown'}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600">Modality</label>
                  <p className="text-gray-900">{selectedImage.metadata?.modality || 'Unknown'}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600">Body Part</label>
                  <p className="text-gray-900">{selectedImage.metadata?.bodyPart || 'Unknown'}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600">Study Description</label>
                  <p className="text-gray-900">{selectedImage.metadata?.studyDescription || 'Unknown'}</p>
                </div>

                {selectedImage.annotations && selectedImage.annotations.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Annotations</label>
                    <div className="space-y-1">
                      {selectedImage.annotations.map((annotation, index) => (
                        <div key={annotation.id} className="flex items-center justify-between text-xs">
                          <span>{annotation.type} {index + 1}</span>
                          <button
                            onClick={() => removeAnnotation(annotation.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PHI Warning */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    ⚠️ <strong>PHI Warning:</strong> Ensure all patient identifiers are removed from DICOM images before insertion.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No image selected</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!selectedImage}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}