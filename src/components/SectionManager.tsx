import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SectionId, PagePosition, PaginationState } from '@/types/pagination';
import { useAnalytics } from '@/lib/analytics';
import { 
  FaGripVertical, 
  FaChevronUp, 
  FaChevronDown, 
  FaEye, 
  FaEyeSlash,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

interface SectionManagerProps {
  sections: SectionId[];
  paginationState: PaginationState;
  onSectionReorder: (fromIndex: number, toIndex: number) => void;
  onSectionClick: (sectionId: string) => void;
  onSectionToggle: (sectionId: string, visible: boolean) => void;
  className?: string;
}

interface DragState {
  draggedSection: string | null;
  dragOverSection: string | null;
  dragStartIndex: number;
  isDragging: boolean;
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  paginationState,
  onSectionReorder,
  onSectionClick,
  onSectionToggle,
  className = ''
}) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedSection: null,
    dragOverSection: null,
    dragStartIndex: -1,
    isDragging: false
  });
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showMetrics, setShowMetrics] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();

  // Calculate section metrics
  const sectionMetrics = React.useMemo(() => {
    const metrics = new Map<string, {
      pageNumber: number;
      height: number;
      utilization: number;
      hasOverflow: boolean;
      isWidow: boolean;
      isOrphan: boolean;
    }>();

    for (const section of sections) {
      const position = paginationState.sectionLayout.get(section.id);
      const dimensions = paginationState.measurements.get(section.id);
      
      if (position && dimensions) {
        const page = paginationState.pages.find(p => p.pageNumber === position.pageNumber);
        const utilization = page ? position.visibleHeight / (page.availableHeight) : 0;
        
        metrics.set(section.id, {
          pageNumber: position.pageNumber,
          height: dimensions.height,
          utilization,
          hasOverflow: position.spansMultiplePages,
          isWidow: paginationState.breakpoints.some(bp => bp.sectionId === section.id && bp.isWidow),
          isOrphan: paginationState.breakpoints.some(bp => bp.sectionId === section.id && bp.isOrphan)
        });
      }
    }

    return metrics;
  }, [sections, paginationState]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, sectionId: string, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
    
    setDragState({
      draggedSection: sectionId,
      dragOverSection: null,
      dragStartIndex: index,
      isDragging: true
    });

    analytics.trackCVEvent('section_drag_start', { sectionId, index });
  }, [analytics]);

  const handleDragOver = useCallback((e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    setDragState(prev => ({
      ...prev,
      dragOverSection: sectionId
    }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drag over if we're leaving the entire section manager
    if (!dragRef.current?.contains(e.relatedTarget as Node)) {
      setDragState(prev => ({
        ...prev,
        dragOverSection: null
      }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetSectionId: string, targetIndex: number) => {
    e.preventDefault();
    
    const draggedSectionId = e.dataTransfer.getData('text/plain');
    const draggedIndex = sections.findIndex(s => s.id === draggedSectionId);
    
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      onSectionReorder(draggedIndex, targetIndex);
      
      analytics.trackCVEvent('section_reordered', {
        sectionId: draggedSectionId,
        fromIndex: draggedIndex,
        toIndex: targetIndex,
        fromPage: sectionMetrics.get(draggedSectionId)?.pageNumber,
        toPage: sectionMetrics.get(targetSectionId)?.pageNumber
      });
    }
    
    setDragState({
      draggedSection: null,
      dragOverSection: null,
      dragStartIndex: -1,
      isDragging: false
    });
  }, [sections, onSectionReorder, sectionMetrics, analytics]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedSection: null,
      dragOverSection: null,
      dragStartIndex: -1,
      isDragging: false
    });
  }, []);

  // Move section up/down
  const moveSection = useCallback((index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < sections.length) {
      onSectionReorder(index, newIndex);
      
      analytics.trackCVEvent('section_moved', {
        sectionId: sections[index].id,
        fromIndex: index,
        toIndex: newIndex,
        direction
      });
    }
  }, [sections, onSectionReorder, analytics]);

  // Toggle section expansion
  const toggleSectionExpansion = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Get section status indicators
  const getSectionStatus = useCallback((sectionId: string) => {
    const metrics = sectionMetrics.get(sectionId);
    if (!metrics) return null;

    const issues = [];
    if (metrics.hasOverflow) issues.push('overflow');
    if (metrics.isWidow) issues.push('widow');
    if (metrics.isOrphan) issues.push('orphan');
    if (metrics.utilization < 0.3) issues.push('underutilized');

    return {
      issues,
      hasIssues: issues.length > 0,
      metrics
    };
  }, [sectionMetrics]);

  // Render section item
  const renderSectionItem = useCallback((section: SectionId, index: number) => {
    const metrics = sectionMetrics.get(section.id);
    const status = getSectionStatus(section.id);
    const isExpanded = expandedSections.has(section.id);
    const isDragging = dragState.draggedSection === section.id;
    const isDragOver = dragState.dragOverSection === section.id;

    return (
      <div
        key={section.id}
        className={`section-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, section.id, index)}
        onDragOver={(e) => handleDragOver(e, section.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, section.id, index)}
        onDragEnd={handleDragEnd}
        data-section-id={section.id}
      >
        <div className="section-header">
          <div className="section-info">
            <button
              className="drag-handle"
              aria-label={`Drag to reorder ${section.type} section`}
            >
              <FaGripVertical />
            </button>
            
            <div className="section-details">
              <h4 className="section-title">
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              </h4>
              
              {metrics && (
                <div className="section-meta">
                  <span className="page-badge">
                    Page {metrics.pageNumber}
                  </span>
                  {status?.hasIssues && (
                    <span className="issues-badge">
                      <FaExclamationTriangle />
                      {status.issues.length}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="section-controls">
            <button
              onClick={() => moveSection(index, 'up')}
              disabled={index === 0}
              className="move-button"
              aria-label={`Move ${section.type} section up`}
            >
              <FaChevronUp />
            </button>
            
            <button
              onClick={() => moveSection(index, 'down')}
              disabled={index === sections.length - 1}
              className="move-button"
              aria-label={`Move ${section.type} section down`}
            >
              <FaChevronDown />
            </button>
            
            <button
              onClick={() => onSectionClick(section.id)}
              className="view-button"
              aria-label={`View ${section.type} section`}
            >
              <FaEye />
            </button>
          </div>
        </div>

        {isExpanded && metrics && (
          <div className="section-details-expanded">
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Height:</span>
                <span className="metric-value">{Math.round(metrics.height)}px</span>
              </div>
              <div className="metric">
                <span className="metric-label">Utilization:</span>
                <span className="metric-value">{Math.round(metrics.utilization * 100)}%</span>
              </div>
              {metrics.hasOverflow && (
                <div className="metric warning">
                  <span className="metric-label">Overflow:</span>
                  <span className="metric-value">Yes</span>
                </div>
              )}
            </div>
            
            {status?.hasIssues && (
              <div className="issues-list">
                <h5>Issues:</h5>
                <ul>
                  {status.issues.map((issue) => (
                    <li key={issue} className={`issue issue-${issue}`}>
                      {issue.charAt(0).toUpperCase() + issue.slice(1)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => toggleSectionExpansion(section.id)}
          className="expand-button"
          aria-label={isExpanded ? 'Collapse section details' : 'Expand section details'}
        >
          <FaInfoCircle />
        </button>
      </div>
    );
  }, [
    sectionMetrics,
    getSectionStatus,
    expandedSections,
    dragState,
    sections.length,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    moveSection,
    onSectionClick,
    toggleSectionExpansion
  ]);

  // Calculate overall metrics
  const overallMetrics = React.useMemo(() => {
    const totalSections = sections.length;
    const totalPages = paginationState.totalPages;
    const sectionsWithIssues = Array.from(sectionMetrics.values()).filter(m => 
      m.hasOverflow || m.utilization < 0.3
    ).length;
    const averageUtilization = Array.from(sectionMetrics.values())
      .reduce((sum, m) => sum + m.utilization, 0) / totalSections;

    return {
      totalSections,
      totalPages,
      sectionsWithIssues,
      averageUtilization: Math.round(averageUtilization * 100)
    };
  }, [sections.length, paginationState.totalPages, sectionMetrics]);

  return (
    <div className={`section-manager ${className}`} ref={dragRef}>
      <div className="section-manager-header">
        <h3>Section Manager</h3>
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className="metrics-toggle"
          aria-label={showMetrics ? 'Hide metrics' : 'Show metrics'}
        >
          <FaInfoCircle />
        </button>
      </div>

      {showMetrics && (
        <div className="overall-metrics">
          <div className="metrics-summary">
            <div className="metric-item">
              <span className="metric-label">Sections:</span>
              <span className="metric-value">{overallMetrics.totalSections}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Pages:</span>
              <span className="metric-value">{overallMetrics.totalPages}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg. Utilization:</span>
              <span className="metric-value">{overallMetrics.averageUtilization}%</span>
            </div>
            {overallMetrics.sectionsWithIssues > 0 && (
              <div className="metric-item warning">
                <span className="metric-label">Issues:</span>
                <span className="metric-value">{overallMetrics.sectionsWithIssues}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="sections-list">
        {sections.map((section, index) => renderSectionItem(section, index))}
      </div>

      <div className="section-manager-footer">
        <p className="help-text">
          Drag sections to reorder • Click to view • Use arrows to move
        </p>
      </div>

      <style jsx>{`
        .section-manager {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .section-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .section-manager-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .metrics-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .metrics-toggle:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .overall-metrics {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .metrics-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .metric-item.warning {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .metric-label {
          color: #6b7280;
          font-weight: 500;
        }

        .metric-value {
          color: #374151;
          font-weight: 600;
        }

        .sections-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .section-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
          transition: all 0.2s;
          cursor: move;
          position: relative;
        }

        .section-item:hover {
          border-color: #d1d5db;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .section-item.dragging {
          opacity: 0.5;
          transform: rotate(2deg);
        }

        .section-item.drag-over {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
        }

        .section-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .drag-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border: none;
          background: none;
          cursor: grab;
          color: #9ca3af;
          transition: color 0.2s;
        }

        .drag-handle:hover {
          color: #6b7280;
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .section-details {
          flex: 1;
        }

        .section-title {
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .section-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .page-badge {
          background: #e5e7eb;
          color: #374151;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .issues-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .section-controls {
          display: flex;
          gap: 0.25rem;
        }

        .move-button,
        .view-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.75rem;
        }

        .move-button:hover:not(:disabled),
        .view-button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .move-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .section-details-expanded {
          padding: 0 1rem 1rem 1rem;
          border-top: 1px solid #f3f4f6;
          background: #f9fafb;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }

        .metric.warning {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .issues-list {
          margin-top: 0.75rem;
        }

        .issues-list h5 {
          margin: 0 0 0.5rem 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .issues-list ul {
          margin: 0;
          padding-left: 1rem;
        }

        .issues-list li {
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
        }

        .issue-overflow {
          color: #dc2626;
        }

        .issue-widow {
          color: #d97706;
        }

        .issue-orphan {
          color: #059669;
        }

        .issue-underutilized {
          color: #6b7280;
        }

        .expand-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          color: #9ca3af;
          transition: color 0.2s;
        }

        .expand-button:hover {
          color: #6b7280;
        }

        .section-manager-footer {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .help-text {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default SectionManager;