import { CVPreviewServer } from '@/components/CVPreviewServer'

function decodeCVData(encoded: string) {
  try {
    // Decode base64 data
    const jsonString = Buffer.from(encoded, 'base64').toString('utf-8');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding CV data:', error);
    return null;
  }
}

export default function PrintCVServerPage({ searchParams }: { searchParams: { data?: string } }) {
  let cvData = null;
  if (searchParams?.data) {
    cvData = decodeCVData(searchParams.data);
  }

  if (!cvData) {
    return (
      <div className="print-cv-root bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No CV Data Provided</h1>
          <p className="text-gray-600">Please provide CV data to generate the PDF.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="print-cv-root bg-white min-h-screen">
      {/* Font loading for Puppeteer */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Lora:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Source+Code+Pro:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Additional font loading to ensure fonts are available */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Lora:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Source+Code+Pro:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600;700&display=swap');
          
          /* Ensure fonts are loaded and applied */
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          /* Force font loading for common fonts */
          .font-inter { font-family: 'Inter', sans-serif !important; }
          .font-roboto { font-family: 'Roboto', sans-serif !important; }
          .font-poppins { font-family: 'Poppins', sans-serif !important; }
          .font-montserrat { font-family: 'Montserrat', sans-serif !important; }
          .font-open-sans { font-family: 'Open Sans', sans-serif !important; }
          .font-dm-sans { font-family: 'DM Sans', sans-serif !important; }
          .font-merriweather { font-family: 'Merriweather', serif !important; }
          .font-playfair { font-family: 'Playfair Display', serif !important; }
          .font-crimson { font-family: 'Crimson Text', serif !important; }
          .font-lora { font-family: 'Lora', serif !important; }
          .font-nunito { font-family: 'Nunito', sans-serif !important; }
          .font-quicksand { font-family: 'Quicksand', sans-serif !important; }
          .font-jetbrains { font-family: 'JetBrains Mono', monospace !important; }
          .font-source-code { font-family: 'Source Code Pro', monospace !important; }
          .font-fira-code { font-family: 'Fira Code', monospace !important; }
          
          /* Additional font loading to ensure all fonts are available */
          @font-face {
            font-family: 'Inter';
            src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: 'Roboto';
            src: url('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          
          @font-face {
            font-family: 'Poppins';
            src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
        `
      }} />
      
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
      
      <CVPreviewServer data={cvData} isPreview={true} />
    </div>
  );
} 