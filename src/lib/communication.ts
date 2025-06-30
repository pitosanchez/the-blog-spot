// Communication and collaboration system for medical professionals

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  conversationId: string;
  content: string;
  messageType: MessageType;
  attachments?: MessageAttachment[];
  isEncrypted: boolean;
  readAt?: Date;
  editedAt?: Date;
  replyToId?: string;
  reactions?: MessageReaction[];
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type MessageType = 
  | 'TEXT'
  | 'IMAGE'
  | 'FILE'
  | 'MEDICAL_IMAGE'
  | 'CASE_DISCUSSION'
  | 'CONSULTATION_REQUEST'
  | 'URGENT'
  | 'SYSTEM';

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  isHIPAASecure: boolean;
  uploadedAt: Date;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  lastActivity: Date;
  isArchived: boolean;
  isEncrypted: boolean;
  metadata?: {
    specialty?: string;
    urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    caseId?: string;
    institutionId?: string;
  };
}

export type ConversationType = 
  | 'DIRECT_MESSAGE'
  | 'GROUP_CHAT'
  | 'CASE_DISCUSSION'
  | 'CONSULTATION'
  | 'TEAM_WORKSPACE'
  | 'FORUM_THREAD';

export interface ConversationParticipant {
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  lastReadAt?: Date;
  permissions: ParticipantPermissions;
  isActive: boolean;
}

export type ParticipantRole = 
  | 'ADMIN'
  | 'MODERATOR'
  | 'ATTENDING'
  | 'RESIDENT'
  | 'STUDENT'
  | 'CONSULTANT'
  | 'MEMBER';

export interface ParticipantPermissions {
  canRead: boolean;
  canWrite: boolean;
  canInvite: boolean;
  canRemove: boolean;
  canModerate: boolean;
  canAccessFiles: boolean;
  canShareCases: boolean;
}

export interface ForumPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
  isAnonymous: boolean;
  isPinned: boolean;
  isLocked: boolean;
  upvotes: number;
  downvotes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  replies: ForumReply[];
  attachments?: MessageAttachment[];
}

export type ForumCategory = 
  | 'CASE_DISCUSSION'
  | 'CLINICAL_QUESTION'
  | 'RESEARCH'
  | 'GUIDELINES'
  | 'DRUG_INFORMATION'
  | 'MEDICAL_NEWS'
  | 'CAREER_ADVICE'
  | 'GENERAL_DISCUSSION';

export interface ForumReply {
  id: string;
  authorId: string;
  content: string;
  parentId?: string; // For nested replies
  isAnonymous: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
  attachments?: MessageAttachment[];
  isBestAnswer: boolean;
  isModeratorResponse: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  type: WorkspaceType;
  members: WorkspaceMember[];
  channels: WorkspaceChannel[];
  documents: WorkspaceDocument[];
  cases: WorkspaceCase[];
  isPrivate: boolean;
  institutionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkspaceType = 
  | 'MEDICAL_TEAM'
  | 'RESEARCH_GROUP'
  | 'DEPARTMENT'
  | 'MULTIDISCIPLINARY'
  | 'EDUCATIONAL';

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  permissions: WorkspacePermissions;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
}

export type WorkspaceRole = 
  | 'OWNER'
  | 'ADMIN'
  | 'SENIOR_PHYSICIAN'
  | 'PHYSICIAN'
  | 'RESIDENT'
  | 'NURSE'
  | 'STUDENT'
  | 'OBSERVER';

export interface WorkspacePermissions {
  canManageMembers: boolean;
  canCreateChannels: boolean;
  canUploadFiles: boolean;
  canCreateCases: boolean;
  canModerate: boolean;
  canAccessPatientData: boolean;
  canExportData: boolean;
}

export interface WorkspaceChannel {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  type: ChannelType;
  isPrivate: boolean;
  members: string[]; // User IDs
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
}

export type ChannelType = 
  | 'GENERAL'
  | 'CASES'
  | 'RESEARCH'
  | 'ROUNDS'
  | 'ANNOUNCEMENTS'
  | 'URGENT'
  | 'SOCIAL';

export interface WorkspaceDocument {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  type: DocumentType;
  uploadedBy: string;
  fileUrl?: string;
  version: number;
  collaborators: DocumentCollaborator[];
  permissions: DocumentPermissions;
  isTemplate: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentType = 
  | 'PROTOCOL'
  | 'GUIDELINE'
  | 'TEMPLATE'
  | 'RESEARCH_PAPER'
  | 'CASE_REPORT'
  | 'POLICY'
  | 'EDUCATIONAL_MATERIAL';

export interface DocumentCollaborator {
  userId: string;
  role: 'EDITOR' | 'REVIEWER' | 'VIEWER';
  lastAccessed: Date;
}

export interface DocumentPermissions {
  isPublic: boolean;
  canEdit: string[]; // User IDs
  canReview: string[];
  canView: string[];
}

export interface WorkspaceCase {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  patientId?: string; // Anonymized patient identifier
  status: CaseStatus;
  priority: CasePriority;
  assignedTo: string[];
  createdBy: string;
  specialty: string;
  tags: string[];
  timeline: CaseTimelineEntry[];
  attachments: MessageAttachment[];
  discussions: CaseDiscussion[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export type CaseStatus = 
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'UNDER_REVIEW'
  | 'COMPLETED'
  | 'CLOSED'
  | 'ARCHIVED';

export type CasePriority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT'
  | 'CRITICAL';

export interface CaseTimelineEntry {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  attachments?: MessageAttachment[];
}

export interface CaseDiscussion {
  id: string;
  userId: string;
  content: string;
  type: 'COMMENT' | 'DIAGNOSIS' | 'TREATMENT_PLAN' | 'FOLLOWUP';
  timestamp: Date;
  replies: CaseDiscussionReply[];
}

export interface CaseDiscussionReply {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface PeerReview {
  id: string;
  reviewerId: string;
  contentId: string;
  contentType: 'PUBLICATION' | 'CASE' | 'DOCUMENT' | 'PRESENTATION';
  status: ReviewStatus;
  rating?: number; // 1-5 scale
  feedback: ReviewFeedback[];
  isAnonymous: boolean;
  dueDate?: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ReviewStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'REVISION_REQUIRED';

export interface ReviewFeedback {
  section: string;
  type: 'SUGGESTION' | 'CORRECTION' | 'QUESTION' | 'PRAISE' | 'CONCERN';
  content: string;
  lineNumber?: number;
  isResolved: boolean;
  timestamp: Date;
}

export interface MentorshipRelation {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MentorshipStatus;
  specialty: string;
  goals: string[];
  meetingSchedule: MeetingSchedule;
  progress: MentorshipProgress[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export type MentorshipStatus = 
  | 'PENDING'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'TERMINATED';

export interface MeetingSchedule {
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'AS_NEEDED';
  duration: number; // minutes
  preferredTime?: string;
  timezone: string;
}

export interface MentorshipProgress {
  id: string;
  date: Date;
  topic: string;
  notes: string;
  goals: string[];
  nextSteps: string[];
  rating?: number;
}

// Communication utilities
export class CommunicationManager {
  static async sendMessage(
    senderId: string,
    conversationId: string,
    content: string,
    messageType: MessageType = 'TEXT',
    attachments?: MessageAttachment[]
  ): Promise<Message> {
    // Implementation would create encrypted message
    const message: Message = {
      id: this.generateId(),
      senderId,
      conversationId,
      content: await this.encryptContent(content),
      messageType,
      attachments,
      isEncrypted: true,
      timestamp: new Date(),
    };

    return message;
  }

  static async createConversation(
    type: ConversationType,
    participantIds: string[],
    title?: string,
    metadata?: any
  ): Promise<Conversation> {
    const participants = participantIds.map(userId => ({
      userId,
      role: 'MEMBER' as ParticipantRole,
      joinedAt: new Date(),
      permissions: this.getDefaultPermissions(),
      isActive: true,
    }));

    return {
      id: this.generateId(),
      type,
      title,
      participants,
      lastActivity: new Date(),
      isArchived: false,
      isEncrypted: true,
      metadata,
    };
  }

  static async createWorkspace(
    name: string,
    ownerId: string,
    type: WorkspaceType,
    isPrivate: boolean = false
  ): Promise<Workspace> {
    return {
      id: this.generateId(),
      name,
      description: '',
      ownerId,
      type,
      members: [{
        userId: ownerId,
        role: 'OWNER',
        permissions: this.getOwnerPermissions(),
        joinedAt: new Date(),
        lastActive: new Date(),
        isActive: true,
      }],
      channels: [{
        id: this.generateId(),
        workspaceId: '', // Will be set after workspace creation
        name: 'general',
        type: 'GENERAL',
        isPrivate: false,
        members: [ownerId],
        createdBy: ownerId,
        createdAt: new Date(),
        lastActivity: new Date(),
      }],
      documents: [],
      cases: [],
      isPrivate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static validateMedicalCommunication(content: string): {
    isValid: boolean;
    warnings: string[];
    containsPHI: boolean;
  } {
    const warnings: string[] = [];
    let containsPHI = false;

    // Check for potential PHI
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{10,}\b/, // Phone numbers
      /\b[A-Z0-9]{2,4}\d{6,}\b/, // Medical record numbers
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // Dates that might be DOB
    ];

    phiPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        containsPHI = true;
        warnings.push('Potential PHI detected. Please review before sending.');
      }
    });

    // Check for unprofessional language
    const unprofessionalWords = ['stupid', 'incompetent', 'idiot'];
    unprofessionalWords.forEach(word => {
      if (content.toLowerCase().includes(word)) {
        warnings.push('Consider using more professional language.');
      }
    });

    return {
      isValid: warnings.length === 0,
      warnings,
      containsPHI,
    };
  }

  private static async encryptContent(content: string): Promise<string> {
    // Implementation would use proper encryption
    return content; // Placeholder
  }

  private static generateId(): string {
    return `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static getDefaultPermissions(): ParticipantPermissions {
    return {
      canRead: true,
      canWrite: true,
      canInvite: false,
      canRemove: false,
      canModerate: false,
      canAccessFiles: true,
      canShareCases: false,
    };
  }

  private static getOwnerPermissions(): WorkspacePermissions {
    return {
      canManageMembers: true,
      canCreateChannels: true,
      canUploadFiles: true,
      canCreateCases: true,
      canModerate: true,
      canAccessPatientData: true,
      canExportData: true,
    };
  }
}

// Real-time communication events
export interface CommunicationEvent {
  type: CommunicationEventType;
  data: any;
  timestamp: Date;
  userId?: string;
  conversationId?: string;
  workspaceId?: string;
}

export type CommunicationEventType = 
  | 'MESSAGE_SENT'
  | 'MESSAGE_READ'
  | 'USER_TYPING'
  | 'USER_JOINED'
  | 'USER_LEFT'
  | 'CONVERSATION_CREATED'
  | 'WORKSPACE_UPDATED'
  | 'CASE_UPDATED'
  | 'PEER_REVIEW_SUBMITTED'
  | 'URGENT_MESSAGE'
  | 'SYSTEM_NOTIFICATION';

// Notification preferences
export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  urgentOnly: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    timezone: string;
  };
  categories: {
    directMessages: boolean;
    groupMessages: boolean;
    mentions: boolean;
    caseUpdates: boolean;
    peerReviews: boolean;
    workspaceActivity: boolean;
    systemAnnouncements: boolean;
  };
}