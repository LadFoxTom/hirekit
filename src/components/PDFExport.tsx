'use client'

import React, { useState } from 'react';
import { FaDownload, FaSpinner, FaFilePdf, FaFileWord, FaFileAlt, FaChevronDown, FaPrint } from 'react-icons/fa';
import { CVData } from '@/types/cv';
import { useRouter } from 'next/navigation';

interface PDFExportProps {
  cvData: CVData;
  fileName?: string;
}

const EXPORT_FORMATS = [
  {
    id: 'print',
    name: 'Print',
    icon: FaPrint,
    description: 'Print directly from browser',
    color: 'text-green-600'
  },
  {
    id: 'pdf',
    name: 'PDF',
    icon: FaFilePdf,
    description: 'Professional PDF format',
    color: 'text-red-600'
  },
  {
    id: 'docx',
    name: 'DOCX',
    icon: FaFileWord,
    description: 'Microsoft Word format',
    color: 'text-blue-600'
  },
  {
    id: 'txt',
    name: 'Plain Text',
    icon: FaFileAlt,
    description: 'Simple text format',
    color: 'text-gray-600'
  }
];

const PDFExport: React.FC<PDFExportProps> = ({ cvData, fileName = 'cv' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFormats, setShowFormats] = useState(false);

  const handleExport = async (format: string) => {
    setLoading(true);
    setError(null);
    setShowFormats(false);
    
    try {
      switch (format) {
        case 'print':
          handlePrint();
          break;
        case 'pdf':
          await exportPDF();
          break;
        case 'docx':
          await exportDOCX();
          break;
        case 'txt':
          await exportTXT();
          break;
        default:
          throw new Error('Unsupported format');
      }
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export CV');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Store CV data for print page
    if (typeof window !== 'undefined') {
      localStorage.setItem('cvDataForPrint', JSON.stringify(cvData));
      
      // Open print page in new window
      const printUrl = `/print-cv?data=${encodeURIComponent(JSON.stringify(cvData))}`;
      const printWindow = window.open(printUrl, '_blank');
      
      if (printWindow) {
        // Wait for page to load then trigger print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        };
      }
    }
  };

  const exportPDF = async () => {
    try {
      console.log('Exporting PDF with data:', cvData);
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cvData, 
          fileName,
          priority: 'high' // High priority for immediate download
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          throw new Error(`Rate limit exceeded. Please try again in ${errorData.retryAfter} seconds.`);
        }
        
        const errorText = await response.text();
        console.error('PDF export response error:', response.status, errorText);
        throw new Error(`Failed to generate PDF: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF export error:', error);
      throw new Error('Failed to generate PDF');
    }
  };

  const exportPDFAsync = async () => {
    try {
      console.log('Queuing PDF generation:', cvData);
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cvData, 
          fileName,
          priority: 'normal' // Normal priority for background generation
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          throw new Error(`Rate limit exceeded. Please try again in ${errorData.retryAfter} seconds.`);
        }
        
        const errorText = await response.text();
        throw new Error(`Failed to queue PDF: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      if (result.jobId) {
        // Poll for completion
        return pollForPDF(result.jobId, fileName);
      } else {
        throw new Error('No job ID returned');
      }
    } catch (error) {
      console.error('PDF queue error:', error);
      throw new Error('Failed to queue PDF generation');
    }
  };

  const pollForPDF = async (jobId: string, fileName: string) => {
    const maxAttempts = 30; // 30 seconds max
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`/api/generate-pdf?jobId=${jobId}`);
        
        if (response.status === 202) {
          // Still processing
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
          continue;
        }
        
        if (response.ok) {
          // PDF ready
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fileName}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return;
        }
        
        if (response.status === 500) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'PDF generation failed');
        }
        
        throw new Error('Unexpected response status');
      } catch (error) {
        if (attempts === maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
    }
    
    throw new Error('PDF generation timeout');
  };

  const exportDOCX = async () => {
    try {
      console.log('Exporting DOCX with data:', cvData);
      
      const response = await fetch('/api/export/docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DOCX export response error:', response.status, errorText);
        throw new Error(`Failed to generate DOCX: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('DOCX export error:', error);
      throw new Error('Failed to generate DOCX');
    }
  };

  const exportTXT = async () => {
    const textContent = generateTextContent(cvData);
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const generateTextContent = (data: CVData) => {
    let content = '';
    
    // Header
    if (data.fullName) content += `${data.fullName}\n`;
    if (data.title) content += `${data.title}\n`;
    if (data.contact?.email) content += `Email: ${data.contact.email}\n`;
    if (data.contact?.phone) content += `Phone: ${data.contact.phone}\n`;
    if (data.contact?.location) content += `Location: ${data.contact.location}\n`;
    content += '\n';
    
    // Summary
    if (data.summary && data.summary.length > 0) {
      content += 'PROFESSIONAL SUMMARY\n';
      content += '==================\n';
      if (Array.isArray(data.summary)) {
        data.summary.forEach(line => content += `${line}\n`);
      } else {
        content += `${data.summary}\n`;
      }
      content += '\n';
    }
    
    // Experience
    if (data.experience && data.experience.length > 0) {
      content += 'WORK EXPERIENCE\n';
      content += '================\n';
      data.experience.forEach(exp => {
        content += `${exp.title}\n`;
        exp.content?.forEach(line => content += `• ${line}\n`);
        content += '\n';
      });
    }
    
    // Education
    if (data.education && data.education.length > 0) {
      content += 'EDUCATION\n';
      content += '=========\n';
      data.education.forEach(edu => {
        content += `${edu.degree}\n`;
        content += '\n';
      });
    }
    
    // Skills
    if (data.skills && (Array.isArray(data.skills) ? data.skills.length > 0 : 
      (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + 
      (data.skills.tools?.length || 0) + (data.skills.industry?.length || 0) > 0)) {
      content += 'SKILLS\n';
      content += '======\n';
      const allSkills = Array.isArray(data.skills) 
        ? data.skills 
        : [
            ...(data.skills.technical || []),
            ...(data.skills.soft || []),
            ...(data.skills.tools || []),
            ...(data.skills.industry || [])
          ];
      content += allSkills.join(', ') + '\n\n';
    }
    
    return content;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFormats(!showFormats)}
        className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaDownload className="mr-2" />}
        Export CV
        <FaChevronDown className={`ml-2 transition-transform ${showFormats ? 'rotate-180' : ''}`} />
      </button>
      
      {showFormats && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {EXPORT_FORMATS.map((format) => {
              const IconComponent = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <IconComponent className={`text-lg ${format.color}`} />
                  <div>
                    <div className="font-medium text-gray-900">{format.name}</div>
                    <div className="text-sm text-gray-500">{format.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
    </div>
  );
};

export default PDFExport; 