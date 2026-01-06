/**
 * Job Matcher Agent
 * 
 * Finds relevant job opportunities from external job boards,
 * uses LLM to rank jobs by fit to user's CV, and stores matches in database.
 */

import { ChatOpenAI } from "@langchain/openai";
import { CareerServiceStateType } from "../state/agent-state";
import { JobRankingsSchema, safeParse } from "../state/schemas";
import { aggregateJobSearch, getAvailableSources } from "../services/job-search-aggregator";
import { toJobMatchResult, truncateDescription } from "../services/job-normalizer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
  temperature: 0.5, // Moderate temperature for balanced ranking
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extract search query from CV data
 * Handles various CV data formats and extracts the most relevant job title/skills
 */
function generateSearchQuery(cvData: any): { query: string; location: string } {
  let query = "";
  let location = "";

  console.log("[Job Matcher] Extracting search query from CV data...");

  // 1. Try to get job title from the 'title' field (e.g., "Senior Software Engineer")
  if (cvData.title && !cvData.title.includes(' at ')) {
    query = cvData.title;
    console.log(`[Job Matcher] Using CV title: "${query}"`);
  }

  // 2. Try to extract job title from professional headline
  if (!query && cvData.professionalHeadline) {
    query = cvData.professionalHeadline;
    console.log(`[Job Matcher] Using professional headline: "${query}"`);
  }

  // 3. Try to get from experience array
  if (!query && cvData.experience && Array.isArray(cvData.experience) && cvData.experience.length > 0) {
    const recent = cvData.experience[0];
    
    // Handle format: "Senior Software Engineer at TechCorp (2020-Present)"
    if (recent.title && typeof recent.title === 'string') {
      // Extract job title before " at " or before first "("
      let titlePart = recent.title.split(' at ')[0].trim();
      if (!titlePart) titlePart = recent.title.split('(')[0].trim();
      if (titlePart) {
        query = titlePart;
        console.log(`[Job Matcher] Extracted from experience title: "${query}"`);
      }
    }
    
    // Try 'position' field
    if (!query && recent.position) {
      query = recent.position;
      console.log(`[Job Matcher] Using position field: "${query}"`);
    }
  }

  // 4. Fallback to skills array
  if (!query && cvData.skills && Array.isArray(cvData.skills) && cvData.skills.length > 0) {
    // Use top 2-3 skills as search query
    query = cvData.skills.slice(0, 3).join(' ');
    console.log(`[Job Matcher] Using skills as query: "${query}"`);
  }

  // 5. Fallback to technicalSkills string
  if (!query && cvData.technicalSkills) {
    const skills = cvData.technicalSkills.split(',').slice(0, 3).map((s: string) => s.trim()).join(' ');
    query = skills;
    console.log(`[Job Matcher] Using technicalSkills: "${query}"`);
  }

  // 6. Final fallback - use a generic tech query if skills suggest it
  if (!query) {
    query = "software developer";
    console.log(`[Job Matcher] Using fallback query: "${query}"`);
  }

  // Extract location
  if (cvData.contact?.location) {
    location = cvData.contact.location;
  } else if (cvData.personalInfo?.location) {
    location = cvData.personalInfo.location;
  }

  console.log(`[Job Matcher] Final search - Query: "${query}", Location: "${location || 'any'}"`);
  return { query, location };
}

/**
 * Create job ranking prompt for LLM
 */
function createRankingPrompt(cvData: any, jobs: any[]): string {
  // Truncate CV data for token efficiency
  const cvSummary = {
    experience: cvData.experience?.slice(0, 3), // Top 3 positions
    skills: cvData.technicalSkills,
    education: cvData.education?.[0], // Highest degree
    professionalHeadline: cvData.professionalHeadline,
  };

  return `You are an expert career advisor specializing in job matching.

CANDIDATE PROFILE:
${JSON.stringify(cvSummary, null, 2)}

JOB OPPORTUNITIES (use the "id" field exactly as provided in your response):
${JSON.stringify(jobs.map((job, idx) => ({
  id: job.id, // IMPORTANT: Use this exact ID in your response
  title: job.title,
  company: job.company,
  description: truncateDescription(job.description, 1500), // Limit description length
  location: job.location,
  remote: job.remote,
})), null, 2)}

TASK: Rank each job by how well it matches the candidate's profile. Consider:
1. **Skills Match (50%)**: Required skills alignment with candidate's technical skills
2. **Experience Match (30%)**: Seniority level and domain experience alignment
3. **Other Factors (20%)**: Location preference, remote work, career progression

OUTPUT FORMAT (valid JSON only):
{
  "rankings": [
    {
      "jobId": "<job.id>",
      "score": <number 0-100>,
      "reason": "<specific explanation of match quality>",
      "keywords": ["<matching skill/keyword>", "<matching skill/keyword>", ...]
    },
    ...
  ]
}

SCORING GUIDELINES:
- 90-100: Excellent match - candidate meets all key requirements
- 75-89: Strong match - candidate meets most requirements
- 60-74: Good match - candidate meets core requirements
- 40-59: Moderate match - some skills overlap but gaps exist
- 0-39: Weak match - significant gaps in requirements

IMPORTANT:
- Be honest about mismatches
- Identify transferable skills
- Flag overqualified or underqualified situations
- Focus on relevant technical skills
- Return ONLY valid JSON`;
}

/**
 * Job Matcher Agent
 * 
 * @param state - Current workflow state
 * @returns Updated state with job matches
 */
export async function jobMatcherAgent(
  state: CareerServiceStateType
): Promise<Partial<CareerServiceStateType>> {
  console.log("[Job Matcher] Starting job search");

  try {
    // Check available sources
    const availableSources = getAvailableSources();
    console.log(`[Job Matcher] Available job sources: ${availableSources.join(', ')}`);

    // Validate CV data
    if (!state.cvData) {
      return {
        error: "No CV data provided",
        messages: [{
          role: "assistant",
          content: "I need your CV data to find relevant job opportunities. Please select or upload a CV first.",
          timestamp: new Date(),
        }],
        nextAction: "wait_for_user",
      };
    }

    // Generate search query from CV
    const { query, location } = generateSearchQuery(state.cvData);
    console.log(`[Job Matcher] Searching for: "${query}" in "${location || 'any location'}"`);

    // Search for jobs using aggregator (multiple sources)
    const searchResults = await aggregateJobSearch({
      query,
      location: location || undefined,
      maxResults: 30,
      sources: availableSources,
      includeMockFallback: true, // Fallback for testing
    });

    if (searchResults.jobs.length === 0) {
      return {
        jobMatches: [],
        messages: [{
          role: "assistant",
          content: `I couldn't find any job listings matching "${query}". Try:\n- Being more general with job titles\n- Expanding your location preferences\n- Checking your search criteria`,
          timestamp: new Date(),
        }],
        nextAction: "wait_for_user",
      };
    }

    console.log(`[Job Matcher] Found ${searchResults.jobs.length} jobs from ${searchResults.sources.join(', ')}, ranking by fit...`);

    // Jobs are already normalized by the aggregator
    const normalizedJobs = searchResults.jobs;

    // Use LLM to rank jobs by fit
    const rankingPrompt = createRankingPrompt(state.cvData, normalizedJobs);
    const response = await model.invoke([
      {
        role: "system",
        content: "You are a job matching expert. Always respond with valid JSON matching the requested format.",
      },
      {
        role: "user",
        content: rankingPrompt,
      },
    ]);

    const responseText = response.content.toString();
    console.log("[Job Matcher] Received rankings from GPT-4");

    // Parse rankings
    let rankingsData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      rankingsData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[Job Matcher] JSON parsing failed:", parseError);
      throw new Error("Failed to parse job rankings");
    }

    // Validate with Zod
    const parseResult = safeParse(JobRankingsSchema, rankingsData);
    if (!parseResult.success) {
      console.error("[Job Matcher] Validation failed:", parseResult.error);
      throw new Error(`Invalid rankings format: ${parseResult.error}`);
    }

    const rankings = parseResult.data.rankings;
    console.log(`[Job Matcher] Got ${rankings.length} rankings from LLM`);

    // Combine jobs with rankings - handle ID format mismatches
    const jobMatches = normalizedJobs
      .map((job, index) => {
        // Try multiple ID matching strategies
        let ranking = rankings.find(r => r.jobId === job.id);
        
        // Try without prefix (LLM might return "123" instead of "adzuna-123" or "remoteok-123")
        if (!ranking) {
          const bareId = job.id.replace(/^(adzuna|remoteok|arbeitnow|mock)-/, '');
          ranking = rankings.find(r => r.jobId === bareId);
        }
        
        // Try matching by index (LLM might return index as ID)
        if (!ranking) {
          ranking = rankings.find(r => r.jobId === String(index));
        }

        if (!ranking) {
          console.log(`[Job Matcher] No ranking found for job: ${job.id}`);
          return null;
        }

        return toJobMatchResult(
          job,
          ranking.score,
          ranking.reason,
          ranking.keywords
        );
      })
      .filter(job => job !== null)
      .sort((a, b) => b!.matchScore - a!.matchScore) // Sort by score descending
      .slice(0, 15) as any[]; // Keep top 15 matches

    console.log(`[Job Matcher] Final matched jobs: ${jobMatches.length}`);

    // Save to database if user and CV IDs available
    if (state.userId && state.cvId && jobMatches.length > 0) {
      try {
        // Calculate expiration date (30 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await Promise.all(
          jobMatches.map(job =>
            prisma.jobMatch.upsert({
              where: {
                userId_sourceJobId: {
                  userId: state.userId!,
                  sourceJobId: job.id.replace(/^(adzuna|remoteok|arbeitnow|mock)-/, ''),
                },
              },
              update: {
                matchScore: job.matchScore,
                matchReason: job.matchReason,
                keywordMatches: JSON.stringify(job.keywordMatches),
              },
              create: {
                userId: state.userId!,
                cvId: state.cvId!,
                jobTitle: job.title,
                companyName: job.company,
                jobUrl: job.url,
                jobDescription: job.description,
                salary: job.salary,
                location: job.location,
                remote: job.remote,
                postedDate: job.postedDate,
                matchScore: job.matchScore,
                matchReason: job.matchReason,
                keywordMatches: JSON.stringify(job.keywordMatches),
                source: job.source,
                sourceJobId: job.id.replace(/^(adzuna|remoteok|arbeitnow|mock)-/, ''),
                expiresAt,
              },
            })
          )
        );
        console.log(`[Job Matcher] Saved ${jobMatches.length} job matches to database`);
      } catch (dbError) {
        console.error("[Job Matcher] Failed to save job matches:", dbError);
        // Don't fail the whole operation
      }
    }

    // Generate user message
    const message = generateJobMatchMessage(jobMatches);

    return {
      jobMatches,
      messages: [{
        role: "assistant",
        content: message,
        timestamp: new Date(),
      }],
      nextAction: "wait_for_user",
      error: null,
    };

  } catch (error) {
    console.error("[Job Matcher] Error during job matching:", error);

    return {
      error: error instanceof Error ? error.message : "Unknown error during job matching",
      messages: [{
        role: "assistant",
        content: "I encountered an error while searching for jobs. Please try again or contact support if the problem persists.",
        timestamp: new Date(),
      }],
      nextAction: "error",
    };
  }
}

/**
 * Generate user-friendly message with job matches
 */
function generateJobMatchMessage(matches: any[]): string {
  if (matches.length === 0) {
    return "I couldn't find any suitable job matches at this time. Try adjusting your search criteria or check back later.";
  }

  // Group jobs by category
  const localJobs = matches.filter(j => j.searchCategory === 'local');
  const regionalJobs = matches.filter(j => j.searchCategory === 'regional');
  const remoteJobs = matches.filter(j => j.searchCategory === 'remote' || j.remote);
  
  let message = `## 🎯 Found ${matches.length} Job Matches\n\n`;
  
  // Show breakdown by category
  const breakdown: string[] = [];
  if (localJobs.length > 0) breakdown.push(`🏢 ${localJobs.length} local`);
  if (regionalJobs.length > 0) breakdown.push(`🌍 ${regionalJobs.length} regional`);
  if (remoteJobs.length > 0) breakdown.push(`🏠 ${remoteJobs.length} remote`);
  
  if (breakdown.length > 0) {
    message += `**Job Types:** ${breakdown.join(' • ')}\n\n`;
  }

  message += `Here are the top opportunities ranked by fit:\n\n`;

  // Show top 5 matches in detail
  matches.slice(0, 5).forEach((job, idx) => {
    const categoryEmoji = getCategoryEmoji(job);
    message += `### ${idx + 1}. ${categoryEmoji} ${job.title} at ${job.company}\n`;
    message += `**Match Score:** ${job.matchScore}/100 ${getMatchEmoji(job.matchScore)}\n`;
    message += `**Location:** ${job.location}${job.remote ? ' 🏠 Remote' : ''}\n`;
    if (job.salary) {
      message += `**Salary:** ${job.salary}\n`;
    }
    message += `**Why it matches:** ${job.matchReason}\n`;
    message += `**Key Skills:** ${job.keywordMatches.slice(0, 5).join(', ')}\n`;
    message += `[View Job →](${job.url})\n\n`;
  });

  if (matches.length > 5) {
    message += `*...and ${matches.length - 5} more matches*\n\n`;
  }

  message += `### 💡 Next Steps\n`;
  message += `- Click on jobs to view full details\n`;
  message += `- Say "track application for [company]" to track your application\n`;
  message += `- Say "generate cover letter for [company]" for a tailored letter\n`;

  return message;
}

/**
 * Get emoji based on job category
 */
function getCategoryEmoji(job: any): string {
  if (job.searchCategory === 'local') return '🏢';
  if (job.searchCategory === 'regional') return '🌍';
  if (job.remote || job.searchCategory === 'remote') return '🏠';
  return '💼';
}

/**
 * Get emoji based on match score
 */
function getMatchEmoji(score: number): string {
  if (score >= 80) return "🌟";
  if (score >= 60) return "⭐";
  return "✨";
}

export default jobMatcherAgent;



