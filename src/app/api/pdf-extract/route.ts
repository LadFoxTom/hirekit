import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { pdfText } = await request.json()
    
    if (!pdfText) {
      return NextResponse.json(
        { error: 'PDF text content is required' },
        { status: 400 }
      )
    }

    // Extract CV information from the PDF text
    const extractedData = extractCVData(pdfText)
    
    return NextResponse.json({
      success: true,
      extractedData,
      message: 'CV data extracted successfully'
    })
    
  } catch (error) {
    console.error('PDF extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract PDF data' },
      { status: 500 }
    )
  }
}

function extractCVData(pdfText: string) {
  const extractedData: any = {}
  
  // Extract name (look for patterns like "Name: John Doe" or just prominent text)
  const nameMatch = pdfText.match(/(?:name|full name|contact)[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i)
  if (nameMatch) {
    extractedData.fullName = nameMatch[1].trim()
  }
  
  // Extract email
  const emailMatch = pdfText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
  if (emailMatch) {
    extractedData.contact = { ...extractedData.contact, email: emailMatch[0] }
  }
  
  // Extract phone number
  const phoneMatch = pdfText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  if (phoneMatch) {
    extractedData.contact = { ...extractedData.contact, phone: phoneMatch[0] }
  }
  
  // Extract location/address
  const locationMatch = pdfText.match(/(?:location|address|city|state)[:\s]*([^,\n]+(?:,\s*[^,\n]+)*)/i)
  if (locationMatch) {
    extractedData.contact = { ...extractedData.contact, location: locationMatch[1].trim() }
  }
  
  // Extract job title
  const titleMatch = pdfText.match(/(?:title|position|role)[:\s]*([^,\n]+)/i)
  if (titleMatch) {
    extractedData.title = titleMatch[1].trim()
  }
  
  // Extract summary/objective
  const summaryMatch = pdfText.match(/(?:summary|objective|profile)[:\s]*([^.\n]+(?:\.[^.\n]+)*)/i)
  if (summaryMatch) {
    extractedData.summary = summaryMatch[1].trim()
  }
  
  // Extract experience (look for job titles and companies)
  const experienceMatches = pdfText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:at|with|for)\s*([A-Z][a-zA-Z\s&]+)/g)
  if (experienceMatches) {
    extractedData.experience = experienceMatches.slice(0, 3).map(match => {
      const parts = match.split(/\s+(?:at|with|for)\s+/)
      return {
        title: parts[0]?.trim() || '',
        company: parts[1]?.trim() || '',
        dates: '',
        achievements: []
      }
    })
  }
  
  // Extract education
  const educationMatch = pdfText.match(/(?:education|degree|university|college)[:\s]*([^,\n]+)/i)
  if (educationMatch) {
    extractedData.education = [{
      degree: educationMatch[1].trim(),
      institution: '',
      dates: '',
      field: ''
    }]
  }
  
  // Extract skills (look for common skill keywords)
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Microsoft Office', 'Excel', 'PowerPoint', 'Word', 'Photoshop', 'Illustrator'
  ]
  
  const foundSkills = skillKeywords.filter(skill => 
    pdfText.toLowerCase().includes(skill.toLowerCase())
  )
  
  if (foundSkills.length > 0) {
    extractedData.skills = foundSkills
  }
  
  return extractedData
}