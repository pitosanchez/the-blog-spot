"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MedicalEditor } from '@/components/MedicalEditor/MedicalEditor';
import { 
  CME_ACTIVITY_TEMPLATE, 
  validateCMEActivity,
  calculateCMEPrice,
  type CMEActivity,
  type CMEQuestion,
  type FacultyDisclosure 
} from '@/lib/cme';

export default function CreateCMEPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [activity, setActivity] = useState<Partial<CMEActivity>>(CME_ACTIVITY_TEMPLATE);
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState<CMEQuestion[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

    // Initialize with user's name in faculty disclosures
    if (session.user.email && activity.facultyDisclosures) {
      setActivity(prev => ({
        ...prev,
        facultyDisclosures: [
          {
            name: session.user.email!,
            role: 'Author/Faculty',
            disclosures: ['Nothing to disclose'],
          },
        ],
      }));
    }
  }, [session, status, router]);

  const handleNext = () => {
    if (currentStep === 1) {
      const errors = validateCMEActivity(activity);
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }
    }
    
    if (currentStep === 2 && !content.trim()) {
      alert('Please add content to your CME activity');
      return;
    }
    
    if (currentStep === 3 && questions.length < 10) {
      alert('At least 10 test questions are required');
      return;
    }

    setValidationErrors([]);
    setCurrentStep(prev => Math.min(4, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cme/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity,
          content,
          questions,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/dashboard/cme/activity/${result.id}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create CME activity');
      }
    } catch (error) {
      alert('Network error occurred while creating CME activity');
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        learningObjectiveId: '',
      },
    ]);
  };

  const updateQuestion = (index: number, field: keyof CMEQuestion, value: any) => {
    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const addLearningObjective = () => {
    if (activity.learningObjectives) {
      setActivity(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives!, ''],
      }));
    }
  };

  const updateLearningObjective = (index: number, value: string) => {
    setActivity(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives?.map((obj, i) => 
        i === index ? value : obj
      ),
    }));
  };

  const addFacultyDisclosure = () => {
    setActivity(prev => ({
      ...prev,
      facultyDisclosures: [
        ...(prev.facultyDisclosures || []),
        {
          name: '',
          role: 'Faculty',
          disclosures: ['Nothing to disclose'],
        },
      ],
    }));
  };

  const updateFacultyDisclosure = (index: number, field: keyof FacultyDisclosure, value: any) => {
    setActivity(prev => ({
      ...prev,
      facultyDisclosures: prev.facultyDisclosures?.map((disclosure, i) => 
        i === index ? { ...disclosure, [field]: value } : disclosure
      ),
    }));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Activity Details", description: "Basic information and planning" },
    { number: 2, title: "Content Creation", description: "Educational content" },
    { number: 3, title: "Assessment", description: "Test questions and answers" },
    { number: 4, title: "Review & Submit", description: "Final review" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create CME Activity</h1>
          <p className="mt-2 text-gray-600">
            Create accredited continuing medical education content
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li key={step.number} className={`flex items-center ${stepIdx < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentStep > step.number
                          ? "bg-blue-600 text-white"
                          : currentStep === step.number
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="ml-4 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {stepIdx < steps.length - 1 && (
                    <div className="flex-1 ml-4">
                      <div className="h-0.5 bg-gray-300"></div>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Form Content */}
        <div className="bg-white shadow rounded-lg">
          {/* Step 1: Activity Details */}
          {currentStep === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Details</h2>
              
              {validationErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    value={activity.title || ''}
                    onChange={(e) => setActivity(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the title of your CME activity"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={activity.description || ''}
                    onChange={(e) => setActivity(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the educational content and objectives"
                  />
                </div>

                {/* Credit Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Type *
                    </label>
                    <select
                      value={activity.creditType || 'AMA_PRA_1'}
                      onChange={(e) => setActivity(prev => ({ ...prev, creditType: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AMA_PRA_1">AMA PRA Category 1</option>
                      <option value="AMA_PRA_2">AMA PRA Category 2</option>
                      <option value="AAFP">AAFP Prescribed</option>
                      <option value="ACEP">ACEP Approved</option>
                      <option value="AOA">AOA Category 1-A</option>
                      <option value="AANP">AANP Approved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Hours *
                    </label>
                    <input
                      type="number"
                      min="0.25"
                      max="50"
                      step="0.25"
                      value={activity.creditHours || 1}
                      onChange={(e) => setActivity(prev => ({ ...prev, creditHours: parseFloat(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Credit
                    </label>
                    <div className="text-lg font-semibold text-green-600">
                      ${calculateCMEPrice(activity.creditHours || 1)}
                    </div>
                    <p className="text-sm text-gray-500">$50 per credit</p>
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <input
                    type="text"
                    value={activity.targetAudience || ''}
                    onChange={(e) => setActivity(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Primary care physicians, cardiologists, nurses"
                  />
                </div>

                {/* Learning Objectives */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Objectives * (minimum 3)
                  </label>
                  <div className="space-y-3">
                    {activity.learningObjectives?.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateLearningObjective(index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter learning objective"
                        />
                        {index > 2 && (
                          <button
                            onClick={() => setActivity(prev => ({
                              ...prev,
                              learningObjectives: prev.learningObjectives?.filter((_, i) => i !== index),
                            }))}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addLearningObjective}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Learning Objective
                    </button>
                  </div>
                </div>

                {/* Faculty Disclosures */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty Disclosures *
                  </label>
                  <div className="space-y-4">
                    {activity.facultyDisclosures?.map((disclosure, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            placeholder="Faculty name"
                            value={disclosure.name}
                            onChange={(e) => updateFacultyDisclosure(index, 'name', e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Role"
                            value={disclosure.role}
                            onChange={(e) => updateFacultyDisclosure(index, 'role', e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <textarea
                          placeholder="Disclosures (one per line)"
                          value={disclosure.disclosures.join('\n')}
                          onChange={(e) => updateFacultyDisclosure(index, 'disclosures', e.target.value.split('\n'))}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addFacultyDisclosure}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Faculty Member
                    </button>
                  </div>
                </div>

                {/* Accreditation Statement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accreditation Statement *
                  </label>
                  <textarea
                    value={activity.accreditationStatement || ''}
                    onChange={(e) => setActivity(prev => ({ ...prev, accreditationStatement: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Content Creation */}
          {currentStep === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Educational Content</h2>
              <p className="text-gray-600 mb-6">
                Create the educational content for your CME activity. This content will be reviewed by learners before taking the assessment.
              </p>
              
              <MedicalEditor
                content={content}
                onChange={setContent}
                enablePHIDetection={true}
                enableAutoSave={true}
                placeholder="Create your educational content. Include evidence-based information, case studies, and clinical applications..."
              />
            </div>
          )}

          {/* Step 3: Assessment */}
          {currentStep === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Assessment Questions</h2>
              <p className="text-gray-600 mb-6">
                Create at least 10 multiple-choice questions to assess learning outcomes. Questions should align with your learning objectives.
              </p>

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                      <button
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Question */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question *
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your question"
                        />
                      </div>

                      {/* Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Answer Options *
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`correct_${index}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="text-sm font-medium text-gray-700 w-6">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuestion(index, 'options', newOptions);
                                }}
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Select the correct answer by clicking the radio button
                        </p>
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explanation *
                        </label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Explain why this answer is correct"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addQuestion}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600"
                >
                  + Add Question
                </button>

                <div className="text-sm text-gray-600">
                  Questions created: {questions.length} / 10 minimum
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Submit</h2>
              
              <div className="space-y-6">
                {/* Activity Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Title</dt>
                      <dd className="text-sm text-gray-900">{activity.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Credit Hours</dt>
                      <dd className="text-sm text-gray-900">{activity.creditHours}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Credit Type</dt>
                      <dd className="text-sm text-gray-900">{activity.creditType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Price</dt>
                      <dd className="text-sm text-gray-900">${calculateCMEPrice(activity.creditHours || 1)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Learning Objectives</dt>
                      <dd className="text-sm text-gray-900">{activity.learningObjectives?.length || 0}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Test Questions</dt>
                      <dd className="text-sm text-gray-900">{questions.length}</dd>
                    </div>
                  </dl>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-yellow-900 mb-2">Before You Submit</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• All content has been reviewed for accuracy and clinical relevance</li>
                    <li>• Learning objectives align with the educational content</li>
                    <li>• Test questions properly assess the learning objectives</li>
                    <li>• All faculty disclosures are complete and accurate</li>
                    <li>• Content is free from commercial bias</li>
                    <li>• No protected health information (PHI) is included</li>
                  </ul>
                </div>

                {/* Submission Agreement */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Agreement</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      By submitting this CME activity, I certify that:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>The content is original and does not infringe on any copyrights</li>
                      <li>All clinical information is evidence-based and current</li>
                      <li>Faculty disclosures are complete and accurate</li>
                      <li>The activity meets ACCME standards for continuing medical education</li>
                      <li>I understand this activity will be reviewed before approval</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Submit for Review'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}