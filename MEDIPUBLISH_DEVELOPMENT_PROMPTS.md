# MediPublish - 18 Development Prompts List

## Foundation & Setup (Prompts 1-3)

### Prompt 1: Initialize Next.js Project with TypeScript

```
Create a new Next.js 14 project with TypeScript, Tailwind CSS, and the following structure:
- Use App Router
- Set up ESLint and Prettier
- Configure path aliases (@/components, @/lib, @/types, etc.)
- Add .env.local with placeholders for:
  - DATABASE_URL
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
  - AWS_ACCESS_KEY
  - AWS_SECRET_KEY
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL

Project name: medipublish-platform
```

### Prompt 2: Database Schema Design

```
Create a PostgreSQL schema using Prisma with the following models:

1. User model:
   - id, email, password (hashed)
   - role: READER | CREATOR | ADMIN
   - verificationStatus: PENDING | VERIFIED | REJECTED
   - medicalCredentials: JSON (stores MD/DO/PhD info)
   - specialties: String[]
   - licenseNumber: String?
   - institution: String?
   - profileImage: String?
   - bio: Text?
   - createdAt, updatedAt

2. Publication model:
   - id, title, slug, content (rich text)
   - authorId (relation to User)
   - type: ARTICLE | VIDEO | CASE_STUDY | CONFERENCE
   - accessType: FREE | PAID | CME
   - price: Decimal?
   - cmeCredits: Int?
   - tags: String[]
   - publishedAt: DateTime?
   - viewCount: Int
   - metadata: JSON (medical images, references)

3. Subscription model:
   - id, subscriberId, creatorId
   - tier: BASIC | PROFESSIONAL | INSTITUTIONAL
   - status: ACTIVE | CANCELLED | EXPIRED
   - stripeSubscriptionId: String
   - currentPeriodEnd: DateTime
   - price: Decimal

4. CMECompletion model:
   - id, userId, publicationId
   - creditsEarned: Int
   - completedAt: DateTime
   - certificateUrl: String?

5. Conference model:
   - id, hostId, title, description
   - scheduledAt: DateTime
   - price: Decimal
   - maxAttendees: Int
   - recordingUrl: String?
   - status: UPCOMING | LIVE | COMPLETED

Include all necessary relations and indexes for performance.
```

### Prompt 3: Authentication System

```
Implement a HIPAA-compliant authentication system using NextAuth.js:

1. Set up NextAuth with:
   - Credentials provider for email/password
   - JWT strategy with encrypted tokens
   - Session management with 15-minute timeout
   - Refresh token rotation

2. Create middleware for:
   - Protected routes (/dashboard, /create, /analytics)
   - Role-based access (CREATOR vs READER)
   - Medical credential verification status

3. Add security features:
   - Password requirements (min 12 chars, special chars, numbers)
   - 2FA using TOTP
   - Login attempt limiting
   - Session activity logging for HIPAA compliance

4. Create auth pages:
   - /auth/login
   - /auth/register (with medical credential upload)
   - /auth/verify-email
   - /auth/forgot-password
```

## Core Platform Features (Prompts 4-6)

### Prompt 4: Medical Credential Verification UI

```
Create a medical credential verification flow:

1. Multi-step registration form at /auth/register/medical:
   - Step 1: Basic info (name, email, password)
   - Step 2: Medical credentials (degree type, license number, state)
   - Step 3: Document upload (medical license, board certification)
   - Step 4: Institutional verification (hospital/practice affiliation)

2. Admin dashboard at /admin/verifications:
   - Queue of pending verifications
   - Document viewer with zoom/rotate for licenses
   - Approve/Reject buttons with reason field
   - Integration with state medical board APIs (mock for now)

3. Verification badge component:
   - Blue checkmark for verified physicians
   - Specialty badges (Cardiology, Neurology, etc.)
   - Hover tooltip with verification date

Use React Hook Form, Zod validation, and Uploadthing for file uploads.
```

### Prompt 5: Content Editor with Medical Features

```
Build a rich text editor for medical content:

1. Base editor using Tiptap or Lexical with:
   - Standard formatting (bold, italic, headers, lists)
   - Medical terminology autocomplete
   - Drug name validation and linking
   - Citation management (PubMed integration)

2. Medical-specific features:
   - DICOM image viewer component
   - Lab value tables with normal ranges
   - Anatomical diagram insertion
   - ICD-10/CPT code lookup
   - Case presentation template

3. Privacy features:
   - Patient detail redaction tool
   - HIPAA-compliant image anonymization
   - Automatic PHI detection and warning

4. Save draft every 30 seconds to localStorage
5. Publish workflow with preview mode
```

### Prompt 6: Subscription & Payment System

```
Implement Stripe payment system:

1. Pricing page at /pricing:
   - Individual: $29/month
   - Practice: $99/month (up to 5 creators)
   - Institution: $499/month (unlimited)
   - Annual discount (2 months free)

2. Stripe integration:
   - Set up Products and Prices in Stripe
   - Webhook handler for subscription events
   - Customer portal integration
   - Failed payment recovery flow

3. Creator dashboard at /dashboard/earnings:
   - Real-time earnings graph
   - Subscriber count and churn rate
   - Payout schedule (weekly/monthly)
   - Download tax documents

4. Subscription management:
   - Upgrade/downgrade flow
   - Pause subscription option
   - Group subscription invites
   - Usage-based pricing for institutions
```

## Medical-Specific Features (Prompts 7-9)

### Prompt 7: CME Credit System

```
Build CME (Continuing Medical Education) credit system:

1. CME content creation:
   - Additional fields in editor for learning objectives
   - Pre/post test question builder
   - Time tracking for credit calculation
   - CME review workflow

2. Credit tracking dashboard:
   - Progress bars for annual requirements
   - Certificate generation (PDF)
   - Credit transfer to state boards
   - Specialty-specific tracking

3. Accreditation management:
   - ACCME provider application tracking
   - Activity planning forms
   - Disclosure management
   - Commercial bias monitoring

4. Reporting:
   - Learner transcripts
   - Activity completion reports
   - State board format exports
```

### Prompt 8: Video Platform Integration

```
Create video infrastructure for medical content:

1. Video upload using AWS S3 and MediaConvert:
   - Support for 4K surgical videos
   - Automatic transcoding to multiple qualities
   - HLS streaming setup
   - Thumbnail generation

2. Video player with medical features:
   - Chapter markers for procedures
   - Annotation tools for teaching
   - Speed controls (0.5x to 2x)
   - Picture-in-picture mode
   - Closed captions requirement

3. Live streaming for conferences:
   - WebRTC integration using Daily.co
   - Screen sharing for presentations
   - Q&A panel with moderation
   - Recording with cloud storage
   - Attendance tracking for CME

4. Privacy controls:
   - Face blurring for patient privacy
   - Watermarking with viewer info
   - Download restrictions
```

### Prompt 9: Search and Discovery

```
Implement medical content search and discovery:

1. Elasticsearch integration:
   - Medical terminology synonyms
   - Specialty-based filtering
   - CME credit filtering
   - Price range filtering
   - Anatomical system categories

2. Homepage feed algorithm:
   - Specialty-based recommendations
   - Trending in your field
   - CME expiration reminders
   - Conference notifications
   - Following system for creators

3. Advanced search features:
   - Boolean operators
   - Date range filtering
   - Evidence level filtering
   - Image search capability
   - Save search alerts

4. SEO optimization:
   - Structured data for medical content
   - Sitemap generation
   - Meta tags for social sharing
```

## Platform Enhancement (Prompts 10-12)

### Prompt 10: Analytics Dashboard

```
Build analytics for creators and platform admin:

1. Creator Analytics (/dashboard/analytics):
   - Real-time view counter
   - Subscriber growth chart
   - Revenue breakdown by content type
   - Geographic distribution map
   - Engagement metrics (read time, completion rate)
   - Top performing content
   - A/B testing for titles

2. Platform Admin Analytics (/admin/analytics):
   - Total revenue and MRR
   - User acquisition funnel
   - Content moderation queue
   - Compliance monitoring
   - Server health metrics
   - Stripe webhook logs

3. Export capabilities:
   - CSV/Excel downloads
   - PDF reports
   - API for custom integrations
   - Scheduled email reports
```

### Prompt 11: HIPAA Compliance Infrastructure

```
Implement HIPAA compliance features:

1. Audit logging system:
   - User access logs with IP tracking
   - Content view/download tracking
   - Administrative action logs
   - Automated suspicious activity alerts

2. Data encryption:
   - AES-256 encryption at rest
   - TLS 1.3 for data in transit
   - Encrypted database fields for PHI
   - Secure key management with AWS KMS

3. Access controls:
   - Role-based permissions
   - Automatic session timeout
   - Re-authentication for sensitive actions
   - IP allowlisting for institutions

4. Compliance dashboard:
   - Security risk assessments
   - Training completion tracking
   - Incident response workflows
   - BAA management for partners
```

### Prompt 12: Mobile Responsiveness

```
Optimize entire platform for mobile devices:

1. Responsive design system:
   - Mobile-first approach
   - Touch-optimized interfaces
   - Swipe gestures for navigation
   - Offline mode with PWA

2. Mobile-specific features:
   - Simplified content creation
   - Voice-to-text for notes
   - Camera integration for case photos
   - Biometric authentication

3. Performance optimization:
   - Lazy loading images
   - Code splitting
   - Service worker caching
   - Reduced data mode

4. Native app considerations:
   - React Native shared components
   - Deep linking support
   - Push notification system
```

## Production Preparation (Prompts 13-15)

### Prompt 13: Testing Suite

```
Set up comprehensive testing:

1. Unit tests with Jest:
   - Utility functions
   - React component tests
   - API route handlers
   - Database queries

2. Integration tests:
   - Authentication flows
   - Payment processing
   - CME credit calculation
   - Search functionality

3. E2E tests with Playwright:
   - User registration flow
   - Content creation and publishing
   - Subscription purchase
   - Video upload and playback

4. Compliance tests:
   - HIPAA audit trail verification
   - Encryption validation
   - Access control testing
   - Data retention policies
```

### Prompt 14: Deployment and DevOps

```
Set up production deployment:

1. Infrastructure:
   - Vercel for Next.js hosting
   - PostgreSQL on AWS RDS
   - Redis for caching
   - CloudFront CDN
   - S3 for media storage

2. CI/CD pipeline:
   - GitHub Actions workflow
   - Automated testing on PR
   - Staging environment deployment
   - Production deployment approval
   - Database migration automation

3. Monitoring:
   - Sentry for error tracking
   - DataDog for performance
   - CloudWatch for AWS services
   - Uptime monitoring
   - Real user monitoring (RUM)

4. Backup and disaster recovery:
   - Daily automated backups
   - Point-in-time recovery
   - Multi-region replication
   - Disaster recovery plan
```

### Prompt 15: Launch Preparation

```
Create launch checklist and initial content:

1. Legal requirements:
   - Terms of Service with medical disclaimers
   - Privacy Policy (HIPAA-compliant)
   - Business Associate Agreements
   - Medical content disclaimer
   - Cookie policy

2. Initial content seeding:
   - 50 sample medical articles (use AI ethically)
   - 5 example CME courses
   - Demo video content
   - Featured creator profiles
   - Platform tutorial videos

3. Marketing site:
   - Landing page with value proposition
   - Creator testimonials section
   - Pricing comparison chart
   - FAQ section
   - Beta signup form

4. Launch metrics:
   - KPI dashboard setup
   - Conversion funnel tracking
   - User feedback system
   - Bug reporting workflow
```

## Advanced Features (Prompts 16-18)

### Prompt 16: Medical Writing & Publishing System

```
Create a comprehensive medical content creation system with the following components:

## 1. Writing Dashboard (/dashboard/write)

### A. Content Hub Layout:
- "New Publication" button with dropdown:
  - Write Article (traditional text editor)
  - Upload Paper (PDF/DOCX import)
  - Create Case Study (structured template)
  - Record Video Lecture
  - Schedule Conference
  - Design CME Course

- Recent drafts section with:
  - Auto-saved content
  - Last edited timestamp
  - Quick resume editing
  - Collaboration indicators

- Content templates library:
  - Case Report Template
  - Clinical Trial Summary
  - Literature Review
  - Surgical Technique
  - Drug Study Analysis
  - Patient Education

### B. Medical Rich Text Editor:
- Advanced editor with medical-specific features
- Left sidebar with medical tools
- Main editor with standard formatting
- Right sidebar with publishing options

## 2. Paper Upload System (/dashboard/upload)

### A. Multi-format Import:
- File Upload supporting PDF, DOCX, LaTeX, Markdown
- Max size: 50MB
- Content Processing with text extraction
- Enhancement Options for interactive elements
- Metadata confirmation

### B. Smart Import Features:
- Automatic extraction and conversion
- PDF text extraction with formatting
- DOCX track changes preservation
- LaTeX to HTML conversion

## 3. Case Study Builder (/dashboard/case-study)

### Structured Template System:
- Step-by-step wizard
- Patient Presentation fields
- Clinical Findings with lab results
- Assessment & Plan builder
- Outcomes tracking

## 4. Collaborative Writing Features

### Real-time Collaboration:
- Multi-author support
- Co-author permissions
- Version control
- Peer review workflow

## 5. Medical Media Management

### Advanced Media Handling:
- DICOM viewer and converter
- Patient info auto-redaction
- Video editing tools
- Document scanner with OCR

## 6. Publishing Workflow

### Smart Publishing Pipeline:
- Pre-publication HIPAA checks
- Publishing scheduling options
- Distribution settings
- Cross-platform sharing

## 7. Mobile Writing Experience

### Responsive Editor:
- Quick capture tools
- Voice-to-text
- Photo annotation
- Offline mode

## 8. Integration Features

### External Platform Connections:
- Import from PubMed
- Export to journals
- Cross-posting options
```

### Prompt 17: Medical Video Platform System

```
Build a comprehensive medical video platform with surgical recording, lecture capture, and privacy features:

## 1. Video Upload & Processing Center (/dashboard/video)

### A. Video Upload Interface:
- Local upload (drag & drop, up to 5GB)
- Direct recording (webcam, screen, surgical camera)
- Live stream setup (schedule, multi-camera)
- Processing pipeline with quality settings
- Privacy tools (face blur, voice modification)
- Enhancement options (stabilization, color correction)

### B. Surgical Video Editor:
- Multi-track timeline editor
- Chapter markers for procedures
- Annotation tools (arrows, labels, measurements)
- Medical annotations (anatomy, instruments)
- Interactive features (quiz points, resource links)

### C. Video Library Management:
- Organization by specialty/procedure
- Required metadata fields
- Searchable tags
- Video analytics (views, completion rates)

### D. Live Streaming Platform:
- Camera setup (OR, endoscope, presenter)
- Audio configuration
- Privacy checklist
- Moderator controls
- Post-stream processing

## 2. Video Player with Medical Features

- Enhanced controls (0.25x-4x speed, frame advance)
- Medical overlays (vitals, anatomy)
- Learning tools (notes, collaboration)
- Mobile optimization
```

### Prompt 18: CME Course Builder System

```
Create a comprehensive CME (Continuing Medical Education) course creation and management system:

## 1. CME Course Designer (/dashboard/cme/create)

### A. Course Planning Interface:
- Course basics (title, audience, credits)
- Accreditation details (AMA PRA Category 1)
- Learning objectives builder
- Content architecture (modules, pathways)

### B. Interactive Content Creator:
- Case simulator with patient scenarios
- Decision points and feedback
- Virtual patient builder
- Scoring rubrics

### C. Assessment Builder:
- Multiple question types
- Question bank management
- Adaptive testing
- Performance analytics
- Skills evaluation tools

### D. CME Administration Panel:
- Learner enrollment and tracking
- Progress monitoring
- Certificate generation
- Compliance tracking
- Reporting suite

## 2. CME Integration Features

### A. Credit Management System:
- Automatic credit calculation
- Multi-credit type support
- Board reporting integration

### B. Learning Pathways:
- Specialty tracks
- Custom pathways
- Adaptive learning
- Personalized recommendations

## 3. Mobile CME Experience

- Microlearning modules
- Mobile-optimized quizzing
- Offline capability
- Cross-device sync
```

---

## Current Status: 8/18 Prompts Completed ✅

**Platform Ready For**: Content creation, user authentication, CME credits, payments, video platform
**Next Priority**: Search functionality and analytics dashboard
**Revenue Target**: $1M annual revenue with 92% creator share
