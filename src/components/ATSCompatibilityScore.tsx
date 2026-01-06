'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { CVData } from '@/types/cv'

interface ATSCompatibilityScoreProps {
  cvData: CVData
}

interface ATSAnalysis {
  score: number
  issues: string[]
  suggestions: string[]
  strengths: string[]
  keywordMatch: number
  formattingScore: number
  contentScore: number
}

const COMMON_KEYWORDS = {
  'software engineer': ['javascript', 'python', 'react', 'node.js', 'git', 'agile', 'api', 'database', 'testing'],
  'data scientist': ['python', 'r', 'sql', 'machine learning', 'statistics', 'pandas', 'numpy', 'scikit-learn'],
  'product manager': ['agile', 'scrum', 'product strategy', 'user research', 'analytics', 'roadmap', 'stakeholder'],
  'marketing': ['digital marketing', 'seo', 'social media', 'content marketing', 'analytics', 'campaigns'],
  'sales': ['crm', 'lead generation', 'negotiation', 'client relationship', 'sales pipeline', 'quota'],
  'design': ['ui/ux', 'figma', 'adobe creative suite', 'user research', 'prototyping', 'design systems']
}

const SAMPLE_INDICATORS = [
  'sample', 'example', 'demo', 'placeholder', 'test', 'dummy',
  'Sample Name', 'Sample Job Title', 'sample@email.com', 'Sample City',
  'This is a sample summary', 'Sample achievement', 'Sample Skill'
]

const FORMATTING_ISSUES = [
  'Complex formatting or graphics',
  'Unusual fonts',
  'Tables or columns',
  'Headers and footers',
  'Images or logos',
  'Color backgrounds'
]

export default function ATSCompatibilityScore({ cvData }: ATSCompatibilityScoreProps) {
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const isSampleContent = useCallback((text: string): boolean => {
    if (!text) return false
    const lowerText = text.toLowerCase()
    return SAMPLE_INDICATORS.some(indicator => 
      lowerText.includes(indicator.toLowerCase())
    )
  }, [])

  const hasRealContent = useCallback((text: string): boolean => {
    if (!text) return false
    // Check if text has meaningful length and isn't just sample data
    return text.length > 20 && !isSampleContent(text)
  }, [isSampleContent])

  const performATSAnalysis = useCallback((data: CVData): ATSAnalysis => {
    const issues: string[] = []
    const suggestions: string[] = []
    const strengths: string[] = []
    
    let keywordMatch = 0
    let formattingScore = 100
    let contentScore = 0
    let sampleContentDetected = false

    // Check for sample content
    if (isSampleContent(data.fullName || '')) {
      issues.push('Contains sample/demo data')
      suggestions.push('Replace sample data with your actual information')
      sampleContentDetected = true
      contentScore -= 20
    }

    // Check for common ATS issues
    if (!data.fullName) {
      issues.push('Missing full name')
      suggestions.push('Add your full name at the top of your CV')
    } else if (hasRealContent(data.fullName)) {
      strengths.push('Full name is present')
      contentScore += 10
    } else {
      issues.push('Full name appears to be sample data')
      suggestions.push('Replace with your actual name')
      contentScore -= 5
    }

    if (!data.contact?.email) {
      issues.push('Missing email address')
      suggestions.push('Include a professional email address')
    } else if (hasRealContent(data.contact.email)) {
      strengths.push('Email address is included')
      contentScore += 10
    } else {
      issues.push('Email appears to be sample data')
      suggestions.push('Replace with your actual email')
      contentScore -= 5
    }

    if (!data.contact?.phone) {
      issues.push('Missing phone number')
      suggestions.push('Add your phone number for contact')
    } else if (hasRealContent(data.contact.phone)) {
      strengths.push('Phone number is included')
      contentScore += 10
    } else {
      issues.push('Phone number appears to be sample data')
      suggestions.push('Replace with your actual phone number')
      contentScore -= 5
    }

    // Check for summary
    if (!data.summary || data.summary.length === 0) {
      issues.push('Missing professional summary')
      suggestions.push('Add a compelling professional summary')
    } else if (isSampleContent(data.summary)) {
      issues.push('Summary contains sample data')
      suggestions.push('Write a personalized professional summary')
      contentScore -= 10
    } else if (hasRealContent(data.summary)) {
      strengths.push('Professional summary is present')
      contentScore += 15
    } else {
      issues.push('Summary is too short or generic')
      suggestions.push('Add a detailed, personalized summary')
      contentScore += 5
    }

    // Check for experience
    if (!data.experience || data.experience.length === 0) {
      issues.push('Missing work experience')
      suggestions.push('Add your work experience with detailed descriptions')
    } else {
      const hasRealExperience = data.experience.some(exp => 
        hasRealContent(exp.title) && hasRealContent(exp.company || '')
      )
      
      if (hasRealExperience) {
        strengths.push('Work experience is included')
        contentScore += 20
        
        // Check for bullet points
        const hasBulletPoints = data.experience.some(exp =>
          exp.content?.some(item => item.includes('•') || item.includes('-')) || false
        )
        if (hasBulletPoints) {
          strengths.push('Experience uses bullet points effectively')
          contentScore += 10
        } else {
          suggestions.push('Use bullet points to describe your achievements')
        }
      } else {
        issues.push('Work experience contains sample data')
        suggestions.push('Replace with your actual work experience')
        contentScore -= 10
      }
    }

    // Check for skills
    const allSkills = Array.isArray(data.skills) 
      ? data.skills 
      : [
          ...(data.skills?.technical || []),
          ...(data.skills?.soft || []),
          ...(data.skills?.tools || []),
          ...(data.skills?.industry || [])
        ];
    
    if (!allSkills || allSkills.length === 0) {
      issues.push('Missing skills section')
      suggestions.push('Add a skills section with relevant keywords')
    } else {
      const hasRealSkills = allSkills.some(skill => hasRealContent(skill))
      
      if (hasRealSkills) {
        strengths.push('Skills section is present')
        contentScore += 15
        
        // Check keyword matching
        const jobTitle = data.title?.toLowerCase() || 'software engineer'
        const relevantKeywords = COMMON_KEYWORDS[jobTitle as keyof typeof COMMON_KEYWORDS] || COMMON_KEYWORDS['software engineer']
        
        const matchedKeywords = allSkills.filter((skill: string) => 
          relevantKeywords.some(keyword => 
            skill.toLowerCase().includes(keyword.toLowerCase())
          )
        )
        
        keywordMatch = (matchedKeywords.length / relevantKeywords.length) * 100
        if (keywordMatch > 50) {
          strengths.push('Good keyword matching for your role')
          contentScore += 10
        } else {
          suggestions.push('Add more relevant keywords for your target role')
        }
      } else {
        issues.push('Skills section contains sample data')
        suggestions.push('Replace with your actual skills')
        contentScore -= 10
      }
    }

    // Check for education
    if (!data.education || data.education.length === 0) {
      issues.push('Missing education section')
      suggestions.push('Include your educational background')
    } else {
      const hasRealEducation = data.education.some(edu => 
        hasRealContent(edu.degree || '') && hasRealContent(edu.institution || '')
      )
      
      if (hasRealEducation) {
        strengths.push('Education section is present')
        contentScore += 10
      } else {
        issues.push('Education section contains sample data')
        suggestions.push('Replace with your actual education')
        contentScore -= 5
      }
    }

    // Formatting checks
    if (data.photoUrl) {
      formattingScore -= 10
      issues.push('Profile photo may cause ATS issues')
      suggestions.push('Consider removing photo for better ATS compatibility')
    }

    // Penalize heavily for sample content
    if (sampleContentDetected) {
      contentScore = Math.max(0, contentScore - 30)
      formattingScore = Math.max(60, formattingScore - 20)
    }

    // Calculate overall score with more realistic weighting
    const overallScore = Math.round((contentScore * 0.7) + (formattingScore * 0.3))

    return {
      score: Math.max(0, Math.min(100, overallScore)),
      issues,
      suggestions,
      strengths,
      keywordMatch,
      formattingScore,
      contentScore
    }
  }, [isSampleContent, hasRealContent])

  const analyzeATSCompatibility = useCallback(() => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    setTimeout(() => {
      const result = performATSAnalysis(cvData)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 1000)
  }, [cvData, performATSAnalysis])

  useEffect(() => {
    if (cvData) {
      analyzeATSCompatibility()
    }
  }, [cvData, analyzeATSCompatibility])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <FaCheckCircle className="text-green-500" />
    if (score >= 60) return <FaExclamationTriangle className="text-yellow-500" />
    return <FaExclamationTriangle className="text-red-500" />
  }

  const renderStars = (score: number) => {
    const stars = []
    const fullStars = Math.floor(score / 20)
    const hasHalfStar = score % 20 >= 10
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />)
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />)
    }
    
    return stars
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FaInfoCircle className="text-blue-500 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">ATS Compatibility Analysis</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Analyzing your CV...</span>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FaInfoCircle className="text-blue-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900">ATS Compatibility Score</h3>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {getScoreIcon(analysis.score)}
          <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}/100
          </span>
        </div>
        <div className="flex items-center justify-center space-x-1 mb-2">
          {renderStars(analysis.score)}
        </div>
        <p className="text-sm text-gray-600">
          {analysis.score >= 80 ? 'Excellent ATS compatibility' :
           analysis.score >= 60 ? 'Good ATS compatibility' :
           'Needs improvement for ATS systems'}
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-blue-600">{analysis.contentScore}</div>
          <div className="text-sm text-gray-600">Content Score</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-green-600">{analysis.formattingScore}</div>
          <div className="text-sm text-gray-600">Formatting Score</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-purple-600">{Math.round(analysis.keywordMatch)}%</div>
          <div className="text-sm text-gray-600">Keyword Match</div>
        </div>
      </div>

      {/* Issues and Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysis.issues.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              Issues Found ({analysis.issues.length})
            </h4>
            <ul className="space-y-2">
              {analysis.issues.map((issue, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.suggestions.length > 0 && (
          <div>
            <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
              <FaInfoCircle className="mr-2" />
              Suggestions ({analysis.suggestions.length})
            </h4>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-green-600 mb-3 flex items-center">
            <FaCheckCircle className="mr-2" />
            Strengths ({analysis.strengths.length})
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> ATS (Applicant Tracking System) compatibility ensures your CV can be properly parsed by automated systems. 
          Focus on clear formatting, relevant keywords, and complete information. Replace any sample data with your actual information.
        </p>
      </div>
    </div>
  )
} 