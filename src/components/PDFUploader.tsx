'use client'

import React, { useState, useRef } from 'react'
import { FaFilePdf, FaUpload, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

interface PDFUploaderProps {
  onPDFDataExtracted: (data: any) => void
  title?: string
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onPDFDataExtracted, title = "Upload your CV (PDF)" }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }

    setUploadedFile(file)
    await processPDF(file)
  }

  const processPDF = async (file: File) => {
    setIsUploading(true)
    
    try {
      // For now, we'll simulate PDF processing
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
      
      // Show a message that PDF parsing is coming soon
      toast.success('PDF upload feature is coming soon! For now, please manually enter your CV information.')
      
      // For demonstration, we'll create some sample extracted data
      const sampleData = {
        fullName: 'Sample Name',
        contact: {
          email: 'sample@email.com',
          phone: '+1 234 567 8900',
          location: 'Sample City, Country'
        },
        title: 'Sample Job Title',
        summary: 'This is a sample summary extracted from your PDF.',
        experience: [
          {
            title: 'Sample Job Title',
            company: 'Sample Company',
            dates: '2020 - Present',
            achievements: ['Sample achievement 1', 'Sample achievement 2']
          }
        ],
        education: [
          {
            degree: 'Sample Degree',
            institution: 'Sample University',
            dates: '2016 - 2020',
            field: 'Sample Field of Study'
          }
        ],
        skills: ['Sample Skill 1', 'Sample Skill 2', 'Sample Skill 3']
      }
      
      onPDFDataExtracted(sampleData)
      toast.success('Sample data loaded! PDF parsing will be available soon.')
      
    } catch (error) {
      console.error('PDF processing error:', error)
      toast.error('Failed to process PDF. Please try again.')
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
      await processPDF(file)
    } else {
      toast.error('Please drop a PDF file')
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const resetUpload = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isUploading
            ? 'border-blue-300 bg-blue-50'
            : uploadedFile
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <FaSpinner className="text-blue-500 text-4xl animate-spin" />
              <div>
                <p className="text-blue-700 font-medium text-lg">Processing PDF...</p>
                <p className="text-blue-500 text-sm mt-2">
                  Analyzing your document (demo mode)
                </p>
              </div>
            </>
          ) : uploadedFile ? (
            <>
              <FaCheckCircle className="text-green-500 text-4xl" />
              <div>
                <p className="text-green-700 font-medium text-lg">PDF Processed Successfully!</p>
                <p className="text-green-600 text-sm mt-2">
                  {uploadedFile.name}
                </p>
                <p className="text-green-500 text-xs mt-1">
                  (Demo mode - real PDF parsing coming soon)
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    resetUpload()
                  }}
                  className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
                >
                  Upload different file
                </button>
              </div>
            </>
          ) : (
            <>
              <FaFilePdf className="text-gray-400 text-4xl" />
              <div>
                <p className="text-gray-700 font-medium text-lg">{title}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Drag and drop your PDF here, or click to browse
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  PDF parsing coming soon - demo mode available
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {!uploadedFile && !isUploading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Supported formats: PDF only</p>
          <p>Maximum file size: 10MB</p>
          <p className="text-blue-500 mt-2">💡 PDF parsing will be available in the next update!</p>
        </div>
      )}
    </div>
  )
}

export default PDFUploader 