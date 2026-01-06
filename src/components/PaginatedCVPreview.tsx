import React, { useRef, useEffect, useState } from 'react';
import { CVData } from '@/types/cv';
import { CVPreview } from './CVPreview';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

interface PaginatedCVPreviewProps {
  data: CVData;
  onDataChange?: (data: CVData) => void;
  className?: string;
  showControls?: boolean;
  initialPage?: number;
}

// Helper function to split CV content into pages
const splitContentIntoPages = (data: CVData) => {
  const pages = [];
  
  // Page 1: Header + Summary + First Experience
  const page1 = {
    showHeader: true,
    showSummary: true,
    showExperience: !!(data.experience && data.experience.length > 0),
    showEducation: false,
    showSkills: false,
    showLanguages: false,
    showCertifications: false,
    showProjects: false,
    showHobbies: false,
    experience: data.experience ? data.experience.slice(0, 1) : []
  };
  pages.push(page1);
  
  // Page 2: Additional Experience + Education
  if ((data.experience && data.experience.length > 1) || (data.education && data.education.length > 0)) {
    const page2 = {
      showHeader: false,
      showSummary: false,
      showExperience: !!(data.experience && data.experience.length > 1),
      showEducation: true,
      showSkills: false,
      showLanguages: false,
      showCertifications: false,
      showProjects: false,
      showHobbies: false,
      experience: data.experience ? data.experience.slice(1) : []
    };
    pages.push(page2);
  }
  
  // Page 3: Skills, Languages, Certifications, Projects, Hobbies
  if (data.skills || (data.languages && data.languages.length > 0) || 
      data.certifications || data.projects || (data.hobbies && data.hobbies.length > 0)) {
    const page3 = {
      showHeader: false,
      showSummary: false,
      showExperience: false,
      showEducation: false,
      showSkills: true,
      showLanguages: true,
      showCertifications: true,
      showProjects: true,
      showHobbies: true,
      experience: []
    };
    pages.push(page3);
  }
  
  return pages;
};

export const PaginatedCVPreview: React.FC<PaginatedCVPreviewProps> = ({
  data,
  onDataChange,
  className = '',
  showControls = true,
  initialPage = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(initialPage - 1);
  const [autoZoom, setAutoZoom] = useState(1);

  const pages = splitContentIntoPages(data);
  const totalPages = pages.length;

  // Calculate auto-zoom based on container size
  useEffect(() => {
    const calculateAutoZoom = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 64; // Account for padding and margins
      const containerHeight = container.clientHeight - 100; // Account for controls
      
      // Calculate zoom to fit both width and height
      const widthZoom = containerWidth / A4_WIDTH;
      const heightZoom = containerHeight / A4_HEIGHT;
      
      // Use the smaller zoom to ensure the entire page fits
      const calculatedZoom = Math.min(widthZoom, heightZoom, 1); // Don't zoom beyond 100%
      
      setAutoZoom(Math.max(calculatedZoom, 0.3)); // Minimum 30% zoom
    };

    calculateAutoZoom();
    
    const resizeObserver = new ResizeObserver(calculateAutoZoom);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [currentPage]); // Recalculate when page changes

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentPageData = pages[currentPage] || pages[0];

  return (
    <div className={`paginated-cv-preview ${className}`}>
      {/* Page Navigation Controls */}
      {showControls && totalPages > 1 && (
        <div className="page-navigation">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="nav-button"
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>
          
          <span className="page-indicator">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            className="nav-button"
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Content - Show current page */}
      <div 
        ref={containerRef}
        className="preview-content"
        style={{
          overflow: 'auto',
          background: '#f8fafc',
          width: '100%',
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          padding: '16px',
          margin: 0,
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        <div
          className="cv-page-container"
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT, // Fixed height to match A4 page
            transform: `scale(${autoZoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s',
            boxSizing: 'content-box',
            margin: 0,
            padding: '60px 48px', // 0.75 inch margins (60pt = 0.75 inch at 72 DPI)
            display: 'block',
            position: 'relative',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden', // Hide content that extends beyond page boundary
          }}
        >
          <CVPreview 
            data={data} 
            isPreview={true}
            pageConfig={currentPageData}
          />
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .paginated-cv-preview {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f5f5f5;
        }

        .page-navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e5e5e5;
          flex-shrink: 0;
        }

        .nav-button {
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
        }

        .nav-button:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-indicator {
          font-weight: 500;
          color: #374151;
          min-width: 100px;
          text-align: center;
        }

        .preview-content {
          flex: 1;
          min-height: 600px;
        }
      `}</style>
    </div>
  );
};

export default PaginatedCVPreview;