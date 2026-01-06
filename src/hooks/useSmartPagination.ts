// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';

interface Section {
  id: string;
  height: number;
  type: 'header' | 'content' | 'list' | 'experience' | 'education';
  keepWithNext?: boolean;
  minHeight?: number;
}

interface PaginationConfig {
  pageHeight: number; // A4 height in pixels
  minSectionHeight: number; // Don't break if section < this
  orphanThreshold: number; // Min content on last page
  keepWithNext: string[]; // Section types that shouldn't break
  widowThreshold: number; // Min content before page break
}

interface Page {
  sections: Section[];
  height: number;
  pageNumber: number;
}

interface PaginationResult {
  pages: Page[];
  totalPages: number;
  hasOverflow: boolean;
  suggestions: string[];
}

const DEFAULT_CONFIG: PaginationConfig = {
  pageHeight: 1123, // A4 height at 96 DPI
  minSectionHeight: 50,
  orphanThreshold: 100,
  keepWithNext: ['header', 'experience', 'education'],
  widowThreshold: 80
};

export function useSmartPagination(
  sections: Section[],
  config: Partial<PaginationConfig> = {}
) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<PaginationResult>({
    pages: [],
    totalPages: 0,
    hasOverflow: false,
    suggestions: []
  });

  const paginationConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config
  }), [config]);

  const paginate = useMemo(() => {
    return (sections: Section[]): PaginationResult => {
      if (sections.length === 0) {
        return {
          pages: [],
          totalPages: 0,
          hasOverflow: false,
          suggestions: []
        };
      }

      const pages: Page[] = [];
      const suggestions: string[] = [];
      let currentPage: Section[] = [];
      let currentHeight = 0;
      let pageNumber = 1;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const nextSection = sections[i + 1];
        
        // Check if adding this section would exceed page height
        const wouldExceed = currentHeight + section.height > paginationConfig.pageHeight;
        
        // Check for widow/orphan conditions
        const wouldCreateWidow = currentHeight + section.height > paginationConfig.pageHeight - paginationConfig.widowThreshold;
        const wouldCreateOrphan = nextSection && 
          nextSection.height < paginationConfig.orphanThreshold &&
          currentHeight + section.height > paginationConfig.pageHeight - nextSection.height;

        // Check if section should stay with next section
        const shouldKeepWithNext = paginationConfig.keepWithNext.includes(section.type) && nextSection;
        
        // Check if section is too small to break
        const tooSmallToBreak = section.height < paginationConfig.minSectionHeight;

        // Decision logic for page breaks
        if (wouldExceed || wouldCreateWidow || wouldCreateOrphan) {
          // If section is too small to break, try to fit it on current page
          if (tooSmallToBreak && currentHeight + section.height <= paginationConfig.pageHeight) {
            currentPage.push(section);
            currentHeight += section.height;
            continue;
          }

          // If we should keep with next, try to fit both on current page
          if (shouldKeepWithNext && nextSection && 
              currentHeight + section.height + nextSection.height <= paginationConfig.pageHeight) {
            currentPage.push(section);
            currentHeight += section.height;
            continue;
          }

          // Create new page
          if (currentPage.length > 0) {
            pages.push({
              sections: [...currentPage],
              height: currentHeight,
              pageNumber: pageNumber++
            });
            currentPage = [];
            currentHeight = 0;
          }

          // If section is too large for a single page, split it
          if (section.height > paginationConfig.pageHeight) {
            const splitSections = splitLargeSection(section, paginationConfig.pageHeight);
            for (const splitSection of splitSections) {
              if (currentHeight + splitSection.height > paginationConfig.pageHeight) {
                pages.push({
                  sections: [...currentPage],
                  height: currentHeight,
                  pageNumber: pageNumber++
                });
                currentPage = [];
                currentHeight = 0;
              }
              currentPage.push(splitSection);
              currentHeight += splitSection.height;
            }
          } else {
            currentPage.push(section);
            currentHeight += section.height;
          }
        } else {
          currentPage.push(section);
          currentHeight += section.height;
        }
      }

      // Add remaining sections to final page
      if (currentPage.length > 0) {
        pages.push({
          sections: [...currentPage],
          height: currentHeight,
          pageNumber: pageNumber
        });
      }

      // Generate suggestions for optimization
      const hasOverflow = pages.some(page => page.height > paginationConfig.pageHeight);
      if (hasOverflow) {
        suggestions.push('Consider reducing content or adjusting spacing to fit better on pages');
      }

      const orphanPages = pages.filter(page => 
        page.sections.length === 1 && 
        page.sections[0].height < paginationConfig.orphanThreshold
      );
      if (orphanPages.length > 0) {
        suggestions.push('Some pages have very little content - consider redistributing sections');
      }

      const widowPages = pages.filter(page => 
        page.height > paginationConfig.pageHeight - paginationConfig.widowThreshold
      );
      if (widowPages.length > 0) {
        suggestions.push('Some pages have content that could be better distributed');
      }

      return {
        pages,
        totalPages: pages.length,
        hasOverflow,
        suggestions
      };
    };
  }, [paginationConfig]);

  useEffect(() => {
    setIsCalculating(true);
    
    // Use requestAnimationFrame to avoid blocking the UI
    const timeoutId = setTimeout(() => {
      const result = paginate(sections);
      setResult(result);
      setIsCalculating(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [sections, paginate]);

  return {
    ...result,
    isCalculating,
    config: paginationConfig
  };
}

function splitLargeSection(section: Section, maxHeight: number): Section[] {
  // This is a simplified split - in practice, you'd want more sophisticated
  // logic based on the section type and content
  const splits: Section[] = [];
  let remainingHeight = section.height;
  let splitIndex = 0;

  while (remainingHeight > 0) {
    const splitHeight = Math.min(remainingHeight, maxHeight);
    splits.push({
      ...section,
      id: `${section.id}_split_${splitIndex++}`,
      height: splitHeight
    });
    remainingHeight -= splitHeight;
  }

  return splits;
}

// Hook for measuring section heights
export function useSectionMeasurement() {
  const [measurements, setMeasurements] = useState<Map<string, number>>(new Map());
  const [isMeasuring, setIsMeasuring] = useState(false);

  const measureSection = (sectionId: string, element: HTMLElement | null) => {
    if (!element) return;

    const height = element.offsetHeight;
    setMeasurements(prev => new Map(prev).set(sectionId, height));
  };

  const measureAllSections = (sectionElements: Map<string, HTMLElement>) => {
    setIsMeasuring(true);
    
    // Wait for fonts to load
    document.fonts.ready.then(() => {
      // Small delay to ensure all styles are applied
      setTimeout(() => {
        const newMeasurements = new Map<string, number>();
        
        for (const [sectionId, element] of sectionElements) {
          if (element) {
            newMeasurements.set(sectionId, element.offsetHeight);
          }
        }
        
        setMeasurements(newMeasurements);
        setIsMeasuring(false);
      }, 100);
    });
  };

  const getSectionHeight = (sectionId: string): number => {
    return measurements.get(sectionId) || 0;
  };

  return {
    measurements,
    isMeasuring,
    measureSection,
    measureAllSections,
    getSectionHeight,
    A4_HEIGHT_PX: 1123,
    A4_WIDTH_PX: 794
  };
}

export type { Section, Page, PaginationResult, PaginationConfig };
