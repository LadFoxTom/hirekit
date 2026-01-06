'use client'

import React from 'react'
import { FaCheckCircle, FaCircle, FaSpinner } from 'react-icons/fa'

interface ProgressIndicatorProps {
  currentQuestionIndex: number
  totalQuestions: number
  currentSection: string
  isProcessing?: boolean
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentQuestionIndex,
  totalQuestions,
  currentSection,
  isProcessing = false
}) => {
  // Adjust progress calculation to account for the fact that currentQuestionIndex starts at 1
  // and represents the current question being asked (not answered)
  const answeredQuestions = Math.max(0, currentQuestionIndex - 1);
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100)
  
  const getSectionDisplayName = (section: string) => {
    const sectionNames: { [key: string]: string } = {
      'introduction': 'Getting Started',
      'career_stage': 'Career Stage',
      'industry': 'Industry',
      'regional': 'Region',
      'personal': 'Personal Info',
      'legal': 'Work Authorization',
      'availability': 'Availability',
      'social': 'Social Media',
      'summary': 'Professional Summary',
      'experience': 'Work Experience',
      'education': 'Education',
      'skills': 'Skills',
      'languages': 'Languages',
      'certifications': 'Certifications',
      'projects': 'Projects',
      'volunteer': 'Volunteer Work',
      'awards': 'Awards',
      'memberships': 'Memberships',
      'publications': 'Publications',
      'references': 'References',
      'hobbies': 'Interests',
      'preferences': 'Template',
      'quality': 'Quality Review',
      'completion': 'Final Review'
    }
    
    return sectionNames[section] || section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return 'bg-red-500'
    if (percentage < 60) return 'bg-yellow-500'
    if (percentage < 90) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getProgressMessage = (percentage: number) => {
    if (percentage < 20) return "Let's get started!"
    if (percentage < 40) return "Great progress!"
    if (percentage < 60) return "You're halfway there!"
    if (percentage < 80) return "Almost done!"
    if (percentage < 95) return "Final touches!"
    return "Perfect! Let's review your CV"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {isProcessing ? (
            <FaSpinner className="text-blue-500 animate-spin" />
          ) : (
            <FaCheckCircle className="text-green-500" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {isProcessing ? 'Processing...' : 'Advanced CV Builder Progress'}
          </span>
        </div>
        <span className="text-sm font-bold text-gray-900">
          {progressPercentage}% Complete
        </span>
      </div>
      {/* Progress Bar (reduced height) */}
      <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
        <div 
          className={`h-1 rounded-full transition-all duration-500 ease-out ${getProgressColor(progressPercentage)}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {/* Progress Details */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Current section:</span>
          <span className="font-medium text-gray-900">
            {getSectionDisplayName(currentSection)}
          </span>
        </div>
        <span className="text-gray-500">
          {answeredQuestions} of {totalQuestions} questions
        </span>
      </div>
    </div>
  )
}

export default ProgressIndicator 