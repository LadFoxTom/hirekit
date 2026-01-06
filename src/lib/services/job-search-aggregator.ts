/**
 * Job Search Aggregator
 * 
 * Aggregates job search results from multiple sources for better coverage.
 * Implements smart location-based search strategies.
 */

import { searchJobs, isAdzunaConfigured, detectCountryCode, getSupportedCountries } from './adzuna-client';
import { normalizeAdzunaJobs, NormalizedJob } from './job-normalizer';

/**
 * Supported job sources
 */
export type JobSource = 'adzuna' | 'remoteok' | 'arbeitnow' | 'mock';

/**
 * Work type categories for search
 */
export type WorkType = 'local' | 'hybrid' | 'remote' | 'any';

/**
 * Job search aggregator options
 */
export interface AggregatorOptions {
  query: string;
  location?: string;
  maxResults?: number;
  sources?: JobSource[];
  includeMockFallback?: boolean;
  workType?: WorkType; // Filter by work type preference
  searchStrategy?: 'local' | 'remote' | 'balanced'; // How to prioritize search
}

/**
 * Search result with source tracking
 */
export interface AggregatedSearchResult {
  jobs: NormalizedJob[];
  sources: JobSource[];
  errors: string[];
}

/**
 * RemoteOK API - Free, no key required
 * Returns remote tech jobs
 */
async function searchRemoteOK(query: string): Promise<NormalizedJob[]> {
  try {
    console.log('[RemoteOK] Searching for:', query);
    
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'LadderFox Job Search/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`RemoteOK API error: ${response.status}`);
    }

    const data = await response.json();
    
    // RemoteOK returns array with first element being metadata
    const jobs = Array.isArray(data) ? data.slice(1) : [];
    
    // Filter by query
    const queryLower = query.toLowerCase();
    const filteredJobs = jobs.filter((job: any) => {
      const title = (job.position || '').toLowerCase();
      const company = (job.company || '').toLowerCase();
      const tags = (job.tags || []).map((t: string) => t.toLowerCase()).join(' ');
      
      return title.includes(queryLower) || 
             company.includes(queryLower) || 
             tags.includes(queryLower);
    }).slice(0, 20);

    console.log(`[RemoteOK] Found ${filteredJobs.length} matching jobs`);

    return filteredJobs.map((job: any): NormalizedJob => ({
      id: `remoteok-${job.id || job.slug}`,
      sourceJobId: job.id || job.slug,
      source: 'remoteok',
      title: job.position || 'Unknown Position',
      company: job.company || 'Unknown Company',
      description: job.description || '',
      url: job.url || `https://remoteok.com/l/${job.slug}`,
      location: job.location || 'Remote',
      salary: job.salary_min && job.salary_max 
        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
        : undefined,
      remote: true,
      postedDate: job.date ? new Date(job.date) : undefined,
    }));

  } catch (error) {
    console.error('[RemoteOK] Error:', error);
    return [];
  }
}

/**
 * Arbeitnow API - Free for developers
 * Returns European tech jobs
 */
async function searchArbeitnow(query: string): Promise<NormalizedJob[]> {
  try {
    console.log('[Arbeitnow] Searching for:', query);
    
    const url = new URL('https://www.arbeitnow.com/api/job-board-api');
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Arbeitnow API error: ${response.status}`);
    }

    const data = await response.json();
    const jobs = data.data || [];
    
    // Filter by query
    const queryLower = query.toLowerCase();
    const filteredJobs = jobs.filter((job: any) => {
      const title = (job.title || '').toLowerCase();
      const company = (job.company_name || '').toLowerCase();
      const description = (job.description || '').toLowerCase();
      
      return title.includes(queryLower) || 
             company.includes(queryLower) || 
             description.includes(queryLower);
    }).slice(0, 20);

    console.log(`[Arbeitnow] Found ${filteredJobs.length} matching jobs`);

    return filteredJobs.map((job: any): NormalizedJob => ({
      id: `arbeitnow-${job.slug}`,
      sourceJobId: job.slug,
      source: 'arbeitnow',
      title: job.title || 'Unknown Position',
      company: job.company_name || 'Unknown Company',
      description: job.description || '',
      url: job.url || `https://www.arbeitnow.com/view/${job.slug}`,
      location: job.location || 'Remote',
      remote: job.remote || false,
      postedDate: job.created_at ? new Date(job.created_at) : undefined,
    }));

  } catch (error) {
    console.error('[Arbeitnow] Error:', error);
    return [];
  }
}

/**
 * Mock job data for testing/fallback
 */
function getMockJobs(query: string): NormalizedJob[] {
  console.log('[Mock] Generating mock jobs for:', query);
  
  const mockJobs: NormalizedJob[] = [
    {
      id: 'mock-1',
      sourceJobId: 'mock-1',
      source: 'mock',
      title: `Senior ${query.split(' ')[0] || 'Software'} Developer`,
      company: 'TechCorp Inc.',
      description: `We are looking for an experienced developer to join our team. Requirements include 5+ years of experience in ${query}, strong problem-solving skills, and excellent communication abilities.`,
      url: 'https://example.com/job/1',
      location: 'San Francisco, CA',
      salary: '$120,000 - $160,000',
      remote: true,
    },
    {
      id: 'mock-2',
      sourceJobId: 'mock-2',
      source: 'mock',
      title: `${query.split(' ')[0] || 'Software'} Engineer`,
      company: 'StartupXYZ',
      description: `Join our fast-growing startup! We need talented engineers with experience in ${query} to help build the next generation of our platform.`,
      url: 'https://example.com/job/2',
      location: 'New York, NY',
      salary: '$100,000 - $140,000',
      remote: false,
    },
    {
      id: 'mock-3',
      sourceJobId: 'mock-3',
      source: 'mock',
      title: `Lead ${query.split(' ')[0] || 'Software'} Developer`,
      company: 'Enterprise Solutions Ltd',
      description: `Lead a team of developers in building enterprise solutions. Experience with ${query} and team leadership required.`,
      url: 'https://example.com/job/3',
      location: 'Austin, TX',
      salary: '$140,000 - $180,000',
      remote: true,
    },
  ];

  return mockJobs;
}

/**
 * Aggregate job search across multiple sources with smart location handling
 */
export async function aggregateJobSearch(options: AggregatorOptions): Promise<AggregatedSearchResult> {
  const {
    query,
    location,
    maxResults = 30,
    sources = ['adzuna', 'remoteok', 'arbeitnow'],
    includeMockFallback = true,
    searchStrategy = 'balanced',
  } = options;

  const allJobs: NormalizedJob[] = [];
  const usedSources: JobSource[] = [];
  const errors: string[] = [];

  // Detect country from location for smart regional search
  const detectedCountry = location ? detectCountryCode(location) : 'us';
  const isEuropean = ['gb', 'de', 'nl', 'fr', 'it', 'pl', 'at'].includes(detectedCountry);
  
  console.log(`[Aggregator] Starting search: "${query}"`);
  console.log(`[Aggregator] Location: "${location || 'not specified'}" → Country: ${detectedCountry} (EU: ${isEuropean})`);
  console.log(`[Aggregator] Strategy: ${searchStrategy}, Sources: ${sources.join(', ')}`);

  // === STRATEGY 1: Local/Regional Jobs (Adzuna with detected country) ===
  if (sources.includes('adzuna') && isAdzunaConfigured()) {
    try {
      console.log(`[Aggregator] Searching Adzuna ${detectedCountry.toUpperCase()} for local jobs...`);
      
      const adzunaResults = await searchJobs({
        query,
        location: location ? extractCityFromLocation(location) : undefined,
        country: detectedCountry, // Use detected country!
        resultsPerPage: Math.min(maxResults, 20),
      });

      if (adzunaResults.results?.length > 0) {
        const normalizedJobs = normalizeAdzunaJobs(adzunaResults.results);
        // Tag these as local jobs
        normalizedJobs.forEach(job => {
          job.searchCategory = 'local';
        });
        allJobs.push(...normalizedJobs);
        usedSources.push('adzuna');
        console.log(`[Aggregator] Adzuna ${detectedCountry.toUpperCase()} returned ${normalizedJobs.length} local jobs`);
      }
    } catch (error) {
      const errorMsg = `Adzuna ${detectedCountry}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error('[Aggregator]', errorMsg);
    }
  }

  // === STRATEGY 2: European Jobs (Arbeitnow) - prioritize for EU users ===
  if (sources.includes('arbeitnow') && (isEuropean || searchStrategy === 'balanced')) {
    try {
      console.log('[Aggregator] Searching Arbeitnow for EU jobs...');
      const arbeitnowJobs = await searchArbeitnow(query);
      if (arbeitnowJobs.length > 0) {
        arbeitnowJobs.forEach(job => {
          job.searchCategory = 'regional';
        });
        allJobs.push(...arbeitnowJobs);
        usedSources.push('arbeitnow');
        console.log(`[Aggregator] Arbeitnow returned ${arbeitnowJobs.length} EU jobs`);
      }
    } catch (error) {
      const errorMsg = `Arbeitnow: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error('[Aggregator]', errorMsg);
    }
  }

  // === STRATEGY 3: Remote Jobs (RemoteOK) - global remote opportunities ===
  if (sources.includes('remoteok')) {
    try {
      console.log('[Aggregator] Searching RemoteOK for remote jobs...');
      const remoteokJobs = await searchRemoteOK(query);
      if (remoteokJobs.length > 0) {
        remoteokJobs.forEach(job => {
          job.searchCategory = 'remote';
        });
        allJobs.push(...remoteokJobs);
        usedSources.push('remoteok');
        console.log(`[Aggregator] RemoteOK returned ${remoteokJobs.length} remote jobs`);
      }
    } catch (error) {
      const errorMsg = `RemoteOK: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error('[Aggregator]', errorMsg);
    }
  }

  // Use mock fallback if no jobs found and enabled
  if (allJobs.length === 0 && includeMockFallback) {
    console.log('[Aggregator] No jobs from APIs, using mock fallback');
    const mockJobs = getMockJobs(query);
    allJobs.push(...mockJobs);
    usedSources.push('mock');
  }

  // Deduplicate by title + company (jobs may appear on multiple boards)
  const seen = new Set<string>();
  const uniqueJobs = allJobs.filter(job => {
    const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort jobs: local first, then regional, then remote
  const sortedJobs = uniqueJobs.sort((a, b) => {
    const categoryOrder = { local: 0, regional: 1, remote: 2, undefined: 3 };
    const aOrder = categoryOrder[a.searchCategory as keyof typeof categoryOrder] ?? 3;
    const bOrder = categoryOrder[b.searchCategory as keyof typeof categoryOrder] ?? 3;
    return aOrder - bOrder;
  });

  console.log(`[Aggregator] Final result: ${sortedJobs.length} unique jobs from ${usedSources.join(', ')}`);
  console.log(`[Aggregator] Breakdown: ${countByCategory(sortedJobs)}`);

  return {
    jobs: sortedJobs.slice(0, maxResults),
    sources: usedSources,
    errors,
  };
}

/**
 * Extract city name from location string
 * "Breda, Netherlands" → "Breda"
 */
function extractCityFromLocation(location: string): string {
  // Split by comma and take the first part (usually city)
  const parts = location.split(',').map(p => p.trim());
  return parts[0] || location;
}

/**
 * Count jobs by category for logging
 */
function countByCategory(jobs: NormalizedJob[]): string {
  const counts = jobs.reduce((acc, job) => {
    const cat = job.searchCategory || 'unknown';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts)
    .map(([cat, count]) => `${cat}: ${count}`)
    .join(', ');
}

/**
 * Check which job sources are available
 */
export function getAvailableSources(): JobSource[] {
  const sources: JobSource[] = [];
  
  if (isAdzunaConfigured()) {
    sources.push('adzuna');
  }
  
  // RemoteOK and Arbeitnow are free, always available
  sources.push('remoteok', 'arbeitnow');
  
  return sources;
}


