'use client'

import React, { useState } from 'react'
import { FaLightbulb, FaMagic, FaCompress, FaArrowsAltV, FaEdit, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'
import { Page } from '@/hooks/usePagination'

interface SmartSuggestionsProps {
  pages: Page[]
  problems: any[]
  suggestions: any[]
  onApplySuggestion: (suggestion: any) => Promise<void>
  onRephraseSection: (sectionId: string, targetReduction: number) => Promise<string>
  onReorderSections: (newOrder: string[]) => void
  onResizeContent: (sectionId: string, newSize: 'smaller' | 'larger') => void
  className?: string
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  pages,
  problems,
  suggestions,
  onApplySuggestion,
  onRephraseSection,
  onReorderSections,
  onResizeContent,
  className = ''
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null)
  const [applyingSuggestion, setApplyingSuggestion] = useState<string | null>(null)
  const [rephrasingSection, setRephrasingSection] = useState<string | null>(null)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🔵'
      default: return '⚪'
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'reorder': return <FaArrowsAltV className="w-4 h-4" />
      case 'rephrase': return <FaEdit className="w-4 h-4" />
      case 'resize': return <FaCompress className="w-4 h-4" />
      case 'split': return <FaMagic className="w-4 h-4" />
      case 'combine': return <FaMagic className="w-4 h-4" />
      default: return <FaLightbulb className="w-4 h-4" />
    }
  }

  const handleApplySuggestion = async (suggestion: any) => {
    setApplyingSuggestion(suggestion.type)
    try {
      await onApplySuggestion(suggestion)
    } catch (error) {
      console.error('Failed to apply suggestion:', error)
    } finally {
      setApplyingSuggestion(null)
    }
  }

  const handleRephraseSection = async (sectionId: string, targetReduction: number) => {
    setRephrasingSection(sectionId)
    try {
      // Find the section content
      const section = pages
        .flatMap(page => page.sections)
        .find(s => s.id === sectionId)
      
      if (!section) {
        throw new Error('Section not found')
      }

      // Call the AI rephrasing API
      const response = await fetch('/api/ai-rephrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: section.content,
          targetReduction,
          sectionType: section.type,
          preserveFormatting: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to rephrase content')
      }

      const result = await response.json()
      
      // Call the parent handler with the rephrased content
      await onRephraseSection(sectionId, targetReduction)
      
      // Show success message (you could add a toast notification here)
      console.log('Rephrasing successful:', result)
      
    } catch (error) {
      console.error('Failed to rephrase section:', error)
      // Show error message (you could add a toast notification here)
    } finally {
      setRephrasingSection(null)
    }
  }

  const getOverallScore = () => {
    if (pages.length === 0) return 0
    const avgFitScore = pages.reduce((sum, page) => sum + page.fitScore, 0) / pages.length
    const problemPenalty = problems.length * 10
    return Math.max(0, avgFitScore - problemPenalty)
  }

  const overallScore = getOverallScore()

  return (
    <div className={`bg-white border border-gray-200 rounded-lg w-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaLightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Smart Suggestions</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Overall Score:</span>
            <div className={`px-2 py-1 rounded text-sm font-medium ${
              overallScore >= 80 ? 'bg-green-100 text-green-800' :
              overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {Math.round(overallScore)}%
            </div>
          </div>
        </div>
      </div>

      {/* Problems Summary */}
      {problems.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Issues Detected</h4>
          <div className="space-y-1">
            {problems.slice(0, 3).map((problem, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  problem.severity === 'high' ? 'bg-red-500' :
                  problem.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></span>
                <span className="text-gray-600">{problem.message}</span>
              </div>
            ))}
            {problems.length > 3 && (
              <div className="text-xs text-gray-500">
                +{problems.length - 3} more issues
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="p-4">
        {suggestions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <FaLightbulb className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No suggestions available</p>
            <p className="text-sm">Your document layout looks good!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 transition-all ${
                  expandedSuggestion === suggestion.type
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getPriorityColor(suggestion.priority)}`}>
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Suggestion
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                          {getPriorityIcon(suggestion.priority)} {suggestion.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {suggestion.description}
                      </p>
                      
                      {suggestion.type === 'rephrase' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRephraseSection('section-id', 10)}
                            disabled={rephrasingSection === 'section-id'}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                          >
                            {rephrasingSection === 'section-id' ? (
                              <FaSpinner className="w-3 h-3 animate-spin" />
                            ) : (
                              'Shorten 10%'
                            )}
                          </button>
                          <button
                            onClick={() => handleRephraseSection('section-id', 20)}
                            disabled={rephrasingSection === 'section-id'}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                          >
                            {rephrasingSection === 'section-id' ? (
                              <FaSpinner className="w-3 h-3 animate-spin" />
                            ) : (
                              'Shorten 20%'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedSuggestion(
                        expandedSuggestion === suggestion.type ? null : suggestion.type
                      )}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {expandedSuggestion === suggestion.type ? (
                        <FaTimes className="w-4 h-4" />
                      ) : (
                        <FaCheck className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleApplySuggestion(suggestion)}
                      disabled={applyingSuggestion === suggestion.type}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 flex items-center space-x-1"
                    >
                      {applyingSuggestion === suggestion.type ? (
                        <FaSpinner className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <FaCheck className="w-3 h-3" />
                          <span>Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {expandedSuggestion === suggestion.type && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        <strong>What this will do:</strong> {suggestion.description}
                      </p>
                      
                      {suggestion.type === 'reorder' && (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <p>This will automatically reorder your sections to minimize whitespace and improve page utilization.</p>
                        </div>
                      )}
                      
                      {suggestion.type === 'rephrase' && (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <p>AI will help shorten your content while preserving meaning and impact.</p>
                        </div>
                      )}
                      
                      {suggestion.type === 'resize' && (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <p>This will adjust font size or spacing to better fit content on pages.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onReorderSections([])}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Auto-reorder sections
          </button>
          <button
            onClick={() => {/* TODO: Implement */}}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Optimize spacing
          </button>
          <button
            onClick={() => {/* TODO: Implement */}}
            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Apply all suggestions
          </button>
        </div>
      </div>
    </div>
  )
}
