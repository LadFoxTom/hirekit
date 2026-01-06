'use client'

import React, { useState } from 'react'
import { FaUpload, FaFilePdf, FaFileAlt, FaTrash, FaSpinner, FaCheck, FaInfoCircle } from 'react-icons/fa'

interface LetterUploadInterfaceProps {
  uploadInfo: {
    jobFile?: File
    companyFile?: File
    pastedText?: string
  }
  onUploadInfoChange: (info: any) => void
}

const LetterUploadInterface: React.FC<LetterUploadInterfaceProps> = ({
  uploadInfo,
  onUploadInfoChange
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (file: File, type: 'jobFile' | 'companyFile') => {
    setIsUploading(true)
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      onUploadInfoChange({ ...uploadInfo, [type]: file })
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileDrop = (e: React.DragEvent, type: 'jobFile' | 'companyFile') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      handleFileUpload(file, type)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'jobFile' | 'companyFile') => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, type)
    }
  }

  const removeFile = (type: 'jobFile' | 'companyFile') => {
    onUploadInfoChange({ ...uploadInfo, [type]: undefined })
  }

  const updatePastedText = (text: string) => {
    onUploadInfoChange({ ...uploadInfo, pastedText: text })
  }

  const hasUploadedContent = uploadInfo.jobFile || uploadInfo.companyFile || (uploadInfo.pastedText && uploadInfo.pastedText.trim().length > 0)

  return (
    <div className="space-y-6">
      {/* Upload Status */}
      {hasUploadedContent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <FaCheck className="text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Ready to generate your letter! You've uploaded:
            </span>
          </div>
          <ul className="mt-2 text-sm text-green-700 space-y-1">
            {uploadInfo.jobFile && (
              <li>• Job description: {uploadInfo.jobFile.name}</li>
            )}
            {uploadInfo.companyFile && (
              <li>• Company information: {uploadInfo.companyFile.name}</li>
            )}
            {uploadInfo.pastedText && (
              <li>• Additional notes: {uploadInfo.pastedText.length} characters</li>
            )}
          </ul>
        </div>
      )}

      {/* Job Description Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Job Description</h4>
          {uploadInfo.jobFile && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              <FaCheck className="mr-1" />
              Uploaded
            </span>
          )}
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            uploadInfo.jobFile
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={(e) => handleFileDrop(e, 'jobFile')}
          onDragOver={(e) => e.preventDefault()}
        >
          {uploadInfo.jobFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FaFilePdf className="text-green-600 text-2xl mr-2" />
                <span className="font-medium text-gray-900">{uploadInfo.jobFile.name}</span>
              </div>
              <button
                onClick={() => removeFile('jobFile')}
                className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash className="mr-1" />
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <FaUpload className="text-gray-400 text-3xl mx-auto" />
              <div>
                <p className="text-sm text-gray-600">
                  Drag and drop a PDF or text file, or{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    browse
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={(e) => handleFileSelect(e, 'jobFile')}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF or TXT files only</p>
              </div>
            </div>
          )}
          {isUploading && (
            <div className="flex items-center justify-center mt-2">
              <FaSpinner className="animate-spin text-blue-600 mr-2" />
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Company Information Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Company Information</h4>
          {uploadInfo.companyFile && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              <FaCheck className="mr-1" />
              Uploaded
            </span>
          )}
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            uploadInfo.companyFile
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={(e) => handleFileDrop(e, 'companyFile')}
          onDragOver={(e) => e.preventDefault()}
        >
          {uploadInfo.companyFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FaFilePdf className="text-green-600 text-2xl mr-2" />
                <span className="font-medium text-gray-900">{uploadInfo.companyFile.name}</span>
              </div>
              <button
                onClick={() => removeFile('companyFile')}
                className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash className="mr-1" />
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <FaUpload className="text-gray-400 text-3xl mx-auto" />
              <div>
                <p className="text-sm text-gray-600">
                  Drag and drop a PDF or text file, or{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    browse
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={(e) => handleFileSelect(e, 'companyFile')}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF or TXT files only</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Text Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
          {uploadInfo.pastedText && uploadInfo.pastedText.trim().length > 0 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              <FaCheck className="mr-1" />
              Added
            </span>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Paste any additional details, requirements, or notes
          </label>
          <textarea
            value={uploadInfo.pastedText || ''}
            onChange={(e) => updatePastedText(e.target.value)}
            placeholder="Paste job requirements, company culture notes, specific achievements you want to highlight, or any other relevant information..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={6}
          />
          {uploadInfo.pastedText && (
            <div className="flex items-center text-xs text-gray-500">
              <FaInfoCircle className="mr-1" />
              {uploadInfo.pastedText.length} characters added
            </div>
          )}
        </div>
      </div>


    </div>
  )
}

export default LetterUploadInterface 