'use client'

import React, { useState } from 'react'
import { FaPalette, FaCheck, FaMagic, FaLaptopCode, FaBalanceScale, FaLightbulb, FaFeatherAlt, FaCrown, FaGraduationCap } from 'react-icons/fa'
import { useLocale } from '@/context/LocaleContext'

// Template icon component
const TemplateIcon = ({ templateId, className = "" }: { templateId: string, className?: string }) => {
  const getTemplateIcon = (id: string) => {
    switch (id) {
      case 'modern': return <FaLaptopCode className={`w-6 h-6 ${className}`} />
      case 'classic': return <FaBalanceScale className={`w-6 h-6 ${className}`} />
      case 'creative': return <FaLightbulb className={`w-6 h-6 ${className}`} />
      case 'minimal': return <FaFeatherAlt className={`w-6 h-6 ${className}`} />
      case 'executive': return <FaCrown className={`w-6 h-6 ${className}`} />
      case 'tech': return <FaLaptopCode className={`w-6 h-6 ${className}`} />
      default: return <FaMagic className={`w-6 h-6 ${className}`} />
    }
  }

  const getTemplateColor = (id: string) => {
    switch (id) {
      case 'modern': return 'text-blue-600'
      case 'classic': return 'text-gray-600'
      case 'creative': return 'text-purple-600'
      case 'minimal': return 'text-green-600'
      case 'executive': return 'text-indigo-600'
      case 'tech': return 'text-cyan-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className={`${getTemplateColor(templateId)}`}>
      {getTemplateIcon(templateId)}
    </div>
  )
}

export interface TemplateSelectorProps {
  currentTemplate: string
  onTemplateChange: (templateId: string) => void
}

// Enhanced template data with preview images and descriptions
const ENHANCED_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with modern typography and spacing',
    category: 'Professional',
    color: 'bg-gradient-to-r from-blue-500 to-purple-600',
    bestFor: 'Technology, Marketing, Creative'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and timeless layout perfect for conservative industries',
    category: 'Traditional',
    color: 'bg-gradient-to-r from-gray-600 to-gray-800',
    bestFor: 'Finance, Legal, Healthcare'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and innovative design for creative professionals',
    category: 'Creative',
    color: 'bg-gradient-to-r from-pink-500 to-orange-500',
    bestFor: 'Design, Arts, Media'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content over decoration',
    category: 'Minimalist',
    color: 'bg-gradient-to-r from-green-500 to-teal-500',
    bestFor: 'Consulting, Education, Research'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium and sophisticated design for senior positions',
    category: 'Executive',
    color: 'bg-gradient-to-r from-indigo-600 to-purple-700',
    bestFor: 'Management, C-Suite, Senior Roles'
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Modern tech industry style with clean lines and bold accents',
    category: 'Technology',
    color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    bestFor: 'Software, Engineering, IT'
  }
]

export function TemplateSelector({ currentTemplate, onTemplateChange }: TemplateSelectorProps) {
  const { t } = useLocale()
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const template = ENHANCED_TEMPLATES.find(t => t.id === currentTemplate) || ENHANCED_TEMPLATES[0]
  
  const categories = ['All', ...Array.from(new Set(ENHANCED_TEMPLATES.map(t => t.category)))]
  
  const filteredTemplates = selectedCategory === 'All' 
    ? ENHANCED_TEMPLATES 
    : ENHANCED_TEMPLATES.filter(t => t.category === selectedCategory)
  
  const handleTemplateSelect = (templateId: string) => {
    onTemplateChange(templateId)
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === category
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              template.id === currentTemplate 
                ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Template Icon */}
              <div className="flex-shrink-0">
                <TemplateIcon templateId={template.id} />
              </div>
              
              {/* Template Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h4>
                  {template.id === currentTemplate && (
                    <FaCheck className="text-blue-600 text-lg mt-1" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${template.color} text-white`}>
                    {template.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Best for: {template.bestFor}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Current Selection Info */}
      {template && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <TemplateIcon templateId={template.id} className="mr-3" />
            <div>
              <h5 className="font-medium text-blue-900">Currently Selected: {template.name}</h5>
              <p className="text-sm text-blue-700">{template.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 