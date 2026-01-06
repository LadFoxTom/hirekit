import { NextRequest, NextResponse } from 'next/server'
import { LetterData } from '@/types/letter'
import puppeteer from 'puppeteer'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Spacing } from 'docx'
import { LETTER_TEMPLATES } from '@/data/letterTemplates'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { letterData, format } = await request.json()

    if (!letterData) {
      return NextResponse.json(
        { error: 'Letter data is required' },
        { status: 400 }
      )
    }

    if (!format || !['pdf', 'docx'].includes(format)) {
      return NextResponse.json(
        { error: 'Format must be either "pdf" or "docx"' },
        { status: 400 }
      )
    }

    if (format === 'pdf') {
      // Generate PDF using Puppeteer to match preview exactly
      const pdfBuffer = await generatePDFContent(letterData)
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="motivation-letter-${new Date().toISOString().split('T')[0]}.pdf"`
        }
      })
    } else if (format === 'docx') {
      // Generate Word document using docx library
      const docxBuffer = await generateWordContent(letterData)

      return new NextResponse(docxBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="motivation-letter-${new Date().toISOString().split('T')[0]}.docx"`
        }
      })
    }

    return NextResponse.json(
      { error: 'Unsupported format' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error generating letter download:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generatePDFContent(letterData: LetterData): Promise<Buffer> {
  const template = LETTER_TEMPLATES.find((t) => t.id === letterData.template) || LETTER_TEMPLATES[0]
  const styles = template.styles

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const renderAddress = (address?: string) => {
    if (!address) return ''
    return address.split('\n').join('<br>')
  }

  // Generate HTML that matches the preview exactly
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Letter Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: '${styles.fontFamily}', serif;
            background: white;
            color: #111827;
            line-height: ${styles.lineSpacing};
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .letter-container {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0 auto;
            background: white;
            font-size: ${styles.fontSize};
            text-align: ${styles.alignment};
          }
          
          .sender-info {
            margin-bottom: 24px;
          }
          
          .sender-name {
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 4px;
          }
          
          .sender-details {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.4;
          }
          
          .date {
            margin-bottom: 24px;
          }
          
          .recipient-info {
            margin-bottom: 24px;
          }
          
          .recipient-name {
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .recipient-details {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.4;
          }
          
          .subject-line {
            font-weight: 600;
            margin-bottom: 24px;
          }
          
          .salutation {
            margin-bottom: 24px;
          }
          
          .opening {
            margin-bottom: 16px;
            line-height: 1.6;
          }
          
          .body-content {
            margin-bottom: 24px;
          }
          
          .body-paragraph {
            margin-bottom: 16px;
            line-height: 1.6;
          }
          
          .closing {
            margin-bottom: 24px;
            line-height: 1.6;
          }
          
          .signature-section {
            margin-top: 32px;
          }
          
          .signature-name {
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .signature-text {
            color: #6b7280;
            font-style: italic;
            margin-top: 16px;
          }
          
          @media print {
            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .letter-container { 
              width: 210mm !important;
              min-height: 297mm !important;
              padding: 18mm 12mm 18mm 12mm !important;
              margin: 0 !important;
              box-shadow: none !important;
              border: none !important;
              transform: none !important;
            }
          }
          
          /* Additional CSS to ensure no header/footer space */
          @page {
            size: A4;
            margin: 0;
            /* Remove any header/footer space */
            @top-center { content: none; }
            @bottom-center { content: none; }
            @top-left { content: none; }
            @top-right { content: none; }
            @bottom-left { content: none; }
            @bottom-right { content: none; }
          }
        </style>
      </head>
      <body>
        <div class="letter-container">
          ${letterData.senderName ? `
            <div class="sender-info">
              <div class="sender-name">${letterData.senderName}</div>
              ${letterData.senderTitle ? `<div class="sender-details">${letterData.senderTitle}</div>` : ''}
              ${letterData.senderAddress ? `<div class="sender-details">${renderAddress(letterData.senderAddress)}</div>` : ''}
              ${letterData.senderEmail ? `<div class="sender-details">${letterData.senderEmail}</div>` : ''}
              ${letterData.senderPhone ? `<div class="sender-details">${letterData.senderPhone}</div>` : ''}
            </div>
          ` : ''}
          
          ${letterData.layout?.showDate !== false ? `
            <div class="date">${formatDate(letterData.applicationDate)}</div>
          ` : ''}
          
          ${(letterData.recipientName || letterData.companyName) ? `
            <div class="recipient-info">
              ${letterData.recipientName ? `<div class="recipient-name">${letterData.recipientName}</div>` : ''}
              ${letterData.recipientTitle ? `<div class="recipient-details">${letterData.recipientTitle}</div>` : ''}
              ${letterData.companyName ? `<div class="recipient-name">${letterData.companyName}</div>` : ''}
              ${letterData.companyAddress && letterData.layout?.showAddress !== false ? `<div class="recipient-details">${renderAddress(letterData.companyAddress)}</div>` : ''}
            </div>
          ` : ''}
          
          ${letterData.subject && letterData.layout?.showSubject !== false ? `
            <div class="subject-line">Subject: ${letterData.subject}</div>
          ` : ''}
          
          <div class="salutation">Dear ${letterData.recipientName ? letterData.recipientName.split(' ')[0] : 'Hiring Manager'},</div>
          
          ${letterData.opening ? `
            <div class="opening">${letterData.opening}</div>
          ` : ''}
          
          <div class="body-content">
            ${letterData.body && letterData.body.length > 0 
              ? letterData.body.map(paragraph => `<div class="body-paragraph">${paragraph}</div>`).join('')
              : '<div class="body-paragraph" style="color: #6b7280; font-style: italic;">Your letter content will appear here. Use the AI chat to generate your letter or edit it manually.</div>'
            }
          </div>
          
          ${letterData.closing ? `
            <div class="closing">${letterData.closing}</div>
          ` : ''}
          
          <div class="signature-section">
            <div>Sincerely,</div>
            <div class="signature-name">${letterData.senderName || 'Your Name'}</div>
            ${letterData.signature ? `<div class="signature-text">${letterData.signature}</div>` : ''}
          </div>
        </div>
      </body>
    </html>
  `

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-print-preview',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ],
  })
  const page = await browser.newPage()
  
  // Set additional page settings to ensure no headers/footers
  await page.evaluateOnNewDocument(() => {
    // Override any print styles that might add headers/footers
    const style = document.createElement('style');
    style.textContent = `
      @page {
        size: A4;
        margin: 0;
        @top-center { content: none !important; }
        @bottom-center { content: none !important; }
        @top-left { content: none !important; }
        @top-right { content: none !important; }
        @bottom-left { content: none !important; }
        @bottom-right { content: none !important; }
      }
    `;
    document.head.appendChild(style);
  });
  
  // Set the HTML content directly
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
  
  // Wait for fonts to load
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    displayHeaderFooter: false,
    preferCSSPageSize: true,
    // Additional options to ensure no headers/footers
    headerTemplate: '',
    footerTemplate: '',
  })
  await browser.close()

  return Buffer.from(pdfBuffer)
}

async function generateWordContent(letterData: LetterData): Promise<Buffer> {
  const template = LETTER_TEMPLATES.find((t) => t.id === letterData.template) || LETTER_TEMPLATES[0]
  const styles = template.styles

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const children: Paragraph[] = []

  // Add sender information
  if (letterData.senderName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: letterData.senderName,
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      })
    )
    
    if (letterData.senderTitle) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: letterData.senderTitle,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { after: 200 },
        })
      )
    }
    
    if (letterData.senderAddress) {
      letterData.senderAddress.split('\n').forEach(line => {
        if (line.trim()) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.trim(),
                  size: 20,
                  color: '666666',
                }),
              ],
              spacing: { after: 200 },
            })
          )
        }
      })
    }
    
    if (letterData.senderEmail) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: letterData.senderEmail,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { after: 200 },
        })
      )
    }
    
    if (letterData.senderPhone) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: letterData.senderPhone,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { after: 400 },
        })
      )
    }
  }

  // Add date
  if (letterData.layout?.showDate !== false) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formatDate(letterData.applicationDate),
            size: 24,
          }),
        ],
        spacing: { after: 400 },
      })
    )
  }

  // Add recipient information
  if (letterData.recipientName || letterData.companyName) {
    if (letterData.recipientName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: letterData.recipientName,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        })
      )
    }
    
    if (letterData.recipientTitle) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: letterData.recipientTitle,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { after: 200 },
        })
      )
    }
    
    if (letterData.companyName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: letterData.companyName,
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        })
      )
    }
    
    if (letterData.companyAddress && letterData.layout?.showAddress !== false) {
      letterData.companyAddress.split('\n').forEach(line => {
        if (line.trim()) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.trim(),
                  size: 20,
                  color: '666666',
                }),
              ],
              spacing: { after: 200 },
            })
          )
        }
      })
    }
    
    children.push(
      new Paragraph({
        spacing: { after: 400 },
      })
    )
  }

  // Add subject line
  if (letterData.subject && letterData.layout?.showSubject !== false) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Subject: ${letterData.subject}`,
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 400 },
      })
    )
  }

  // Add salutation
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Dear ${letterData.recipientName ? letterData.recipientName.split(' ')[0] : 'Hiring Manager'},`,
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    })
  )

  // Add opening
  if (letterData.opening) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: letterData.opening,
            size: 24,
          }),
        ],
        spacing: { after: 400 },
      })
    )
  }

  // Add body paragraphs
  if (letterData.body && letterData.body.length > 0) {
    letterData.body.forEach(paragraph => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: paragraph,
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        })
      )
    })
  } else {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Your letter content will appear here. Use the AI chat to generate your letter or edit it manually.',
            size: 24,
            color: '666666',
            italics: true,
          }),
        ],
        spacing: { after: 400 },
      })
    )
  }

  // Add closing
  if (letterData.closing) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: letterData.closing,
            size: 24,
          }),
        ],
        spacing: { after: 400 },
      })
    )
  }

  // Add signature
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Sincerely,',
          size: 24,
        }),
      ],
      spacing: { after: 400 },
    })
  )
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: letterData.senderName || 'Your Name',
          bold: true,
          size: 24,
        }),
      ],
      spacing: { after: 200 },
    })
  )
  
  if (letterData.signature) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: letterData.signature,
            size: 20,
            color: '666666',
            italics: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  return await Packer.toBuffer(doc)
} 