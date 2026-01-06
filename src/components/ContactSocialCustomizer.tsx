'use client'

import React from 'react'
import { FaIcons, FaAlignLeft, FaAlignCenter, FaAlignRight, FaExpandArrowsAlt, FaCompressArrowsAlt, FaEye, FaEyeSlash, FaLink, FaPalette, FaArrowsAltH } from 'react-icons/fa'
import { useLocale } from '@/context/LocaleContext'
import { CVData } from '@/types/cv'

interface ContactSocialCustomizerProps {
  data: CVData
  onLayoutChange: (layout: CVData['layout']) => void
}

const ContactSocialCustomizer: React.FC<ContactSocialCustomizerProps> = ({ data, onLayoutChange }) => {
  const { t } = useLocale()
  const layout = data.layout || {}

  const handleChange = (updates: Partial<CVData['layout']>) => {
    onLayoutChange({ ...layout, ...updates })
  }

  const contactDisplayOptions = [
    { value: 'inline', label: 'Inline', icon: FaAlignLeft, description: 'All contact info on one line' },
    { value: 'stacked', label: 'Stacked', icon: FaAlignCenter, description: 'Each item on separate line' },
    { value: 'centered', label: 'Centered', icon: FaAlignCenter, description: 'Centered horizontal layout' },
    { value: 'justified', label: 'Justified', icon: FaExpandArrowsAlt, description: 'Spread across width' },
    { value: 'separated', label: 'Separated', icon: FaCompressArrowsAlt, description: 'With separators' }
  ]

  const socialDisplayOptions = [
    { value: 'icons', label: 'Icons Only', icon: FaEye, description: 'Just social media icons' },
    { value: 'text', label: 'Text Only', icon: FaEye, description: 'Just link text' },
    { value: 'icons-text', label: 'Icons & Text', icon: FaEye, description: 'Icons with labels' },
    { value: 'buttons', label: 'Buttons', icon: FaEye, description: 'Styled button links' },
    { value: 'minimal', label: 'Minimal', icon: FaEyeSlash, description: 'Subtle styling' }
  ]

  const separatorOptions = [
    { value: 'none', label: 'None', icon: '—' },
    { value: 'dot', label: '• Bullet', icon: '•' },
    { value: 'pipe', label: '| Pipe', icon: '|' },
    { value: 'bullet', label: '● Large Bullet', icon: '●' },
    { value: 'dash', label: '— Dash', icon: '—' }
  ]

  const alignmentOptions = [
    { value: 'left', label: 'Left', icon: FaAlignLeft },
    { value: 'center', label: 'Center', icon: FaAlignCenter },
    { value: 'right', label: 'Right', icon: FaAlignRight },
    { value: 'justify', label: 'Justified', icon: FaExpandArrowsAlt }
  ]

  const spacingOptions = [
    { value: 'tight', label: 'Tight', icon: FaCompressArrowsAlt },
    { value: 'normal', label: 'Normal', icon: FaArrowsAltH },
    { value: 'spread', label: 'Spread', icon: FaExpandArrowsAlt }
  ]

  return (
    <div className="space-y-8">
      {/* Contact Information Display */}
      <div>
        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaIcons className="mr-2 text-blue-600" />
          Contact Information Layout
        </h5>
        
        {/* Display Style */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Display Style</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {contactDisplayOptions.map(option => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handleChange({ contactDisplay: option.value as any })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-left ${
                    layout.contactDisplay === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className="mr-2 text-blue-600" />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Alignment and Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Alignment</label>
            <div className="grid grid-cols-2 gap-2">
              {alignmentOptions.map(option => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => handleChange({ contactAlignment: option.value as any })}
                    className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                      layout.contactAlignment === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="mr-2" />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Spacing</label>
            <div className="grid grid-cols-3 gap-2">
              {spacingOptions.map(option => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => handleChange({ contactSpacing: option.value as any })}
                    className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                      layout.contactSpacing === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="mb-1" />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Separator</label>
          <div className="flex flex-wrap gap-2">
            {separatorOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleChange({ contactSeparator: option.value as any })}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                  layout.contactSeparator === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2 text-lg">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Show Icons Toggle */}
        <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <FaIcons className="mr-3 text-green-600" />
            <div>
              <h5 className="font-medium text-gray-900">Show Contact Icons</h5>
              <p className="text-sm text-gray-600">Display icons next to contact information</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={layout.contactIcons !== false}
              onChange={(e) => handleChange({ contactIcons: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Social Links Display */}
      <div>
        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaLink className="mr-2 text-purple-600" />
          Social Links Layout
        </h5>
        
        {/* Display Style */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Display Style</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {socialDisplayOptions.map(option => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handleChange({ socialLinksDisplay: option.value as any })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-left ${
                    layout.socialLinksDisplay === option.value
                      ? 'border-purple-500 bg-purple-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className="mr-2 text-purple-600" />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Position and Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Position</label>
            <div className="space-y-2">
              {[
                { value: 'inline', label: 'Inline with Contact' },
                { value: 'below', label: 'Below Contact' },
                { value: 'separate', label: 'Separate Section' },
                { value: 'header-right', label: 'Right-aligned in Header' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleChange({ socialLinksPosition: option.value as any })}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                    layout.socialLinksPosition === option.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Alignment</label>
            <div className="grid grid-cols-2 gap-2">
              {alignmentOptions.map(option => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => handleChange({ socialLinksAlignment: option.value as any })}
                    className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                      layout.socialLinksAlignment === option.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="mr-2" />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Style and Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Style</label>
            <div className="space-y-2">
              {[
                { value: 'default', label: 'Default' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'outlined', label: 'Outlined' },
                { value: 'minimal', label: 'Minimal' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleChange({ socialLinksStyle: option.value as any })}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                    layout.socialLinksStyle === option.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
            <div className="space-y-2">
              {[
                { value: 'primary', label: 'Primary' },
                { value: 'secondary', label: 'Secondary' },
                { value: 'accent', label: 'Accent' },
                { value: 'custom', label: 'Custom' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleChange({ socialLinksColor: option.value as any })}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                    layout.socialLinksColor === option.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spacing and Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Spacing</label>
            <div className="grid grid-cols-3 gap-2">
              {spacingOptions.map(option => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => handleChange({ socialLinksSpacing: option.value as any })}
                    className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                      layout.socialLinksSpacing === option.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="mb-1" />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FaIcons className="mr-3 text-purple-600" />
              <div>
                <h5 className="font-medium text-gray-900">Show Social Icons</h5>
                <p className="text-sm text-gray-600">Display icons for social links</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={layout.socialLinksIcons !== false}
                onChange={(e) => handleChange({ socialLinksIcons: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ContactSocialCustomizer 