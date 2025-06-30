// Re-export Prisma types for easier importing
export type {
  User,
  Publication,
  Subscription,
  CMECompletion,
  Conference,
  ConferenceAttendance,
  UserRole,
  VerificationStatus,
  PublicationType,
  AccessType,
  SubscriptionTier,
  SubscriptionStatus,
  ConferenceStatus,
} from '@prisma/client';

// Custom types for the application
export interface MedicalCredentials {
  degree: 'MD' | 'DO' | 'PhD' | 'NP' | 'PA' | 'RN' | 'PharmD';
  graduationYear: number;
  medicalSchool: string;
  residency?: string;
  fellowship?: string;
  boardCertifications: string[];
  licenseStates: string[];
}

export interface PublicationMetadata {
  medicalImages?: string[];
  references?: Reference[];
  patientCaseInfo?: PatientCaseInfo;
  studyData?: StudyData;
  procedureDetails?: ProcedureDetails;
}

export interface Reference {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  pmid?: string;
  url?: string;
}

export interface PatientCaseInfo {
  age: number;
  gender: 'male' | 'female' | 'other';
  presentingComplaint: string;
  medicalHistory: string[];
  medications: string[];
  allergies: string[];
  physicalExam: Record<string, string>;
  diagnosticTests: DiagnosticTest[];
  diagnosis: string[];
  treatment: string[];
  outcome: string;
}

export interface DiagnosticTest {
  type: string;
  date: string;
  results: string;
  normalRange?: string;
  interpretation: string;
}

export interface StudyData {
  studyType: string;
  sampleSize: number;
  duration: string;
  endpoints: string[];
  results: Record<string, any>;
  statisticalSignificance: boolean;
  pValue?: number;
  confidenceInterval?: string;
}

export interface ProcedureDetails {
  procedureName: string;
  indication: string;
  technique: string;
  complications?: string[];
  duration: number; // in minutes
  anesthesia: string;
  equipment: string[];
  outcomes: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  medicalCredentials?: MedicalCredentials;
  specialties: string[];
  licenseNumber?: string;
  institution?: string;
}

export interface PublicationForm {
  title: string;
  content: string;
  type: PublicationType;
  accessType: AccessType;
  price?: number;
  cmeCredits?: number;
  tags: string[];
  metadata?: PublicationMetadata;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  type?: PublicationType;
  accessType?: AccessType;
  specialty?: string;
  priceRange?: [number, number];
  cmeCredits?: boolean;
  author?: string;
  tags?: string[];
  dateRange?: [Date, Date];
}

export interface SortOptions {
  field: 'createdAt' | 'publishedAt' | 'viewCount' | 'title' | 'price';
  order: 'asc' | 'desc';
}