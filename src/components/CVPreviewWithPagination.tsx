'use client'

import React, { memo, useRef, useEffect, useState } from 'react'
import { CVPreview } from './CVPreview'
import { EnhancedCVPreview } from './EnhancedCVPreview'
import { CVData } from '@/types/cv'

interface CVPreviewWithPaginationProps {
  data: Partial<CVData>
  zoom?: number
  enhanced?: boolean
  onDataChange?: (data: CVData) => void
}

const A4_WIDTH = 794
const A4_HEIGHT = 1123

const CVPreviewWithPagination: React.FC<CVPreviewWithPaginationProps> = memo(({ data, zoom = 1, enhanced = false, onDataChange }) => {
  const previewRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [autoZoom, setAutoZoom] = useState(1)

  useEffect(() => {
    const mediaQuery = window.matchMedia('print')
    const handleChange = (e: MediaQueryListEvent) => setIsPrinting(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    setIsPrinting(mediaQuery.matches)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Calculate auto-zoom based on container size
  useEffect(() => {
    const calculateAutoZoom = () => {
      if (!containerRef.current) return
      
      const container = containerRef.current
      const containerWidth = container.clientWidth - 32 // Account for padding
      const containerHeight = container.clientHeight - 32
      
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

  // Always scroll to top when data changes
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = 0
    }
  }, [data])

  // Use enhanced preview if enabled
  if (enhanced) {
    return (
      <EnhancedCVPreview 
        data={data as CVData} 
        onDataChange={onDataChange}
        className="h-full"
      />
    )
  }

  // Use auto-zoom for better fit, but allow manual zoom override
  const effectiveZoom = isPrinting ? 1 : (zoom === 1 ? autoZoom : zoom)
  const scaledWidth = A4_WIDTH * effectiveZoom
  const scaledHeight = A4_HEIGHT * effectiveZoom

  return (
    <div
      ref={containerRef}
      className="cv-viewer-scroll-container"
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
        ref={previewRef}
        style={{ 
          position: 'relative', 
          width: scaledWidth, 
          minHeight: scaledHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        {/* Page break overlays for viewer only */}
        {Array.from({ length: Math.floor(scaledHeight / (A4_HEIGHT * effectiveZoom)) }, (_, i) => i + 1).map(pageNum => (
          <div
            key={pageNum}
            className="cv-page-boundary-viewer"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: pageNum * A4_HEIGHT * effectiveZoom,
              height: 0,
              borderTop: '2px dashed #e0e7ef',
              zIndex: 10,
              pointerEvents: 'none',
              opacity: 0.6,
            }}
            aria-hidden="true"
          >
            <span
              style={{
                position: 'absolute',
                left: 8,
                top: -12,
                fontSize: '0.8em',
                color: '#b6b6b6',
                background: '#f8fafc',
                padding: '0 6px',
                borderRadius: 4,
                userSelect: 'none',
              }}
            >
              Page {pageNum + 1}
            </span>
          </div>
        ))}
        <div
          className="cv-print-container a4-page bg-white shadow-lg rounded-lg"
          style={{
            width: A4_WIDTH,
            minHeight: A4_HEIGHT,
            transform: !isPrinting ? `scale(${effectiveZoom})` : 'none',
            transformOrigin: 'top left',
            transition: 'transform 0.2s',
            boxSizing: 'content-box',
            margin: 0,
            padding: 0,
            display: 'block',
            position: 'relative',
          }}
        >
          <CVPreview data={data} isPreview={true} />
        </div>
      </div>
    </div>
  )
})

CVPreviewWithPagination.displayName = 'CVPreviewWithPagination'

export default CVPreviewWithPagination 