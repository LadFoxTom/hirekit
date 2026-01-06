'use client'

import React, { useState } from 'react'
import { FaFilePdf, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaEye, FaEdit } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

interface PDFAnalysisProps {
  onAnalysisComplete: (data: any) => void
  className?: string
}

interface AnalysisResult {
  extractedData: any
  confidence: number
  suggestions: string[]
  missingFields: string[]
}

const PDFAnalysis: React.FC<PDFAnalysisProps> = ({ onAnalysisComplete, className = '' }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setUploadedFile(file)
    await analyzePDF(file)
  }

  const analyzePDF = async (file: File) => {
    setIsAnalyzing(true)
    
    try {
      // For now, we'll simulate PDF analysis
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
      
      // Create sample analysis data
      const sampleExtractedData = {
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
      
      const analysis: AnalysisResult = {
        extractedData: sampleExtractedData,
        confidence: 75, // Sample confidence score
        suggestions: [
          'Add more specific achievements with numbers',
          'Include relevant keywords from job descriptions',
          'Expand your professional summary',
          'Add more technical skills'
        ],
        missingFields: ['Certifications', 'Languages', 'Projects']
      }
      
      setAnalysisResult(analysis)
      onAnalysisComplete(sampleExtractedData)
      toast.success('PDF analysis completed! (Demo mode)')
      
    } catch (error) {
      console.error('PDF analysis error:', error)
      toast.error('Failed to analyze PDF. Please try again.')
      setUploadedFile(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const calculateConfidence = (data: any): number => {
    let score = 0
    let total = 0
    
    if (data.fullName) { score += 20; total += 20 }
    if (data.contact?.email) { score += 15; total += 15 }
    if (data.contact?.phone) { score += 15; total += 15 }
    if (data.title) { score += 10; total += 10 }
    if (data.summary) { score += 10; total += 10 }
    if (data.experience?.length > 0) { score += 15; total += 15 }
    if (data.education?.length > 0) { score += 10; total += 10 }
    if (data.skills?.length > 0) { score += 5; total += 5 }
    
    return total > 0 ? Math.round((score / total) * 100) : 0
  }

  const generateSuggestions = (data: any): string[] => {
    const suggestions = []
    
    if (!data.fullName) {
      suggestions.push('Add your full name to make your CV more personal')
    }
    
    if (!data.contact?.email) {
      suggestions.push('Include your email address for contact information')
    }
    
    if (!data.title) {
      suggestions.push('Add a professional title to highlight your role')
    }
    
    if (!data.summary) {
      suggestions.push('Include a professional summary to showcase your expertise')
    }
    
    if (!data.experience || data.experience.length === 0) {
      suggestions.push('Add your work experience to demonstrate your background')
    }
    
    if (!data.skills || data.skills.length === 0) {
      suggestions.push('List your key skills to show your capabilities')
    }
    
    return suggestions
  }

  const findMissingFields = (data: any): string[] => {
    const missing = []
    
    if (!data.fullName) missing.push('Full Name')
    if (!data.contact?.email) missing.push('Email')
    if (!data.contact?.phone) missing.push('Phone')
    if (!data.contact?.location) missing.push('Location')
    if (!data.title) missing.push('Professional Title')
    if (!data.summary) missing.push('Professional Summary')
    if (!data.experience || data.experience.length === 0) missing.push('Work Experience')
    if (!data.education || data.education.length === 0) missing.push('Education')
    if (!data.skills || data.skills.length === 0) missing.push('Skills')
    
    return missing
  }

  const handleFileDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      await handleFileUpload(file)
    } else {
      toast.error('Please drop a PDF file')
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100'
    if (confidence >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
          <FaFilePdf className="text-blue-600 text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">PDF Analysis</h3>
          <p className="text-sm text-gray-500">Upload your existing CV for analysis</p>
        </div>
      </div>

      {!analysisResult ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('pdf-upload')?.click()}
        >
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
            className="hidden"
          />
          
          {isAnalyzing ? (
            <div className="flex flex-col items-center space-y-4">
              <FaSpinner className="text-blue-500 text-4xl animate-spin" />
              <div>
                <p className="text-blue-700 font-medium text-lg">Analyzing your CV...</p>
                <p className="text-blue-500 text-sm">Extracting and analyzing information</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <FaFilePdf className="text-gray-400 text-4xl" />
              <div>
                <p className="text-gray-700 font-medium text-lg">Upload your CV (PDF)</p>
                <p className="text-gray-500 text-sm mt-2">
                  Drag and drop your PDF here, or click to browse
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  We'll analyze your CV and suggest improvements
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Analysis Results</h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceBgColor(analysisResult.confidence)} ${getConfidenceColor(analysisResult.confidence)}`}>
                {analysisResult.confidence}% Complete
              </div>
            </div>
            
            {uploadedFile && (
              <p className="text-sm text-gray-600 mb-3">
                Analyzed: {uploadedFile.name}
              </p>
            )}
            
            {analysisResult.missingFields.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Missing Information:</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingFields.map((field, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {analysisResult.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Suggestions for Improvement</h4>
              <ul className="space-y-2">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <FaEdit className="text-blue-500 text-sm mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Data Preview */}
          {analysisResult.extractedData && Object.keys(analysisResult.extractedData).length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Extracted Information</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {analysisResult.extractedData.fullName && (
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-900">{analysisResult.extractedData.fullName}</span>
                    </div>
                  )}
                  {analysisResult.extractedData.contact?.email && (
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">{analysisResult.extractedData.contact.email}</span>
                    </div>
                  )}
                  {analysisResult.extractedData.title && (
                    <div>
                      <span className="font-medium text-gray-700">Title:</span>
                      <span className="ml-2 text-gray-900">{analysisResult.extractedData.title}</span>
                    </div>
                  )}
                  {analysisResult.extractedData.skills && Array.isArray(analysisResult.extractedData.skills) && analysisResult.extractedData.skills.length > 0 && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Skills:</span>
                      <span className="ml-2 text-gray-900">{analysisResult.extractedData.skills.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setAnalysisResult(null)
                setUploadedFile(null)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Analyze Another PDF
            </button>
            <button
              onClick={() => onAnalysisComplete(analysisResult.extractedData)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Use This Data
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PDFAnalysis 