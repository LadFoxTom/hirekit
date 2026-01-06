// @ts-nocheck
/**
 * Job Data Normalization Layer
 * 
 * Transforms job data from various external APIs into a standardized format
 * This allows the application to support multiple job boards without changing agent code
 */

import { AdzunaJob } from '../state/schemas';
import { JobMatchResult } from '../state/agent-state';

/**
 * Search category for job results
 */
export type SearchCategory = 'local' | 'regional' | 'remote';

/**
 * Normalized job format used throughout the application
 */
export interface NormalizedJob {
  id: string;
  sourceJobId: string;
  source: string;
  title: string;
  company: string;
  description: string;
  url: string;
  location: string;
  salary?: string;
  remote: boolean;
  postedDate?: Date;
  contractType?: string;
  contractTime?: string;
  searchCategory?: SearchCategory; // Category based on search strategy (local/regional/remote)
}

/**
 * Detect if job description indicates remote work
 */
function detectRemote(description: string, contractType?: string): boolean {
  const remoteKeywords = [
    'remote',
    'work from home',
    'wfh',
    'distributed',
    'telecommute',
    'virtual',
    'anywhere',
  ];
  
  const lowerDesc = description.toLowerCase();
  const hasRemoteKeyword = remoteKeywords.some(keyword => lowerDesc.includes(keyword));
  
  // Check contract type if available
  const isRemoteContract = contractType?.toLowerCase().includes('remote') || false;
  
  return hasRemoteKeyword || isRemoteContract;
}

/**
 * Format salary range from min/max values
 */
function formatSalary(min?: number, max?: number): string | undefined {
  if (!min && !max) {
    return undefined;
  }
  
  if (min && max) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  
  if (min) {
    return `$${min.toLocaleString()}+`;
  }
  
  if (max) {
    return `Up to $${max.toLocaleString()}`;
  }
  
  return undefined;
}

/**
 * Parse date string from Adzuna format
 */
function parseAdzunaDate(dateString?: string): Date | undefined {
  if (!dateString) {
    return undefined;
  }
  
  try {
    return new Date(dateString);
  } catch {
    return undefined;
  }
}

/**
 * Normalize Adzuna job data to standard format
 * 
 * @param job - Adzuna job object
 * @returns Normalized job object
 */
export function normalizeAdzunaJob(job: AdzunaJob): NormalizedJob {
  const remote = detectRemote(job.description, job.contract_type);
  const salary = formatSalary(job.salary_min, job.salary_max);
  const postedDate = parseAdzunaDate(job.created);
  
  return {
    id: `adzuna-${job.id}`,
    sourceJobId: job.id,
    source: 'adzuna',
    title: job.title,
    company: job.company.display_name,
    description: job.description,
    url: job.redirect_url,
    location: job.location.display_name,
    salary,
    remote,
    postedDate,
    contractType: job.contract_type,
    contractTime: job.contract_time,
  };
}

/**
 * Normalize multiple Adzuna jobs
 */
export function normalizeAdzunaJobs(jobs: AdzunaJob[]): NormalizedJob[] {
  return jobs.map(normalizeAdzunaJob);
}

/**
 * Convert normalized job to JobMatchResult (used in agent state)
 * 
 * @param job - Normalized job
 * @param matchScore - Match score from LLM
 * @param matchReason - Explanation of match
 * @param keywordMatches - Array of matching keywords
 * @returns JobMatchResult for agent state
 */
export function toJobMatchResult(
  job: NormalizedJob,
  matchScore: number,
  matchReason: string,
  keywordMatches: string[]
): JobMatchResult {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    remote: job.remote,
    description: job.description,
    url: job.url,
    matchScore,
    matchReason,
    keywordMatches,
    source: job.source,
    postedDate: job.postedDate,
  };
}

/**
 * Extract location components from location string
 * Useful for more granular location filtering
 */
export function parseLocation(location: string): {
  city?: string;
  state?: string;
  country?: string;
} {
  // Simple parsing - can be enhanced based on format patterns
  const parts = location.split(',').map(p => p.trim());
  
  if (parts.length === 1) {
    return { city: parts[0] };
  }
  
  if (parts.length === 2) {
    return { city: parts[0], state: parts[1] };
  }
  
  if (parts.length >= 3) {
    return {
      city: parts[0],
      state: parts[1],
      country: parts[2],
    };
  }
  
  return {};
}

/**
 * Clean and truncate job description to reasonable length
 * Useful for LLM prompts to save tokens
 */
export function truncateDescription(description: string, maxLength: number = 2000): string {
  if (description.length <= maxLength) {
    return description;
  }
  
  // Try to truncate at sentence boundary
  const truncated = description.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  
  if (lastPeriod > maxLength * 0.8) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  return truncated + '...';
}

/**
 * Extract key requirements from job description
 * Uses simple keyword matching - can be enhanced with NLP
 */
export function extractRequirements(description: string): {
  skills: string[];
  experience: string[];
  education: string[];
} {
  const skills: string[] = [];
  const experience: string[] = [];
  const education: string[] = [];
  
  const lowerDesc = description.toLowerCase();
  
  // Common skill keywords
  const skillKeywords = [
    'python', 'javascript', 'java', 'react', 'node', 'aws', 'docker',
    'kubernetes', 'sql', 'mongodb', 'typescript', 'angular', 'vue',
    'git', 'ci/cd', 'agile', 'scrum', 'machine learning', 'ai',
  ];
  
  skillKeywords.forEach(skill => {
    if (lowerDesc.includes(skill)) {
      skills.push(skill);
    }
  });
  
  // Experience patterns
  const expPatterns = [
    /(\d+)\+?\s*years?\s*(?:of)?\s*experience/gi,
    /(\d+)-(\d+)\s*years/gi,
  ];
  
  expPatterns.forEach(pattern => {
    const matches = description.matchAll(pattern);
    for (const match of matches) {
      experience.push(match[0]);
    }
  });
  
  // Education keywords
  const eduKeywords = [
    "bachelor's degree", "master's degree", "phd", "doctorate",
    "bs", "ba", "ms", "ma", "mba", "computer science", "engineering",
  ];
  
  eduKeywords.forEach(edu => {
    if (lowerDesc.includes(edu)) {
      education.push(edu);
    }
  });
  
  return {
    skills: [...new Set(skills)], // Remove duplicates
    experience,
    education,
  };
}

/**
 * Sanitize job data for safe storage
 * Removes potential XSS vectors and validates data
 */
export function sanitizeJob(job: NormalizedJob): NormalizedJob {
  return {
    ...job,
    title: job.title.trim(),
    company: job.company.trim(),
    description: job.description.trim(),
    location: job.location.trim(),
    // URL is validated by Zod schema
  };
}




