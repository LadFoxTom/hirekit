'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { pdf } from '@react-pdf/renderer'
import { LetterDocumentPDF } from './LetterDocumentPDF'
import { LetterData as BaseLetterData } from '@/types/letter'
import { LETTER_TEMPLATES } from '@/data/letterTemplates'
import {
  FiDownload, FiZoomIn, FiZoomOut,
  FiLayout, FiCheck, FiLock
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebouncedCallback } from 'use-debounce'
import { useSubscription } from '@/hooks/useSubscription'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/context/LocaleContext'
import { toast } from 'react-hot-toast'

// Import react-pdf for rendering PDF on mobile
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up PDF.js worker for react-pdf
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

// Detect mobile device
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(navigator.userAgent)
}

// Extended LetterData that accepts body as string or string[] (for compatibility with page.tsx)
interface LetterDataInput extends Omit<BaseLetterData, 'body'> {
  body?: string | string[]
}

// Normalize body to string array
const normalizeBody = (body: string | string[] | undefined): string[] => {
  if (!body) return []
  if (Array.isArray(body)) return body
  // Split string by double newlines into paragraphs
  return body.split('\n\n').filter(p => p.trim().length > 0)
}

// Check if there's meaningful content
const hasContent = (data: LetterDataInput): boolean => {
  const body = normalizeBody(data.body)
  return body.length > 0 && body.some(p => p.trim().length > 0)
}

// Create stable data signature for comparison
const getDataSignature = (data: LetterDataInput): string => {
  try {
    return JSON.stringify({
      recipientName: data.recipientName,
      recipientTitle: data.recipientTitle,
      companyName: data.companyName,
      companyAddress: data.companyAddress,
      senderName: data.senderName,
      senderTitle: data.senderTitle,
      senderAddress: data.senderAddress,
      senderEmail: data.senderEmail,
      senderPhone: data.senderPhone,
      subject: data.subject,
      opening: data.opening,
      body: data.body,
      closing: data.closing,
      signature: data.signature,
      jobTitle: data.jobTitle,
      template: data.template,
      applicationDate: data.applicationDate,
    })
  } catch {
    return ''
  }
}

interface LetterPreviewViewerProps {
  data: LetterDataInput
  onDataChange?: (data: LetterDataInput) => void
  onDownload?: () => void
  className?: string
  showControls?: boolean
  externalZoom?: number
}

export const LetterPreviewViewer: React.FC<LetterPreviewViewerProps> = ({
  data,
  onDataChange,
  onDownload,
  className = '',
  showControls = true,
  externalZoom,
}) => {
  const router = useRouter()
  const { language } = useLocale()
  const { hasFeature, loading: subscriptionLoading } = useSubscription()
  const canDownloadPDF = hasFeature('pdf_export')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [internalZoom, setInternalZoom] = useState(0.75)
  const zoom = externalZoom !== undefined ? externalZoom : internalZoom
  const setZoom = setInternalZoom
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  const currentTemplate = data.template || 'professional'

  // Create stable data signature
  const dataSignature = useMemo(() => getDataSignature(data), [data])
  const previousSignatureRef = useRef<string>('')

  // Normalize data for PDF generation (ensure body is string[])
  const normalizedData = useMemo((): BaseLetterData => ({
    ...data,
    body: normalizeBody(data.body),
  }), [data])

  // Debounced PDF generation
  const generatePDF = useDebouncedCallback(async () => {
    // Check if there's any meaningful content
    if (!hasContent(data)) {
      setPdfUrl(null)
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const blob = await pdf(<LetterDocumentPDF data={normalizedData} language={language} />).toBlob()
      const url = URL.createObjectURL(blob)

      // Clean up previous URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }

      setPdfUrl(url)
    } catch (err) {
      console.error('Letter PDF generation error:', err)
      setError('Failed to generate letter preview')
    } finally {
      setIsGenerating(false)
    }
  }, 300)

  // Regenerate PDF when data changes
  useEffect(() => {
    if (previousSignatureRef.current === dataSignature) {
      return
    }

    previousSignatureRef.current = dataSignature
    generatePDF()

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [dataSignature, generatePDF, pdfUrl])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(2, prev + 0.25))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.25))
  }

  const handleDownload = useCallback(async () => {
    if (!data) return

    // Check subscription before allowing download
    if (!canDownloadPDF) {
      toast.error('PDF download is a premium feature. Please upgrade to download your letter.')
      router.push('/pricing')
      return
    }

    setIsDownloading(true)

    try {
      const blob = await pdf(<LetterDocumentPDF data={normalizedData} language={language} />).toBlob()
      const url = URL.createObjectURL(blob)
      const fileName = `${data.companyName?.replace(/\s+/g, '_') || 'Motivation'}_Letter.pdf`

      if (isMobile) {
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(url), 5000)
      } else {
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      toast.success('Letter downloaded successfully!')
      if (onDownload) onDownload()
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Failed to download letter')
    } finally {
      setIsDownloading(false)
    }
  }, [data, normalizedData, onDownload, isMobile, canDownloadPDF, router, language])

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        template: templateId,
      })
    }
    setShowTemplatePicker(false)
  }

  // Empty state
  if (!hasContent(data)) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-100 dark:bg-[#1a1a1a] rounded-xl ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Start typing to build your letter
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Your letter will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full bg-gray-100 dark:bg-[#0d0d0d] rounded-xl overflow-hidden ${className}`} style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Controls */}
      {showControls && (
        <div className="flex flex-col bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center justify-between px-4 py-2">
            {/* Template Picker */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
                >
                  <FiLayout size={14} className="text-gray-700 dark:text-gray-300" />
                  <span className="hidden sm:inline capitalize">{currentTemplate}</span>
                </button>

                {/* Template dropdown */}
                <AnimatePresence>
                  {showTemplatePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-2 border-b border-gray-100 dark:border-white/5">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">Letter Templates</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto p-2">
                        {LETTER_TEMPLATES.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => handleTemplateChange(template.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              currentTemplate === template.id
                                ? 'bg-blue-50 dark:bg-blue-500/10'
                                : 'hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg ${template.preview} flex-shrink-0`} />
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{template.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{template.description}</div>
                            </div>
                            {currentTemplate === template.id && (
                              <FiCheck size={14} className="text-blue-500 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Zoom controls - hidden on mobile */}
            <div className={`items-center gap-1 ${isMobile ? 'hidden' : 'flex'}`}>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors text-gray-700 dark:text-gray-300"
              >
                <FiZoomOut size={16} />
              </button>
              <span className="text-xs text-gray-700 dark:text-gray-300 min-w-[50px] text-center font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 2}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors text-gray-700 dark:text-gray-300"
              >
                <FiZoomIn size={16} />
              </button>
            </div>

            {/* Download Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={isDownloading || subscriptionLoading || !canDownloadPDF}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-70 ${
                  canDownloadPDF
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    : 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed'
                }`}
                title={!canDownloadPDF ? 'Upgrade to download PDF' : 'Download PDF'}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Preparing...</span>
                  </>
                ) : !canDownloadPDF ? (
                  <>
                    <FiLock size={14} />
                    <span className="hidden sm:inline">Upgrade to Download</span>
                  </>
                ) : (
                  <>
                    <FiDownload size={14} />
                    <span className="hidden sm:inline">Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Area */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          {isGenerating && !isMobile ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Generating preview...</p>
            </motion.div>
          ) : error && !isMobile ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => generatePDF()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </motion.div>
          ) : isMobile && pdfUrl ? (
            /* Mobile: Render PDF using react-pdf */
            <motion.div
              key="mobile-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full pb-20"
            >
              <div className="relative bg-white rounded-lg shadow-lg mx-auto" style={{ maxWidth: '100%', width: 'fit-content' }}>
                <Document
                  file={pdfUrl}
                  loading={
                    <div className="flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                  error={
                    <div className="p-8 text-center text-gray-500">
                      <p>Could not load preview</p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={1}
                    width={Math.min(window.innerWidth - 32, 400)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>

                {/* Upgrade overlay for free users */}
                {!canDownloadPDF && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-20 rounded-b-lg">
                    <div className="text-center text-white">
                      <FiLock size={24} className="mx-auto mb-2" />
                      <p className="font-medium mb-1">Preview Only</p>
                      <p className="text-sm text-white/80">Upgrade to download your letter</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile download section - only show if controls are enabled */}
              {showControls && (
                <div className="mt-4 px-4 pb-4" style={{ maxWidth: '100%', width: '100%' }}>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || subscriptionLoading}
                    className={`w-full flex items-center justify-center gap-2 py-4 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-70 ${
                      canDownloadPDF
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Preparing PDF...</span>
                      </>
                    ) : !canDownloadPDF ? (
                      <>
                        <FiLock size={20} />
                        <span>Upgrade to Download PDF</span>
                      </>
                    ) : (
                      <>
                        <FiDownload size={20} />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {canDownloadPDF
                      ? 'Your letter will be downloaded as a professional PDF'
                      : 'Upgrade to a premium plan to download your letter as PDF'
                    }
                  </p>
                </div>
              )}
            </motion.div>
          ) : isMobile && isGenerating ? (
            /* Mobile loading state */
            <motion.div
              key="mobile-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 w-full"
            >
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Generating preview...</p>
            </motion.div>
          ) : pdfUrl ? (
            /* Desktop: Show PDF iframe */
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
              }}
            >
              {/* A4 Page Container */}
              <div
                className="bg-white shadow-2xl rounded-sm overflow-hidden"
                style={{
                  width: '595px', // A4 width in points
                  minHeight: '842px', // A4 height in points
                  maxWidth: '100%',
                }}
              >
                {/* Embed PDF using iframe */}
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-0"
                  style={{ minHeight: '842px' }}
                  title="Letter Preview"
                />
              </div>

              {/* Page shadow effect */}
              <div className="absolute inset-0 pointer-events-none rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)]" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Quick stats footer - only show if controls are enabled */}
      {showControls && hasContent(data) && (
        <div className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>
            {normalizeBody(data.body).length} paragraphs • Template: {currentTemplate}
          </span>
          <span className="text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Ready to download
          </span>
        </div>
      )}
    </div>
  )
}

export default LetterPreviewViewer
