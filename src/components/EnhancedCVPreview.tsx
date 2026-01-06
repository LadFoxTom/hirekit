'use client'

import React from 'react'
import { CVData } from '@/types/cv'
import { CVPreview } from './CVPreview'
import { FaCog } from 'react-icons/fa'

interface EnhancedCVPreviewProps {
  data: CVData
  onDataChange?: (data: CVData) => void
  className?: string
}

export const EnhancedCVPreview: React.FC<EnhancedCVPreviewProps> = ({
  data,
  onDataChange,
  className = ''
}) => {
  

  // Simplified approach - just show the CV content directly
  // The complex measurement system can be re-enabled later when needed

  return (
    <div className={`flex h-full min-h-0 w-full ${className}`} style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col min-h-0 w-full" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
        {/* Preview Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">CV Preview</h2>
            <p className="text-sm text-gray-500">View and edit your CV</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Settings"
            >
              <FaCog className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CV Preview */}
        <div className="flex-1 min-h-0" style={{ height: '100%', overflow: 'hidden' }}>
          <div className="h-full overflow-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <CVPreview data={data} isPreview={true} key={`cv-preview-${data.fullName || 'default'}`} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
