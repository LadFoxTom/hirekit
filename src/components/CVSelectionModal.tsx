import React, { useState, useEffect } from 'react'
import { FaTimes, FaEye, FaEdit, FaDownload, FaCheck, FaSpinner } from 'react-icons/fa'
import { CVData } from '@/types/cv'
import { useLocale } from '@/context/LocaleContext'
import toast from 'react-hot-toast'

interface SavedCV {
  id: string
  title: string
  content: CVData
  template: string
  createdAt: string
  updatedAt: string
  viewCount: number
  downloadCount: number
  isFavorite?: boolean
}

interface CVSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onCVSelect: (cvData: CVData, cvText: string) => void
  onEditCV: (cvData: CVData) => void
}

export default function CVSelectionModal({ 
  isOpen, 
  onClose, 
  onCVSelect, 
  onEditCV 
}: CVSelectionModalProps) {
  const { t } = useLocale()
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCV, setSelectedCV] = useState<SavedCV | null>(null)
  const [convertingToText, setConvertingToText] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSavedCVs()
    }
  }, [isOpen])

  const fetchSavedCVs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cv')
      if (response.ok) {
        const data = await response.json()
        setSavedCVs(data.cvs || [])
      } else {
        throw new Error('Failed to fetch CVs')
      }
    } catch (error) {
      console.error('Error fetching CVs:', error)
      toast.error('Failed to load saved CVs')
    } finally {
      setLoading(false)
    }
  }

  const handleCVSelect = async (cv: SavedCV) => {
    try {
      setConvertingToText(true)
      
      // Convert CV data to text format
      const response = await fetch('/api/cv-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: cv.content
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to convert CV to text')
      }

      const { cvText } = await response.json()
      
      onCVSelect(cv.content, cvText)
      onClose()
    } catch (error) {
      console.error('Error converting CV to text:', error)
      toast.error('Failed to process CV')
    } finally {
      setConvertingToText(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCVPreview = (cv: SavedCV) => {
    const content = cv.content
    const name = content.fullName || content.title || 'Untitled CV'
    const title = content.title || content.professionalHeadline || 'Professional'
    const summary = content.summary || 'No summary available'
    
    return {
      name,
      title,
      summary: summary.length > 100 ? summary.substring(0, 100) + '...' : summary
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {t('cv_selection.title')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('cv_selection.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
                          <div className="flex items-center justify-center py-12">
                <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                <span className="ml-3 text-gray-600">{t('cv_selection.loading')}</span>
              </div>
          ) : savedCVs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEye className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('cv_selection.no_cvs')}</h3>
              <p className="text-gray-600 mb-6">
                {t('cv_selection.no_cvs_description')}
              </p>
              <button
                onClick={() => {
                  onClose()
                  window.open('/builder', '_blank')
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('cv_selection.create_cv')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCVs.map((cv) => {
                const preview = getCVPreview(cv)
                return (
                  <div
                    key={cv.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedCV(cv)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {preview.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {preview.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Updated {formatDate(cv.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {cv.template}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {preview.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <FaEye className="mr-1" />
                          {cv.viewCount} views
                        </span>
                        <span className="flex items-center">
                          <FaDownload className="mr-1" />
                          {cv.downloadCount} downloads
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditCV(cv.content)
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit CV"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCVSelect(cv)
                          }}
                          disabled={convertingToText}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                                                     {convertingToText ? (
                             <>
                               <FaSpinner className="animate-spin mr-2" />
                               {t('cv_selection.processing')}
                             </>
                           ) : (
                             <>
                               <FaCheck className="mr-2" />
                               {t('cv_selection.use_cv')}
                             </>
                           )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {savedCVs.length > 0 && (
              <span>
                {savedCVs.length} {t('cv_selection.cvs_available')}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose()
                window.open('/builder', '_blank')
              }}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cv_selection.create_new_cv')}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cv_selection.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 