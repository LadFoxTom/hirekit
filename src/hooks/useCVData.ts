'use client'

import { useState, useEffect } from 'react'
import { CVData } from '@/types/cv'
import { sampleCVData, minimumSampleCVData } from '@/data/sampleCVData'

// Session storage keys
const CV_DATA_STORAGE_KEY = 'cv_builder_data'

interface UseCVDataReturn {
  cvData: CVData
  updateCvData: (cvUpdate: Partial<CVData>, message?: string) => void
  canUndo: boolean
  handleUndo: () => void
  resetCvData: (preserveTemplate?: string | null) => void
  loadSampleData: (type?: 'full' | 'minimal') => void
}

export function useCVData(initialData: CVData = {}): UseCVDataReturn {
  const [cvData, setCvData] = useState<CVData>(initialData)
  const [historyStack, setHistoryStack] = useState<CVData[]>([])
  const [canUndo, setCanUndo] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false)

  // Mark as client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // No longer clearing sample data from localStorage - we now allow it to persist
  // This enables users to save sample data to the database for testing purposes

  // Load data from localStorage on mount (client-side only)
  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && !hasLoadedFromStorage) {
      try {
        // Load saved CV data
        const savedData = localStorage.getItem(CV_DATA_STORAGE_KEY)
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          
          // Remove any internal flags before setting the data
          const { _loadedFromDatabase, _savedCVId, ...cleanData } = parsedData
          setCvData(cleanData)
          console.log('[useCVData] Loaded CV data from localStorage', { 
            hasContent: Object.keys(cleanData).length > 0,
            fullName: cleanData.fullName 
          })
        }
        setHasLoadedFromStorage(true)
      } catch (error) {
        console.error('Error loading CV data from localStorage:', error)
        setHasLoadedFromStorage(true)
      }
    }
  }, [isClient, hasLoadedFromStorage])

  // Save to localStorage whenever data changes (including sample data for persistence)
  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && Object.keys(cvData).length > 0 && hasLoadedFromStorage) {
      // Save all data including sample data - this allows users to save sample data to database
      localStorage.setItem(CV_DATA_STORAGE_KEY, JSON.stringify(cvData))
    }
  }, [cvData, isClient, hasLoadedFromStorage])

  // Update CV data with history tracking
  const updateCvData = (cvUpdate: Partial<CVData>, message?: string) => {
    // Add current state to history stack
    setHistoryStack(prev => {
      const newStack = prev.length >= 20 ? prev.slice(-19) : [...prev]
      return [...newStack, cvData]
    })
    
    setCvData(prev => {
      // Start with a complete copy of the previous data
      const newData = { ...prev }
      
      // Copy over all properties from cvUpdate, including any new ones
      Object.keys(cvUpdate).forEach(key => {
        // Special handling for nested objects
        if (key === 'contact' && cvUpdate.contact) {
          newData.contact = { ...(prev.contact || {}), ...cvUpdate.contact }
        } else if (key === 'social' && cvUpdate.social) {
          newData.social = { ...(prev.social || {}), ...cvUpdate.social }
        } else if (key === 'layout' && cvUpdate.layout) {
          // Create a deep copy of the layout to ensure object reference changes
          newData.layout = { 
            ...(prev.layout || {}), 
            ...cvUpdate.layout,
            // Always create new array references to ensure object reference changes
            hiddenSections: cvUpdate.layout.hiddenSections ? [...cvUpdate.layout.hiddenSections] : (prev.layout?.hiddenSections ? [...prev.layout.hiddenSections] : []),
            sectionOrder: cvUpdate.layout.sectionOrder ? [...cvUpdate.layout.sectionOrder] : (prev.layout?.sectionOrder ? [...prev.layout.sectionOrder] : [])
          }
        } 
        // Special handling for array-type properties that need merging
        else if (key === 'experience' && cvUpdate.experience) {
          newData.experience = cvUpdate.experience
        } else if (key === 'education' && cvUpdate.education) {
          newData.education = cvUpdate.education
        } else if (key === 'certifications' && cvUpdate.certifications) {
          newData.certifications = cvUpdate.certifications
        } else if (key === 'projects' && cvUpdate.projects) {
          newData.projects = cvUpdate.projects
        } 
        // For simple properties (including photoUrl, fullName, title, etc.)
        else {
          // @ts-ignore - This is safe because we're iterating over keys of cvUpdate
          newData[key] = cvUpdate[key]
        }
      })

      return newData
    })
    
    setCanUndo(true)
  }

  // Handle undo operation
  const handleUndo = () => {
    if (historyStack.length > 0) {
      // Get the last state from history
      const previousState = historyStack[historyStack.length - 1]
      
      // Update CV data with previous state
      setCvData(previousState)
      
      // Remove the used state from history
      setHistoryStack(prev => prev.slice(0, -1))
      
      // Disable undo button if history is empty
      if (historyStack.length <= 1) {
        setCanUndo(false)
      }
    }
  }

  // Reset CV data (clear everything except optionally the template)
  const resetCvData = (preserveTemplate?: string | null) => {
    // Clear localStorage
    if (isClient && typeof window !== 'undefined') {
      localStorage.removeItem(CV_DATA_STORAGE_KEY)
    }
    
    // Reset state
    setCvData(preserveTemplate ? { template: preserveTemplate } : {})
    setHistoryStack([])
    setCanUndo(false)
  }

  // Load sample data for testing
  const loadSampleData = (type: 'full' | 'minimal' = 'full') => {
    const dataToLoad = type === 'full' ? sampleCVData : minimumSampleCVData
    
    // Reset history and load sample data
    setHistoryStack([])
    setCvData(dataToLoad)
    setCanUndo(false)
    
    // Save sample data to localStorage so it survives hot reload and page navigation
    // This allows users to save sample data to the database for testing
    if (typeof window !== 'undefined') {
      localStorage.setItem(CV_DATA_STORAGE_KEY, JSON.stringify(dataToLoad))
      console.log('[useCVData] Sample data loaded and saved to localStorage for persistence')
    }
  }

  return {
    cvData,
    updateCvData,
    canUndo,
    handleUndo,
    resetCvData,
    loadSampleData
  }
}

export default useCVData 