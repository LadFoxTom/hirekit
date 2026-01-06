'use client'

import React, { Suspense, lazy, useState, useEffect, useMemo, useCallback } from 'react'
import { FaSpinner, FaCheck, FaExclamationTriangle, FaDownload } from 'react-icons/fa'

// Lazy load components for better performance
const LazyPDFExport = lazy(() => import('./PDFExport'))

// Performance monitoring hook
export const usePerformanceMonitor = (operationName: string) => {
  const [startTime] = useState(performance.now())
  const [duration, setDuration] = useState<number | null>(null)
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')

  const complete = useCallback((success: boolean = true) => {
    const endTime = performance.now()
    const operationDuration = endTime - startTime
    setDuration(operationDuration)
    setStatus(success ? 'success' : 'error')

    // Log performance metrics
    if (process.env.NODE_ENV === 'development') {
      console.log(`${operationName}: ${operationDuration.toFixed(2)}ms`)
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && operationDuration > 1000) {
      // Send slow operation to analytics
      console.warn(`Slow operation detected: ${operationName} took ${operationDuration.toFixed(2)}ms`)
    }
  }, [operationName, startTime])

  return { duration, status, complete }
}

// Advanced loading component with skeleton
interface SkeletonProps {
  type: 'text' | 'avatar' | 'button' | 'card' | 'list'
  lines?: number
  className?: string
}

export function Skeleton({ type, lines = 3, className = '' }: SkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>
        )
      
      case 'avatar':
        return (
          <div className={`w-12 h-12 bg-gray-200 rounded-full animate-pulse ${className}`} />
        )
      
      case 'button':
        return (
          <div className={`h-10 bg-gray-200 rounded-lg animate-pulse ${className}`} />
        )
      
      case 'card':
        return (
          <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        )
      
      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )
      
      default:
        return null
    }
  }

  return renderSkeleton()
}

// Virtualized list for large datasets
interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = items.length * itemHeight
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2)

  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Debounced input component
interface DebouncedInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  delay?: number
  className?: string
}

export function DebouncedInput({
  value,
  onChange,
  placeholder,
  delay = 300,
  className = ''
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [localValue, onChange, delay, value])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  )
}

// Optimized CV Preview with lazy loading
interface OptimizedCVPreviewProps {
  data: any
  isVisible?: boolean
  className?: string
}

export function OptimizedCVPreview({ data, isVisible = true, className = '' }: OptimizedCVPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Simulate loading time for large CVs
      const timer = setTimeout(() => setIsLoaded(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isLoaded])

  if (!isVisible) {
    return <Skeleton type="card" className={className} />
  }

  if (!isLoaded) {
    return <Skeleton type="card" className={className} />
  }

  return (
    <Suspense fallback={<Skeleton type="card" className={className} />}>
              <div className={className}>CV Preview Component</div>
    </Suspense>
  )
}

// Progress indicator component
interface ProgressIndicatorProps {
  current: number
  total: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressIndicator({
  current,
  total,
  label,
  showPercentage = true,
  className = ''
}: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100)
  const isComplete = current >= total

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{label}</span>
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isComplete ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {isComplete && (
        <div className="flex items-center text-sm text-green-600">
          <FaCheck className="mr-1" />
          Complete
        </div>
      )}
    </div>
  )
}

// Performance optimized image component
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallback
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleLoad = () => setIsLoaded(true)
  const handleError = () => {
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback)
      setHasError(false)
    } else {
      setHasError(true)
    }
  }

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <FaExclamationTriangle className="text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />
    </div>
  )
}

// Memoized component wrapper for performance
export function withMemo<T extends object>(
  Component: React.ComponentType<T>,
  propsAreEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return React.memo(Component, propsAreEqual)
} 