import React, { useState, useEffect } from 'react'
import { FaTimes, FaSave, FaUndo, FaRedo, FaCopy, FaDownload, FaSpinner } from 'react-icons/fa'
import { CVData } from '@/types/cv'
import { useLocale } from '@/context/LocaleContext'
import toast from 'react-hot-toast'

interface CVTextEditorModalProps {
  isOpen: boolean
  onClose: () => void
  cvData: CVData
  cvText: string
  onSave: (editedText: string) => void
}

export default function CVTextEditorModal({ 
  isOpen, 
  onClose, 
  cvData, 
  cvText, 
  onSave 
}: CVTextEditorModalProps) {
  const { t } = useLocale()
  const [editedText, setEditedText] = useState(cvText)
  const [originalText, setOriginalText] = useState(cvText)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setEditedText(cvText)
      setOriginalText(cvText)
      setHasChanges(false)
      updateCounts(cvText)
    }
  }, [isOpen, cvText])

  const updateCounts = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
    setCharCount(text.length)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setEditedText(newText)
    setHasChanges(newText !== originalText)
    updateCounts(newText)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      onSave(editedText)
      setOriginalText(editedText)
      setHasChanges(false)
      toast.success('CV text updated successfully')
    } catch (error) {
      console.error('Error saving CV text:', error)
      toast.error('Failed to save CV text')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setEditedText(originalText)
    setHasChanges(false)
    updateCounts(originalText)
    toast.success('Changes reset to original')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText)
      toast.success('CV text copied to clipboard')
    } catch (error) {
      console.error('Error copying text:', error)
      toast.error('Failed to copy text')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cvData.fullName || 'CV'}-text.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('CV text downloaded')
  }

  const getCVTitle = () => {
    return cvData.fullName || cvData.title || 'CV'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Edit CV Text for Letter Generation
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Review and edit your CV information before using it for the motivational letter
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
        <div className="flex flex-col lg:flex-row h-[calc(95vh-140px)]">
          {/* Left Panel - Editor */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CV Text Content
              </label>
            </div>
            <div className="relative flex-1 min-h-0">
              <textarea
                value={editedText}
                onChange={handleTextChange}
                className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm overflow-y-auto"
                placeholder="Your CV content will appear here..."
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                {wordCount} words, {charCount} chars
              </div>
            </div>
          </div>

          {/* Right Panel - Info & Actions */}
          <div className="w-full lg:w-80 p-6 border-l border-gray-200 bg-gray-50">
            <div className="space-y-6">
              {/* CV Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">CV Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-600">{getCVTitle()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="ml-2 text-gray-600">{cvData.title || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Template:</span>
                    <span className="ml-2 text-gray-600">{cvData.template || 'default'}</span>
                  </div>
                  {cvData.experience && (
                    <div>
                      <span className="font-medium text-gray-700">Experience:</span>
                      <span className="ml-2 text-gray-600">{cvData.experience.length} positions</span>
                    </div>
                  )}
                  {cvData.education && (
                    <div>
                      <span className="font-medium text-gray-700">Education:</span>
                      <span className="ml-2 text-gray-600">{cvData.education.length} entries</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Editing Tips</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Remove sensitive information you don't want to share</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Add specific achievements relevant to the job</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Ensure all dates and company names are accurate</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Keep the most relevant experience for the position</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    disabled={!hasChanges}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaUndo className="mr-2" />
                    Reset Changes
                  </button>
                  
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaCopy className="mr-2" />
                    Copy to Clipboard
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FaDownload className="mr-2" />
                    Download as Text
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    hasChanges 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {hasChanges ? 'Modified' : 'Saved'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {hasChanges && (
              <span className="text-yellow-600">
                ⚠️ You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 