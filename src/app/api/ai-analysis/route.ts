import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { tokenManager } from '@/lib/token-manager';
import { createAIAnalysisPrompt, parseAIResponse, AIAnalysisInput } from '@/lib/ai-templates';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const input: AIAnalysisInput = await request.json();
    const userId = request.headers.get('x-user-id') || 'anonymous';

    // Check token availability
    if (!tokenManager.canUseTokens(userId, 1)) {
      return NextResponse.json({
        error: 'Insufficient tokens',
        remainingTokens: tokenManager.getRemainingTokens(userId),
        plan: tokenManager.getUserUsage(userId).plan
      }, { status: 402 });
    }

    // Use tokens
    if (!tokenManager.useTokens(userId, 1)) {
      return NextResponse.json({
        error: 'Failed to use tokens',
        remainingTokens: tokenManager.getRemainingTokens(userId)
      }, { status: 402 });
    }

    console.log('AI Analysis - Starting analysis for user:', userId);
    console.log('AI Analysis - Remaining tokens:', tokenManager.getRemainingTokens(userId));

    // Create the analysis prompt
    const prompt = createAIAnalysisPrompt(input);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV builder AI assistant. Provide analysis in the exact JSON format requested.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    
    if (!response) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Parse and structure the response
    const analysis = parseAIResponse(response);

    console.log('AI Analysis - Analysis completed successfully');

    return NextResponse.json({
      success: true,
      analysis,
      tokensUsed: 1,
      remainingTokens: tokenManager.getRemainingTokens(userId)
    });

  } catch (error) {
    console.error('AI Analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze CV',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 