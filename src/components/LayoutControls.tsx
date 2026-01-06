'use client'

import React, { useState } from 'react'
import { FaSlidersH, FaMagic, FaCogs, FaEye, FaCheck, FaUser, FaAlignLeft, FaAlignCenter, FaAlignRight, FaExpandArrowsAlt, FaCompressArrowsAlt, FaFont, FaPalette, FaImage, FaTrash } from 'react-icons/fa'
import { useLocale } from '@/context/LocaleContext'
import { CVData } from '@/types/cv'
import { toast } from 'react-hot-toast'
import { FONT_CONFIGS, getFontsByCategory, getFontCategories } from '@/lib/fonts'

// Layout presets with visual previews
const LAYOUT_PRESETS = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional with balanced spacing',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-500'
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Space-efficient layout for content-heavy CVs',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-100 border-l-4 border-green-500'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with generous spacing',
    preview: 'bg-gradient-to-br from-purple-50 to-violet-100 border-l-4 border-purple-500'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean with focus on content',
    preview: 'bg-gradient-to-br from-gray-50 to-slate-100 border-l-4 border-gray-500'
  }
]

// Photo position options
const PHOTO_POSITIONS = [
  { value: 'none', label: 'No Photo', icon: '🚫' },
  { value: 'left', label: 'Left Side', icon: '⬅️' },
  { value: 'right', label: 'Right Side', icon: '➡️' },
  { value: 'center', label: 'Center Top', icon: '⬆️' }
]

// Font family options - using the comprehensive font system
const FONT_FAMILIES = FONT_CONFIGS.map(font => ({
  id: font.id,
  name: font.name,
  fontFamily: font.fontFamily,
  className: `font-${font.id}`,
  category: font.category,
  description: font.description
}))

type PhotoPosition = 'left' | 'right' | 'center' | 'none';

interface LayoutControlsProps {
  data: CVData
  onLayoutChange: (layout: CVData['layout']) => void
}

const LayoutControls: React.FC<LayoutControlsProps> = ({ data, onLayoutChange }) => {
  const { t } = useLocale()
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets')
  
  // Store the current layout preset if it matches a preset
  const [currentPreset, setCurrentPreset] = useState<string>('custom')
  
  // Initialize layout with the current data or defaults
  const [layout, setLayout] = useState<Required<NonNullable<CVData['layout']>>>({
    photoPosition: data.layout?.photoPosition || 'none',
    photoShape: data.layout?.photoShape || 'circle',
    photoPositionX: data.layout?.photoPositionX ?? 50,
    photoPositionY: data.layout?.photoPositionY ?? 50,
    showIcons: data.layout?.showIcons !== undefined ? data.layout.showIcons : true,
    accentColor: data.layout?.accentColor || '#3b82f6',
    sectionOrder: data.layout?.sectionOrder || [
      'summary',
      'experience',
      'education',
      'skills',
      'languages',
      'certifications',
      'projects',
      'hobbies'
    ],
    sectionIcons: data.layout?.sectionIcons || {},
    fontFamily: data.layout?.fontFamily || '',
    sectionTitles: data.layout?.sectionTitles || {},
    contactDisplay: data.layout?.contactDisplay || 'inline',
    contactAlignment: data.layout?.contactAlignment || 'left',
    contactSpacing: data.layout?.contactSpacing || 'normal',
    contactSeparator: data.layout?.contactSeparator || 'none',
    contactIcons: data.layout?.contactIcons !== undefined ? data.layout.contactIcons : true,
    socialLinksDisplay: data.layout?.socialLinksDisplay || 'icons-text',
    socialLinksPosition: data.layout?.socialLinksPosition || 'inline',
    socialLinksAlignment: data.layout?.socialLinksAlignment || 'left',
    socialLinksStyle: data.layout?.socialLinksStyle || 'default',
    socialLinksColor: data.layout?.socialLinksColor || 'primary',
    socialLinksSpacing: data.layout?.socialLinksSpacing || 'normal',
    socialLinksIcons: data.layout?.socialLinksIcons !== undefined ? data.layout.socialLinksIcons : true,
    headerLayout: data.layout?.headerLayout || 'standard',
    headerAlignment: data.layout?.headerAlignment || 'left',
    headerSpacing: data.layout?.headerSpacing || 'normal',
    sidebarPosition: data.layout?.sidebarPosition || 'none',
    hiddenSections: data.layout?.hiddenSections || []
  })
  
  const [showSectionIcons, setShowSectionIcons] = useState(false);

  // Handle layout changes
  const handleChange = (updatedLayout: Partial<CVData['layout']>) => {
    const newLayout = { ...layout, ...updatedLayout }
    setLayout(newLayout)
    onLayoutChange(newLayout)
  }

  // Apply layout preset
  const applyLayoutPreset = (presetId: string) => {
    const preset = LAYOUT_PRESETS.find(p => p.id === presetId)
    if (!preset) return

    let newLayout = { ...layout }

    switch (presetId) {
      case 'modern':
        newLayout = {
          ...newLayout,
          photoPosition: 'right',
          showIcons: true,
          accentColor: '#3b82f6',
          fontFamily: 'Inter, sans-serif'
        }
        break
      case 'compact':
        newLayout = {
          ...newLayout,
          photoPosition: 'none',
          showIcons: false,
          accentColor: '#10b981',
          fontFamily: 'Roboto, sans-serif'
        }
        break
      case 'elegant':
        newLayout = {
          ...newLayout,
          photoPosition: 'left',
          showIcons: true,
          accentColor: '#8b5cf6',
          fontFamily: 'Georgia, serif'
        }
        break
      case 'minimal':
        newLayout = {
          ...newLayout,
          photoPosition: 'none',
          showIcons: false,
          accentColor: '#6b7280',
          fontFamily: 'Inter, sans-serif'
        }
        break
    }

    setLayout(newLayout)
    onLayoutChange(newLayout)
    setCurrentPreset(presetId)
    toast.success(`Applied ${preset.name} layout`)
  }
  
  // Handle photo removal
  const handleRemovePhoto = () => {
    // First set the photo position to none
    const newLayout = { ...layout, photoPosition: 'none' as PhotoPosition };
    setLayout(newLayout);
    onLayoutChange(newLayout);
    
    // Create a custom event to notify parent component to remove the photo
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('removePhoto', {
        detail: { message: 'Photo removed' }
      });
      window.dispatchEvent(event);
    }
    
    // Toast notification
    toast.success('Photo removed');
  }
  
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'presets'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FaMagic className="inline mr-2" />
          Quick Presets
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'custom'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FaCogs className="inline mr-2" />
          Custom Settings
        </button>
      </div>

      {activeTab === 'presets' ? (
        /* Presets Tab */
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Choose a pre-designed layout that matches your style and industry.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LAYOUT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyLayoutPreset(preset.id)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                  preset.id === currentPreset 
                    ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Preset Preview */}
                  <div className={`w-20 h-24 rounded-lg ${preset.preview} flex items-center justify-center shadow-sm`}>
                    <FaEye className="text-gray-600 text-lg" />
                  </div>
                  
                  {/* Preset Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {preset.name}
                      </h4>
                      {preset.id === currentPreset && (
                        <FaCheck className="text-blue-600 text-lg" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{preset.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Custom Tab */
        <div className="space-y-6">
          {/* Photo Position */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaImage className="mr-2 text-purple-600" />
              Photo Position
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PHOTO_POSITIONS.map((position) => (
                <button
                  key={position.value}
                  onClick={() => handleChange({ photoPosition: position.value as PhotoPosition })}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    layout.photoPosition === position.value
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-2">{position.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{position.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Show Icons Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FaEye className="mr-3 text-green-600" />
              <div>
                <h5 className="font-medium text-gray-900">Show Icons</h5>
                <p className="text-sm text-gray-600">Display icons throughout your CV</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={layout.showIcons}
                onChange={(e) => handleChange({ showIcons: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaPalette className="mr-2 text-pink-600" />
              Accent Color
            </label>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleChange({ accentColor: color })}
                    className={`w-12 h-12 rounded-full border-2 transition-transform hover:scale-110 ${
                      layout.accentColor === color ? 'border-gray-900 scale-110 ring-2 ring-blue-200' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Custom:</span>
                <input
                  type="color"
                  value={layout.accentColor}
                  onChange={(e) => handleChange({ accentColor: e.target.value })}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaFont className="mr-2 text-indigo-600" />
              Font Family
            </label>
            <div className="space-y-6">
              {getFontCategories().map((category) => {
                const categoryFonts = getFontsByCategory(category);
                return (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryFonts.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => handleChange({ fontFamily: font.fontFamily })}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-left font-${font.id} ${
                            layout.fontFamily === font.fontFamily
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">{font.name}</div>
                          <div className="text-sm text-gray-600">The quick brown fox jumps over the lazy dog</div>
                          <div className="text-xs text-gray-500 mt-1">{font.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Remove Photo Button */}
          {layout.photoPosition !== 'none' && (
            <button
              onClick={handleRemovePhoto}
              className="w-full px-4 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
            >
              <FaTrash className="mr-2" />
              Remove Photo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default LayoutControls 