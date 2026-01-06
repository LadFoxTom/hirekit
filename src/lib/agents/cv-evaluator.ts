/**
 * CV Evaluator Agent
 * 
 * Analyzes CV quality using GPT-4, provides scores, identifies strengths/weaknesses,
 * and offers specific actionable suggestions for improvement.
 */

import { ChatOpenAI } from "@langchain/openai";
import { CareerServiceStateType } from "../state/agent-state";
import { CVAnalysisSchema, safeParse } from "../state/schemas";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Initialize OpenAI model for CV analysis
 * Using GPT-4 Turbo for higher quality reasoning
 */
const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
  temperature: 0.3, // Lower temperature for consistent analytical output
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Format CV data for LLM analysis - extract key information in readable format
 */
function formatCVForAnalysis(cvData: any): string {
  const sections: string[] = [];

  // Personal Info
  if (cvData.fullName || cvData.personalInfo) {
    sections.push(`## Personal Information
- Name: ${cvData.fullName || cvData.personalInfo?.fullName || 'Not provided'}
- Email: ${cvData.personalInfo?.email || cvData.email || 'Not provided'}
- Phone: ${cvData.personalInfo?.phone || cvData.phone || 'Not provided'}
- Location: ${cvData.personalInfo?.location || cvData.location || 'Not provided'}
- LinkedIn: ${cvData.personalInfo?.linkedin || 'Not provided'}
- Professional Headline: ${cvData.professionalHeadline || 'Not provided'}`);
  }

  // Summary/Objective
  if (cvData.summary || cvData.objective || cvData.careerObjective) {
    sections.push(`## Professional Summary
${cvData.summary || cvData.objective || cvData.careerObjective}`);
  }

  // Experience
  if (cvData.experience?.length > 0) {
    const expSection = ['## Work Experience'];
    cvData.experience.forEach((exp: any, i: number) => {
      expSection.push(`
### ${i + 1}. ${exp.title || exp.position || 'Position'} at ${exp.company || 'Company'}
- Duration: ${exp.startDate || 'Start'} - ${exp.endDate || exp.current ? 'Present' : 'End'}
- Location: ${exp.location || 'Not specified'}
- Description: ${exp.description || 'No description'}
- Achievements: ${Array.isArray(exp.achievements) ? exp.achievements.join(', ') : (exp.content?.join(', ') || 'None listed')}`);
    });
    sections.push(expSection.join('\n'));
  }

  // Education
  if (cvData.education?.length > 0) {
    const eduSection = ['## Education'];
    cvData.education.forEach((edu: any, i: number) => {
      eduSection.push(`
### ${i + 1}. ${edu.degree || edu.field || 'Degree'} - ${edu.institution || edu.school || 'Institution'}
- Year: ${edu.year || edu.graduationYear || 'Not specified'}
- GPA: ${edu.gpa || 'Not specified'}`);
    });
    sections.push(eduSection.join('\n'));
  }

  // Skills
  if (cvData.skills?.length > 0 || cvData.technicalSkills || cvData.softSkills) {
    const skillsList = [];
    if (Array.isArray(cvData.skills)) skillsList.push(...cvData.skills);
    if (cvData.technicalSkills) skillsList.push(`Technical: ${cvData.technicalSkills}`);
    if (cvData.softSkills) skillsList.push(`Soft Skills: ${cvData.softSkills}`);
    sections.push(`## Skills
${skillsList.join(', ') || 'None listed'}`);
  }

  // Certifications
  if (cvData.certifications) {
    const certs = Array.isArray(cvData.certifications) 
      ? cvData.certifications.map((c: any) => typeof c === 'string' ? c : c.title).join(', ')
      : cvData.certifications;
    sections.push(`## Certifications
${certs}`);
  }

  // Languages
  if (cvData.languages?.length > 0) {
    sections.push(`## Languages
${Array.isArray(cvData.languages) ? cvData.languages.join(', ') : cvData.languages}`);
  }

  return sections.join('\n\n') || 'CV data is minimal or empty.';
}

/**
 * Generate CV analysis prompt
 */
function createAnalysisPrompt(cvData: any): string {
  const formattedCV = formatCVForAnalysis(cvData);
  
  return `You are an expert CV/resume evaluator and career coach with deep knowledge of ATS (Applicant Tracking Systems) and hiring best practices.

Analyze the following CV and provide a comprehensive evaluation in JSON format.

=== CV CONTENT ===
${formattedCV}

=== RAW DATA (for additional context) ===
${JSON.stringify(cvData, null, 2).slice(0, 2000)}...

EVALUATION CRITERIA:
1. **Overall Quality (0-100)**: Holistic assessment considering all factors
2. **ATS Compatibility (0-100)**: How well it will perform with ATS systems
3. **Content Quality (0-100)**: Strength of experience descriptions and achievements

REQUIRED JSON OUTPUT FORMAT:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "strengths": [<1-5 specific strengths as strings - at least 1 required>],
  "weaknesses": [<1-5 specific weaknesses as strings - at least 1 required>],
  "suggestions": [<1-7 specific actionable suggestions as strings - at least 1 required>],
  "details": {
    "experienceQuality": <number 0-100>,
    "skillsRelevance": <number 0-100>,
    "formatting": <number 0-100>,
    "atsCompatibility": <number 0-100>
  }
}

NOTE: Even for minimal or sparse CVs, always provide at least 1 item in each array.
For sparse CVs, focus on what's missing as weaknesses and suggestions.

EVALUATION GUIDELINES:

**ATS Compatibility:**
- Standard section headers (Experience, Education, Skills, Contact)
- No tables, columns, or complex layouts
- No images, graphics, or special characters
- Standard fonts and formatting
- Proper contact information format
- Keyword density and relevance

**Content Quality:**
- Strong action verbs in descriptions
- Quantified achievements with metrics
- Relevant skills and technologies
- Clear job progression
- No spelling/grammar errors
- Appropriate length (1-2 pages)

**Strengths:** Identify what the CV does well. Be specific (e.g., "Strong quantified achievements in project management section showing 30% efficiency gains")

**Weaknesses:** Identify specific problems (e.g., "Generic bullet points in current role lack quantifiable impact")

**Suggestions:** Provide actionable improvements (e.g., "Add metrics to software development achievements - e.g., 'Reduced API response time by 45%' instead of 'Improved API performance'")

IMPORTANT: 
- Be constructive and specific
- Focus on high-impact improvements
- Provide examples where helpful
- Return ONLY valid JSON, no additional text
- Ensure all arrays have the required number of items`;
}

/**
 * CV Evaluator Agent
 * 
 * @param state - Current workflow state
 * @returns Updated state with CV analysis results
 */
export async function evaluateCVAgent(
  state: CareerServiceStateType
): Promise<Partial<CareerServiceStateType>> {
  console.log("[CV Evaluator] Starting CV analysis");

  try {
    // Validate CV data is available
    if (!state.cvData) {
      return {
        error: "No CV data provided for analysis",
        nextAction: "error",
        messages: [{
          role: "assistant",
          content: "I need your CV data to perform an analysis. Please select or upload a CV first.",
          timestamp: new Date(),
        }],
      };
    }

    // Generate analysis prompt
    const prompt = createAnalysisPrompt(state.cvData);

    // Call LLM for analysis
    console.log("[CV Evaluator] Calling GPT-4 for analysis");
    const response = await model.invoke([
      {
        role: "system",
        content: "You are a CV evaluation expert. Always respond with valid JSON matching the requested format.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    const responseText = response.content.toString();
    console.log("[CV Evaluator] Received response from GPT-4");

    // Parse and validate response
    let analysisData;
    try {
      // Extract JSON from response (handle code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      analysisData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[CV Evaluator] JSON parsing failed:", parseError);
      throw new Error("Failed to parse CV analysis response");
    }

    // Ensure arrays have at least one item (fallback for sparse responses)
    if (!analysisData.strengths?.length) {
      analysisData.strengths = ["CV has been submitted for review"];
    }
    if (!analysisData.weaknesses?.length) {
      analysisData.weaknesses = ["More detailed information could strengthen the CV"];
    }
    if (!analysisData.suggestions?.length) {
      analysisData.suggestions = ["Add more specific details about your experience and achievements"];
    }

    // Ensure scores are present with defaults
    analysisData.overallScore = analysisData.overallScore ?? 50;
    analysisData.atsScore = analysisData.atsScore ?? 50;
    analysisData.contentScore = analysisData.contentScore ?? 50;

    // Validate with Zod schema
    const parseResult = safeParse(CVAnalysisSchema, analysisData);

    if (!parseResult.success) {
      console.error("[CV Evaluator] Validation failed:", parseResult.error);
      console.error("[CV Evaluator] Data was:", JSON.stringify(analysisData, null, 2));
      throw new Error(`Invalid analysis format: ${parseResult.error}`);
    }

    const analysis = parseResult.data;

    // Save analysis to database if user and CV IDs are available
    if (state.userId && state.cvId) {
      try {
        await prisma.cVAnalysis.create({
          data: {
            userId: state.userId,
            cvId: state.cvId,
            overallScore: analysis.overallScore,
            atsScore: analysis.atsScore,
            contentScore: analysis.contentScore,
            strengths: JSON.stringify(analysis.strengths),
            weaknesses: JSON.stringify(analysis.weaknesses),
            suggestions: JSON.stringify(analysis.suggestions),
            analysisData: JSON.stringify(analysis),
          },
        });
        console.log("[CV Evaluator] Analysis saved to database");
      } catch (dbError) {
        console.error("[CV Evaluator] Failed to save analysis:", dbError);
        // Don't fail the whole operation if DB save fails
      }
    }

    // Generate user-friendly message
    const message = generateAnalysisMessage(analysis);

    // Return updated state
    return {
      cvAnalysis: analysis,
      messages: [{
        role: "assistant",
        content: message,
        timestamp: new Date(),
      }],
      nextAction: "wait_for_user",
      error: null,
    };

  } catch (error) {
    console.error("[CV Evaluator] Error during analysis:", error);

    return {
      error: error instanceof Error ? error.message : "Unknown error during CV analysis",
      nextAction: "error",
      messages: [{
        role: "assistant",
        content: "I encountered an error while analyzing your CV. Please try again or contact support if the problem persists.",
        timestamp: new Date(),
      }],
    };
  }
}

/**
 * Generate user-friendly message from analysis results
 */
function generateAnalysisMessage(analysis: any): string {
  let message = "## CV Analysis Complete\n\n";

  // Scores
  message += `### Scores\n`;
  message += `- **Overall Quality:** ${analysis.overallScore}/100 ${getScoreEmoji(analysis.overallScore)}\n`;
  message += `- **ATS Compatibility:** ${analysis.atsScore}/100 ${getScoreEmoji(analysis.atsScore)}\n`;
  message += `- **Content Quality:** ${analysis.contentScore}/100 ${getScoreEmoji(analysis.contentScore)}\n\n`;

  // Strengths
  message += `### ✅ Strengths\n`;
  analysis.strengths.forEach((strength: string, index: number) => {
    message += `${index + 1}. ${strength}\n`;
  });
  message += `\n`;

  // Areas for Improvement
  message += `### ⚠️ Areas for Improvement\n`;
  analysis.weaknesses.forEach((weakness: string, index: number) => {
    message += `${index + 1}. ${weakness}\n`;
  });
  message += `\n`;

  // Actionable Suggestions
  message += `### 💡 Actionable Suggestions\n`;
  analysis.suggestions.forEach((suggestion: string, index: number) => {
    message += `${index + 1}. ${suggestion}\n`;
  });
  message += `\n`;

  // Next steps
  message += `### Next Steps\n`;
  message += `Would you like me to:\n`;
  message += `- Find jobs that match your CV?\n`;
  message += `- Help you improve specific sections?\n`;
  message += `- Generate a cover letter for a specific job?\n`;

  return message;
}

/**
 * Get emoji based on score
 */
function getScoreEmoji(score: number): string {
  if (score >= 80) return "🟢";
  if (score >= 60) return "🟡";
  return "🔴";
}

/**
 * Export for use in workflow
 */
export default evaluateCVAgent;



