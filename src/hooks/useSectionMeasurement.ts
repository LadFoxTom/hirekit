// @ts-nocheck
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface SectionMeasurement {
  id: string
  height: number
  element: HTMLElement
  content: string
  type: 'header' | 'section' | 'break'
}

export interface MeasurementCache {
  [contentHash: string]: number
}

const A4_HEIGHT_PX = 1123 // A4 height in pixels at 96 DPI
const A4_WIDTH_PX = 794   // A4 width in pixels at 96 DPI

export function useSectionMeasurement() {
  const [measurements, setMeasurements] = useState<SectionMeasurement[]>([])
  const [cache, setCache] = useState<MeasurementCache>({})
  const [isMeasuring, setIsMeasuring] = useState(false)
  const measurementContainerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataHashRef = useRef<string>('')
  const isCurrentlyMeasuringRef = useRef<boolean>(false)
  const addedElementsRef = useRef<Set<HTMLElement>>(new Set())
  const lastMeasurementTimeRef = useRef<number>(0)
  const hasSuccessfullyMeasuredRef = useRef<boolean>(false)

  // Generate content hash for caching
  const generateContentHash = useCallback((content: string): string => {
    if (!content || typeof content !== 'string') {
      return '0'
    }
    
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }, [])

  // Measure a single section
  const measureSection = useCallback((element: HTMLElement, id: string, content: string): number => {
    const safeContent = content || ''
    const contentHash = generateContentHash(safeContent)
    
    // Check cache first
    if (cache[contentHash]) {
      return cache[contentHash]
    }

    // Create measurement container if it doesn't exist
    if (!measurementContainerRef.current) {
      const container = document.createElement('div')
      container.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: ${A4_WIDTH_PX}px;
        visibility: hidden;
        pointer-events: none;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        background: white;
        padding: 0;
        margin: 0;
        border: none;
        box-sizing: border-box;
      `
      document.body.appendChild(container)
      measurementContainerRef.current = container
      addedElementsRef.current.add(container)
    }

    // Clone the element for measurement
    const clonedElement = element.cloneNode(true) as HTMLElement
    clonedElement.style.cssText = `
      width: ${A4_WIDTH_PX}px;
      margin: 0;
      padding: 0;
      border: none;
      box-shadow: none;
      transform: none;
      position: static;
      visibility: visible;
    `

    // Clear the measurement container and add the cloned element
    measurementContainerRef.current.innerHTML = ''
    measurementContainerRef.current.appendChild(clonedElement)

    // Force a reflow to ensure accurate measurement
    measurementContainerRef.current.offsetHeight

    // Get the height
    const height = clonedElement.offsetHeight

    // Cache the result
    setCache(prev => ({
      ...prev,
      [contentHash]: height
    }))

    return height
  }, [cache, generateContentHash])

  // Measure all sections with debouncing and batching
  const measureAllSections = useCallback((cvData: any, container?: HTMLElement) => {
    // Only log when there's actual CV data
    if (cvData && cvData.fullName) {
      console.log('useSectionMeasurement: measureAllSections called with data:', cvData.fullName)
    }
    
    // Generate a hash of the CV data to prevent unnecessary re-measurements
    const dataHash = generateContentHash(JSON.stringify(cvData || {}))
    if (dataHash === lastDataHashRef.current && measurements.length > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('useSectionMeasurement: Skipping measurement - data unchanged and measurements exist')
      }
      return
    }
    
    // Additional check: if we have measurements and the data hash is the same, skip
    if (dataHash === lastDataHashRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('useSectionMeasurement: Skipping measurement - data hash unchanged')
      }
      return
    }
    
    // If we've already successfully measured and the data hasn't changed, skip
    if (hasSuccessfullyMeasuredRef.current && dataHash === lastDataHashRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('useSectionMeasurement: Skipping measurement - already measured successfully')
      }
      return
    }
    
    // Prevent multiple simultaneous measurements
    if (isMeasuring || isCurrentlyMeasuringRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('useSectionMeasurement: Skipping measurement - already measuring')
      }
      return
    }
    
    // Prevent measurements from running too frequently (throttle to once per 500ms)
    const now = Date.now()
    if (now - lastMeasurementTimeRef.current < 500) {
      if (process.env.NODE_ENV === 'development') {
        console.log('useSectionMeasurement: Skipping measurement - too frequent')
      }
      return
    }
    lastMeasurementTimeRef.current = now
    
    // Reset the success flag if data has changed
    if (dataHash !== lastDataHashRef.current) {
      hasSuccessfullyMeasuredRef.current = false
    }
    
    lastDataHashRef.current = dataHash
    setIsMeasuring(true)
    isCurrentlyMeasuringRef.current = true
    
    // Debounce measurements to avoid excessive recalculations
    const timeoutId = setTimeout(() => {
      // Wait for fonts to load and DOM to be ready
      Promise.all([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 300)) // Increased delay for DOM stability
      ]).then(() => {
        const newMeasurements: SectionMeasurement[] = []
        
        // Find all CV sections in the DOM - try multiple approaches
        let sections: NodeListOf<Element> | null = null
        
        // First, try to find sections in the provided container
        if (container) {
          sections = container.querySelectorAll('[data-cv-section]')
          
          // If no sections found, try to find CVPreview within the container
          if (sections.length === 0) {
            const cvPreview = container.querySelector('[data-testid="cv-preview"]')
            if (cvPreview) {
              sections = cvPreview.querySelectorAll('[data-cv-section]')
            }
          }
        }
        
        // If still no sections, try to find any CVPreview component globally
        if (!sections || sections.length === 0) {
          const allCvPreviews = document.querySelectorAll('[data-testid="cv-preview"]')
          
          for (const cvPreview of allCvPreviews) {
            const cvSections = cvPreview.querySelectorAll('[data-cv-section]')
            if (cvSections.length > 0) {
              sections = cvSections
              break
            }
          }
        }
        
        // If still no sections, try global search including paginated preview
        if (!sections || sections.length === 0) {
          sections = document.querySelectorAll('[data-cv-section]')
          
          // Also try to find sections in paginated CV preview
          if (sections.length === 0) {
            const paginatedPreview = document.querySelector('.paginated-cv-preview')
            if (paginatedPreview) {
              sections = paginatedPreview.querySelectorAll('[data-cv-section]')
            }
          }
        }
        
        // If still no sections found, wait a bit and try once more
        if (sections.length === 0) {
          setTimeout(() => {
            // Try to find sections in any CVPreview component or PaginatedCVPreview
            const allCvPreviews = document.querySelectorAll('[data-testid="cv-preview"], .paginated-cv-preview')
            
            let retrySections: NodeListOf<Element> | null = null
            for (const cvPreview of allCvPreviews) {
              const cvSections = cvPreview.querySelectorAll('[data-cv-section]')
              if (cvSections.length > 0) {
                retrySections = cvSections
                break
              }
            }
            
            if (retrySections && retrySections.length > 0) {
              // Recursive call with a flag to prevent infinite recursion
              if (!measureAllSections._retrying) {
                measureAllSections._retrying = true
                measureAllSections(cvData, container)
                setTimeout(() => { measureAllSections._retrying = false }, 1000)
              }
            } else {
              // If still no sections found, create empty measurements to prevent infinite loops
              setMeasurements([])
              setIsMeasuring(false)
              isCurrentlyMeasuringRef.current = false
            }
          }, 1000) // Increased delay
          return
        }
        
        // Batch DOM operations for better performance
        const fragment = document.createDocumentFragment()
        const tempContainer = document.createElement('div')
        tempContainer.style.cssText = `
          position: absolute;
          top: -9999px;
          left: -9999px;
          width: ${A4_WIDTH_PX}px;
          visibility: hidden;
          pointer-events: none;
        `
        fragment.appendChild(tempContainer)
        document.body.appendChild(fragment)
        addedElementsRef.current.add(tempContainer)
        
        sections.forEach((section, index) => {
          const element = section as HTMLElement
          const rawId = element.dataset.cvSection || `section-${index}`
          // Create unique ID while preserving the section type for grouping
          const id = rawId.startsWith('header-') ? `header-${index}` : rawId
          const content = element.textContent || ''
          const type = element.dataset.sectionType as 'header' | 'section' | 'break' || 'section'
          
          // Ensure element is properly rendered before measuring
          if (element.offsetHeight === 0) {
            // Force a reflow for hidden elements
            element.style.visibility = 'visible'
            element.style.position = 'static'
            const height = element.offsetHeight
            element.style.visibility = 'hidden'
            element.style.position = 'absolute'
            
            newMeasurements.push({
              id,
              height,
              element,
              content,
              type
            })
          } else {
            const height = measureSection(element, id, content)
            
            newMeasurements.push({
              id,
              height,
              element,
              content,
              type
            })
          }
        })

        // Clean up temporary container and fragment
        try {
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer)
            addedElementsRef.current.delete(tempContainer)
          }
        } catch (error) {
          console.warn('Error cleaning up measurement container:', error)
        }
        
        // Measurements completed
        if (process.env.NODE_ENV === 'development') {
          console.log(`useSectionMeasurement: Found ${sections.length} sections, measured ${newMeasurements.length}`);
          console.log('Measured sections:', newMeasurements.map(m => ({ id: m.id, height: m.height })));
        }
        setMeasurements(newMeasurements)
        setIsMeasuring(false)
        isCurrentlyMeasuringRef.current = false
        
        // Mark as successfully measured if we got measurements
        if (newMeasurements.length > 0) {
          hasSuccessfullyMeasuredRef.current = true
        }
      })
    }, 200) // Increased debounce for better stability

    return () => clearTimeout(timeoutId)
  }, [measureSection, generateContentHash, isMeasuring, measurements.length])

  // Setup ResizeObserver
  useEffect(() => {
    if (typeof window === 'undefined') return

    resizeObserverRef.current = new ResizeObserver((entries) => {
      // Debounce measurements to avoid excessive recalculations with improved stability
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement
          if (element.dataset.cvSection) {
            const rawId = element.dataset.cvSection
            // Create unique ID while preserving the section type for grouping
            const id = rawId.startsWith('header-') ? `header-${Date.now()}` : rawId
            const content = element.textContent || ''
            const type = element.dataset.sectionType as 'header' | 'section' | 'break' || 'section'
            
            const height = measureSection(element, id, content)
            
            setMeasurements(prev => 
              prev.map(m => m.id === id ? { ...m, height, content } : m)
            )
          }
        })
      }, 200) // Increased debounce for stability
    })

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      clearTimeout(resizeTimeoutRef.current)
    }
  }, [measureSection])

  // Cleanup measurement container and all added elements
  useEffect(() => {
    const container = measurementContainerRef.current;
    // Copy ref value to variable inside effect for cleanup
    const addedElements = addedElementsRef.current;
    const elements = Array.from(addedElements);
    
    return () => {
      try {
        // Clean up measurement container
        if (container && document.body.contains(container)) {
          document.body.removeChild(container)
        }
        
        // Clean up any tracked elements
        elements.forEach(element => {
          try {
            if (document.body.contains(element)) {
              document.body.removeChild(element)
            }
          } catch (error) {
            console.warn('Error cleaning up tracked element:', error)
          }
        })
        addedElements.clear()
      } catch (error) {
        console.warn('Error in measurement cleanup:', error)
      }
    }
  }, [])

  return {
    measurements,
    cache,
    isMeasuring,
    measureAllSections,
    A4_HEIGHT_PX,
    A4_WIDTH_PX
  }
}

