'use client'

import React from 'react'
import { FaTimes, FaFileAlt } from 'react-icons/fa'

interface GenerateLetterModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (company: string, position: string) => void
  companyName: string
  positionTitle: string
  onCompanyChange: (value: string) => void
  onPositionChange: (value: string) => void
}

const GenerateLetterModal: React.FC<GenerateLetterModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  companyName,
  positionTitle,
  onCompanyChange,
  onPositionChange
}) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    if (companyName.trim() && positionTitle.trim()) {
      onConfirm(companyName.trim(), positionTitle.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <FaFileAlt className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Generate New Cover Letter</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed mb-6">
            Please provide the company and position details to generate a personalized cover letter.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(e) => onCompanyChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="position-title" className="block text-sm font-medium text-gray-700 mb-2">
                Position Title *
              </label>
              <input
                id="position-title"
                type="text"
                value={positionTitle}
                onChange={(e) => onPositionChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter position title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!companyName.trim() || !positionTitle.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Letter
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateLetterModal 