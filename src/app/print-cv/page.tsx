'use client'

import { useState, useEffect } from 'react'
import { CVPreview } from '@/components/CVPreview'

function decodeCVData(encoded: string) {
  try {
    return JSON.parse(decodeURIComponent(encoded));
  } catch {
    return null;
  }
}

export default function PrintCVPage({ searchParams }: { searchParams: { data?: string } }) {
  let initialCVData = null;
  if (searchParams?.data) {
    initialCVData = decodeCVData(searchParams.data);
  }

  // Client-side fallback: if no data in query, try localStorage
  const [cvData, setCVData] = useState<any>(initialCVData);
  useEffect(() => {
    if (!cvData && typeof window !== 'undefined') {
      const stored = localStorage.getItem('cvDataForPrint');
      if (stored) setCVData(JSON.parse(stored));
    }
  }, [cvData]);

  // Add meta tags for better print handling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Add meta tag to help with print settings
      const meta = document.createElement('meta');
      meta.name = 'print-color-adjust';
      meta.content = 'exact';
      document.head.appendChild(meta);
    }
  }, []);

  if (!cvData) {
    return <div>No CV data provided.</div>;
  }
  
  return (
    <div className="print-cv-root bg-white min-h-screen">
      {/* Print & Download Buttons (hidden in print) */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 print:hidden z-50">
        <button
          onClick={() => {
            // Show instructions for disabling headers/footers
            const instructions = `
To remove headers and footers from your PDF:

CHROME/EDGE:
1. Click "More settings" in the print dialog
2. Uncheck "Headers and footers"

FIREFOX:
1. Click "Page Setup" in the print dialog
2. Uncheck "Headers/footers"

SAFARI:
1. Click "Show Details" in the print dialog
2. Uncheck "Headers and footers"

Alternatively, use the "Download PDF" button below for a clean PDF without headers/footers.
            `;
            alert(instructions);
            setTimeout(() => window.print(), 100);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Print (with instructions)
        </button>
        <button
          onClick={async () => {
            try {
              const res = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cvData, fileName: 'cv' }),
              });
              if (!res.ok) {
                throw new Error('Failed to generate PDF');
              }
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'cv.pdf';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            } catch (error) {
              console.error('PDF generation error:', error);
              alert('Failed to generate PDF: ' + error);
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>
      
      {/* Print-specific styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body, html, .print-cv-root { 
              margin: 0 !important; 
              padding: 0 !important; 
              background: white !important; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .cv-print-container, .a4-page { 
              box-shadow: none !important; 
            }
            .print-cv-root {
              max-width: none !important;
              width: 100% !important;
            }
            /* Hide all non-essential elements */
            .print\\:hidden {
              display: none !important;
            }
            /* Ensure proper page breaks */
            .cv-section {
              page-break-inside: avoid;
            }
            /* Ensure images maintain aspect ratio and use object-fit correctly in PDF */
            img.object-cover {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              max-width: none !important;
              flex-shrink: 0;
            }
            /* Override global img styles for images in fixed containers */
            .overflow-hidden img,
            [class*="overflow-hidden"] img,
            div[class*="w-24"][class*="h-24"] img,
            div[class*="w-32"][class*="h-32"] img {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              max-width: none !important;
            }
            /* Optimize for A4 */
            @page {
              size: A4;
              margin: 20mm;
              /* Remove any header/footer space */
              @top-center { content: none !important; }
              @bottom-center { content: none !important; }
              @top-left { content: none !important; }
              @top-right { content: none !important; }
              @bottom-left { content: none !important; }
              @bottom-right { content: none !important; }
            }
          }
          
          /* Screen styles */
          @media screen {
            .print-cv-root {
              padding: 20px;
              max-width: 210mm;
              margin: 0 auto;
              background: white;
              min-height: 297mm;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
          }
        `
      }} />
      
      <CVPreview data={cvData} isPreview={true} />
    </div>
  );
}