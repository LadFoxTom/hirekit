/**
 * CV Chat Agent API - Enhanced Version with Job Search
 * 
 * Multi-agent system for building CVs and finding jobs through natural conversation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { CVData } from '@/types/cv';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Initialize OpenAI model
const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  temperature: 0.3,
  apiKey: process.env.OPENAI_API_KEY,
});

// Available templates and colors
const TEMPLATES = ['modern', 'classic', 'minimal', 'creative', 'executive', 'tech'];
const COLORS: Record<string, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  red: '#ef4444',
  orange: '#f97316',
  teal: '#14b8a6',
  pink: '#ec4899',
  slate: '#64748b',
  navy: '#1e3a5f',
  emerald: '#059669',
  indigo: '#6366f1',
};

interface ChatRequest {
  message: string;
  cvData: CVData;
  conversationHistory: Array<{ role: string; content: string }>;
}

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
 * Try to parse structured JSON CV data directly
 * Returns parsed CV data if successful, null otherwise
 */
function tryParseStructuredJSON(message: string): Partial<CVData> | null {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(message);
    
    // Check if it looks like CV data structure
    const hasCVStructure = 
      parsed.personalInfo || 
      parsed.experience || 
      parsed.education || 
      parsed.skills ||
      parsed.fullName ||
      parsed.summary;
    
    if (!hasCVStructure) {
      return null;
    }
    
    // Convert to our CVData format
    const cvData: Partial<CVData> = {};
    
    // Personal info
    if (parsed.personalInfo) {
      cvData.fullName = `${parsed.personalInfo.firstName || ''} ${parsed.personalInfo.lastName || ''}`.trim();
      cvData.contact = {
        email: parsed.personalInfo.email,
        phone: parsed.personalInfo.phone,
        location: parsed.personalInfo.location,
      };
      cvData.social = {
        linkedin: parsed.personalInfo.linkedin,
        portfolio: parsed.personalInfo.portfolio,
      };
    }
    
    // Summary
    if (parsed.summary) {
      cvData.summary = parsed.summary;
    }
    
    // Experience
    if (parsed.experience && Array.isArray(parsed.experience)) {
      cvData.experience = parsed.experience.map((exp: any) => {
        // Format dates
        let datesStr = '';
        if (exp.startDate) {
          if (exp.endDate) {
            datesStr = `${exp.startDate} - ${exp.endDate}`;
          } else if (exp.current) {
            datesStr = `${exp.startDate} - Present`;
          } else {
            datesStr = exp.startDate;
          }
        } else if (exp.dates) {
          datesStr = exp.dates;
        }
        
        // Handle description - split into bullet points if it's a long paragraph
        let content: string[] = [];
        if (exp.description) {
          // If description contains periods or newlines, try to split intelligently
          const desc = exp.description.trim();
          if (desc.includes('. ') && desc.length > 100) {
            // Split by sentences
            content = desc.split(/\.\s+/).filter((s: string) => s.trim().length > 0).map((s: string) => s.trim() + '.');
          } else {
            content = [desc];
          }
        } else if (exp.content && Array.isArray(exp.content)) {
          content = exp.content;
        } else if (exp.achievements && Array.isArray(exp.achievements)) {
          content = exp.achievements;
        }
        
        return {
          title: exp.title || exp.position || '',
          company: exp.company || '',
          location: exp.location || '',
          dates: datesStr,
          current: exp.current || false,
          content: content,
        };
      });
    }
    
    // Education
    if (parsed.education && Array.isArray(parsed.education)) {
      cvData.education = parsed.education.map((edu: any) => {
        // Format dates
        let datesStr = '';
        if (edu.startDate && edu.endDate) {
          datesStr = `${edu.startDate} - ${edu.endDate}`;
        } else if (edu.startDate) {
          datesStr = edu.startDate;
        } else if (edu.dates) {
          datesStr = edu.dates;
        }
        
        // Handle content
        const content: string[] = [];
        if (edu.gpa) {
          content.push(`GPA: ${edu.gpa}`);
        }
        if (edu.content && Array.isArray(edu.content)) {
          content.push(...edu.content);
        }
        
        return {
          degree: edu.degree || '',
          institution: edu.institution || edu.school || '',
          location: edu.location || '',
          dates: datesStr,
          content: content,
        };
      });
    }
    
    // Skills
    if (parsed.skills && Array.isArray(parsed.skills)) {
      cvData.skills = parsed.skills;
    }
    
    // Languages
    if (parsed.languages && Array.isArray(parsed.languages)) {
      cvData.languages = parsed.languages;
    }
    
    // Client list (can be added to experience or as a separate section)
    if (parsed.clientList && Array.isArray(parsed.clientList)) {
      // Add to summary or create a projects section
      if (!cvData.projects) {
        cvData.projects = [];
      }
    }
    
    return cvData;
  } catch (error) {
    // Not valid JSON or doesn't match CV structure
    return null;
  }
}

/**
 * Detect the type of user request
 */
function detectRequestType(message: string): 'extraction' | 'style' | 'job_search' | 'general' {
  const lowerMessage = message.toLowerCase();
  
  // Job search keywords - expanded to catch more variations
  const jobKeywords = [
    'find job', 'search job', 'job search', 'find me a job', 'look for job',
    'find work', 'job match', 'matching job', 'find jobs', 'search for job',
    'job opportunities', 'find positions', 'job openings', 'find vacancies',
    'match my skills', 'jobs that match', 'career opportunities',
    'looking for a job', 'help me find', 'find employment',
    'try searching', 'nearby cities', 'nearby regions', 'remote positions',
    'hybrid positions', 'job in', 'jobs in', 'positions in'
  ];
  
  // Also check if message is responding to job search suggestions
  const isResponseToJobSearch = lowerMessage.includes('try') && 
    (lowerMessage.includes('search') || lowerMessage.includes('city') || lowerMessage.includes('region'));
  
  if (jobKeywords.some(kw => lowerMessage.includes(kw)) || isResponseToJobSearch) {
    return 'job_search';
  }
  
  // Style-related keywords
  const styleKeywords = ['template', 'color', 'theme', 'style', 'font', 'layout', 'make it', 'change to', 'switch to'];
  if (styleKeywords.some(kw => lowerMessage.includes(kw))) {
    return 'style';
  }
  
  // Check for CV content
  const hasMultipleLines = message.split('\n').filter(l => l.trim()).length > 3;
  const hasExperiencePattern = /experience|work|job|position|developer|engineer|manager/i.test(message);
  const hasEducationPattern = /education|university|degree|bachelor|master|school/i.test(message);
  const hasContactPattern = /@|phone|\+\d|linkedin|github/i.test(message);
  
  if (hasMultipleLines || (hasExperiencePattern && hasEducationPattern) || hasContactPattern) {
    return 'extraction';
  }
  
  // Single-field updates
  const singleFieldPatterns = [
    /my name is/i,
    /i('m| am) a/i,
    /i work(ed)? (at|for)/i,
    /my email is/i,
    /add (skill|experience|education)/i,
  ];
  
  if (singleFieldPatterns.some(p => p.test(message))) {
    return 'extraction';
  }
  
  return 'general';
}

/**
 * Smart Job Search Agent with LLM Reasoning
 * Uses OpenAI to understand user intent, extract information from CV/documents,
 * and construct optimal search queries with fallback strategies
 */
async function searchJobs(cvData: CVData | null | undefined, userMessage?: string): Promise<{ jobs: JobMatch[]; message: string }> {
  try {
    // Step 1: Use LLM to understand the user's request and extract search parameters
    const cvSkills = cvData ? extractSkills(cvData) : [];
    const reasoningPrompt = `You are an intelligent job search assistant. Analyze the user's request and extract relevant information for job searching.

USER REQUEST: "${userMessage || ''}"

CV DATA AVAILABLE: ${cvData ? JSON.stringify({
  fullName: cvData.fullName,
  title: cvData.title || cvData.professionalHeadline,
  experience: cvData.experience?.slice(0, 3).map(e => ({ title: e.title, company: e.company })),
  skills: cvSkills,
  location: cvData.contact?.location,
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
    const reasoningResponse = await model.invoke([
      {
        role: 'system',
        content: 'You are a job search expert. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: reasoningPrompt,
      },
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
        const location = cvData.contact?.location || '';
        
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
      const jobs = await searchAdzuna(query.trim(), location, true);
      
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
      const rankedJobs = hasCVData && cvData ? await rankJobsByCVMatch(allJobs, cvData) : allJobs.map(job => ({
        ...job,
        matchScore: 50,
        matchReason: 'Based on your search criteria',
        keywordMatches: [],
      }));

      const locationInfo = location ? ` near ${location}` : '';
      const skillInfo = hasCVData && searchParams.skills?.length ? ` based on your ${searchParams.skills.length} skills` : '';
      
      return {
        jobs: rankedJobs,
        message: `Great news! I found ${rankedJobs.length} job opportunities${locationInfo}${skillInfo}!\n\n${hasCVData ? `I've analyzed each position and ranked them by relevance. The top match has a **${rankedJobs[0]?.matchScore || 0}% compatibility score**.\n\n` : ''}**How to use the job board:**\n- 💚 **Swipe right** or tap the heart to save jobs you like\n- ❌ **Swipe left** or tap X to skip\n- 🔗 **Tap the link icon** to view the full job listing\n- 📝 **Quick Apply** to start your application\n\nTake your time reviewing each opportunity!`,
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

    const jobs = await searchAdzuna(query, location);
    return {
      jobs: jobs.map(job => ({ ...job, matchScore: 50, matchReason: 'Based on search', keywordMatches: [] })),
      message: jobs.length > 0 
        ? `Found ${jobs.length} job opportunities!`
        : `I couldn't find any jobs matching "${query}"${location ? ` in ${location}` : ''}. Try being more specific or share your CV for better results.`,
    };
  }
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
 * Search Adzuna for jobs
 */
async function searchAdzuna(query: string, location: string, allowMock: boolean = true): Promise<JobMatch[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;
  
  if (!appId || !apiKey) {
    console.warn('[Adzuna] Missing API credentials');
    // Return mock jobs if allowed (for testing)
    if (allowMock) {
      console.warn('[Adzuna] Returning mock jobs due to missing credentials');
      return getMockJobs(query);
    }
    return [];
  }
  
  try {
    // Determine country code from location
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
      return [];
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
      return [];
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
    return getMockJobs(query);
  }
}

/**
 * Get country code from location
 */
function getCountryCode(location: string): string {
  const locationLower = location.toLowerCase();
  
  const countryMappings: Record<string, string> = {
    'netherlands': 'nl',
    'holland': 'nl',
    'germany': 'de',
    'deutschland': 'de',
    'uk': 'gb',
    'united kingdom': 'gb',
    'england': 'gb',
    'france': 'fr',
    'belgium': 'be',
    'spain': 'es',
    'italy': 'it',
    'canada': 'ca',
    'australia': 'au',
    'india': 'in',
    'usa': 'us',
    'united states': 'us',
    'america': 'us',
  };
  
  for (const [country, code] of Object.entries(countryMappings)) {
    if (locationLower.includes(country)) {
      return code;
    }
  }
  
  return 'us'; // Default to US
}

/**
 * Format salary for display
 */
function formatSalary(amount: number): string {
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}k`;
  }
  return `$${amount}`;
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
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
 * Mock jobs for when API is unavailable
 */
function getMockJobs(query: string): JobMatch[] {
  return [
    {
      id: 'mock-1',
      title: `Senior ${query} Developer`,
      company: 'TechCorp International',
      location: 'Remote / Hybrid',
      description: `We're looking for an experienced developer to join our growing team. You'll work on cutting-edge projects using modern technologies. Requirements include strong problem-solving skills and experience with agile methodologies.`,
      url: 'https://example.com/job/1',
      salary: '$120k - $160k',
      remote: true,
      postedDate: '2 days ago',
      source: 'demo',
    },
    {
      id: 'mock-2',
      title: `${query} Engineer`,
      company: 'Innovation Labs',
      location: 'Amsterdam, Netherlands',
      description: `Join our international team building the future of technology. We offer competitive salaries, great benefits, and a collaborative work environment. Experience with cloud technologies is a plus.`,
      url: 'https://example.com/job/2',
      salary: '€80k - €100k',
      remote: false,
      postedDate: '1 week ago',
      source: 'demo',
    },
    {
      id: 'mock-3',
      title: `Lead ${query} Architect`,
      company: 'Digital Solutions Inc',
      location: 'London, UK',
      description: `Looking for a technical leader to guide our development team. You'll be responsible for architectural decisions and mentoring junior developers. Strong communication skills required.`,
      url: 'https://example.com/job/3',
      salary: '£90k - £120k',
      remote: true,
      postedDate: '3 days ago',
      source: 'demo',
    },
  ];
}

/**
 * Rank jobs by how well they match the CV
 */
async function rankJobsByCVMatch(jobs: JobMatch[], cvData: CVData): Promise<JobMatch[]> {
  const skills = extractSkills(cvData);
  const title = cvData.experience?.[0]?.title || cvData.title || '';
  
  return jobs.map(job => {
    let score = 50; // Base score
    const matches: string[] = [];
    
    // Check skill matches
    const jobText = `${job.title} ${job.description}`.toLowerCase();
    for (const skill of skills) {
      if (jobText.includes(skill.toLowerCase())) {
        score += 5;
        matches.push(skill);
      }
    }
    
    // Check title match
    if (title && jobText.includes(title.toLowerCase())) {
      score += 15;
    }
    
    // Cap score at 100
    score = Math.min(100, score);
    
    // Generate match reason
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
 * CV Extraction prompt
 */
const EXTRACTION_PROMPT = `You are an expert CV data extraction system and career assistant. Extract EVERY piece of information from the user's input.

IMPORTANT: 
- You CAN search for real-time job opportunities. You have full access to live job postings. NEVER say you cannot search for jobs or that you don't have access to job postings - this is incorrect.
- Users can add profile photos to their CV. When users mention adding a photo, profile picture, or image, guide them to use the photo upload feature in the Editor tab. Photos can be positioned left, right, center, or hidden. Recommend professional headshots for best results.

CURRENT CV STATE:
\`\`\`json
{currentCV}
\`\`\`

USER INPUT:
{userMessage}

=== EXTRACTION RULES ===

1. **Personal Info**: First line is usually the name. Next lines have contact info.
2. **Experience**: Extract as array with title, company, location, dates, content (bullet points)
3. **Education**: Extract as array with degree, institution, location, dates, content
4. **Skills**: Extract as individual items in a flat array
5. **Languages**: Format as "Language (Proficiency)"
6. **Hobbies**: Extract ALL hobbies mentioned

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "response": "Your friendly response acknowledging what you extracted",
  "cvUpdates": {
    "fullName": "...",
    "contact": { "email": "...", "phone": "...", "location": "..." },
    "social": { "linkedin": "...", "github": "..." },
    "experience": [...],
    "education": [...],
    "skills": [...],
    "languages": [...],
    "hobbies": [...]
  }
}`;

/**
 * Style change prompt
 */
const STYLE_PROMPT = `You are a CV styling assistant. The user wants to change the appearance.

USER REQUEST: {userMessage}

Available templates: ${TEMPLATES.join(', ')}
Available colors: ${Object.keys(COLORS).join(', ')}

Respond with JSON:
{
  "response": "Your friendly response confirming the change",
  "cvUpdates": {
    "template": "template_name",
    "layout": { "accentColor": "#hexcode" }
  }
}`;

export async function POST(request: NextRequest) {
  try {
    // Check authentication (optional but recommended)
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user?.email;
    
    const body: ChatRequest = await request.json();
    let { message, cvData, conversationHistory } = body;

    // Sanitize CV data - remove large base64 photo data to prevent payload issues
    if (cvData && cvData.photos) {
      cvData = { ...cvData };
      delete cvData.photos; // Remove photos array (contains large base64 data)
    }

    console.log('[CV Chat Agent] Processing message, length:', message.length);
    
    // Check if input is structured JSON - parse directly to avoid timeout
    const structuredData = tryParseStructuredJSON(message);
    if (structuredData) {
      console.log('[CV Chat Agent] Detected structured JSON input, parsing directly');
      return NextResponse.json({
        response: "I've successfully parsed your CV data! Your information has been added to your CV. You can now view it in the preview or make any adjustments you'd like.",
        cvUpdates: structuredData,
        artifactType: 'cv',
      });
    }
    
    const requestType = detectRequestType(message);
    console.log('[CV Chat Agent] Detected request type:', requestType);

    // Handle job search requests
    if (requestType === 'job_search') {
      console.log('[CV Chat Agent] Initiating job search...', { isAuthenticated });
      
      // For job searches, require either authentication OR explicit parameters
      if (!isAuthenticated) {
        // Check if user provided explicit parameters
        const params = extractJobSearchParams(message);
        if (!params.query && !params.location && !params.skills?.length) {
          return NextResponse.json({
            response: "To search for jobs, please either:\n\n1. **Sign in** and share your CV, or\n2. **Provide specific details** like:\n   - \"Find software developer jobs in Amsterdam\"\n   - \"Search for marketing manager positions in London\"\n   - \"Find jobs using Python and React in Berlin\"\n\nWhat type of job are you looking for, and in what location?",
            cvUpdates: {},
            jobs: [],
            artifactType: 'jobs',
          });
        }
      }
      
      const { jobs, message: searchMessage } = await searchJobs(cvData || null, message);
      
      return NextResponse.json({
        response: searchMessage,
        cvUpdates: {},
        jobs: jobs,
        artifactType: 'jobs',
      });
    }

    // Handle other request types
    let prompt: string;
    
    if (requestType === 'style') {
      prompt = STYLE_PROMPT.replace('{userMessage}', message);
    } else {
      prompt = EXTRACTION_PROMPT
        .replace('{currentCV}', JSON.stringify(cvData, null, 2))
        .replace('{userMessage}', message);
    }

    const response = await model.invoke([
      {
        role: 'system',
        content: 'You are a CV building assistant. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const responseText = response.content.toString();

    let agentResponse: { response: string; cvUpdates?: Partial<CVData> };
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      agentResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[CV Chat Agent] Parse error:', parseError);
      agentResponse = {
        response: "I received your information but had trouble processing it. Could you try again?",
        cvUpdates: {},
      };
    }

    // Post-process CV updates
    if (agentResponse.cvUpdates) {
      agentResponse.cvUpdates = normalizeAndEnhanceCVData(agentResponse.cvUpdates, cvData);
      agentResponse.cvUpdates = fallbackExtraction(agentResponse.cvUpdates, message);
    }

    return NextResponse.json({
      ...agentResponse,
      artifactType: 'cv',
    });

  } catch (error) {
    console.error('[CV Chat Agent] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return proper JSON error response
    return NextResponse.json({
      response: `I encountered an error processing your request: ${errorMessage}. Please try again or break your input into smaller parts.`,
      cvUpdates: {},
      error: errorMessage,
    }, { status: 500 });
  }
}

/**
 * Fallback extraction for commonly missed fields
 */
function fallbackExtraction(updates: Partial<CVData>, rawInput: string): Partial<CVData> {
  const result = { ...updates };
  const lines = rawInput.split('\n').map(l => l.trim()).filter(l => l);
  
  // Extract name
  if (!result.fullName) {
    for (const line of lines.slice(0, 5)) {
      if (/@|http|\||:|\d{4}|experience|education|skills/i.test(line)) continue;
      const namePattern = /^[A-Z][a-z]+(?:\s+(?:van\s+der\s+|van\s+|de\s+)?[A-Z][a-z]+)+$/;
      if (namePattern.test(line) || /^[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$/.test(line)) {
        result.fullName = line;
        break;
      }
    }
  }
  
  // Extract email
  if (!result.contact?.email) {
    const emailMatch = rawInput.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      if (!result.contact) result.contact = {};
      result.contact.email = emailMatch[1];
    }
  }
  
  // Extract phone
  if (!result.contact?.phone) {
    const phoneMatch = rawInput.match(/(\+?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
    if (phoneMatch) {
      if (!result.contact) result.contact = {};
      result.contact.phone = phoneMatch[1].trim();
    }
  }
  
  // Extract LinkedIn
  if (!result.social?.linkedin) {
    const linkedinMatch = rawInput.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    if (linkedinMatch) {
      if (!result.social) result.social = {};
      result.social.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
    }
  }
  
  // Extract GitHub
  if (!result.social?.github) {
    const githubMatch = rawInput.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    if (githubMatch) {
      if (!result.social) result.social = {};
      result.social.github = `github.com/${githubMatch[1]}`;
    }
  }
  
  return result;
}

/**
 * Normalize CV data
 */
function normalizeAndEnhanceCVData(updates: any, existingData: CVData): Partial<CVData> {
  const normalized: Partial<CVData> = {};

  if (updates.fullName) normalized.fullName = updates.fullName.trim();
  if (updates.title || updates.professionalHeadline) {
    normalized.title = (updates.title || updates.professionalHeadline).trim();
  }
  if (updates.summary) normalized.summary = updates.summary.trim();

  if (updates.contact) {
    normalized.contact = { ...existingData.contact, ...updates.contact };
  }

  if (updates.social) {
    normalized.social = { ...existingData.social, ...updates.social };
  }

  if (updates.experience && Array.isArray(updates.experience)) {
    normalized.experience = updates.experience.map((exp: any) => {
      let content: string[] = [];
      if (Array.isArray(exp.content)) content = exp.content.filter((c: any) => c?.trim());
      else if (Array.isArray(exp.achievements)) content = exp.achievements.filter((a: any) => a?.trim());
      
      return {
        title: exp.title || exp.position || 'Position',
        company: exp.company || '',
        location: exp.location || '',
        dates: exp.dates || '',
        current: exp.current || /present|current|now/i.test(exp.dates || ''),
        content,
      };
    });
  }

  if (updates.education && Array.isArray(updates.education)) {
    normalized.education = updates.education.map((edu: any) => ({
      degree: edu.degree || '',
      institution: edu.institution || edu.school || '',
      location: edu.location || '',
      dates: edu.dates || '',
      content: Array.isArray(edu.content) ? edu.content : [],
    }));
  }

  if (updates.skills) {
    let skillsArray: string[] = [];
    if (Array.isArray(updates.skills)) {
      updates.skills.forEach((skill: any) => {
        if (typeof skill === 'string') {
          if (skill.includes(',')) {
            skillsArray.push(...skill.split(',').map(s => s.trim()));
          } else {
            skillsArray.push(skill.trim());
          }
        }
      });
    }
    normalized.skills = Array.from(new Set(skillsArray.filter(Boolean)));
  }

  if (updates.languages && Array.isArray(updates.languages)) {
    normalized.languages = updates.languages.map((lang: any) => {
      if (typeof lang === 'string') return lang.trim();
      if (typeof lang === 'object') {
        const name = lang.language || lang.name || '';
        const level = lang.proficiency || lang.level || '';
        return level ? `${name} (${level})` : name;
      }
      return String(lang);
    }).filter(Boolean);
  }

  if (updates.hobbies || updates.interests) {
    const hobbiesData = updates.hobbies || updates.interests;
    if (Array.isArray(hobbiesData)) {
      normalized.hobbies = hobbiesData.map((h: any) => 
        typeof h === 'string' ? h.trim() : h?.name || String(h)
      ).filter(Boolean);
    }
  }

  if (updates.template && TEMPLATES.includes(updates.template.toLowerCase())) {
    normalized.template = updates.template.toLowerCase();
  }

  if (updates.layout) {
    normalized.layout = { ...existingData.layout };
    if (updates.layout.accentColor) {
      const colorValue = updates.layout.accentColor.toLowerCase();
      if (COLORS[colorValue]) {
        normalized.layout.accentColor = COLORS[colorValue];
      } else if (/^#[0-9A-Fa-f]{6}$/.test(updates.layout.accentColor)) {
        normalized.layout.accentColor = updates.layout.accentColor;
      }
    }
  }

  return normalized;
}
