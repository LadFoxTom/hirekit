/**
 * Document Extraction API
 * 
 * Extracts text content from uploaded documents (PDF, DOC, TXT, etc.)
 * and returns it for the chat agent to process.
 */

import { NextRequest, NextResponse } from 'next/server';

// PDF parsing - dynamic import to avoid issues
let pdfParse: any = null;

async function getPdfParser() {
  if (!pdfParse) {
    pdfParse = (await import('pdf-parse')).default;
  }
  return pdfParse;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[Extract] Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    const fileName = file.name.toLowerCase();
    let extractedText = '';
    let fileType = 'unknown';

    // Handle different file types
    if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
      fileType = 'pdf';
      extractedText = await extractFromPDF(file);
    } else if (
      file.type === 'text/plain' || 
      fileName.endsWith('.txt') ||
      fileName.endsWith('.md')
    ) {
      fileType = 'text';
      extractedText = await file.text();
    } else if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx')
    ) {
      fileType = 'word';
      // For Word docs, we'll extract what we can - basic text extraction
      extractedText = await extractFromWord(file);
    } else if (
      file.type === 'application/json' ||
      fileName.endsWith('.json')
    ) {
      fileType = 'json';
      extractedText = await file.text();
    } else {
      // Try to read as text
      try {
        extractedText = await file.text();
        fileType = 'text';
      } catch {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a PDF, TXT, or DOC file.' },
          { status: 400 }
        );
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract any text from the file. The file may be empty or corrupted.' },
        { status: 400 }
      );
    }

    // Clean up the extracted text
    extractedText = cleanExtractedText(extractedText);

    console.log('[Extract] Successfully extracted', extractedText.length, 'characters from', fileType);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType,
      textLength: extractedText.length,
      extractedText,
      preview: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
    });

  } catch (error) {
    console.error('[Extract] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the file. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Extract text from PDF file
 */
async function extractFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const pdf = await getPdfParser();
    const data = await pdf(buffer);
    
    return data.text || '';
  } catch (error) {
    console.error('[Extract PDF] Error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from Word document
 * Basic extraction - for full support would need mammoth.js
 */
async function extractFromWord(file: File): Promise<string> {
  try {
    // For DOCX files, we can try to extract the XML content
    const arrayBuffer = await file.arrayBuffer();
    
    // DOCX files are ZIP archives containing XML
    // For basic extraction, we'll try to read it as text
    // For production, use mammoth.js for proper Word parsing
    
    const text = await file.text();
    
    // Try to extract readable content
    // Remove XML tags if present
    const cleanedText = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (cleanedText.length > 100) {
      return cleanedText;
    }
    
    // If we couldn't extract meaningful text, return a message
    return `[Word Document: ${file.name}] - For best results with Word documents, please copy and paste the content directly or convert to PDF first.`;
    
  } catch (error) {
    console.error('[Extract Word] Error:', error);
    return `[Word Document: ${file.name}] - Could not extract text. Please copy and paste the content directly.`;
  }
}

/**
 * Clean up extracted text
 */
function cleanExtractedText(text: string): string {
  return text
    // Normalize whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive newlines
    .replace(/\n{4,}/g, '\n\n\n')
    // Remove excessive spaces
    .replace(/[ \t]{3,}/g, '  ')
    // Trim
    .trim();
}










