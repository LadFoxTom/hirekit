import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { content, targetReduction, sectionType, preserveFormatting = true } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      )
    }

    if (!targetReduction || targetReduction < 5 || targetReduction > 50) {
      return NextResponse.json(
        { error: 'Target reduction must be between 5% and 50%' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a professional CV and document writing assistant. Your task is to rephrase and shorten content while preserving its meaning, impact, and professional tone.

CRITICAL REQUIREMENTS:
1. Reduce the content length by approximately ${targetReduction}% while maintaining all key information
2. Preserve the professional tone and impact of the original content
3. Keep all important keywords, achievements, and quantifiable results
4. Maintain proper grammar and sentence structure
5. Do not add any new information not present in the original
6. Focus on conciseness and clarity
7. Preserve any formatting markers like bullet points, line breaks, etc.

Section Type: ${sectionType || 'general'}

Guidelines for different section types:
- Experience: Keep job titles, companies, dates, and key achievements. Focus on action verbs and quantifiable results.
- Education: Keep degrees, institutions, dates, and relevant details. Maintain academic terminology.
- Skills: Keep all technical and soft skills. Group related skills efficiently.
- Summary: Maintain professional tone while being more concise. Keep key value propositions.
- Projects: Keep project names, technologies, and key outcomes. Focus on impact and results.

Return only the rephrased content without any explanations or additional text.`

    const userPrompt = `Please rephrase and shorten this content by approximately ${targetReduction}%:

${content}

Return only the rephrased content.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const rephrasedContent = completion.choices[0].message.content || ''

    // Calculate actual reduction
    const originalLength = content.length
    const newLength = rephrasedContent.length
    const actualReduction = Math.round(((originalLength - newLength) / originalLength) * 100)

    return NextResponse.json({
      rephrasedContent,
      originalLength,
      newLength,
      targetReduction,
      actualReduction,
      success: true
    })

  } catch (error) {
    console.error('AI rephrasing error:', error)
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to rephrase content' },
      { status: 500 }
    )
  }
}
