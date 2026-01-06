import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { analyzeCV, generateCVAdvice, getSectorGuidance, getAllSectors } from '@/lib/cv-analysis'

// Force dynamic rendering since this route uses external API calls
export const dynamic = 'force-dynamic'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const CV_ANALYSIS_SYSTEM_PROMPT = `You are an expert CV analyst with deep knowledge of evidence-based CV writing best practices. Your role is to analyze CVs and provide structured, actionable feedback based on research from leading universities and career services.

You have access to comprehensive sector-specific guidance and general CV principles. Use this knowledge to provide:

1. **Structured Analysis**: Evaluate CV structure, content quality, and alignment with best practices
2. **Sector-Specific Advice**: Provide targeted recommendations based on the target industry/sector
3. **Evidence-Based Recommendations**: Base all advice on proven CV writing principles
4. **Actionable Feedback**: Give specific, implementable suggestions for improvement

When analyzing a CV, consider:

**General Principles:**
- Tailoring to job descriptions and using relevant keywords
- Being concise and well-structured (1-2 pages for industry CVs)
- Starting with a strong professional summary
- Focusing on quantifiable achievements rather than just duties
- Ensuring error-free, professional formatting

**Sector-Specific Considerations:**
- Different sectors have different priorities and keywords
- Format and content should align with industry expectations
- Technical vs. soft skills emphasis varies by sector
- Quantification and impact demonstration requirements differ

**Common Issues to Address:**
- Lack of quantifiable results
- Generic, non-tailored content
- Poor structure and formatting
- Missing relevant keywords
- Focus on duties rather than achievements

Provide feedback that is:
- Specific and actionable
- Evidence-based and research-backed
- Sector-appropriate
- Constructive and encouraging
- Focused on improvement opportunities

Always structure your response to include:
1. Overall assessment and score
2. Key strengths identified
3. Areas for improvement
4. Sector-specific recommendations
5. Specific action items for enhancement`

export async function POST(request: Request) {
  try {
    const { cvContent, targetSector, jobDescription, analysisType = 'comprehensive' } = await request.json();

    if (!cvContent) {
      return NextResponse.json(
        { error: 'CV content is required' },
        { status: 400 }
      );
    }

    // Perform structured analysis using our system
    const analysis = analyzeCV(cvContent, targetSector, jobDescription);
    
    // Get sector-specific guidance if provided
    const sectorGuidance = targetSector ? getSectorGuidance(targetSector) : null;

    // Generate AI-powered detailed analysis
    const aiAnalysisPrompt = `
CV Content:
${cvContent}

Target Sector: ${targetSector || 'General'}
Job Description: ${jobDescription || 'Not provided'}

Analysis Type: ${analysisType}

Please provide a comprehensive analysis of this CV based on evidence-based best practices. Consider:

1. **Structure and Format**: Is the CV well-organized and professional?
2. **Content Quality**: Are achievements quantified and impactful?
3. **Keyword Optimization**: Does it include relevant keywords for the target role/sector?
4. **Sector Alignment**: How well does it match industry expectations?
5. **Overall Impact**: Would this CV stand out to recruiters?

Provide specific, actionable recommendations for improvement.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: CV_ANALYSIS_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: aiAnalysisPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const aiAnalysis = completion.choices[0].message.content || '';

    // Generate structured advice
    const structuredAdvice = generateCVAdvice(analysis, targetSector);

    // Prepare comprehensive response
    const response = {
      analysis: {
        ...analysis,
        aiAnalysis,
        structuredAdvice,
      },
      sectorGuidance: sectorGuidance ? {
        name: sectorGuidance.name,
        keyElements: sectorGuidance.keyElements,
        keywords: sectorGuidance.keywords,
        formatTips: sectorGuidance.formatTips,
        commonMistakes: sectorGuidance.commonMistakes,
      } : null,
      recommendations: {
        immediate: analysis.recommendations.slice(0, 3),
        detailed: analysis.recommendations,
        sectorSpecific: analysis.sectorSpecificAdvice,
      },
      score: {
        overall: analysis.overallScore,
        breakdown: {
          structure: analysis.structureAnalysis.isWellStructured ? 25 : 0,
          achievements: analysis.achievementAnalysis.hasQuantifiedResults ? 25 : 0,
          keywords: Math.min(25, analysis.keywordAnalysis.found.length * 5),
          strengths: Math.min(25, analysis.strengths.length * 5),
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('CV Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze CV' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return available sectors for CV analysis
    const sectors = getAllSectors();
    const sectorDetails = sectors.map(sector => {
      const guidance = getSectorGuidance(sector);
      return {
        id: sector,
        name: guidance?.name || sector,
        keyElements: guidance?.keyElements || [],
      };
    });

    return NextResponse.json({
      sectors: sectorDetails,
      analysisTypes: ['comprehensive', 'structure', 'content', 'keywords', 'sector-specific'],
    });
  } catch (error) {
    console.error('Error fetching CV analysis options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis options' },
      { status: 500 }
    );
  }
} 