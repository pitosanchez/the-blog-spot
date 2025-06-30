"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { calculateCMEPrice } from '@/lib/cme';

interface CMEActivityPageProps {
  params: {
    id: string;
  };
}

interface CMEActivity {
  id: string;
  title: string;
  content: string;
  cmeCredits: number;
  metadata: {
    cmeActivity: {
      description: string;
      learningObjectives: string[];
      targetAudience: string;
      accreditationStatement: string;
      creditType: string;
      creditHours: number;
      facultyDisclosures: Array<{
        name: string;
        role: string;
        disclosures: string[];
      }>;
    };
    cmeTest: {
      questions: Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
      }>;
      passingScore: number;
      attemptsAllowed: number;
      timeLimit?: number;
    };
  };
  author: {
    email: string;
    medicalCredentials?: any;
  };
}

export default function CMEActivityPage({ params }: CMEActivityPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activity, setActivity] = useState<CMEActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'overview' | 'content' | 'test' | 'completed'>('overview');
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchActivity();
    }
  }, [params.id]);

  useEffect(() => {
    // Track time when starting content or test
    if (currentStep === 'content' && !startTime) {
      setStartTime(new Date());
    }
  }, [currentStep, startTime]);

  const fetchActivity = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/publications/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.accessType === 'CME') {
          setActivity(data);
          // Initialize answers array
          if (data.metadata?.cmeTest?.questions) {
            setAnswers(new Array(data.metadata.cmeTest.questions.length).fill(-1));
          }
        } else {
          router.push('/discover/cme');
        }
      } else {
        router.push('/discover/cme');
      }
    } catch (error) {
      console.error('Error fetching CME activity:', error);
      router.push('/discover/cme');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartActivity = () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    setCurrentStep('content');
  };

  const handleStartTest = () => {
    setCurrentStep('test');
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  const handleSubmitTest = async () => {
    if (!activity || !session) return;

    // Check if all questions are answered
    if (answers.some(answer => answer === -1)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const endTime = new Date();
      const totalTimeSpent = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 0;

      const response = await fetch('/api/cme/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicationId: activity.id,
          answers,
          timeSpent: totalTimeSpent,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setTestResults(result);
        setCurrentStep('completed');
      } else {
        alert(result.error || 'Failed to submit test');
      }
    } catch (error) {
      alert('Error submitting test');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Not Found</h2>
          <button
            onClick={() => router.push('/discover/cme')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to CME Activities
          </button>
        </div>
      </div>
    );
  }

  const { cmeActivity, cmeTest } = activity.metadata;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {[
                { step: 'overview', title: 'Overview', description: 'Activity details' },
                { step: 'content', title: 'Content', description: 'Educational material' },
                { step: 'test', title: 'Assessment', description: 'Knowledge test' },
                { step: 'completed', title: 'Complete', description: 'Certificate' },
              ].map((item, index) => {
                const isCurrent = currentStep === item.step;
                const isCompleted = 
                  (currentStep === 'content' && item.step === 'overview') ||
                  (currentStep === 'test' && ['overview', 'content'].includes(item.step)) ||
                  (currentStep === 'completed' && ['overview', 'content', 'test'].includes(item.step));
                
                return (
                  <li key={item.step} className={`flex items-center ${index < 3 ? 'flex-1' : ''}`}>
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          isCompleted
                            ? "bg-green-600 text-white"
                            : isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="ml-4 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="flex-1 ml-4">
                        <div className="h-0.5 bg-gray-300"></div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Overview */}
        {currentStep === 'overview' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{activity.title}</h1>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span className="flex items-center">
                    🏆 {cmeActivity.creditHours} {cmeActivity.creditType} Credits
                  </span>
                  <span className="flex items-center">
                    💰 ${calculateCMEPrice(cmeActivity.creditHours)}
                  </span>
                  <span className="flex items-center">
                    🕒 {cmeTest.timeLimit || 60} minutes
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700">{cmeActivity.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {cmeActivity.learningObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Target Audience</h3>
                    <p className="text-gray-700">{cmeActivity.targetAudience}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Accreditation</h3>
                    <p className="text-gray-700">{cmeActivity.accreditationStatement}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Details</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Credits</dt>
                        <dd className="text-sm text-gray-900">{cmeActivity.creditHours} {cmeActivity.creditType}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Format</dt>
                        <dd className="text-sm text-gray-900">Online Article + Test</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Passing Score</dt>
                        <dd className="text-sm text-gray-900">{cmeTest.passingScore}%</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Attempts Allowed</dt>
                        <dd className="text-sm text-gray-900">{cmeTest.attemptsAllowed}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Faculty</h3>
                    <div className="space-y-3">
                      {cmeActivity.facultyDisclosures.map((faculty, index) => (
                        <div key={index}>
                          <p className="font-medium text-gray-900">{faculty.name}</p>
                          <p className="text-sm text-gray-600">{faculty.role}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {faculty.disclosures.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleStartActivity}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Start Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {currentStep === 'content' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Educational Content</h2>
                <p className="text-gray-600">
                  Please review the content below before proceeding to the assessment.
                </p>
              </div>

              <div className="prose max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: activity.content }} />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('overview')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back to Overview
                </button>
                <button
                  onClick={handleStartTest}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Continue to Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Test */}
        {currentStep === 'test' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment</h2>
                <p className="text-gray-600">
                  Answer all questions to complete the CME activity. Passing score: {cmeTest.passingScore}%
                </p>
              </div>

              <div className="space-y-8">
                {cmeTest.questions.map((question, questionIndex) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Question {questionIndex + 1}. {question.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={`question_${questionIndex}`}
                            checked={answers[questionIndex] === optionIndex}
                            onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-gray-700">
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep('content')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back to Content
                </button>
                <button
                  onClick={handleSubmitTest}
                  disabled={isSubmitting || answers.some(answer => answer === -1)}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completion */}
        {currentStep === 'completed' && testResults && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
                <p className="text-gray-600 mb-6">
                  You have successfully completed this CME activity and earned {testResults.creditsEarned} credits.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Score</dt>
                    <dd className="text-lg font-semibold text-gray-900">{testResults.postTestScore}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Credits Earned</dt>
                    <dd className="text-lg font-semibold text-gray-900">{testResults.creditsEarned}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {testResults.certificateUrl && (
                  <a
                    href={testResults.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Download Certificate
                  </a>
                )}
                <button
                  onClick={() => router.push('/dashboard/cme')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  View CME Dashboard
                </button>
                <button
                  onClick={() => router.push('/discover/cme')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Find More Activities
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}