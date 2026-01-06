'use client'

import React, { useState } from 'react'
import { FaChartBar, FaLightbulb, FaCheck, FaExclamationTriangle, FaSpinner, FaPlay, FaTimes, FaInfoCircle } from 'react-icons/fa'
import { LetterData } from '@/types/letter'
import toast from 'react-hot-toast'

interface LetterAnalysisProps {
  letterData: LetterData
  onAnalysisComplete?: (analysis: any) => void
}

interface AnalysisResult {
  overallScore: number
  contentQuality: { score: number; maxScore: number; issues: string[]; strengths: string[] }
  structureFlow: { score: number; maxScore: number; issues: string[]; strengths: string[] }
  languageTone: { score: number; maxScore: number; issues: string[]; strengths: string[] }
  jobAlignment: { score: number; maxScore: number; issues: string[]; strengths: string[] }
  technicalQuality: { score: number; maxScore: number; issues: string[]; strengths: string[] }
  detailedFeedback: {
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
  }
  metrics: {
    wordCount: number
    charCount: number
    readabilityScore: number
    keywordMatch: number
  }
}

const LetterAnalysis: React.FC<LetterAnalysisProps> = ({
  letterData,
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  const analyzeLetter = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/letter-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letterContent: letterData.body ? letterData.body.join('\n') : '',
          jobDescription: letterData.jobDescription || '',
          companyName: letterData.companyName || '',
          position: letterData.jobTitle || ''
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze letter')
      }

      const result = await response.json()
      setAnalysis(result)
      onAnalysisComplete?.(result)
      toast.success('Letter analysis completed!')
    } catch (error) {
      console.error('Analysis failed:', error)
      toast.error('Failed to analyze letter. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    if (score >= 40) return 'bg-orange-100'
    return 'bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 50) return 'Poor'
    if (score >= 40) return 'Very Poor'
    return 'Inadequate'
  }

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Ready for submission'
    if (score >= 80) return 'Minor improvements needed'
    if (score >= 70) return 'Several improvements needed'
    if (score >= 60) return 'Significant improvements needed'
    if (score >= 50) return 'Major revision required'
    if (score >= 40) return 'Complete rewrite needed'
    return 'Substantial work required'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <FaCheck className="text-green-500" />
    if (score >= 60) return <FaExclamationTriangle className="text-yellow-500" />
    if (score >= 40) return <FaExclamationTriangle className="text-orange-500" />
    return <FaTimes className="text-red-500" />
  }

  const renderScoreBar = (score: number, maxScore: number, label: string) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-semibold text-gray-900">{label}</h5>
        <span className="text-sm font-medium text-gray-700">
          {score}/{maxScore}
        </span>
      </div>
      <div className="flex items-center">
        <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              score >= maxScore * 0.8 ? 'bg-green-500' :
              score >= maxScore * 0.6 ? 'bg-yellow-500' :
              score >= maxScore * 0.4 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${(score / maxScore) * 100}%` }}
          ></div>
        </div>
        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
          {Math.round((score / maxScore) * 100)}%
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
          <FaChartBar className="mr-2" />
          Letter Analysis
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Letter Evaluation</h3>
        <p className="text-gray-600 text-sm">
          Get honest, realistic feedback to improve your motivational letter based on professional standards.
        </p>
      </div>

      {/* Analysis Button */}
      {!analysis && (
        <div className="text-center">
          <button
            onClick={analyzeLetter}
            disabled={isAnalyzing}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
                              <>
                  <FaPlay className="mr-2" />
                  Analyze Letter
                </>
            )}
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h4>
            <div className="flex items-center justify-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreBgColor(analysis.overallScore)}`}>
                <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </span>
              </div>
              <div className="ml-6">
                <div className="text-2xl font-bold text-gray-900">/ 100</div>
                <div className="text-gray-600 font-medium">
                  {getScoreLabel(analysis.overallScore)}
                </div>
                <div className="text-sm text-gray-500">
                  {getScoreDescription(analysis.overallScore)}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderScoreBar(analysis.contentQuality.score, analysis.contentQuality.maxScore, 'Content Quality')}
            {renderScoreBar(analysis.structureFlow.score, analysis.structureFlow.maxScore, 'Structure & Flow')}
            {renderScoreBar(analysis.languageTone.score, analysis.languageTone.maxScore, 'Language & Tone')}
            {renderScoreBar(analysis.jobAlignment.score, analysis.jobAlignment.maxScore, 'Job Alignment')}
            {renderScoreBar(analysis.technicalQuality.score, analysis.technicalQuality.maxScore, 'Technical Quality')}
          </div>

          {/* Metrics */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Letter Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">{analysis.metrics.wordCount}</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">{analysis.metrics.charCount}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-purple-600">{analysis.metrics.readabilityScore}</div>
                <div className="text-sm text-gray-600">Readability</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-orange-600">{analysis.metrics.keywordMatch}%</div>
                <div className="text-sm text-gray-600">Keyword Match</div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {analysis.detailedFeedback.strengths.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaCheck className="text-green-600 mr-2" />
                Strengths ({analysis.detailedFeedback.strengths.length})
              </h4>
              <ul className="space-y-2">
                {analysis.detailedFeedback.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {analysis.detailedFeedback.weaknesses.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaExclamationTriangle className="text-red-600 mr-2" />
                Areas for Improvement ({analysis.detailedFeedback.weaknesses.length})
              </h4>
              <ul className="space-y-2">
                {analysis.detailedFeedback.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <FaExclamationTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {analysis.detailedFeedback.suggestions.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaLightbulb className="text-blue-600 mr-2" />
                Actionable Suggestions ({analysis.detailedFeedback.suggestions.length})
              </h4>
              <ul className="space-y-3">
                {analysis.detailedFeedback.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Score Interpretation */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">Score Interpretation</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>90-100:</strong> Exceptional - Ready for submission</div>
                  <div><strong>80-89:</strong> Very Good - Minor improvements needed</div>
                  <div><strong>70-79:</strong> Good - Several improvements needed</div>
                  <div><strong>60-69:</strong> Fair - Significant improvements needed</div>
                  <div><strong>50-59:</strong> Poor - Major revision required</div>
                  <div><strong>Below 50:</strong> Very Poor - Complete rewrite needed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Re-analyze Button */}
          <div className="text-center">
            <button
              onClick={analyzeLetter}
              disabled={isAnalyzing}
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Re-analyzing...
                </>
              ) : (
                <>
                  <FaChartBar className="mr-2" />
                  Re-analyze
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LetterAnalysis 