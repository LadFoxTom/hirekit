'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CVTemplate, TEMPLATE_INFO, TemplateInfo } from './pdf/CVDocumentPDF'
import { 
  FiLayout, FiCheck, FiZap, FiTarget, FiAward, 
  FiGrid, FiFileText, FiStar, FiTrendingUp, FiUsers
} from 'react-icons/fi'

interface TemplateQuickSelectorProps {
  currentTemplate: string
  onTemplateChange: (template: CVTemplate) => void
  className?: string
}

// Group templates by category
const TEMPLATE_CATEGORIES = [
  {
    id: 'ats-layout',
    name: 'ATS-Optimized Layouts',
    description: 'Maximum parseability for applicant tracking systems',
    icon: FiTarget,
  },
  {
    id: 'style',
    name: 'Styled Templates',
    description: 'Visual appeal with sidebar layouts',
    icon: FiLayout,
  },
]

// Template preview mini-thumbnails (stylized icons)
const getTemplateIcon = (templateId: CVTemplate) => {
  const iconMap: Record<string, React.ReactNode> = {
    'classic-chronological': (
      <div className="w-full h-full flex flex-col p-1.5 gap-0.5">
        <div className="h-3 bg-current opacity-80 rounded-sm mx-auto w-3/4" />
        <div className="h-1 bg-current opacity-30 mx-auto w-1/2 rounded-full" />
        <div className="flex-1 flex flex-col gap-0.5 mt-1">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-4/5" />
        </div>
      </div>
    ),
    'skills-forward': (
      <div className="w-full h-full flex flex-col p-1.5 gap-0.5">
        <div className="h-2 bg-current opacity-80 rounded-sm w-1/2" />
        <div className="h-3 bg-current opacity-20 rounded-sm flex flex-wrap gap-0.5 p-0.5">
          <div className="h-1 w-1/4 bg-current opacity-60 rounded-sm" />
          <div className="h-1 w-1/3 bg-current opacity-60 rounded-sm" />
          <div className="h-1 w-1/4 bg-current opacity-60 rounded-sm" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
        </div>
      </div>
    ),
    'modern-minimalist': (
      <div className="w-full h-full flex p-1">
        <div className="w-1/3 bg-current opacity-10 rounded-l-sm flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-current opacity-60 rounded-sm" />
          <div className="h-1 bg-current opacity-40 rounded-sm w-2/3" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-current opacity-60 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
          <div className="h-1 bg-current opacity-40 rounded-full" />
        </div>
      </div>
    ),
    'executive-leader': (
      <div className="w-full h-full flex flex-col p-1.5 gap-0.5">
        <div className="h-3 bg-current opacity-80 rounded-sm" />
        <div className="h-1 bg-current opacity-20 rounded-full" />
        <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
          <div className="h-1.5 bg-current opacity-30 rounded-sm" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
          <div className="h-1 bg-current opacity-40 rounded-full" />
        </div>
      </div>
    ),
    'ats-simple': (
      <div className="w-full h-full flex flex-col p-1.5 gap-1">
        <div className="h-2 bg-current opacity-60 rounded-sm mx-auto w-1/2" />
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="h-0.5 bg-current opacity-80 rounded-full" />
          <div className="h-1 bg-current opacity-30 rounded-full" />
          <div className="h-0.5 bg-current opacity-80 rounded-full" />
          <div className="h-1 bg-current opacity-30 rounded-full w-5/6" />
        </div>
      </div>
    ),
    'compact-professional': (
      <div className="w-full h-full flex flex-col p-1 gap-0.5">
        <div className="flex justify-between items-start">
          <div className="h-2 w-1/3 bg-current opacity-80 rounded-sm" />
          <div className="h-1.5 w-1/4 bg-current opacity-30 rounded-sm" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="h-0.5 bg-current opacity-40 rounded-full" />
          <div className="h-0.5 bg-current opacity-40 rounded-full w-5/6" />
          <div className="h-0.5 bg-current opacity-40 rounded-full" />
          <div className="h-0.5 bg-current opacity-40 rounded-full w-4/5" />
          <div className="h-0.5 bg-current opacity-40 rounded-full" />
        </div>
      </div>
    ),
    'modern': (
      <div className="w-full h-full flex p-1">
        <div className="w-1/3 bg-current opacity-80 rounded-l-sm" />
        <div className="flex-1 flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
        </div>
      </div>
    ),
    'executive': (
      <div className="w-full h-full flex p-1">
        <div className="w-1/3 bg-current opacity-90 rounded-l-sm" />
        <div className="flex-1 flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
        </div>
      </div>
    ),
    'creative': (
      <div className="w-full h-full flex p-1">
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-purple-900 rounded-l-sm" />
        <div className="flex-1 flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
        </div>
      </div>
    ),
    'minimal': (
      <div className="w-full h-full flex p-1">
        <div className="w-1/3 bg-current opacity-10 rounded-l-sm" />
        <div className="flex-1 flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
        </div>
      </div>
    ),
    'professional': (
      <div className="w-full h-full flex p-1">
        <div className="w-1/3 bg-current opacity-85 rounded-l-sm" />
        <div className="flex-1 flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
        </div>
      </div>
    ),
    'tech': (
      <div className="w-full h-full flex p-1">
        <div className="w-1/3 bg-emerald-700 rounded-l-sm" />
        <div className="flex-1 flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-current opacity-40 rounded-full" />
          <div className="h-1 bg-current opacity-40 rounded-full w-5/6" />
        </div>
      </div>
    ),
  }
  return iconMap[templateId] || iconMap['modern']
}

export const TemplateQuickSelector: React.FC<TemplateQuickSelectorProps> = ({
  currentTemplate,
  onTemplateChange,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ats-layout' | 'style'>('all')
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const filteredTemplates = activeCategory === 'all' 
    ? TEMPLATE_INFO 
    : TEMPLATE_INFO.filter(t => t.category === activeCategory)

  const getATSBadgeColor = (score: number) => {
    if (score >= 95) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    if (score >= 85) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {[
          { id: 'all', label: 'All Templates', icon: FiGrid },
          { id: 'ats-layout', label: 'ATS-Optimized', icon: FiTarget },
          { id: 'style', label: 'Styled', icon: FiLayout },
        ].map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                activeCategory === cat.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.label.split('-')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Info Banner for ATS Templates */}
      {activeCategory === 'ats-layout' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
        >
          <div className="flex items-start gap-2">
            <FiZap className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <span className="font-medium">ATS-Optimized templates</span> are designed for maximum parseability by 
              Applicant Tracking Systems. They use single-column layouts, standard fonts, and avoid complex formatting.
            </div>
          </div>
        </motion.div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template) => {
            const isSelected = currentTemplate === template.id
            
            return (
              <motion.button
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTemplateChange(template.id)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className={`relative flex flex-col rounded-xl border-2 overflow-hidden transition-all ${
                  isSelected
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {/* Template Preview */}
                <div 
                  className="aspect-[8.5/11] w-full relative"
                  style={{ color: template.color }}
                >
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 p-2">
                    {getTemplateIcon(template.id)}
                  </div>
                  
                  {/* Selected Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <FiCheck size={12} className="text-white" />
                    </motion.div>
                  )}

                  {/* ATS Score Badge */}
                  <div className={`absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${getATSBadgeColor(template.atsScore)}`}>
                    {template.atsScore}% ATS
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {template.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                        {template.description}
                      </p>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: template.color }}
                    />
                  </div>
                </div>

                {/* Hover Overlay with Details */}
                <AnimatePresence>
                  {hoveredTemplate === template.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center"
                    >
                      <h4 className="text-sm font-bold text-white mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-300 mb-2">{template.description}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {template.bestFor.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-white/20 text-white text-[9px] rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Quick Tips */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mt-4">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
          <FiStar size={12} className="text-amber-500" />
          Quick Tips
        </h4>
        <ul className="text-[11px] text-gray-600 dark:text-gray-400 space-y-1">
          <li className="flex items-start gap-1.5">
            <span className="text-green-500 mt-0.5">•</span>
            <span><strong>Classic ATS</strong> and <strong>ATS Simple</strong> work best with automated systems</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-purple-500 mt-0.5">•</span>
            <span><strong>Skills Forward</strong> is ideal for career changers or those with skill-focused roles</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-blue-500 mt-0.5">•</span>
            <span><strong>Executive Leader</strong> emphasizes accomplishments for senior positions</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TemplateQuickSelector


