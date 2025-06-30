// Auto-save functionality for medical editor

export class AutoSave {
  private static readonly STORAGE_PREFIX = 'medipublish_autosave_';
  private static readonly MAX_AUTOSAVE_AGE = 24 * 60 * 60 * 1000; // 24 hours

  // Save content to localStorage
  static async save(publicationId: string, content: string): Promise<void> {
    try {
      const saveData = {
        content,
        timestamp: Date.now(),
        publicationId,
      };

      const key = this.STORAGE_PREFIX + publicationId;
      localStorage.setItem(key, JSON.stringify(saveData));
      
      // Also attempt to save to server if available
      await this.saveToServer(publicationId, content);
    } catch (error) {
      console.error('Failed to auto-save:', error);
    }
  }

  // Load content from localStorage
  static async load(publicationId: string): Promise<string | null> {
    try {
      const key = this.STORAGE_PREFIX + publicationId;
      const savedData = localStorage.getItem(key);
      
      if (!savedData) {
        return null;
      }

      const parsed = JSON.parse(savedData);
      
      // Check if save is too old
      if (Date.now() - parsed.timestamp > this.MAX_AUTOSAVE_AGE) {
        this.clear(publicationId);
        return null;
      }

      // Try to load from server first, fall back to localStorage
      const serverContent = await this.loadFromServer(publicationId);
      return serverContent || parsed.content;
    } catch (error) {
      console.error('Failed to load auto-saved content:', error);
      return null;
    }
  }

  // Clear auto-saved content
  static clear(publicationId: string): void {
    try {
      const key = this.STORAGE_PREFIX + publicationId;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear auto-save:', error);
    }
  }

  // Check if auto-saved content exists
  static hasAutoSave(publicationId: string): boolean {
    try {
      const key = this.STORAGE_PREFIX + publicationId;
      const savedData = localStorage.getItem(key);
      
      if (!savedData) {
        return false;
      }

      const parsed = JSON.parse(savedData);
      return Date.now() - parsed.timestamp <= this.MAX_AUTOSAVE_AGE;
    } catch {
      return false;
    }
  }

  // Get auto-save timestamp
  static getAutoSaveTimestamp(publicationId: string): Date | null {
    try {
      const key = this.STORAGE_PREFIX + publicationId;
      const savedData = localStorage.getItem(key);
      
      if (!savedData) {
        return null;
      }

      const parsed = JSON.parse(savedData);
      return new Date(parsed.timestamp);
    } catch {
      return null;
    }
  }

  // Clean up old auto-saves
  static cleanupOldAutoSaves(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          try {
            const savedData = localStorage.getItem(key);
            if (savedData) {
              const parsed = JSON.parse(savedData);
              if (Date.now() - parsed.timestamp > this.MAX_AUTOSAVE_AGE) {
                keysToRemove.push(key);
              }
            }
          } catch {
            // Invalid data, mark for removal
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to cleanup old auto-saves:', error);
    }
  }

  // Save to server (for persistence across devices)
  private static async saveToServer(publicationId: string, content: string): Promise<void> {
    try {
      await fetch('/api/publications/autosave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicationId,
          content,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      // Server save failed, but localStorage save should still work
      console.warn('Server auto-save failed:', error);
    }
  }

  // Load from server
  private static async loadFromServer(publicationId: string): Promise<string | null> {
    try {
      const response = await fetch(`/api/publications/autosave/${publicationId}`);
      if (response.ok) {
        const data = await response.json();
        return data.content;
      }
    } catch (error) {
      console.warn('Server auto-save load failed:', error);
    }
    return null;
  }

  // Get all auto-saves for a user (for recovery dashboard)
  static getAllAutoSaves(): Array<{ publicationId: string; timestamp: Date; preview: string }> {
    const autoSaves: Array<{ publicationId: string; timestamp: Date; preview: string }> = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          try {
            const savedData = localStorage.getItem(key);
            if (savedData) {
              const parsed = JSON.parse(savedData);
              
              // Skip if too old
              if (Date.now() - parsed.timestamp > this.MAX_AUTOSAVE_AGE) {
                continue;
              }

              const publicationId = key.replace(this.STORAGE_PREFIX, '');
              const preview = this.generatePreview(parsed.content);
              
              autoSaves.push({
                publicationId,
                timestamp: new Date(parsed.timestamp),
                preview,
              });
            }
          } catch {
            // Skip invalid entries
          }
        }
      }
    } catch (error) {
      console.error('Failed to get auto-saves:', error);
    }

    // Sort by timestamp, newest first
    return autoSaves.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Generate preview text from content
  private static generatePreview(content: string, maxLength: number = 100): string {
    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, ' ');
    
    // Clean up whitespace
    const cleanText = textContent.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length <= maxLength) {
      return cleanText;
    }
    
    return cleanText.substring(0, maxLength) + '...';
  }

  // Restore auto-saved content
  static async restore(publicationId: string): Promise<string | null> {
    return this.load(publicationId);
  }

  // Compare auto-saved content with current content
  static hasUnsavedChanges(publicationId: string, currentContent: string): boolean {
    try {
      const key = this.STORAGE_PREFIX + publicationId;
      const savedData = localStorage.getItem(key);
      
      if (!savedData) {
        return false;
      }

      const parsed = JSON.parse(savedData);
      return parsed.content !== currentContent;
    } catch {
      return false;
    }
  }
}

// Auto-save hook for React components
import { useEffect, useRef } from 'react';

export function useAutoSave(
  publicationId: string | undefined,
  content: string,
  enabled: boolean = true,
  interval: number = 30000 // 30 seconds
) {
  const lastSavedContent = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled || !publicationId || content === lastSavedContent.current) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      AutoSave.save(publicationId, content);
      lastSavedContent.current = content;
    }, interval);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [publicationId, content, enabled, interval]);

  // Save immediately on page unload
  useEffect(() => {
    if (!enabled || !publicationId) return;

    const handleBeforeUnload = () => {
      if (content !== lastSavedContent.current) {
        AutoSave.save(publicationId, content);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [publicationId, content, enabled]);
}

// Auto-save recovery component
interface AutoSaveRecoveryProps {
  publicationId: string;
  onRestore: (content: string) => void;
  onDismiss: () => void;
}

export function AutoSaveRecovery({ publicationId, onRestore, onDismiss }: AutoSaveRecoveryProps) {
  const timestamp = AutoSave.getAutoSaveTimestamp(publicationId);
  
  if (!timestamp) {
    return null;
  }

  const handleRestore = async () => {
    const content = await AutoSave.restore(publicationId);
    if (content) {
      onRestore(content);
      AutoSave.clear(publicationId);
    }
  };

  const handleDismiss = () => {
    AutoSave.clear(publicationId);
    onDismiss();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-800">
            Auto-saved content found
          </h4>
          <p className="mt-1 text-sm text-blue-700">
            We found auto-saved content from {timestamp.toLocaleString()}. 
            Would you like to restore it?
          </p>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={handleRestore}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Restore
            </button>
            <button
              onClick={handleDismiss}
              className="text-sm bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}