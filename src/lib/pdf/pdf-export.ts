// @ts-nocheck
import { CVData } from '@/types/cv'
import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'
import { createElement } from 'react'

/**
 * Export CV to PDF format
 * Uses React-PDF for guaranteed preview = export consistency
 */
export async function exportToPDF(
  data: CVData, 
  processedPhotoUrl?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data || !data.fullName) {
      throw new Error('CV data is incomplete')
    }

    // Dynamic imports to avoid SSR issues with react-pdf
    const { pdf } = await import('@react-pdf/renderer')
    const { CVDocumentPDF } = await import('@/components/pdf/CVDocumentPDF')

    // Generate PDF blob using React-PDF with processed photo
    const blob = await pdf(
      createElement(CVDocumentPDF, { 
        data, 
        processedPhotoUrl: processedPhotoUrl || undefined 
      })
    ).toBlob()
    
    // Create filename
    const filename = `${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    
    // Trigger download
    saveAs(blob, filename)
    
    return { success: true }
  } catch (error) {
    console.error('PDF export failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to export PDF' 
    }
  }
}

/**
 * Export CV to DOCX format
 * Uses docx library for Word document generation
 */
export async function exportToDOCX(data: CVData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data || !data.fullName) {
      throw new Error('CV data is incomplete')
    }

    const children: any[] = []

    // Header - Name
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.fullName,
            bold: true,
            size: 48, // 24pt
            color: '1a1a1a',
          }),
        ],
        spacing: { after: 100 },
      })
    )

    // Headline
    if (data.professionalHeadline || data.title) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.professionalHeadline || data.title || '',
              size: 24, // 12pt
              color: '4a4a4a',
            }),
          ],
          spacing: { after: 100 },
        })
      )
    }

    // Contact info
    const contactParts: string[] = []
    if (data.contact?.email) contactParts.push(data.contact.email)
    if (data.contact?.phone) contactParts.push(data.contact.phone)
    if (data.contact?.location) contactParts.push(data.contact.location)
    if (data.contact?.linkedin) contactParts.push(data.contact.linkedin)

    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactParts.join(' | '),
              size: 18, // 9pt
              color: '666666',
            }),
          ],
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '2563eb',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 12,
            },
          },
        })
      )
    }

    // Summary
    if (data.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'PROFESSIONAL SUMMARY',
              bold: true,
              size: 24,
              color: '2563eb',
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      )
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.summary,
              size: 20,
              color: '333333',
            }),
          ],
          spacing: { after: 200 },
        })
      )
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'EXPERIENCE',
              bold: true,
              size: 24,
              color: '2563eb',
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      )

      data.experience.forEach((exp) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.title,
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: exp.dates ? `  |  ${exp.dates}` : '',
                size: 18,
                color: '666666',
              }),
            ],
            spacing: { before: 100 },
          })
        )

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.company}${exp.type ? ` · ${exp.type}` : ''}`,
                size: 20,
                color: '4a4a4a',
              }),
            ],
            spacing: { after: 50 },
          })
        )

        const achievements = exp.achievements || exp.content || []
        achievements.forEach((achievement) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${achievement}`,
                  size: 19,
                  color: '333333',
                }),
              ],
              spacing: { after: 40 },
            })
          )
        })
      })
    }

    // Education
    if (data.education && data.education.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'EDUCATION',
              bold: true,
              size: 24,
              color: '2563eb',
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      )

      data.education.forEach((edu) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: edu.dates ? `  |  ${edu.dates}` : '',
                size: 18,
                color: '666666',
              }),
            ],
            spacing: { before: 100 },
          })
        )

        if (edu.institution) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.institution,
                  size: 20,
                  color: '4a4a4a',
                }),
              ],
              spacing: { after: 100 },
            })
          )
        }
      })
    }

    // Skills
    const technicalSkills = data.technicalSkills?.split(',').map(s => s.trim()).filter(Boolean) || []
    const softSkills = data.softSkills?.split(',').map(s => s.trim()).filter(Boolean) || []
    
    if (technicalSkills.length > 0 || softSkills.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'SKILLS',
              bold: true,
              size: 24,
              color: '2563eb',
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      )

      if (technicalSkills.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Technical: ',
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: technicalSkills.join(', '),
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        )
      }

      if (softSkills.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Soft Skills: ',
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: softSkills.join(', '),
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        )
      }
    }

    // Languages
    if (data.languages && data.languages.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'LANGUAGES',
              bold: true,
              size: 24,
              color: '2563eb',
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      )

      const langStrings = data.languages.map(lang => {
        if (typeof lang === 'string') return lang
        if ((lang as any).language) return `${(lang as any).language} (${(lang as any).proficiency || 'Fluent'})`
        return String(lang)
      })

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: langStrings.join(' • '),
              size: 20,
            }),
          ],
        })
      )
    }

    // Create document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      }],
    })

    // Generate and download
    const blob = await Packer.toBlob(doc)
    const filename = `${data.fullName.replace(/\s+/g, '_')}_Resume.docx`
    saveAs(blob, filename)

    return { success: true }
  } catch (error) {
    console.error('DOCX export failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to export DOCX' 
    }
  }
}

/**
 * Get PDF as base64 string (for API uploads, etc.)
 */
export async function getPDFBase64(data: CVData): Promise<string> {
  const blob = await pdf(createElement(CVDocumentPDF, { data })).toBlob()
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Get PDF blob (for custom handling)
 */
export async function getPDFBlob(data: CVData): Promise<Blob> {
  return await pdf(createElement(CVDocumentPDF, { data })).toBlob()
}

