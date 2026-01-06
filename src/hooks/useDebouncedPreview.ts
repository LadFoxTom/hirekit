import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CVData } from '@/types/cv';
import { useAnalytics } from '@/lib/analytics';

interface DebouncedPreviewOptions {
  delay?: number;
  maxDelay?: number;
  enableAnalytics?: boolean;
}

export function useDebouncedPreview(
  cvData: CVData,
  options: DebouncedPreviewOptions = {}
) {
  const {
    delay = 300,
    maxDelay = 1000,
    enableAnalytics = true
  } = options;

  const [previewData, setPreviewData] = useState<CVData>(cvData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const maxDelayTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();
  const analytics = useAnalytics();

  const updatePreview = useCallback((newData: CVData) => {
    // Cancel previous timeouts
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (maxDelayTimeoutRef.current) {
      clearTimeout(maxDelayTimeoutRef.current);
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Set max delay timeout (force update after maxDelay)
    maxDelayTimeoutRef.current = setTimeout(() => {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsUpdating(true);
        setPreviewData(newData);
        setLastUpdateTime(Date.now());
        setIsUpdating(false);
        
        if (enableAnalytics) {
          analytics.trackPerformanceMetric('preview_update_forced', maxDelay, 'ms');
        }
      }
    }, maxDelay);

    // Set debounced timeout
    debounceTimeoutRef.current = setTimeout(() => {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsUpdating(true);
        setPreviewData(newData);
        setLastUpdateTime(Date.now());
        setIsUpdating(false);
        
        if (enableAnalytics) {
          analytics.trackPerformanceMetric('preview_update_debounced', delay, 'ms');
        }
      }
    }, delay);

  }, [delay, maxDelay, enableAnalytics, analytics]);

  // Update preview when cvData changes
  useEffect(() => {
    updatePreview(cvData);
  }, [cvData, updatePreview]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (maxDelayTimeoutRef.current) {
        clearTimeout(maxDelayTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    previewData,
    isUpdating,
    lastUpdateTime,
    updatePreview
  };
}

// Hook for virtual scrolling in long CVs
export function useVirtualScrolling<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef: setContainerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleRange
  };
}

// Hook for progressive rendering
export function useProgressiveRendering(
  cvData: CVData,
  stages: ('skeleton' | 'basic' | 'full')[] = ['skeleton', 'basic', 'full']
) {
  const [currentStage, setCurrentStage] = useState<typeof stages[0]>('skeleton');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let stageIndex = 0;
    
    const progressStages = () => {
      if (stageIndex < stages.length) {
        setCurrentStage(stages[stageIndex]);
        stageIndex++;
        
        // Wait for fonts and images to load
        if (stageIndex === stages.length) {
          Promise.all([
            document.fonts.ready,
            new Promise(resolve => {
              const images = Array.from(document.images);
              if (images.length === 0) {
                resolve(void 0);
                return;
              }
              
              Promise.all(
                images.map(img => {
                  if (img.complete) return Promise.resolve();
                  return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                  });
                })
              ).then(resolve);
            })
          ]).then(() => {
            setIsReady(true);
          });
        } else {
          setTimeout(progressStages, 100);
        }
      }
    };

    progressStages();
  }, [cvData, stages]);

  return {
    currentStage,
    isReady,
    showSkeleton: currentStage === 'skeleton',
    showBasic: currentStage === 'basic' || currentStage === 'full',
    showFull: currentStage === 'full' && isReady
  };
}

// Hook for preview optimization
export function usePreviewOptimization(cvData: CVData) {
  const [optimizationLevel, setOptimizationLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    // Detect low-end devices
    const checkDeviceCapability = () => {
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      const connection = (navigator as any).connection;
      
      const isLowEnd = memory < 4 || cores < 4 || 
        (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'));
      
      setIsLowEndDevice(isLowEnd);
      setOptimizationLevel(isLowEnd ? 'high' : 'medium');
    };

    checkDeviceCapability();
  }, []);

  const getOptimizedData = useCallback((data: CVData): CVData => {
    if (optimizationLevel === 'low') {
      return data;
    }

    // Medium optimization: reduce image quality
    if (optimizationLevel === 'medium') {
      return {
        ...data,
        // Reduce image quality for preview
        photoUrl: data.photoUrl ? `${data.photoUrl}?quality=80` : data.photoUrl
      };
    }

    // High optimization: disable animations, reduce quality
    if (optimizationLevel === 'high') {
      return {
        ...data,
        photoUrl: data.photoUrl ? `${data.photoUrl}?quality=60` : data.photoUrl,
        // Remove heavy sections for preview
        layout: {
          ...data.layout,
          showIcons: false
        }
      };
    }

    return data;
  }, [optimizationLevel]);

  return {
    optimizationLevel,
    isLowEndDevice,
    getOptimizedData,
    setOptimizationLevel
  };
}

export type { DebouncedPreviewOptions };
