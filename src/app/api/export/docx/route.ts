import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Spacing } from 'docx'

export async function POST(request: NextRequest) {
  try {
    const { cvData } = await request.json()

    const children: Paragraph[] = []

    // Header section
    if (cvData.fullName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.fullName,
              bold: true,
              size: 32,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      )
    }
    
    if (cvData.title) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.title,
              size: 20,
              color: '374151',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      )
    }
    
    // Contact information
    if (cvData.contact) {
      const contactInfo = []
      if (cvData.contact.email) contactInfo.push(`📧 ${cvData.contact.email}`)
      if (cvData.contact.phone) contactInfo.push(`📞 ${cvData.contact.phone}`)
      if (cvData.contact.location) contactInfo.push(`📍 ${cvData.contact.location}`)
      
      if (contactInfo.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contactInfo.join(' • '),
                size: 16,
                color: '6b7280',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        )
      }
    }
    
    // Social links
    if (cvData.social) {
      const socialInfo: string[] = []
      Object.entries(cvData.social).forEach(([platform, url]) => {
        if (url) {
          const icon = getSocialIcon(platform)
          socialInfo.push(`${icon} ${url}`)
        }
      })
      
      if (socialInfo.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: socialInfo.join(' • '),
                size: 16,
                color: '6b7280',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        )
      }
    }
    
    // Summary section
    if (cvData.summary && cvData.summary.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Professional Summary',
              bold: true,
              size: 20,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      )
      
      const summaryText = Array.isArray(cvData.summary) ? cvData.summary.join(' ') : cvData.summary;
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: summaryText,
              size: 16,
              color: '374151',
            }),
          ],
          spacing: { after: 400 },
        })
      )
    }
    
    // Experience section
    if (cvData.experience && cvData.experience.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Work Experience',
              bold: true,
              size: 20,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      )
      
      cvData.experience.forEach((exp: any) => {
        // Job title
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.title,
                bold: true,
                size: 18,
                color: '111827',
              }),
            ],
            spacing: { after: 100 },
          })
        )
        
        // Company and period
        const company = exp.company || '';
        const period = exp.dates || exp.period || '';
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${company} • ${period}`,
                size: 16,
                color: '6b7280',
              }),
            ],
            spacing: { after: 200 },
          })
        )
        
        // Achievements
        const achievements = exp.achievements || exp.content || [];
        if (achievements.length > 0) {
          achievements.forEach((achievement: string) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: '• ',
                    size: 16,
                    color: '2563eb',
                  }),
                  new TextRun({
                    text: achievement,
                    size: 16,
                    color: '374151',
                  }),
                ],
                spacing: { after: 100 },
                indent: { left: 400 },
              })
            )
          })
        }
        
        children.push(
          new Paragraph({
            spacing: { after: 300 },
          })
        )
      })
    }
    
    // Education section
    if (cvData.education && cvData.education.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Education',
              bold: true,
              size: 20,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      )
      
      cvData.education.forEach((edu: any) => {
        // Degree
        const degree = edu.degree || edu.title || '';
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: degree,
                bold: true,
                size: 18,
                color: '111827',
              }),
            ],
            spacing: { after: 100 },
          })
        )
        
        // Institution and period
        const institution = edu.institution || edu.school || '';
        const period = edu.dates || edu.period || '';
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${institution} • ${period}`,
                size: 16,
                color: '6b7280',
              }),
            ],
            spacing: { after: 200 },
          })
        )
        
        // Description or achievements
        const description = edu.description || '';
        const achievements = edu.achievements || edu.content || [];
        const content = description || achievements.join(' ');
        
        if (content) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: content,
                  size: 16,
                  color: '374151',
                }),
              ],
              spacing: { after: 300 },
            })
          )
        }
      })
    }
    
    // Skills section - handle both array and object formats
    const skillsArray = cvData.skills 
      ? (Array.isArray(cvData.skills) 
          ? cvData.skills 
          : [...(cvData.skills.technical || []), ...(cvData.skills.soft || []), ...(cvData.skills.tools || []), ...(cvData.skills.industry || [])])
      : [];
    if (skillsArray.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Skills',
              bold: true,
              size: 20,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      )
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: skillsArray.join(', '),
              size: 16,
              color: '374151',
            }),
          ],
          spacing: { after: 400 },
        })
      )
    }
    
    // Languages section
    if (cvData.languages && cvData.languages.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Languages',
              bold: true,
              size: 20,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      )
      
      const languageText = cvData.languages.map((lang: any) => 
        `${lang.language} (${lang.level})`
      ).join(', ')
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: languageText,
              size: 16,
              color: '374151',
            }),
          ],
          spacing: { after: 400 },
        })
      )
    }
    
    // Certifications section
    if (cvData.certifications && cvData.certifications.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Certifications',
              bold: true,
              size: 20,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      )
      
      cvData.certifications.forEach((cert: any) => {
        // Certification name
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.name,
                bold: true,
                size: 18,
                color: '111827',
              }),
            ],
            spacing: { after: 100 },
          })
        )
        
        // Issuer and date
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${cert.issuer} • ${cert.date}`,
                size: 16,
                color: '6b7280',
              }),
            ],
            spacing: { after: 200 },
          })
        )
        
        // Description
        if (cert.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: cert.description,
                  size: 16,
                  color: '374151',
                }),
              ],
              spacing: { after: 300 },
            })
          )
        }
      })
    }
    
    // Projects section
    if (cvData.projects && cvData.projects.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Projects',
              bold: true,
              size: 20,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      )
      
      cvData.projects.forEach((project: any) => {
        // Project name
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.name,
                bold: true,
                size: 18,
                color: '111827',
              }),
            ],
            spacing: { after: 100 },
          })
        )
        
        // Technologies
        if (project.technologies) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.technologies,
                  size: 16,
                  color: '6b7280',
                }),
              ],
              spacing: { after: 200 },
            })
          )
        }
        
        // Description
        if (project.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.description,
                  size: 16,
                  color: '374151',
                }),
              ],
              spacing: { after: 300 },
            })
          )
        }
      })
    }
    
    // Hobbies section
    if (cvData.hobbies && cvData.hobbies.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Hobbies & Interests',
              bold: true,
              size: 20,
              color: '2563eb',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        })
      )
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.hobbies.join(', '),
              size: 16,
              color: '374151',
            }),
          ],
          spacing: { after: 400 },
        })
      )
    }

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children,
      }],
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="cv.docx"`,
      },
    })
  } catch (error) {
    console.error('Error generating DOCX:', error)
    return NextResponse.json(
      { error: 'Failed to generate DOCX' },
      { status: 500 }
    )
  }
}

function getSocialIcon(platform: string): string {
  const icons: { [key: string]: string } = {
    linkedin: '🔗',
    github: '🐙',
    twitter: '🐦',
    website: '🌐',
    portfolio: '📁',
    facebook: '📘',
    instagram: '📷',
    youtube: '📺',
    default: '🔗'
  }
  return icons[platform.toLowerCase()] || icons.default
} 