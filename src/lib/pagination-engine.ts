import { 
  PaginationState, 
  Page, 
  SectionId, 
  SectionDimensions, 
  PagePosition, 
  PageBreak, 
  PaginationConfig, 
  PaginationMetrics,
  DEFAULT_PAGINATION_CONFIG 
} from '@/types/pagination';

export class PaginationEngine {
  private config: PaginationConfig;
  private measurements: Map<string, SectionDimensions> = new Map();
  private sectionOrder: SectionId[] = [];

  constructor(config: Partial<PaginationConfig> = {}) {
    this.config = { ...DEFAULT_PAGINATION_CONFIG, ...config };
  }

  updateConfig(config: Partial<PaginationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  updateMeasurements(measurements: Map<string, SectionDimensions>): void {
    this.measurements = new Map(measurements);
  }

  updateSectionOrder(sections: SectionId[]): void {
    this.sectionOrder = [...sections];
  }

  calculatePagination(): { state: PaginationState; metrics: PaginationMetrics } {
    const startTime = performance.now();
    
    if (this.sectionOrder.length === 0) {
      return {
        state: this.createEmptyState(),
        metrics: this.createEmptyMetrics(0)
      };
    }

    const pages: Page[] = [];
    const sectionLayout = new Map<string, PagePosition>();
    const breakpoints: PageBreak[] = [];
    
    let currentPage = 1;
    let currentPageHeight = this.config.marginTop;
    let currentPageSections: SectionId[] = [];
    let totalOverflow = 0;
    let totalOrphans = 0;
    let totalWidows = 0;

    const availableHeight = this.config.pageHeight - this.config.marginTop - this.config.marginBottom;

    for (let i = 0; i < this.sectionOrder.length; i++) {
      const section = this.sectionOrder[i];
      const nextSection = this.sectionOrder[i + 1];
      const dimensions = this.measurements.get(section.id);
      
      if (!dimensions) {
        // Only warn in development mode to reduce console noise
        if (process.env.NODE_ENV === 'development') {
          console.warn(`No dimensions found for section: ${section.id}`);
        }
        continue;
      }

      const sectionHeight = dimensions.height + dimensions.marginTop + dimensions.marginBottom;
      const wouldExceedPage = currentPageHeight + sectionHeight > this.config.pageHeight - this.config.marginBottom;
      
      // Check for widow/orphan conditions
      const wouldCreateWidow = this.wouldCreateWidow(currentPageHeight, sectionHeight, nextSection);
      const wouldCreateOrphan = this.wouldCreateOrphan(currentPageHeight, sectionHeight, nextSection);
      
      // Check if section should stay with next section
      const shouldKeepWithNext = this.shouldKeepWithNext(section, nextSection);
      
      // Check if section is too small to break
      const tooSmallToBreak = sectionHeight < this.config.minSectionHeight;

      // Decision logic for page breaks
      if (wouldExceedPage || wouldCreateWidow || wouldCreateOrphan) {
        // If section is too small to break, try to fit it on current page
        if (tooSmallToBreak && currentPageHeight + sectionHeight <= this.config.pageHeight - this.config.marginBottom) {
          this.addSectionToPage(section, currentPage, currentPageHeight, currentPageSections, sectionLayout);
          currentPageHeight += sectionHeight;
          continue;
        }

        // If we should keep with next, try to fit both on current page
        if (shouldKeepWithNext && nextSection) {
          const nextDimensions = this.measurements.get(nextSection.id);
          if (nextDimensions && 
              currentPageHeight + sectionHeight + nextDimensions.height <= this.config.pageHeight - this.config.marginBottom) {
            this.addSectionToPage(section, currentPage, currentPageHeight, currentPageSections, sectionLayout);
            currentPageHeight += sectionHeight;
            continue;
          }
        }

        // Create new page
        if (currentPageSections.length > 0) {
          pages.push(this.createPage(currentPage, currentPageSections, currentPageHeight, availableHeight));
          currentPage++;
          currentPageHeight = this.config.marginTop;
          currentPageSections = [];
        }

        // If section is too large for a single page, split it
        if (sectionHeight > availableHeight) {
          const splitResult = this.splitLargeSection(section, dimensions, currentPage, currentPageHeight);
          currentPageSections.push(...splitResult.sections);
          currentPageHeight = splitResult.finalHeight;
          totalOverflow++;
        } else {
          this.addSectionToPage(section, currentPage, currentPageHeight, currentPageSections, sectionLayout);
          currentPageHeight += sectionHeight;
        }
      } else {
        this.addSectionToPage(section, currentPage, currentPageHeight, currentPageSections, sectionLayout);
        currentPageHeight += sectionHeight;
      }
    }

    // Add remaining sections to final page
    if (currentPageSections.length > 0) {
      pages.push(this.createPage(currentPage, currentPageSections, currentPageHeight, availableHeight));
    }

    // Calculate breakpoints
    this.calculateBreakpoints(pages, sectionLayout, breakpoints);

    const calculationTime = performance.now() - startTime;
    const metrics = this.calculateMetrics(pages, totalOverflow, totalOrphans, totalWidows, calculationTime);

    const state: PaginationState = {
      pages,
      currentPage: 1,
      totalPages: pages.length,
      sectionLayout,
      measurements: this.measurements,
      breakpoints,
      isCalculating: false,
      lastCalculated: Date.now()
    };

    return { state, metrics };
  }

  private wouldCreateWidow(currentHeight: number, sectionHeight: number, nextSection?: SectionId): boolean {
    if (!nextSection) return false;
    
    const nextDimensions = this.measurements.get(nextSection.id);
    if (!nextDimensions) return false;
    
    const nextSectionHeight = nextDimensions.height + nextDimensions.marginTop + nextDimensions.marginBottom;
    const remainingHeight = this.config.pageHeight - this.config.marginBottom - currentHeight - sectionHeight;
    
    return remainingHeight < this.config.widowThreshold && nextSectionHeight > remainingHeight;
  }

  private wouldCreateOrphan(currentHeight: number, sectionHeight: number, nextSection?: SectionId): boolean {
    if (!nextSection) return false;
    
    const nextDimensions = this.measurements.get(nextSection.id);
    if (!nextDimensions) return false;
    
    const nextSectionHeight = nextDimensions.height + nextDimensions.marginTop + nextDimensions.marginBottom;
    const remainingHeight = this.config.pageHeight - this.config.marginBottom - currentHeight - sectionHeight;
    
    return nextSectionHeight < this.config.orphanThreshold && remainingHeight < nextSectionHeight;
  }

  private shouldKeepWithNext(section: SectionId, nextSection?: SectionId): boolean {
    if (!nextSection) return false;
    return this.config.keepWithNext.includes(section.type) || 
           this.config.keepWithNext.includes(nextSection.type);
  }

  private addSectionToPage(
    section: SectionId, 
    pageNumber: number, 
    yOffset: number, 
    pageSections: SectionId[], 
    sectionLayout: Map<string, PagePosition>
  ): void {
    pageSections.push(section);
    
    const dimensions = this.measurements.get(section.id);
    if (!dimensions) return;
    
    const sectionHeight = dimensions.height + dimensions.marginTop + dimensions.marginBottom;
    const availableHeight = this.config.pageHeight - this.config.marginTop - this.config.marginBottom;
    
    sectionLayout.set(section.id, {
      pageNumber,
      yOffset,
      spansMultiplePages: sectionHeight > availableHeight,
      totalHeight: sectionHeight,
      visibleHeight: Math.min(sectionHeight, availableHeight - yOffset + this.config.marginTop),
      hiddenHeight: Math.max(0, sectionHeight - (availableHeight - yOffset + this.config.marginTop))
    });
  }

  private createPage(pageNumber: number, sections: SectionId[], height: number, availableHeight: number): Page {
    const utilization = height / (this.config.pageHeight - this.config.marginTop - this.config.marginBottom);
    const hasOverflow = height > this.config.pageHeight - this.config.marginBottom;
    
    return {
      pageNumber,
      sections: [...sections],
      totalHeight: height,
      availableHeight,
      utilization: Math.min(utilization, 1),
      hasOverflow,
      breakpoints: []
    };
  }

  private splitLargeSection(
    section: SectionId, 
    dimensions: SectionDimensions, 
    pageNumber: number, 
    currentHeight: number
  ): { sections: SectionId[]; finalHeight: number } {
    const availableHeight = this.config.pageHeight - this.config.marginTop - this.config.marginBottom;
    const remainingHeight = availableHeight - currentHeight + this.config.marginTop;
    
    if (remainingHeight <= 0) {
      // Section doesn't fit on current page, start new page
      return {
        sections: [section],
        finalHeight: this.config.marginTop + dimensions.height + dimensions.marginTop + dimensions.marginBottom
      };
    }
    
    // For now, we'll treat large sections as single units
    // In a more sophisticated implementation, we'd split content within sections
    return {
      sections: [section],
      finalHeight: currentHeight + dimensions.height + dimensions.marginTop + dimensions.marginBottom
    };
  }

  private calculateBreakpoints(
    pages: Page[], 
    sectionLayout: Map<string, PagePosition>, 
    breakpoints: PageBreak[]
  ): void {
    for (const page of pages) {
      for (let i = 0; i < page.sections.length; i++) {
        const section = page.sections[i];
        const position = sectionLayout.get(section.id);
        
        if (!position) continue;
        
        const isWidow = i === page.sections.length - 1 && position.visibleHeight < this.config.widowThreshold;
        const isOrphan = i === 0 && position.visibleHeight < this.config.orphanThreshold;
        
        breakpoints.push({
          sectionId: section.id,
          pageNumber: page.pageNumber,
          yOffset: position.yOffset,
          isWidow,
          isOrphan,
          isManual: false
        });
      }
    }
  }

  private calculateMetrics(
    pages: Page[], 
    overflow: number, 
    orphans: number, 
    widows: number, 
    calculationTime: number
  ): PaginationMetrics {
    const totalSections = this.sectionOrder.length;
    const totalPages = pages.length;
    const averagePageUtilization = pages.reduce((sum, page) => sum + page.utilization, 0) / totalPages;
    
    return {
      calculationTime,
      totalSections,
      totalPages,
      averagePageUtilization,
      overflowSections: overflow,
      orphanSections: orphans,
      widowSections: widows
    };
  }

  private createEmptyState(): PaginationState {
    return {
      pages: [],
      currentPage: 1,
      totalPages: 0,
      sectionLayout: new Map(),
      measurements: new Map(),
      breakpoints: [],
      isCalculating: false,
      lastCalculated: Date.now()
    };
  }

  private createEmptyMetrics(calculationTime: number): PaginationMetrics {
    return {
      calculationTime,
      totalSections: 0,
      totalPages: 0,
      averagePageUtilization: 0,
      overflowSections: 0,
      orphanSections: 0,
      widowSections: 0
    };
  }

  // Public methods for external access
  getConfig(): PaginationConfig {
    return { ...this.config };
  }

  getMeasurements(): Map<string, SectionDimensions> {
    return new Map(this.measurements);
  }

  getSectionOrder(): SectionId[] {
    return [...this.sectionOrder];
  }
}
