import { z } from 'zod'

// Base schemas for common patterns
const emailSchema = z.string().email('Invalid email address')
const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number')
const urlSchema = z.string().url('Invalid URL').optional().or(z.literal(''))

// CV Data validation schema
export const cvDataSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  title: z.string().max(100, 'Title too long').optional(),
  contact: z.object({
    email: emailSchema,
    phone: phoneSchema.optional(),
    location: z.string().max(100, 'Location too long').optional(),
  }).optional(),
  social: z.object({
    linkedin: urlSchema,
    github: urlSchema,
    website: urlSchema,
    twitter: urlSchema,
    instagram: urlSchema,
  }).optional(),
  summary: z.string().max(2000, 'Summary too long').optional(),
  experience: z.array(z.object({
    title: z.string().min(1, 'Job title required').max(100, 'Title too long'),
    content: z.array(z.string().max(500, 'Experience description too long')).max(10, 'Too many experience points'),
  })).max(20, 'Too many experience entries').optional(),
  education: z.array(z.object({
    title: z.string().min(1, 'Education title required').max(100, 'Title too long'),
    content: z.array(z.string().max(500, 'Education description too long')).max(10, 'Too many education points'),
  })).max(10, 'Too many education entries').optional(),
  skills: z.array(z.string().max(50, 'Skill name too long')).max(50, 'Too many skills').optional(),
  languages: z.array(z.string().max(50, 'Language name too long')).max(20, 'Too many languages').optional(),
  hobbies: z.array(z.string().max(100, 'Hobby description too long')).max(20, 'Too many hobbies').optional(),
  certifications: z.array(z.object({
    title: z.string().min(1, 'Certification title required').max(100, 'Title too long'),
    content: z.array(z.string().max(500, 'Certification description too long')).max(10, 'Too many certification points'),
  })).max(20, 'Too many certifications').optional(),
  projects: z.array(z.object({
    title: z.string().min(1, 'Project title required').max(100, 'Title too long'),
    content: z.array(z.string().max(500, 'Project description too long')).max(10, 'Too many project points'),
  })).max(20, 'Too many projects').optional(),
  photoUrl: z.string().url('Invalid photo URL').optional(),
  template: z.string().min(1, 'Template is required'),
  layout: z.object({
    photoPosition: z.enum(['left', 'right', 'center', 'none']).optional(),
    showIcons: z.boolean().optional(),
    accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
    sectionOrder: z.array(z.string()).max(20, 'Too many sections').optional(),
    sectionIcons: z.record(z.string(), z.string()).optional(),
    fontFamily: z.string().max(100, 'Font family too long').optional(),
    sectionTitles: z.record(z.string(), z.string().max(50, 'Section title too long')).optional(),
    contactDisplay: z.enum(['inline', 'stacked']).optional(),
    socialLinksDisplay: z.enum(['icons', 'text', 'icons-text']).optional(),
    socialLinksPosition: z.enum(['inline', 'below']).optional(),
    sidebarPosition: z.enum(['none', 'left', 'right']).optional(),
    hiddenSections: z.array(z.string()).optional(),
  }).optional(),
  goal: z.string().max(500, 'Goal too long').optional(),
  experienceLevel: z.enum(['entry', 'mid-level', 'senior', 'executive']).optional(),
  onboardingCompleted: z.boolean().optional(),
})

// Job description validation
export const jobDescriptionSchema = z.object({
  jobDescription: z.string().min(10, 'Job description too short').max(10000, 'Job description too long'),
})

// Cover letter validation
export const coverLetterSchema = z.object({
  company: z.string().min(1, 'Company name required').max(100, 'Company name too long'),
  position: z.string().min(1, 'Position title required').max(100, 'Position title too long'),
  content: z.string().min(100, 'Cover letter too short').max(5000, 'Cover letter too long'),
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB limit
    'File size must be less than 10MB'
  ).refine(
    (file) => ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
    'Only PDF, TXT, DOC, and DOCX files are allowed'
  ),
})

// AI suggestion validation
export const aiSuggestionSchema = z.object({
  section: z.enum(['summary', 'experience', 'skills', 'education']),
  prompt: z.string().min(10, 'Prompt too short').max(1000, 'Prompt too long'),
  context: cvDataSchema,
})

// Validate AI suggestion
export const validateAiSuggestion = (data: any) => {
  try {
    return { success: true, data: aiSuggestionSchema.parse(data) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] }
  }
}

// Sanitization functions
export const sanitizeHtml = (html: string): string => {
  // Remove potentially dangerous HTML tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
}

export const sanitizeText = (text: string): string => {
  // Remove potentially dangerous characters and normalize
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, 10000) // Limit length
}

// Validation helper functions
export const validateCVData = (data: any) => {
  try {
    return { success: true, data: cvDataSchema.parse(data) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] }
  }
}

export const validateJobDescription = (data: any) => {
  try {
    return { success: true, data: jobDescriptionSchema.parse(data) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] }
  }
}

export const validateCoverLetter = (data: any) => {
  try {
    return { success: true, data: coverLetterSchema.parse(data) }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] }
  }
}

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return (identifier: string): boolean => {
    const now = Date.now()
    const userRequests = requests.get(identifier)
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }
    
    if (userRequests.count >= maxRequests) {
      return false
    }
    
    userRequests.count++
    return true
  }
} 