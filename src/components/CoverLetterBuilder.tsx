'use client'

import React, { useState } from 'react'
import { FaFileAlt, FaMagic, FaSave, FaEye, FaDownload, FaPlus, FaTrash, FaFilePdf, FaFileWord } from 'react-icons/fa'
import { CVData } from '@/types/cv'
import { useLocale } from '@/context/LocaleContext'
import GenerateLetterModal from './GenerateLetterModal'
import { useModalContext } from '@/components/providers/ModalProvider'

interface CoverLetter {
  id: string
  title: string
  company: string
  position: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface CoverLetterBuilderProps {
  cvData: CVData
  onSave: (coverLetter: CoverLetter) => void
}

export default function CoverLetterBuilder({ cvData, onSave }: CoverLetterBuilderProps) {
  const { t } = useLocale()
  const { showAlert } = useModalContext()
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [activeLetter, setActiveLetter] = useState<CoverLetter | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [positionTitle, setPositionTitle] = useState('')

  const generateCoverLetter = async (company: string, position: string) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData,
          company,
          position
        })
      })

      if (response.ok) {
        const data = await response.json()
        const newLetter: CoverLetter = {
          id: Date.now().toString(),
          title: `Cover Letter - ${position} at ${company}`,
          company,
          position,
          content: data.content,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        setCoverLetters(prev => [...prev, newLetter])
        setActiveLetter(newLetter)
        onSave(newLetter)
      } else {
        // Handle non-ok responses
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Cover letter generation failed:', errorData)
        alert(`Failed to generate cover letter: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error generating cover letter:', error)
      alert(`Error generating cover letter: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const updateLetterContent = (content: string) => {
    if (activeLetter) {
      const updated = { ...activeLetter, content, updatedAt: new Date() }
      setActiveLetter(updated)
      setCoverLetters(prev => prev.map(l => l.id === activeLetter.id ? updated : l))
    }
  }

  const deleteLetter = (id: string) => {
    setCoverLetters(prev => prev.filter(l => l.id !== id))
    if (activeLetter?.id === id) {
      setActiveLetter(null)
    }
  }

  const exportLetter = async (letter: CoverLetter, format: 'pdf' | 'docx' = 'pdf') => {
    try {
      // Create letter data structure that matches the letter builder format
      const letterData = {
        senderName: cvData.fullName,
        senderTitle: cvData.title,
        senderEmail: cvData.contact?.email,
        senderPhone: cvData.contact?.phone,
        senderAddress: cvData.contact?.location,
        recipientName: 'Hiring Manager',
        companyName: letter.company,
        subject: `Application for ${letter.position} position`,
        opening: `I am writing to express my strong interest in the ${letter.position} position at ${letter.company}.`,
        body: [letter.content],
        closing: `I am excited about the opportunity to contribute to ${letter.company} and would welcome the chance to discuss how my skills and experience align with your needs.`,
        signature: cvData.fullName,
        template: 'professional',
        layout: {
          showDate: true,
          showAddress: true,
          showSubject: true
        },
        applicationDate: new Date().toISOString().split('T')[0]
      }

      const response = await fetch('/api/letter-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          letterData,
          format
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate ${format.toUpperCase()}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${letter.title}-${letter.company}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
      showAlert(`Failed to export ${format.toUpperCase()}`, 'Export Error')
    }
  }

  const handleGenerateConfirm = (company: string, position: string) => {
    generateCoverLetter(company, position)
    setShowGenerateModal(false)
    setCompanyName('')
    setPositionTitle('')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FaFileAlt className="text-blue-500 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Cover Letter Builder</h3>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FaEye />
          <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Letter List */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Your Cover Letters</h4>
            <button
              onClick={() => setShowGenerateModal(true)}
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FaPlus />
              )}
              <span>Generate New Letter</span>
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {coverLetters.map(letter => (
              <div
                key={letter.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  activeLetter?.id === letter.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setActiveLetter(letter)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">{letter.title}</h5>
                    <p className="text-sm text-gray-500">{letter.company}</p>
                    <p className="text-xs text-gray-400">
                      {letter.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteLetter(letter.id)
                    }}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Editor/Preview */}
        <div className="lg:col-span-2">
          {activeLetter ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{activeLetter.title}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportLetter(activeLetter, 'pdf')}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    <FaFilePdf />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => exportLetter(activeLetter, 'docx')}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    <FaFileWord />
                    <span>Word</span>
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-gray-900 font-mono text-sm">
                    {activeLetter.content}
                  </div>
                </div>
              ) : (
                <textarea
                  value={activeLetter.content}
                  onChange={(e) => updateLetterContent(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your cover letter content will appear here..."
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-center">
                <FaFileAlt className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">Select a cover letter or generate a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Cover letters are automatically generated based on your CV data and tailored to the specific company and position. 
          Always review and customize the content before sending.
        </p>
      </div>

      {/* Generate New Letter Modal */}
      <GenerateLetterModal
        isOpen={showGenerateModal}
        onClose={() => {
          setShowGenerateModal(false)
          setCompanyName('')
          setPositionTitle('')
        }}
        onConfirm={handleGenerateConfirm}
        companyName={companyName}
        positionTitle={positionTitle}
        onCompanyChange={setCompanyName}
        onPositionChange={setPositionTitle}
      />
    </div>
  )
} 