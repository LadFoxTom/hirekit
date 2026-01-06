import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import type { Message, CVData, CVSection } from '@/types/cv'

// Force dynamic rendering since this route uses external API calls
export const dynamic = 'force-dynamic'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are a professional CV data extraction assistant. Your ONLY task is to extract relevant CV information from the user input and format it as structured JSON data.

NEVER give CV writing advice or explanations. Your sole purpose is to extract and structure data from what the user shares.

Extract the following information and structure it in these formats:

For personal information:
{
  "section": "personal",
  "content": {
    "fullName": "Full Name",
    "title": "Professional Title",
    "contact": {
      "email": "email@example.com",
      "phone": "123-456-7890",
      "location": "City, Country" 
    }
  }
}

For work experience:
{
  "section": "experience",
  "content": {
    "title": "Job Title at Company",
    "items": [
      "Achievement 1 with quantifiable results",
      "Achievement 2 with action verbs"
    ]
  }
}

For education:
{
  "section": "education",
  "content": {
    "title": "Degree at Institution",
    "items": ["Graduation year", "Relevant coursework or achievements"]
  }
}

For skills:
{
  "section": "skills",
  "content": {
    "title": "",
    "items": ["Skill 1", "Skill 2", "Skill 3"]
  }
}

For professional summary:
{
  "section": "summary",
  "content": {
    "title": "",
    "items": ["Professional summary paragraph highlighting key qualifications"]
  }
}

If a user mentions multiple sections (e.g., different jobs, schools, or skill sets), create separate JSON objects for each one. Extract as much detail as possible from the user's input, but ONLY create JSON objects for information that's actually provided.

Your entire response MUST be valid JSON object(s) with no additional text. Do not include any explanations or advice.`

interface ParsedResponse {
  section?: string
  content?: {
    title?: string
    items?: string[]
    fullName?: string
    degree?: string
    field?: string
    dates?: string
    contact?: {
      email?: string
      phone?: string
      location?: string
    }
  }
}

function extractCVData(message: string): { section: string | null; data: Partial<CVData> } {
  try {
    // Look for JSON objects in the response
    const jsonMatches = message.match(/\{[\s\S]*?\}/g) || [];
    
    if (jsonMatches.length === 0) {
      console.log('No JSON objects found in response');
      return { section: null, data: {} };
    }
    
    // Initialize CV data
    const cvData: Partial<CVData> = {};
    let primarySection: string | null = null;
    
    for (const jsonStr of jsonMatches) {
      try {
        const parsed = JSON.parse(jsonStr) as ParsedResponse;
        
        if (!parsed.section || !parsed.content) {
          continue;
        }
        
        // Set the primary section if not already set
        if (!primarySection) {
          primarySection = parsed.section;
        }
        
        switch (parsed.section) {
          case 'personal':
            if (parsed.content.fullName) {
              cvData.fullName = parsed.content.fullName;
            }
            if (parsed.content.title) {
              cvData.title = parsed.content.title;
            }
            if (parsed.content.contact) {
              cvData.contact = {
                ...(cvData.contact || {}),
                ...parsed.content.contact
              };
            }
            break;
            
          case 'experience':
            if (!cvData.experience) {
              cvData.experience = [];
            }
            cvData.experience.push({
              title: parsed.content.title || 'Professional Experience',
              content: parsed.content.items || []
            });
            break;
            
          case 'education':
            if (!cvData.education) {
              cvData.education = [];
            }
            cvData.education.push({
              institution: parsed.content.title || 'Institution',
              degree: parsed.content.degree || 'Degree',
              field: parsed.content.field || 'Field of Study',
              dates: parsed.content.dates || '',
              content: parsed.content.items || []
            });
            break;
            
          case 'skills':
            cvData.skills = parsed.content.items || [];
            break;
            
          case 'summary':
            cvData.summary = parsed.content.items?.join('\n') || '';
            break;
        }
      } catch (jsonError) {
        console.error('Error parsing individual JSON object:', jsonError);
        // Continue trying to parse other JSON objects
      }
    }
    
    return { 
      section: primarySection, 
      data: cvData 
    };
  } catch (error) {
    console.error('Error extracting CV data:', error);
    return { section: null, data: {} };
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use gpt-3.5-turbo for faster responses or gpt-4 for better quality
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.2, // Lower temperature for more consistent structured data
      response_format: { type: "json_object" } // Force JSON response format
    });

    const messageContent = completion.choices[0].message.content || '';
    const { section, data: cvUpdate } = extractCVData(messageContent);
    
    // Clean the message content for display if needed
    let cleanedMessage = "I've processed your information and updated your CV.";
    
    // For guided questions, we don't need to return a message as we're using predefined ones
    
    return NextResponse.json({
      message: cleanedMessage,
      cvUpdate,
      section
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
} 