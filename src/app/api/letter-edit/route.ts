import { NextRequest, NextResponse } from 'next/server'
import { LetterData } from '@/types/letter'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { letterData, uploadInfo, editRequest, cvText, cvData } = await request.json()

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create a system prompt for editing requests
    const systemPrompt = `You are a professional motivational letter writing assistant. Your task is to edit and improve an existing letter based on the user's specific requests.

CRITICAL RULES - YOU MUST FOLLOW THESE:
1. ONLY modify the letter based on the user's specific editing request
2. Maintain the existing structure and content unless specifically asked to change it
3. Keep the same tone and style unless the user requests a change
4. Preserve all factual information and personal details
5. Make targeted improvements based on the user's request
6. Provide a brief explanation of what you changed
7. Return the complete updated letter with all sections (opening, body, closing, subject)
8. NEVER include phrases like "updated letter", "edited version", or any meta-commentary within the actual letter content
9. The letter content should be clean and ready for use - no explanatory text within the letter itself
10. NEVER include placeholder text like [Your Name], [Your Current Title], [Your Email], [Your Phone], or [Your Address] in the letter content
11. If sender information is not provided, simply omit those details rather than using placeholders
12. Focus on creating compelling content without relying on placeholder text

The user will provide specific editing requests like:
- "Make it more confident"
- "Add more specific achievements"
- "Change the tone to enthusiastic"
- "Shorten the opening paragraph"
- "Add company research"
- "Highlight relevant skills"

Respond with the updated letter sections and a brief explanation of your changes. The letter content must be clean and professional.`

    // Build the user prompt with the current letter and editing request
    let userPrompt = `Please edit the following motivational letter based on this request: "${editRequest}"

CURRENT LETTER:
Opening: ${letterData.opening || 'Not provided'}
Body: ${letterData.body ? letterData.body.join('\n\n') : 'Not provided'}
Closing: ${letterData.closing || 'Not provided'}
Subject: ${letterData.subject || 'Not provided'}

LETTER PREFERENCES:
- Tone: ${letterData.tone || 'professional'}
- Focus: ${letterData.focus || 'experience'}
- Length: ${letterData.length || 'standard'}
- Template: ${letterData.template || 'professional'}

UPLOADED CONTEXT:
${uploadInfo?.pastedText ? `Additional Information: ${uploadInfo.pastedText}` : 'No additional information provided'}

CV INFORMATION:
${cvText ? `Candidate CV Information:\n${cvText}` : 'No CV information provided'}

Please edit the letter according to the user's request and return the updated sections. Also provide a brief explanation of what you changed.`

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
        { error: 'Failed to edit letter content' },
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
      explanation: sections.explanation,
      fullContent: generatedContent
    })

  } catch (error) {
    console.error('Error editing letter:', error)
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
  let explanation = ''

  // Try to extract explanation (usually at the beginning or end)
  const explanationMatch = content.match(/Explanation:(.+?)(?=\n\n|\n[A-Z]|$)/i)
  if (explanationMatch) {
    explanation = explanationMatch[1].trim()
  }

  // Try to extract subject line
  const subjectMatch = content.match(/Subject:\s*(.+)/i)
  if (subjectMatch) {
    subject = subjectMatch[1].trim()
  }

  // Simple section detection
  let currentSection = 'opening'
  let inLetterContent = false
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Skip lines that are clearly not part of the letter content
    if (trimmedLine.toLowerCase().includes('explanation:') ||
        trimmedLine.toLowerCase().includes('subject:') ||
        trimmedLine.toLowerCase().includes('updated letter') ||
        trimmedLine.toLowerCase().includes('edited version') ||
        trimmedLine.toLowerCase().includes('changes made:')) {
      continue
    }
    
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
    opening: opening || letterData?.opening || 'Thank you for considering my application for this position.',
    body: body.length > 0 ? body : letterData?.body || ['I am excited to apply for this opportunity and believe my background makes me an excellent candidate for this role.'],
    closing: closing || letterData?.closing || 'I look forward to discussing how I can contribute to your team.',
    subject: subject || letterData?.subject || `Application for ${letterData?.jobTitle || 'the position'} at ${letterData?.companyName || 'your company'}`,
    explanation: explanation || 'I\'ve updated your letter based on your request.'
  }
} 