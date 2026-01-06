import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CVData } from '@/types/cv'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const { cvData } = await request.json()
    
    if (!cvData) {
      return NextResponse.json(
        { error: 'CV data is required' },
        { status: 400 }
      )
    }

    // Convert CV data to text format
    const cvText = convertCVToText(cvData)

    return NextResponse.json({ 
      cvText,
      message: 'CV converted to text successfully' 
    })
  } catch (error) {
    console.error('Error converting CV to text:', error)
    return NextResponse.json(
      { error: 'Failed to convert CV to text' },
      { status: 500 }
    )
  }
}

function convertCVToText(cvData: CVData): string {
  const sections: string[] = []

  // Personal Information
  if (cvData.fullName || cvData.title || cvData.professionalHeadline) {
    sections.push('PERSONAL INFORMATION')
    if (cvData.fullName) sections.push(`Name: ${cvData.fullName}`)
    if (cvData.title) sections.push(`Title: ${cvData.title}`)
    if (cvData.professionalHeadline) sections.push(`Professional Headline: ${cvData.professionalHeadline}`)
    if (cvData.pronouns) sections.push(`Pronouns: ${cvData.pronouns}`)
    sections.push('')
  }

  // Contact Information
  if (cvData.contact || cvData.social) {
    sections.push('CONTACT INFORMATION')
    if (cvData.contact?.email) sections.push(`Email: ${cvData.contact.email}`)
    if (cvData.contact?.phone) sections.push(`Phone: ${cvData.contact.phone}`)
    if (cvData.contact?.location) sections.push(`Location: ${cvData.contact.location}`)
    
    if (cvData.social) {
      if (cvData.social.linkedin) sections.push(`LinkedIn: ${cvData.social.linkedin}`)
      if (cvData.social.github) sections.push(`GitHub: ${cvData.social.github}`)
      if (cvData.social.website) sections.push(`Website: ${cvData.social.website}`)
      if (cvData.social.twitter) sections.push(`Twitter: ${cvData.social.twitter}`)
    }
    sections.push('')
  }

  // Summary
  if (cvData.summary) {
    sections.push('PROFESSIONAL SUMMARY')
    sections.push(cvData.summary)
    sections.push('')
  }

  // Career Objective
  if (cvData.careerObjective) {
    sections.push('CAREER OBJECTIVE')
    sections.push(cvData.careerObjective)
    sections.push('')
  }

  // Work Authorization & Availability
  if (cvData.workAuthorization || cvData.availability) {
    sections.push('WORK AUTHORIZATION & AVAILABILITY')
    if (cvData.workAuthorization) sections.push(`Work Authorization: ${cvData.workAuthorization}`)
    if (cvData.availability) sections.push(`Availability: ${cvData.availability}`)
    sections.push('')
  }

  // Experience
  if (cvData.experience && cvData.experience.length > 0) {
    sections.push('PROFESSIONAL EXPERIENCE')
    cvData.experience.forEach((exp, index) => {
      sections.push(`${index + 1}. ${exp.title}`)
      if (exp.company) sections.push(`   Company: ${exp.company}`)
      if (exp.type) sections.push(`   Type: ${exp.type}`)
      if (exp.location) sections.push(`   Location: ${exp.location}`)
      if (exp.dates) sections.push(`   Period: ${exp.dates}`)
      if (exp.current) sections.push(`   Status: Current Position`)
      
      if (exp.achievements && exp.achievements.length > 0) {
        sections.push(`   Key Achievements:`)
        exp.achievements.forEach(achievement => {
          sections.push(`   • ${achievement}`)
        })
      } else if (exp.content && exp.content.length > 0) {
        sections.push(`   Responsibilities:`)
        exp.content.forEach(item => {
          sections.push(`   • ${item}`)
        })
      }
      sections.push('')
    })
  }

  // Education
  if (cvData.education && cvData.education.length > 0) {
    sections.push('EDUCATION')
    cvData.education.forEach((edu, index) => {
      sections.push(`${index + 1}. ${edu.degree || 'Degree'}`)
      if (edu.field) sections.push(`   Field: ${edu.field}`)
      if (edu.institution) sections.push(`   Institution: ${edu.institution}`)
      if (edu.dates) sections.push(`   Period: ${edu.dates}`)
      
      if (edu.achievements && edu.achievements.length > 0) {
        sections.push(`   Achievements:`)
        edu.achievements.forEach(achievement => {
          sections.push(`   • ${achievement}`)
        })
      } else if (edu.content && edu.content.length > 0) {
        sections.push(`   Details:`)
        edu.content.forEach(item => {
          sections.push(`   • ${item}`)
        })
      }
      sections.push('')
    })
  }

  // Skills
  if (cvData.skills) {
    sections.push('SKILLS')
    if (Array.isArray(cvData.skills)) {
      // Legacy format
      sections.push(cvData.skills.join(', '))
    } else {
      // New format with categories
      if (cvData.skills.technical && cvData.skills.technical.length > 0) {
        sections.push(`Technical Skills: ${cvData.skills.technical.join(', ')}`)
      }
      if (cvData.skills.soft && cvData.skills.soft.length > 0) {
        sections.push(`Soft Skills: ${cvData.skills.soft.join(', ')}`)
      }
      if (cvData.skills.tools && cvData.skills.tools.length > 0) {
        sections.push(`Tools & Technologies: ${cvData.skills.tools.join(', ')}`)
      }
      if (cvData.skills.industry && cvData.skills.industry.length > 0) {
        sections.push(`Industry Knowledge: ${cvData.skills.industry.join(', ')}`)
      }
    }
    sections.push('')
  }

  // Languages
  if (cvData.languages && cvData.languages.length > 0) {
    sections.push('LANGUAGES')
    sections.push(cvData.languages.join(', '))
    sections.push('')
  }

  // Certifications
  if (cvData.certifications) {
    if (Array.isArray(cvData.certifications) && cvData.certifications.length > 0) {
      sections.push('CERTIFICATIONS')
      cvData.certifications.forEach((cert, index) => {
        sections.push(`${index + 1}. ${cert.title}`)
        if (cert.content && cert.content.length > 0) {
          cert.content.forEach(item => {
            sections.push(`   • ${item}`)
          })
        }
        sections.push('')
      })
    } else if (typeof cvData.certifications === 'string' && cvData.certifications.length > 0) {
      sections.push('CERTIFICATIONS')
      sections.push(cvData.certifications)
      sections.push('')
    }
  }

  // Projects
  if (cvData.projects) {
    if (Array.isArray(cvData.projects) && cvData.projects.length > 0) {
      sections.push('PROJECTS')
      cvData.projects.forEach((project, index) => {
        sections.push(`${index + 1}. ${project.title}`)
        if (project.content && project.content.length > 0) {
          project.content.forEach(item => {
            sections.push(`   • ${item}`)
          })
        }
        sections.push('')
      })
    } else if (typeof cvData.projects === 'string' && cvData.projects.length > 0) {
      sections.push('PROJECTS')
      sections.push(cvData.projects)
      sections.push('')
    }
  }

  // Volunteer Work
  if (cvData.volunteerWork && cvData.volunteerWork.length > 0) {
    sections.push('VOLUNTEER WORK')
    cvData.volunteerWork.forEach((volunteer, index) => {
      sections.push(`${index + 1}. ${volunteer.title}`)
      if (volunteer.content && volunteer.content.length > 0) {
        volunteer.content.forEach(item => {
          sections.push(`   • ${item}`)
        })
      }
      sections.push('')
    })
  }

  // Awards & Recognition
  if (cvData.awardsRecognition && cvData.awardsRecognition.length > 0) {
    sections.push('AWARDS & RECOGNITION')
    cvData.awardsRecognition.forEach((award, index) => {
      sections.push(`${index + 1}. ${award.title}`)
      if (award.content && award.content.length > 0) {
        award.content.forEach(item => {
          sections.push(`   • ${item}`)
        })
      }
      sections.push('')
    })
  }

  // Professional Memberships
  if (cvData.professionalMemberships && cvData.professionalMemberships.length > 0) {
    sections.push('PROFESSIONAL MEMBERSHIPS')
    cvData.professionalMemberships.forEach(membership => {
      sections.push(`• ${membership}`)
    })
    sections.push('')
  }

  // Publications & Research
  if (cvData.publicationsResearch && cvData.publicationsResearch.length > 0) {
    sections.push('PUBLICATIONS & RESEARCH')
    cvData.publicationsResearch.forEach((pub, index) => {
      sections.push(`${index + 1}. ${pub.title}`)
      if (pub.content && pub.content.length > 0) {
        pub.content.forEach(item => {
          sections.push(`   • ${item}`)
        })
      }
      sections.push('')
    })
  }

  // Hobbies
  if (cvData.hobbies && cvData.hobbies.length > 0) {
    sections.push('HOBBIES & INTERESTS')
    sections.push(cvData.hobbies.join(', '))
    sections.push('')
  }

  // References
  if (cvData.references) {
    sections.push('REFERENCES')
    sections.push(cvData.references)
    sections.push('')
  }

  // Additional Information
  if (cvData.careerStage || cvData.industrySector || cvData.targetRegion || cvData.highestEducation) {
    sections.push('ADDITIONAL INFORMATION')
    if (cvData.careerStage) sections.push(`Career Stage: ${cvData.careerStage}`)
    if (cvData.industrySector) sections.push(`Industry Sector: ${cvData.industrySector}`)
    if (cvData.targetRegion) sections.push(`Target Region: ${cvData.targetRegion}`)
    if (cvData.highestEducation) sections.push(`Highest Education: ${cvData.highestEducation}`)
    sections.push('')
  }

  return sections.join('\n')
} 