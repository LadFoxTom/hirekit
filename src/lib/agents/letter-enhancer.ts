/**
 * Cover Letter Enhancer Agent
 * 
 * Generates and enhances cover letters tailored to specific jobs and companies.
 * Avoids clichés and creates personalized, compelling content.
 */

import { ChatOpenAI } from "@langchain/openai";
import { CareerServiceStateType } from "../state/agent-state";
import { CoverLetterSchema, safeParse } from "../state/schemas";

const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
  temperature: 0.7, // Higher temperature for creative writing
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Clichés to avoid in cover letters
 */
const COVER_LETTER_CLICHES = [
  "passionate about",
  "team player",
  "think outside the box",
  "hit the ground running",
  "go-getter",
  "results-driven",
  "self-starter",
  "detail-oriented",
  "work hard, play hard",
  "unique opportunity",
  "perfect fit",
  "dream job",
];

/**
 * Create cover letter generation prompt
 */
function createLetterPrompt(cvData: any, targetJob: any, existingLetter?: string): string {
  const mode = existingLetter ? "enhance" : "generate";

  return `You are an expert professional writer specializing in compelling cover letters that get interviews.

${mode === "generate" ? "TASK: Generate a cover letter" : "TASK: Enhance this cover letter"}

CANDIDATE PROFILE:
- Name: ${cvData.fullName || cvData.personalInfo?.name || "Candidate"}
- Professional Headline: ${cvData.professionalHeadline || "Professional"}
- Recent Experience: ${JSON.stringify(cvData.experience?.[0] || {}, null, 2)}
- Key Skills: ${cvData.technicalSkills || cvData.skills || ""}
- Education: ${JSON.stringify(cvData.education?.[0] || {}, null, 2)}

TARGET JOB:
- Position: ${targetJob.title}
- Company: ${targetJob.company}
- Job Description: ${targetJob.description?.substring(0, 1000) || "Not provided"}

${existingLetter ? `CURRENT LETTER:\n${existingLetter}\n\n` : ""}

REQUIREMENTS:

**Structure (3 paragraphs, 300-400 words total):**

1. **Opening (Strong Hook)**
   - Express genuine interest in the specific role
   - Mention something specific about the company (from job description or research)
   - Immediately establish relevance
   - NO generic openings like "I am writing to apply..."

2. **Qualifications (Specific Evidence)**
   - Connect 2-3 specific experiences from CV to job requirements
   - Use quantified achievements where possible
   - Show understanding of role challenges
   - Demonstrate how candidate's background directly addresses needs

3. **Closing (Clear Call to Action)**
   - Express enthusiasm for next steps
   - Reference contribution candidate will make
   - Professional sign-off

**STRICT RULES:**

❌ **NEVER USE THESE CLICHÉS:**
${COVER_LETTER_CLICHES.map(c => `- "${c}"`).join("\n")}

✅ **DO THIS:**
- Be specific: "Increased API performance by 45%" not "improved systems"
- Name the company multiple times
- Reference specific role responsibilities from job description
- Use active voice and strong verbs
- Show research/knowledge about the company
- Be concise and respect the reader's time

**OUTPUT FORMAT (JSON only):**
{
  "content": "<cover letter text with proper paragraphs>",
  "warnings": ["<any writing issues found>"]
}

IMPORTANT:
- Professional but conversational tone
- No fluff or filler
- Every sentence should add value
- Proofread for errors
- Return ONLY valid JSON`;
}

/**
 * Cover Letter Enhancer Agent
 * 
 * @param state - Current workflow state
 * @returns Updated state with generated/enhanced letter
 */
export async function letterEnhancerAgent(
  state: CareerServiceStateType
): Promise<Partial<CareerServiceStateType>> {
  console.log("[Letter Enhancer] Starting letter generation/enhancement");

  try {
    // Validate required data
    if (!state.cvData) {
      return {
        error: "No CV data provided",
        messages: [{
          role: "assistant",
          content: "I need your CV data to create a personalized cover letter. Please select or upload a CV first.",
          timestamp: new Date(),
        }],
        nextAction: "wait_for_user",
      };
    }

    if (!state.targetJob) {
      return {
        error: "No target job provided",
        messages: [{
          role: "assistant",
          content: "Please provide the job details (title, company, description) so I can tailor the cover letter appropriately.",
          timestamp: new Date(),
        }],
        nextAction: "wait_for_user",
      };
    }

    // Generate prompt
    const prompt = createLetterPrompt(state.cvData, state.targetJob);

    // Call LLM
    console.log("[Letter Enhancer] Calling GPT-4 for letter generation");
    const response = await model.invoke([
      {
        role: "system",
        content: "You are an expert cover letter writer. Always respond with valid JSON containing the letter and any warnings.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    const responseText = response.content.toString();
    console.log("[Letter Enhancer] Received response from GPT-4");

    // Parse response
    let letterData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      letterData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[Letter Enhancer] JSON parsing failed:", parseError);
      throw new Error("Failed to parse cover letter response");
    }

    // Validate with Zod
    const parseResult = safeParse(CoverLetterSchema, letterData);

    if (!parseResult.success) {
      console.error("[Letter Enhancer] Validation failed:", parseResult.error);
      throw new Error(`Invalid letter format: ${parseResult.error}`);
    }

    const letter = parseResult.data;

    // Check for clichés (extra validation)
    const foundCliches = COVER_LETTER_CLICHES.filter(cliche =>
      letter.content.toLowerCase().includes(cliche.toLowerCase())
    );

    if (foundCliches.length > 0) {
      console.warn("[Letter Enhancer] Found clichés in generated letter:", foundCliches);
      letter.warnings = letter.warnings || [];
      letter.warnings.push(`Warning: Letter contains clichés: ${foundCliches.join(", ")}`);
    }

    // Generate user message
    const message = generateLetterMessage(letter, state.targetJob);

    return {
      messages: [{
        role: "assistant",
        content: message,
        timestamp: new Date(),
      }],
      nextAction: "wait_for_user",
      error: null,
    };

  } catch (error) {
    console.error("[Letter Enhancer] Error generating letter:", error);

    return {
      error: error instanceof Error ? error.message : "Unknown error generating letter",
      messages: [{
        role: "assistant",
        content: "I encountered an error while generating the cover letter. Please try again or contact support.",
        timestamp: new Date(),
      }],
      nextAction: "error",
    };
  }
}

/**
 * Generate user-friendly message with the letter
 */
function generateLetterMessage(letter: any, targetJob: any): string {
  let message = `## 📝 Cover Letter Generated\n\n`;
  message += `**For:** ${targetJob.title} at ${targetJob.company}\n\n`;
  message += `---\n\n`;
  message += letter.content;
  message += `\n\n---\n\n`;

  if (letter.warnings && letter.warnings.length > 0) {
    message += `### ⚠️ Writing Notes\n`;
    letter.warnings.forEach((warning: string) => {
      message += `- ${warning}\n`;
    });
    message += `\n`;
  }

  message += `### Next Steps\n`;
  message += `- Review and personalize the letter\n`;
  message += `- Save to your dashboard\n`;
  message += `- Copy and paste into your application\n`;
  message += `- Track your application with me\n\n`;
  message += `*This letter is ${letter.content.split(' ').length} words (ideal: 300-400)*`;

  return message;
}

/**
 * Validate letter quality (can be used independently)
 */
export function validateLetterQuality(letterContent: string): {
  hasCompanyName: boolean;
  hasSpecifics: boolean;
  hasClichés: string[];
  wordCount: number;
  isGoodLength: boolean;
} {
  const wordCount = letterContent.split(/\s+/).length;
  
  // Check for company name (should appear at least once)
  const hasCompanyName = letterContent.split(/[.\s,]/).length > 5; // Naive check
  
  // Check for specific numbers/metrics (indication of specificity)
  const hasNumbers = /\d+%|\d+x|increased|decreased|improved/i.test(letterContent);
  
  // Check for clichés
  const foundClichés = COVER_LETTER_CLICHES.filter(cliche =>
    letterContent.toLowerCase().includes(cliche.toLowerCase())
  );

  return {
    hasCompanyName,
    hasSpecifics: hasNumbers,
    hasClichés: foundClichés,
    wordCount,
    isGoodLength: wordCount >= 250 && wordCount <= 450,
  };
}

export default letterEnhancerAgent;













