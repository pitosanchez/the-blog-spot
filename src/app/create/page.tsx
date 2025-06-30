"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MedicalEditor } from '@/components/MedicalEditor/MedicalEditor';
import { AutoSaveRecovery } from '@/components/MedicalEditor/AutoSave';
import { AutoSave } from '@/components/MedicalEditor/AutoSave';
import { useAnalytics, usePageTimeTracking } from '@/hooks/useAnalytics';

interface Publication {
  id?: string;
  title: string;
  content: string;
  type: 'ARTICLE' | 'VIDEO' | 'CASE_STUDY' | 'CONFERENCE';
  accessType: 'FREE' | 'PAID' | 'CME';
  tags: string[];
  price?: number;
  cmeCredits?: number;
  publishedAt?: string;
}

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { trackAutoSave, trackEvent } = useAnalytics();
  
  // Track time spent on page
  usePageTimeTracking();
  
  const [publication, setPublication] = useState<Publication>({
    title: '',
    content: '',
    type: 'ARTICLE',
    accessType: 'FREE',
    tags: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showAutoSaveRecovery, setShowAutoSaveRecovery] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [publicationId, setPublicationId] = useState<string>();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "CREATOR") {
      router.push("/auth/login");
      return;
    }

    if (session.user.verificationStatus !== "VERIFIED") {
      router.push("/auth/verification-required");
      return;
    }

    // Generate or get publication ID for auto-save
    const tempId = 'new_' + Date.now();
    setPublicationId(tempId);

    // Check for auto-saved content
    if (AutoSave.hasAutoSave(tempId)) {
      setShowAutoSaveRecovery(true);
    }
  }, [session, status, router]);

  const handleSave = async (saveType: 'draft' | 'publish') => {
    setIsLoading(true);
    
    try {
      const endpoint = saveType === 'publish' ? '/api/publications/publish' : '/api/publications/draft';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...publication,
          publishedAt: saveType === 'publish' ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (saveType === 'publish') {
          // Clear auto-save and redirect to published article
          if (publicationId) {
            AutoSave.clear(publicationId);
          }
          router.push(`/article/${result.slug}`);
        } else {
          // Update publication ID and continue editing
          setPublicationId(result.id);
          setIsDraft(true);
          alert('Draft saved successfully!');
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save publication');
      }
    } catch (error) {
      alert('Network error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (content: string) => {
    setPublication(prev => ({ ...prev, content }));
    
    // Track auto-save when content changes
    if (publicationId && content.length > 0) {
      trackAutoSave(publicationId, content.length);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !publication.tags.includes(newTag.trim())) {
      setPublication(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPublication(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAutoSaveRestore = (content: string) => {
    setPublication(prev => ({ ...prev, content }));
    setShowAutoSaveRecovery(false);
  };

  const validateForm = (): boolean => {
    if (!publication.title.trim()) {
      alert('Please enter a title');
      return false;
    }
    if (!publication.content.trim() || publication.content === '<p></p>') {
      alert('Please add content to your publication');
      return false;
    }
    if (publication.accessType === 'PAID' && (!publication.price || publication.price <= 0)) {
      alert('Please set a valid price for paid content');
      return false;
    }
    if (publication.accessType === 'CME' && (!publication.cmeCredits || publication.cmeCredits <= 0)) {
      alert('Please set CME credits for CME content');
      return false;
    }
    return true;
  };

  const handlePublish = () => {
    if (validateForm()) {
      if (confirm('Are you sure you want to publish this content? It will be visible to all users.')) {
        // Track publication creation
        trackEvent('publication_create', {
          type: publication.type,
          accessType: publication.accessType,
          contentLength: publication.content.length,
          tagCount: publication.tags.length,
          hasCMECredits: !!publication.cmeCredits,
          hasPrice: !!publication.price,
        });
        
        handleSave('publish');
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Medical Content</h1>
              <p className="mt-2 text-gray-600">
                Share your medical knowledge with the community
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                Save Draft
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* Auto-save Recovery */}
        {showAutoSaveRecovery && publicationId && (
          <AutoSaveRecovery
            publicationId={publicationId}
            onRestore={handleAutoSaveRestore}
            onDismiss={() => setShowAutoSaveRecovery(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Title Input */}
              <div className="p-6 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Enter your publication title..."
                  value={publication.title}
                  onChange={(e) => setPublication(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 border-none focus:outline-none"
                />
              </div>

              {/* Content Editor or Preview */}
              {showPreview ? (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Preview</h2>
                  <div className="prose max-w-none">
                    <h1>{publication.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: publication.content }} />
                  </div>
                </div>
              ) : (
                <MedicalEditor
                  content={publication.content}
                  onChange={handleContentChange}
                  onSave={() => handleSave('draft')}
                  enablePHIDetection={true}
                  enableAutoSave={true}
                  publicationId={publicationId}
                  placeholder="Start writing your medical content... Use @ to insert medical terms, drugs, or codes."
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Publication Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publication Settings</h3>
              
              <div className="space-y-4">
                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={publication.type}
                    onChange={(e) => setPublication(prev => ({ 
                      ...prev, 
                      type: e.target.value as Publication['type']
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ARTICLE">Article</option>
                    <option value="CASE_STUDY">Case Study</option>
                    <option value="VIDEO">Video</option>
                    <option value="CONFERENCE">Conference</option>
                  </select>
                </div>

                {/* Access Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Type
                  </label>
                  <select
                    value={publication.accessType}
                    onChange={(e) => setPublication(prev => ({ 
                      ...prev, 
                      accessType: e.target.value as Publication['accessType']
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FREE">Free</option>
                    <option value="PAID">Paid</option>
                    <option value="CME">CME Credit</option>
                  </select>
                </div>

                {/* Price (if paid) */}
                {publication.accessType === 'PAID' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={publication.price || ''}
                      onChange={(e) => setPublication(prev => ({ 
                        ...prev, 
                        price: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* CME Credits (if CME) */}
                {publication.accessType === 'CME' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CME Credits
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.25"
                      value={publication.cmeCredits || ''}
                      onChange={(e) => setPublication(prev => ({ 
                        ...prev, 
                        cmeCredits: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              
              <div className="space-y-3">
                {/* Add Tag */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                {/* Tag List */}
                <div className="flex flex-wrap gap-2">
                  {publication.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Publishing Guidelines */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                📋 Publishing Guidelines
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Remove all patient identifiers (PHI)</li>
                <li>• Include proper citations for references</li>
                <li>• Use appropriate medical terminology</li>
                <li>• Follow evidence-based practices</li>
                <li>• Include relevant disclaimers</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  📚 Insert Citation
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  🧪 Add Lab Values
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  📋 Case Template
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  🏥 DICOM Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}