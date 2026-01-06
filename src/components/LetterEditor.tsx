'use client'

import React, { useState } from 'react'
import { FaSave, FaUndo, FaRedo, FaEye, FaEdit } from 'react-icons/fa'
import { LetterData } from '@/types/letter'

interface LetterEditorProps {
  letterData: LetterData
  onLetterDataChange: (data: LetterData) => void
}

const LetterEditor: React.FC<LetterEditorProps> = ({
  letterData,
  onLetterDataChange
}) => {
  const [activeSection, setActiveSection] = useState<'sender' | 'recipient' | 'content' | 'layout'>('sender')
  const [editMode, setEditMode] = useState(false)

  const updateField = (field: string, value: any) => {
    onLetterDataChange({
      ...letterData,
      [field]: value
    })
  }

  const updateLayoutField = (field: string, value: any) => {
    const updatedLayout = {
      ...letterData.layout,
      [field]: value
    }
    onLetterDataChange({
      ...letterData,
      layout: updatedLayout
    })
  }

  const updateBodyContent = (index: number, value: string) => {
    const newBody = [...(letterData.body || [])]
    newBody[index] = value
    onLetterDataChange({
      ...letterData,
      body: newBody
    })
  }

  const addBodyParagraph = () => {
    const newBody = [...(letterData.body || []), '']
    onLetterDataChange({
      ...letterData,
      body: newBody
    })
  }

  const removeBodyParagraph = (index: number) => {
    const newBody = [...(letterData.body || [])]
    newBody.splice(index, 1)
    onLetterDataChange({
      ...letterData,
      body: newBody
    })
  }

  const cleanupDuplicateContent = () => {
    const newBody = [...(letterData.body || [])]
    const cleanedBody = newBody.filter(paragraph => {
      const lowerParagraph = paragraph.toLowerCase()
      
      // Remove paragraphs that contain common duplicate elements
      const duplicatePatterns = [
        /^\d{1,2}\/\d{1,2}\/\d{4}$/, // Dates like 21/07/2025
        /^hiring manager$/i,
        /^subject:/i,
        /^dear hiring manager/i,
        /^dear sir\/madam/i,
        /^to whom it may concern/i,
        /^\[.*address.*\]/i, // Placeholder addresses
        /^the company$/i,
        /^company address$/i
      ]
      
      return !duplicatePatterns.some(pattern => pattern.test(lowerParagraph.trim()))
    })
    
    onLetterDataChange({
      ...letterData,
      body: cleanedBody
    })
  }

  const sections = [
    { id: 'sender', label: 'Sender Info', icon: FaEdit },
    { id: 'recipient', label: 'Recipient Info', icon: FaEdit },
    { id: 'content', label: 'Letter Content', icon: FaEdit },
    { id: 'layout', label: 'Layout Settings', icon: FaEdit }
  ]

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {sections.map((section) => {
          const IconComponent = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex-1 flex items-center justify-center px-2 py-2 text-xs font-medium rounded-md transition-colors ${
                activeSection === section.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="mr-1 text-xs" />
              <span className="truncate">{section.label}</span>
            </button>
          )
        })}
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {activeSection === 'sender' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Sender Information</h4>
            
            {/* Info Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Your Information</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>This information will appear at the top of your letter as your contact details.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={letterData.senderName || ''}
                onChange={(e) => updateField('senderName', e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={letterData.senderTitle || ''}
                onChange={(e) => updateField('senderTitle', e.target.value)}
                placeholder="Your current job title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={letterData.senderEmail || ''}
                onChange={(e) => updateField('senderEmail', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={letterData.senderPhone || ''}
                onChange={(e) => updateField('senderPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={letterData.senderAddress || ''}
                onChange={(e) => updateField('senderAddress', e.target.value)}
                placeholder="Your address (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        )}

        {activeSection === 'recipient' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Recipient Information</h4>
            
            {/* Info Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-800">Company & Recipient Details</h3>
                  <div className="mt-2 text-sm text-purple-700">
                    <p>This information will be used for the letter header and addressing the recipient properly.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
              <input
                type="text"
                value={letterData.recipientName || ''}
                onChange={(e) => updateField('recipientName', e.target.value)}
                placeholder="Hiring Manager or specific person"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Title</label>
              <input
                type="text"
                value={letterData.recipientTitle || ''}
                onChange={(e) => updateField('recipientTitle', e.target.value)}
                placeholder="Hiring Manager, Director, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={letterData.companyName || ''}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="Company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={letterData.jobTitle || ''}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                placeholder="Position you're applying for"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
              <textarea
                value={letterData.companyAddress || ''}
                onChange={(e) => updateField('companyAddress', e.target.value)}
                placeholder="Company address (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        )}

        {activeSection === 'content' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Letter Content</h4>
            
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Content Guidelines</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="mb-2"><strong>Letter Content should only contain:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your motivation and interest in the position</li>
                      <li>Your relevant experience and achievements</li>
                      <li>How your skills match the job requirements</li>
                      <li>Why you want to work for this company</li>
                      <li>Your closing statement and call to action</li>
                    </ul>
                    <p className="mt-2 text-xs"><strong>Note:</strong> Addresses, dates, and recipient information are handled in the Sender/Recipient Info sections.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
              <input
                type="text"
                value={letterData.subject || ''}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Application for [Position] at [Company]"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Paragraph</label>
              <textarea
                value={letterData.opening || ''}
                onChange={(e) => updateField('opening', e.target.value)}
                placeholder="Start with your interest in the position and what excites you about this opportunity..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Body Paragraphs</label>
                <div className="flex space-x-2">
                  <button
                    onClick={cleanupDuplicateContent}
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                    title="Remove duplicate content like addresses, dates, and recipient info"
                  >
                    🧹 Clean Up
                  </button>
                  <button
                    onClick={addBodyParagraph}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Paragraph
                  </button>
                </div>
              </div>
              {(letterData.body || []).map((paragraph, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Paragraph {index + 1}</span>
                    {(letterData.body || []).length > 1 && (
                      <button
                        onClick={() => removeBodyParagraph(index)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateBodyContent(index, e.target.value)}
                    placeholder={`Focus on your experience, skills, or achievements that relate to this position...`}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closing Paragraph</label>
              <textarea
                value={letterData.closing || ''}
                onChange={(e) => updateField('closing', e.target.value)}
                placeholder="Express your enthusiasm for the opportunity and include a call to action..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
              <input
                type="text"
                value={letterData.signature || ''}
                onChange={(e) => updateField('signature', e.target.value)}
                placeholder="Additional signature line (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeSection === 'layout' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Layout Settings</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
              <select
                value={letterData.layout?.fontFamily || 'Times New Roman, serif'}
                onChange={(e) => updateLayoutField('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Calibri, sans-serif">Calibri</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              <select
                value={letterData.layout?.fontSize || '12pt'}
                onChange={(e) => updateLayoutField('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="10pt">10pt</option>
                <option value="11pt">11pt</option>
                <option value="12pt">12pt</option>
                <option value="14pt">14pt</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line Spacing</label>
              <select
                value={letterData.layout?.lineSpacing || '1.5'}
                onChange={(e) => updateLayoutField('lineSpacing', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1.0">Single</option>
                <option value="1.15">1.15</option>
                <option value="1.5">1.5</option>
                <option value="2.0">Double</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Margins</label>
              <select
                value={letterData.layout?.margins || '1in'}
                onChange={(e) => updateLayoutField('margins', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="0.5in">0.5 inches</option>
                <option value="0.75in">0.75 inches</option>
                <option value="1in">1 inch</option>
                <option value="1.25in">1.25 inches</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment</label>
              <select
                value={letterData.layout?.alignment || 'left'}
                onChange={(e) => updateLayoutField('alignment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={letterData.layout?.showDate !== false}
                  onChange={(e) => updateLayoutField('showDate', e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Show Date</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={letterData.layout?.showAddress !== false}
                  onChange={(e) => updateLayoutField('showAddress', e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Show Address</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={letterData.layout?.showSubject !== false}
                  onChange={(e) => updateLayoutField('showSubject', e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Show Subject Line</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LetterEditor 