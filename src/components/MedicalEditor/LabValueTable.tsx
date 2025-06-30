"use client";

import { useState } from 'react';
import { labValues, LabValue, searchLabValues } from '@/lib/medical-terminology';

interface LabValueTableProps {
  onInsert: (tableHtml: string) => void;
  onClose: () => void;
}

export function LabValueTable({ onInsert, onClose }: LabValueTableProps) {
  const [selectedLabs, setSelectedLabs] = useState<LabValue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  const filteredLabs = searchTerm 
    ? searchLabValues(searchTerm, 20)
    : labValues;

  const handleLabToggle = (lab: LabValue) => {
    setSelectedLabs(prev => {
      const exists = prev.find(l => l.name === lab.name);
      if (exists) {
        return prev.filter(l => l.name !== lab.name);
      } else {
        return [...prev, lab];
      }
    });
  };

  const handleCustomValueChange = (labName: string, value: string) => {
    setCustomValues(prev => ({
      ...prev,
      [labName]: value
    }));
  };

  const getLabStatus = (lab: LabValue, value: string): 'normal' | 'high' | 'low' | 'critical' | 'unknown' => {
    if (!value || isNaN(Number(value))) return 'unknown';
    
    const numValue = Number(value);
    
    // Check critical values first
    if (lab.criticalLow && numValue <= lab.criticalLow) return 'critical';
    if (lab.criticalHigh && numValue >= lab.criticalHigh) return 'critical';
    
    // Check normal range
    if (lab.normalRange.min && lab.normalRange.max) {
      if (numValue < lab.normalRange.min) return 'low';
      if (numValue > lab.normalRange.max) return 'high';
      return 'normal';
    } else if (lab.normalRange.max) {
      if (numValue > lab.normalRange.max) return 'high';
      return 'normal';
    }
    
    return 'unknown';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'high': return 'text-orange-600';
      case 'low': return 'text-blue-600';
      case 'critical': return 'text-red-600 font-bold';
      default: return 'text-gray-600';
    }
  };

  const generateTableHtml = (): string => {
    if (selectedLabs.length === 0) return '';

    const rows = selectedLabs.map(lab => {
      const value = customValues[lab.name] || '';
      const status = getLabStatus(lab, value);
      const normalRangeText = lab.normalRange.text || 
        (lab.normalRange.min && lab.normalRange.max 
          ? `${lab.normalRange.min}-${lab.normalRange.max}`
          : lab.normalRange.max 
            ? `<${lab.normalRange.max}`
            : 'See reference');

      return `
        <tr>
          <td class="border border-gray-300 px-4 py-2 font-medium">${lab.name}</td>
          <td class="border border-gray-300 px-4 py-2 text-center ${getStatusColor(status)}">${value || '—'}</td>
          <td class="border border-gray-300 px-4 py-2 text-center">${lab.unit}</td>
          <td class="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">${normalRangeText}</td>
        </tr>
      `;
    }).join('');

    return `
      <table class="border-collapse border border-gray-300 w-full my-4">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Lab Test</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-semibold">Value</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-semibold">Unit</th>
            <th class="border border-gray-300 px-4 py-2 text-center font-semibold">Normal Range</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  };

  const handleInsert = () => {
    const tableHtml = generateTableHtml();
    if (tableHtml) {
      onInsert(tableHtml);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Insert Lab Values Table</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search lab tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex h-96">
          {/* Lab Selection */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-4">
            <h4 className="font-medium text-gray-900 mb-3">Available Lab Tests</h4>
            <div className="space-y-2">
              {filteredLabs.map((lab) => (
                <label
                  key={lab.name}
                  className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedLabs.some(l => l.name === lab.name)}
                    onChange={() => handleLabToggle(lab)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{lab.name}</div>
                    <div className="text-sm text-gray-500">
                      {lab.category} • {lab.unit}
                    </div>
                    <div className="text-xs text-gray-400">
                      Normal: {lab.normalRange.text || 
                        (lab.normalRange.min && lab.normalRange.max 
                          ? `${lab.normalRange.min}-${lab.normalRange.max} ${lab.unit}`
                          : lab.normalRange.max 
                            ? `<${lab.normalRange.max} ${lab.unit}`
                            : 'See reference')}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Selected Labs with Values */}
          <div className="w-1/2 overflow-y-auto p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Selected Labs ({selectedLabs.length})
            </h4>
            
            {selectedLabs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Select lab tests from the left panel
              </p>
            ) : (
              <div className="space-y-4">
                {selectedLabs.map((lab) => {
                  const value = customValues[lab.name] || '';
                  const status = getLabStatus(lab, value);
                  
                  return (
                    <div key={lab.name} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{lab.name}</h5>
                        <button
                          onClick={() => handleLabToggle(lab)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div>Unit: {lab.unit}</div>
                        <div>Category: {lab.category}</div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        Normal Range: {lab.normalRange.text || 
                          (lab.normalRange.min && lab.normalRange.max 
                            ? `${lab.normalRange.min}-${lab.normalRange.max}`
                            : lab.normalRange.max 
                              ? `<${lab.normalRange.max}`
                              : 'See reference')} {lab.unit}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={value}
                          onChange={(e) => handleCustomValueChange(lab.name, e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500">{lab.unit}</span>
                        {value && (
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        )}
                      </div>
                      
                      {status === 'critical' && value && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                          ⚠️ Critical value - immediate attention required
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Preview and Actions */}
        <div className="border-t border-gray-200 p-4">
          {selectedLabs.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="border border-gray-200 rounded p-2 text-sm max-h-32 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: generateTableHtml() }} />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={selectedLabs.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}