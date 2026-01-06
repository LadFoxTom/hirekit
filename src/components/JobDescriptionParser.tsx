'use client'

import React from 'react'
import { FaSearch, FaLightbulb, FaCheck, FaSpinner, FaUpload, FaPaste } from 'react-icons/fa'

interface JobDescriptionParserProps {
  onKeywordsExtracted: (keywords: string[]) => void
  onSkillsMatched: (matched: string[], missing: string[]) => void
  jobDescription: string
  onJobDescriptionChange: (description: string) => void
  onAnalyze: () => void
  onFileUpload: (text: string) => void
  onPaste: () => void
  isAnalyzing: boolean
  parsedJob: any
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
}

interface ParsedJob {
  title: string
  company: string
  keywords: string[]
  requiredSkills: string[]
  preferredSkills: string[]
  responsibilities: string[]
  requirements: string[]
}

export default function JobDescriptionParser({ 
  onKeywordsExtracted, 
  onSkillsMatched,
  jobDescription,
  onJobDescriptionChange,
  onAnalyze,
  onFileUpload,
  onPaste,
  isAnalyzing,
  parsedJob,
  matchScore,
  matchedSkills,
  missingSkills
}: JobDescriptionParserProps) {


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        onFileUpload(text)
      }
      reader.readAsText(file)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      onPaste()
    } catch (error) {
      console.error('Failed to read clipboard:', error)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getMatchScoreIcon = (score: number) => {
    if (score >= 85) return <FaCheck className="text-green-500" />
    if (score >= 70) return <FaLightbulb className="text-yellow-500" />
    if (score >= 50) return <FaLightbulb className="text-orange-500" />
    return <FaLightbulb className="text-red-500" />
  }

  const getMatchScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent Match'
    if (score >= 70) return 'Good Match'
    if (score >= 50) return 'Fair Match'
    if (score >= 30) return 'Poor Match'
    return 'Very Poor Match'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FaSearch className="text-blue-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900">Job Description Parser</h3>
      </div>

      <div className="space-y-4">
        {/* Input Methods */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePaste}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaPaste />
            <span>Paste from Clipboard</span>
          </button>
          <label className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <FaUpload />
            <span>Upload File</span>
            <input
              type="file"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Text Area */}
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste or upload a job description to analyze..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Analyze Button */}
        <button
          onClick={onAnalyze}
          disabled={!jobDescription.trim() || isAnalyzing}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaSearch />
          )}
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Job Description'}</span>
        </button>
      </div>

      {/* Results */}
      {parsedJob && (
        <div className="mt-6 space-y-6">
          {/* Match Score */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getMatchScoreIcon(matchScore)}
              <span className={`text-2xl font-bold ${getMatchScoreColor(matchScore)}`}>
                {matchScore}% Match
              </span>
            </div>
            <div className="mb-2">
              <span className={`text-sm font-medium ${getMatchScoreColor(matchScore)}`}>
                {getMatchScoreLabel(matchScore)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {matchScore >= 85 ? 'Excellent match! This appears to be a high-quality job description that aligns well with professional standards.' :
               matchScore >= 70 ? 'Good match. This job description has most professional elements but could be improved.' :
               matchScore >= 50 ? 'Fair match. This job description has some professional elements but lacks structure or detail.' :
               matchScore >= 30 ? 'Poor match. This job description appears to be low-quality or incomplete.' :
               'Very poor match. This content does not appear to be a legitimate job description.'}
            </p>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Job Details</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Position:</span>
                  <p className="text-sm text-gray-900">{parsedJob.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Company:</span>
                  <p className="text-sm text-gray-900">{parsedJob.company}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {parsedJob.keywords.slice(0, 10).map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
              <div className="space-y-1">
                {parsedJob.requiredSkills.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FaCheck className="text-green-500 text-xs" />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Preferred Skills</h4>
              <div className="space-y-1">
                {parsedJob.preferredSkills.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <FaLightbulb className="text-yellow-500 text-xs" />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          {parsedJob.responsibilities.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Responsibilities</h4>
              <ul className="space-y-1">
                {parsedJob.responsibilities.slice(0, 5).map((resp: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Use this tool to analyze job descriptions and identify key requirements. 
          The parser will help you tailor your CV to specific positions and improve your match score.
        </p>
      </div>
    </div>
  )
} 