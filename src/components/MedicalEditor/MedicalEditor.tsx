"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Mention from '@tiptap/extension-mention';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Focus from '@tiptap/extension-focus';
import { useState, useEffect, useCallback } from 'react';
import { MedicalToolbar } from './MedicalToolbar';
import { MedicalMentionSuggestion } from './MedicalMentionSuggestion';
import { PHIDetector } from './PHIDetector';
import { AutoSave } from './AutoSave';

interface MedicalEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  enablePHIDetection?: boolean;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
  className?: string;
  publicationId?: string;
}

export default function MedicalEditor({
  content = '',
  onChange,
  onSave,
  placeholder = 'Start writing your medical content...',
  readOnly = false,
  enablePHIDetection = true,
  enableAutoSave = true,
  autoSaveInterval = 30000, // 30 seconds
  className = '',
  publicationId,
}: MedicalEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [phiWarnings, setPHIWarnings] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 50,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-100 px-4 py-2 font-semibold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start my-2',
        },
        nested: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention bg-blue-100 text-blue-800 px-2 py-1 rounded-md',
        },
        suggestion: MedicalMentionSuggestion,
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      
      // PHI Detection
      if (enablePHIDetection) {
        detectPHI(html);
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3 ${className}`,
        spellcheck: 'true',
      },
    },
  });

  // PHI Detection
  const detectPHI = useCallback((content: string) => {
    const phi = PHIDetector.detectPHI(content);
    setPHIWarnings(phi.warnings);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!enableAutoSave || !editor || !publicationId) return;

    const autoSaveTimer = setInterval(() => {
      const content = editor.getHTML();
      if (content && content !== '<p></p>') {
        AutoSave.save(publicationId, content)
          .then(() => setLastSaved(new Date()))
          .catch(console.error);
      }
    }, autoSaveInterval);

    return () => clearInterval(autoSaveTimer);
  }, [editor, enableAutoSave, autoSaveInterval, publicationId]);

  // Load auto-saved content on mount
  useEffect(() => {
    if (enableAutoSave && publicationId && !content) {
      AutoSave.load(publicationId)
        .then((savedContent) => {
          if (savedContent && editor) {
            editor.commands.setContent(savedContent);
          }
        })
        .catch(console.error);
    }
  }, [editor, enableAutoSave, publicationId, content]);

  const handleSave = async () => {
    if (!editor || !onSave) return;
    
    setIsLoading(true);
    try {
      const content = editor.getHTML();
      await onSave(content);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!editor) {
    return (
      <div className="border rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* PHI Warnings */}
      {phiWarnings.length > 0 && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">PHI Detected</h4>
              <div className="mt-1 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {phiWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-2 text-sm text-red-600">
                Please review and redact any protected health information before publishing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {!readOnly && (
        <MedicalToolbar 
          editor={editor} 
          onSave={handleSave}
          isLoading={isLoading}
          lastSaved={lastSaved}
        />
      )}

      {/* Editor Content */}
      <div className="relative">
        <EditorContent 
          editor={editor}
          className={`
            medical-editor-content
            ${readOnly ? 'pointer-events-none' : ''}
          `}
        />
        
        {/* Placeholder when empty */}
        {editor.isEmpty && !readOnly && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>
            {editor.storage.characterCount?.characters() || 0} characters
          </span>
          <span>
            {editor.storage.characterCount?.words() || 0} words
          </span>
          {phiWarnings.length > 0 && (
            <span className="text-red-600 font-medium">
              ⚠️ {phiWarnings.length} PHI warning{phiWarnings.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {lastSaved && enableAutoSave && (
          <div className="text-xs text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}

// Export editor for use in other components
export { MedicalEditor };