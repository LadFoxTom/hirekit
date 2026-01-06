'use client'

import React, { useState } from 'react'
import { FaLightbulb, FaMagic, FaCopy, FaCheck, FaSpinner } from 'react-icons/fa'
import { CVData } from '@/types/cv'

interface AIContentSuggestionsProps {
  cvData: CVData
  onSuggestionApply: (sectionId: string, content: string[]) => void
}

const SUGGESTION_TYPES = {
  summary: {
    label: 'Professional Summary',
    icon: '💼',
    prompts: [
      'Write a compelling professional summary for a {title} with {experienceLevel} experience',
      'Create a summary highlighting key achievements and skills for {title}',
      'Generate a professional summary that showcases {skills} expertise'
    ]
  },
  experience: {
    label: 'Work Experience',
    icon: '🏢',
    prompts: [
      'Suggest bullet points for {title} role at {company}',
      'Create achievement-focused descriptions for {title} position',
      'Generate impactful experience descriptions highlighting {skills}'
    ]
  },
  skills: {
    label: 'Skills',
    icon: '🛠️',
    prompts: [
      'Suggest relevant skills for a {title} position',
      'Recommend technical and soft skills for {experienceLevel} {title}',
      'Generate a comprehensive skills list for {title} role'
    ]
  },
  education: {
    label: 'Education',
    icon: '🎓',
    prompts: [
      'Suggest relevant coursework for {title} position',
      'Create education descriptions highlighting relevant projects',
      'Generate academic achievements relevant to {title}'
    ]
  }
}

export default function AIContentSuggestions({ cvData, onSuggestionApply }: AIContentSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({})
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null)

  const generateSuggestions = async (sectionId: string) => {
    setIsLoading(true)
    setActiveSection(sectionId)
    
    try {
      const section = SUGGESTION_TYPES[sectionId as keyof typeof SUGGESTION_TYPES]
      if (!section) return

      // Create context for the AI prompt
      const context = {
        title: cvData.title || 'Software Engineer',
        experienceLevel: cvData.experienceLevel || 'mid-level',
        skills: Array.isArray(cvData.skills) 
          ? cvData.skills?.slice(0, 5).join(', ') || 'programming, problem-solving'
          : [
              ...(cvData.skills?.technical || []),
              ...(cvData.skills?.soft || []),
              ...(cvData.skills?.tools || []),
              ...(cvData.skills?.industry || [])
            ].slice(0, 5).join(', ') || 'programming, problem-solving',
        company: 'Tech Company',
        education: cvData.education?.[0]?.degree || 'Bachelor\'s Degree'
      }

      // Select a random prompt and fill in context
      const prompt = section.prompts[Math.floor(Math.random() * section.prompts.length)]
        .replace('{title}', context.title)
        .replace('{experienceLevel}', context.experienceLevel)
        .replace('{skills}', context.skills)
        .replace('{company}', context.company)
        .replace('{education}', context.education)

      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: sectionId,
          prompt,
          context: cvData
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(prev => ({
          ...prev,
          [sectionId]: data.suggestions || []
        }))
      } else {
        throw new Error('Failed to generate suggestions')
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
      // Fallback suggestions
      const fallbackSuggestions = getFallbackSuggestions(sectionId)
      setSuggestions(prev => ({
        ...prev,
        [sectionId]: fallbackSuggestions
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const getFallbackSuggestions = (sectionId: string): string[] => {
    const fallbacks: Record<string, string[]> = {
      summary: [
        'Results-driven professional with proven track record of delivering high-quality solutions',
        'Experienced in leading cross-functional teams and driving project success',
        'Strong analytical and problem-solving skills with attention to detail'
      ],
      experience: [
        'Led development of key features resulting in 25% improvement in user engagement',
        'Collaborated with stakeholders to define requirements and deliver solutions',
        'Mentored junior developers and conducted code reviews to maintain quality'
      ],
      skills: [
        'JavaScript, React, Node.js, Python, SQL',
        'Agile methodologies, Git, Docker, AWS',
        'Leadership, communication, problem-solving'
      ],
      education: [
        'Relevant coursework: Data Structures, Algorithms, Software Engineering',
        'Capstone project: Developed full-stack web application',
        'Dean\'s List recipient for academic excellence'
      ]
    }
    return fallbacks[sectionId] || []
  }

  const copySuggestion = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSuggestion(text)
      setTimeout(() => setCopiedSuggestion(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const applySuggestion = (sectionId: string, suggestion: string) => {
    const content = suggestion.split('\n').filter(line => line.trim())
    onSuggestionApply(sectionId, content)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FaLightbulb className="text-yellow-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900">AI Content Suggestions</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Get AI-powered suggestions to improve your CV content. Click on any section to generate relevant suggestions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(SUGGESTION_TYPES).map(([sectionId, section]) => (
          <div key={sectionId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{section.icon}</span>
                <h4 className="font-medium text-gray-900">{section.label}</h4>
              </div>
              <button
                onClick={() => generateSuggestions(sectionId)}
                disabled={isLoading && activeSection === sectionId}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {isLoading && activeSection === sectionId ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaMagic />
                )}
                <span>Generate</span>
              </button>
            </div>

            {suggestions[sectionId] && (
              <div className="space-y-2">
                {suggestions[sectionId].map((suggestion, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 mb-2">{suggestion}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copySuggestion(suggestion)}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        {copiedSuggestion === suggestion ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaCopy />
                        )}
                        <span>{copiedSuggestion === suggestion ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => applySuggestion(sectionId, suggestion)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> AI suggestions are based on your current CV data and industry best practices. 
          Always review and customize suggestions to match your specific experience.
        </p>
      </div>
    </div>
  )
} 