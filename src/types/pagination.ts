export interface SectionId {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'projects' | 'hobbies' | 'custom';
  order: number;
}

export interface SectionDimensions {
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  paddingTop: number;
  paddingBottom: number;
}

export interface PageBreak {
  sectionId: string;
  pageNumber: number;
  yOffset: number;
  isWidow: boolean;
  isOrphan: boolean;
  isManual: boolean;
}

export interface PagePosition {
  pageNumber: number;
  yOffset: number;
  spansMultiplePages: boolean;
  totalHeight: number;
  visibleHeight: number;
  hiddenHeight: number;
}

export interface Page {
  pageNumber: number;
  sections: SectionId[];
  totalHeight: number;
  availableHeight: number;
  utilization: number; // 0-1 ratio
  hasOverflow: boolean;
  breakpoints: PageBreak[];
}

export interface PaginationState {
  pages: Page[];
  currentPage: number;
  totalPages: number;
  sectionLayout: Map<string, PagePosition>;
  measurements: Map<string, SectionDimensions>;
  breakpoints: PageBreak[];
  isCalculating: boolean;
  lastCalculated: number;
}

export interface SectionManagerState {
  sections: SectionId[];
  draggedSection: string | null;
  dropTarget: string | null;
  isReordering: boolean;
  showThumbnails: boolean;
  activeSection: string | null;
}

export interface PaginationConfig {
  pageWidth: number; // 794px for A4 at 96 DPI
  pageHeight: number; // 1123px for A4 at 96 DPI
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  minSectionHeight: number;
  orphanThreshold: number;
  widowThreshold: number;
  keepWithNext: string[];
  pageBreakBefore: string[];
  pageBreakAfter: string[];
  pageBreakInside: string[];
}

export interface NavigationState {
  currentPage: number;
  totalPages: number;
  showThumbnails: boolean;
  thumbnailSize: 'small' | 'medium' | 'large';
  zoom: number;
  isTransitioning: boolean;
}

export interface PaginationMetrics {
  calculationTime: number;
  totalSections: number;
  totalPages: number;
  averagePageUtilization: number;
  overflowSections: number;
  orphanSections: number;
  widowSections: number;
}

export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  pageWidth: 794,
  pageHeight: 1123,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  minSectionHeight: 50,
  orphanThreshold: 100,
  widowThreshold: 80,
  keepWithNext: ['header', 'experience', 'education'],
  pageBreakBefore: ['experience', 'education'],
  pageBreakAfter: [],
  pageBreakInside: ['experience', 'education']
};

export interface SectionReorderEvent {
  sectionId: string;
  fromIndex: number;
  toIndex: number;
  fromPage: number;
  toPage: number;
  timestamp: number;
}

export interface PageTransitionEvent {
  fromPage: number;
  toPage: number;
  direction: 'next' | 'previous' | 'jump';
  timestamp: number;
}
