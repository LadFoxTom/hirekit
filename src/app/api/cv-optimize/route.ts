import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const openaiApiKey = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cvData, optimizationRequest, conversation } = await request.json();

    if (!openaiApiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Create system prompt for CV optimization
    const systemPrompt = `You are an expert CV optimization specialist with deep knowledge of ATS systems, industry best practices, and professional CV writing. Your role is to help users improve their CVs based on their specific requests.

Your expertise includes:
- ATS optimization and keyword matching
- Professional CV writing and formatting
- Industry-specific terminology and requirements
- Quantifiable achievement writing
- Action verb optimization
- Content structure and flow improvement
- Professional summary enhancement
- Skills categorization and presentation

When providing suggestions:
1. Be specific and actionable
2. Provide concrete examples when possible
3. Consider the user's industry and experience level
4. Focus on quantifiable improvements
5. Maintain professional tone
6. Suggest both content and formatting improvements

Always provide helpful, constructive feedback that will genuinely improve the CV's effectiveness.`;

    // Create user prompt with CV data and optimization request
    const userPrompt = `Please help optimize this CV based on the following request: "${optimizationRequest}"

CURRENT CV DATA:
${JSON.stringify(cvData, null, 2)}

CONVERSATION CONTEXT:
${conversation?.slice(-5).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') || 'No previous conversation'}

Please provide:
1. A detailed explanation of what improvements you suggest
2. Specific examples of how to implement these improvements
3. Any specific optimizations that can be applied directly to the CV data

Focus on making the CV more impactful, ATS-friendly, and professional while maintaining the user's authentic voice and experience.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to optimize CV' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0]?.message?.content;

    // Parse the response to extract suggestions and potential optimizations
    const suggestion = generatedContent || 'I\'ve analyzed your CV and provided optimization suggestions. Please review the recommendations above.';

    // For now, return the suggestion without automatic optimizations
    // In the future, you could parse the response and extract specific CV data changes
    return NextResponse.json({
      suggestion,
      optimizations: null, // Could be enhanced to parse and return specific CV changes
      success: true
    });

  } catch (error) {
    console.error('CV optimization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 