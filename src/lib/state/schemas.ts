/**
 * Zod Validation Schemas for Agent System
 * 
 * These schemas validate structured data returned by LLMs and external APIs
 */

import { z } from "zod";

/**
 * CV Analysis Schema - validates LLM analysis output
 * Note: Relaxed constraints to handle sparse CVs and varied LLM responses
 */
export const CVAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100).describe("Overall CV quality score"),
  atsScore: z.number().min(0).max(100).describe("ATS compatibility score"),
  contentScore: z.number().min(0).max(100).describe("Content quality score"),
  
  // Relaxed constraints - accept 1+ items instead of strict minimums
  strengths: z.array(z.string()).min(1).describe("CV strengths"),
  weaknesses: z.array(z.string()).min(1).describe("Areas for improvement"),
  suggestions: z.array(z.string()).min(1).describe("Actionable suggestions"),
  
  details: z.object({
    experienceQuality: z.number().min(0).max(100),
    skillsRelevance: z.number().min(0).max(100),
    formatting: z.number().min(0).max(100),
    atsCompatibility: z.number().min(0).max(100),
  }).optional(),
});

export type CVAnalysis = z.infer<typeof CVAnalysisSchema>;

/**
 * Job Match Schema - validates job matching results
 */
export const JobMatchSchema = z.object({
  id: z.string().describe("Unique job identifier"),
  title: z.string().min(1).describe("Job title"),
  company: z.string().min(1).describe("Company name"),
  location: z.string().describe("Job location"),
  salary: z.string().optional().describe("Salary range if available"),
  remote: z.boolean().default(false).describe("Remote work option"),
  description: z.string().describe("Full job description"),
  url: z.string().url().describe("Application URL"),
  
  matchScore: z.number().min(0).max(100).describe("Match score to CV"),
  matchReason: z.string().describe("Explanation of match"),
  keywordMatches: z.array(z.string()).describe("Matching keywords"),
  
  source: z.string().describe("Job board source"),
  postedDate: z.date().optional().describe("When job was posted"),
});

export type JobMatch = z.infer<typeof JobMatchSchema>;

/**
 * Application Status Enum
 */
export const ApplicationStatusEnum = z.enum([
  "applied",
  "viewed",
  "interview_scheduled",
  "interview_completed",
  "offer",
  "rejected",
  "withdrawn",
  "ghosted",
]);

export type ApplicationStatus = z.infer<typeof ApplicationStatusEnum>;

/**
 * Job Application Creation Schema
 */
export const CreateJobApplicationSchema = z.object({
  userId: z.string().cuid(),
  cvId: z.string().cuid(),
  letterId: z.string().cuid().optional(),
  
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  jobUrl: z.string().url().optional(),
  jobDescription: z.string().optional(),
  location: z.string().optional(),
  salary: z.string().optional(),
  
  status: ApplicationStatusEnum.default("applied"),
  notes: z.string().optional(),
  followUpDate: z.date().optional(),
});

export type CreateJobApplication = z.infer<typeof CreateJobApplicationSchema>;

/**
 * Intent Classification Schema - validates orchestrator output
 */
export const IntentClassificationSchema = z.object({
  intent: z.enum([
    "analyze_cv",
    "find_jobs",
    "track_application",
    "enhance_cover_letter",
    "general_chat",
    "unclear",
  ]).describe("Classified user intent"),
  
  confidence: z.number().min(0).max(1).optional().describe("Classification confidence"),
  requiredData: z.array(z.string()).optional().describe("Data needed to proceed"),
});

export type IntentClassification = z.infer<typeof IntentClassificationSchema>;

/**
 * Adzuna Job Search Response Schema
 */
export const AdzunaJobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.object({
    display_name: z.string(),
  }),
  location: z.object({
    display_name: z.string(),
    area: z.array(z.string()).optional(),
  }),
  description: z.string(),
  redirect_url: z.string().url(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  created: z.string().optional(),
  contract_time: z.string().optional(),
  contract_type: z.string().optional(),
});

export type AdzunaJob = z.infer<typeof AdzunaJobSchema>;

export const AdzunaResponseSchema = z.object({
  results: z.array(AdzunaJobSchema),
  count: z.number(),
  mean: z.number().optional(),
});

export type AdzunaResponse = z.infer<typeof AdzunaResponseSchema>;

/**
 * Job Ranking Schema - validates LLM job ranking output
 */
export const JobRankingSchema = z.object({
  jobId: z.string(),
  score: z.number().min(0).max(100),
  reason: z.string(),
  keywords: z.array(z.string()),
});

export type JobRanking = z.infer<typeof JobRankingSchema>;

export const JobRankingsSchema = z.object({
  rankings: z.array(JobRankingSchema),
});

/**
 * Cover Letter Enhancement Schema
 */
export const CoverLetterSchema = z.object({
  content: z.string().min(200).max(600).describe("Cover letter content"),
  warnings: z.array(z.string()).optional().describe("Writing issues found"),
});

export type CoverLetter = z.infer<typeof CoverLetterSchema>;

/**
 * Helper function to safely parse with Zod
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
    };
  }
}



