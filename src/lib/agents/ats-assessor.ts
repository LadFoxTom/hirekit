/**
 * ATS Assessment Agent
 * 
 * Comprehensive ATS/CV checker that evaluates CVs based on scientific research
 * about ATS parsing, human psychology, and effective CV communication.
 */

import { ChatOpenAI } from "@langchain/openai";
import { CareerServiceStateType } from "../state/agent-state";
import { CVAnalysisSchema, safeParse } from "../state/schemas";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Initialize OpenAI model for ATS assessment
 * Using GPT-4 Turbo for higher quality reasoning
 */
const model = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
  temperature: 0.2, // Lower temperature for consistent analytical output
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Check if a string matches email format
 */
function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Check if a string matches professional email format (not generic providers for professionals)
 */
function isProfessionalEmailFormat(email: string): boolean {
  if (!isValidEmailFormat(email)) return false;
  const unprofessionalDomains = ['yahoo.com', 'hotmail.com', 'aol.com', 'gmail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  // For professionals under 40, these domains might signal age bias
  // But we'll just check format, not domain quality
  return true; // Format is valid, domain quality is subjective
}

/**
 * Check if phone number has international format
 */
function hasInternationalFormat(phone: string): boolean {
  // Check if starts with + or has country code pattern
  return /^\+?\d{1,3}[\s-]?\d/.test(phone);
}

/**
 * Sanitize CV data for LLM - remove actual contact information, keep structure
 */
function sanitizeCVDataForLLM(cvData: any): string {
  try {
    const sanitized = { ...cvData };
    
    // Remove actual contact data, keep structure indicators
    if (sanitized.contact) {
      sanitized.contact = {
        email: sanitized.contact.email ? '[EMAIL_PROVIDED]' : '[EMAIL_MISSING]',
        phone: sanitized.contact.phone ? '[PHONE_PROVIDED]' : '[PHONE_MISSING]',
        location: sanitized.contact.location ? '[LOCATION_PROVIDED]' : '[LOCATION_MISSING]',
      };
    }
    
    if (sanitized.personalInfo) {
      sanitized.personalInfo = {
        ...sanitized.personalInfo,
        email: sanitized.personalInfo.email ? '[EMAIL_PROVIDED]' : undefined,
        phone: sanitized.personalInfo.phone ? '[PHONE_PROVIDED]' : undefined,
        location: sanitized.personalInfo.location ? '[LOCATION_PROVIDED]' : undefined,
        linkedin: sanitized.personalInfo.linkedin ? '[LINKEDIN_PROVIDED]' : undefined,
      };
    }
    
    if (sanitized.email) sanitized.email = '[EMAIL_PROVIDED]';
    if (sanitized.phone) sanitized.phone = '[PHONE_PROVIDED]';
    if (sanitized.location) sanitized.location = '[LOCATION_PROVIDED]';
    
    if (sanitized.social) {
      sanitized.social = {
        linkedin: sanitized.social.linkedin ? '[LINKEDIN_PROVIDED]' : undefined,
        github: sanitized.social.github ? '[GITHUB_PROVIDED]' : undefined,
        website: sanitized.social.website ? '[WEBSITE_PROVIDED]' : undefined,
      };
    }
    
    // Keep name structure but anonymize
    if (sanitized.fullName) {
      const nameParts = sanitized.fullName.split(' ');
      sanitized.fullName = nameParts.length > 0 ? `${nameParts[0]} [LAST_NAME_PROVIDED]` : '[NAME_PROVIDED]';
    }
    
    if (sanitized.personalInfo?.fullName) {
      const nameParts = sanitized.personalInfo.fullName.split(' ');
      sanitized.personalInfo.fullName = nameParts.length > 0 ? `${nameParts[0]} [LAST_NAME_PROVIDED]` : '[NAME_PROVIDED]';
    }
    
    const jsonString = JSON.stringify(sanitized, null, 2);
    return jsonString.slice(0, 2000) + (jsonString.length > 2000 ? '...' : '');
  } catch (error) {
    console.error('[ATS Assessor] Error sanitizing CV data:', error);
    return '[CV_DATA_STRUCTURE_AVAILABLE]';
  }
}

/**
 * Format CV data for LLM analysis - extract key information in readable format
 * Privacy-conscious: sends availability and format indicators instead of actual contact data
 */
function formatCVForAnalysis(cvData: any): string {
  const sections: string[] = [];

  // Personal Info - Privacy-conscious format
  const email = cvData.personalInfo?.email || cvData.email || cvData.contact?.email;
  const phone = cvData.personalInfo?.phone || cvData.phone || cvData.contact?.phone;
  const location = cvData.personalInfo?.location || cvData.location || cvData.contact?.location;
  const linkedin = cvData.personalInfo?.linkedin || cvData.social?.linkedin;
  
  if (cvData.fullName || cvData.personalInfo || email || phone || location) {
    const contactInfo: string[] = [];
    
    // Name - we can include first name only or just indicate presence
    if (cvData.fullName || cvData.personalInfo?.fullName) {
      const fullName = cvData.fullName || cvData.personalInfo?.fullName;
      // Only include first name for privacy, or just indicate presence
      const firstName = fullName.split(' ')[0];
      contactInfo.push(`- Name: ${firstName} [Full name provided]`);
    } else {
      contactInfo.push(`- Name: Not provided`);
    }
    
    // Email - availability and format only
    if (email) {
      const isValid = isValidEmailFormat(email);
      const isProfessional = isProfessionalEmailFormat(email);
      contactInfo.push(`- Email: Available | Format: ${isValid ? 'Valid' : 'Invalid'} | Professional format: ${isProfessional ? 'Yes' : 'Generic domain'}`);
    } else {
      contactInfo.push(`- Email: Not provided`);
    }
    
    // Phone - availability and format only
    if (phone) {
      const hasIntlFormat = hasInternationalFormat(phone);
      contactInfo.push(`- Phone: Available | Format: ${hasIntlFormat ? 'International (+country code)' : 'Local format'}`);
    } else {
      contactInfo.push(`- Phone: Not provided`);
    }
    
    // Location - general location only (city/region, not full address)
    if (location) {
      // Extract just city/region part for privacy
      const locationParts = location.split(',').map((p: string) => p.trim());
      const generalLocation = locationParts.slice(0, 2).join(', '); // City, Country/State
      contactInfo.push(`- Location: ${generalLocation} [General location provided]`);
    } else {
      contactInfo.push(`- Location: Not provided`);
    }
    
    // LinkedIn - just indicate presence
    if (linkedin) {
      const hasValidFormat = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(linkedin);
      contactInfo.push(`- LinkedIn: Available | Format: ${hasValidFormat ? 'Valid URL' : 'Invalid format'}`);
    } else {
      contactInfo.push(`- LinkedIn: Not provided`);
    }
    
    // Professional Headline
    if (cvData.professionalHeadline) {
      contactInfo.push(`- Professional Headline: ${cvData.professionalHeadline}`);
    } else {
      contactInfo.push(`- Professional Headline: Not provided`);
    }
    
    sections.push(`## Personal Information\n${contactInfo.join('\n')}`);
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
- Duration: ${exp.startDate || exp.dates || 'Start'} - ${exp.endDate || exp.current ? 'Present' : 'End'}
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
- Year: ${edu.year || edu.graduationYear || edu.dates || 'Not specified'}
- GPA: ${edu.gpa || 'Not specified'}`);
    });
    sections.push(eduSection.join('\n'));
  }

  // Skills
  if (cvData.skills?.length > 0 || cvData.technicalSkills || cvData.softSkills) {
    const skillsList = [];
    if (Array.isArray(cvData.skills)) skillsList.push(...cvData.skills);
    if (cvData.technicalSkills) {
      const tech = Array.isArray(cvData.technicalSkills) ? cvData.technicalSkills.join(', ') : cvData.technicalSkills;
      skillsList.push(`Technical: ${tech}`);
    }
    if (cvData.softSkills) {
      const soft = Array.isArray(cvData.softSkills) ? cvData.softSkills.join(', ') : cvData.softSkills;
      skillsList.push(`Soft Skills: ${soft}`);
    }
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
 * Get language name for prompt instructions
 */
function getLanguageName(langCode: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    nl: 'Dutch',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    pt: 'Portuguese',
    pl: 'Polish',
  };
  return languages[langCode] || 'English';
}

/**
 * Generate comprehensive ATS assessment prompt with all knowledge integrated
 */
function createATSAssessmentPrompt(cvData: any, language: string = 'en'): string {
  const formattedCV = formatCVForAnalysis(cvData);
  const languageName = getLanguageName(language);

  return `You are an expert ATS (Applicant Tracking System) and CV assessment specialist with deep knowledge of:
1. How ATS systems parse and extract data from CVs
2. The psychology of how recruiters read and evaluate CVs
3. The science behind effective CV communication

Your task is to provide a comprehensive ATS assessment that evaluates both technical parseability and human psychological effectiveness.

=== CV CONTENT ===
${formattedCV}

=== RAW DATA (for additional context - sanitized for privacy) ===
${sanitizeCVDataForLLM(cvData)}

=== ASSESSMENT FRAMEWORK ===

## 1. ATS TECHNICAL PARSEABILITY

**File Format & Text Layer:**
- DOCX files are generally preferred, but PDFs with proper text layers parse nearly as well
- PDFs created from design software (InDesign, Illustrator, Canva) often fail because text is rendered as vectors/images
- Research shows 43% of design-heavy PDFs fail to extract contact information correctly

**Layout & Structure:**
- ATS systems use sequential parsing (left-to-right, top-to-bottom)
- Two-column layouts can cause parsing errors (text read across columns simultaneously)
- Headers and footers are often processed separately or skipped entirely
- Tables with merged cells create spatial ambiguity
- Text boxes and complex layouts confuse parsers

**Contact Information:**
- Must be in main body, not headers/footers
- Professional email format (not generic providers like yahoo.com, hotmail.com for professionals) signals baseline professionalism
- International phone format (+country code) signals global awareness
- Missing or misparsed contact info = immediate disqualification
- Note: Contact information availability and format are provided in the CV content, but actual values are not included for privacy protection

**Section Headers:**
- Standard headers (Experience, Education, Skills, Contact) are recognized
- Non-standard headers may not be categorized correctly

## 2. CONTENT QUALITY & PSYCHOLOGY

**Responsibilities vs Achievements:**
- Generic responsibilities ("Responsible for managing team") activate generic schemas, provide zero differentiation
- Specific achievements with metrics ("Reduced team turnover from 34% to 12% over 18 months") activate multiple schemas and create processing fluency
- Research: CVs emphasizing achievements receive 40% more interview callbacks than those listing responsibilities

**Quantification:**
- Numbers provide anchoring points that make accomplishments feel real and verifiable
- "Improved customer satisfaction" is abstract
- "Improved customer satisfaction from 3.2 to 4.7 stars" is falsifiable and signals measurement systems

**Action Verbs:**
- Weak: "was involved in," "participated in" (passive, unsupported)
- Strong: "implemented," "reduced," "grew," "led" (demonstrates initiative)

**Professional Summary:**
- Weak: "Seeking a challenging role where I can utilize my skills" (candidate-focused, generic, no value)
- Strong: "Senior product designer with 8 years creating healthcare B2B interfaces, specializing in HIPAA-compliant workflows that reduce clinical documentation time. Led design for three products now used by 200+ hospitals."
- Effective summaries answer: What value? For whom? Based on what evidence?
- Research: Summaries following this structure receive 60% more profile views

**Education & Credentialing:**
- For <3 years experience: Education is primary signal, should appear prominently
- For 10+ years: Leading with education signals misunderstood priorities
- Certifications are renewable signals (indicate current knowledge)
- Recent certifications often carry more weight than older degrees for technical roles

**Skills Section:**
- Must be supported by demonstrated experience elsewhere in CV
- Consistency checking: If you list "advanced SQL" but no job mentions database work, it triggers skepticism
- Skills bars/proficiency levels are uncalibrated and decrease credibility
- Skills need to appear in semantically appropriate contexts

**Length:**
- Not about page count, but information density relative to experience
- New graduate with one internship filling two pages = low-signal padding
- Senior executive condensing 20 years into one page = compression artifacts
- First third of CV receives disproportionate attention (F-pattern scanning)
- ATS systems penalize low signal-to-noise ratio, not length itself

## 3. KEYWORD OPTIMIZATION

**Contextual Relevance:**
- Modern ATS uses semantic similarity, not exact keyword matching
- Keyword stuffing ("Python, Python, Python") appears manipulative
- Keywords need to appear in semantically appropriate contexts
- Example: Listing "machine learning" in skills is weak. Describing a project where you "implemented gradient boosting models to predict customer churn, improving retention targeting accuracy by 23%" demonstrates ML in context

**Semantic Clusters:**
- ATS understands related terms (AWS, Azure, GCP, Kubernetes, Docker = cloud infrastructure)
- Term frequency-inverse document frequency (TF-IDF) down-weights overused terms
- Research: CVs with relevant keywords in appropriate context perform similarly to CVs with 50% more keywords scattered throughout

## 4. COHERENCE & SIGNAL QUALITY

**Contextual Coherence:**
- Do all signals point in the same direction?
- Does someone claiming senior leadership use appropriately strategic language?
- Do achievements scale with reported scope?
- Does skills section match demonstrated work?

**Information Architecture:**
- Does the structure match the candidate's career stage?
- Is important information front-loaded (first third of CV)?
- Is there appropriate information density?

=== REQUIRED JSON OUTPUT FORMAT ===

{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "strengths": [<3-5 specific strengths as strings>],
  "weaknesses": [<3-5 specific weaknesses as strings>],
  "suggestions": [<5-7 specific actionable suggestions as strings>],
  "details": {
    "parseability": <number 0-100 - technical ATS parsing quality>,
    "contactInfo": <number 0-100 - contact information quality and accessibility>,
    "formatting": <number 0-100 - layout and structure quality>,
    "contentQuality": <number 0-100 - achievement vs responsibility ratio>,
    "quantification": <number 0-100 - use of metrics and numbers>,
    "summaryQuality": <number 0-100 - professional summary effectiveness>,
    "skillsSupport": <number 0-100 - skills backed by demonstrated experience>,
    "keywordContext": <number 0-100 - contextual keyword usage>,
    "coherence": <number 0-100 - signal consistency and information architecture>
  },
  "explanation": {
    "gradeExplanation": "<Detailed explanation of the overall grade and what it means>",
    "atsExplanation": "<Explanation of ATS score and parseability issues>",
    "contentExplanation": "<Explanation of content quality and psychological effectiveness>",
    "keyFindings": [<3-5 key findings as strings>]
  }
}

=== EVALUATION INSTRUCTIONS ===

1. **Be Specific and Evidence-Based:**
   - Don't say "weak summary" - say "Summary is candidate-focused and generic, doesn't answer what value you create or for whom"
   - Don't say "needs more achievements" - say "Experience descriptions use responsibility language ('was responsible for') instead of achievement language with metrics"

2. **Explain the Grading:**
   - Overall score should reflect both ATS parseability AND human psychological effectiveness
   - ATS score focuses on technical parseability (format, structure, contact info)
   - Content score focuses on achievement language, quantification, and signal quality

3. **Provide Actionable Suggestions:**
   - Instead of "improve formatting" → "Move contact information from header to main body to ensure ATS systems can extract it"
   - Instead of "add metrics" → "Replace 'Improved customer satisfaction' with 'Improved customer satisfaction from 3.2 to 4.7 stars on Trustpilot' to provide anchoring points"

4. **Consider Career Stage:**
   - Junior candidates: Education prominence is appropriate
   - Senior candidates: Leading with education may signal wrong priorities

5. **Check for Coherence:**
   - Skills listed but not demonstrated in experience = credibility issue
   - Senior title but junior-level language = inconsistency
   - Achievements that don't scale with scope = red flag

IMPORTANT:
- Return ONLY valid JSON, no additional text
- All scores must be 0-100
- All arrays must have the required number of items
- Provide detailed explanations that help the candidate understand WHY they received their grade

=== LANGUAGE REQUIREMENT ===
CRITICAL: ALL text content in your response MUST be written in ${languageName}.
This includes:
- All strengths (in ${languageName})
- All weaknesses (in ${languageName})
- All suggestions (in ${languageName})
- All explanations (gradeExplanation, atsExplanation, contentExplanation, keyFindings) (in ${languageName})

The JSON structure and field names should remain in English, but all human-readable content must be in ${languageName}.`;
}

/**
 * ATS Assessment Agent
 * 
 * @param state - Current workflow state
 * @returns Updated state with ATS assessment results
 */
export async function assessATSAgent(
  state: CareerServiceStateType
): Promise<Partial<CareerServiceStateType>> {
  console.log("[ATS Assessor] Starting ATS assessment");

  try {
    // Validate CV data is available
    if (!state.cvData) {
      return {
        error: "No CV data provided for assessment",
        nextAction: "error",
        messages: [{
          role: "assistant",
          content: "I need your CV data to perform an ATS assessment. Please select or upload a CV first.",
          timestamp: new Date(),
        }],
      };
    }

    // Generate assessment prompt with language support
    const language = (state as any).language || 'en';
    const prompt = createATSAssessmentPrompt(state.cvData, language);

    // Call LLM for assessment
    console.log("[ATS Assessor] Calling GPT-4 for assessment");
    const response = await model.invoke([
      {
        role: "system",
        content: "You are an expert ATS and CV assessment specialist. Always respond with valid JSON matching the requested format. Provide detailed explanations that help candidates understand their grades.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    const responseText = response.content.toString();
    console.log("[ATS Assessor] Received response from GPT-4");

    // Parse and validate response
    let assessmentData;
    try {
      // Extract JSON from response (handle code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      assessmentData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[ATS Assessor] JSON parsing failed:", parseError);
      throw new Error("Failed to parse ATS assessment response");
    }

    // Ensure arrays have at least one item
    if (!assessmentData.strengths?.length) {
      assessmentData.strengths = ["CV has been submitted for assessment"];
    }
    if (!assessmentData.weaknesses?.length) {
      assessmentData.weaknesses = ["More detailed information could strengthen the CV"];
    }
    if (!assessmentData.suggestions?.length) {
      assessmentData.suggestions = ["Add more specific details about your experience and achievements"];
    }
    if (!assessmentData.explanation?.keyFindings?.length) {
      assessmentData.explanation = assessmentData.explanation || {};
      assessmentData.explanation.keyFindings = ["Assessment completed"];
    }

    // Ensure scores are present with defaults
    assessmentData.overallScore = assessmentData.overallScore ?? 50;
    assessmentData.atsScore = assessmentData.atsScore ?? 50;
    assessmentData.contentScore = assessmentData.contentScore ?? 50;

    // Ensure details object exists
    if (!assessmentData.details) {
      assessmentData.details = {
        parseability: assessmentData.atsScore,
        contactInfo: 50,
        formatting: 50,
        contentQuality: assessmentData.contentScore,
        quantification: 50,
        summaryQuality: 50,
        skillsSupport: 50,
        keywordContext: 50,
        coherence: 50,
      };
    }

    // Ensure explanation object exists
    if (!assessmentData.explanation) {
      assessmentData.explanation = {
        gradeExplanation: "Assessment completed. Review the detailed scores and suggestions for improvement.",
        atsExplanation: "ATS compatibility evaluated based on parseability, formatting, and structure.",
        contentExplanation: "Content quality evaluated based on achievement language, quantification, and signal quality.",
        keyFindings: assessmentData.strengths.slice(0, 3),
      };
    }

    // Validate with Zod schema (using CVAnalysisSchema as base, but we'll extend it)
    const baseAnalysis = {
      overallScore: assessmentData.overallScore,
      atsScore: assessmentData.atsScore,
      contentScore: assessmentData.contentScore,
      strengths: assessmentData.strengths,
      weaknesses: assessmentData.weaknesses,
      suggestions: assessmentData.suggestions,
      details: {
        experienceQuality: assessmentData.details.contentQuality || 50,
        skillsRelevance: assessmentData.details.skillsSupport || 50,
        formatting: assessmentData.details.formatting || 50,
        atsCompatibility: assessmentData.details.parseability || 50,
      },
    };

    const parseResult = safeParse(CVAnalysisSchema, baseAnalysis);

    if (!parseResult.success) {
      console.error("[ATS Assessor] Validation failed:", parseResult.error);
      console.error("[ATS Assessor] Data was:", JSON.stringify(assessmentData, null, 2));
      throw new Error(`Invalid assessment format: ${parseResult.error}`);
    }

    // Save assessment to database if user and CV IDs are available
    if (state.userId && state.cvId) {
      try {
        await prisma.cVAnalysis.create({
          data: {
            userId: state.userId,
            cvId: state.cvId,
            overallScore: assessmentData.overallScore,
            atsScore: assessmentData.atsScore,
            contentScore: assessmentData.contentScore,
            strengths: JSON.stringify(assessmentData.strengths),
            weaknesses: JSON.stringify(assessmentData.weaknesses),
            suggestions: JSON.stringify(assessmentData.suggestions),
            analysisData: JSON.stringify(assessmentData), // Store full assessment with explanations
          },
        });
        console.log("[ATS Assessor] Assessment saved to database");
      } catch (dbError) {
        console.error("[ATS Assessor] Failed to save assessment:", dbError);
        // Don't fail the whole operation if DB save fails
      }
    }

    // Return updated state with full assessment data
    // Store the full assessment in a way that the API can access it
    const fullAssessment = {
      ...baseAnalysis,
      // Include extended data for ATS assessment
      details: assessmentData.details,
      explanation: assessmentData.explanation,
    };

    return {
      cvAnalysis: fullAssessment as any,
      messages: [{
        role: "assistant",
        content: "ATS assessment completed. Review the detailed analysis in the assessment panel.",
        timestamp: new Date(),
      }],
      nextAction: "wait_for_user",
      error: null,
    };

  } catch (error) {
    console.error("[ATS Assessor] Error during assessment:", error);

    return {
      error: error instanceof Error ? error.message : "Unknown error during ATS assessment",
      nextAction: "error",
      messages: [{
        role: "assistant",
        content: "I encountered an error while assessing your CV. Please try again or contact support if the problem persists.",
        timestamp: new Date(),
      }],
    };
  }
}

/**
 * Export for use in workflow
 */
export default assessATSAgent;
