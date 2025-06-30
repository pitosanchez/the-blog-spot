"use client";

import { useState } from 'react';

interface CaseTemplateModalProps {
  onInsert: (templateHtml: string) => void;
  onClose: () => void;
}

interface CaseTemplate {
  id: string;
  name: string;
  description: string;
  sections: CaseSection[];
}

interface CaseSection {
  title: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'list' | 'table';
}

export function CaseTemplateModal({ onInsert, onClose }: CaseTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const templates: CaseTemplate[] = [
    {
      id: 'general-case',
      name: 'General Case Presentation',
      description: 'Standard medical case presentation format',
      sections: [
        {
          title: 'Chief Complaint',
          placeholder: 'Patient\'s main concern in their own words',
          required: true,
          type: 'text'
        },
        {
          title: 'History of Present Illness',
          placeholder: 'Detailed description of the current illness, timeline, associated symptoms, aggravating/alleviating factors',
          required: true,
          type: 'text'
        },
        {
          title: 'Past Medical History',
          placeholder: 'Previous medical conditions, surgeries, hospitalizations',
          required: false,
          type: 'list'
        },
        {
          title: 'Medications',
          placeholder: 'Current medications with dosages',
          required: false,
          type: 'list'
        },
        {
          title: 'Allergies',
          placeholder: 'Known allergies and reactions',
          required: false,
          type: 'text'
        },
        {
          title: 'Social History',
          placeholder: 'Tobacco, alcohol, drug use, occupation, living situation',
          required: false,
          type: 'text'
        },
        {
          title: 'Family History',
          placeholder: 'Relevant family medical history',
          required: false,
          type: 'text'
        },
        {
          title: 'Physical Examination',
          placeholder: 'Vital signs and physical findings by system',
          required: true,
          type: 'text'
        },
        {
          title: 'Laboratory/Diagnostic Results',
          placeholder: 'Relevant lab values, imaging, other tests',
          required: false,
          type: 'text'
        },
        {
          title: 'Assessment',
          placeholder: 'Clinical impression and differential diagnosis',
          required: true,
          type: 'text'
        },
        {
          title: 'Plan',
          placeholder: 'Treatment plan and follow-up',
          required: true,
          type: 'text'
        }
      ]
    },
    {
      id: 'surgical-case',
      name: 'Surgical Case Report',
      description: 'Template for surgical case presentations',
      sections: [
        {
          title: 'Patient Demographics',
          placeholder: 'Age, gender (avoid specific identifiers)',
          required: true,
          type: 'text'
        },
        {
          title: 'Preoperative Diagnosis',
          placeholder: 'Primary diagnosis requiring surgery',
          required: true,
          type: 'text'
        },
        {
          title: 'Indication for Surgery',
          placeholder: 'Medical indication and surgical necessity',
          required: true,
          type: 'text'
        },
        {
          title: 'Preoperative Workup',
          placeholder: 'Imaging, labs, consultations, risk assessment',
          required: false,
          type: 'text'
        },
        {
          title: 'Surgical Procedure',
          placeholder: 'Detailed description of the surgical technique',
          required: true,
          type: 'text'
        },
        {
          title: 'Intraoperative Findings',
          placeholder: 'Key findings during surgery',
          required: false,
          type: 'text'
        },
        {
          title: 'Postoperative Course',
          placeholder: 'Recovery, complications, hospital course',
          required: true,
          type: 'text'
        },
        {
          title: 'Pathology Results',
          placeholder: 'Histopathological findings if applicable',
          required: false,
          type: 'text'
        },
        {
          title: 'Follow-up',
          placeholder: 'Long-term outcomes and follow-up care',
          required: false,
          type: 'text'
        },
        {
          title: 'Discussion',
          placeholder: 'Literature review, teaching points, conclusions',
          required: false,
          type: 'text'
        }
      ]
    },
    {
      id: 'emergency-case',
      name: 'Emergency Department Case',
      description: 'Template for emergency medicine cases',
      sections: [
        {
          title: 'Presentation',
          placeholder: 'How the patient presented to the ED',
          required: true,
          type: 'text'
        },
        {
          title: 'Triage Assessment',
          placeholder: 'Initial triage category and vital signs',
          required: true,
          type: 'text'
        },
        {
          title: 'Primary Survey',
          placeholder: 'ABCDE assessment for critically ill patients',
          required: false,
          type: 'text'
        },
        {
          title: 'History',
          placeholder: 'Focused history relevant to chief complaint',
          required: true,
          type: 'text'
        },
        {
          title: 'Physical Examination',
          placeholder: 'Focused physical exam findings',
          required: true,
          type: 'text'
        },
        {
          title: 'Differential Diagnosis',
          placeholder: 'Initial differential diagnosis',
          required: true,
          type: 'list'
        },
        {
          title: 'Diagnostic Workup',
          placeholder: 'Tests ordered and rationale',
          required: false,
          type: 'text'
        },
        {
          title: 'Treatment',
          placeholder: 'Emergency treatments and interventions',
          required: true,
          type: 'text'
        },
        {
          title: 'Disposition',
          placeholder: 'Admission, discharge, or transfer decision',
          required: true,
          type: 'text'
        }
      ]
    },
    {
      id: 'pediatric-case',
      name: 'Pediatric Case',
      description: 'Template for pediatric patient cases',
      sections: [
        {
          title: 'Patient Information',
          placeholder: 'Age, gender (avoid specific identifiers)',
          required: true,
          type: 'text'
        },
        {
          title: 'Chief Complaint',
          placeholder: 'Parent/caregiver concern or patient complaint',
          required: true,
          type: 'text'
        },
        {
          title: 'History of Present Illness',
          placeholder: 'Detailed history with developmental considerations',
          required: true,
          type: 'text'
        },
        {
          title: 'Birth History',
          placeholder: 'Prenatal, birth, and neonatal history if relevant',
          required: false,
          type: 'text'
        },
        {
          title: 'Developmental History',
          placeholder: 'Developmental milestones and current abilities',
          required: false,
          type: 'text'
        },
        {
          title: 'Immunization History',
          placeholder: 'Vaccination status',
          required: false,
          type: 'text'
        },
        {
          title: 'Growth Parameters',
          placeholder: 'Height, weight, head circumference, growth curves',
          required: false,
          type: 'text'
        },
        {
          title: 'Physical Examination',
          placeholder: 'Age-appropriate physical findings',
          required: true,
          type: 'text'
        },
        {
          title: 'Assessment and Plan',
          placeholder: 'Diagnosis and age-appropriate treatment plan',
          required: true,
          type: 'text'
        }
      ]
    }
  ];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleInputChange = (sectionTitle: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionTitle]: value
    }));
  };

  const generateTemplateHtml = (): string => {
    if (!selectedTemplateData) return '';

    const sections = selectedTemplateData.sections.map(section => {
      const content = formData[section.title] || section.placeholder;
      
      if (section.type === 'list') {
        const items = content.split('\n').filter(item => item.trim());
        const listHtml = items.length > 0 
          ? `<ul class="list-disc list-inside ml-4">${items.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`
          : `<p class="text-gray-500 italic">${section.placeholder}</p>`;
        
        return `
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${section.title}</h3>
            ${listHtml}
          </div>
        `;
      } else {
        return `
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">${section.title}</h3>
            <p class="text-gray-700 leading-relaxed">${content}</p>
          </div>
        `;
      }
    }).join('');

    return `
      <div class="case-presentation">
        <h2 class="text-xl font-bold text-gray-900 mb-6">${selectedTemplateData.name}</h2>
        ${sections}
      </div>
    `;
  };

  const handleInsert = () => {
    const templateHtml = generateTemplateHtml();
    if (templateHtml) {
      onInsert(templateHtml);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Case Presentation Template</h3>
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
          {/* Template Selection */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto p-4">
            <h4 className="font-medium text-gray-900 mb-3">Choose Template</h4>
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h5 className="font-medium text-gray-900">{template.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {template.sections.length} sections
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="w-2/3 overflow-y-auto p-4">
            {selectedTemplateData ? (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Fill in the {selectedTemplateData.name}
                </h4>
                
                <div className="space-y-4">
                  {selectedTemplateData.sections.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {section.title}
                        {section.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {section.type === 'list' ? (
                        <textarea
                          placeholder={`${section.placeholder}\n\nEnter each item on a new line`}
                          value={formData[section.title] || ''}
                          onChange={(e) => handleInputChange(section.title, e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      ) : (
                        <textarea
                          placeholder={section.placeholder}
                          value={formData[section.title] || ''}
                          onChange={(e) => handleInputChange(section.title, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a template to get started
              </div>
            )}
          </div>
        </div>

        {/* Preview and Actions */}
        <div className="border-t border-gray-200 p-4">
          {selectedTemplateData && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="border border-gray-200 rounded p-4 max-h-40 overflow-y-auto text-sm bg-gray-50">
                <div dangerouslySetInnerHTML={{ __html: generateTemplateHtml() }} />
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <div className="text-sm text-gray-600">
              <p>💡 <strong>Tip:</strong> Remember to remove all patient identifiers before publication</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleInsert}
                disabled={!selectedTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}