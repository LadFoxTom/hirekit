import { NextRequest } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { CVData } from '@/types/cv';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sanitizeCVDataForLLM, extractProfessionalInfo } from '@/utils/cvDataSanitizer';

// Enable streaming
export const runtime = 'nodejs';

// Job match interface
interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  remote?: boolean;
  postedDate?: string;
  matchScore?: number;
  matchReason?: string;
  keywordMatches?: string[];
  source?: string;
}

/**
 * Detect if this is a job search request
 */
function isJobSearchRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const jobKeywords = [
    'find job', 'search job', 'job search', 'find me a job', 'look for job',
    'find work', 'job match', 'matching job', 'find jobs', 'search for job',
    'job opportunities', 'find positions', 'job openings', 'find vacancies',
    'match my skills', 'jobs that match', 'career opportunities',
    'looking for a job', 'help me find work', 'find employment',
    'search for positions', 'find opportunities', 'job listings',
    'search positions', 'look for positions', 'look for work',
    'try searching', 'nearby cities', 'nearby regions', 'remote positions',
    'hybrid positions', 'job in', 'jobs in', 'positions in'
  ];
  
  // Also check if message is responding to job search suggestions
  const isResponseToJobSearch = lowerMessage.includes('try') && 
    (lowerMessage.includes('search') || lowerMessage.includes('city') || lowerMessage.includes('region'));
  
  return jobKeywords.some(kw => lowerMessage.includes(kw)) || isResponseToJobSearch;
}

/**
 * Detect if this is a cover letter request
 */
function isCoverLetterRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const letterKeywords = [
    // English keywords
    'cover letter', 'covering letter', 'motivation letter', 'motivational letter',
    'write a letter', 'draft a letter', 'create a letter', 'generate a letter',
    'application letter', 'letter of motivation', 'letter of interest',
    'write cover', 'draft cover', 'create cover', 'help me write a letter',
    'need a letter', 'need a cover', 'compose a letter', 'letter for',
    // Dutch keywords
    'motivatiebrief', 'sollicitatiebrief', 'maak een motivatiebrief', 
    'schrijf een motivatiebrief', 'maak motivatiebrief', 'schrijf motivatiebrief',
    'creëer motivatiebrief', 'genereer motivatiebrief', 'opstellen motivatiebrief',
    'brief schrijven', 'brief voor', 'brief maken',
    // German keywords
    'anschreiben', 'bewerbungsschreiben', 'motivationsschreiben', 'bewerbungsanschreiben',
    'schreibe ein anschreiben', 'erstelle ein anschreiben', 'verfasse ein anschreiben',
    'anschreiben schreiben', 'anschreiben erstellen', 'anschreiben verfassen',
    'anschreiben für', 'bewerbung schreiben', 'bewerbungsbrief',
    // French keywords
    'lettre de motivation', 'lettre de candidature', 'lettre motivation',
    'écrire une lettre', 'rédiger une lettre', 'créer une lettre',
    'faire une lettre', 'lettre motivation', 'lettre candidature',
    'rédiger lettre', 'écrire lettre', 'créer lettre',
    // Spanish keywords
    'carta de motivación', 'carta de presentación', 'carta motivación',
    'escribir una carta', 'redactar una carta', 'crear una carta',
    'hacer una carta', 'carta motivacional', 'carta presentación',
    'redactar carta', 'escribir carta', 'crear carta'
  ];
  
  return letterKeywords.some(kw => lowerMessage.includes(kw));
}

/**
 * Letter data interface
 */
interface LetterData {
  recipientName?: string;
  recipientTitle?: string;
  companyName?: string;
  companyAddress?: string;
  jobTitle?: string;
  opening?: string;
  body?: string;
  closing?: string;
  signature?: string;
}

/**
 * Extract skills from CV data
 */
function extractSkills(cvData: CVData): string[] {
  const skills: string[] = [];
  
  if (cvData.technicalSkills) {
    skills.push(...cvData.technicalSkills.split(',').map(s => s.trim()));
  }
  if (Array.isArray(cvData.skills)) {
    skills.push(...(cvData.skills as string[]));
  }
  if (cvData.skills && typeof cvData.skills === 'object' && !Array.isArray(cvData.skills)) {
    const skillsObj = cvData.skills as { technical?: string[]; tools?: string[] };
    if (skillsObj.technical) skills.push(...skillsObj.technical);
    if (skillsObj.tools) skills.push(...skillsObj.tools);
  }
  
  return Array.from(new Set(skills)).filter(Boolean);
}

/**
 * Check if CV data has meaningful content for job search
 */
function hasMeaningfulCVData(cvData: CVData | null | undefined): boolean {
  if (!cvData) return false;
  
  const skills = extractSkills(cvData);
  const hasTitle = !!(cvData.experience?.[0]?.title || cvData.title || cvData.professionalHeadline);
  const hasSkills = skills.length > 0;
  const hasExperience = !!(cvData.experience && cvData.experience.length > 0);
  
  return hasTitle || hasSkills || hasExperience;
}

/**
 * Extract job search parameters from user message
 */
function extractJobSearchParams(message: string): { query?: string; location?: string; skills?: string[] } {
  const params: { query?: string; location?: string; skills?: string[] } = {};
  
  // Extract location patterns - improved to handle "in Breda", "in Amsterdam", etc.
  const locationPatterns = [
    /\b(?:in|near|at|around|for)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*(?:\s*,\s*[A-Z][a-zA-Z]+)?)/g,
    /(?:location|region|area|city|country):\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*(?:\s*,\s*[A-Z][a-zA-Z]+)?)/gi,
  ];
  
  for (const pattern of locationPatterns) {
    const matches = Array.from(message.matchAll(pattern));
    if (matches && matches.length > 0) {
      // Get the last match (most likely the actual location)
      const lastMatch = matches[matches.length - 1];
      const location = lastMatch[1].trim();
      // Remove common prefixes
      params.location = location.replace(/^(?:in|near|at|around|for|location|region|area|city|country):?\s*/i, '').trim();
      if (params.location) break;
    }
  }
  
  // Extract job title/role patterns - improved to handle "Find jobs for X in Y"
  const jobTitlePatterns = [
    // "Find jobs for a supply chain specialist in Breda" -> "supply chain specialist"
    /(?:find|search|looking for|want|need)\s+(?:jobs?\s+for\s+(?:a|an)?\s*)?([a-z\s]+?)(?:\s+in\s+[A-Z]|\s+job|\s+position|\s+role|$)/i,
    // "Find software developer in Breda" -> "software developer"
    /(?:find|search|looking for|want|need)\s+(?:a|an)?\s*([a-z\s]+?)(?:\s+in\s+[A-Z]|\s+job|\s+position|\s+role|$)/i,
    // "Find job in Breda" -> extract from context or use "job"
    /(?:as|role|position|job|title):\s*([a-z\s]+)/i,
  ];
  
  for (const pattern of jobTitlePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      let query = match[1].trim();
      // Clean up common words
      query = query.replace(/\b(jobs?|for|a|an|the|in|at|near)\b/gi, '').trim();
      if (query && query.length > 2) {
        params.query = query;
        break;
      }
    }
  }
  
  // Fallback: if we have location but no query, use "job" as query
  if (params.location && !params.query) {
    // Try to extract any job-related term
    const jobTerms = message.match(/\b(?:developer|engineer|manager|specialist|analyst|designer|consultant|director|coordinator|assistant|executive|officer|representative|technician|administrator|supervisor|lead|senior|junior|entry)\b/i);
    if (jobTerms) {
      params.query = jobTerms[0].toLowerCase();
    } else {
      params.query = 'job'; // Generic fallback
    }
  }
  
  // Extract skills from message
  const skillKeywords = ['skills', 'technologies', 'using', 'with', 'know'];
  const skillPattern = new RegExp(`(?:${skillKeywords.join('|')}):?\\s*([a-z,\\s]+)`, 'i');
  const skillMatch = message.match(skillPattern);
  if (skillMatch && skillMatch[1]) {
    params.skills = skillMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  }
  
  console.log('[ExtractParams] Extracted:', params);
  return params;
}

/**
 * Get country code from location
 */
function getCountryCode(location: string): string {
  const locationLower = location.toLowerCase();
  
  const countryMappings: Record<string, string> = {
    'netherlands': 'nl', 'holland': 'nl',
    'germany': 'de', 'deutschland': 'de',
    'uk': 'gb', 'united kingdom': 'gb', 'england': 'gb',
    'france': 'fr', 'belgium': 'be', 'spain': 'es', 'italy': 'it',
    'canada': 'ca', 'australia': 'au', 'india': 'in',
    'usa': 'us', 'united states': 'us', 'america': 'us',
  };
  
  for (const [country, code] of Object.entries(countryMappings)) {
    if (locationLower.includes(country)) return code;
  }
  
  return 'us';
}

/**
 * Format salary for display
 */
function formatSalary(amount: number): string {
  if (amount >= 1000) return `$${Math.round(amount / 1000)}k`;
  return `$${amount}`;
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch {
    return '';
  }
}

/**
 * Search Adzuna for jobs
 */
async function searchAdzuna(query: string, location: string, allowMock: boolean = false): Promise<JobMatch[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;
  
  if (!appId || !apiKey) {
    console.warn('[Adzuna] Missing API credentials');
    // Only return mock jobs if explicitly allowed (for testing)
    if (allowMock) {
      return getMockJobs(query);
    }
    return [];
  }
  
  try {
    const countryCode = getCountryCode(location);
    
    const params = new URLSearchParams({
      app_id: appId,
      app_key: apiKey,
      results_per_page: '20',
      what: query,
      content_type: 'application/json',
    });
    
    if (location) {
      params.set('where', location.split(',')[0].trim());
    }
    
    const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?${params}`;
    console.log('[Adzuna] Searching:', { url: url.replace(apiKey, 'REDACTED'), query, location, countryCode });
    
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Adzuna] API error:', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorText,
        query,
        location,
        countryCode
      });
      
      // If allowMock is true, return mock jobs for testing
      if (allowMock) {
        console.warn('[Adzuna] Returning mock jobs due to API error');
        return getMockJobs(query);
      }
      return []; // Don't return mock jobs in production
    }
    
    const data = await response.json();
    console.log('[Adzuna] API Response:', { 
      count: data.count || 0, 
      results: data.results?.length || 0,
      query,
      location 
    });
    
    if (!data.results || data.results.length === 0) {
      console.warn('[Adzuna] No results found for query:', { query, location, countryCode });
      
      // If allowMock is true, return mock jobs for testing
      if (allowMock) {
        console.warn('[Adzuna] Returning mock jobs due to no results');
        return getMockJobs(query);
      }
      return []; // Don't return mock jobs in production
    }
    
    return data.results.map((job: any) => ({
      id: `adzuna-${job.id}`,
      title: job.title,
      company: job.company?.display_name || 'Company',
      location: job.location?.display_name || 'Remote',
      description: job.description || '',
      url: job.redirect_url || '',
      salary: job.salary_min && job.salary_max 
        ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`
        : job.salary_min 
        ? `From ${formatSalary(job.salary_min)}`
        : undefined,
      remote: /remote|work from home|wfh/i.test(job.description || ''),
      postedDate: formatDate(job.created),
      source: 'adzuna',
    }));
    
  } catch (error) {
    console.error('[Adzuna] Fetch error:', error);
    return []; // Don't return mock jobs
  }
}

/**
 * Mock jobs for when API is unavailable
 */
function getMockJobs(query: string): JobMatch[] {
  const titles = query ? query.split(' ').filter(w => w.length > 2).join(' ') : 'Developer';
  
  return [
    {
      id: 'demo-1',
      title: `Senior ${titles} Developer`,
      company: 'TechCorp International',
      location: 'Remote / Hybrid',
      description: `We're looking for an experienced developer to join our growing team. You'll work on cutting-edge projects using modern technologies. Requirements include strong problem-solving skills and experience with agile methodologies. Great benefits and competitive salary.`,
      url: 'https://example.com/job/1',
      salary: '$120k - $160k',
      remote: true,
      postedDate: '2 days ago',
      source: 'demo',
    },
    {
      id: 'demo-2',
      title: `${titles} Engineer`,
      company: 'Innovation Labs',
      location: 'Amsterdam, Netherlands',
      description: `Join our international team building the future of technology. We offer competitive salaries, great benefits, and a collaborative work environment. Experience with cloud technologies and modern frameworks is a plus.`,
      url: 'https://example.com/job/2',
      salary: '€80k - €100k',
      remote: false,
      postedDate: '1 week ago',
      source: 'demo',
    },
    {
      id: 'demo-3',
      title: `Lead ${titles} Architect`,
      company: 'Digital Solutions Inc',
      location: 'London, UK',
      description: `Looking for a technical leader to guide our development team. You'll be responsible for architectural decisions and mentoring junior developers. Strong communication skills required. Remote-friendly position.`,
      url: 'https://example.com/job/3',
      salary: '£90k - £120k',
      remote: true,
      postedDate: '3 days ago',
      source: 'demo',
    },
    {
      id: 'demo-4',
      title: `Full Stack ${titles}`,
      company: 'StartupHub',
      location: 'Berlin, Germany',
      description: `Fast-growing startup seeking talented full-stack developer. Work with React, Node.js, and cloud infrastructure. Equity package available. Flexible working hours and modern office in city center.`,
      url: 'https://example.com/job/4',
      salary: '€70k - €90k',
      remote: true,
      postedDate: '5 days ago',
      source: 'demo',
    },
    {
      id: 'demo-5',
      title: `${titles} Consultant`,
      company: 'Global Consulting Group',
      location: 'New York, USA',
      description: `Join our consulting practice helping Fortune 500 companies with digital transformation. Travel opportunities, excellent compensation, and career growth potential.`,
      url: 'https://example.com/job/5',
      salary: '$140k - $180k',
      remote: false,
      postedDate: '1 day ago',
      source: 'demo',
    },
  ];
}

/**
 * Rank jobs by CV match
 */
function rankJobsByCVMatch(jobs: JobMatch[], cvData: CVData): JobMatch[] {
  const skills = extractSkills(cvData);
  const title = cvData.experience?.[0]?.title || cvData.title || '';
  
  return jobs.map(job => {
    let score = 50;
    const matches: string[] = [];
    
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    
    for (const skill of skills) {
      if (skill && jobText.includes(skill.toLowerCase())) {
        score += 5;
        matches.push(skill);
      }
    }
    
    if (title && jobText.includes(title.toLowerCase())) {
      score += 15;
    }
    
    score = Math.min(100, score);
    
    let matchReason = '';
    if (matches.length > 0) {
      matchReason = `Matches ${matches.length} of your skills: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '...' : ''}`;
    } else if (title) {
      matchReason = `Related to your experience as ${title}`;
    } else {
      matchReason = 'Based on common industry requirements';
    }
    
    return {
      ...job,
      matchScore: score,
      matchReason,
      keywordMatches: matches.slice(0, 8),
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

/**
 * Smart Job Search Agent with LLM Reasoning
 * Uses OpenAI to understand user intent, extract information from CV/documents,
 * and construct optimal search queries with fallback strategies
 */
async function searchJobs(cvData: CVData | null | undefined, userMessage?: string): Promise<{ jobs: JobMatch[]; message: string }> {
  const llm = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    temperature: 0.3,
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // Step 1: Use LLM to understand the user's request and extract search parameters
    // IMPORTANT: Use sanitized CV data (no personal info) for LLM
    const sanitizedCvData = cvData ? sanitizeCVDataForLLM(cvData) : null;
    const professionalInfo = cvData ? extractProfessionalInfo(cvData) : null;
    const cvSkills = cvData ? extractSkills(cvData) : [];
    
    const reasoningPrompt = `You are an intelligent job search assistant. Analyze the user's request and extract relevant information for job searching.

USER REQUEST: "${userMessage || ''}"

CV DATA AVAILABLE: ${professionalInfo ? JSON.stringify({
  title: professionalInfo.title,
  experience: professionalInfo.experience,
  skills: professionalInfo.skills,
  location: professionalInfo.location, // General location only (city/region)
}) : 'None'}

TASK: Extract and reason about the job search parameters. Consider:
1. What job title/role is the user looking for?
2. What location (city, region, country)?
3. What skills or requirements are mentioned?
4. If CV data exists, what relevant information can be used?
5. Generate optimal search queries (primary and alternatives)

Respond with JSON only:
{
  "jobTitle": "extracted or inferred job title",
  "location": "extracted location or null",
  "skills": ["skill1", "skill2"],
  "searchQueries": [
    "primary search query",
    "alternative query 1 (broader)",
    "alternative query 2 (more specific)"
  ],
  "reasoning": "brief explanation of your reasoning",
  "useCVData": true/false,
  "hasEnoughInfo": true/false
}`;

    console.log('[Smart Job Search] Using LLM to analyze request...');
    const reasoningResponse = await llm.invoke([
      new SystemMessage('You are a job search expert. Always respond with valid JSON only.'),
      new HumanMessage(reasoningPrompt),
    ]);

    let searchParams: {
      jobTitle?: string;
      location?: string;
      skills?: string[];
      searchQueries?: string[];
      reasoning?: string;
      useCVData?: boolean;
      hasEnoughInfo?: boolean;
    } = {};

    try {
      const responseText = reasoningResponse.content.toString();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        searchParams = JSON.parse(jsonMatch[0]);
        console.log('[Smart Job Search] LLM reasoning:', searchParams);
      }
    } catch (parseError) {
      console.error('[Smart Job Search] Failed to parse LLM response:', parseError);
      // Fallback to basic extraction
      const basicParams = extractJobSearchParams(userMessage || '');
      searchParams = {
        jobTitle: basicParams.query,
        location: basicParams.location,
        skills: basicParams.skills,
        searchQueries: basicParams.query ? [basicParams.query] : [],
        hasEnoughInfo: !!(basicParams.query || basicParams.location),
      };
    }

    // Validate we have enough information
    if (!searchParams.hasEnoughInfo && !searchParams.searchQueries?.length) {
      // Try to extract from CV if available
      if (cvData) {
        const skills = extractSkills(cvData);
        const title = cvData.experience?.[0]?.title || cvData.title || cvData.professionalHeadline || '';
        // Use sanitized location (general location only, no full address)
        const professionalInfo = extractProfessionalInfo(cvData);
        const location = professionalInfo.location || '';
        
        if (title || skills.length > 0) {
          searchParams.jobTitle = title || skills.slice(0, 2).join(' ');
          searchParams.location = location;
          searchParams.searchQueries = [title || skills.slice(0, 3).join(' ')];
          searchParams.useCVData = true;
        }
      }

      if (!searchParams.searchQueries?.length) {
        return {
          jobs: [],
          message: "I need more information to search for jobs. Please either:\n\n1. **Share your CV** with your skills and job title, or\n2. **Tell me what you're looking for**, for example:\n   - \"Find software developer jobs in Amsterdam\"\n   - \"Search for marketing manager positions in London\"\n   - \"Find jobs using Python and React in Berlin\"\n\nWhat type of job are you looking for, and in what location?",
        };
      }
    }

    // Step 2: Try multiple search queries with fallback strategy
    const searchQueries = searchParams.searchQueries || [searchParams.jobTitle || 'job'];
    const location = searchParams.location || '';
    let allJobs: JobMatch[] = [];
    let successfulQuery = '';

    console.log('[Smart Job Search] Trying queries:', searchQueries, 'Location:', location || 'any');

    // Try primary query first
    for (const query of searchQueries) {
      if (!query || query.trim().length === 0) continue;
      
      console.log(`[Smart Job Search] Searching: "${query}" in "${location || 'any'}"`);
      const jobs = await searchAdzuna(query.trim(), location, false);
      
      if (jobs.length > 0) {
        allJobs = jobs;
        successfulQuery = query;
        console.log(`[Smart Job Search] Found ${jobs.length} jobs with query: "${query}"`);
        break; // Use first successful query
      }
    }

    // If no results, try broader searches
    if (allJobs.length === 0 && searchParams.jobTitle) {
      console.log('[Smart Job Search] No results, trying broader searches...');
      
      // Try just the main keyword
      const mainKeyword = searchParams.jobTitle.split(' ')[0];
      if (mainKeyword && mainKeyword.length > 3) {
        const jobs = await searchAdzuna(mainKeyword, location, true);
        if (jobs.length > 0) {
          allJobs = jobs;
          successfulQuery = mainKeyword;
        }
      }

      // Try without location if location was specified
      if (allJobs.length === 0 && location) {
        console.log('[Smart Job Search] Trying without location constraint...');
        for (const query of searchQueries.slice(0, 2)) {
          if (!query) continue;
          const jobs = await searchAdzuna(query.trim(), '', true);
          if (jobs.length > 0) {
            allJobs = jobs;
            successfulQuery = query;
            break;
          }
        }
      }
    }

    // Step 3: Rank and format results
    if (allJobs.length > 0) {
      const hasCVData = hasMeaningfulCVData(cvData);
      const rankedJobs = hasCVData && cvData ? rankJobsByCVMatch(allJobs, cvData) : allJobs.map(job => ({
        ...job,
        matchScore: 50,
        matchReason: 'Based on your search criteria',
        keywordMatches: [],
      }));

      const locationInfo = location ? ` in ${location}` : '';
      const skillInfo = hasCVData && searchParams.skills?.length ? ` based on your ${searchParams.skills.length} skills` : '';
      
      return {
        jobs: rankedJobs,
        message: `🎉 Great news! I found **${rankedJobs.length} job opportunities**${locationInfo}${skillInfo}!\n\n${hasCVData ? `I've analyzed each position and ranked them by relevance. The top match has a **${rankedJobs[0]?.matchScore || 0}% compatibility score**.\n\n` : ''}**How to use the job board:**\n- 💚 **Swipe right** or tap the heart to save jobs you like\n- ❌ **Swipe left** or tap X to skip\n- 🔗 **Tap the link icon** to view the full job listing\n- 📝 **Quick Apply** to start your application\n\nTake your time reviewing each opportunity!`,
      };
    }

    // Step 4: Provide helpful feedback when no results found
    const suggestions = [];
    if (location) {
      suggestions.push(`- Try searching in nearby cities or regions`);
      suggestions.push(`- Consider remote or hybrid positions`);
    }
    if (searchParams.jobTitle && searchParams.jobTitle.split(' ').length > 2) {
      suggestions.push(`- Try a more general job title (e.g., "${searchParams.jobTitle.split(' ')[0]}")`);
    }
    suggestions.push(`- Share your CV so I can search based on your actual skills and experience`);

    return {
      jobs: [],
      message: `I searched for "${successfulQuery || searchParams.jobTitle || 'jobs'}"${location ? ` in ${location}` : ''} but couldn't find any matches right now.\n\n**Suggestions:**\n${suggestions.join('\n')}\n\nWould you like to try a different search, or share your CV for a more personalized job search?`,
    };

  } catch (error) {
    console.error('[Smart Job Search] Error:', error);
    // Fallback to basic search
    const basicParams = extractJobSearchParams(userMessage || '');
    const query = basicParams.query || (cvData ? (cvData.experience?.[0]?.title || cvData.title) : undefined);
    const location = basicParams.location || cvData?.contact?.location || '';

    if (!query) {
      return {
        jobs: [],
        message: "I encountered an issue processing your request. Please try again with more specific details, or share your CV for a better search experience.",
      };
    }

    const jobs = await searchAdzuna(query, location, false);
    return {
      jobs: jobs.map(job => ({ ...job, matchScore: 50, matchReason: 'Based on search', keywordMatches: [] })),
      message: jobs.length > 0 
        ? `Found ${jobs.length} job opportunities!`
        : `I couldn't find any jobs matching "${query}"${location ? ` in ${location}` : ''}. Try being more specific or share your CV for better results.`,
    };
  }
}

const CV_EXTRACTION_PROMPT = `You are an expert CV/resume analyst, career assistant, and document designer. Your job is to help users build, improve, and style their CVs through natural conversation.

## YOUR CAPABILITIES

1. **Content Creation**: Extract and structure CV information from user input
2. **Content Editing**: Modify, improve, or rewrite CV content
3. **Styling**: Change templates, colors, and visual design
4. **CV Analysis & Review**: When users ask you to analyze, review, or provide feedback on their CV, you MUST:
   - Thoroughly examine ALL sections of their CV (summary, experience, education, skills, etc.)
   - Identify specific strengths and areas for improvement
   - Provide concrete, actionable suggestions with examples
   - Point out missing information or sections that could be enhanced
   - Give feedback on formatting, clarity, and ATS-friendliness
   - Be detailed and comprehensive - don't just say "I've analyzed" - actually provide the analysis!
5. **Career Advice**: Provide professional guidance
6. **Job Search**: IMPORTANT - You CAN and DO search for real-time job opportunities. You have full access to live job postings through the job search API. When users mention finding jobs, searching for positions, or looking for work, you can search based on job titles, locations, and skills. NEVER say you cannot search for jobs or that you don't have access to job postings - this is incorrect.
7. **Photo Management**: Users can add profile photos to their CV. When users mention adding a photo, profile picture, or image, guide them to use the photo upload feature in the Editor tab. Photos can be positioned left, right, center, or hidden. Recommend professional headshots for best results.

## IMPORTANT RULES ABOUT JOB SEARCHING

- If a user asks about finding jobs, searching for positions, or looking for work, DO NOT say you cannot do this
- You have access to real-time job search capabilities
- You can search by job title, location, skills, or any combination
- If you cannot find specific jobs, suggest alternatives but never claim you cannot search

## JSON RESPONSE FORMAT

ALWAYS return a JSON object with this structure:

{
  "response": "Your conversational response to the user. For analysis requests, this MUST be a comprehensive, detailed analysis (300-500+ words) with specific feedback, not just a brief acknowledgment.",
  "cvUpdates": {
    "fullName": "Person's full name",
    "professionalHeadline": "Their job title or professional headline",
    "summary": "Professional summary paragraph",
    "contact": {
      "email": "email@example.com",
      "phone": "+1234567890",
      "location": "City, Country",
      "linkedin": "linkedin.com/in/username",
      "website": "portfolio.com"
    },
    "social": {
      "github": "github.com/username"
    },
    "experience": [
      {
        "title": "Job Title",
        "company": "Company Name",
        "location": "City, Country",
        "dates": "Jan 2020 - Present",
        "achievements": ["Achievement with metrics", "Another achievement"]
      }
    ],
    "education": [
      {
        "degree": "Degree Name",
        "field": "Field of Study",
        "institution": "University Name",
        "dates": "2016 - 2020"
      }
    ],
    "technicalSkills": "Python, JavaScript, React, Node.js",
    "softSkills": "Leadership, Communication, Problem-solving",
    "languages": ["English (Native)", "Spanish (Fluent)"],
    "hobbies": ["Photography", "Hiking", "Reading"],
    
    // PHOTO FIELD - Profile photo URL (users upload via Editor tab)
    "photoUrl": "https://example.com/photo.jpg", // Optional: URL or data URL
    
    // STYLING FIELDS - Use these to change visual appearance
    "template": "modern", // Options: modern, executive, creative, minimal, professional, tech
    "layout": {
      "accentColor": "#2563eb", // Hex color for accents
      "photoPosition": "left" // Options: "left", "right", "center", "none"
    }
  }
}

## AVAILABLE TEMPLATES

- **modern** - Clean and contemporary with blue accents
- **executive** - Sophisticated black/gray
- **creative** - Purple gradient style
- **minimal** - Ultra-clean with minimal decorations
- **professional** - Corporate blue
- **tech** - Green accents with modern feel

## CRITICAL RULES

1. ALWAYS return valid JSON - no markdown code blocks
2. When user asks for styling changes, ALWAYS include template or layout.accentColor in cvUpdates
3. Only include fields that need to change in cvUpdates
4. For content extraction, include ALL data the user provides
5. Write achievement bullets with action verbs and metrics
6. Professional summary should be 2-3 impactful sentences
7. Respond conversationally while confirming the changes made
8. **FOR ANALYSIS/REVIEW REQUESTS**: When the user asks you to analyze, review, evaluate, or provide feedback on their CV:
   - Provide a COMPREHENSIVE analysis in the "response" field (at least 300-500 words)
   - Structure your analysis with clear sections (e.g., "## Strengths", "## Areas for Improvement", "## Specific Recommendations")
   - Be specific - reference actual content from their CV (job titles, companies, skills, etc.)
   - Include actionable suggestions with concrete examples
   - If you identify issues, explain WHY they're problematic and HOW to fix them
   - You can leave cvUpdates empty {} if no changes are needed, but the response MUST contain the full analysis
   - CRITICAL: Do NOT just say "I've analyzed your CV and here are some observations" - you MUST immediately follow with the actual detailed analysis. The response field should contain the ENTIRE analysis, not just an introduction.
   - Example of what NOT to do: "I've analyzed your CV and here are some suggestions:" (then nothing)
   - Example of what TO do: "I've thoroughly reviewed your CV. Here's my detailed analysis:\n\n## Strengths\n[detailed content]\n\n## Areas for Improvement\n[detailed content]\n\n## Recommendations\n[detailed content]"

Return ONLY the JSON object. No markdown. No extra text.`;

/**
 * Generate a cover letter based on user request and CV data
 */
async function generateCoverLetter(message: string, cvData: CVData): Promise<LetterData> {
  const llm = new ChatOpenAI({
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Detect language based on keywords
  const lowerMessage = message.toLowerCase();
  let detectedLanguage: 'en' | 'nl' | 'de' | 'fr' | 'es' = 'en';
  
  if (lowerMessage.includes('motivatiebrief') || 
      lowerMessage.includes('sollicitatiebrief') ||
      lowerMessage.includes('maak') ||
      lowerMessage.includes('schrijf') ||
      lowerMessage.includes('creëer') ||
      lowerMessage.includes('genereer')) {
    detectedLanguage = 'nl';
  } else if (lowerMessage.includes('anschreiben') ||
             lowerMessage.includes('bewerbungsschreiben') ||
             lowerMessage.includes('motivationsschreiben') ||
             lowerMessage.includes('schreibe') ||
             lowerMessage.includes('erstelle') ||
             lowerMessage.includes('verfasse')) {
    detectedLanguage = 'de';
  } else if (lowerMessage.includes('lettre de motivation') ||
             lowerMessage.includes('lettre de candidature') ||
             lowerMessage.includes('écrire') ||
             lowerMessage.includes('rédiger') ||
             lowerMessage.includes('créer une lettre')) {
    detectedLanguage = 'fr';
  } else if (lowerMessage.includes('carta de motivación') ||
             lowerMessage.includes('carta de presentación') ||
             lowerMessage.includes('escribir') ||
             lowerMessage.includes('redactar') ||
             lowerMessage.includes('crear una carta')) {
    detectedLanguage = 'es';
  }

  // Extract any job/company info from the message
  const prompt = detectedLanguage === 'nl' 
    ? `Je bent een professionele schrijver van motivatiebrieven. Genereer een overtuigende, gepersonaliseerde motivatiebrief gebaseerd op het volgende:

GEBRUIKERSVERZOEK: ${message}

CV DATA VAN KANDIDAAT:
${JSON.stringify(cvData, null, 2)}

Genereer een motivatiebrief in het volgende JSON formaat:
{
  "recipientName": "Naam van de geadresseerde indien vermeld, anders 'Geachte heer/mevrouw'",
  "recipientTitle": "Functie indien bekend",
  "companyName": "Bedrijfsnaam indien vermeld",
  "jobTitle": "Functie waarvoor gesolliciteerd wordt",
  "opening": "Geachte [Naam]," format begroeting,
  "body": "De hoofdtekst van de brief in het NEDERLANDS. 2-3 alinea's. Eerste alinea: toon interesse en noem de specifieke functie. Tweede alinea: benadruk 2-3 relevante prestaties uit hun CV die passen bij de functie. Derde alinea: toon enthousiasme en cultural fit. Gebruik dubbele regelafbrekingen tussen alinea's.",
  "closing": "Een professionele afsluitende verklaring waarin je bedankt voor de overweging en je wens uitdrukt om verder te bespreken",
  "signature": "Volledige naam van de kandidaat"
}

BELANGRIJK:
- Maak de brief specifiek voor de baan/het bedrijf indien vermeld
- Verwijs naar daadwerkelijke ervaring uit het CV
- Houd het beknopt (300-400 woorden totaal)
- Wees professioneel maar persoonlijk
- Vermijd clichés zoals "Hierbij solliciteer ik"
- Begin met iets boeiends
- SCHRIJF DE HELE BRIEF IN HET NEDERLANDS

Retourneer ALLEEN het JSON object.`
    : detectedLanguage === 'de'
    ? `Sie sind ein professioneller Anschreiben-Schreiber. Erstellen Sie ein überzeugendes, personalisiertes Bewerbungsanschreiben basierend auf Folgendem:

BENUTZERANFRAGE: ${message}

BEWERBER-LEBENSLAUF-DATEN:
${JSON.stringify(cvData, null, 2)}

Erstellen Sie ein Anschreiben im folgenden JSON-Format:
{
  "recipientName": "Name des Empfängers falls erwähnt, sonst 'Sehr geehrte Damen und Herren'",
  "recipientTitle": "Titel falls bekannt",
  "companyName": "Firmenname falls erwähnt",
  "jobTitle": "Position für die sich beworben wird",
  "opening": "Sehr geehrte/r [Name]," Format Anrede,
  "body": "Der Haupttext des Anschreibens auf DEUTSCH. 2-3 Absätze. Erster Absatz: Interesse zeigen und die spezifische Position erwähnen. Zweiter Absatz: 2-3 relevante Leistungen aus dem Lebenslauf hervorheben, die zur Position passen. Dritter Absatz: Enthusiasmus und kulturelle Passung zeigen. Verwenden Sie doppelte Zeilenumbrüche zwischen Absätzen.",
  "closing": "Ein professioneller Abschlusssatz, der für die Berücksichtigung dankt und den Wunsch nach weiterer Diskussion ausdrückt",
  "signature": "Vollständiger Name des Bewerbers"
}

WICHTIG:
- Machen Sie das Anschreiben spezifisch für die Stelle/das Unternehmen falls erwähnt
- Verweisen Sie auf tatsächliche Erfahrungen aus dem Lebenslauf
- Halten Sie es prägnant (300-400 Wörter insgesamt)
- Seien Sie professionell aber persönlich
- Vermeiden Sie Klischees wie "Hiermit bewerbe ich mich"
- Beginnen Sie mit etwas Ansprechendem
- SCHREIBEN SIE DAS GESAMTE ANSCHREIBEN AUF DEUTSCH

Geben Sie NUR das JSON-Objekt zurück.`
    : detectedLanguage === 'fr'
    ? `Vous êtes un rédacteur professionnel de lettres de motivation. Générez une lettre de motivation convaincante et personnalisée basée sur ce qui suit:

DEMANDE DE L'UTILISATEUR: ${message}

DONNÉES CV DU CANDIDAT:
${JSON.stringify(cvData, null, 2)}

Générez une lettre de motivation au format JSON suivant:
{
  "recipientName": "Nom du destinataire si mentionné, sinon 'Madame, Monsieur'",
  "recipientTitle": "Titre si connu",
  "companyName": "Nom de l'entreprise si mentionné",
  "jobTitle": "Poste pour lequel on postule",
  "opening": "Madame, Monsieur," format de salutation,
  "body": "Le corps principal de la lettre en FRANÇAIS. 2-3 paragraphes. Premier paragraphe: exprimer l'intérêt et mentionner le poste spécifique. Deuxième paragraphe: mettre en avant 2-3 réalisations pertinentes de leur CV qui correspondent au poste. Troisième paragraphe: montrer l'enthousiasme et l'adéquation culturelle. Utilisez des sauts de ligne doubles entre les paragraphes.",
  "closing": "Une déclaration de clôture professionnelle remerciant pour la considération et exprimant le désir de discuter davantage",
  "signature": "Nom complet du candidat"
}

IMPORTANT:
- Rendez la lettre spécifique au poste/l'entreprise si mentionné
- Référencez l'expérience réelle du CV
- Gardez-la concise (300-400 mots au total)
- Soyez professionnel mais personnel
- Évitez les clichés comme "Je vous écris pour postuler"
- Commencez par quelque chose d'engageant
- ÉCRIVEZ TOUTE LA LETTRE EN FRANÇAIS

Retournez UNIQUEMENT l'objet JSON.`
    : detectedLanguage === 'es'
    ? `Eres un redactor profesional de cartas de motivación. Genera una carta de motivación convincente y personalizada basada en lo siguiente:

SOLICITUD DEL USUARIO: ${message}

DATOS DEL CV DEL CANDIDATO:
${JSON.stringify(cvData, null, 2)}

Genera una carta de motivación en el siguiente formato JSON:
{
  "recipientName": "Nombre del destinatario si se menciona, de lo contrario 'Estimado/a'",
  "recipientTitle": "Título si se conoce",
  "companyName": "Nombre de la empresa si se menciona",
  "jobTitle": "Posición para la que se solicita",
  "opening": "Estimado/a [Nombre]," formato de saludo,
  "body": "El cuerpo principal de la carta en ESPAÑOL. 2-3 párrafos. Primer párrafo: expresar interés y mencionar el puesto específico. Segundo párrafo: destacar 2-3 logros relevantes de su CV que coincidan con el puesto. Tercer párrafo: mostrar entusiasmo y ajuste cultural. Use saltos de línea dobles entre párrafos.",
  "closing": "Una declaración de cierre profesional agradeciendo por la consideración y expresando el deseo de discutir más",
  "signature": "Nombre completo del candidato"
}

IMPORTANTE:
- Haga la carta específica para el trabajo/empresa si se menciona
- Referencie la experiencia real del CV
- Manténgala concisa (300-400 palabras en total)
- Sea profesional pero personal
- Evite clichés como "Le escribo para solicitar"
- Comience con algo atractivo
- ESCRIBA TODA LA CARTA EN ESPAÑOL

Devuelva SOLO el objeto JSON.`
    : `You are a professional cover letter writer. Generate a compelling, personalized cover letter based on the following:

USER REQUEST: ${message}

CANDIDATE CV DATA:
${JSON.stringify(cvData, null, 2)}

Generate a cover letter in the following JSON format:
{
  "recipientName": "Hiring Manager or specific name if mentioned",
  "recipientTitle": "Title if known",
  "companyName": "Company name if mentioned",
  "jobTitle": "Position being applied for",
  "opening": "Dear [Name]," format salutation,
  "body": "The main body of the letter. 2-3 paragraphs. First paragraph: express interest and mention the specific role. Second paragraph: highlight 2-3 relevant achievements from their CV that match the role. Third paragraph: show enthusiasm and cultural fit. Use double line breaks between paragraphs.",
  "closing": "A professional closing statement thanking them and expressing desire to discuss further",
  "signature": "Candidate's full name"
}

IMPORTANT:
- Make the letter specific to the job/company if mentioned
- Reference actual experience from the CV
- Keep it concise (300-400 words total)
- Be professional but personable
- Avoid clichés like "I am writing to apply"
- Start with something engaging

Return ONLY the JSON object.`;

  try {
    const response = await llm.invoke([new HumanMessage(prompt)]);
    const content = response.content.toString().trim();
    
    // Parse the JSON response
    let letterData: LetterData;
    try {
      // Handle potential markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        letterData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch {
      // Fallback letter based on detected language
      if (detectedLanguage === 'nl') {
        letterData = {
          opening: 'Geachte heer/mevrouw,',
          body: `Graag solliciteer ik naar deze interessante functie. Met mijn achtergrond als ${cvData.title || cvData.professionalHeadline || 'professional'} zou ik een waardevolle aanvulling zijn op uw team.\n\nMijn ervaring omvat onder andere ${cvData.experience?.[0]?.title || 'relevante posities'} waarbij ik vaardigheden heb ontwikkeld die direct aansluiten bij deze rol. Ik ben gemotiveerd om uitstekende resultaten te leveren en bij te dragen aan het succes van het team.\n\nIk zou graag in een persoonlijk gesprek toelichten hoe mijn vaardigheden en ervaring uw organisatie kunnen versterken.`,
          closing: 'Dank u wel voor het overwegen van mijn sollicitatie. Ik kijk ernaar uit om te bespreken hoe ik kan bijdragen aan uw team.',
          signature: cvData.fullName || 'Uw Naam',
        };
      } else if (detectedLanguage === 'de') {
        letterData = {
          opening: 'Sehr geehrte Damen und Herren,',
          body: `Gerne bewerbe ich mich um diese interessante Position. Mit meinem Hintergrund als ${cvData.title || cvData.professionalHeadline || 'Fachkraft'} wäre ich eine wertvolle Bereicherung für Ihr Team.\n\nMeine Erfahrung umfasst unter anderem ${cvData.experience?.[0]?.title || 'relevante Positionen'}, bei denen ich Fähigkeiten entwickelt habe, die direkt zu dieser Rolle passen. Ich bin motiviert, hervorragende Ergebnisse zu erzielen und zum Erfolg des Teams beizutragen.\n\nIch würde gerne in einem persönlichen Gespräch erläutern, wie meine Fähigkeiten und Erfahrungen Ihre Organisation stärken können.`,
          closing: 'Vielen Dank für die Berücksichtigung meiner Bewerbung. Ich freue mich darauf, zu besprechen, wie ich zu Ihrem Team beitragen kann.',
          signature: cvData.fullName || 'Ihr Name',
        };
      } else if (detectedLanguage === 'fr') {
        letterData = {
          opening: 'Madame, Monsieur,',
          body: `Je souhaite postuler pour ce poste intéressant. Avec mon expérience en tant que ${cvData.title || cvData.professionalHeadline || 'professionnel'}, je serais un atout précieux pour votre équipe.\n\nMon expérience comprend notamment ${cvData.experience?.[0]?.title || 'des postes pertinents'} où j'ai développé des compétences qui correspondent directement à ce rôle. Je suis passionné par la livraison d'excellents résultats et la contribution au succès de l'équipe.\n\nJ'aimerais avoir l'opportunité de discuter de la façon dont mes compétences et mon expérience peuvent bénéficier à votre organisation.`,
          closing: `Merci de considérer ma candidature. J'ai hâte de discuter de la façon dont je peux contribuer à votre équipe.`,
          signature: cvData.fullName || 'Votre Nom',
        };
      } else if (detectedLanguage === 'es') {
        letterData = {
          opening: 'Estimado/a,',
          body: `Me complace solicitar esta interesante posición. Con mi experiencia como ${cvData.title || cvData.professionalHeadline || 'profesional'}, sería una valiosa adición a su equipo.\n\nMi experiencia incluye ${cvData.experience?.[0]?.title || 'posiciones relevantes'} donde he desarrollado habilidades que se alinean directamente con este rol. Estoy apasionado por entregar excelentes resultados y contribuir al éxito del equipo.\n\nMe gustaría tener la oportunidad de discutir cómo mis habilidades y experiencia pueden beneficiar a su organización.`,
          closing: 'Gracias por considerar mi solicitud. Espero con interés la oportunidad de discutir cómo puedo contribuir a su equipo.',
          signature: cvData.fullName || 'Su Nombre',
        };
      } else {
        letterData = {
          opening: 'Dear Hiring Manager,',
          body: `I am excited to apply for this opportunity. With my background in ${cvData.title || cvData.professionalHeadline || 'this field'}, I believe I would be a valuable addition to your team.\n\nMy experience includes ${cvData.experience?.[0]?.title || 'relevant positions'} where I developed skills that directly align with this role. I am passionate about delivering excellent results and contributing to team success.\n\nI would welcome the opportunity to discuss how my skills and experience can benefit your organization.`,
          closing: 'Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.',
          signature: cvData.fullName || 'Your Name',
        };
      }
    }

    // Ensure signature uses CV name
    if (!letterData.signature && cvData.fullName) {
      letterData.signature = cvData.fullName;
    }

    return letterData;
  } catch (error) {
    console.error('[CoverLetter] Generation error:', error);
    
    // Return a template letter based on detected language
    if (detectedLanguage === 'nl') {
      return {
        opening: 'Geachte heer/mevrouw,',
        body: 'Graag solliciteer ik naar deze functie. Mijn ervaring en vaardigheden maken mij een geschikte kandidaat voor deze rol.\n\nIk ben gemotiveerd om bij te dragen aan uw organisatie en kijk ernaar uit om mijn kwaliteiten verder toe te lichten in een persoonlijk gesprek.',
        closing: 'Met vriendelijke groet,',
        signature: cvData.fullName || 'Uw Naam',
      };
    } else if (detectedLanguage === 'de') {
      return {
        opening: 'Sehr geehrte Damen und Herren,',
        body: 'Gerne bewerbe ich mich um diese Position. Meine Erfahrung und Fähigkeiten machen mich zu einem geeigneten Kandidaten für diese Rolle.\n\nIch bin motiviert, zu Ihrer Organisation beizutragen und freue mich darauf, meine Qualifikationen in einem persönlichen Gespräch näher zu erläutern.',
        closing: 'Mit freundlichen Grüßen,',
        signature: cvData.fullName || 'Ihr Name',
      };
    } else if (detectedLanguage === 'fr') {
      return {
        opening: 'Madame, Monsieur,',
        body: 'Je souhaite exprimer mon intérêt pour ce poste. Mon expérience et mes compétences font de moi un candidat solide pour ce rôle.\n\nJe suis enthousiaste à l\'idée de contribuer à votre organisation et j\'ai hâte de discuter de mes qualifications plus en détail.',
        closing: 'Cordialement,',
        signature: cvData.fullName || 'Votre Nom',
      };
    } else if (detectedLanguage === 'es') {
      return {
        opening: 'Estimado/a,',
        body: 'Me complace expresar mi interés en esta posición. Mi experiencia y habilidades me convierten en un candidato sólido para este rol.\n\nEstoy entusiasmado con la oportunidad de contribuir a su organización y espero discutir mis calificaciones con más detalle.',
        closing: 'Atentamente,',
        signature: cvData.fullName || 'Su Nombre',
      };
    } else {
      return {
        opening: 'Dear Hiring Manager,',
        body: 'I am writing to express my interest in this position. My experience and skills make me a strong candidate for this role.\n\nI am excited about the opportunity to contribute to your organization and look forward to discussing my qualifications in more detail.',
        closing: 'Sincerely,',
        signature: cvData.fullName || 'Your Name',
      };
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication (optional but recommended)
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user?.email;
    
    const body = await req.json();
    let { message, cvData, conversationHistory, language = 'en' } = body;
    
    // Language mapping for LLM
    const languageMap: Record<string, string> = {
      'en': 'English',
      'nl': 'Dutch',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
    };
    const responseLanguage = languageMap[language] || 'English';

    // Sanitize CV data - remove large base64 photo data to prevent payload issues
    // Note: Further sanitization (removing personal info) happens before sending to LLM
    if (cvData && cvData.photos) {
      cvData = { ...cvData };
      delete cvData.photos; // Remove photos array (contains large base64 data)
    }

    // ========================================
    // JOB SEARCH HANDLING - Check first!
    // ========================================
    if (isJobSearchRequest(message)) {
      console.log('[Stream] Job search detected, calling job search API...', { isAuthenticated });
      
      // For job searches, require either authentication OR explicit parameters
      if (!isAuthenticated) {
        // Check if user provided explicit parameters
        const params = extractJobSearchParams(message);
        if (!params.query && !params.location && !params.skills?.length) {
          return new Response(
            JSON.stringify({
              response: "To search for jobs, please either:\n\n1. **Sign in** and share your CV, or\n2. **Provide specific details** like:\n   - \"Find software developer jobs in Amsterdam\"\n   - \"Search for marketing manager positions in London\"\n   - \"Find jobs using Python and React in Berlin\"\n\nWhat type of job are you looking for, and in what location?",
              cvUpdates: {},
              jobs: [],
              artifactType: 'jobs',
            }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }
      
      const { jobs, message: searchMessage } = await searchJobs(cvData || null, message);
      
      // Return as JSON response (not streaming) for job searches
      return new Response(
        JSON.stringify({
          response: searchMessage,
          cvUpdates: {},
          jobs: jobs,
          artifactType: 'jobs',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // ========================================
    // COVER LETTER HANDLING
    // ========================================
    if (isCoverLetterRequest(message)) {
      console.log('[Stream] Cover letter request detected...');
      
      const letterData = await generateCoverLetter(message, cvData || {});
      
      // Detect language for response
      const lowerMessage = message.toLowerCase();
      let responseLanguage: 'en' | 'nl' | 'de' | 'fr' | 'es' = 'en';
      
      if (lowerMessage.includes('motivatiebrief') || 
          lowerMessage.includes('sollicitatiebrief') ||
          lowerMessage.includes('maak') ||
          lowerMessage.includes('schrijf')) {
        responseLanguage = 'nl';
      } else if (lowerMessage.includes('anschreiben') ||
                 lowerMessage.includes('bewerbungsschreiben') ||
                 lowerMessage.includes('schreibe') ||
                 lowerMessage.includes('erstelle')) {
        responseLanguage = 'de';
      } else if (lowerMessage.includes('lettre de motivation') ||
                 lowerMessage.includes('lettre de candidature') ||
                 lowerMessage.includes('écrire') ||
                 lowerMessage.includes('rédiger')) {
        responseLanguage = 'fr';
      } else if (lowerMessage.includes('carta de motivación') ||
                 lowerMessage.includes('carta de presentación') ||
                 lowerMessage.includes('escribir') ||
                 lowerMessage.includes('redactar')) {
        responseLanguage = 'es';
      }
      
      let response: string;
      if (responseLanguage === 'nl') {
        response = `Ik heb een motivatiebrief voor je opgesteld! Je kunt deze bekijken en bewerken in het Letter tabblad. Dit heb ik gemaakt:\n\n**Opening:** ${letterData.opening}\n\n**Belangrijke punten:**\n- Je relevante ervaring benadrukt\n- Je vaardigheden gekoppeld aan de functie\n- Oprechte interesse getoond\n\n**Afsluiting:** Professionele afsluiting met je naam\n\nJe kunt het verder aanpassen in de Editor!`;
      } else if (responseLanguage === 'de') {
        response = `Ich habe ein Anschreiben für Sie erstellt! Sie können es im Letter-Tab ansehen und bearbeiten. Hier ist, was ich erstellt habe:\n\n**Anrede:** ${letterData.opening}\n\n**Wichtige Punkte:**\n- Ihre relevante Erfahrung hervorgehoben\n- Ihre Fähigkeiten mit der Position verknüpft\n- Aufrichtiges Interesse gezeigt\n\n**Abschluss:** Professioneller Abschluss mit Ihrem Namen\n\nSie können es im Editor weiter anpassen!`;
      } else if (responseLanguage === 'fr') {
        response = `J'ai rédigé une lettre de motivation pour vous ! Vous pouvez la consulter et la modifier dans l'onglet Letter. Voici ce que j'ai créé :\n\n**Salutation :** ${letterData.opening}\n\n**Points importants :**\n- Votre expérience pertinente mise en avant\n- Vos compétences liées au poste\n- Intérêt sincère exprimé\n\n**Clôture :** Clôture professionnelle avec votre nom\n\nVous pouvez la personnaliser davantage dans l'éditeur !`;
      } else if (responseLanguage === 'es') {
        response = `¡He redactado una carta de motivación para ti! Puedes verla y editarla en la pestaña Letter. Esto es lo que he creado:\n\n**Saludo:** ${letterData.opening}\n\n**Puntos importantes:**\n- Tu experiencia relevante destacada\n- Tus habilidades conectadas al puesto\n- Interés genuino expresado\n\n**Cierre:** Cierre profesional con tu nombre\n\n¡Puedes personalizarla más en el Editor!`;
      } else {
        response = `I've drafted a cover letter for you! You can view and edit it in the Letter tab. Here's what I've created:\n\n**Opening:** ${letterData.opening}\n\n**Key points covered:**\n- Highlighted your relevant experience\n- Connected your skills to the role\n- Expressed genuine interest\n\n**Closing:** Professional sign-off with your name\n\nFeel free to customize it further using the Editor!`;
      }
      
      return new Response(
        JSON.stringify({
          response,
          cvUpdates: {},
          letterUpdates: letterData,
          artifactType: 'letter',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // ========================================
    // NORMAL CV CHAT HANDLING (Streaming)
    // ========================================
    
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        // Check for API key
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY is not configured');
        }

        const llm = new ChatOpenAI({
          modelName: 'gpt-4-turbo-preview',
          temperature: 0.7,
          streaming: true,
          openAIApiKey: process.env.OPENAI_API_KEY,
          maxTokens: 2000, // Ensure enough tokens for comprehensive responses
        });

        // Add language instruction to the prompt
        const languageInstruction = `\n\nIMPORTANT: Always respond in ${responseLanguage}. All your responses, questions, and suggestions must be in ${responseLanguage}.`;
        const promptWithLanguage = CV_EXTRACTION_PROMPT + languageInstruction;
        
        const messages: BaseMessage[] = [new SystemMessage(promptWithLanguage)];

        if (conversationHistory && Array.isArray(conversationHistory)) {
          for (const msg of conversationHistory.slice(-10)) {
            if (msg.role === 'user') {
              messages.push(new HumanMessage(String(msg.content || '')));
            } else if (msg.role === 'assistant') {
              messages.push(new AIMessage(String(msg.content || '')));
            }
          }
        }

        if (cvData && Object.keys(cvData).length > 0) {
          try {
            // IMPORTANT: Sanitize CV data before sending to LLM (remove personal info)
            const sanitizedCvData = sanitizeCVDataForLLM(cvData);
            if (sanitizedCvData) {
              const cvContext = `Current CV data (professional information only):\n${JSON.stringify(sanitizedCvData, null, 2)}`;
              // Limit context size to prevent token limits
              const maxContextLength = 50000; // ~50KB
              const finalContext = cvContext.length > maxContextLength 
                ? cvContext.substring(0, maxContextLength) + '\n... (truncated)'
                : cvContext;
              messages.push(new SystemMessage(finalContext));
            }
          } catch (contextError) {
            console.error('[Stream] Error creating CV context:', contextError);
            // Continue without CV context if it fails
          }
        }

        messages.push(new HumanMessage(message));

        let fullResponse = '';

        console.log('[Stream] Calling LLM with', messages.length, 'messages');
        console.log('[Stream] Message lengths:', messages.map(m => {
          if (m instanceof SystemMessage) return `System: ${m.content.length} chars`;
          if (m instanceof HumanMessage) return `Human: ${m.content.length} chars`;
          if (m instanceof AIMessage) return `AI: ${m.content.length} chars`;
          return 'Unknown';
        }));

        let response;
        try {
          response = await llm.stream(messages);
        } catch (llmError) {
          console.error('[Stream] LLM stream error:', llmError);
          throw new Error(`LLM API error: ${llmError instanceof Error ? llmError.message : String(llmError)}`);
        }

        try {
          for await (const chunk of response) {
            const content = chunk.content as string;
            if (content) {
              fullResponse += content;
            }
          }
        } catch (streamError) {
          console.error('[Stream] Stream reading error:', streamError);
          throw new Error(`Stream reading error: ${streamError instanceof Error ? streamError.message : String(streamError)}`);
        }

        let cvUpdates = null;
        let cleanResponse = fullResponse;

        console.log('[Stream] Full LLM response length:', fullResponse.length);
        console.log('[Stream] Full LLM response preview:', fullResponse.substring(0, 200));

        try {
          // Try to extract JSON from the response (might have markdown code blocks)
          let jsonText = fullResponse.trim();
          
          // Remove markdown code blocks if present
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          
          // Try to find JSON object in the response
          const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log('[Stream] Successfully parsed JSON response');
            
            if (parsed.response) {
              cleanResponse = parsed.response;
              console.log('[Stream] Response length:', cleanResponse.length);
              // Log if response seems incomplete
              if (cleanResponse.length < 100 && cleanResponse.toLowerCase().includes('analyze')) {
                console.warn('[Stream] Response seems incomplete - might be cut off');
              }
            }
            if (parsed.cvUpdates && Object.keys(parsed.cvUpdates).length > 0) {
              cvUpdates = normalizeExtractedData(parsed.cvUpdates);
              const updateData = `data: ${JSON.stringify({ type: 'cv_update', updates: cvUpdates })}\n\n`;
              await writer.write(encoder.encode(updateData));
            }
          } else {
            console.warn('[Stream] No JSON found in response, using raw response');
            cleanResponse = fullResponse;
          }
        } catch (e) {
          console.error('[Stream] JSON parse error:', e);
          console.log('[Stream] Using raw response as fallback');
          cleanResponse = fullResponse;
        }

        const words = cleanResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
          const word = words[i] + (i < words.length - 1 ? ' ' : '');
          const tokenData = `data: ${JSON.stringify({ type: 'token', content: word })}\n\n`;
          await writer.write(encoder.encode(tokenData));
          await new Promise(resolve => setTimeout(resolve, 20));
        }

        const doneData = `data: ${JSON.stringify({ type: 'done', response: cleanResponse })}\n\n`;
        await writer.write(encoder.encode(doneData));

      } catch (error) {
        console.error('[Stream Error]', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('[Stream Error Details]', {
          message: errorMessage,
          stack: errorStack,
          cvDataSize: cvData ? JSON.stringify(cvData).length : 0,
          messageLength: message?.length || 0,
        });
        const errorData = `data: ${JSON.stringify({ 
          type: 'error', 
          message: errorMessage || 'An error occurred',
          details: process.env.NODE_ENV === 'development' ? errorStack : undefined
        })}\n\n`;
        await writer.write(encoder.encode(errorData));
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('[Stream API Error]', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Normalize extracted CV data
 */
function normalizeExtractedData(data: any): Partial<CVData> {
  const result: Partial<CVData> = {};

  if (data.fullName) result.fullName = String(data.fullName).trim();
  if (data.professionalHeadline) result.professionalHeadline = String(data.professionalHeadline).trim();
  if (data.title) result.title = String(data.title).trim();
  if (data.summary) result.summary = String(data.summary).trim();

  if (data.contact && typeof data.contact === 'object') {
    result.contact = {
      email: data.contact.email ? String(data.contact.email).trim() : undefined,
      phone: data.contact.phone ? String(data.contact.phone).trim() : undefined,
      location: data.contact.location ? String(data.contact.location).trim() : undefined,
    };
  }

  if (data.social && typeof data.social === 'object') {
    result.social = {
      linkedin: data.social.linkedin ? String(data.social.linkedin).trim() : undefined,
      github: data.social.github ? String(data.social.github).trim() : undefined,
      website: data.social.website ? String(data.social.website).trim() : undefined,
    };
  }

  if (data.experience && Array.isArray(data.experience)) {
    result.experience = data.experience.map((exp: any) => ({
      title: exp.title || exp.position || '',
      company: exp.company || exp.organization || '',
      location: exp.location || '',
      dates: exp.dates || '',
      content: Array.isArray(exp.achievements) ? exp.achievements : 
               Array.isArray(exp.content) ? exp.content : [],
    }));
  }

  if (data.education && Array.isArray(data.education)) {
    result.education = data.education.map((edu: any) => ({
      degree: edu.degree || edu.title || '',
      field: edu.field || '',
      institution: edu.institution || edu.school || edu.university || '',
      location: edu.location || '',
      dates: edu.dates || '',
    }));
  }

  if (data.skills && Array.isArray(data.skills)) {
    result.skills = data.skills.map((skill: any) => 
      typeof skill === 'string' ? skill : (skill.name || String(skill))
    );
  }
  
  if (data.technicalSkills) {
    result.technicalSkills = String(data.technicalSkills);
  }

  if (data.languages && Array.isArray(data.languages)) {
    result.languages = data.languages.map((lang: any) => {
      if (typeof lang === 'string') return lang;
      if (lang.language && lang.proficiency) return `${lang.language} (${lang.proficiency})`;
      return String(lang);
    });
  }

  if (data.hobbies && Array.isArray(data.hobbies)) {
    result.hobbies = data.hobbies.map((hobby: any) => 
      typeof hobby === 'string' ? hobby : (hobby.name || String(hobby))
    );
  }

  // Handle template changes
  if (data.template) {
    result.template = data.template;
  }

  // Handle layout/color changes
  if (data.layout) {
    result.layout = data.layout;
  }

  return result;
}
