'use client'

import React, { useState } from 'react'
import { CVData } from '@/types/cv'
import { FaCheck, FaEdit, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

interface PDFExtractReviewProps {
  extractedData: Partial<CVData>
  onConfirm: (data: Partial<CVData>) => void
  onCancel: () => void
}

const PDFExtractReview: React.FC<PDFExtractReviewProps> = ({
  extractedData,
  onConfirm,
  onCancel
}) => {
  const [editedData, setEditedData] = useState<Partial<CVData>>(extractedData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const handleInputChange = (
    field: string,
    value: string | string[] | object | undefined
  ) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContactChange = (field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // Simple validation
    if (!editedData.fullName || !editedData.title) {
      toast.error('Please provide at least your name and title')
      setIsSubmitting(false)
      return
    }
    
    // Confirm the edited data
    onConfirm(editedData)
  }

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Review Extracted Information</h2>
      
      <div className="space-y-6">
        {/* Basic Info Section */}
        <div className="border rounded-md p-4">
          <h3 
            className="font-semibold text-lg mb-4 flex justify-between cursor-pointer"
            onClick={() => toggleSection('basic')}
          >
            Personal Information
            <span className="text-blue-500">{expandedSection === 'basic' ? '−' : '+'}</span>
          </h3>
          
          {(expandedSection === 'basic' || expandedSection === null) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editedData.fullName || ''}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={editedData.title || ''}
                  onChange={e => handleInputChange('title', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editedData.contact?.email || ''}
                  onChange={e => handleContactChange('email', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editedData.contact?.phone || ''}
                  onChange={e => handleContactChange('phone', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editedData.contact?.location || ''}
                  onChange={e => handleContactChange('location', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Summary Section */}
        <div className="border rounded-md p-4">
          <h3 
            className="font-semibold text-lg mb-4 flex justify-between cursor-pointer"
            onClick={() => toggleSection('summary')}
          >
            Professional Summary
            <span className="text-blue-500">{expandedSection === 'summary' ? '−' : '+'}</span>
          </h3>
          
          {(expandedSection === 'summary' || expandedSection === null) && (
            <div>
              <textarea
                value={editedData.summary || ''}
                onChange={e => handleInputChange('summary', e.target.value)}
                rows={4}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your professional summary"
              />
            </div>
          )}
        </div>
        
        {/* Experience Section */}
        <div className="border rounded-md p-4">
          <h3 
            className="font-semibold text-lg mb-4 flex justify-between cursor-pointer"
            onClick={() => toggleSection('experience')}
          >
            Work Experience
            <span className="text-blue-500">{expandedSection === 'experience' ? '−' : '+'}</span>
          </h3>
          
          {expandedSection === 'experience' && (
            <div className="space-y-4">
              {editedData.experience && editedData.experience.length > 0 ? (
                editedData.experience.map((exp, index) => (
                  <div key={index} className="border-t pt-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position & Company</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={e => {
                          const updatedExperience = [...(editedData.experience || [])];
                          updatedExperience[index] = { ...exp, title: e.target.value };
                          handleInputChange('experience', updatedExperience);
                        }}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                      <textarea
                        value={exp.content?.join('\n') || ''}
                        onChange={e => {
                          const updatedExperience = [...(editedData.experience || [])];
                          updatedExperience[index] = { 
                            ...exp, 
                            content: e.target.value.split('\n').filter(line => line.trim() !== '') 
                          };
                          handleInputChange('experience', updatedExperience);
                        }}
                        rows={4}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No experience data extracted</p>
              )}
            </div>
          )}
        </div>
        
        {/* Education Section */}
        <div className="border rounded-md p-4">
          <h3 
            className="font-semibold text-lg mb-4 flex justify-between cursor-pointer"
            onClick={() => toggleSection('education')}
          >
            Education
            <span className="text-blue-500">{expandedSection === 'education' ? '−' : '+'}</span>
          </h3>
          
          {expandedSection === 'education' && (
            <div className="space-y-4">
              {editedData.education && editedData.education.length > 0 ? (
                editedData.education.map((edu, index) => (
                  <div key={index} className="border-t pt-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree & Institution</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={e => {
                          const updatedEducation = [...(editedData.education || [])];
                          updatedEducation[index] = { ...edu, degree: e.target.value };
                          handleInputChange('education', updatedEducation);
                        }}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                      <textarea
                        value={edu.content?.join('\n') || ''}
                        onChange={e => {
                          const updatedEducation = [...(editedData.education || [])];
                          updatedEducation[index] = { 
                            ...edu, 
                            content: e.target.value.split('\n').filter(line => line.trim() !== '') 
                          };
                          handleInputChange('education', updatedEducation);
                        }}
                        rows={4}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No education data extracted</p>
              )}
            </div>
          )}
        </div>
        
        {/* Skills Section */}
        <div className="border rounded-md p-4">
          <h3 
            className="font-semibold text-lg mb-4 flex justify-between cursor-pointer"
            onClick={() => toggleSection('skills')}
          >
            Skills
            <span className="text-blue-500">{expandedSection === 'skills' ? '−' : '+'}</span>
          </h3>
          
          {expandedSection === 'skills' && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Enter one skill per line</p>
              <textarea
                                        value={Array.isArray(editedData.skills) 
                          ? (editedData.skills || []).join('\n')
                          : [
                              ...(editedData.skills?.technical || []),
                              ...(editedData.skills?.soft || []),
                              ...(editedData.skills?.tools || []),
                              ...(editedData.skills?.industry || [])
                            ].join('\n')
                        }
                onChange={e => {
                  const skills = e.target.value
                    .split('\n')
                    .map(skill => skill.trim())
                    .filter(skill => skill !== '');
                  
                  handleInputChange('skills', skills);
                }}
                rows={4}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your skills"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <FaCheck className="mr-2" />
              Confirm & Create CV
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default PDFExtractReview 