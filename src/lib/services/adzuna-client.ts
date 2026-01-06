/**
 * Adzuna Job Board API Client
 * 
 * Provides job search functionality with caching and rate limiting.
 * API Documentation: https://developer.adzuna.com/docs/search
 */

import { AdzunaResponseSchema, AdzunaJob, AdzunaResponse } from '../state/schemas';
import { safeParse } from '../state/schemas';

/**
 * Adzuna API configuration
 */
const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '';
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY || '';

/**
 * Country code mapping for Adzuna API
 * Adzuna supports these countries: au, at, br, ca, de, fr, gb, in, it, nl, nz, pl, ru, sg, us, za
 */
const COUNTRY_CODE_MAP: Record<string, string> = {
  // Full country names
  'australia': 'au',
  'austria': 'at',
  'brazil': 'br',
  'canada': 'ca',
  'germany': 'de',
  'deutschland': 'de',
  'france': 'fr',
  'united kingdom': 'gb',
  'uk': 'gb',
  'britain': 'gb',
  'england': 'gb',
  'scotland': 'gb',
  'wales': 'gb',
  'india': 'in',
  'italy': 'it',
  'netherlands': 'nl',
  'holland': 'nl',
  'new zealand': 'nz',
  'poland': 'pl',
  'russia': 'ru',
  'singapore': 'sg',
  'united states': 'us',
  'usa': 'us',
  'south africa': 'za',
  // Common city-to-country mappings
  'london': 'gb',
  'manchester': 'gb',
  'birmingham': 'gb',
  'amsterdam': 'nl',
  'rotterdam': 'nl',
  'breda': 'nl',
  'eindhoven': 'nl',
  'utrecht': 'nl',
  'the hague': 'nl',
  'berlin': 'de',
  'munich': 'de',
  'frankfurt': 'de',
  'hamburg': 'de',
  'paris': 'fr',
  'lyon': 'fr',
  'sydney': 'au',
  'melbourne': 'au',
  'toronto': 'ca',
  'vancouver': 'ca',
  'mumbai': 'in',
  'bangalore': 'in',
  'rome': 'it',
  'milan': 'it',
  'warsaw': 'pl',
  'krakow': 'pl',
};

/**
 * Detect country code from location string
 * @param location - Location string (e.g., "Breda, Netherlands" or "San Francisco, CA")
 * @returns Adzuna country code (e.g., "nl", "us")
 */
export function detectCountryCode(location: string): string {
  if (!location) return 'us'; // Default to US
  
  const locationLower = location.toLowerCase().trim();
  
  // Check for explicit country codes or country names
  for (const [key, code] of Object.entries(COUNTRY_CODE_MAP)) {
    if (locationLower.includes(key)) {
      console.log(`[Adzuna] Detected country from "${location}": ${code}`);
      return code;
    }
  }
  
  // Check for US states (common patterns like "CA", "NY", "TX")
  const usStatePattern = /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/i;
  if (usStatePattern.test(location)) {
    console.log(`[Adzuna] Detected US state in "${location}"`);
    return 'us';
  }
  
  // Default to US if can't determine
  console.log(`[Adzuna] Could not detect country from "${location}", defaulting to US`);
  return 'us';
}

/**
 * Get list of Adzuna-supported countries
 */
export function getSupportedCountries(): string[] {
  return ['au', 'at', 'br', 'ca', 'de', 'fr', 'gb', 'in', 'it', 'nl', 'nz', 'pl', 'ru', 'sg', 'us', 'za'];
}

/**
 * Simple in-memory cache for job search results
 * In production, consider using Redis for shared cache across instances
 */
interface CacheEntry {
  data: AdzunaResponse;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Rate limiting state
 */
let apiCallCount = 0;
let apiCallWindow = Date.now();
const MAX_CALLS_PER_MINUTE = 10; // Conservative limit
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

/**
 * Check if we're within rate limits
 */
function checkRateLimit(): boolean {
  const now = Date.now();
  
  // Reset counter if window has passed
  if (now - apiCallWindow > RATE_LIMIT_WINDOW) {
    apiCallCount = 0;
    apiCallWindow = now;
  }
  
  return apiCallCount < MAX_CALLS_PER_MINUTE;
}

/**
 * Increment rate limit counter
 */
function incrementRateLimit(): void {
  apiCallCount++;
}

/**
 * Generate cache key from search parameters
 */
function getCacheKey(query: string, location: string, page: number): string {
  return `${query}:${location}:${page}`;
}

/**
 * Get cached results if available and fresh
 */
function getFromCache(cacheKey: string): AdzunaResponse | null {
  const entry = cache.get(cacheKey);
  
  if (!entry) {
    return null;
  }
  
  // Check if cache entry is still fresh
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(cacheKey);
    return null;
  }
  
  return entry.data;
}

/**
 * Store results in cache
 */
function setCache(cacheKey: string, data: AdzunaResponse): void {
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Search parameters for Adzuna API
 */
export interface AdzunaSearchParams {
  query: string;          // Search query (e.g., "software engineer", "python developer")
  location?: string;      // Location filter (e.g., "New York", "remote")
  country?: string;       // Country code override (e.g., "nl", "us") - auto-detected if not provided
  resultsPerPage?: number; // Number of results (1-50, default 20)
  page?: number;          // Page number (default 1)
  sortBy?: 'relevant' | 'date' | 'salary'; // Sort order
  maxDaysOld?: number;    // Filter by job age in days
  salaryMin?: number;     // Minimum salary filter
}

/**
 * Search for jobs using Adzuna API
 * 
 * @param params - Search parameters
 * @returns Promise resolving to search results
 * @throws Error if API call fails or credentials missing
 */
export async function searchJobs(params: AdzunaSearchParams): Promise<AdzunaResponse> {
  const {
    query,
    location = '',
    country, // Can be explicitly provided or auto-detected
    resultsPerPage = 20,
    page = 1,
    sortBy = 'relevant',
    maxDaysOld,
    salaryMin,
  } = params;
  
  // Validate credentials
  if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
    throw new Error('Adzuna API credentials not configured. Please set ADZUNA_APP_ID and ADZUNA_API_KEY environment variables.');
  }
  
  // Auto-detect country from location if not explicitly provided
  const countryCode = country || detectCountryCode(location);
  
  // Check cache first (include country in cache key)
  const cacheKey = getCacheKey(query, `${countryCode}:${location}`, page);
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    console.log('[Adzuna] Cache hit for:', cacheKey);
    return cached;
  }
  
  // Check rate limits
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again in a moment.');
  }
  
  try {
    // Construct API URL with detected country
    const url = new URL(`${ADZUNA_BASE_URL}/${countryCode}/search/${page}`);
    url.searchParams.append('app_id', ADZUNA_APP_ID);
    url.searchParams.append('app_key', ADZUNA_API_KEY);
    url.searchParams.append('results_per_page', resultsPerPage.toString());
    url.searchParams.append('what', query);
    
    if (location) {
      url.searchParams.append('where', location);
    }
    
    if (sortBy === 'date') {
      url.searchParams.append('sort_by', 'date');
    } else if (sortBy === 'salary') {
      url.searchParams.append('sort_by', 'salary');
    }
    
    if (maxDaysOld) {
      url.searchParams.append('max_days_old', maxDaysOld.toString());
    }
    
    if (salaryMin) {
      url.searchParams.append('salary_min', salaryMin.toString());
    }
    
    console.log('[Adzuna] API call:', url.toString().replace(ADZUNA_API_KEY, '***'));
    
    // Make API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    incrementRateLimit();
    
    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response with Zod
    const parseResult = safeParse(AdzunaResponseSchema, data);
    
    if (!parseResult.success) {
      console.error('[Adzuna] Invalid response format:', parseResult.error);
      throw new Error(`Invalid API response: ${parseResult.error}`);
    }
    
    // Cache the results
    setCache(cacheKey, parseResult.data);
    
    return parseResult.data;
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Job search timed out. Please try again.');
      }
      throw error;
    }
    throw new Error('Unknown error occurred while searching jobs');
  }
}

/**
 * Search for remote jobs specifically
 */
export async function searchRemoteJobs(query: string, page: number = 1): Promise<AdzunaResponse> {
  return searchJobs({
    query: `${query} remote`,
    resultsPerPage: 20,
    page,
  });
}

/**
 * Get salary statistics for a job query
 */
export async function getSalaryStats(query: string, location?: string): Promise<number | null> {
  try {
    const results = await searchJobs({
      query,
      location,
      resultsPerPage: 1, // Just need the mean salary
    });
    
    return results.mean || null;
  } catch (error) {
    console.error('[Adzuna] Failed to get salary stats:', error);
    return null;
  }
}

/**
 * Check if Adzuna API is configured
 */
export function isAdzunaConfigured(): boolean {
  return !!(ADZUNA_APP_ID && ADZUNA_API_KEY);
}




