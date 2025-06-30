// CME Credit Management System
import { prisma } from '@/lib/prisma';

export interface CMEActivity {
  id: string;
  title: string;
  description: string;
  learningObjectives: string[];
  targetAudience: string;
  accreditationStatement: string;
  creditType: 'AMA_PRA_1' | 'AMA_PRA_2' | 'AAFP' | 'ACEP' | 'AOA' | 'AANP';
  creditHours: number;
  releaseDate: Date;
  expirationDate: Date;
  commercialSupport: string[];
  facultyDisclosures: FacultyDisclosure[];
}

export interface FacultyDisclosure {
  name: string;
  role: string;
  disclosures: string[];
}

export interface CMETest {
  id: string;
  activityId: string;
  questions: CMEQuestion[];
  passingScore: number; // percentage
  attemptsAllowed: number;
  timeLimit?: number; // in minutes
}

export interface CMEQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  learningObjectiveId: string;
}

export interface CMECompletion {
  userId: string;
  activityId: string;
  preTestScore?: number;
  postTestScore: number;
  completionDate: Date;
  creditsEarned: number;
  certificateUrl?: string;
  timeSpent: number; // in minutes
}

export interface CMETranscript {
  userId: string;
  totalCredits: number;
  creditsByType: Record<string, number>;
  completions: CMECompletion[];
  expiringCredits: {
    credits: number;
    expirationDate: Date;
  }[];
}

// Credit type requirements by specialty
export const SPECIALTY_REQUIREMENTS = {
  'Internal Medicine': {
    annualRequirement: 50,
    types: ['AMA_PRA_1', 'AMA_PRA_2'],
    minimumCategory1: 25,
  },
  'Surgery': {
    annualRequirement: 50,
    types: ['AMA_PRA_1'],
    minimumCategory1: 40,
  },
  'Pediatrics': {
    annualRequirement: 40,
    types: ['AMA_PRA_1', 'AMA_PRA_2', 'AAFP'],
    minimumCategory1: 20,
  },
  'Emergency Medicine': {
    annualRequirement: 50,
    types: ['AMA_PRA_1', 'ACEP'],
    minimumCategory1: 35,
  },
  'Family Medicine': {
    annualRequirement: 50,
    types: ['AMA_PRA_1', 'AAFP'],
    minimumCategory1: 25,
  },
  // Add more specialties as needed
};

// Calculate CME credit price
export const CME_CREDIT_PRICE = 50; // $50 per credit as specified

export function calculateCMEPrice(credits: number): number {
  return credits * CME_CREDIT_PRICE;
}

// Create a new CME activity
export async function createCMEActivity(
  publicationId: string,
  activity: Partial<CMEActivity>,
  test: Partial<CMETest>
): Promise<string> {
  // Validate activity data
  if (!activity.creditHours || activity.creditHours <= 0 || activity.creditHours > 50) {
    throw new Error('Invalid credit hours. Must be between 0.25 and 50.');
  }

  if (!activity.learningObjectives || activity.learningObjectives.length < 3) {
    throw new Error('At least 3 learning objectives are required.');
  }

  if (!test.questions || test.questions.length < 10) {
    throw new Error('At least 10 test questions are required.');
  }

  // Store CME activity data in publication metadata
  const publication = await prisma.publication.update({
    where: { id: publicationId },
    data: {
      accessType: 'CME',
      cmeCredits: activity.creditHours,
      metadata: {
        cmeActivity: activity,
        cmeTest: test,
      },
    },
  });

  return publication.id;
}

// Record CME completion
export async function recordCMECompletion(
  userId: string,
  publicationId: string,
  testScore: number,
  timeSpent: number
): Promise<CMECompletion> {
  const publication = await prisma.publication.findUnique({
    where: { id: publicationId },
  });

  if (!publication || publication.accessType !== 'CME') {
    throw new Error('Invalid CME activity');
  }

  const metadata = publication.metadata as any;
  const test = metadata?.cmeTest;
  
  if (!test || testScore < test.passingScore) {
    throw new Error(`Minimum passing score is ${test.passingScore}%`);
  }

  // Check if already completed
  const existingCompletion = await prisma.cMECompletion.findUnique({
    where: {
      userId_publicationId: {
        userId,
        publicationId,
      },
    },
  });

  if (existingCompletion) {
    throw new Error('CME activity already completed');
  }

  // Record completion
  const completion = await prisma.cMECompletion.create({
    data: {
      userId,
      publicationId,
      creditsEarned: publication.cmeCredits || 0,
      completedAt: new Date(),
      certificateUrl: await generateCertificate(userId, publicationId),
    },
  });

  // Update user's CME tracking
  await updateUserCMEProgress(userId, publication.cmeCredits || 0);

  return {
    userId,
    activityId: publicationId,
    postTestScore: testScore,
    completionDate: completion.completedAt,
    creditsEarned: completion.creditsEarned,
    certificateUrl: completion.certificateUrl || undefined,
    timeSpent,
  };
}

// Get user's CME transcript
export async function getUserCMETranscript(userId: string): Promise<CMETranscript> {
  const completions = await prisma.cMECompletion.findMany({
    where: { userId },
    include: {
      publication: true,
    },
    orderBy: {
      completedAt: 'desc',
    },
  });

  const totalCredits = completions.reduce((sum, c) => sum + c.creditsEarned, 0);
  
  // Group credits by type
  const creditsByType: Record<string, number> = {};
  completions.forEach(completion => {
    const type = 'AMA_PRA_1'; // Default for now
    creditsByType[type] = (creditsByType[type] || 0) + completion.creditsEarned;
  });

  // Calculate expiring credits (3-year cycle)
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  
  const expiringCredits = completions
    .filter(c => c.completedAt > threeYearsAgo)
    .map(c => ({
      credits: c.creditsEarned,
      expirationDate: new Date(c.completedAt.getTime() + (3 * 365 * 24 * 60 * 60 * 1000)),
    }));

  return {
    userId,
    totalCredits,
    creditsByType,
    completions: completions.map(c => ({
      userId: c.userId,
      activityId: c.publicationId,
      postTestScore: 0, // Would need to store this
      completionDate: c.completedAt,
      creditsEarned: c.creditsEarned,
      certificateUrl: c.certificateUrl || undefined,
      timeSpent: 0, // Would need to store this
    })),
    expiringCredits,
  };
}

// Check if user meets specialty requirements
export async function checkSpecialtyRequirements(
  userId: string,
  specialty: string
): Promise<{
  meetsRequirements: boolean;
  currentCredits: number;
  requiredCredits: number;
  deficit: number;
  details: Record<string, any>;
}> {
  const requirements = SPECIALTY_REQUIREMENTS[specialty as keyof typeof SPECIALTY_REQUIREMENTS];
  if (!requirements) {
    throw new Error(`No requirements found for specialty: ${specialty}`);
  }

  const transcript = await getUserCMETranscript(userId);
  const currentYear = new Date().getFullYear();
  
  // Get credits from current year only
  const currentYearCredits = transcript.completions
    .filter(c => c.completionDate.getFullYear() === currentYear)
    .reduce((sum, c) => sum + c.creditsEarned, 0);

  const category1Credits = transcript.creditsByType['AMA_PRA_1'] || 0;
  const meetsRequirements = 
    currentYearCredits >= requirements.annualRequirement &&
    category1Credits >= requirements.minimumCategory1;

  return {
    meetsRequirements,
    currentCredits: currentYearCredits,
    requiredCredits: requirements.annualRequirement,
    deficit: Math.max(0, requirements.annualRequirement - currentYearCredits),
    details: {
      category1Credits,
      minimumCategory1Required: requirements.minimumCategory1,
      acceptedTypes: requirements.types,
    },
  };
}

// Generate CME certificate
async function generateCertificate(
  userId: string,
  publicationId: string
): Promise<string> {
  // In production, this would generate a PDF certificate
  // For now, return a placeholder URL
  const certificateId = `cert_${userId}_${publicationId}_${Date.now()}`;
  return `/api/cme/certificate/${certificateId}`;
}

// Update user's CME progress
async function updateUserCMEProgress(userId: string, creditsEarned: number): Promise<void> {
  // This would update various tracking metrics
  // For now, just log the activity
  await prisma.auditLog.create({
    data: {
      userId,
      activity: 'CME_CREDIT_EARNED',
      metadata: {
        creditsEarned,
        timestamp: new Date(),
      },
    },
  });
}

// Get available CME activities
export async function getAvailableCMEActivities(
  specialty?: string,
  creditType?: string
): Promise<any[]> {
  const where: any = {
    accessType: 'CME',
    publishedAt: { not: null },
  };

  if (specialty) {
    where.tags = { has: specialty };
  }

  const activities = await prisma.publication.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          email: true,
          medicalCredentials: true,
          verificationStatus: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  return activities.map(activity => {
    const metadata = activity.metadata as any;
    return {
      id: activity.id,
      title: activity.title,
      credits: activity.cmeCredits,
      price: calculateCMEPrice(activity.cmeCredits || 0),
      releaseDate: activity.publishedAt,
      expirationDate: metadata?.cmeActivity?.expirationDate,
      learningObjectives: metadata?.cmeActivity?.learningObjectives || [],
      author: activity.author,
      tags: activity.tags,
    };
  });
}

// Validate CME activity before publication
export function validateCMEActivity(activity: Partial<CMEActivity>): string[] {
  const errors: string[] = [];

  if (!activity.title || activity.title.length < 10) {
    errors.push('Title must be at least 10 characters long');
  }

  if (!activity.learningObjectives || activity.learningObjectives.length < 3) {
    errors.push('At least 3 learning objectives are required');
  }

  if (!activity.targetAudience) {
    errors.push('Target audience must be specified');
  }

  if (!activity.accreditationStatement) {
    errors.push('Accreditation statement is required');
  }

  if (!activity.facultyDisclosures || activity.facultyDisclosures.length === 0) {
    errors.push('Faculty disclosures are required');
  }

  if (activity.creditHours && (activity.creditHours < 0.25 || activity.creditHours > 50)) {
    errors.push('Credit hours must be between 0.25 and 50');
  }

  // Note: Release and expiration dates are auto-generated in the create API
  // so we don't validate them here

  return errors;
}

// Export CME transcript for state boards
export async function exportCMETranscript(
  userId: string,
  format: 'PDF' | 'CSV' | 'XML',
  stateBoard?: string
): Promise<string> {
  const transcript = await getUserCMETranscript(userId);
  
  // In production, this would generate the appropriate format
  // For now, return a placeholder URL
  const exportId = `export_${userId}_${format}_${Date.now()}`;
  return `/api/cme/export/${exportId}`;
}

// CME activity planning form data
export const CME_ACTIVITY_TEMPLATE = {
  title: '',
  description: '',
  learningObjectives: ['', '', ''],
  targetAudience: '',
  accreditationStatement: 'This activity has been planned and implemented in accordance with the accreditation requirements and policies of the Accreditation Council for Continuing Medical Education (ACCME).',
  creditType: 'AMA_PRA_1',
  creditHours: 1,
  commercialSupport: [],
  facultyDisclosures: [
    {
      name: '',
      role: 'Author/Faculty',
      disclosures: ['Nothing to disclose'],
    },
  ],
};