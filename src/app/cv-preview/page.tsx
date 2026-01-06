'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EnhancedCVPreview } from '@/components/EnhancedCVPreview'
import PDFExport from '@/components/PDFExport'
import { FaArrowLeft, FaPrint, FaCog, FaEyeSlash } from 'react-icons/fa'
import { CVData } from '@/types/cv'

// Utility functions for safe data encoding/decoding
const safeEncodeData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data)
    return btoa(unescape(encodeURIComponent(jsonString)))
  } catch (error) {
    console.error('Error encoding data:', error)
    return ''
  }
}

const safeDecodeData = (encodedData: string): any => {
  try {
    const jsonString = decodeURIComponent(escape(atob(encodedData)))
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Error decoding data:', error)
    return null
  }
}

export default function CVPreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // Get CV data from URL params or localStorage
  useEffect(() => {
    const loadCVData = () => {
      try {
        // Try to get from URL params first
        const dataParam = searchParams?.get('data')
        if (dataParam) {
          // Try the new safe decoding method first
          const decodedData = safeDecodeData(dataParam)
          if (decodedData) {
            setCvData(decodedData)
            setIsLoading(false)
            return
          }
          
          // Fallback to the old method for backward compatibility
          try {
            const decoded = decodeURIComponent(dataParam)
            const parsed = JSON.parse(decoded)
            setCvData(parsed)
            setIsLoading(false)
            return
          } catch (decodeError) {
            console.warn('Failed to decode URL data, trying alternative methods:', decodeError)
            
            // Try to parse directly if it's already decoded
            try {
              const parsed = JSON.parse(dataParam)
              setCvData(parsed)
              setIsLoading(false)
              return
            } catch (parseError) {
              console.warn('Failed to parse URL data directly:', parseError)
              // Continue to localStorage fallback
            }
          }
        }

        // Fallback to localStorage
        const stored = localStorage.getItem('cvData')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            setCvData(parsed)
          } catch (localError) {
            console.error('Error parsing localStorage data:', localError)
          }
        }
      } catch (error) {
        console.error('Error loading CV data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCVData()
  }, [searchParams])

  const handleBack = () => {
    // Try to go back to the previous page, or default to builder
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/builder')
    }
  }

  const handleDataChange = (newData: CVData) => {
    setCvData(newData)
    // Update localStorage
    localStorage.setItem('cvData', JSON.stringify(newData))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CV preview...</p>
        </div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <h2 className="font-semibold mb-2">No CV Data Found</h2>
            <p className="text-sm">Please create a CV first before viewing the preview.</p>
          </div>
          <button
            onClick={() => router.push('/builder')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to CV Builder
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  CV Preview
                </h1>
                <p className="text-sm text-gray-500">
                  {cvData.fullName || 'Untitled CV'}
                </p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  showSettings 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Settings"
              >
                <FaCog className="w-4 h-4" />
              </button>
              
              <PDFExport cvData={cvData} />
              
              <button
                onClick={() => window.print()}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Print"
              >
                <FaPrint className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[calc(100vh-120px)]">
          <EnhancedCVPreview 
            data={cvData} 
            onDataChange={handleDataChange}
            className="h-full"
          />
        </div>
      </main>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Preview Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <FaEyeSlash className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV Template
                </label>
                <select 
                  value={cvData.template || 'modern'}
                  onChange={(e) => handleDataChange({ ...cvData, template: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select 
                  value={cvData.layout?.fontFamily || 'Inter'}
                  onChange={(e) => handleDataChange({ 
                    ...cvData, 
                    layout: { ...cvData.layout, fontFamily: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <input
                  type="color"
                  value={cvData.layout?.accentColor || '#3B82F6'}
                  onChange={(e) => handleDataChange({ 
                    ...cvData, 
                    layout: { ...cvData.layout, accentColor: e.target.value }
                  })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Reset to default settings
                    const { layout, ...restData } = cvData
                    handleDataChange({ ...restData, template: 'modern' })
                    setShowSettings(false)
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
