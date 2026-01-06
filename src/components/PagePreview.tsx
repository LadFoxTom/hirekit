'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight, FaExpand, FaCompress, FaPrint, FaDownload, FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { Page } from '@/hooks/usePagination'
import { SectionMeasurement } from '@/hooks/useSectionMeasurement'
import { CVPreview } from './CVPreview'
import { CVData } from '@/types/cv'

interface PagePreviewProps {
  pages: Page[]
  currentPage: number
  onPageChange: (page: number) => void
  onSectionReorder?: (sectionId: string, newIndex: number) => void
  onAddPageBreak?: (afterSectionId: string) => void
  onRemovePageBreak?: (sectionId: string) => void
  onEditSection?: (sectionId: string) => void
  cvData?: CVData
  className?: string
}

const A4_WIDTH = 794
const A4_HEIGHT = 1123

export const PagePreview: React.FC<PagePreviewProps> = ({
  pages,
  currentPage,
  onPageChange,
  onSectionReorder,
  onAddPageBreak,
  onRemovePageBreak,
  onEditSection,
  cvData,
  className = ''
}) => {
  const [zoom, setZoom] = useState(0.8)
  const [autoZoom, setAutoZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentPageData = pages[currentPage]
  const totalPages = pages.length

  // Calculate auto-zoom based on container size
  useEffect(() => {
    const calculateAutoZoom = () => {
      if (!containerRef.current) return
      
      const container = containerRef.current
      const containerWidth = container.clientWidth - 48 // Account for padding (24px each side)
      const containerHeight = container.clientHeight - 48
      
      // Calculate zoom to fit both width and height
      const widthZoom = containerWidth / A4_WIDTH
      const heightZoom = containerHeight / A4_HEIGHT
      
      // Use the smaller zoom to ensure the entire document fits
      const calculatedZoom = Math.min(widthZoom, heightZoom, 1) // Don't zoom beyond 100%
      
      setAutoZoom(Math.max(calculatedZoom, 0.3)) // Minimum 30% zoom
    }

    calculateAutoZoom()
    
    const resizeObserver = new ResizeObserver(calculateAutoZoom)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => resizeObserver.disconnect()
  }, [])

  // Use auto-zoom for better fit, but allow manual zoom override
  const [hasManualZoom, setHasManualZoom] = useState(false)
  const effectiveZoom = isFullscreen ? 1 : (hasManualZoom ? zoom : autoZoom)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return // Don't interfere with form inputs
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          if (currentPage > 0) onPageChange(currentPage - 1)
          break
        case 'ArrowRight':
          e.preventDefault()
          if (currentPage < totalPages - 1) onPageChange(currentPage + 1)
          break
        case 'Home':
          e.preventDefault()
          onPageChange(0)
          break
        case 'End':
          e.preventDefault()
          onPageChange(totalPages - 1)
          break
        case 'Escape':
          setIsFullscreen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, onPageChange])

  // Auto-fit zoom
  const autoFitZoom = () => {
    if (!pageRef.current) return
    
    const container = pageRef.current.parentElement
    if (!container) return

    const containerWidth = container.clientWidth - 40 // Account for padding
    const containerHeight = container.clientHeight - 40
    const scaleX = containerWidth / A4_WIDTH
    const scaleY = containerHeight / A4_HEIGHT
    const scale = Math.min(scaleX, scaleY, 1) // Don't zoom in beyond 100%
    
    setZoom(scale)
    setHasManualZoom(false) // Reset to auto-zoom mode
  }

  useEffect(() => {
    autoFitZoom()
  }, [isFullscreen])

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFitScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedSection && onSectionReorder) {
      onSectionReorder(draggedSection, targetIndex)
    }
    setDraggedSection(null)
  }

  if (!currentPageData) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <FaEdit className="mx-auto mb-2 text-2xl" />
          <p>No pages to display</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full min-h-0 w-full ${className}`} style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Page Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-sm font-medium min-w-[80px] text-center">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className={`flex items-center space-x-1 ${getFitScoreColor(currentPageData.fitScore)}`}>
              <span>Fit Score:</span>
              <span className="font-medium">{Math.round(currentPageData.fitScore)}%</span>
              <span className="text-xs">({getFitScoreLabel(currentPageData.fitScore)})</span>
            </div>
            
            {currentPageData.hasOverflow && (
              <div className="flex items-center space-x-1 text-red-600">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Overflow</span>
              </div>
            )}
            
            {currentPageData.remainingSpace > 100 && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>{Math.round(currentPageData.remainingSpace)}px unused</span>
              </div>
            )}
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="p-2 rounded-lg hover:bg-gray-100 text-sm"
          >
            Thumbnails
          </button>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                setZoom(Math.max(0.3, zoom - 0.1))
                setHasManualZoom(true)
              }}
              className="p-1 rounded hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-sm min-w-[50px] text-center">{Math.round(effectiveZoom * 100)}%</span>
            <button
              onClick={() => {
                setZoom(Math.min(2, zoom + 0.1))
                setHasManualZoom(true)
              }}
              className="p-1 rounded hover:bg-gray-100"
            >
              +
            </button>
          </div>
          
          <button
            onClick={autoFitZoom}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Auto-fit"
          >
            <FaCompress className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
        {/* Thumbnails Sidebar */}
        {showThumbnails && (
          <div className="w-32 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-2 space-y-2">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => onPageChange(index)}
                  className={`w-full p-2 text-xs rounded border-2 transition-colors ${
                    index === currentPage
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-medium">Page {index + 1}</div>
                    <div className={`text-xs ${getFitScoreColor(page.fitScore)}`}>
                      {Math.round(page.fitScore)}%
                    </div>
                    {page.hasOverflow && (
                      <div className="text-red-500 text-xs">!</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Page Display */}
        <div 
          ref={containerRef}
          className={`flex-1 flex items-start justify-center p-6 bg-gray-50 overflow-auto min-h-0 w-full ${
            isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''
          }`}
        >
          <div
            ref={pageRef}
            className="bg-white shadow-2xl border border-gray-300 relative"
            style={{
              width: A4_WIDTH,
              height: A4_HEIGHT,
              transform: `scale(${effectiveZoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s',
              minWidth: A4_WIDTH * effectiveZoom,
              minHeight: A4_HEIGHT * effectiveZoom
            }}
          >
            {/* Page Content */}
            <div className="w-full h-full overflow-hidden relative">
              {cvData ? (
                <div className="w-full h-full">
                  <CVPreview 
                    data={cvData} 
                    isPreview={true}
                    key={`page-preview-${currentPage}`}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FaEdit className="mx-auto mb-2 text-2xl" />
                    <p>No CV data available</p>
                  </div>
                </div>
              )}

              {/* Section Overlays for Interaction */}
              {currentPageData.sections.map((section, index) => (
                <div
                  key={`overlay-${section.id}`}
                  draggable={!!onSectionReorder}
                  onDragStart={(e) => handleDragStart(e, section.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`absolute left-0 right-0 border-2 border-transparent hover:border-blue-300 transition-colors cursor-move ${
                    draggedSection === section.id ? 'opacity-50' : ''
                  }`}
                  style={{
                    top: `${(index * 100) / currentPageData.sections.length}%`,
                    height: `${(section.height / A4_HEIGHT) * 100}%`,
                    minHeight: '20px'
                  }}
                >
                  {/* Section Controls */}
                  <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded shadow-sm z-10">
                    <div className="flex">
                      {onEditSection && (
                        <button
                          onClick={() => onEditSection(section.id)}
                          className="p-1 hover:bg-gray-100 text-gray-600"
                          title="Edit section"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                      )}
                      
                      {onAddPageBreak && (
                        <button
                          onClick={() => onAddPageBreak(section.id)}
                          className="p-1 hover:bg-gray-100 text-gray-600"
                          title="Add page break after"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      )}
                      
                      {onRemovePageBreak && section.type === 'break' && (
                        <button
                          onClick={() => onRemovePageBreak(section.id)}
                          className="p-1 hover:bg-gray-100 text-red-600"
                          title="Remove page break"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Remaining Space Indicator */}
              {currentPageData.remainingSpace > 50 && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-yellow-50 border-t border-yellow-200 text-center text-xs text-yellow-700 py-1"
                  style={{ height: Math.min(currentPageData.remainingSpace * zoom, 50) }}
                >
                  {Math.round(currentPageData.remainingSpace)}px unused space
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsFullscreen(false)} />
      )}
    </div>
  )
}
