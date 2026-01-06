// @ts-nocheck
'use client'

import { useMemo, useCallback } from 'react'
import { SectionMeasurement } from './useSectionMeasurement'

export interface Page {
  id: string
  sections: SectionMeasurement[]
  height: number
  remainingSpace: number
  fitScore: number // 0-100, higher is better
  hasOverflow: boolean
}

export interface PaginationOptions {
  pageHeight: number
  minSectionHeight: number
  allowSplitting: boolean
  widowOrphanLines: number
  marginTop: number
  marginBottom: number
}

const DEFAULT_OPTIONS: PaginationOptions = {
  pageHeight: 1123, // A4 height in pixels
  minSectionHeight: 20,
  allowSplitting: false,
  widowOrphanLines: 2,
  marginTop: 40,
  marginBottom: 40
}

export function usePagination(measurements: SectionMeasurement[], options: Partial<PaginationOptions> = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const availableHeight = opts.pageHeight - opts.marginTop - opts.marginBottom
  
  console.log('usePagination called with measurements:', measurements.length, measurements)

  // Greedy pagination algorithm
  const paginateGreedy = useCallback((sections: SectionMeasurement[]): Page[] => {
    const pages: Page[] = []
    let currentPage: SectionMeasurement[] = []
    let currentHeight = 0

    for (const section of sections) {
      // Check if section fits on current page
      if (currentHeight + section.height <= availableHeight) {
        currentPage.push(section)
        currentHeight += section.height
      } else {
        // Start new page if current page has content
        if (currentPage.length > 0) {
          pages.push(createPage(currentPage, currentHeight, availableHeight))
          currentPage = [section]
          currentHeight = section.height
        } else {
          // Section is too large for a single page
          if (opts.allowSplitting && section.height > availableHeight) {
            // For now, just put it on its own page
            // TODO: Implement section splitting logic
            pages.push(createPage([section], section.height, availableHeight))
          } else {
            // Force it onto the page (will overflow)
            pages.push(createPage([section], section.height, availableHeight))
          }
        }
      }
    }

    // Add the last page if it has content
    if (currentPage.length > 0) {
      pages.push(createPage(currentPage, currentHeight, availableHeight))
    }

    return pages
  }, [availableHeight, opts.allowSplitting, createPage])

  // First-fit-decreasing algorithm for optimization
  const paginateOptimized = useCallback((sections: SectionMeasurement[]): Page[] => {
    // Sort sections by height (largest first) for better packing
    const sortedSections = [...sections].sort((a, b) => b.height - a.height)
    
    const pages: Page[] = []
    const remainingSpace: number[] = []

    for (const section of sortedSections) {
      let placed = false

      // Try to fit in existing pages
      for (let i = 0; i < pages.length; i++) {
        if (remainingSpace[i] >= section.height) {
          // Add to existing page
          pages[i].sections.push(section)
          pages[i].height += section.height
          remainingSpace[i] -= section.height
          placed = true
          break
        }
      }

      // If couldn't fit in existing pages, create new page
      if (!placed) {
        const newPage = createPage([section], section.height, availableHeight)
        pages.push(newPage)
        remainingSpace.push(availableHeight - section.height)
      }
    }

    // Recalculate page properties
    return pages.map(page => ({
      ...page,
      height: page.sections.reduce((sum, s) => sum + s.height, 0),
      remainingSpace: availableHeight - page.height,
      fitScore: calculateFitScore(page.height, availableHeight),
      hasOverflow: page.height > availableHeight
    }))
  }, [availableHeight, calculateFitScore, createPage])

  // Create a page object
  const createPage = useCallback((sections: SectionMeasurement[], height: number, maxHeight: number): Page => {
    const remainingSpace = maxHeight - height
    const fitScore = calculateFitScore(height, maxHeight)
    const hasOverflow = height > maxHeight

    return {
      id: `page-${Date.now()}-${Math.random()}`,
      sections,
      height,
      remainingSpace,
      fitScore,
      hasOverflow
    }
  }, [calculateFitScore])

  // Calculate fit score (0-100, higher is better)
  const calculateFitScore = useCallback((height: number, maxHeight: number): number => {
    if (height > maxHeight) return 0 // Overflow is bad
    const utilization = height / maxHeight
    // Prefer 80-95% utilization
    if (utilization >= 0.8 && utilization <= 0.95) return 100
    if (utilization >= 0.7 && utilization < 0.8) return 80
    if (utilization >= 0.95 && utilization <= 1) return 70
    if (utilization >= 0.5 && utilization < 0.7) return 60
    return Math.max(0, utilization * 50) // Very low utilization is bad
  }, [])

  // Detect problematic sections
  const detectProblems = useCallback((pages: Page[]) => {
    const problems: Array<{
      type: 'overflow' | 'excessive-whitespace' | 'orphan' | 'widow'
      pageId: string
      sectionId?: string
      severity: 'low' | 'medium' | 'high'
      message: string
      suggestion?: string
    }> = []

    pages.forEach(page => {
      // Check for overflow
      if (page.hasOverflow) {
        problems.push({
          type: 'overflow',
          pageId: page.id,
          severity: 'high',
          message: `Page ${pages.indexOf(page) + 1} has content overflow`,
          suggestion: 'Consider shortening content or splitting sections'
        })
      }

      // Check for excessive whitespace
      if (page.remainingSpace > availableHeight * 0.3) {
        problems.push({
          type: 'excessive-whitespace',
          pageId: page.id,
          severity: 'medium',
          message: `Page ${pages.indexOf(page) + 1} has ${Math.round(page.remainingSpace)}px of unused space`,
          suggestion: 'Consider adding content or reordering sections'
        })
      }

      // Check for orphans/widows (simplified)
      page.sections.forEach(section => {
        if (section.type === 'section' && section.height < opts.minSectionHeight) {
          problems.push({
            type: 'orphan',
            pageId: page.id,
            sectionId: section.id,
            severity: 'low',
            message: `Section "${section.id}" is very short and may look orphaned`,
            suggestion: 'Consider combining with adjacent content'
          })
        }
      })
    })

    return problems
  }, [availableHeight, opts.minSectionHeight])

  // Generate suggestions for optimization
  const generateSuggestions = useCallback((pages: Page[], problems: any[]) => {
    const suggestions: Array<{
      type: 'reorder' | 'rephrase' | 'resize' | 'split' | 'combine'
      priority: 'low' | 'medium' | 'high'
      description: string
      action?: () => void
    }> = []

    // Analyze overall fit
    const avgFitScore = pages.reduce((sum, page) => sum + page.fitScore, 0) / pages.length
    const totalPages = pages.length

    if (avgFitScore < 60) {
      suggestions.push({
        type: 'reorder',
        priority: 'high',
        description: 'Poor page utilization detected. Consider reordering sections for better fit.'
      })
    }

    if (totalPages > 2) {
      suggestions.push({
        type: 'rephrase',
        priority: 'medium',
        description: `Document spans ${totalPages} pages. Consider shortening content to fit on fewer pages.`
      })
    }

    // Add specific suggestions based on problems
    problems.forEach(problem => {
      if (problem.type === 'overflow') {
        suggestions.push({
          type: 'rephrase',
          priority: 'high',
          description: 'Content overflow detected. Consider shortening text or reducing font size.'
        })
      }

      if (problem.type === 'excessive-whitespace') {
        suggestions.push({
          type: 'reorder',
          priority: 'medium',
          description: 'Large whitespace detected. Consider reordering sections to fill pages better.'
        })
      }
    })

    return suggestions
  }, [])

  // Create a stable hash of measurements to prevent unnecessary recalculations
  const measurementsHash = useMemo(() => {
    if (measurements.length === 0) return ''
    return measurements.map(m => `${m.id}-${m.height}-${m.content.length}`).join('|')
  }, [measurements])

  // Main pagination function with memoization
  const paginate = useMemo(() => {
    console.log('usePagination memoized calculation with measurements:', measurements.length)
    if (measurements.length === 0) {
      console.log('No measurements, returning empty result')
      return { pages: [], problems: [], suggestions: [] }
    }

    // Check if we can use cached results
    const cacheKey = `pagination-${measurementsHash}-${availableHeight}`
    
    const pages = paginateGreedy(measurements)
    const problems = detectProblems(pages)
    const suggestions = generateSuggestions(pages, problems)

    console.log('Generated pages:', pages.length, pages)

    return {
      pages,
      problems,
      suggestions,
      totalPages: pages.length,
      avgFitScore: pages.reduce((sum, page) => sum + page.fitScore, 0) / pages.length,
      hasOverflow: pages.some(page => page.hasOverflow),
      cacheKey
    }
  }, [measurementsHash, availableHeight, measurements, paginateGreedy, detectProblems, generateSuggestions])

  return {
    ...paginate,
    paginateOptimized,
    availableHeight,
    options: opts
  }
}
