import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Cover letter generation API is working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Cover letter generation API called')
    
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const { cvData, company, position } = body

    if (!cvData) {
      console.error('Missing cvData in request')
      return NextResponse.json(
        { error: 'CV data is required' },
        { status: 400 }
      )
    }

    if (!company || !position) {
      console.error('Missing company or position in request')
      return NextResponse.json(
        { error: 'Company and position are required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are a professional cover letter writer. Create a compelling, personalized cover letter that:
    
    1. Addresses the specific company and position
    2. Highlights relevant experience and skills from the CV
    3. Shows enthusiasm for the role and company
    4. Uses professional but engaging language
    5. Is concise (3-4 paragraphs)
    6. Includes a clear call to action
    
    Format the letter professionally with proper spacing and structure.`

    // Safely extract skills
    let skillsText = 'various skills'
    if (cvData.skills) {
      if (Array.isArray(cvData.skills)) {
        skillsText = cvData.skills.slice(0, 5).join(', ')
      } else if (typeof cvData.skills === 'object') {
        // Handle structured skills object
        const allSkills = [
          ...(cvData.skills.technical || []),
          ...(cvData.skills.soft || []),
          ...(cvData.skills.tools || []),
          ...(cvData.skills.industry || [])
        ]
        skillsText = allSkills.slice(0, 5).join(', ')
      } else if (typeof cvData.skills === 'string') {
        skillsText = cvData.skills
      }
    }

    // Safely extract summary
    let summaryText = 'Experienced professional'
    if (cvData.summary) {
      if (Array.isArray(cvData.summary)) {
        summaryText = cvData.summary.join(' ')
      } else if (typeof cvData.summary === 'string') {
        summaryText = cvData.summary
      }
    }

    const userPrompt = `Create a cover letter for ${position} position at ${company}.
    
    CV Context:
    - Name: ${cvData.fullName || 'Candidate'}
    - Title: ${cvData.title || 'Professional'}
    - Experience Level: ${cvData.experienceLevel || 'mid-level'}
    - Key Skills: ${skillsText}
    - Summary: ${summaryText}
    
    Make the letter specific to this role and company.`

    console.log('Calling OpenAI API...')
    
    // Try gpt-4 first, fallback to gpt-3.5-turbo if not available
    let model = 'gpt-4'
    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      })
      
      const content = completion.choices[0]?.message?.content || ''
      console.log('Cover letter generated successfully with', model)
      return NextResponse.json({ content })
    } catch (modelError) {
      console.warn(`Failed with ${model}, trying gpt-3.5-turbo:`, modelError instanceof Error ? modelError.message : modelError)
      
      // Fallback to gpt-3.5-turbo
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      })
      
      const content = completion.choices[0]?.message?.content || ''
      console.log('Cover letter generated successfully with gpt-3.5-turbo')
      return NextResponse.json({ content })
    }
  } catch (error) {
    console.error('Error generating cover letter:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    // Return more specific error messages
    if (error instanceof Error && error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key is invalid or expired' },
        { status: 500 }
      )
    }
    
    if (error instanceof Error && error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate cover letter', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 