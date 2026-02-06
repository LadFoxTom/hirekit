'use client'

import React, { useState, useRef, useCallback } from 'react'
import { FiUpload, FiX, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { useLocale } from '@/context/LocaleContext'
import PDFExtractReview from './PDFExtractReview'
import { CVData } from '@/types/cv'
import toast from 'react-hot-toast'

interface CVUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onCVCreated: (cvId: string, cvData: CVData) => void
}

type UploadState = 'idle' | 'uploading' | 'extracting' | 'reviewing' | 'saving' | 'success' | 'error'

// Translations
const MODAL_TEXT = {
  title: {
    en: 'Upload CV',
    nl: 'CV Uploaden',
    es: 'Subir CV',
    de: 'Lebenslauf Hochladen',
    fr: 'Télécharger CV'
  },
  dropzone: {
    en: 'Drag and drop your CV here, or click to browse',
    nl: 'Sleep je CV hierheen, of klik om te bladeren',
    es: 'Arrastra y suelta tu CV aquí, o haz clic para buscar',
    de: 'Ziehen Sie Ihren Lebenslauf hierher, oder klicken Sie zum Durchsuchen',
    fr: 'Glissez-déposez votre CV ici, ou cliquez pour parcourir'
  },
  formats: {
    en: 'PDF or Word documents supported (max 10MB)',
    nl: 'PDF of Word documenten ondersteund (max 10MB)',
    es: 'Documentos PDF o Word compatibles (máx. 10MB)',
    de: 'PDF- oder Word-Dokumente unterstützt (max. 10MB)',
    fr: 'Documents PDF ou Word pris en charge (max 10Mo)'
  },
  uploading: {
    en: 'Uploading...',
    nl: 'Uploaden...',
    es: 'Subiendo...',
    de: 'Hochladen...',
    fr: 'Téléchargement...'
  },
  extracting: {
    en: 'Extracting CV data...',
    nl: 'CV-gegevens extraheren...',
    es: 'Extrayendo datos del CV...',
    de: 'Lebenslaufdaten extrahieren...',
    fr: 'Extraction des données du CV...'
  },
  saving: {
    en: 'Saving your CV...',
    nl: 'Je CV opslaan...',
    es: 'Guardando tu CV...',
    de: 'Ihren Lebenslauf speichern...',
    fr: 'Enregistrement de votre CV...'
  },
  success: {
    en: 'CV uploaded successfully!',
    nl: 'CV succesvol geüpload!',
    es: '¡CV subido con éxito!',
    de: 'Lebenslauf erfolgreich hochgeladen!',
    fr: 'CV téléchargé avec succès!'
  },
  error: {
    en: 'Upload failed',
    nl: 'Upload mislukt',
    es: 'Subida fallida',
    de: 'Hochladen fehlgeschlagen',
    fr: 'Échec du téléchargement'
  },
  tryAgain: {
    en: 'Try Again',
    nl: 'Opnieuw Proberen',
    es: 'Intentar de Nuevo',
    de: 'Erneut Versuchen',
    fr: 'Réessayer'
  },
  fileTooLarge: {
    en: 'File is too large. Maximum size is 10MB.',
    nl: 'Bestand is te groot. Maximale grootte is 10MB.',
    es: 'El archivo es demasiado grande. El tamaño máximo es 10MB.',
    de: 'Datei ist zu groß. Maximale Größe ist 10MB.',
    fr: 'Le fichier est trop volumineux. La taille maximale est de 10Mo.'
  },
  invalidType: {
    en: 'Please upload a PDF or Word document.',
    nl: 'Upload een PDF of Word document.',
    es: 'Por favor, sube un documento PDF o Word.',
    de: 'Bitte laden Sie ein PDF- oder Word-Dokument hoch.',
    fr: 'Veuillez télécharger un document PDF ou Word.'
  }
}

export default function CVUploadModal({ isOpen, onClose, onCVCreated }: CVUploadModalProps) {
  const { language } = useLocale()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [extractedData, setExtractedData] = useState<Partial<CVData> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)

  const getText = (key: keyof typeof MODAL_TEXT) =>
    MODAL_TEXT[key][language as keyof typeof MODAL_TEXT.title] || MODAL_TEXT[key].en

  const handleClose = useCallback(() => {
    setUploadState('idle')
    setExtractedData(null)
    setError(null)
    setFileName('')
    setIsDragOver(false)
    onClose()
  }, [onClose])

  const processFile = async (file: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    const isValidType = validTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.name.toLowerCase().endsWith('.docx')

    if (!isValidType) {
      toast.error(getText('invalidType'))
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(getText('fileTooLarge'))
      return
    }

    setFileName(file.name)
    setError(null)
    setUploadState('uploading')

    try {
      // Step 1: Extract text from document
      const formData = new FormData()
      formData.append('file', file)

      const extractResponse = await fetch('/api/extract-document', {
        method: 'POST',
        body: formData,
      })

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json()
        throw new Error(errorData.error || 'Failed to extract document text')
      }

      const { extractedText } = await extractResponse.json()

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('Could not extract text from the document. Please try a different file.')
      }

      setUploadState('extracting')

      // Step 2: Parse CV data from extracted text
      const parseResponse = await fetch('/api/pdf-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfText: extractedText }),
      })

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json()
        throw new Error(errorData.error || 'Failed to parse CV data')
      }

      const { extractedData: parsedData } = await parseResponse.json()
      setExtractedData(parsedData || {})
      setUploadState('reviewing')

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setUploadState('error')
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleConfirmData = async (data: Partial<CVData>) => {
    setUploadState('saving')

    try {
      // Save to database
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.fullName || 'Uploaded CV',
          content: data,
          template: 'modern',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save CV')
      }

      const { cv } = await response.json()
      setUploadState('success')
      toast.success(getText('success'))

      // Notify parent with new CV
      setTimeout(() => {
        onCVCreated(cv.id, data as CVData)
        handleClose()
      }, 1000)

    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Save failed')
      setUploadState('error')
    }
  }

  const handleCancelReview = () => {
    setUploadState('idle')
    setExtractedData(null)
    setFileName('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {getText('title')}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}>
          {uploadState === 'idle' && (
            <div className="text-center py-8">
              <div
                className={`border-2 border-dashed rounded-xl p-12 cursor-pointer transition-colors ${isDragOver ? 'border-blue-400 bg-blue-500/10' : ''
                  }`}
                style={{
                  borderColor: isDragOver ? undefined : 'var(--border-medium)',
                  backgroundColor: isDragOver ? undefined : 'var(--bg-secondary)'
                }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FiUpload size={48} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {getText('dropzone')}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {getText('formats')}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {(uploadState === 'uploading' || uploadState === 'extracting' || uploadState === 'saving') && (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                {uploadState === 'uploading' && getText('uploading')}
                {uploadState === 'extracting' && getText('extracting')}
                {uploadState === 'saving' && getText('saving')}
              </p>
              {fileName && (
                <p className="text-sm mt-2 flex items-center justify-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                  <FiFile size={14} />
                  {fileName}
                </p>
              )}
            </div>
          )}

          {uploadState === 'reviewing' && extractedData && (
            <PDFExtractReview
              extractedData={extractedData}
              onConfirm={handleConfirmData}
              onCancel={handleCancelReview}
            />
          )}

          {uploadState === 'success' && (
            <div className="text-center py-16">
              <FiCheckCircle size={48} className="mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium text-green-500">
                {getText('success')}
              </p>
            </div>
          )}

          {uploadState === 'error' && (
            <div className="text-center py-16">
              <FiAlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <p className="text-lg font-medium text-red-500 mb-2">
                {getText('error')}
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                {error}
              </p>
              <button
                onClick={() => setUploadState('idle')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {getText('tryAgain')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
