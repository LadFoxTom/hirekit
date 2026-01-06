'use client';

import React from 'react';
import { AIAnalysisOutput } from '@/lib/ai-templates';
import { FaLightbulb, FaCheck, FaArrowRight, FaEdit } from 'react-icons/fa';

interface AIAnalysisResultsProps {
  analysis: AIAnalysisOutput;
  onApplyImprovement?: (sectionId: string, content: string[]) => void;
  onClose?: () => void;
}

export function AIAnalysisResults({ analysis, onApplyImprovement, onClose }: AIAnalysisResultsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FaLightbulb className="text-yellow-500 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">AI Analysis Results</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* User Suggestions */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">{analysis.userSuggestions.title}</h3>
        <p className="text-gray-600 mb-4">{analysis.userSuggestions.description}</p>
        
        {analysis.userSuggestions.recommendations.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
            <ul className="space-y-2">
              {analysis.userSuggestions.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.userSuggestions.nextSteps.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Next Steps:</h4>
            <ul className="space-y-2">
              {analysis.userSuggestions.nextSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <FaArrowRight className="text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CV Improvements */}
      {analysis.cvImprovements.sections.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Suggested CV Improvements</h3>
          <div className="space-y-4">
            {analysis.cvImprovements.sections.map((section) => (
              <div key={section.sectionId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">{section.sectionName}</h4>
                  {onApplyImprovement && (
                    <button
                      onClick={() => onApplyImprovement(section.sectionId, section.suggestedContent)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <FaEdit className="text-sm" />
                      <span className="text-sm">Apply</span>
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{section.reason}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Current:</h5>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                      {section.currentContent.length > 0 ? (
                        <ul className="space-y-1">
                          {section.currentContent.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">No content</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Suggested:</h5>
                    <div className="bg-green-50 p-3 rounded text-sm text-gray-700">
                      <ul className="space-y-1">
                        {section.suggestedContent.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Sections */}
      {analysis.cvImprovements.missingSections.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Missing Sections</h3>
          <div className="space-y-4">
            {analysis.cvImprovements.missingSections.map((section) => (
              <div key={section.sectionId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">{section.sectionName}</h4>
                  {onApplyImprovement && (
                    <button
                      onClick={() => onApplyImprovement(section.sectionId, section.suggestedContent)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <FaEdit className="text-sm" />
                      <span className="text-sm">Add Section</span>
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{section.reason}</p>
                
                <div className="bg-blue-50 p-3 rounded text-sm text-gray-700">
                  <ul className="space-y-1">
                    {section.suggestedContent.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flow Analysis */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Progress Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-600 mb-2">Current Progress</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysis.flowAnalysis.currentProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{analysis.flowAnalysis.currentProgress}% complete</p>
          </div>
          
          {analysis.flowAnalysis.missingInformation.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-600 mb-2">Missing Information</h4>
              <ul className="space-y-1">
                {analysis.flowAnalysis.missingInformation.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center space-x-1">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {analysis.flowAnalysis.suggestedNextQuestion && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Suggested Next Question</h4>
            <p className="text-gray-600 mb-2">{analysis.flowAnalysis.suggestedNextQuestion.text}</p>
            <p className="text-sm text-gray-500">{analysis.flowAnalysis.suggestedNextQuestion.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
} 