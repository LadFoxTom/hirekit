'use client'

import React, { useState } from 'react'
import { FaLightbulb, FaMagic, FaCheck, FaTimes, FaArrowRight, FaBullseye, FaChartLine } from 'react-icons/fa'
import { CVData } from '@/types/cv'

interface EnhancedAISuggestionsProps {
  cvData: CVData
  currentSection: string
  onSuggestionApply: (section: string, content: string[]) => void
}

interface Suggestion {
  id: string
  type: 'achievement' | 'keyword' | 'format' | 'content' | 'ats'
  title: string
  description: string
  currentContent?: string
  suggestedContent: string
  impact: 'high' | 'medium' | 'low'
  category: string
}

const EnhancedAISuggestions: React.FC<EnhancedAISuggestionsProps> = ({
  cvData,
  currentSection,
  onSuggestionApply
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null)
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set())

  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = []

    // Professional Summary Suggestions
    if (currentSection === 'summary' && cvData.summary) {
      if (cvData.summary.length < 100) {
        suggestions.push({
          id: 'summary_length',
          type: 'content',
          title: 'Expand Professional Summary',
          description: 'Your summary is quite brief. Consider adding more details about your expertise and career goals.',
          currentContent: cvData.summary,
          suggestedContent: `${cvData.summary} With ${cvData.experience?.length || 0}+ years of experience in ${cvData.industrySector || 'the industry'}, I am passionate about delivering exceptional results and driving innovation.`,
          impact: 'high',
          category: 'Content Enhancement'
        })
      }

      if (!cvData.summary.includes('results') && !cvData.summary.includes('achieved')) {
        suggestions.push({
          id: 'summary_achievements',
          type: 'achievement',
          title: 'Add Achievement Focus',
          description: 'Include specific achievements or results to make your summary more compelling.',
          currentContent: cvData.summary,
          suggestedContent: `${cvData.summary} I have consistently delivered measurable results and achieved significant milestones throughout my career.`,
          impact: 'high',
          category: 'Achievement Optimization'
        })
      }
    }

    // Experience Suggestions
    if (currentSection === 'experience' && cvData.experience) {
      cvData.experience.forEach((exp, index) => {
        if (exp.achievements) {
          exp.achievements.forEach((achievement, achievementIndex) => {
            // Check for weak action verbs
            const weakVerbs = ['did', 'was', 'were', 'had', 'worked on', 'helped with']
            const hasWeakVerb = weakVerbs.some(verb => 
              achievement.toLowerCase().includes(verb)
            )

            if (hasWeakVerb) {
              suggestions.push({
                id: `exp_${index}_achievement_${achievementIndex}`,
                type: 'achievement',
                title: 'Strengthen Achievement Statement',
                description: 'Replace weak verbs with strong action verbs to make your achievements more impactful.',
                currentContent: achievement,
                suggestedContent: achievement.replace(
                  /(did|was|were|had|worked on|helped with)/gi,
                  (match) => {
                    const replacements: { [key: string]: string } = {
                      'did': 'accomplished',
                      'was': 'delivered',
                      'were': 'achieved',
                      'had': 'managed',
                      'worked on': 'developed',
                      'helped with': 'contributed to'
                    }
                    return replacements[match.toLowerCase()] || match
                  }
                ),
                impact: 'medium',
                category: 'Achievement Optimization'
              })
            }

            // Check for missing numbers
            if (!/\d+%|\d+ people|\d+ team|\d+ clients|\d+ projects/.test(achievement)) {
              suggestions.push({
                id: `exp_${index}_numbers_${achievementIndex}`,
                type: 'achievement',
                title: 'Add Quantifiable Results',
                description: 'Include specific numbers to make your achievements more measurable and impressive.',
                currentContent: achievement,
                suggestedContent: `${achievement} (Consider adding specific metrics like "resulting in 25% improvement" or "managing team of 10 people")`,
                impact: 'high',
                category: 'Achievement Optimization'
              })
            }
          })
        }
      })
    }

    // Skills Suggestions
    if (currentSection === 'skills' && cvData.skills) {
      const allSkills = Array.isArray(cvData.skills) 
        ? cvData.skills 
        : [
            ...(cvData.skills.technical || []),
            ...(cvData.skills.soft || []),
            ...(cvData.skills.tools || []),
            ...(cvData.skills.industry || [])
          ]

      // Check for industry-specific keywords
      const industryKeywords: { [key: string]: string[] } = {
        'technology': ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker'],
        'marketing': ['SEO', 'Google Analytics', 'Social Media', 'Content Marketing', 'CRM'],
        'finance': ['Excel', 'Financial Modeling', 'Risk Management', 'Compliance', 'SAP'],
        'healthcare': ['HIPAA', 'Electronic Health Records', 'Patient Care', 'Medical Terminology']
      }

      if (cvData.industrySector && industryKeywords[cvData.industrySector.toLowerCase()]) {
        const missingKeywords = industryKeywords[cvData.industrySector.toLowerCase()].filter(
          keyword => !allSkills.some(skill => 
            skill.toLowerCase().includes(keyword.toLowerCase())
          )
        )

        if (missingKeywords.length > 0) {
          suggestions.push({
            id: 'industry_keywords',
            type: 'keyword',
            title: 'Add Industry-Specific Keywords',
            description: `Consider adding these ${cvData.industrySector} industry keywords to improve ATS compatibility.`,
            currentContent: allSkills.join(', '),
            suggestedContent: `${allSkills.join(', ')}, ${missingKeywords.slice(0, 3).join(', ')}`,
            impact: 'high',
            category: 'ATS Optimization'
          })
        }
      }
    }

    // ATS Optimization Suggestions
    suggestions.push({
      id: 'ats_format',
      type: 'ats',
      title: 'ATS-Friendly Formatting',
      description: 'Ensure your CV uses standard fonts and formatting for optimal ATS compatibility.',
      currentContent: '',
      suggestedContent: 'Use standard fonts (Arial, Calibri, Times New Roman), avoid tables and graphics, and use clear section headings.',
      impact: 'high',
      category: 'ATS Optimization'
    })

    return suggestions
  }

  const suggestions = generateSuggestions()

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (suggestion.type === 'achievement' && suggestion.currentContent) {
      // For achievement suggestions, replace the specific content
      const newContent = suggestion.suggestedContent
      onSuggestionApply(currentSection, [newContent])
    } else if (suggestion.type === 'keyword') {
      // For keyword suggestions, add to existing content
      const newContent = suggestion.suggestedContent
      onSuggestionApply(currentSection, [newContent])
    }

    setAppliedSuggestions(prev => new Set(Array.from(prev).concat(suggestion.id)))
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Achievement Optimization': return <FaBullseye />
      case 'ATS Optimization': return <FaChartLine />
      case 'Content Enhancement': return <FaMagic />
      default: return <FaLightbulb />
    }
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <FaCheck className="text-green-600" />
          <span className="text-green-800 font-medium">Great job!</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          This section looks strong. Keep up the excellent work!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <FaLightbulb className="text-yellow-500 text-lg" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Suggestions</h3>
        <span className="text-sm text-gray-500">({suggestions.length} recommendations)</span>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`bg-white border rounded-lg p-4 transition-all ${
              appliedSuggestions.has(suggestion.id)
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getCategoryIcon(suggestion.category)}
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                    {suggestion.impact} impact
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>

                {expandedSuggestion === suggestion.id && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Current:</span>
                        <p className="text-gray-600 mt-1">{suggestion.currentContent || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Suggested:</span>
                        <p className="text-green-700 mt-1">{suggestion.suggestedContent}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedSuggestion(
                      expandedSuggestion === suggestion.id ? null : suggestion.id
                    )}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {expandedSuggestion === suggestion.id ? 'Hide details' : 'View details'}
                  </button>
                  
                  {!appliedSuggestions.has(suggestion.id) && (
                    <button
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      <FaArrowRight className="text-xs" />
                      <span>Apply suggestion</span>
                    </button>
                  )}
                </div>
              </div>

              {appliedSuggestions.has(suggestion.id) && (
                <div className="flex items-center space-x-1 text-green-600">
                  <FaCheck className="text-sm" />
                  <span className="text-sm font-medium">Applied</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <FaChartLine className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Pro Tip</h4>
            <p className="text-blue-700 text-sm">
              These suggestions are based on industry best practices and ATS optimization. 
              Applying them can significantly improve your CV's effectiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedAISuggestions 