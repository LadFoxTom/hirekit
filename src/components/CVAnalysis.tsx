'use client'

import React, { useState } from 'react'
import { 
  FaCheck, 
  FaExclamationTriangle, 
  FaStar, 
  FaChartLine, 
  FaBullseye,
  FaLightbulb,
  FaArrowRight,
  FaSpinner,
  FaEye,
  FaEdit,
  FaDownload
} from 'react-icons/fa'

interface CVAnalysisProps {
  cvData: any
  onAnalysisComplete?: (analysis: any) => void
  className?: string
}

interface AnalysisResult {
  analysis: {
    overallScore: number
    strengths: string[]
    areasForImprovement: string[]
    sectorSpecificAdvice: string[]
    recommendations: string[]
    aiAnalysis: string
    structuredAdvice: string
  }
  sectorGuidance?: {
    name: string
    keyElements: string[]
    keywords: string[]
    formatTips: string[]
    commonMistakes: string[]
  }
  recommendations: {
    immediate: string[]
    detailed: string[]
    sectorSpecific: string[]
  }
  score: {
    overall: number
    breakdown: {
      structure: number
      achievements: number
      keywords: number
      strengths: number
    }
  }
}

export default function CVAnalysis({ cvData, onAnalysisComplete, className = '' }: CVAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [targetSector, setTargetSector] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const sectors = [
    { id: 'sales-marketing', name: 'Sales & Marketing' },
    { id: 'it-technology', name: 'IT & Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'research-academia', name: 'Research & Academia' },
    { id: 'administration', name: 'Administration' },
    { id: 'creative-design', name: 'Creative & Design' },
    { id: 'construction-engineering', name: 'Construction & Engineering' },
    { id: 'hospitality-tourism', name: 'Hospitality & Tourism' },
    { id: 'nonprofit-third-sector', name: 'Non-Profit & Third Sector' }
  ]

  const convertCVDataToText = (data: any): string => {
    let cvText = ''

    // Personal Information
    if (data.fullName) cvText += `Name: ${data.fullName}\n`
    if (data.title) cvText += `Title: ${data.title}\n`
    if (data.contact) {
      if (data.contact.email) cvText += `Email: ${data.contact.email}\n`
      if (data.contact.phone) cvText += `Phone: ${data.contact.phone}\n`
      if (data.contact.location) cvText += `Location: ${data.contact.location}\n`
    }
    cvText += '\n'

    // Professional Summary
    if (data.summary) {
      cvText += `Professional Summary:\n${data.summary}\n\n`
    }

    // Work Experience
    if (data.experience && data.experience.length > 0) {
      cvText += 'Work Experience:\n'
      data.experience.forEach((exp: any, index: number) => {
        cvText += `${exp.title}:\n`
        if (exp.content && Array.isArray(exp.content)) {
          exp.content.forEach((item: string) => {
            cvText += `• ${item}\n`
          })
        }
        cvText += '\n'
      })
    }

    // Education
    if (data.education && data.education.length > 0) {
      cvText += 'Education:\n'
      data.education.forEach((edu: any, index: number) => {
        cvText += `${edu.title}:\n`
        if (edu.content && Array.isArray(edu.content)) {
          edu.content.forEach((item: string) => {
            cvText += `• ${item}\n`
          })
        }
        cvText += '\n'
      })
    }

    // Skills
    if (data.skills) {
      const skillsArray = Array.isArray(data.skills) 
        ? data.skills 
        : [
            ...(data.skills.technical || []),
            ...(data.skills.soft || []),
            ...(data.skills.tools || []),
            ...(data.skills.industry || [])
          ];
      if (skillsArray.length > 0) {
        cvText += 'Skills:\n'
        skillsArray.forEach((skill: string) => {
          cvText += `• ${skill}\n`
        })
        cvText += '\n'
      }
    }

    return cvText
  }

  const analyzeCV = async () => {
    if (!cvData) return

    setIsAnalyzing(true)
    try {
      const cvContent = convertCVDataToText(cvData)
      
      const response = await fetch('/api/cv-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvContent,
          targetSector: targetSector || undefined,
          jobDescription: jobDescription || undefined,
          analysisType: 'comprehensive'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze CV')
      }

      const result = await response.json()
      setAnalysisResult(result)
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result)
      }
    } catch (error) {
      console.error('CV Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
            <FaEye className="text-blue-600 text-lg" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">CV Analysis</h2>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <FaEdit className="mr-2 text-sm" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Sector (Optional)
              </label>
              <select
                value={targetSector}
                onChange={(e) => setTargetSector(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select a sector</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description (Optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description for targeted analysis..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Analysis Button */}
      <button
        onClick={analyzeCV}
        disabled={isAnalyzing || !cvData}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
      >
        {isAnalyzing ? (
          <>
            <FaSpinner className="animate-spin mr-3 text-lg" />
            Analyzing CV...
          </>
        ) : (
          <>
            <FaChartLine className="mr-3 text-lg" />
            Analyze My CV
          </>
        )}
      </button>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="mt-8 space-y-6">
          {/* Overall Score */}
          <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(analysisResult.score.overall)} mb-4 shadow-lg`}>
              <span className={`text-3xl font-bold ${getScoreColor(analysisResult.score.overall)}`}>
                {analysisResult.score.overall}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Overall CV Score
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {analysisResult.score.overall >= 80 ? 'Excellent! Your CV is well-crafted and competitive.' :
               analysisResult.score.overall >= 60 ? 'Good potential, but some improvements needed.' :
               'Significant improvements needed to make your CV competitive.'}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-1">{analysisResult.score.breakdown.structure}</div>
              <div className="text-sm text-gray-600">Structure</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-1">{analysisResult.score.breakdown.achievements}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-purple-600 mb-1">{analysisResult.score.breakdown.keywords}</div>
              <div className="text-sm text-gray-600">Keywords</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-orange-600 mb-1">{analysisResult.score.breakdown.strengths}</div>
              <div className="text-sm text-gray-600">Strengths</div>
            </div>
          </div>

          {/* Strengths */}
          {analysisResult.analysis.strengths.length > 0 && (
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-4 flex items-center text-lg">
                <FaCheck className="mr-3 text-green-600" />
                Key Strengths
              </h4>
              <ul className="space-y-3">
                {analysisResult.analysis.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-green-700 flex items-start">
                    <FaStar className="w-4 h-4 mr-3 mt-0.5 text-green-600 flex-shrink-0" />
                    <span className="leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {analysisResult.analysis.areasForImprovement.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-4 flex items-center text-lg">
                <FaExclamationTriangle className="mr-3 text-yellow-600" />
                Areas for Improvement
              </h4>
              <ul className="space-y-3">
                {analysisResult.analysis.areasForImprovement.map((area: string, index: number) => (
                  <li key={index} className="text-yellow-700 flex items-start">
                    <FaLightbulb className="w-4 h-4 mr-3 mt-0.5 text-yellow-600 flex-shrink-0" />
                    <span className="leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Immediate Recommendations */}
          {analysisResult.recommendations.immediate.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-4 flex items-center text-lg">
                <FaBullseye className="mr-3 text-blue-600" />
                Immediate Actions
              </h4>
              <ul className="space-y-3">
                {analysisResult.recommendations.immediate.map((rec: string, index: number) => (
                  <li key={index} className="text-blue-700 flex items-start">
                    <FaArrowRight className="w-4 h-4 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sector-Specific Advice */}
          {analysisResult.sectorGuidance && (
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-4 text-lg">
                {analysisResult.sectorGuidance.name} Sector Guidance
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-purple-700 mb-3">Key Elements to Highlight:</h5>
                  <ul className="space-y-2">
                    {analysisResult.sectorGuidance.keyElements.slice(0, 3).map((element: string, index: number) => (
                      <li key={index} className="text-purple-600 text-sm flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-700 mb-3">Important Keywords:</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.sectorGuidance.keywords.slice(0, 6).map((keyword: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full border border-purple-200">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {analysisResult.analysis.aiAnalysis && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg">Detailed AI Analysis</h4>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200">
                {analysisResult.analysis.aiAnalysis}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.open('/cv-guide', '_blank')}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center border border-gray-200"
            >
              <FaEye className="mr-2" />
              View CV Guide
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-100 text-blue-700 font-semibold py-3 px-6 rounded-xl hover:bg-blue-200 transition-all duration-200 flex items-center justify-center border border-blue-200"
            >
              <FaDownload className="mr-2" />
              Print Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 