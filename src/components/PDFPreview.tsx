'use client'

import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { CVPDFDocument } from './CVPdfDocument';
import { 
  FaExpand, 
  FaCompress, 
  FaDownload
} from 'react-icons/fa';

interface PDFPreviewProps {
  data: CVData;
  className?: string;
  showControls?: boolean;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  data,
  className = '',
  showControls = true
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <div className={`pdf-preview ${isFullscreen ? 'fullscreen' : ''} ${className}`}>
      {/* Controls */}
      {showControls && (
        <div className="preview-controls">
          <div className="view-controls">
            <PDFDownloadLink
              document={<CVPDFDocument data={data} />}
              fileName={`${data.fullName || 'CV'}_Resume.pdf`}
              className="control-button"
            >
              {({ blob, url, loading, error }) => (
                <button
                  className="control-button"
                  disabled={loading}
                  aria-label="Download PDF"
                >
                  <FaDownload />
                </button>
              )}
            </PDFDownloadLink>
            
            <button
              onClick={toggleFullscreen}
              className="control-button"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      <div className="pdf-viewer-container">
        <PDFViewer
          width="100%"
          height="800px"
          showToolbar={false}
        >
          <CVPDFDocument data={data} />
        </PDFViewer>
      </div>

      {/* Styles */}
      <style jsx>{`
        .pdf-preview {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f5f5f5;
          position: relative;
        }

        .pdf-preview.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          background: white;
        }

        .preview-controls {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e5e5e5;
          flex-shrink: 0;
        }

        .view-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
        }

        .control-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pdf-viewer-container {
          flex: 1;
          overflow: visible;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 1rem;
          min-height: 800px; /* Match the PDFViewer height */
          height: auto; /* Let it size based on content */
        }

        .pdf-viewer-container :global(.react-pdf__Document) {
          height: auto;
          min-height: 100%;
        }

        .pdf-viewer-container :global(.react-pdf__Page) {
          margin: 0 auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-radius: 0.5rem;
          width: 100% !important;
          height: auto !important;
          max-width: 794px; /* A4 width in pixels at 96 DPI */
          min-height: 800px; /* Match the PDFViewer height for better display */
        }

        /* Ensure the PDFViewer iframe has proper dimensions */
        .pdf-viewer-container :global(iframe) {
          width: 100% !important;
          height: 800px !important;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default PDFPreview;
