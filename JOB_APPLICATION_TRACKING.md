# Job Application Tracking System

## Overview

The CV AI Builder now includes a comprehensive job application tracking system that allows users to:

- **Track job applications** with detailed status and priority management
- **Connect CVs and letters** to specific job applications
- **Store job postings** with rich metadata
- **Manage application documents** (CVs, letters, portfolios, etc.)
- **Track application progress** with dates and milestones

## Database Schema

### Core Models

#### 1. JobPosting
Stores information about job opportunities:
```typescript
{
  id: string
  title: string
  company: string
  location?: string
  description?: string // JSON string for rich text
  requirements?: string // JSON string
  salary?: string
  jobType?: string // full-time, part-time, contract, etc.
  remote: boolean
  source?: string // "linkedin", "indeed", "company_website", "manual"
  sourceUrl?: string
  jobId?: string // External job ID from source
  isActive: boolean
  isArchived: boolean
  userId: string
  applications: JobApplication[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 2. JobApplication
Tracks individual job applications:
```typescript
{
  id: string
  title: string // "Senior Developer at Google"
  status: string // "applied", "interviewing", "offered", "rejected", "withdrawn"
  priority: string // "low", "medium", "high", "urgent"
  appliedDate?: DateTime
  deadline?: DateTime
  salary?: string
  notes?: string // JSON string for rich text
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  followUpDate?: DateTime
  interviewDate?: DateTime
  offerDate?: DateTime
  rejectionDate?: DateTime
  userId: string
  jobPostingId?: string
  documents: ApplicationDocument[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 3. ApplicationDocument
Links documents to job applications:
```typescript
{
  id: string
  type: string // "cv", "letter", "resume", "portfolio", "other"
  title: string
  description?: string
  cvId?: string
  letterId?: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  applicationId: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

## API Endpoints

### Job Applications
- `GET /api/job-applications` - Get all applications (with optional status/priority filters)
- `POST /api/job-applications` - Create new application
- `PUT /api/job-applications` - Update application
- `DELETE /api/job-applications` - Delete application

### Job Postings
- `GET /api/job-postings` - Get all job postings
- `POST /api/job-postings` - Create new job posting
- `PUT /api/job-postings` - Update job posting
- `DELETE /api/job-postings` - Delete job posting

### Application Documents
- `GET /api/application-documents?applicationId=X&type=Y` - Get documents for application
- `POST /api/application-documents` - Add document to application
- `PUT /api/application-documents` - Update document
- `DELETE /api/application-documents` - Remove document from application

## Smart Saving Features

### 1. Application-Centric Organization
- **Job Applications** are the central organizing unit
- Each application can have multiple documents (CVs, letters, portfolios)
- Applications track progress through various statuses

### 2. Document Linking
- **CVs and Letters** can be linked to multiple applications
- **External documents** (PDFs, portfolios) can be uploaded and linked
- **Document versions** are tracked through the existing CV/Letter versioning

### 3. Status Tracking
Application statuses include:
- **Applied** - Initial application submitted
- **Interviewing** - In interview process
- **Offered** - Job offer received
- **Rejected** - Application rejected
- **Withdrawn** - Application withdrawn

### 4. Priority Management
Application priorities:
- **Low** - Not urgent, exploratory
- **Medium** - Standard priority
- **High** - Important opportunity
- **Urgent** - Time-sensitive, high priority

### 5. Timeline Tracking
Key dates tracked:
- **Applied Date** - When application was submitted
- **Deadline** - Application deadline
- **Follow-up Date** - When to follow up
- **Interview Date** - Scheduled interview
- **Offer Date** - When offer was received
- **Rejection Date** - When rejection was received

## Usage Examples

### Creating a Job Application
```javascript
// Create a job application
const application = await fetch('/api/job-applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Senior Developer at Google',
    status: 'applied',
    priority: 'high',
    appliedDate: '2024-01-15',
    deadline: '2024-02-15',
    salary: '$150,000 - $200,000',
    notes: 'Applied through LinkedIn. Hiring manager: John Smith',
    contactName: 'John Smith',
    contactEmail: 'john.smith@google.com',
    jobPostingId: 'job_posting_id_here'
  })
})
```

### Linking a CV to an Application
```javascript
// Link an existing CV to the application
const document = await fetch('/api/application-documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicationId: 'application_id_here',
    type: 'cv',
    title: 'My Professional CV',
    cvId: 'cv_id_here'
  })
})
```

### Linking a Letter to an Application
```javascript
// Link an existing letter to the application
const document = await fetch('/api/application-documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicationId: 'application_id_here',
    type: 'letter',
    title: 'Cover Letter for Google',
    letterId: 'letter_id_here'
  })
})
```

### Updating Application Status
```javascript
// Update application status
const updated = await fetch('/api/job-applications', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'application_id_here',
    status: 'interviewing',
    interviewDate: '2024-01-25'
  })
})
```

## Benefits

### 1. **Comprehensive Tracking**
- Track every job application in one place
- See which CVs and letters were used for each application
- Monitor application progress and outcomes

### 2. **Document Reusability**
- Use the same CV for multiple applications
- Track which versions of documents were used
- Maintain document history and versions

### 3. **Analytics & Insights**
- Track application success rates
- Identify which CVs/letters perform best
- Monitor application timelines and follow-ups

### 4. **Professional Organization**
- Never lose track of applications
- Maintain professional contact information
- Track salary negotiations and offers

### 5. **Future Enhancements**
- **AI-powered insights** on application success
- **Template recommendations** based on job type
- **Automated follow-up reminders**
- **Integration with job boards** (LinkedIn, Indeed)
- **Resume parsing** from job descriptions
- **ATS optimization** suggestions

## Data Flow

1. **User creates CV/Letter** → Stored in database
2. **User finds job posting** → Creates job posting or application
3. **User applies** → Links CV/Letter to application
4. **User tracks progress** → Updates application status and dates
5. **User gets outcome** → Records offer/rejection and learns from experience

## Migration to Supabase

When migrating to Supabase, the system will benefit from:

- **Native JSON support** for rich text fields
- **Real-time subscriptions** for live updates
- **Row-level security** for data protection
- **Edge functions** for complex operations
- **File storage** for document uploads
- **Advanced querying** for analytics

This creates a comprehensive job application management system that helps users track, organize, and optimize their job search process while maintaining connections between their documents and applications. 