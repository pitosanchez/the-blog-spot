"use client";

import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface DocumentViewerProps {
  fileUrl: string;
  fileName: string;
  fileType?: string;
  className?: string;
  showControls?: boolean;
  maxHeight?: string;
}

export default function DocumentViewer({
  fileUrl,
  fileName,
  fileType,
  className = "",
  showControls = true,
  maxHeight = "600px",
}: DocumentViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPDF = fileType?.includes("pdf") || fileUrl.toLowerCase().includes(".pdf");
  const isImage = fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderControls = () => {
    if (!showControls) return null;

    return (
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{fileName}</span>
          {isPDF && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">PDF</span>
          )}
          {isImage && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Image</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isImage && (
            <button
              onClick={handleRotate}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Rotate 90°"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
          
          <button
            onClick={handleFullscreen}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
            title="Toggle fullscreen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              )}
            </svg>
          </button>
          
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
            title="Open in new tab"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isPDF) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full border-0"
          title={fileName}
          style={{ minHeight: maxHeight }}
        />
      );
    }

    if (isImage) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <TransformWrapper
            initialScale={1}
            minScale={0.1}
            maxScale={5}
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ mode: "reset" }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 bg-white rounded-lg shadow-lg p-2">
                  <button
                    onClick={() => zoomIn()}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                    title="Zoom in"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                    title="Zoom out"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 12H6"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                    title="Reset zoom"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>

                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: maxHeight,
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={fileUrl}
                    alt={fileName}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      transition: "transform 0.3s ease",
                    }}
                    draggable={false}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Preview not available</h3>
          <p className="mt-1 text-sm text-gray-500">
            This file type cannot be previewed in the browser.
          </p>
          <div className="mt-6">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Download File
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90">
        <div className="w-full h-full bg-white">
          {renderControls()}
          <div className="w-full" style={{ height: "calc(100vh - 60px)" }}>
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {renderControls()}
      <div style={{ height: maxHeight }}>
        {renderContent()}
      </div>
    </div>
  );
}

// Compact Document Viewer for Cards/Lists
interface CompactDocumentViewerProps {
  fileUrl: string;
  fileName: string;
  fileType?: string;
  onClick?: () => void;
  className?: string;
}

export function CompactDocumentViewer({
  fileUrl,
  fileName,
  fileType,
  onClick,
  className = "",
}: CompactDocumentViewerProps) {
  const isPDF = fileType?.includes("pdf") || fileUrl.toLowerCase().includes(".pdf");
  const isImage = fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div
      className={`relative group cursor-pointer border border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors ${className}`}
      onClick={handleClick}
    >
      <div className="aspect-w-4 aspect-h-3">
        {isImage ? (
          <img
            src={fileUrl}
            alt={fileName}
            className="w-full h-full object-cover"
          />
        ) : isPDF ? (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"/>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"/>
            </svg>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
      </div>

      {/* File info */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
        <p className="text-xs truncate">{fileName}</p>
        {isPDF && <span className="text-xs text-red-300">PDF</span>}
        {isImage && <span className="text-xs text-blue-300">Image</span>}
      </div>
    </div>
  );
}