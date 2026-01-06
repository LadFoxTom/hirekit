import { NextRequest, NextResponse } from 'next/server'
import { LetterData } from '@/types/letter'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { letterData, uploadInfo, cvText, cvData } = await request.json()

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create a detailed system prompt that prevents fabrication
    const systemPrompt = `You are a professional motivational letter writing assistant. Your task is to help create compelling, authentic motivational letters based ONLY on the information provided by the user.

CRITICAL RULES - YOU MUST FOLLOW THESE:
1. NEVER invent, fabricate, or make up any information about the user's experience, skills, achievements, or background
2. ONLY use information that is explicitly provided in the user's responses or uploaded documents
3. If specific details are missing, use generic professional language rather than inventing specifics
4. Do not assume any qualifications, certifications, or experiences unless explicitly stated
5. Focus on the information provided and create compelling content from that foundation
6. If the user hasn't provided enough information, ask for more details rather than making assumptions
7. Maintain professional tone and structure while being authentic to the provided information
8. Use the tone, focus, and length preferences specified by the user
9. Ensure the letter is tailored to the specific job and company mentioned
10. NEVER include placeholder text like [Your Name], [Your Current Title], [Your Email], [Your Phone], or [Your Address] in the letter content
11. If sender information is not provided, simply omit those details rather than using placeholders
12. Focus on creating compelling content without relying on placeholder text

The letter should include:
- A compelling opening that shows genuine interest in the position
- Body paragraphs that connect the user's actual experience to the job requirements
- A strong closing with a call to action
- Professional formatting and appropriate length

Remember: Authenticity and honesty are more valuable than impressive but fabricated content.`

    // Build the user prompt with all available information
    let userPrompt = `Please create a motivational letter with the following information:

RECIPIENT INFORMATION:
- Name: ${letterData.recipientName || 'Hiring Manager'}
- Title: ${letterData.recipientTitle || 'Hiring Manager'}
- Company: ${letterData.companyName || 'the company'}
- Position: ${letterData.jobTitle || 'the position'}

SENDER INFORMATION:
${letterData.senderName ? `- Name: ${letterData.senderName}` : ''}
${letterData.senderTitle ? `- Title: ${letterData.senderTitle}` : ''}
${letterData.senderEmail ? `- Email: ${letterData.senderEmail}` : ''}
${letterData.senderPhone ? `- Phone: ${letterData.senderPhone}` : ''}
${letterData.senderAddress ? `- Address: ${letterData.senderAddress}` : ''}
${!letterData.senderName && !letterData.senderTitle && !letterData.senderEmail && !letterData.senderPhone && !letterData.senderAddress ? '- No sender information provided' : ''}

LETTER PREFERENCES:
- Tone: ${letterData.tone || 'professional'}
- Focus: ${letterData.focus || 'experience'}
- Length: ${letterData.length || 'standard'}
- Template: ${letterData.template || 'professional'}

PROVIDED CONTENT:
- Opening/Motivation: ${letterData.opening || 'Not provided'}
- Body Content: ${letterData.body ? letterData.body.join('\n\n') : 'Not provided'}
- Closing: ${letterData.closing || 'Not provided'}
- Subject: ${letterData.subject || 'Not provided'}

UPLOADED INFORMATION:
${uploadInfo?.pastedText ? `Additional Information: ${uploadInfo.pastedText}` : 'No additional information provided'}

CV INFORMATION:
${cvText ? `Candidate CV Information:\n${cvText}` : 'No CV information provided'}

IMPORTANT: Do NOT include placeholder text like [Your Name], [Your Current Title], [Your Email], [Your Phone], or [Your Address] in the letter content. If sender information is not provided, simply omit those details from the letter. Focus on creating compelling content without using placeholder text.

Please create a complete motivational letter using ONLY the information provided above. If any section is missing or incomplete, use professional generic language rather than inventing specific details. The letter should be authentic, compelling, and tailored to the specific position and company. Use the CV information to create more personalized and relevant content.`

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
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate letter content' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const generatedContent = data.choices[0]?.message?.content

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'No content generated' },
        { status: 500 }
      )
    }

    // Parse the generated content to extract different sections
    const sections = parseGeneratedContent(generatedContent, letterData)

    return NextResponse.json({
      opening: sections.opening,
      body: sections.body,
      closing: sections.closing,
      subject: sections.subject,
      fullContent: generatedContent
    })

  } catch (error) {
    console.error('Error generating letter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function parseGeneratedContent(content: string, letterData?: any) {
  // Simple parsing logic - you might want to improve this based on your needs
  const lines = content.split('\n').filter(line => line.trim())
  
  let opening = ''
  let body: string[] = []
  let closing = ''
  let subject = ''

  // Try to extract subject line
  const subjectMatch = content.match(/Subject:\s*(.+)/i)
  if (subjectMatch) {
    subject = subjectMatch[1].trim()
  }

  // Simple section detection
  let currentSection = 'opening'
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine.toLowerCase().includes('dear') && trimmedLine.length < 100) {
      // Skip salutation
      continue
    }
    
    if (trimmedLine.toLowerCase().includes('sincerely') || 
        trimmedLine.toLowerCase().includes('best regards') ||
        trimmedLine.toLowerCase().includes('thank you') ||
        trimmedLine.toLowerCase().includes('looking forward')) {
      currentSection = 'closing'
    }
    
    if (currentSection === 'opening' && !opening) {
      opening = trimmedLine
    } else if (currentSection === 'closing') {
      if (trimmedLine && !trimmedLine.toLowerCase().includes('sincerely') && 
          !trimmedLine.toLowerCase().includes('best regards')) {
        closing += (closing ? ' ' : '') + trimmedLine
      }
    } else if (trimmedLine && currentSection !== 'closing') {
      body.push(trimmedLine)
    }
  }

  // If we couldn't parse properly, return the content as body
  if (!opening && body.length > 0) {
    opening = body.shift() || ''
  }

  return {
    opening: opening || 'Thank you for considering my application for this position.',
    body: body.length > 0 ? body : ['I am excited to apply for this opportunity and believe my background makes me an excellent candidate for this role.'],
    closing: closing || 'I look forward to discussing how I can contribute to your team.',
    subject: subject || `Application for ${letterData?.jobTitle || 'the position'} at ${letterData?.companyName || 'your company'}`
  }
} 